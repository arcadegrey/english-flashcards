import hashlib
import json
import os
from pathlib import Path
from typing import Any, Dict, Optional

import numpy as np
import soundfile as sf
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

try:
    from kokoro import KPipeline
except Exception as exc:  # pragma: no cover - startup guard
    KPipeline = None
    KOKORO_IMPORT_ERROR = exc
else:
    KOKORO_IMPORT_ERROR = None


DEFAULT_CACHE_DIR = Path(os.environ.get("KOKORO_TTS_CACHE_DIR", ".cache/kokoro-tts"))
DEFAULT_LANG_CODE = os.environ.get("KOKORO_LANG_CODE", "a")
DEFAULT_REPO_ID = os.environ.get("KOKORO_REPO_ID", "hexgrad/Kokoro-82M")
DEFAULT_SAMPLE_RATE = 24000

app = FastAPI(title="English Flashcards Kokoro TTS")
pipeline_by_lang: Dict[str, Any] = {}

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


class SpeechRequest(BaseModel):
    model: Optional[str] = "kokoro"
    input: Optional[str] = None
    text: Optional[str] = None
    voice: str = "af_bella"
    speed: float = Field(default=1.0, ge=0.5, le=1.5)
    lang_code: Optional[str] = None
    response_format: Optional[str] = "wav"
    format: Optional[str] = None


def get_pipeline(lang_code: str) -> Any:
    if KPipeline is None:
        raise HTTPException(
            status_code=500,
            detail=f"Kokoro is not installed or failed to import: {KOKORO_IMPORT_ERROR}",
        )

    if lang_code not in pipeline_by_lang:
        pipeline_by_lang[lang_code] = KPipeline(lang_code=lang_code, repo_id=DEFAULT_REPO_ID)

    return pipeline_by_lang[lang_code]


def pick_lang_code(req: SpeechRequest) -> str:
    if req.lang_code:
        return req.lang_code

    voice = (req.voice or "").strip().lower()
    if voice.startswith(("bf_", "bm_")):
        return "b"

    return DEFAULT_LANG_CODE


def build_cache_key(req: SpeechRequest, lang_code: str) -> str:
    payload = {
        "text": (req.input or req.text or "").strip(),
        "voice": req.voice,
        "speed": round(float(req.speed), 3),
        "lang_code": lang_code,
        "sample_rate": DEFAULT_SAMPLE_RATE,
        "format": "wav",
    }
    return hashlib.sha256(
        json.dumps(payload, ensure_ascii=False, sort_keys=True).encode("utf-8")
    ).hexdigest()


def synthesize_to_wav(req: SpeechRequest, output_path: Path, lang_code: str) -> None:
    text = (req.input or req.text or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="Missing input/text")

    pipeline = get_pipeline(lang_code)
    chunks = []

    try:
        for _, _, audio in pipeline(text, voice=req.voice, speed=float(req.speed)):
            chunks.append(np.asarray(audio, dtype=np.float32))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Kokoro synthesis failed: {exc}") from exc

    if not chunks:
        raise HTTPException(status_code=500, detail="Kokoro returned no audio")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    audio = np.concatenate(chunks)
    sf.write(output_path, audio, DEFAULT_SAMPLE_RATE)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/v1/audio/speech")
def speech(req: SpeechRequest) -> FileResponse:
    lang_code = pick_lang_code(req)
    cache_key = build_cache_key(req, lang_code)
    output_path = DEFAULT_CACHE_DIR / f"{cache_key}.wav"

    if not output_path.exists():
        synthesize_to_wav(req, output_path, lang_code)

    return FileResponse(
        output_path,
        media_type="audio/wav",
        filename=f"{cache_key}.wav",
    )


@app.post("/tts")
def tts(req: SpeechRequest) -> FileResponse:
    return speech(req)
