import { VOCABULARY_AUDIO_UPDATES } from './vocabularyAudioUpdates.js';
import { PRACTICAL_VOCABULARY_AUDIO } from './practicalVocabularyAudio.js';

const voices = new Set(['af_bella', 'am_michael', 'bf_emma', 'bm_george']);
export const AUDIO_UPDATES_BASE_URL = (import.meta.env?.VITE_AUDIO_UPDATES_BASE_URL
  || 'https://pub-47e027cd6ce64af29a76f038ecb22373.r2.dev/audio-updates').replace(/\/+$/, '');

export function correctedVocabularyAudioUrl(word, field, voice) {
  if (!word || !['word', 'example'].includes(field) || !voices.has(voice)) return null;
  const id = String(word.id ?? '');
  const practical = Object.hasOwn(PRACTICAL_VOCABULARY_AUDIO, id);
  const updates = practical ? PRACTICAL_VOCABULARY_AUDIO : VOCABULARY_AUDIO_UPDATES;
  if (!Object.hasOwn(updates, id)) return null;
  const revision = updates[id][field];
  // Old assignment/history snapshots still use their original text and audio.
  if (!revision || word[field] !== revision.text) return null;
  return `${AUDIO_UPDATES_BASE_URL}/${practical ? '2026-10-25' : '2026-10-24'}/${field}/${voice}/${id}-${revision.revision}.mp3`;
}
