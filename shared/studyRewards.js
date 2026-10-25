import { getStudyDateKey } from './studyDate.js';
import { weekRange } from './weeklyReport.js';
import { mergeStudyHistory } from './studyHistory.js';

// Existing progress retains 90 learning days; milestones stay within that verifiable range.
export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 90];
export function studyRewardProgress(history, now = new Date()) {
  const range = weekRange(now), today = getStudyDateKey(now);
  const active = mergeStudyHistory([], history).filter(day => day.date <= today && day.wordsLearned + day.wordsMastered + day.readingsCompleted + day.readingQuestionsAnswered + day.examQuestionsAnswered > 0);
  const dates = new Set(active.map(day => day.date));
  let streak = 0;
  let cursor = Date.parse(today);
  if (!dates.has(today)) cursor -= 86400000;
  while (dates.has(new Date(cursor).toISOString().slice(0, 10))) { streak += 1; cursor -= 86400000; }
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(Date.parse(range.start) + index * 86400000).toISOString().slice(0, 10);
    return { date, active: dates.has(date), today: date === today };
  });
  return { range, days, activeDays: days.filter(day => day.active).length, targetDays: 5, streak,
    milestone: [...STREAK_MILESTONES].reverse().find(value => streak >= value) || 0,
    nextMilestone: STREAK_MILESTONES.find(value => value > streak) || null };
}

export function availableStudyRewards({ progress, today, wordsDone, readingDone, examDone, allDone }) {
  return [
    ...(wordsDone ? [{ key: `words:${today}`, text: '今日新词目标已完成' }] : []),
    ...(readingDone ? [{ key: `reading:${today}`, text: '今日阅读任务已完成' }] : []),
    ...(examDone ? [{ key: `exam:${today}`, text: '今日考试巩固已完成' }] : []),
    ...(allDone ? [{ key: `daily:${today}`, text: '今天的学习计划全部完成' }] : []),
    ...(progress.activeDays >= progress.targetDays ? [{ key: `week:${progress.range.start}`, text: '本周已学习 5 天，周目标达成' }] : []),
    ...(progress.milestone ? [{ key: `streak:${progress.milestone}`, text: `连续学习 ${progress.milestone} 天里程碑达成` }] : []),
  ];
}
