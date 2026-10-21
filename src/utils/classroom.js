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
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return [...new Set([...learned, ...mastered, ...wrong])].map((id) => {
    const word = lookup.get(id);
    const schedule = progress.wordProgress?.[id] || {};
    const dueDate = new Date(schedule.nextReview);
    dueDate.setHours(0, 0, 0, 0);
    const isMastered = mastered.has(id);
    const hasSchedule = Boolean(progress.wordProgress?.[id]);
    return {
      id, word: word?.word || `词条 #${id}`, meaning: word?.meaning || '词条内容暂未加载',
      phonetic: word?.phonetic || '', missing: !word,
      status: isMastered ? 'mastered' : learned.has(id) ? 'learned' : 'wrong',
      wrong: wrong.has(id) && !isMastered,
      due: (learned.has(id) || isMastered) && (!hasSchedule || (!Number.isNaN(dueDate.getTime()) && dueDate <= today)),
      lastReviewed: schedule.lastReviewed || '', nextReview: schedule.nextReview || '',
    };
  });
};
