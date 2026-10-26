import { tokenizeReadingText, isEnglishWordToken, resolveVocabularyWord } from './readingText.js';

// Content-only metadata does not depend on account progress or loaded shards.
export const prepareReadingContent = readings => readings.map(article => {
  const tokens = tokenizeReadingText(article.content).filter(isEnglishWordToken);
  return { article, tokens, estimatedMinutes: Math.max(1, Math.round(tokens.length / 180)) };
});

// Resolve once per vocabulary change; later recognition changes only count IDs.
export const indexReadingVocabulary = (prepared, lookup) => prepared.map(({ article, tokens, estimatedMinutes }) => ({
  article, estimatedMinutes,
  trackedIds: [...new Set(tokens.map(token => resolveVocabularyWord(token, lookup)?.id).filter(Boolean).map(String))],
}));

export const applyReadingProgress = (indexed, masteredIds) => indexed.map(({ article, estimatedMinutes, trackedIds }) => ({
  ...article, estimatedMinutes, trackedWordCount: trackedIds.length,
  unmasteredCount: trackedIds.reduce((count, id) => count + Number(!masteredIds.has(id)), 0),
}));
