export const DAILY_NEW_WORD_TARGETS = [10, 15, 25, 40, 70, 100];
export const PLAN_CATEGORY_IDS = ['all', 'daily', 'cet4', 'cet6', 'toefl', 'ielts'];

export const normalizePreferences = (value) => ({
  ...(DAILY_NEW_WORD_TARGETS.includes(Number(value?.dailyNewWordTarget)) ? { dailyNewWordTarget: Number(value.dailyNewWordTarget) } : {}),
  ...(PLAN_CATEGORY_IDS.includes(value?.studyPlanCategory) ? { studyPlanCategory: value.studyPlanCategory } : {}),
  ...(Number.isFinite(Date.parse(value?.updatedAt)) ? { updatedAt: new Date(value.updatedAt).toISOString() } : {}),
});

export const mergePreferences = (base, incoming) => {
  const left = normalizePreferences(base);
  const right = normalizePreferences(incoming);
  return (Date.parse(right.updatedAt) || 0) < (Date.parse(left.updatedAt) || 0)
    ? { ...right, ...left } : { ...left, ...right };
};
