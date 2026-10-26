import { getStudyDateKey } from './studyDate.js';
import { getDailyPlanExamActivity, mergeExamCategories, normalizeExamCategories } from './planActivity.js';
const amount = (value) => Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0;
const count = (value) => Math.floor(amount(value));
const uniqueIds = (values) => [...new Set((Array.isArray(values) ? values : [])
  .filter((value) => value != null).map((value) => String(value).trim()).filter(Boolean))];

const counters = ['wordsLearned', 'wordsMastered', 'timeSpent', 'readingsCompleted',
  'readingQuestionsAnswered', 'readingQuestionsCorrect', 'examQuestionsAnswered', 'examQuestionsCorrect'];

export const normalizeStudyHistoryItem = (item) => {
  const date = String(item?.date || '').trim();
  if (!date) return null;
  const results = new Map();
  (Array.isArray(item.readingArticleResults) ? item.readingArticleResults : []).forEach((result) => {
    const articleId = String(result?.articleId ?? '').trim();
    if (!articleId) return;
    const current = results.get(articleId);
    const completedAt = String(result.completedAt || date).trim() || date;
    if (!current || completedAt >= current.completedAt) {
      const questionsAnswered = count(result.questionsAnswered);
      results.set(articleId, { articleId, questionsAnswered,
        questionsCorrect: Math.min(questionsAnswered, count(result.questionsCorrect)), completedAt });
    }
  });
  const readingArticleIds = uniqueIds([...(Array.isArray(item.readingArticleIds) ? item.readingArticleIds : []), ...results.keys()]);
  const readingArticleResults = [...results.values()];
  const normalized = { date, ...Object.fromEntries(counters.map((key) => [key, count(item[key])])) };
  normalized.timeSpent = amount(item.timeSpent);
  normalized.readingsCompleted = Math.max(normalized.readingsCompleted, readingArticleIds.length);
  normalized.readingQuestionsAnswered = Math.max(normalized.readingQuestionsAnswered,
    readingArticleResults.reduce((sum, result) => sum + result.questionsAnswered, 0));
  normalized.readingQuestionsCorrect = Math.min(normalized.readingQuestionsAnswered,
    Math.max(normalized.readingQuestionsCorrect, readingArticleResults.reduce((sum, result) => sum + result.questionsCorrect, 0)));
  normalized.examQuestionsCorrect = Math.min(normalized.examQuestionsAnswered, normalized.examQuestionsCorrect);
  const examByCategory = normalizeExamCategories(item.examByCategory);
  normalized.examQuestionsAnswered = Math.max(normalized.examQuestionsAnswered,
    ...Object.values(examByCategory).map(activity => activity.answered));
  normalized.examQuestionsCorrect = Math.max(normalized.examQuestionsCorrect,
    ...Object.values(examByCategory).map(activity => activity.correct));
  return { ...normalized, readingArticleIds, readingArticleResults,
    ...(Object.keys(examByCategory).length ? { examByCategory } : {}) };
};

export const normalizeStudyHistory = (value) => (Array.isArray(value) ? value : [])
  .map(normalizeStudyHistoryItem).filter(Boolean);

export const mergeStudyHistory = (baseList, incomingList) => {
  const days = new Map();
  [...normalizeStudyHistory(baseList), ...normalizeStudyHistory(incomingList)].forEach((item) => {
    const current = days.get(item.date) || normalizeStudyHistoryItem({ date: item.date });
    days.set(item.date, normalizeStudyHistoryItem({
      date: item.date,
      ...Object.fromEntries(counters.map((key) => [key, Math.max(current[key], item[key])])),
      readingArticleIds: [...current.readingArticleIds, ...item.readingArticleIds],
      readingArticleResults: [...current.readingArticleResults, ...item.readingArticleResults],
      examByCategory: mergeExamCategories(current.examByCategory, item.examByCategory),
    }));
  });
  return [...days.values()].sort((a, b) => a.date.localeCompare(b.date)).slice(-90);
};

export const summarizeStudyHistory = (value, now = new Date()) => {
  const history = mergeStudyHistory([], value);
  const today = history.find((item) => item.date === getStudyDateKey(now))
    || normalizeStudyHistoryItem({ date: getStudyDateKey(now) });
  const totals = Object.fromEntries(counters.map((key) => [key, history.reduce((sum, item) => sum + item[key], 0)]));
  return { history, today, totals };
};

export function recordDailyExamAnswer(history, { category = 'all', correct = false, date = getStudyDateKey(), legacy = {} } = {}) {
  date = getStudyDateKey(date);
  if (!date) throw new Error('学习日期无效。');
  const days = mergeStudyHistory([], history);
  const current = days.find(day => day.date === date) || normalizeStudyHistoryItem({ date });
  const prior = getDailyPlanExamActivity(current, category, legacy);
  const examByCategory = mergeExamCategories(current.examByCategory, {
    [category]: { answered: prior.answered + 1, correct: prior.correct + Number(Boolean(correct)) },
  });
  const next = { ...current,
    examQuestionsAnswered: Math.max(current.examQuestionsAnswered, prior.answered) + 1,
    examQuestionsCorrect: Math.max(current.examQuestionsCorrect, prior.correct) + Number(Boolean(correct)),
    examByCategory };
  return mergeStudyHistory(days.filter(day => day.date !== date), [next]);
}

// Older clients may replace a known day without understanding its optional
// category counters. Preserve these counters for retained days; an explicit
// full history reset still removes every day.
export function preserveExamCategoryHistory(existing, incoming) {
  const previous = new Map(normalizeStudyHistory(existing).map(day => [day.date, day]));
  return normalizeStudyHistory(incoming).map(day => normalizeStudyHistoryItem({ ...day,
    examByCategory: mergeExamCategories(previous.get(day.date)?.examByCategory, day.examByCategory) }));
}

// Carry explicitly recorded local category totals into the existing daily JSON.
// This records no new answer and never infers categories from aggregate counts.
export function mergeLegacyPlanExamActivity(history, legacy = {}) {
  const date = getStudyDateKey(legacy.date);
  const categories = normalizeExamCategories(legacy.categories);
  if (!date || !Object.keys(categories).length) return mergeStudyHistory([], history);
  const days = mergeStudyHistory([], history);
  const current = days.find(day => day.date === date) || normalizeStudyHistoryItem({ date });
  return mergeStudyHistory(days.filter(day => day.date !== date), [{ ...current,
    examByCategory: mergeExamCategories(current.examByCategory, categories) }]);
}
