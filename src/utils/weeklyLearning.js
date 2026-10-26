import { getStudyDateKey } from '../../shared/studyDate.js';
import { mergeStudyHistory, normalizeStudyHistoryItem } from '../../shared/studyHistory.js';
import { studyRewardProgress } from '../../shared/studyRewards.js';

export const WEEKDAY_LABELS = ['一', '二', '三', '四', '五', '六', '日'];
export const formatStudyMonthDay = date => `${Number(date.slice(5, 7))}月${Number(date.slice(8))}日`;

// Read-only presentation model; keep weekly eligibility, streaks and history merging canonical.
export function buildWeeklyLearningView(history = [], now = new Date()) {
  const today = getStudyDateKey(now);
  const progress = studyRewardProgress(history, now);
  const records = new Map(mergeStudyHistory([], history).map(day => [day.date, day]));
  return {
    ...progress,
    today,
    percent: Math.min(100, Math.round(progress.activeDays / progress.targetDays * 100)),
    days: progress.days.map((day, index) => ({
      ...day,
      label: WEEKDAY_LABELS[index],
      number: day.date.slice(-2),
      future: day.date > today,
      record: (day.date <= today && records.get(day.date)) || normalizeStudyHistoryItem({ date: day.date }),
    })),
  };
}
