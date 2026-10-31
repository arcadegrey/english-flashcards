"""Resumable immutable four-voice audio for the bounded multi-sense repair.

Uses only the existing local Kokoro model. No live synthesis service or API key.
"""
import hashlib
import json
import os
from pathlib import Path
import re
import time

ROOT = Path(__file__).resolve().parents[1]
VOICES = ['af_bella', 'am_michael', 'bf_emma', 'bm_george']
BATCH = '2026-10-31-multi-sense'
OUT = ROOT / 'public/audio-updates' / BATCH
OUT.mkdir(parents=True, exist_ok=True)
register = json.loads((ROOT / 'data/vocabulary-multi-sense-repair/reviews-2026-10-31.json').read_text())
overrides = json.loads((ROOT / 'data/vocabulary-multi-sense-repair/pronunciations-2026-10-31.json').read_text())
digest = lambda value: hashlib.sha256(value).hexdigest()

jobs = []
for review in register['reviews']:
    word = review['after']
    if 'word' in review['audioFields']:
        assert len(overrides[word['word']]) == len(word['examples'])
        jobs.append(dict(word=word, field='word', text=word['word'], sense=word['examples'][0]['sense'], override=overrides[word['word']][0]))
    for index, example in enumerate(word['examples']):
        jobs.append(dict(word=word, field='example', text=example['en'], sense=example['sense'], override=overrides.get(word['word'], [None] * len(word['examples']))[index]))

updates = {}
for job in jobs:
    job['synthesis'] = {}
    for lang in ['a', 'b']:
        if job['override']:
            pattern = r'(?<![A-Za-z])' + re.escape(job['word']['word']) + r'(?![A-Za-z])'
            job['synthesis'][lang], count = re.subn(pattern, lambda match: f"[{match.group()}](/{job['override'][lang]}/)", job['text'], flags=re.I)
            assert count == 1, job['text']
        else:
            job['synthesis'][lang] = job['text']
    signature = job['text'] + '|' + job['synthesis']['a'] + '|' + job['synthesis']['b'] + '|kokoro-82m|24k|multi-sense-v1'
    job['revision'] = digest(signature.encode())[:12]
    item = dict(text=job['text'], revision=job['revision'])
    if job['field'] == 'word':
        item['guards'] = {key: job['word'][key] for key in ['word', 'phonetic', 'meaning']}
    updates.setdefault(str(job['word']['id']), {}).setdefault(job['field'], []).append(item)
(ROOT / 'shared/multiSenseVocabularyAudio.js').write_text('// Generated immutable audio; select sense examples by exact text and word recordings by reviewed metadata.\n'
    + 'export const MULTI_SENSE_VOCABULARY_AUDIO = ' + json.dumps(updates, ensure_ascii=False, indent=2) + ';\n')

manifest_path = OUT / 'manifest.json'
previous = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
prior = {item['path']: item for item in previous.get('files', [])}
files = []
expected = len(jobs) * len(VOICES)
started = time.monotonic()

def checkpoint(ready=False):
    payload = dict(batch=BATCH, voices=VOICES, ready=ready, expectedFiles=expected, sourceSha256=register['afterSha256'], files=files)
    temp = manifest_path.with_suffix('.tmp.json')
    temp.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n')
    temp.replace(manifest_path)

from generate_kokoro_word_audio import get_pipeline, lang_code_for_voice, write_mp3
import numpy as np
import torch

torch.set_num_threads(int(os.environ.get('KOKORO_CPU_THREADS', '4')))
try:
    torch.set_num_interop_threads(1)
except RuntimeError:
    pass
pipelines = {}
for voice in VOICES:
    lang = lang_code_for_voice(voice)
    pipeline = get_pipeline(lang, pipelines)
    for job in jobs:
        word, field, text = job['word'], job['field'], job['text']
        target = OUT / field / voice / f"{word['id']}-{job['revision']}.mp3"
        path = '/' + target.relative_to(ROOT / 'public').as_posix()
        cached = prior.get(path)
        if cached and target.exists() and digest(target.read_bytes()) == cached['sha256']:
            files.append(cached)
        else:
            chunks, phones = [], []
            for _, phonemes, audio in pipeline(job['synthesis'][lang], voice=voice, speed=0.92 if field == 'word' else 0.96):
                chunks.append(np.asarray(audio, dtype=np.float32)); phones.append(phonemes)
            if not chunks:
                raise RuntimeError(f'No audio: {path}')
            if job['override']:
                assert job['override'][lang] in ' '.join(phones), f"Lost explicit pronunciation: {path}: {phones}"
            audio = np.concatenate(chunks)
            target.parent.mkdir(parents=True, exist_ok=True)
            temporary = target.with_suffix('.tmp.mp3')
            write_mp3(audio, temporary, '24'); temporary.replace(target)
            files.append(dict(id=word['id'], word=word['word'], field=field, voice=voice, sense=job['sense'], text=text,
                synthesis=job['synthesis'][lang], revision=job['revision'], textSha256=digest(text.encode()), path=path,
                sha256=digest(target.read_bytes()), bytes=target.stat().st_size, seconds=round(len(audio) / 24000, 3),
                phonemes=' '.join(phones), **({'targetPhonemes': job['override'][lang]} if job['override'] else {})))
        if len(files) % 16 == 0:
            checkpoint()
            print(f'{len(files)}/{expected} {voice} {word["id"]} {field} elapsed={time.monotonic()-started:.1f}s', flush=True)
    checkpoint()
checkpoint(ready=True)
print(f'READY {len(files)} files in {time.monotonic()-started:.1f}s', flush=True)
