import { getStudyDateKey } from '../../shared/studyDate.js';
import { summarizeStudyHistory } from '../../shared/studyHistory.js';

export const getAccountRoleLabel = (user) => user?.profileConfigured
  ? user.role === 'teacher' ? '老师' : '学生' : '学习者';

export const formatClassroomDate = (value) => {
  if (!value) return '暂无同步记录';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '暂无同步记录'
    : date.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
};

export const buildStudentWordRows = (progress = {}, vocabulary = [], now = new Date()) => {
  const lookup = new Map(vocabulary.map((word) => [String(word.id), word]));
  (progress.customWords || []).forEach((word) => lookup.set(String(word.id), word));
  const learned = new Set((progress.learnedWords || []).map(String));
  const mastered = new Set((progress.masteredWords || []).map(String));
  const wrong = new Set((progress.wrongWords || []).map(String));
  const today = getStudyDateKey(now);
  return [...new Set([...learned, ...mastered, ...wrong])].map((id) => {
    const word = lookup.get(id);
    const schedule = progress.wordProgress?.[id] || {};
    const dueDate = getStudyDateKey(schedule.nextReview || '');
    const isMastered = mastered.has(id);
    const hasSchedule = Boolean(progress.wordProgress?.[id]);
    return {
      id, word: word?.word || `词条 #${id}`, meaning: word?.meaning || '词条内容暂未加载',
      phonetic: word?.phonetic || '', missing: !word,
      status: isMastered ? 'mastered' : learned.has(id) ? 'learned' : 'wrong',
      wrong: wrong.has(id) && !isMastered,
      due: (learned.has(id) || isMastered) && (!hasSchedule || (Boolean(dueDate) && dueDate <= today)),
      lastReviewed: schedule.lastReviewed || '', nextReview: schedule.nextReview || '',
    };
  });
};

export const buildStudentReadingOverview = (history = [], articles = [], now = new Date()) => {
  const summary = summarizeStudyHistory(history, now);
  const lookup = new Map(articles.map((article) => [String(article.id), article]));
  const rows = summary.history.flatMap((day) => {
    const results = new Map(day.readingArticleResults.map((result) => [result.articleId, result]));
    return day.readingArticleIds.map((articleId) => {
      const article = lookup.get(articleId);
      const result = results.get(articleId);
      const answered = result?.questionsAnswered || 0;
      return {
        id: `${day.date}:${articleId}`, articleId,
        title: article?.title || `文章 #${articleId}`,
        level: article?.level || '', examType: article?.examType || '',
        completedAt: result?.completedAt || day.date,
        questionsAnswered: answered, questionsCorrect: result?.questionsCorrect || 0,
        accuracy: answered ? Math.round(result.questionsCorrect / answered * 100) : null,
        hasResult: Boolean(result),
      };
    });
  }).sort((a, b) => b.completedAt.localeCompare(a.completedAt) || a.articleId.localeCompare(b.articleId));
  return { ...summary, rows,
    accuracy: summary.totals.readingQuestionsAnswered
      ? Math.round(summary.totals.readingQuestionsCorrect / summary.totals.readingQuestionsAnswered * 100) : null,
  };
};
