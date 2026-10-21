import { normalizeReadingQuestions, gradeReadingAnswers } from './readingQuestions.js';

export function createReadingAttempt({ id, article, answers, completedAt, parentId = '', assignmentId = '' }) {
  const questions = normalizeReadingQuestions(article?.questions);
  if (!id || !article?.id || !questions.length || typeof article.title!=='string' || !article.title.trim() || typeof article.content!=='string' || !article.content.trim()) throw new Error('阅读记录缺少文章或题目。');
  if (questions.length>40 || new Set(questions.map(q=>q.id)).size!==questions.length || questions.some(q=>
    !q.answer || q.options.length<2 || q.options.length>8 || new Set(q.options.map(option=>option.id)).size!==q.options.length ||
    !q.options.some(option=>option.id.toLowerCase()===q.answer.toLowerCase()))) throw new Error('题目或正确答案无效。');
  const grade = gradeReadingAnswers({questions}, answers);
  if (grade.questionsAnswered !== questions.length) throw new Error('请完成全部阅读题后保存练习。');
  return { id, parentId, assignmentId, completedAt,
    article: { id: article.id, title: article.title.slice(0,500), level: String(article.level || '').slice(0,10), content: article.content,
      translation: typeof article.translation==='string' ? article.translation : '', estimatedMinutes: Math.max(1,Math.min(60,Number(article.estimatedMinutes) || 1)), questions },
    ...grade };
}

export function wrongReadingQuestions(attempt) {
  return normalizeReadingQuestions(attempt?.article?.questions)
    .filter((question) => attempt.answers?.[question.id]?.toLowerCase() !== question.answer.toLowerCase());
}

export function mergeReadingAttempts(...lists) {
  const map = new Map();
  lists.flat().forEach((item) => {
    if (item?.id && Array.isArray(item.article?.questions) && item.answers && Number.isFinite(Date.parse(item.completedAt))) map.set(item.id,item);
  });
  return [...map.values()].sort((a,b) => b.completedAt.localeCompare(a.completedAt)).slice(0,100);
}

// The latest attempt of the same original question determines whether it still needs practice.
export function collectReadingMistakes(attempts) {
  const latest = new Map();
  for (const attempt of mergeReadingAttempts(attempts)) {
    for (const question of normalizeReadingQuestions(attempt.article.questions)) {
      const key = `${attempt.article.id}:${question.id}:${question.prompt}:${question.answer}`;
      if (!latest.has(key)) latest.set(key,{attempt,question});
    }
  }
  return [...latest.values()].filter(({attempt,question}) => attempt.answers[question.id]?.toLowerCase() !== question.answer.toLowerCase());
}

// Reserve cache space for unsynced attempts even when another device has newer history.
export function boundReadingAttemptCache(attempts, pending) {
  const pendingIds = [...new Set(pending)];
  const pendingSet = new Set(pendingIds);
  const protectedItems = mergeReadingAttempts(attempts.filter(item => pendingSet.has(item?.id)));
  const recent = mergeReadingAttempts(attempts).filter(item => !pendingSet.has(item.id));
  const kept = mergeReadingAttempts(protectedItems, recent.slice(0, 100 - protectedItems.length));
  const ids = new Set(kept.map(item => item.id));
  return { attempts: kept, pending: pendingIds.filter(id => ids.has(id)) };
}
