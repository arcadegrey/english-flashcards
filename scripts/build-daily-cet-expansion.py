#!/usr/bin/env python3
"""Build the curated Daily/CET4/CET6 import CSV from ECDICT.

The raw ECDICT file is intentionally not committed. Download the MIT-licensed
repository archive to /tmp/ecdict.zip, then run this script to generate the
small product import CSV.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import zipfile
from pathlib import Path

from nltk.corpus import wordnet as wn


PROJECT_ROOT = Path(__file__).resolve().parents[1]
VOCABULARY_PATH = PROJECT_ROOT / "public/data/vocabulary.json"
OUTPUT_PATH = PROJECT_ROOT / "data/daily_cet_expansion.csv"

FIELDNAMES = [
    "word",
    "phonetic",
    "pos",
    "meaning",
    "example",
    "exampleCn",
    "category",
    "level",
    "list",
]

TARGETS = {
    "daily_only": 750,
    "daily_cet4": 1050,
    "cet4_cet6": 977,
    "cet6_only": 523,
}

BAD_WORDS = {
    "arse",
    "asshole",
    "bastard",
    "bitch",
    "bollocks",
    "crap",
    "damn",
    "dick",
    "fuck",
    "fucking",
    "shit",
    "slut",
    "whore",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--ecdict-zip",
        default="/tmp/ecdict.zip",
        help="Path to ECDICT GitHub archive zip.",
    )
    parser.add_argument(
        "--output",
        default=str(OUTPUT_PATH),
        help="Output CSV path.",
    )
    return parser.parse_args()


def safe_int(value: str | None) -> int:
    try:
        return int(value or 0)
    except ValueError:
        return 0


def rank_value(row: dict[str, str]) -> int:
    ranks = [value for value in (safe_int(row.get("frq")), safe_int(row.get("bnc"))) if value > 0]
    return min(ranks) if ranks else 999999


def normalize_word(value: str) -> str:
    return str(value or "").strip().lower()


def is_valid_word(word: str) -> bool:
    if not re.fullmatch(r"[a-z]{3,14}", word):
        return False
    if word in BAD_WORDS:
        return False
    if len(set(word)) <= 2 and len(word) > 5:
        return False
    return True


def has_cjk(text: str) -> bool:
    return bool(re.search(r"[\u4e00-\u9fff]", text or ""))


def clean_translation(value: str) -> str:
    text = str(value or "").replace("\\r", "\n").strip()
    lines = []
    for line in text.splitlines():
        item = line.strip()
        if not item or item.startswith("[网络]") or item.startswith("[例句]"):
            continue
        item = re.sub(r"^\[[^\]]+\]\s*", "", item)
        item = re.sub(r"\s+", " ", item)
        if has_cjk(item):
            lines.append(item)
        if len(lines) >= 2:
            break
    if not lines:
        return ""
    meaning = "；".join(lines)
    return meaning[:120].rstrip("；,， ")


def normalize_pos(value: str, translation: str, word: str) -> str:
    text = str(value or "").strip().lower().replace("/", ",")
    mapping = {
        "n": "n.",
        "v": "v.",
        "vi": "v.",
        "vt": "v.",
        "a": "adj.",
        "adj": "adj.",
        "ad": "adv.",
        "adv": "adv.",
        "prep": "prep.",
        "conj": "conj.",
        "pron": "pron.",
        "num": "num.",
        "int": "interj.",
    }
    for part in re.split(r"[,;\s]+", text):
        key = part.strip(".")
        if key in mapping:
            return mapping[key]

    translation_text = str(translation or "").lower()
    for key, label in [
        ("aux.", "aux."),
        ("prep.", "prep."),
        ("conj.", "conj."),
        ("pron.", "pron."),
        ("adv.", "adv."),
        ("adj.", "adj."),
        ("vt.", "v."),
        ("vi.", "v."),
        ("v.", "v."),
        ("n.", "n."),
    ]:
        if key in translation_text:
            return label

    synsets = wn.synsets(word)
    if synsets:
        return {
            "n": "n.",
            "v": "v.",
            "a": "adj.",
            "s": "adj.",
            "r": "adv.",
        }.get(synsets[0].pos(), "")
    return ""


def wordnet_example(word: str) -> str:
    for synset in wn.synsets(word):
        for example in synset.examples():
            if re.search(rf"\b{re.escape(word)}\b", example, flags=re.IGNORECASE):
                sentence = example.strip()
                sentence = sentence[0].upper() + sentence[1:]
                return sentence if sentence.endswith((".", "!", "?")) else f"{sentence}."
    return f'Students often meet the word "{word}" in reading and daily communication.'


def example_cn(word: str, category: str) -> str:
    if "cet6" in category:
        return f"这个例句帮助理解“{word}”在进阶阅读和写作中的用法。"
    if "cet4" in category:
        return f"这个例句展示了“{word}”在四级阅读和写作中的常见用法。"
    return f"这个例句展示了“{word}”在日常交流中的常见用法。"


def load_existing_words() -> set[str]:
    vocabulary = json.loads(VOCABULARY_PATH.read_text(encoding="utf-8"))
    return {normalize_word(item.get("word", "")) for item in vocabulary if item.get("word")}


def iter_ecdict_rows(zip_path: Path):
    with zipfile.ZipFile(zip_path) as archive:
      with archive.open("ECDICT-master/ecdict.csv") as file:
        text_rows = (line.decode("utf-8", errors="ignore") for line in file)
        yield from csv.DictReader(text_rows)


def row_to_candidate(row: dict[str, str]) -> dict[str, str] | None:
    word = normalize_word(row.get("word", ""))
    if not is_valid_word(word):
        return None
    meaning = clean_translation(row.get("translation", ""))
    if not meaning:
        return None
    pos = normalize_pos(row.get("pos", ""), row.get("translation", ""), word)
    if not pos:
        return None
    tags = set(str(row.get("tag", "")).lower().split())
    return {
        "word": word,
        "phonetic": str(row.get("phonetic", "")).strip(),
        "pos": pos,
        "meaning": meaning,
        "example": wordnet_example(word),
        "exampleCn": "",
        "category": "",
        "level": "",
        "list": "",
        "_tags": tags,
        "_rank": rank_value(row),
        "_oxford": row.get("oxford") == "1",
        "_collins": safe_int(row.get("collins")),
    }


def sort_candidates(items: list[dict[str, str]]) -> list[dict[str, str]]:
    return sorted(
        items,
        key=lambda item: (
            int(item["_rank"]),
            -int(item["_oxford"]),
            -int(item["_collins"]),
            item["word"],
        ),
    )


def take(pool: list[dict[str, str]], count: int, used: set[str], category: str) -> list[dict[str, str]]:
    selected = []
    for item in pool:
        if item["word"] in used:
            continue
        used.add(item["word"])
        next_item = {key: item.get(key, "") for key in FIELDNAMES}
        next_item["category"] = category
        next_item["exampleCn"] = example_cn(item["word"], category)
        selected.append(next_item)
        if len(selected) >= count:
            return selected
    raise RuntimeError(f"Only selected {len(selected)} of {count} for {category}")


def build_rows(zip_path: Path) -> list[dict[str, str]]:
    existing = load_existing_words()
    all_candidates = []
    seen = set()

    for row in iter_ecdict_rows(zip_path):
        candidate = row_to_candidate(row)
        if not candidate:
            continue
        word = candidate["word"]
        if word in seen or word in existing:
            continue
        seen.add(word)
        all_candidates.append(candidate)

    cet4_only = []
    cet4_cet6 = []
    cet6_only = []
    high_frequency = []

    for item in all_candidates:
        tags = item["_tags"]
        is_cet4 = "cet4" in tags
        is_cet6 = "cet6" in tags
        if is_cet4 and is_cet6:
            cet4_cet6.append(item)
        elif is_cet6:
            cet6_only.append(item)
        elif is_cet4:
            cet4_only.append(item)
        elif item["_oxford"] or item["_collins"] >= 2 or int(item["_rank"]) <= 9000:
            high_frequency.append(item)

    used = set()
    rows = []
    rows.extend(take(sort_candidates(high_frequency), TARGETS["daily_only"], used, "daily"))
    rows.extend(take(sort_candidates(cet4_only + high_frequency), TARGETS["daily_cet4"], used, "daily|cet4"))
    rows.extend(take(sort_candidates(cet4_cet6), TARGETS["cet4_cet6"], used, "cet4|cet6"))
    rows.extend(take(sort_candidates(cet6_only), TARGETS["cet6_only"], used, "cet6"))
    return rows


def write_csv(rows: list[dict[str, str]], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    args = parse_args()
    rows = build_rows(Path(args.ecdict_zip))
    write_csv(rows, Path(args.output))
    counts = {"daily": 0, "cet4": 0, "cet6": 0, "toefl": 0, "ielts": 0}
    for row in rows:
        categories = row["category"].split("|")
        for category in counts:
            if category in categories:
                counts[category] += 1
    print(f"Wrote {len(rows)} rows to {args.output}")
    print(json.dumps(counts, ensure_ascii=False, sort_keys=True))


if __name__ == "__main__":
    main()
