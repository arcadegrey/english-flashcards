"""Generate four-voice immutable examples for the bounded remaining P2 repairs."""
import json
from generate_name_place_audio import ROOT, generate_batch


def synthesis_for(word, field):
    return word[field]


if __name__ == '__main__':
    register = json.loads((ROOT / 'data/vocabulary-p2-repair/reviews-2026-10-29.json').read_text())
    jobs = [(review['after'], 'example') for review in register['reviews']]
    generate_batch(jobs, '2026-10-29-p2', 'teachingP2VocabularyAudio.js',
                   'TEACHING_P2_VOCABULARY_AUDIO', synthesis_for)
