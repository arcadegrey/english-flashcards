const keyFor = (ownerId, sessionKey) => `flashcards_reading_draft:${ownerId || 'guest'}:${sessionKey}`;

export const readReadingDraft = (ownerId, sessionKey) => {
  try {
    const value = JSON.parse(localStorage.getItem(keyFor(ownerId, sessionKey)) || 'null');
    return value && value.answers && typeof value.answers === 'object' && !Array.isArray(value.answers) && Number.isFinite(Date.parse(value.updatedAt))
      ? value : { answers: {}, updatedAt: '' };
  } catch { return { answers: {}, updatedAt: '' }; }
};

export const writeReadingDraft = (ownerId, sessionKey, session) => {
  localStorage.setItem(keyFor(ownerId, sessionKey), JSON.stringify(session));
};
