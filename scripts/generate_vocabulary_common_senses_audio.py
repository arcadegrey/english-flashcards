"""Generate the ten revised example recordings in the four established voices."""
import json
from generate_name_place_audio import ROOT, generate_batch

if __name__ == '__main__':
    register = json.loads((ROOT / 'data/vocabulary-common-senses-repair/reviews-2026-10-29.json').read_text())
    generate_batch([(r['after'], 'example') for r in register['reviews']],
                   '2026-10-29-common-senses', 'commonSensesVocabularyAudio.js',
                   'COMMON_SENSES_VOCABULARY_AUDIO', lambda word, field: word[field])
