"""Generate immutable four-voice audio for the reviewed sense examples of single."""
import json
from generate_name_place_audio import ROOT, generate_batch

if __name__ == '__main__':
    register = json.loads((ROOT / 'data/vocabulary-single-example/reviews-2026-10-31.json').read_text())
    jobs = [({**review['after'], 'example': example['en']}, 'example')
            for review in register['reviews'] for example in review['after']['examples']]
    generate_batch(jobs, register['batch'], 'singleExampleVocabularyAudio.js',
                   'SINGLE_EXAMPLE_VOCABULARY_AUDIO', lambda word, field: word[field])
    # Multiple example recordings share the stable word ID; select by exact text.
    manifest = json.loads((ROOT / 'public/audio-updates' / register['batch'] / 'manifest.json').read_text())
    updates = {}
    for word, field in jobs:
        file = next(item for item in manifest['files'] if item['id'] == word['id'] and item['text'] == word[field])
        updates.setdefault(str(word['id']), {}).setdefault(field, []).append(dict(text=file['text'], revision=file['revision']))
    (ROOT / 'shared/singleExampleVocabularyAudio.js').write_text(
        '// Generated versioned audio; select each sense example by exact text.\n'
        + 'export const SINGLE_EXAMPLE_VOCABULARY_AUDIO = '
        + json.dumps(updates, ensure_ascii=False, indent=2) + ';\n')
