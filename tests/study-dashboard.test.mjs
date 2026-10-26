import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDailyPlan } from '../src/utils/dailyPlan.js';
import { buildStudyDeck, dashboardGreeting, dashboardStudyTime, formatStudyMinutes, carouselPosition, carouselDragStep } from '../src/utils/studyDashboard.js';

const base = { wordCount: 100, readingCount: 2, remaining: 80, target: 15 };
const deck = (change = {}, extra = {}) => buildStudyDeck({ plan: buildDailyPlan({ ...base, ...change }), categoryName: '雅思词汇', wordCount: change.wordCount ?? 100,
  remaining: change.remaining ?? 80, ...extra });

test('dashboard uses the current real vocabulary category, daily progress and article metadata', () => {
  const cards = deck({ wordsStudied: 6, examAnswered: 3, examCorrect: 2 }, { suggestedReading: { id: 13, title: 'Wetlands', examType: 'IELTS', level: 'B2', estimatedMinutes: 4 } });
  assert.equal(cards[0].title, '雅思词汇'); assert.equal(cards[0].progress, 40);
  assert.equal(cards[0].actionLabel, '继续学习'); assert.equal(cards[2].title, 'Wetlands');
  assert.equal(cards[2].meta, 'IELTS · B2 · 约 4 分钟');
  assert.equal(cards[3].progress, 60); assert.match(cards[3].progressLabel, /67%/);
  assert.ok(!JSON.stringify(cards).includes('Lesson'));
});

test('preparing and failure states have no invented completion or runnable study action', () => {
  const preparing = deck({ ready: false });
  assert.equal(preparing.length, 1); assert.equal(preparing[0].id, 'preparing');
  assert.equal(preparing[0].action, null); assert.equal(preparing[0].progress, undefined);
  const failed = deck({ ready: false }, { planError: '词库加载失败' });
  assert.equal(failed[0].action, 'retry'); assert.equal(failed[0].description, '词库加载失败');
});

test('empty content offers training; exhausted vocabulary offers settings without inventing new words', () => {
  const empty = deck({ wordCount: 0, readingCount: 0, remaining: 0 });
  assert.equal(empty.length, 1); assert.equal(empty[0].id, 'empty'); assert.equal(empty[0].action, 'training');
  const exhausted = deck({ remaining: 0 });
  assert.equal(exhausted.find(card => card.id === 'words').action, 'settings');
  assert.equal(exhausted.find(card => card.id === 'words').progress, undefined);
});

test('missing recommendation falls back to article selection and unavailable reading/testing cannot be started', () => {
  const fallback = deck();
  assert.equal(fallback.find(card => card.id === 'reading').action, 'reading');
  assert.equal(fallback.find(card => card.id === 'reading').title, '读一篇英语短文');
  const unavailable = deck({ wordCount: 0, readingCount: 0, remaining: 0, reviewCount: 2 });
  assert.equal(unavailable.find(card => card.id === 'reading').action, null);
  assert.equal(unavailable.find(card => card.id === 'exam').action, null);
  assert.ok(!unavailable.find(card => card.id === 'exam').progressLabel.includes('0%'));
});

test('task completion and reduced word goals retain existing daily plan rules', () => {
  const reduced = deck({ remaining: 2, wordsStudied: 3 });
  assert.match(reduced[0].progressLabel, /3 \/ 5/); assert.match(reduced[0].progressLabel, /原目标 15/);
  const completed = deck({ wordsStudied: 15, readingsCompleted: 1, examAnswered: 5, examCorrect: 4 });
  assert.equal(completed[0].id, 'complete'); assert.equal(completed[0].progress, 100);
  assert.equal(completed[0].action, 'statistics');
  const due = buildDailyPlan({ ...base, reviewCount: 2, wordsStudied: 15, readingsCompleted: 1, examAnswered: 5 });
  assert.equal(due.priority, 'review'); assert.ok(!buildStudyDeck({ plan: due }).some(card => card.id === 'complete'));
});

test('greeting uses actual account identity and Beijing time independently of the host timezone', () => {
  assert.equal(dashboardGreeting({ displayName: '小林' }, new Date('2026-10-26T06:00:00Z')), '下午好，小林');
  assert.equal(dashboardGreeting({ displayName: '另一位用户' }, new Date('2026-10-26T06:00:00Z')), '下午好，另一位用户');
  assert.equal(dashboardGreeting({ displayName: '   ', email: 'amy@example.test' }, new Date('2026-10-26T06:00:00Z')), '下午好，amy');
  assert.equal(dashboardGreeting({ email: 'student@example.test' }, new Date('2026-10-26T01:00:00Z')), '上午好，student');
  assert.equal(dashboardGreeting(null, new Date('2026-10-26T12:00:00Z')), '晚上好，学习者');
  assert.equal(dashboardGreeting(null, new Date('2026-10-25T17:00:00Z')), '夜深了，学习者');
});

test('recorded study time is limited to 90 days and this Beijing week without double counting duplicate days', () => {
  const history = [
    { date: '2026-10-26', timeSpent: 20 }, { date: '2026-10-26', timeSpent: 15 },
    { date: '2026-10-25', timeSpent: 60 }, { date: '2026-10-27', timeSpent: 200 },
    { date: '2026-01-01', timeSpent: 1000 }, { date: '2026-10-20', timeSpent: -10 },
  ];
  assert.deepEqual(dashboardStudyTime(history, new Date('2026-10-26T06:00:00Z')), { minutes: 80, weekMinutes: 20 });
  assert.equal(formatStudyMinutes(0), '0 分钟'); assert.equal(formatStudyMinutes(90), '1.5 小时');
  assert.equal(formatStudyMinutes(Infinity), '0 分钟');
});

test('carousel relative positions wrap in both directions and single cards stay centered', () => {
  assert.equal(carouselPosition(3, 0, 4), -1); assert.equal(carouselPosition(0, 3, 4), 1);
  assert.equal(carouselPosition(1, 1, 4), 0); assert.equal(carouselPosition(0, 0, 1), 0);
});

test('carousel drag snaps exactly one card, tolerates short taps and scales threshold for mobile', () => {
  assert.equal(carouselDragStep(-120, 1000), 1); assert.equal(carouselDragStep(120, 1000), -1);
  assert.equal(carouselDragStep(20, 1000), 0); assert.equal(carouselDragStep(-50, 320), 1);
  assert.equal(carouselDragStep(-2000, 1000), 1);
});
