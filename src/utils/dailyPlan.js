import { getStudyDateKey, shiftStudyDate } from '../../shared/studyDate.js';
import { isRetiredVocabularyId } from '../../shared/retiredVocabularyIds.js';
import { wordBelongsToCategory } from './wordCategories.js';

export const DAILY_EXAM_TARGET = 5;
const count = value => Number.isFinite(Number(value)) ? Math.max(0, Math.floor(Number(value))) : 0;

export function buildDailyPlan({ reviewCount = 0, wordsStudied = 0, target = 15, remaining = 0,
  wordCount = 0, readingCount = 0, readingsCompleted = 0, examAnswered = 0, examCorrect = 0, ready = true } = {}) {
  const studied = count(wordsStudied), remainingWords = count(remaining), requested = Math.max(1, count(target));
  const goal = Math.min(requested, studied + (count(wordCount) ? remainingWords : 0));
  const answered = count(examAnswered), correct = Math.min(answered, count(examCorrect));
  const tasks = {
    review: { complete: count(reviewCount) === 0, count: count(reviewCount) },
    words: { complete: studied >= goal, progress: Math.min(studied, goal), goal, requested,
      exhausted: remainingWords === 0, reduced: goal < requested, available: count(wordCount) > 0 },
    reading: { complete: count(readingsCompleted) > 0, available: count(readingCount) > 0, completed: count(readingsCompleted) },
    exam: { complete: answered >= DAILY_EXAM_TARGET, available: count(wordCount) > 0,
      answered, correct, goal: DAILY_EXAM_TARGET, accuracy: answered ? Math.round(correct / answered * 100) : null },
  };
  const hasContent = count(wordCount) > 0 || count(readingCount) > 0 || count(reviewCount) > 0
    || studied > 0 || count(readingsCompleted) > 0 || answered > 0;
  const complete = ready && hasContent && tasks.review.complete && tasks.words.complete
    && (!tasks.reading.available || tasks.reading.complete) && (!tasks.exam.available || tasks.exam.complete);
  const priority = !ready ? 'preparing' : !tasks.review.complete ? 'review' : !tasks.words.complete ? 'words'
    : tasks.reading.available && !tasks.reading.complete ? 'reading'
    : tasks.exam.available && !tasks.exam.complete ? 'exam' : complete ? 'complete' : 'empty';
  return { tasks, complete, priority, hasContent };
}

export function buildTomorrowPlan({ reviewWords = [], wordProgress = {}, remaining = 0, target = 15,
  readingCount = 0, wordCount = 0, date = getStudyDateKey() } = {}) {
  const tomorrow = shiftStudyDate(date, 1);
  const ids = new Set();
  for (const word of reviewWords) {
    if (isRetiredVocabularyId(word.id)) continue;
    const progress = wordProgress[word.id];
    const due = getStudyDateKey(progress?.nextReview || '');
    if (!progress || (due && due <= tomorrow)) ids.add(String(word.id));
  }
  return { date: tomorrow, reviewCount: ids.size, newWordTarget: Math.min(count(target), count(remaining)),
    readingTarget: count(readingCount) ? 1 : 0, examTarget: count(wordCount) ? DAILY_EXAM_TARGET : 0 };
}

export function needsPlanCatalog(vocabulary, recordedIds, category = 'all', categoryCount = Infinity) {
  const known = new Set(vocabulary.map(word => String(word.id)));
  if (category !== 'all' && new Set(vocabulary.filter(word => wordBelongsToCategory(word, category))
    .map(word => String(word.id))).size !== categoryCount) return true;
  return recordedIds.some(id => !known.has(String(id)));
}
