import { boundReadingAttemptCache } from '../../shared/readingAttempts.js';
const key = (ownerId) => `flashcards_reading_attempts:${ownerId || 'guest'}`;
export function readReadingAttempts(ownerId) {
  try { const data=JSON.parse(localStorage.getItem(key(ownerId)) || '{}'); return boundReadingAttemptCache(Array.isArray(data.attempts) ? data.attempts : [], Array.isArray(data.pending) ? data.pending : []); }
  catch { return {attempts:[],pending:[]}; }
}
export function writeReadingAttempts(ownerId, data) { localStorage.setItem(key(ownerId),JSON.stringify(data)); }
