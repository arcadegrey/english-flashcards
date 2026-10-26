import { normalizeVocabularyHeadword } from './vocabularyAliases.js';
import { isContextOnlyVocabulary } from './vocabularyPracticePolicy.js';

export const WORD_ASSIGNMENT_CATEGORIES = {
  all: '全部单词', daily: '日常常用', cet4: '四级核心', cet6: '六级核心', toefl: '托福词汇', ielts: '雅思词汇',
};

export function selectAssignmentWords(catalog, { category, start, count, wordIds }) {
  if (!Object.hasOwn(WORD_ASSIGNMENT_CATEGORIES, category)) throw new Error('请选择有效词库。');
  if (wordIds !== undefined) {
    if (!Array.isArray(wordIds) || wordIds.length < 5 || wordIds.length > 50
      || wordIds.some(id => typeof id !== 'string' && typeof id !== 'number')
      || new Set(wordIds.map(String)).size !== wordIds.length) throw new Error('请选择 5–50 个不同的词。');
    const lookup = new Map(catalog.filter(word => category === 'all' || word.categories.includes(category)).map(word => [String(word.id), word]));
    const selected = wordIds.map(id => lookup.get(String(id)));
    if (selected.some(word => !word)) throw new Error('所选词汇不在当前词库中。');
    if (selected.some(isContextOnlyVocabulary)) throw new Error('所选词汇含仅供历史语境识读的条目，请调整范围。');
    return selected;
  }
  if (!Number.isInteger(start) || start < 1 || !Number.isInteger(count) || count < 5 || count > 50) {
    throw new Error('起始序号至少为 1，每次布置 5–50 个词。');
  }
  const pool = catalog.filter((word) => category === 'all' || word.categories.includes(category));
  if (start + count - 1 > pool.length) throw new Error(`所选范围超出词库，共 ${pool.length} 个词。`);
  const selected = pool.slice(start - 1, start - 1 + count);
  if (selected.some(isContextOnlyVocabulary)) throw new Error('所选词汇含仅供历史语境识读的条目，请调整范围。');
  return selected;
}

export function buildWordAssignment(words) {
  if (words.some(isContextOnlyVocabulary)) throw new Error('历史语境识读词不用于新的词汇作业。');
  return words.map((word, index) => {
    const distractors = [...new Set(words.filter((other) => other.meaning !== word.meaning
      && normalizeVocabularyHeadword(other.word) !== normalizeVocabularyHeadword(word.word)).map((other) => other.meaning))].slice(0, 3);
    if (distractors.length < 3) throw new Error('所选词汇的不同释义不足，请扩大或更换范围。');
    const labels = [...distractors];
    labels.splice(index % 4, 0, word.meaning);
    return { id: String(word.id), word: word.word, meaning: word.meaning,
      options: labels.map((label, position) => ({ id: String.fromCharCode(65 + position), label })),
      answer: String.fromCharCode(65 + index % 4) };
  });
}

export function gradeWordAssignment(words, answers) {
  const valid = Object.fromEntries(words.filter((word) => word.options.some((option) => option.id === answers?.[word.id]))
    .map((word) => [word.id, answers[word.id]]));
  return { answers: valid, questionsAnswered: Object.keys(valid).length,
    questionsCorrect: words.filter((word) => word.answer === valid[word.id]).length, questionsTotal: words.length };
}
