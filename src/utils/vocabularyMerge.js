import { mergeCategoryLists } from './wordCategories.js';

const countFilledFields = (word) => {
  if (!word || typeof word !== 'object') return 0
  const keys = ['phonetic', 'pos', 'meaning', 'example', 'exampleCn', 'category', 'categories', 'level', 'list', 'ieltsList', 'ieltsLists']
  return keys.reduce((count, key) => {
    const value = Array.isArray(word[key]) ? word[key].join('|') : String(word[key] ?? '').trim()
    return value ? count + 1 : count
  }, 0)
}

export const pickRicherWord = (currentWord, incomingWord) => {
  if (!currentWord) return incomingWord
  if (!incomingWord) return currentWord
  const pickedWord = countFilledFields(incomingWord) >= countFilledFields(currentWord) ? incomingWord : currentWord
  const categories = mergeCategoryLists(currentWord.categories, currentWord.category, incomingWord.categories, incomingWord.category)

  if (categories.length === 0) {
    return pickedWord
  }

  return {
    ...pickedWord,
    category: pickedWord.category || categories[0],
    categories,
  }
}


// Vocabulary identity is the record ID, never its spelling. An ID-less legacy
// entry can be deduplicated only against another ID-less entry.
export const mergeVocabularyList = (baseList, extraList) => {
  const records = new Map();
  for (const word of [...(Array.isArray(baseList) ? baseList : []), ...(Array.isArray(extraList) ? extraList : [])]) {
    if (!word || typeof word !== 'object') continue;
    const id = String(word.id ?? '').trim();
    const spelling = String(word.word || '').trim().toLowerCase();
    if (!id && !spelling) continue;
    const key = id ? `id:${id}` : `word:${spelling}`;
    records.set(key, pickRicherWord(records.get(key), word));
  }
  return [...records.values()].sort((a, b) => Number(a.id || 0) - Number(b.id || 0));
};
