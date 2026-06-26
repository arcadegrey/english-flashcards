import argparse
import hashlib
import json
import os
import shutil
import subprocess
import tempfile
import time
from pathlib import Path
from typing import Any, Dict, Iterable, List

import numpy as np
import soundfile as sf
from kokoro import KPipeline


PROJECT_ROOT = Path(__file__).resolve().parents[1]
VOCABULARY_PATH = PROJECT_ROOT / "public/data/vocabulary.json"
OUTPUT_ROOT = PROJECT_ROOT / "public/audio/words"
MANIFEST_PATH = OUTPUT_ROOT / "manifest.json"
DEFAULT_VOICES = ["af_bella", "am_michael", "bf_emma", "bm_george"]
DEFAULT_REPO_ID = os.environ.get("KOKORO_REPO_ID", "hexgrad/Kokoro-82M")
SAMPLE_RATE = 24000


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate compact Kokoro MP3 word audio.")
    parser.add_argument("--voices", default=",".join(DEFAULT_VOICES), help="Comma-separated Kokoro voice ids.")
    parser.add_argument("--limit", type=int, default=0, help="Only generate the first N words per voice.")
    parser.add_argument("--start", type=int, default=0, help="Start offset in vocabulary list.")
    parser.add_argument("--force", action="store_true", help="Regenerate files that already exist.")
    parser.add_argument("--bitrate", default="24", help="MP3 bitrate in kbps. Default: 24.")
    parser.add_argument("--output-root", default=str(OUTPUT_ROOT), help="Output root for word audio.")
    parser.add_argument("--dry-run", action="store_true", help="Print missing files without generating audio.")
    return parser.parse_args()


def load_vocabulary() -> List[Dict[str, Any]]:
    with VOCABULARY_PATH.open("r", encoding="utf-8") as file:
        data = json.load(file)
    return [item for item in data if item.get("id") is not None and str(item.get("word", "")).strip()]


def lang_code_for_voice(voice: str) -> str:
    normalized = voice.strip().lower()
    if normalized.startswith(("bf_", "bm_")):
        return "b"
    return "a"


def get_pipeline(lang_code: str, pipelines: Dict[str, KPipeline]) -> KPipeline:
    if lang_code not in pipelines:
        pipelines[lang_code] = KPipeline(lang_code=lang_code, repo_id=DEFAULT_REPO_ID)
    return pipelines[lang_code]


def synthesize_word(pipeline: KPipeline, word: str, voice: str) -> np.ndarray:
    chunks = []
    for _, _, audio in pipeline(word, voice=voice, speed=0.92):
        chunks.append(np.asarray(audio, dtype=np.float32))

    if not chunks:
        raise RuntimeError(f"Kokoro returned no audio for {word!r}")

    return np.concatenate(chunks)


def write_mp3(audio: np.ndarray, output_path: Path, bitrate: str) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory(prefix="kokoro-word-audio-") as tmp_dir:
        wav_path = Path(tmp_dir) / "source.wav"
        sf.write(wav_path, audio, SAMPLE_RATE)

        command = [
            "lame",
            "--silent",
            "-b",
            str(bitrate),
            "-m",
            "m",
            "--resample",
            "24",
            str(wav_path),
            str(output_path),
        ]
        subprocess.run(command, check=True)


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as file:
        for chunk in iter(lambda: file.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def selected_words(vocabulary: List[Dict[str, Any]], start: int, limit: int) -> Iterable[Dict[str, Any]]:
    if start > 0:
        vocabulary = vocabulary[start:]
    if limit > 0:
        vocabulary = vocabulary[:limit]
    return vocabulary


def pending_words_for_voice(
    words: List[Dict[str, Any]],
    output_root: Path,
    voice: str,
    force: bool,
) -> List[Dict[str, Any]]:
    if force:
        return words

    pending = []
    for item in words:
        output_path = output_root / voice / f"{item['id']}.mp3"
        if not output_path.exists():
            pending.append(item)
    return pending


def main() -> None:
    args = parse_args()
    output_root = Path(args.output_root)
    voices = [voice.strip() for voice in args.voices.split(",") if voice.strip()]
    if not voices:
        raise SystemExit("No voices provided.")
    if shutil.which("lame") is None:
        raise SystemExit("Missing `lame`. Install it with `brew install lame`.")

    vocabulary = load_vocabulary()
    words = list(selected_words(vocabulary, args.start, args.limit))
    pipelines: Dict[str, KPipeline] = {}
    started_at = time.time()
    failures = []
    voice_stats = {}

    pending_by_voice = {
        voice: pending_words_for_voice(words, output_root, voice, args.force)
        for voice in voices
    }
    pending_total = sum(len(items) for items in pending_by_voice.values())

    print(
        f"Generating Kokoro word audio: voices={voices}, selectedWords={len(words)}, "
        f"pendingFiles={pending_total}, bitrate={args.bitrate}kbps"
    )

    if args.dry_run:
        for voice, pending_words in pending_by_voice.items():
            print(f"[{voice}] pending={len(pending_words)}")
            for item in pending_words[:20]:
                print(f"  {item['id']}: {item['word']}")
            if len(pending_words) > 20:
                print(f"  ... {len(pending_words) - 20} more")
        return

    for voice in voices:
        pending_words = pending_by_voice[voice]
        lang_code = lang_code_for_voice(voice)
        generated = 0
        failed = 0
        total_bytes = 0
        skipped = len(words) - len(pending_words)

        if not pending_words:
            print(f"[{voice}] nothing to generate; all selected files already exist.")
            voice_stats[voice] = {
                "done": len(words),
                "generated": 0,
                "skipped": skipped,
                "failed": 0,
                "bytes": 0,
                "path": f"{voice}/{{id}}.mp3",
                "langCode": lang_code,
                "pendingOnly": True,
            }
            continue

        pipeline = get_pipeline(lang_code, pipelines)

        for index, item in enumerate(pending_words, start=1):
            word_id = str(item["id"])
            word = str(item["word"]).strip()
            output_path = output_root / voice / f"{word_id}.mp3"

            try:
                audio = synthesize_word(pipeline, word, voice)
                write_mp3(audio, output_path, args.bitrate)
                generated += 1
                total_bytes += output_path.stat().st_size
            except Exception as exc:
                failed += 1
                failures.append({"voice": voice, "id": word_id, "word": word, "error": str(exc)})

            if index == 1 or index % 100 == 0 or index == len(pending_words):
                elapsed = max(time.time() - started_at, 0.1)
                done = sum(stats.get("generated", 0) + stats.get("failed", 0) for stats in voice_stats.values()) + index
                print(
                    f"[{voice}] {index}/{len(pending_words)} generated={generated} skipped={skipped} "
                    f"failed={failed} elapsed={elapsed:.1f}s done={done}/{pending_total}",
                    flush=True,
                )

        voice_stats[voice] = {
            "done": len(words),
            "generated": generated,
            "skipped": skipped,
            "failed": failed,
            "bytes": total_bytes,
            "path": f"{voice}/{{id}}.mp3",
            "langCode": lang_code,
            "pendingOnly": not args.force,
        }

    manifest = {
        "format": "mp3",
        "bitrateKbps": int(args.bitrate),
        "sampleRate": SAMPLE_RATE,
        "pathPattern": "/audio/words/{voice}/{id}.mp3",
        "defaultVoices": voices,
        "wordCount": len(vocabulary),
        "generatedWordCount": len(words),
        "pendingFileCount": pending_total,
        "start": args.start,
        "limit": args.limit,
        "force": args.force,
        "voices": voice_stats,
        "failures": failures,
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    output_root.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    total_files = sum(stats["generated"] + stats["skipped"] for stats in voice_stats.values())
    total_bytes = sum(stats["bytes"] for stats in voice_stats.values())
    print(
        f"Done. files={total_files}, failures={len(failures)}, size={total_bytes / 1024 / 1024:.2f}MB, "
        f"manifest={MANIFEST_PATH}"
    )


if __name__ == "__main__":
    main()
