"""Generate immutable, resumable four-voice audio for the second replacement batch."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BATCH = '2026-10-26-name-place'
OUTPUT = ROOT / 'public/audio-updates' / BATCH
VOICES = ['af_bella', 'am_michael', 'bf_emma', 'bm_george']


def digest(value):
    return hashlib.sha256(value).hexdigest()


def synthesis_for(word, field):
    # Bare proofread must use the present-tense pronunciation taught on this card.
    if word['word'] == 'proofread' and field == 'word':
        return '[proofread](/pɹˈuːfɹiːd/)'
    return word[field]


def generate_batch(jobs, batch, module_name, export_name, synthesis_fn):
    import numpy as np
    from generate_kokoro_word_audio import get_pipeline, lang_code_for_voice, write_mp3
    output = ROOT / 'public/audio-updates' / batch
    output.mkdir(parents=True, exist_ok=True)
    path = output / 'manifest.json'
    previous = json.loads(path.read_text()) if path.exists() else {}
    prior = {file['path']: file for file in previous.get('files', [])}
    files, updates, pipelines = [], {}, {}

    def checkpoint(ready=False):
        manifest = dict(batch=batch, voices=VOICES, ready=ready, expectedFiles=len(jobs) * len(VOICES), files=files)
        temporary = path.with_suffix('.tmp.json')
        temporary.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
        temporary.replace(path)

    for voice in VOICES:
        pipeline = get_pipeline(lang_code_for_voice(voice), pipelines)
        for word, field in jobs:
            text, synthesis = word[field], synthesis_fn(word, field)
            revision = digest((text + '|' + synthesis + '|kokoro-82m|24k|name-place-v1').encode())[:12]
            target = output / field / voice / f"{word['id']}-{revision}.mp3"
            url = '/' + target.relative_to(ROOT / 'public').as_posix()
            cached = prior.get(url)
            if cached and target.exists() and digest(target.read_bytes()) == cached['sha256']:
                files.append(cached)
            else:
                chunks, phones = [], []
                for _, phonemes, audio in pipeline(synthesis, voice=voice, speed=0.92 if field == 'word' else 0.96):
                    chunks.append(np.asarray(audio, dtype=np.float32))
                    phones.append(phonemes)
                if not chunks:
                    raise RuntimeError(f"No audio: {word['id']} {field} {voice}")
                audio = np.concatenate(chunks)
                temporary = target.with_suffix('.tmp.mp3')
                write_mp3(audio, temporary, '24')
                temporary.replace(target)
                files.append(dict(id=word['id'], field=field, voice=voice, text=text, synthesis=synthesis, revision=revision,
                                  textSha256=digest(text.encode()), path=url, sha256=digest(target.read_bytes()),
                                  bytes=target.stat().st_size, seconds=round(len(audio) / 24000, 3), phonemes=' '.join(phones)))
            updates.setdefault(str(word['id']), {})[field] = dict(text=text, revision=revision)
            checkpoint()
            print(f'{len(files)}/{len(jobs) * len(VOICES)} {voice} {word["id"]} {field}', flush=True)
    checkpoint(ready=True)
    (ROOT / 'shared' / module_name).write_text('// Generated versioned audio; preserve exact text guards for historical snapshots.\n'
        + 'export const ' + export_name + ' = ' + json.dumps(updates, ensure_ascii=False, indent=2) + ';\n')


def main():
    words = json.loads((ROOT / 'data/name-place-replacement/practical-2026-10-26.json').read_text())
    generate_batch([(word, field) for word in words for field in ('word', 'example')], BATCH,
                   'namePlaceVocabularyAudio.js', 'NAME_PLACE_VOCABULARY_AUDIO', synthesis_for)


if __name__ == '__main__':
    main()
