import assert from 'node:assert/strict';
import test from 'node:test';
import { buildDailyPlan, buildTomorrowPlan, needsPlanCatalog } from '../src/utils/dailyPlan.js';
import { getDailyPlanExamActivity, mergeExamCategories, normalizeExamCategories } from '../shared/planActivity.js';
import { mergeStudyHistory, normalizeStudyHistoryItem, recordDailyExamAnswer, mergeLegacyPlanExamActivity } from '../shared/studyHistory.js';
import { availableStudyRewards, studyRewardProgress } from '../shared/studyRewards.js';
import { createClassroomFixture } from './helpers/classroom-db.mjs';
import { RETIRED_VOCABULARY } from '../shared/retiredVocabulary.js';
import { storage } from '../src/utils/storage.js';

const date = '2026-10-26';
const complete = { wordsStudied: 15, target: 15, remaining: 100, wordCount: 500, readingCount: 26, readingsCompleted: 1, examAnswered: 5, examCorrect: 4 };

test('priority follows due review, word target, reading, exam and actual completion, independent of recommendation availability', () => {
  assert.equal(buildDailyPlan({ ...complete, reviewCount: 2 }).priority, 'review');
  assert.equal(buildDailyPlan({ ...complete, wordsStudied: 2 }).priority, 'words');
  const missingReading = buildDailyPlan({ ...complete, readingsCompleted: 0 });
  assert.equal(missingReading.priority, 'reading');
  assert.equal(missingReading.complete, false);
  assert.equal(buildDailyPlan({ ...complete, examAnswered: 4 }).priority, 'exam');
  assert.equal(buildDailyPlan(complete).priority, 'complete');
  assert.equal(buildDailyPlan({ ...complete, ready: false }).complete, false);
  assert.equal(buildDailyPlan({ ...complete, ready: false }).priority, 'preparing');
});

test('exhausted vocabulary and unavailable content never create impossible goals or phantom completion rewards', () => {
  const short = buildDailyPlan({ ...complete, wordsStudied: 2, remaining: 3 });
  assert.equal(short.tasks.words.goal, 5);
  assert.equal(short.priority, 'words');
  const exhausted = buildDailyPlan({ ...complete, wordsStudied: 5, remaining: 0 });
  assert.equal(exhausted.complete, true);
  assert.equal(exhausted.tasks.words.reduced, true);
  const noReading = buildDailyPlan({ ...complete, readingCount: 0, readingsCompleted: 0 });
  assert.equal(noReading.complete, true);
  assert.equal(noReading.tasks.reading.complete, false);
  const empty = buildDailyPlan();
  assert.equal(empty.priority, 'empty');
  assert.equal(empty.complete, false);
  const rewards = availableStudyRewards({ progress: studyRewardProgress([], `${date}T12:00:00+08:00`), today: date,
    wordsDone: empty.tasks.words.goal > 0 && empty.tasks.words.complete,
    readingDone: empty.tasks.reading.complete, examDone: empty.tasks.exam.complete, allDone: empty.complete });
  assert.deepEqual(rewards, []);
});

test('invalid progress cannot display negative goals or accuracy above 100 percent', () => {
  const plan = buildDailyPlan({ wordCount: 10, remaining: 10, wordsStudied: -4, examAnswered: 2.9, examCorrect: 99, reviewCount: NaN });
  assert.equal(plan.tasks.words.progress, 0);
  assert.equal(plan.tasks.exam.answered, 2);
  assert.equal(plan.tasks.exam.accuracy, 100);
  assert.equal(buildDailyPlan({ ...complete, examAnswered: 0 }).tasks.exam.accuracy, null);
});

test('tomorrow preview uses Beijing dates, active review schedules and remaining new words, including month/year boundaries', () => {
  const archived = RETIRED_VOCABULARY[0];
  const reviewWords = [1, 2, 2, 3, 4, 5, archived.id].map(id => ({ id }));
  const forecast = buildTomorrowPlan({ date, reviewWords, remaining: 3, target: 15, wordCount: 50, readingCount: 26,
    wordProgress: { 1: { nextReview: '2026-10-26T16:00:00Z' }, 2: { nextReview: '2026-10-27T15:59:59Z' },
      3: { nextReview: '2026-10-27T16:00:00Z' }, 4: { nextReview: 'invalid' }, [archived.id]: { nextReview: '2026-10-25' } } });
  assert.deepEqual(forecast, { date: '2026-10-27', reviewCount: 3, newWordTarget: 3, readingTarget: 1, examTarget: 5 });
  assert.equal(buildTomorrowPlan({ date: '2026-12-31' }).date, '2027-01-01');
  assert.equal(buildTomorrowPlan({ date: '2028-02-28' }).date, '2028-02-29');
  assert.equal(buildTomorrowPlan({ date, remaining: 0 }).newWordTarget, 0);
});

test('unloaded learning records trigger full catalog preparation; new accounts retain the small startup vocabulary', () => {
  assert.equal(needsPlanCatalog([{ id: 1 }], [], 'all'), false);
  assert.equal(needsPlanCatalog([{ id: 1 }], ['1'], 'all'), false);
  assert.equal(needsPlanCatalog([{ id: 1 }], [1, 2], 'all'), true);
  assert.equal(needsPlanCatalog([{ id: 1 }], [], 'toefl'), true);
});

test('per-category answer recording preserves other activities, carries legacy counters once and resets on the Beijing day', () => {
  const legacy = { date, categories: { ielts: { answered: 4, correct: 3 }, toefl: { answered: 2, correct: 1 } } };
  let history = [{ date, examQuestionsAnswered: 6, examQuestionsCorrect: 4, wordsLearned: 7,
    readingArticleResults: [{ articleId: '13', questionsAnswered: 3, questionsCorrect: 2 }] }];
  history = recordDailyExamAnswer(history, { date, category: 'ielts', correct: true, legacy });
  assert.equal(history[0].examQuestionsAnswered, 7);
  assert.equal(history[0].wordsLearned, 7);
  assert.equal(history[0].readingsCompleted, 1);
  assert.deepEqual(getDailyPlanExamActivity(history[0], 'ielts', legacy), { answered: 5, correct: 4 });
  history = recordDailyExamAnswer(history, { date, category: 'ielts', correct: false, legacy });
  assert.deepEqual(history[0].examByCategory.ielts, { answered: 6, correct: 4 });
  history = recordDailyExamAnswer(history, { date, category: 'toefl', correct: true, legacy });
  assert.deepEqual(history[0].examByCategory.toefl, { answered: 3, correct: 2 });
  history = recordDailyExamAnswer(history, { date: '2026-10-26T16:00:00Z', category: 'ielts', correct: false, legacy });
  assert.deepEqual(history[1].examByCategory.ielts, { answered: 1, correct: 0 });
  assert.equal(history[1].date, '2026-10-27');
  assert.throws(() => recordDailyExamAnswer(history, { date: 'invalid' }), /日期/);
});

test('category metadata is bounded, idempotent and survives stale aggregate-only devices without fabricating legacy categories', () => {
  assert.deepEqual(normalizeExamCategories({ all: { answered: 8 }, evil: { answered: 999 }, ielts: { answered: 3.8, correct: 99 }, toefl: { answered: -1 } }), { ielts: { answered: 3, correct: 3 } });
  const first = [{ date, examQuestionsAnswered: 5, examQuestionsCorrect: 3, examByCategory: { ielts: { answered: 5, correct: 3 } } }];
  const second = [{ date, examQuestionsAnswered: 3, examQuestionsCorrect: 1 }];
  assert.deepEqual(mergeStudyHistory(first, second)[0].examByCategory, first[0].examByCategory);
  assert.deepEqual(mergeStudyHistory(first, first), mergeStudyHistory([], first));
  const categories = mergeExamCategories({ ielts: { answered: 5, correct: 3 } }, { ielts: { answered: 2, correct: 2 }, toefl: { answered: 4, correct: 1 } });
  assert.deepEqual(categories, { ielts: { answered: 5, correct: 3 }, toefl: { answered: 4, correct: 1 } });
  const legacy = normalizeStudyHistoryItem({ date, examQuestionsAnswered: 20, examQuestionsCorrect: 15 });
  assert(!Object.hasOwn(legacy, 'examByCategory'));
  assert.deepEqual(getDailyPlanExamActivity(legacy, 'ielts'), { answered: 0, correct: 0 });
  assert.deepEqual(getDailyPlanExamActivity(legacy, '__proto__'), { answered: 0, correct: 0 });
});

test('known legacy category totals migrate without another answer, while aggregate-only history stays unchanged', () => {
  const history = [{ date, wordsLearned: 9, examQuestionsAnswered: 7, examQuestionsCorrect: 5 }];
  const legacy = { date, categories: { ielts: { answered: 5, correct: 4 }, toefl: { answered: 2, correct: 1 } } };
  const migrated = mergeLegacyPlanExamActivity(history, legacy);
  assert.deepEqual(migrated[0].examByCategory, legacy.categories);
  assert.equal(migrated[0].examQuestionsAnswered, 7);
  assert.equal(migrated[0].examQuestionsCorrect, 5);
  assert.equal(migrated[0].wordsLearned, 9);
  assert.deepEqual(mergeLegacyPlanExamActivity(migrated, legacy), migrated);
  assert.deepEqual(mergeLegacyPlanExamActivity(history, {}), mergeStudyHistory([], history));
  assert.deepEqual(mergeLegacyPlanExamActivity(history, { ...legacy, date: 'invalid' }), mergeStudyHistory([], history));
  assert.equal(mergeLegacyPlanExamActivity(history, { ...legacy, date: '2026-10-25' })[0].date, '2026-10-25');
});

test('real progress API restores category daily tasks on a fresh device, preserves older exact-version saves, and isolates accounts', async () => {
  const f = await createClassroomFixture();
  try {
    await f.addUser(1, 'student'); await f.addUser(2, 'student');
    let history = [];
    for (let i = 0; i < 5; i++) history = recordDailyExamAnswer(history, { category: 'ielts', correct: i < 4, date });
    const initial = await f.api(1, '/progress', 'PUT', { progress: { studyHistory: history } });
    assert.equal(initial.status, 200);
    const fresh = await f.api(1, '/progress');
    assert.deepEqual(getDailyPlanExamActivity(fresh.body.progress.studyHistory[0], 'ielts'), { answered: 5, correct: 4 });
    assert.equal(buildDailyPlan({ ...complete, examAnswered: getDailyPlanExamActivity(fresh.body.progress.studyHistory[0], 'ielts').answered }).complete, true);
    const old = await f.api(1, '/progress', 'PUT', { baseUpdatedAt: fresh.body.updatedAt, progress: { studyHistory: [{ date, examQuestionsAnswered: 6, examQuestionsCorrect: 4 }] } });
    assert.equal(old.status, 200);
    assert.equal(old.body.progress.studyHistory[0].examByCategory.ielts.answered, 5);
    assert.equal(old.body.progress.studyHistory[0].examQuestionsAnswered, 6);
    await f.api(1, '/progress', 'PUT', { baseUpdatedAt: initial.body.updatedAt, progress: { studyHistory: [{ date, examQuestionsAnswered: 1, examByCategory: { ielts: { answered: 1, correct: 1 } } }] } });
    assert.equal((await f.api(1, '/progress')).body.progress.studyHistory[0].examByCategory.ielts.answered, 5);
    assert.deepEqual((await f.api(2, '/progress')).body.progress.studyHistory, []);
    assert.equal((await f.api(1, '/progress', 'GET', undefined, { 'x-flashcards-user': '2' })).status, 409);
    const newest = await f.api(1, '/progress');
    const reset = await f.api(1, '/progress', 'PUT', { baseUpdatedAt: newest.body.updatedAt, progress: { studyHistory: [] } });
    assert.deepEqual(reset.body.progress.studyHistory, []);
  } finally { f.sqlite.close(); }
});

test('offline category counters stay inside their learning-account cache and restore after account switches', () => {
  const previous = globalThis.localStorage, values = new Map();
  globalThis.localStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
  try {
    storage.switchLearningAccount('one'); storage.setAuthSession({ user: { id: 'one' } });
    storage.setStudyHistory(recordDailyExamAnswer([], { date, category: 'toefl', correct: true }));
    const other = storage.switchLearningAccount('two');
    assert.deepEqual(other.studyHistory, []);
    storage.setAuthSession({ user: { id: 'two' } });
    const restored = storage.switchLearningAccount('one');
    assert.equal(restored.studyHistory[0].examByCategory.toefl.answered, 1);
    assert.equal(storage.switchLearningAccount(null).studyHistory.length, 0);
  } finally {
    if (previous === undefined) delete globalThis.localStorage; else globalThis.localStorage = previous;
  }
});
