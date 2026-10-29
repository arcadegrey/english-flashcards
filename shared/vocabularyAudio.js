import { VOCABULARY_AUDIO_UPDATES } from './vocabularyAudioUpdates.js';
import { PRACTICAL_VOCABULARY_AUDIO } from './practicalVocabularyAudio.js';
import { FOLLOWUP_VOCABULARY_AUDIO } from './followupVocabularyAudio.js';
import { NAME_PLACE_VOCABULARY_AUDIO } from './namePlaceVocabularyAudio.js';
import { SENSE_REVIEW_VOCABULARY_AUDIO } from './senseReviewVocabularyAudio.js';
import { FEEDBACK_VOCABULARY_AUDIO } from './feedbackVocabularyAudio.js';
import { TEACHING_P1_VOCABULARY_AUDIO } from './teachingP1VocabularyAudio.js';

const voices = new Set(['af_bella', 'am_michael', 'bf_emma', 'bm_george']);
export const AUDIO_UPDATES_BASE_URL = (import.meta.env?.VITE_AUDIO_UPDATES_BASE_URL
  || 'https://pub-47e027cd6ce64af29a76f038ecb22373.r2.dev/audio-updates').replace(/\/+$/, '');

export function correctedVocabularyAudioUrl(word, field, voice) {
  if (!word || !['word', 'example'].includes(field) || !voices.has(voice)) return null;
  const id = String(word.id ?? '');
  for (const [batch, updates] of [['2026-10-29-p1', TEACHING_P1_VOCABULARY_AUDIO], ['2026-10-29-feedback', FEEDBACK_VOCABULARY_AUDIO], ['2026-10-26-sense', SENSE_REVIEW_VOCABULARY_AUDIO], ['2026-10-26-name-place', NAME_PLACE_VOCABULARY_AUDIO]]) {
    const revision = Object.hasOwn(updates, id) ? updates[id][field] : null;
    if (revision && word[field] === revision.text
      && Object.entries(revision.guards || {}).every(([key, value]) => word[key] === value)) {
      return `${AUDIO_UPDATES_BASE_URL}/${batch}/${field}/${voice}/${id}-${revision.revision}.mp3`;
    }
  }
  const followup = FOLLOWUP_VOCABULARY_AUDIO[id]?.[field];
  if (followup && word[field] === followup.text) {
    return `${AUDIO_UPDATES_BASE_URL}/2026-10-25-followup/${field}/${voice}/${id}-${followup.revision}.mp3`;
  }
  const practical = Object.hasOwn(PRACTICAL_VOCABULARY_AUDIO, id);
  const updates = practical ? PRACTICAL_VOCABULARY_AUDIO : VOCABULARY_AUDIO_UPDATES;
  if (!Object.hasOwn(updates, id)) return null;
  const revision = updates[id][field];
  // Old assignment/history snapshots still use their original text and audio.
  if (!revision || word[field] !== revision.text) return null;
  return `${AUDIO_UPDATES_BASE_URL}/${practical ? '2026-10-25' : '2026-10-24'}/${field}/${voice}/${id}-${revision.revision}.mp3`;
}
