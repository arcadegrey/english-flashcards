import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeProgressState, mergeProgress, rebaseProgress } from '../src/utils/progressState.js';
import { createProgressSyncQueue } from '../src/utils/progressSync.js';

const time = '2026-10-26T03:00:00Z';
const bookmark = (saved, second = '01') => ({ saved, updatedAt: `2026-10-26T03:00:${second}.000Z` });
const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };

test('sync response preserves in-flight learning and unrelated remote records', () => {
  const next = rebaseProgress({ learnedWords: [1] }, { learnedWords: [1, 2] }, { learnedWords: [1, 3] });
  assert.deepEqual(next.learnedWords, [1, 3, 2]);
  assert.deepEqual(rebaseProgress({}, {}, { learnedWords: [9] }).learnedWords, [9]);
});

test('local recognition changes and wrong-word removals are replayed without resurrecting old marks', () => {
  const before = { masteredWords: [1], wrongWords: [2, 3] };
  const current = { learnedWords: [1], wrongWords: [3] };
  const remote = { masteredWords: [1, 4], wrongWords: [2, 3, 5] };
  const next = rebaseProgress(before, current, remote);
  assert.deepEqual(next.masteredWords, [4]);
  assert.deepEqual(next.learnedWords, [1]);
  assert.deepEqual(next.wrongWords, [3, 5]);
});

test('latest review timestamps, plan changes and bookmark tombstones remain compatible', () => {
  const before = { preferences: { studyPlanCategory: 'daily', updatedAt: time, wordBookmarks: { 1: bookmark(true) } } };
  const current = { preferences: { studyPlanCategory: 'ielts', updatedAt: '2026-10-26T04:00:00Z', wordBookmarks: { 1: bookmark(false, '03') } },
    wordProgress: { 1: { lastReviewed: '2026-10-26T04:00:00Z', interval: 6 } } };
  const remote = { preferences: { ...before.preferences, wordBookmarks: { 1: bookmark(true, '02'), 2: bookmark(true) } },
    wordProgress: { 1: { lastReviewed: '2026-10-26T05:00:00Z', interval: 7 } } };
  const next = rebaseProgress(before, current, remote);
  assert.equal(next.preferences.studyPlanCategory, 'ielts');
  assert.equal(next.preferences.wordBookmarks[1].saved, false);
  assert.equal(next.preferences.wordBookmarks[2].saved, true);
  assert.equal(next.wordProgress[1].interval, 7);
});

test('explicit in-flight reset clears learning fields but retains preferences, custom words and post-reset learning', () => {
  const sent = { learnedWords: [1], studyHistory: [{ date: '2026-10-26', wordsLearned: 5 }], wordProgress: { 1: { interval: 6 } } };
  const latest = { learnedWords: [2], studyHistory: [{ date: '2026-10-26', wordsLearned: 1 }] };
  const remote = { ...sent, learnedWords: [1, 3], customWords: [{ id: 'custom', word: 'custom' }], preferences: { studyPlanCategory: 'toefl' } };
  const next = rebaseProgress(sent, latest, remote, { resetLearning: true });
  assert.deepEqual(next.learnedWords, [2]);
  assert.deepEqual(next.wordProgress, {});
  assert.equal(next.studyHistory[0].wordsLearned, 1);
  assert.equal(next.preferences.studyPlanCategory, 'toefl');
  assert.equal(next.customWords[0].id, 'custom');
});

test('history keeps category max counters and distinct reading results; removed custom entries stay removed', () => {
  const before = { customWords: [{ word: 'old' }], studyHistory: [{ date: '2026-10-26', examQuestionsAnswered: 3 }] };
  const current = { customWords: [{ word: 'new' }], studyHistory: [{ date: '2026-10-26', examByCategory: { ielts: { answered: 5, correct: 4 } } }] };
  const remote = { ...before, studyHistory: [{ date: '2026-10-26', examQuestionsAnswered: 7, readingArticleIds: ['13'] }] };
  const next = rebaseProgress(before, current, remote);
  assert.deepEqual(next.customWords.map(word => word.word), ['new']);
  assert.equal(next.studyHistory[0].examQuestionsAnswered, 7);
  assert.equal(next.studyHistory[0].examByCategory.ielts.answered, 5);
  assert.deepEqual(next.studyHistory[0].readingArticleIds, ['13']);
});

test('normalized states and guest/cloud merges retain existing recognition precedence', () => {
  const next = mergeProgress({ learnedWords: [1, '1', 2], wrongWords: [2] }, { masteredWords: [2] });
  assert.deepEqual(next.learnedWords, [1]);
  assert.deepEqual(next.wrongWords, []);
  assert.deepEqual(normalizeProgressState(next), next);
});

test('sync queue serializes writes and reads updated state/version at execution time', async () => {
  const queue = createProgressSyncQueue(), first = deferred();
  const sent = []; let latest = 1, version = 'v1';
  const one = queue.enqueue(async () => { sent.push([latest, version]); await first.promise; version = 'v2'; });
  await new Promise(resolve => setImmediate(resolve));
  const two = queue.enqueue(async () => { sent.push([latest, version]); });
  latest = 2;
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(sent, [[1, 'v1']]);
  first.resolve(); await Promise.all([one, two]);
  assert.deepEqual(sent, [[1, 'v1'], [2, 'v2']]);
});

test('account/session invalidation discards old queued work and late responses, including the same user logging back in', async () => {
  const queue = createProgressSyncQueue(), first = deferred(), applied = [];
  const old = queue.enqueue(async current => { await first.promise; if (current()) applied.push('old'); });
  await new Promise(resolve => setImmediate(resolve));
  const queued = queue.enqueue(() => applied.push('queued-old'));
  queue.invalidate();
  await queue.enqueue(() => applied.push('new-session'));
  first.resolve(); await Promise.all([old, queued]);
  assert.deepEqual(applied, ['new-session']);
});

test('a failed offline/request attempt does not poison subsequent retry', async () => {
  const queue = createProgressSyncQueue();
  await assert.rejects(queue.enqueue(() => { throw new Error('offline'); }), /offline/);
  assert.equal(await queue.enqueue(() => 'retried'), 'retried');
});
