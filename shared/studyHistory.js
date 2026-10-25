import { getStudyDateKey } from './studyDate.js';
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
  return { ...normalized, readingArticleIds, readingArticleResults };
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
