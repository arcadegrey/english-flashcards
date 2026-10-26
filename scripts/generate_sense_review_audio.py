"""Versioned recordings for changed sense-review examples and disambiguated readings."""
import json
from generate_name_place_audio import ROOT, generate_batch


def synthesis_for(word, field):
    if word['id'] == 6358:
        return 'September' if field == 'word' else word[field].replace('Sept.', 'September')
    if word['id'] == 5956:
        token = '[august](/ɔːɡˈʌst/)'
        return token if field == 'word' else word[field].replace('august', token)
    return word[field]


if __name__ == '__main__':
    reviews = json.loads((ROOT / 'data/sense-review/reviews-2026-10-26.json').read_text())['reviews']
    jobs = [(review['after'], field) for review in reviews for field in ('word', 'example')
            if (field == 'example' and 'example' in review['changedFields'])
            or (field == 'word' and review['id'] in [5956, 6358])]
    generate_batch(jobs, '2026-10-26-sense', 'senseReviewVocabularyAudio.js', 'SENSE_REVIEW_VOCABULARY_AUDIO', synthesis_for)
