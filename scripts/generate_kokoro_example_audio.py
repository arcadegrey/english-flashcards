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
OUTPUT_ROOT = PROJECT_ROOT / "public/audio/examples"
DEFAULT_VOICES = ["af_bella", "am_michael", "bf_emma", "bm_george"]
DEFAULT_REPO_ID = os.environ.get("KOKORO_REPO_ID", "hexgrad/Kokoro-82M")
SAMPLE_RATE = 24000


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate compact Kokoro MP3 example sentence audio.")
    parser.add_argument("--voices", default=",".join(DEFAULT_VOICES), help="Comma-separated Kokoro voice ids.")
    parser.add_argument("--limit", type=int, default=0, help="Only generate the first N examples per voice.")
    parser.add_argument("--start", type=int, default=0, help="Start offset in the example list.")
    parser.add_argument("--force", action="store_true", help="Regenerate files that already exist.")
    parser.add_argument("--bitrate", default="24", help="MP3 bitrate in kbps. Default: 24.")
    parser.add_argument("--speed", type=float, default=0.96, help="Kokoro speed for sentence audio. Default: 0.96.")
    parser.add_argument("--output-root", default=str(OUTPUT_ROOT), help="Output root for example audio.")
    parser.add_argument("--dry-run", action="store_true", help="Print selected examples without generating audio.")
    return parser.parse_args()


def normalize_sentence(value: Any) -> str:
    return " ".join(str(value or "").replace("\n", " ").split()).strip()


def load_examples() -> List[Dict[str, Any]]:
    with VOCABULARY_PATH.open("r", encoding="utf-8") as file:
        data = json.load(file)

    examples = []
    for item in data:
        word_id = item.get("id")
        word = str(item.get("word", "")).strip()
        example = normalize_sentence(item.get("example", ""))
        if word_id is None or not word or not example:
            continue
        examples.append(
            {
                "id": str(word_id).strip(),
                "word": word,
                "example": example,
            }
        )
    return examples


def lang_code_for_voice(voice: str) -> str:
    normalized = voice.strip().lower()
    if normalized.startswith(("bf_", "bm_")):
        return "b"
    return "a"


def get_pipeline(lang_code: str, pipelines: Dict[str, KPipeline]) -> KPipeline:
    if lang_code not in pipelines:
        pipelines[lang_code] = KPipeline(lang_code=lang_code, repo_id=DEFAULT_REPO_ID)
    return pipelines[lang_code]


def synthesize_sentence(pipeline: KPipeline, sentence: str, voice: str, speed: float) -> np.ndarray:
    chunks = []
    for _, _, audio in pipeline(sentence, voice=voice, speed=speed):
        chunks.append(np.asarray(audio, dtype=np.float32))

    if not chunks:
        raise RuntimeError(f"Kokoro returned no audio for {sentence!r}")

    return np.concatenate(chunks)


def write_mp3(audio: np.ndarray, output_path: Path, bitrate: str) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory(prefix="kokoro-example-audio-") as tmp_dir:
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


def selected_examples(examples: List[Dict[str, Any]], start: int, limit: int) -> Iterable[Dict[str, Any]]:
    if start > 0:
        examples = examples[start:]
    if limit > 0:
        examples = examples[:limit]
    return examples


def pending_examples_for_voice(
    examples: List[Dict[str, Any]],
    output_root: Path,
    voice: str,
    force: bool,
) -> List[Dict[str, Any]]:
    if force:
        return examples

    pending = []
    for item in examples:
        output_path = output_root / voice / f"{item['id']}.mp3"
        if not output_path.exists():
            pending.append(item)
    return pending


def load_existing_manifest(manifest_path: Path) -> Dict[str, Any]:
    if not manifest_path.exists():
        return {}

    try:
        with manifest_path.open("r", encoding="utf-8") as file:
            data = json.load(file)
        return data if isinstance(data, dict) else {}
    except (OSError, json.JSONDecodeError):
        return {}


def merge_voice_order(existing_manifest: Dict[str, Any], generated_voices: List[str]) -> List[str]:
    ordered = []
    for voice in existing_manifest.get("defaultVoices", []):
        if voice not in ordered:
            ordered.append(voice)
    for voice in generated_voices:
        if voice not in ordered:
            ordered.append(voice)
    return ordered


def main() -> None:
    args = parse_args()
    output_root = Path(args.output_root)
    manifest_path = output_root / "manifest.json"
    voices = [voice.strip() for voice in args.voices.split(",") if voice.strip()]
    if not voices:
        raise SystemExit("No voices provided.")
    if shutil.which("lame") is None:
        raise SystemExit("Missing `lame`. Install it with `brew install lame`.")
    if args.speed <= 0:
        raise SystemExit("--speed must be greater than 0.")

    all_examples = load_examples()
    examples = list(selected_examples(all_examples, args.start, args.limit))

    pending_by_voice = {
        voice: pending_examples_for_voice(examples, output_root, voice, args.force)
        for voice in voices
    }
    pending_total = sum(len(items) for items in pending_by_voice.values())

    print(
        f"Generating Kokoro example audio: voices={voices}, selectedExamples={len(examples)}, "
        f"pendingFiles={pending_total}, bitrate={args.bitrate}kbps, speed={args.speed}"
    )

    if args.dry_run:
        for voice, pending_examples in pending_by_voice.items():
            print(f"[{voice}] pending={len(pending_examples)}")
            for item in pending_examples[:20]:
                print(f"  {item['id']}: {item['word']} -> {item['example']}")
            if len(pending_examples) > 20:
                print(f"  ... {len(pending_examples) - 20} more")
        return

    existing_manifest = load_existing_manifest(manifest_path)
    existing_voice_stats = existing_manifest.get("voices", {})
    if not isinstance(existing_voice_stats, dict):
        existing_voice_stats = {}

    pipelines: Dict[str, KPipeline] = {}
    started_at = time.time()
    failures = []
    voice_stats = dict(existing_voice_stats)

    for voice in voices:
        pending_examples = pending_by_voice[voice]
        lang_code = lang_code_for_voice(voice)
        generated = 0
        failed = 0
        total_bytes = 0
        example_hashes = {}
        skipped = len(examples) - len(pending_examples)

        if not pending_examples:
            print(f"[{voice}] nothing to generate; all selected files already exist.")
            voice_stats[voice] = {
                **voice_stats.get(voice, {}),
                "done": len(examples),
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

        for index, item in enumerate(pending_examples, start=1):
            word_id = item["id"]
            sentence = item["example"]
            output_path = output_root / voice / f"{word_id}.mp3"
            example_hashes[word_id] = hashlib.sha256(sentence.encode("utf-8")).hexdigest()

            try:
                audio = synthesize_sentence(pipeline, sentence, voice, args.speed)
                write_mp3(audio, output_path, args.bitrate)
                generated += 1
                total_bytes += output_path.stat().st_size
            except Exception as exc:
                failed += 1
                failures.append(
                    {
                        "voice": voice,
                        "id": word_id,
                        "word": item["word"],
                        "example": sentence,
                        "error": str(exc),
                    }
                )

            if index == 1 or index % 50 == 0 or index == len(pending_examples):
                elapsed = max(time.time() - started_at, 0.1)
                done = sum(
                    stats.get("currentGenerated", 0) + stats.get("currentFailed", 0)
                    for stats in voice_stats.values()
                ) + index
                print(
                    f"[{voice}] {index}/{len(pending_examples)} generated={generated} skipped={skipped} "
                    f"failed={failed} elapsed={elapsed:.1f}s done={done}/{pending_total}",
                    flush=True,
                )

        voice_stats[voice] = {
            "done": len(examples),
            "generated": generated,
            "skipped": skipped,
            "failed": failed,
            "bytes": total_bytes,
            "path": f"{voice}/{{id}}.mp3",
            "langCode": lang_code,
            "exampleHashes": example_hashes,
            "pendingOnly": not args.force,
            "currentGenerated": generated,
            "currentSkipped": skipped,
            "currentFailed": failed,
        }

    manifest = {
        "format": "mp3",
        "bitrateKbps": int(args.bitrate),
        "sampleRate": SAMPLE_RATE,
        "pathPattern": "/audio/examples/{voice}/{id}.mp3",
        "defaultVoices": merge_voice_order(existing_manifest, voices),
        "totalExampleCount": len(all_examples),
        "generatedExampleCount": len(examples),
        "pendingFileCount": pending_total,
        "start": args.start,
        "limit": args.limit,
        "force": args.force,
        "speed": args.speed,
        "voices": voice_stats,
        "failures": failures,
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    output_root.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    current_voice_stats = {voice: voice_stats.get(voice, {}) for voice in voices}
    total_files = sum(
        stats.get("currentGenerated", stats.get("generated", 0))
        + stats.get("currentSkipped", stats.get("skipped", 0))
        for stats in current_voice_stats.values()
    )
    total_bytes = sum(stats.get("bytes", 0) for stats in current_voice_stats.values())
    print(
        f"Done. files={total_files}, failures={len(failures)}, size={total_bytes / 1024 / 1024:.2f}MB, "
        f"manifest={manifest_path}"
    )

    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
