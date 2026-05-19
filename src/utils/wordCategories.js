export const normalizeCategoryId = (value) => String(value ?? '').trim().toLowerCase();

export const parseCategoryList = (value) => {
  const rawItems = Array.isArray(value) ? value : String(value ?? '').split(/[|,;，]+/);
  const seen = new Set();
  const result = [];

  rawItems.forEach((item) => {
    const normalized = normalizeCategoryId(item);
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    result.push(normalized);
  });

  return result;
};

export const mergeCategoryLists = (...values) => {
  const seen = new Set();
  const result = [];

  values.flatMap((value) => parseCategoryList(value)).forEach((category) => {
    if (seen.has(category)) return;
    seen.add(category);
    result.push(category);
  });

  return result;
};

export const getWordCategories = (word = {}) => mergeCategoryLists(word.categories, word.category);

export const wordBelongsToCategory = (word, categoryId) => {
  const normalizedCategory = normalizeCategoryId(categoryId);
  if (!normalizedCategory || normalizedCategory === 'all') return true;
  return getWordCategories(word).includes(normalizedCategory);
};

export const wordHasToeflCategory = (word) => wordBelongsToCategory(word, 'toefl');
export const wordHasIeltsCategory = (word) => wordBelongsToCategory(word, 'ielts');
export const wordHasExternalExamCategory = (word) =>
  wordHasToeflCategory(word) || wordHasIeltsCategory(word);

export const normalizeNumericTag = (value) => {
  const text = String(value ?? '').trim();
  if (!text) return '';

  const match = text.match(/\d+/);
  if (!match) return '';

  const parsed = Number(match[0]);
  if (!Number.isFinite(parsed) || parsed <= 0) return '';
  return String(parsed);
};

export const normalizeNumericTagList = (...values) => {
  const seen = new Set();
  const result = [];

  values.flat().forEach((value) => {
    const normalized = normalizeNumericTag(value);
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    result.push(normalized);
  });

  return result.sort((left, right) => Number(left) - Number(right));
};

export const getWordIeltsLists = (word = {}) => {
  if (!wordHasIeltsCategory(word)) return [];
  const legacyList = wordHasToeflCategory(word) ? '' : word.list;
  return normalizeNumericTagList(word.ieltsLists, word.ieltsList, legacyList);
};
