#!/usr/bin/env python3
"""Replace local fallback example translations with sentence translations."""

from __future__ import annotations

import json
import re
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from deep_translator import GoogleTranslator


PROJECT_ROOT = Path(__file__).resolve().parents[1]
CACHE_PATH = PROJECT_ROOT / ".tmp-google-example-translation-cache.json"
TARGETS = [
    PROJECT_ROOT / "public/data/vocabulary.json",
    PROJECT_ROOT / "public/data/vocabulary/core.json",
]
FALLBACK_RE = re.compile(r"^参考译文：这句话中的“.+?”可理解为“.+?”。$")
MAX_WORKERS = 8


def load_json(path: Path, fallback):
    if not path.exists():
        return fallback
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, value) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def translate_one(example: str) -> tuple[str, str]:
    for attempt in range(3):
        try:
            translated = GoogleTranslator(source="en", target="zh-CN").translate(example)
            translated = str(translated or "").strip()
            if translated and not translated.isascii():
                return example, translated
        except Exception:
            time.sleep(0.7 * (attempt + 1))
    return example, ""


def main() -> None:
    core = load_json(PROJECT_ROOT / "public/data/vocabulary/core.json", [])
    cache = load_json(CACHE_PATH, {})
    examples = []
    seen = set()

    for word in core:
        if not FALLBACK_RE.match(str(word.get("exampleCn", ""))):
            continue
        example = str(word.get("example", "")).strip()
        if not example or example in seen or example in cache:
            continue
        seen.add(example)
        examples.append(example)

    completed = 0
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = [executor.submit(translate_one, example) for example in examples]
        for future in as_completed(futures):
            example, translated = future.result()
            if translated:
                cache[example] = translated
            completed += 1
            if completed % 50 == 0:
                write_json(CACHE_PATH, cache)
                print(f"translated {completed}/{len(examples)} examples...")

    write_json(CACHE_PATH, cache)

    results = {}
    for target in TARGETS:
        vocabulary = load_json(target, [])
        updated = 0
        for word in vocabulary:
            if not FALLBACK_RE.match(str(word.get("exampleCn", ""))):
                continue
            example = str(word.get("example", "")).strip()
            translated = cache.get(example)
            if not translated:
                continue
            word["exampleCn"] = translated
            updated += 1
        write_json(target, vocabulary)
        results[str(target.relative_to(PROJECT_ROOT))] = updated

    print(json.dumps({
        "requested": len(examples),
        "cacheSize": len(cache),
        "updated": results,
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
