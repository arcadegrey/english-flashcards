import test from 'node:test';
import assert from 'node:assert/strict';
import { getStudyDateKey, shiftStudyDate, studyDayStart, studyWeekRange } from '../shared/studyDate.js';
import { mergeStudyHistory, summarizeStudyHistory } from '../shared/studyHistory.js';
import { studyRewardProgress } from '../shared/studyRewards.js';
import { getPlanWordStats } from '../src/utils/studyPlan.js';
import { getWordsForReview } from '../src/utils/spacedRepetition.js';

test('Beijing midnight and Monday boundaries agree regardless of the host timezone', () => {
  assert.equal(getStudyDateKey('2026-10-24T15:59:59Z'), '2026-10-24');
  assert.equal(getStudyDateKey('2026-10-24T16:00:00Z'), '2026-10-25');
  assert.equal(getStudyDateKey('2026-10-25T01:00:00+08:00'), '2026-10-25');
  assert.equal(studyWeekRange('2026-10-25T15:59:59Z').start, '2026-10-19');
  assert.equal(studyWeekRange('2026-10-25T16:00:00Z').start, '2026-10-26');
  assert.equal(studyDayStart('2026-10-26'), '2026-10-25T16:00:00.000Z');
  assert.equal(shiftStudyDate('2028-02-28', 1), '2028-02-29');
  assert.equal(shiftStudyDate('2026-12-31', 1), '2027-01-01');
  for (const value of [null, '', 'invalid', '2026-02-30', '2026-13-01']) assert.equal(getStudyDateKey(value), '');
});

test('legacy summaries are not moved or duplicated, and today/streak use the same calendar', () => {
  const history = [{ date: '2026-10-24', wordsLearned: 2 }, { date: '2026-10-25', readingsCompleted: 1 }];
  const merged = mergeStudyHistory(history, history);
  assert.deepEqual(merged.map(day => day.date), history.map(day => day.date));
  const now = new Date('2026-10-24T17:00:00Z');
  assert.equal(summarizeStudyHistory(merged, now).today.readingsCompleted, 1);
  assert.equal(summarizeStudyHistory(merged, now).totals.wordsLearned, 2);
  assert.equal(studyRewardProgress(merged, now).streak, 2);
});

test('plan progress and due reviews respect Beijing midnight, ignoring missing or invalid schedules', () => {
  const words = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
  const progress = {
    1: { lastReviewed: '2026-10-24T17:00:00Z', nextReview: '2026-10-25T16:00:00Z' },
    2: { lastReviewed: '2026-10-24T15:59:59Z', nextReview: '2026-10-25T15:59:59Z' },
    3: { nextReview: 'invalid' },
  };
  assert.equal(getPlanWordStats(words, progress, [], [], '2026-10-25').todayStudied, 1);
  assert.deepEqual(getWordsForReview(words, progress, '2026-10-25').map(word => word.id), [2]);
  assert.deepEqual(getWordsForReview(words, progress, '2026-10-26').map(word => word.id), [1, 2]);
});
