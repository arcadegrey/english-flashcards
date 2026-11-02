// A stale device must not replace a newer review schedule on reconnect.
// Legacy schedules without timestamps keep the established incoming-last rule.
export function mergeWordProgress(base = {}, incoming = {}) {
  const result = { ...base };
  for (const [id, next] of Object.entries(incoming || {})) {
    const current = result[id];
    const currentTime = Date.parse(current?.lastReviewed || '');
    const nextTime = Date.parse(next?.lastReviewed || '');
    if (Number.isFinite(currentTime) && (!Number.isFinite(nextTime) || currentTime > nextTime)) continue;
    result[id] = next;
  }
  return result;
}

// Recognition and the review schedule describe the same study action. A newer
// forgotten-word review must not keep an older device's mastery membership.
// Untimestamped legacy records and ties retain the existing mastery precedence.
export function mergeWordRecognition(base = {}, incoming = {}) {
  const unique = values => {
    const seen = new Set();
    return values.filter(id => !seen.has(String(id)) && seen.add(String(id)));
  };
  const mastered = unique([...(base.masteredWords || []), ...(incoming.masteredWords || [])]);
  const learned = unique([...(base.learnedWords || []), ...(incoming.learnedWords || [])]);
  const baseKnown = new Set((base.masteredWords || []).map(String));
  const incomingKnown = new Set((incoming.masteredWords || []).map(String));
  const baseLearned = new Set((base.learnedWords || []).map(String));
  const incomingLearned = new Set((incoming.learnedWords || []).map(String));
  const learnedIds = new Set(learned.map(String));
  const masteredWords = mastered.filter(id => {
    const key = String(id);
    if (!learnedIds.has(key) || baseKnown.has(key) === incomingKnown.has(key)) return true;
    const known = baseKnown.has(key) ? base : incoming;
    const forgotten = baseKnown.has(key) ? incoming : base;
    if (!(baseKnown.has(key) ? incomingLearned : baseLearned).has(key)) return true;
    const knownTime = Date.parse(known.wordProgress?.[key]?.lastReviewed || '');
    const forgottenTime = Date.parse(forgotten.wordProgress?.[key]?.lastReviewed || '');
    return !Number.isFinite(forgottenTime) || Number.isFinite(knownTime) && forgottenTime <= knownTime;
  });
  const knownIds = new Set(masteredWords.map(String));
  return { masteredWords, learnedWords: learned.filter(id => !knownIds.has(String(id))) };
}
