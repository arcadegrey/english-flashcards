"""Generate versioned four-voice audio for the 73 reviewed vocabulary records.

MP3s stay ignored and are published under a new R2 prefix; old objects remain.
"""
import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BATCH = '2026-10-25-followup'
OUTPUT = ROOT / 'public/audio-updates' / BATCH
VOICES = ['af_bella', 'am_michael', 'bf_emma', 'bm_george']


def digest(value):
    return hashlib.sha256(value).hexdigest()


def synthesis_for(word, field, lang):
    text = word[field]
    identifier = word['id']
    if identifier in [6287, 6330, 6396, 6397]:
        short, full = {6287: ('Oct.', 'October'), 6330: ('Nov.', 'November'),
                       6396: ('Feb.', 'February'), 6397: ('Aug.', 'August')}[identifier]
        return full if field == 'word' else text.replace(short, full)
    if identifier == 4340:
        return text.replace('bow', '[bow](/bˈaʊ/)')
    if identifier == 6030:
        return '[Inc.](/ˈɪŋk/)' if field == 'word' else text.replace('Inc.', '[Inc.](/ˈɪŋk/)')
    if identifier == 6069:
        corp = '[Corp.](/kˈɔːp/)' if lang == 'b' else '[Corp.](/kˈɔɹp/)'
        return corp if field == 'word' else text.replace('Corp.', corp)
    if identifier == 6127:
        return '[DEC](/dˈɛk/)' if field == 'word' else text.replace('DEC', '[DEC](/dˈɛk/)')
    if identifier in [6241, 6329, 6845]:
        letters = {6241: ('CEO', 'C E O'), 6329: ('DNA', 'D N A'), 6845: ('HIV', 'H I V')}
        short, full = letters[identifier]
        return full if field == 'word' else text.replace(short, full)
    if identifier == 6682:
        return '[Korea](/kəɹˈiːə/)' if field == 'word' else text.replace('Korea', '[Korea](/kəɹˈiːə/)')
    if field == 'word' and identifier == 6413:
        return text.capitalize()
    return text


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    reviews = json.loads((ROOT / 'data/vocabulary-followup/reviews-2026-10-25.json').read_text())['reviews']
    jobs = [(review['after'], field) for review in reviews for field in ('word', 'example')
            if field == 'word' or review['before']['example'] != review['after']['example']
            or review['id'] in [4340, 6127, 6241, 6845]]
    print(f'{len(jobs)} texts × {len(VOICES)} voices = {len(jobs) * len(VOICES)} files', flush=True)
    if args.dry_run:
        print(json.dumps([dict(id=word['id'], field=field, text=word[field],
                               synthesisUK=synthesis_for(word, field, 'b'), synthesisUS=synthesis_for(word, field, 'a'))
                          for word, field in jobs], ensure_ascii=False, indent=2))
        return
    import numpy as np
    from generate_kokoro_word_audio import get_pipeline, lang_code_for_voice, write_mp3
    OUTPUT.mkdir(parents=True, exist_ok=True)
    manifest_path = OUTPUT / 'manifest.json'
    previous = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
    previous_files = {item['path']: item for item in previous.get('files', [])}
    pipelines, files, updates = {}, [], {}

    def checkpoint(ready=False):
        manifest = dict(batch=BATCH, voices=VOICES, expectedFiles=len(jobs) * len(VOICES), ready=ready, files=files)
        temporary = manifest_path.with_suffix('.tmp.json')
        temporary.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
        temporary.replace(manifest_path)

    for voice in VOICES:
        lang = lang_code_for_voice(voice)
        pipeline = get_pipeline(lang, pipelines)
        for word, field in jobs:
            synthesis = synthesis_for(word, field, lang)
            # Both dialects share one revision while their own synthesis is recorded.
            config = word[field] + '|' + synthesis_for(word, field, 'a') + '|' + synthesis_for(word, field, 'b') + '|kokoro-82m|24k|followup-v1'
            revision = digest(config.encode())[:12]
            path = OUTPUT / field / voice / f"{word['id']}-{revision}.mp3"
            url = '/' + path.relative_to(ROOT / 'public').as_posix()
            prior = previous_files.get(url)
            if prior and path.exists() and prior['sha256'] == digest(path.read_bytes()):
                files.append(prior)
            else:
                chunks, phones = [], []
                for _, phonemes, audio in pipeline(synthesis, voice=voice, speed=0.92 if field == 'word' else 0.96):
                    chunks.append(np.asarray(audio, dtype=np.float32))
                    phones.append(phonemes)
                if not chunks:
                    raise RuntimeError(f"No audio: {word['id']} {field} {voice}")
                audio = np.concatenate(chunks)
                temporary = path.with_suffix('.tmp.mp3')
                write_mp3(audio, temporary, '24')
                temporary.replace(path)
                files.append(dict(id=word['id'], field=field, voice=voice, text=word[field], synthesis=synthesis,
                                  textSha256=digest(word[field].encode()), path=url, revision=revision,
                                  sha256=digest(path.read_bytes()), bytes=path.stat().st_size,
                                  seconds=round(len(audio) / 24000, 3), phonemes=' '.join(phones)))
            updates.setdefault(str(word['id']), {})[field] = dict(text=word[field], revision=revision)
            checkpoint()
            print(f"{voice} {field} {word['id']} OK", flush=True)
    checkpoint(ready=True)
    # Remove only obsolete local renders from this generated batch. Published R2
    # objects are never deleted or overwritten by the generator.
    current_paths = {item['path'] for item in files}
    for path in OUTPUT.rglob('*.mp3'):
        if '/' + path.relative_to(ROOT / 'public').as_posix() not in current_paths:
            path.unlink()
    (ROOT / 'shared/followupVocabularyAudio.js').write_text(
        '// Generated by generate_vocabulary_followup_audio.py; exact text guards old snapshots.\n'
        + 'export const FOLLOWUP_VOCABULARY_AUDIO = ' + json.dumps(updates, ensure_ascii=False, indent=2) + ';\n')


if __name__ == '__main__':
    main()
