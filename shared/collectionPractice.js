export const COLLECTION_PRACTICE_SOURCES = Object.freeze({
  wrongWords: '错题本', savedWords: '我的收藏', todayReview: '今日复习',
});
export const MAX_COLLECTION_PRACTICE_WORDS = 10000;

// Provenance is descriptive; scores still come from canonical server answers.
// Keeping the legacy category/scope values lets older clients read the grades.
export function normalizeCollectionFocus(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)
    || !Object.hasOwn(COLLECTION_PRACTICE_SOURCES, value.source)
    || typeof value.key !== 'string' || !/^[a-f0-9]{64}$/.test(value.key)
    || !Number.isInteger(value.wordCount) || value.wordCount < 1
    || value.wordCount > MAX_COLLECTION_PRACTICE_WORDS) throw new Error('定向练习范围无效。');
  return { source: value.source, key: value.key, wordCount: value.wordCount };
}
