import { WORD_ASSIGNMENT_CATEGORIES } from './wordAssignments.js';
import { DICTATION_MAX_LENGTH, evaluateDictation, isDictationExample } from './dictation.js';

export const EXAM_MODE_LABELS = { quiz: '选择测验', fillblank: '例句填空', spelling: '听音拼写', matching: '单词配对', dictation: '句子听写' };
export const EXAM_ROUND_SIZE = 20;
const validId = (value) => typeof value === 'string' && /^[\w-]{1,80}$/.test(value);

// Personal practice is open-book. Derive scores from answers, never submitted totals.
// A server catalog can be supplied to resolve words instead of trusting client snapshots.
export function createExamAttempt(value, catalog, dictationCatalog) {
  if (!value || !validId(value.id) || !Object.hasOwn(EXAM_MODE_LABELS, value.mode)
    || !Object.hasOwn(WORD_ASSIGNMENT_CATEGORIES, value.category)
    || !['all', 'learned', 'mastered'].includes(value.scope)) throw new Error('测试记录范围无效。');
  const start = Date.parse(value.startedAt), end = Date.parse(value.completedAt);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start || end > Date.now() + 300000) throw new Error('测试时间无效。');
  if (!Array.isArray(value.answers) || !value.answers.length || value.answers.length > EXAM_ROUND_SIZE) throw new Error('每组测试需记录 1–20 次答题。');
  const lookup = catalog && new Map(catalog.map(word => [String(word.id), word]));
  const answers = value.answers.map(answer => {
    const word = lookup ? lookup.get(String(answer?.wordId)) : answer;
    if (!word || typeof word.word !== 'string' || !word.word.trim() || word.word.length > 200
      || typeof word.meaning !== 'string' || word.meaning.length > 2000) throw new Error('测试词条无效，请同步词库后重试。');
    const wordId = String(answer?.wordId ?? '');
    if (!wordId || wordId.length > 100) throw new Error('测试词条无效。');
    if (lookup && value.category !== 'all' && !(word.categories || [word.category]).includes(value.category)) throw new Error('测试词条不在计划词库中。');
    if (value.mode === 'dictation') {
      const registered = lookup && dictationCatalog
        ? dictationCatalog[wordId]?.find(item => item.word === word.word && item.example === answer.example)
        : lookup ? word : answer;
      if (!registered || !isDictationExample({ ...registered, id: wordId })
        || registered.example !== answer.example) throw new Error('听写例句无效，请更新词库后重试。');
      if (typeof answer.input !== 'string' || answer.input.length > DICTATION_MAX_LENGTH
        || !answer.input.trim() && answer.revealed !== true
        || ['hintUsed', 'revealed'].some(field => answer[field] !== undefined && typeof answer[field] !== 'boolean')) throw new Error('听写答案无效。');
      return { wordId, word: word.word, meaning: word.meaning,
        example: registered.example, exampleCn: String(registered.exampleCn || '').slice(0, 2000),
        input: answer.input, hintUsed: answer.hintUsed === true, revealed: answer.revealed === true,
        correct: answer.revealed !== true && evaluateDictation(registered.example, answer.input).correct };
    }
    const input = value.mode === 'spelling' ? answer.input : String(answer.selectedWordId ?? '');
    if (typeof input !== 'string' || !input.trim() || input.length > 200) throw new Error('测试答案无效。');
    if (lookup && value.mode !== 'spelling' && !lookup.has(input)) throw new Error('所选答案不在词库中。');
    const correct = value.mode === 'spelling' ? input.trim().toLowerCase() === word.word.toLowerCase() : input === wordId;
    return { wordId, word: word.word, meaning: word.meaning,
      ...(value.mode === 'spelling' ? { input } : { selectedWordId: input }), correct };
  });
  return { id: value.id, mode: value.mode, category: value.category, scope: value.scope,
    startedAt: new Date(start).toISOString(), completedAt: new Date(end).toISOString(), answers,
    questionsAnswered: answers.length, questionsCorrect: answers.filter(answer => answer.correct).length };
}

export function mergeExamAttempts(...lists) {
  const map = new Map();
  for (const value of lists.flat()) {
    try { const attempt = createExamAttempt(value); map.set(attempt.id, attempt); } catch { /* Ignore damaged cache entries. */ }
  }
  return [...map.values()].sort((a, b) => b.completedAt.localeCompare(a.completedAt) || a.id.localeCompare(b.id));
}

export function boundExamCache(attempts, pending) {
  const all = mergeExamAttempts(attempts);
  const pendingIds = [...new Set(pending)].filter(id => all.some(item => item.id === id));
  if (pendingIds.length > 100) throw new Error('待同步测试已达 100 次，请先同步成绩。');
  const kept = [...all.filter(item => pendingIds.includes(item.id)), ...all.filter(item => !pendingIds.includes(item.id)).slice(0, 100 - pendingIds.length)];
  return { attempts: mergeExamAttempts(kept), pending: pendingIds };
}
