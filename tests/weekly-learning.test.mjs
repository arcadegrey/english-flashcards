import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWeeklyLearningView, formatStudyMonthDay } from '../src/utils/weeklyLearning.js';

const wednesday = new Date('2026-10-28T12:00:00+08:00');

test('weekly view uses Beijing dates and includes cross-month week labels', () => {
  const view = buildWeeklyLearningView([], wednesday);
  assert.equal(view.today, '2026-10-28');
  assert.equal(view.range.start, '2026-10-26');
  assert.equal(view.range.last, '2026-11-01');
  assert.deepEqual(view.days.map(day => day.label), ['一', '二', '三', '四', '五', '六', '日']);
  assert.deepEqual(view.days.map(day => day.number), ['26', '27', '28', '29', '30', '31', '01']);
  assert.equal(formatStudyMonthDay(view.range.last), '11月1日');
  assert.equal(view.days.filter(day => day.today).length, 1);
});

test('selected-day records use canonical max merge and retain actual activity fields', () => {
  const history = [
    { date: '2026-10-26', wordsLearned: 5, wordsMastered: 1, timeSpent: 1.5 },
    { date: '2026-10-26', wordsLearned: 3, wordsMastered: 2, examQuestionsAnswered: 4, examQuestionsCorrect: 3 },
    { date: '2026-10-27', readingsCompleted: 1, readingQuestionsAnswered: 3, readingQuestionsCorrect: 2 },
  ];
  const copy = structuredClone(history);
  const view = buildWeeklyLearningView(history, wednesday);
  assert.equal(view.activeDays, 2);
  assert.equal(view.percent, 40);
  assert.equal(view.streak, 2);
  const monday = view.days[0].record;
  assert.equal(monday.wordsLearned, 5);
  assert.equal(monday.wordsMastered, 2);
  assert.equal(monday.examQuestionsAnswered, 4);
  assert.equal(monday.examQuestionsCorrect, 3);
  assert.equal(monday.timeSpent, 1.5);
  assert.equal(monday.readingsCompleted, 0);
  assert.equal(view.days[1].record.readingsCompleted, 1);
  assert.equal(view.days[2].record.wordsLearned, 0);
  assert.deepEqual(history, copy);
});

test('future activity is not counted or presented as a selectable record', () => {
  const view = buildWeeklyLearningView([
    { date: '2026-10-28', wordsMastered: 1 },
    { date: '2026-10-29', wordsLearned: 20 },
  ], wednesday);
  assert.equal(view.activeDays, 1);
  assert.equal(view.percent, 20);
  assert.equal(view.days[2].future, false);
  assert.equal(view.days[3].future, true);
  assert.equal(view.days[3].active, false);
  assert.equal(view.days[3].record.wordsLearned, 0);
});

test('all seven days retain their count while goal progress is capped at 100 percent', () => {
  const history = Array.from({ length: 7 }, (_, index) => ({
    date: index < 6 ? `2026-10-${26 + index}` : '2026-11-01', readingsCompleted: 1,
  }));
  const view = buildWeeklyLearningView(history, new Date('2026-11-01T12:00:00+08:00'));
  assert.equal(view.activeDays, 7);
  assert.equal(view.targetDays, 5);
  assert.equal(view.percent, 100);
  assert.equal(view.streak, 7);
  assert.equal(view.milestone, 7);
  assert.equal(view.nextMilestone, 14);
});

test('time-only records remain visible without creating a learning day or milestone', () => {
  const view = buildWeeklyLearningView([{ date: '2026-10-28', timeSpent: 5 }], wednesday);
  assert.equal(view.activeDays, 0);
  assert.equal(view.days[2].record.timeSpent, 5);
  assert.equal(view.days[2].active, false);
  assert.equal(view.streak, 0);
  assert.equal(view.nextMilestone, 3);
});

test('Beijing midnight switches the week and the current day in a different host timezone', () => {
  const history = [{ date: '2026-10-25', wordsLearned: 1 }, { date: '2026-10-26', wordsLearned: 1 }];
  const before = buildWeeklyLearningView(history, new Date('2026-10-25T15:59:59Z'));
  const after = buildWeeklyLearningView(history, new Date('2026-10-25T16:00:00Z'));
  assert.equal(before.today, '2026-10-25');
  assert.equal(before.range.start, '2026-10-19');
  assert.equal(after.today, '2026-10-26');
  assert.equal(after.range.start, '2026-10-26');
  assert.equal(after.activeDays, 1);
  assert.equal(after.streak, 2);
});
