const DAY_NAMES_CN = ['日', '一', '二', '三', '四', '五', '六'];

const toNumber = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);

export const getDateKey = (date = new Date()) => date.toISOString().split('T')[0];

export const isActiveStudyDay = (item = {}) =>
  toNumber(item.wordsLearned) +
    toNumber(item.wordsMastered) +
    toNumber(item.readingsCompleted) +
    toNumber(item.readingQuestionsAnswered) +
    toNumber(item.examQuestionsAnswered) >
  0;

export const getActiveStudyDates = (studyHistory = []) =>
  new Set(
    (Array.isArray(studyHistory) ? studyHistory : [])
      .filter(isActiveStudyDay)
      .map((item) => String(item.date || '').trim())
      .filter(Boolean)
  );

export const calculateStudyStreak = (studyHistory = []) => {
  const activeDates = getActiveStudyDates(studyHistory);
  const todayKey = getDateKey();
  let streak = 0;
  const cursor = new Date();

  while (true) {
    const dateKey = getDateKey(cursor);
    if (activeDates.has(dateKey)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }

    if (dateKey === todayKey) {
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }

    break;
  }

  return streak;
};

export const getWeekStudyDays = (studyHistory = []) => {
  const activeDates = getActiveStudyDates(studyHistory);
  const today = new Date();
  const monday = new Date(today);
  const day = monday.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diffToMonday);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const dateKey = getDateKey(date);

    return {
      date: dateKey,
      label: DAY_NAMES_CN[date.getDay()],
      isDone: activeDates.has(dateKey),
      isToday: dateKey === getDateKey(today),
    };
  });
};

export const getLast7StudyDays = (studyHistory = []) => {
  const safeHistory = Array.isArray(studyHistory) ? studyHistory : [];
  const days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = getDateKey(date);
    const dayData = safeHistory.find((item) => item.date === dateStr) || {};

    days.push({
      date: dateStr,
      dayName: DAY_NAMES_CN[date.getDay()],
      day: date.getDate(),
      wordsLearned: toNumber(dayData.wordsLearned),
      wordsMastered: toNumber(dayData.wordsMastered),
      readingsCompleted: toNumber(dayData.readingsCompleted),
      readingQuestionsAnswered: toNumber(dayData.readingQuestionsAnswered),
      readingQuestionsCorrect: toNumber(dayData.readingQuestionsCorrect),
      examQuestionsAnswered: toNumber(dayData.examQuestionsAnswered),
      examQuestionsCorrect: toNumber(dayData.examQuestionsCorrect),
      timeSpent: toNumber(dayData.timeSpent),
    });
  }

  return days;
};

export const summarizeStudyHistory = (studyHistory = []) =>
  (Array.isArray(studyHistory) ? studyHistory : []).reduce(
    (summary, item) => ({
      words:
        summary.words +
        toNumber(item.wordsLearned) +
        toNumber(item.wordsMastered),
      readings: summary.readings + toNumber(item.readingsCompleted),
      readingQuestions: summary.readingQuestions + toNumber(item.readingQuestionsAnswered),
      readingCorrect: summary.readingCorrect + toNumber(item.readingQuestionsCorrect),
      examQuestions: summary.examQuestions + toNumber(item.examQuestionsAnswered),
      examCorrect: summary.examCorrect + toNumber(item.examQuestionsCorrect),
      minutes: summary.minutes + toNumber(item.timeSpent),
    }),
    {
      words: 0,
      readings: 0,
      readingQuestions: 0,
      readingCorrect: 0,
      examQuestions: 0,
      examCorrect: 0,
      minutes: 0,
    }
  );

export const buildReadingCompletionMap = (studyHistory = []) => {
  const map = new Map();

  (Array.isArray(studyHistory) ? studyHistory : []).forEach((item) => {
    const articleResults = Array.isArray(item.readingArticleResults) ? item.readingArticleResults : [];
    articleResults.forEach((result) => {
      const key = String(result?.articleId || '').trim();
      if (!key) return;
      const current = map.get(key) || {
        completed: false,
        completedCount: 0,
        questionsAnswered: 0,
        questionsCorrect: 0,
        lastPracticedAt: '',
      };
      const completedAt = String(result.completedAt || item.date || '').trim();

      map.set(key, {
        completed: true,
        completedCount: current.completedCount + 1,
        questionsAnswered: current.questionsAnswered + toNumber(result.questionsAnswered),
        questionsCorrect: current.questionsCorrect + toNumber(result.questionsCorrect),
        lastPracticedAt: completedAt && completedAt > current.lastPracticedAt ? completedAt : current.lastPracticedAt,
      });
    });

    const articleIds = Array.isArray(item.readingArticleIds) ? item.readingArticleIds : [];
    const date = String(item.date || '').trim();
    articleIds.forEach((articleId) => {
      const key = String(articleId);
      if (map.has(key)) return;
      const current = map.get(key) || {
        completed: false,
        completedCount: 0,
        questionsAnswered: 0,
        questionsCorrect: 0,
        lastPracticedAt: '',
      };

      map.set(key, {
        completed: true,
        completedCount: current.completedCount + 1,
        questionsAnswered: current.questionsAnswered,
        questionsCorrect: current.questionsCorrect,
        lastPracticedAt: date && date > current.lastPracticedAt ? date : current.lastPracticedAt,
      });
    });
  });

  return map;
};
