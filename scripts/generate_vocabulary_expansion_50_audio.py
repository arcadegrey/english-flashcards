"""Generate word and example audio for all 50 units in all four existing voices."""
import json
from generate_name_place_audio import ROOT, generate_batch

if __name__ == '__main__':
    words = json.loads((ROOT / 'data/vocabulary-expansion-50/entries-2026-10-29.json').read_text())
    generate_batch([(w, field) for w in words for field in ('word', 'example')],
                   '2026-10-29-expansion-50', 'expansion50VocabularyAudio.js',
                   'EXPANSION_50_VOCABULARY_AUDIO', lambda word, field: word[field])
