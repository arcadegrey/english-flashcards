import { EXPANSION_50_VOCABULARY_AUDIO } from './expansion50VocabularyAudio.js';
import { COMMON_SENSES_VOCABULARY_AUDIO } from './commonSensesVocabularyAudio.js';
import { VOCABULARY_AUDIO_UPDATES } from './vocabularyAudioUpdates.js';
import { PRACTICAL_VOCABULARY_AUDIO } from './practicalVocabularyAudio.js';
import { FOLLOWUP_VOCABULARY_AUDIO } from './followupVocabularyAudio.js';
import { NAME_PLACE_VOCABULARY_AUDIO } from './namePlaceVocabularyAudio.js';
import { SENSE_REVIEW_VOCABULARY_AUDIO } from './senseReviewVocabularyAudio.js';
import { FEEDBACK_VOCABULARY_AUDIO } from './feedbackVocabularyAudio.js';
import { TEACHING_P1_VOCABULARY_AUDIO } from './teachingP1VocabularyAudio.js';
import { TEACHING_P2_VOCABULARY_AUDIO } from './teachingP2VocabularyAudio.js';

import { SHORT_EXAMPLE_VOCABULARY_AUDIO } from './shortExampleVocabularyAudio.js';
import { SINGLE_EXAMPLE_VOCABULARY_AUDIO } from './singleExampleVocabularyAudio.js';
import { MULTI_SENSE_VOCABULARY_AUDIO } from './multiSenseVocabularyAudio.js';
import { NEUTRAL_EXAMPLE_VOCABULARY_AUDIO } from './neutralExampleVocabularyAudio.js';

const voices = new Set(['af_bella', 'am_michael', 'bf_emma', 'bm_george']);
export const AUDIO_UPDATES_BASE_URL = (import.meta.env?.VITE_AUDIO_UPDATES_BASE_URL
  || 'https://audio.englishflashcards.cn/audio-updates').replace(/\/+$/, '');

export function correctedVocabularyAudioUrl(word, field, voice) {
  if (!word || !['word', 'example'].includes(field) || !voices.has(voice)) return null;
  const id = String(word.id ?? '');
  for (const [batch, updates] of [['2026-10-31-neutral-examples', NEUTRAL_EXAMPLE_VOCABULARY_AUDIO], ['2026-10-31-multi-sense', MULTI_SENSE_VOCABULARY_AUDIO], ['2026-10-31-single-example', SINGLE_EXAMPLE_VOCABULARY_AUDIO], ['2026-10-29-expansion-50', EXPANSION_50_VOCABULARY_AUDIO], ['2026-10-29-common-senses', COMMON_SENSES_VOCABULARY_AUDIO], ['2026-10-29-short-examples', SHORT_EXAMPLE_VOCABULARY_AUDIO], ['2026-10-29-p2', TEACHING_P2_VOCABULARY_AUDIO], ['2026-10-29-p1', TEACHING_P1_VOCABULARY_AUDIO], ['2026-10-29-feedback', FEEDBACK_VOCABULARY_AUDIO], ['2026-10-26-sense', SENSE_REVIEW_VOCABULARY_AUDIO], ['2026-10-26-name-place', NAME_PLACE_VOCABULARY_AUDIO]]) {
    const revisions = Object.hasOwn(updates, id) ? updates[id][field] : null;
    for (const revision of Array.isArray(revisions) ? revisions : [revisions]) {
      if (revision && word[field] === revision.text
      && Object.entries(revision.guards || {}).every(([key, value]) => word[key] === value)) {
        return `${AUDIO_UPDATES_BASE_URL}/${batch}/${field}/${voice}/${id}-${revision.revision}.mp3`;
      }
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
