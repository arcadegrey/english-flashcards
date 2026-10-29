"""Versioned audio for the bounded 2026-10-29 P1 teaching repairs.

Reuse the existing cached Kokoro model and a compatible local Python runtime.
Historical example text is protected by exact matches. Learned's adjective
recording additionally requires its repaired POS, IPA and teaching meaning.
"""
import json
from generate_name_place_audio import ROOT, generate_batch


def synthesis_for(word, field, voice='af_bella'):
    if word['id'] == 8017:
        # Two syllables for the adjective meaning "erudite", rather than the
        # one-syllable past tense. Preserve each accent's rhotic/length symbols.
        phones = 'lˈɜːnɪd' if voice.startswith(('bf_', 'bm_')) else 'lˈɜɹnɪd'
        return word[field].replace('learned', f'[learned](/{phones}/)')
    return word[field]


def guards_for(word, field):
    if word['id'] == 8017 and field == 'word':
        return {key: word[key] for key in ('pos', 'phonetic', 'meaning')}
    return None


if __name__ == '__main__':
    register = json.loads((ROOT / 'data/vocabulary-p1-repair/reviews-2026-10-29.json').read_text())
    jobs = [(review['after'], field) for review in register['reviews'] for field in review['audioFields']]
    generate_batch(jobs, '2026-10-29-p1', 'teachingP1VocabularyAudio.js',
                   'TEACHING_P1_VOCABULARY_AUDIO', synthesis_for,
                   synthesis_for_voice=synthesis_for, guards_fn=guards_for)
