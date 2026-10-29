"""Generate immutable four-voice audio for the reviewed short-example batch."""
import json
from generate_name_place_audio import ROOT, generate_batch


def synthesis_for(word, field):
    return word[field]


if __name__ == '__main__':
    register = json.loads((ROOT / 'data/vocabulary-short-example-repair/reviews-2026-10-29.json').read_text())
    jobs = [(review['after'], 'example') for review in register['reviews']]
    generate_batch(jobs, '2026-10-29-short-examples', 'shortExampleVocabularyAudio.js',
                   'SHORT_EXAMPLE_VOCABULARY_AUDIO', synthesis_for)
