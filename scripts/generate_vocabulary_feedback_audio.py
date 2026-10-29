"""Generate the four reviewed examples and an explicit teenage pronunciation.

Uses the existing immutable four-voice publisher; never overwrites legacy MP3s.
Run with HF_HUB_OFFLINE=1 .venv-kokoro/bin/python scripts/generate_vocabulary_feedback_audio.py.
"""
import json
from generate_name_place_audio import ROOT, generate_batch


def synthesis_for(word, field, voice='af_bella'):
    if word['id'] == 6718:
        # Kokoro uses its own phoneme alphabet: i = /iː/, A = /eɪ/, ʤ = /dʒ/.
        # Supply the complete word instead of relying on the old recording/G2P.
        phones = 'tˈiːnAʤ' if voice.startswith(('bf_', 'bm_')) else 'tˈinˌAʤ'
        return word[field].replace('teenage', f'[teenage](/{phones}/)')
    return word[field]


if __name__ == '__main__':
    register = json.loads((ROOT / 'data/vocabulary-feedback/reviews-2026-10-29.json').read_text())
    jobs = [(review['after'], 'example') for review in register['reviews']]
    teenage = next(review['after'] for review in register['reviews'] if review['id'] == 6718)
    jobs.append((teenage, 'word'))
    generate_batch(jobs, '2026-10-29-feedback', 'feedbackVocabularyAudio.js',
                   'FEEDBACK_VOCABULARY_AUDIO', synthesis_for, synthesis_for_voice=synthesis_for)
