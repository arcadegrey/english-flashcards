// Optional per-day category counters. Old aggregate-only days remain unchanged.
const categories = ['daily', 'cet4', 'cet6', 'toefl', 'ielts'];
const count = value => Number.isFinite(Number(value)) ? Math.max(0, Math.floor(Number(value))) : 0;
export function normalizeExamCategories(value) {
  const result = {};
  for (const category of categories) {
    const answered = count(value?.[category]?.answered);
    if (answered) result[category] = { answered, correct: Math.min(answered, count(value[category].correct)) };
  }
  return result;
}
export function mergeExamCategories(base, incoming) {
  const left = normalizeExamCategories(base), right = normalizeExamCategories(incoming);
  return normalizeExamCategories(Object.fromEntries(categories.map(category => [category, {
    answered: Math.max(left[category]?.answered || 0, right[category]?.answered || 0),
    correct: Math.max(left[category]?.correct || 0, right[category]?.correct || 0),
  }])));
}
export function getDailyPlanExamActivity(day, category = 'all', legacy = {}) {
  if (category === 'all') {
    const answered = count(day?.examQuestionsAnswered);
    return { answered, correct: Math.min(answered, count(day?.examQuestionsCorrect)) };
  }
  const old = legacy.date === day?.date ? legacy.categories : {};
  const activity = mergeExamCategories(day?.examByCategory, old);
  return Object.hasOwn(activity, category) ? activity[category] : { answered: 0, correct: 0 };
}
