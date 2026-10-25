// One product-wide calendar, independent of browser/server timezone.
// Legacy YYYY-MM-DD summaries remain on their recorded day: without event
// timestamps they cannot safely be redistributed across the new midnight.
export const STUDY_TIME_ZONE = 'Asia/Shanghai';
const formatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: STUDY_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
});
export function getStudyDateKey(value = new Date()) {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const date = new Date(`${value}T00:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value ? value : '';
  }
  if (value == null || value === '') return '';
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return '';
  const parts = Object.fromEntries(formatter.formatToParts(date).map(part => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}
export function shiftStudyDate(key, days) {
  const date = new Date(`${key}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
export const studyDayStart = key => new Date(`${key}T00:00:00+08:00`).toISOString();
export const studyDayOfWeek = key => new Date(`${key}T00:00:00Z`).getUTCDay();
export function studyWeekRange(value = new Date()) {
  const key = getStudyDateKey(value);
  if (!key) throw new Error('周日期无效。');
  const start = shiftStudyDate(key, -(studyDayOfWeek(key) + 6) % 7);
  return { start, end: shiftStudyDate(start, 7), last: shiftStudyDate(start, 6) };
}
