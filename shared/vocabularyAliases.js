// Lookup compatibility only. Misspellings are never accepted as spelling answers.
const legacySpellings = { sepectator: 'spectator', precauition: 'precaution' };
const legacyNoteKeys = { 1234: 'sepectator', 3318: 'precauition' };

export const vocabularyNoteKey = (word) => {
  const key = String(word?.word || '').trim().toLowerCase();
  const legacy = legacyNoteKeys[word?.id];
  return legacy && legacySpellings[legacy] === key ? legacy : key;
};

// Keep all IDs in learning storage; avoid ambiguous equal-spelling choices per question.
export const distinctVocabularyWords = (words, excluded = []) => {
  const seen = new Set(excluded.map(word => normalizeVocabularyHeadword(word.word)));
  return words.filter(word => {
    const key = normalizeVocabularyHeadword(word.word);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const normalizeVocabularyHeadword = (value) => {
  const key = String(value || '').trim().toLowerCase();
  return Object.hasOwn(legacySpellings, key) ? legacySpellings[key] : key;
};

export const matchesVocabularyQuery = (word, query) => {
  const key = normalizeVocabularyHeadword(query);
  return [word.word, ...(word.aliases || []), word.meaning, word.phonetic]
    .some(value => String(value || '').toLowerCase().includes(key));
};
