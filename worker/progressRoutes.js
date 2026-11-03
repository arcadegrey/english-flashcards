import { normalizePreferences, mergePreferences } from '../shared/planPreferences.js';
import { normalizeStudyHistory, preserveExamCategoryHistory } from '../shared/studyHistory.js';
import { json, errorJson, parseJsonBody } from './http.js';
import { getSessionUser } from './authSession.js';
import { EMPTY_PROGRESS, normalizeProgress, mergeProgress, parseProgressText, parseProgressObjectText } from './progressModel.js';

export const handleGetProgress = async (request, env) => {
  const user = await getSessionUser(env, request);
  if (!user) {
    return errorJson('请先登录账号。', 401, 'UNAUTHORIZED');
  }

  const row = await env.DB.prepare(
    `SELECT learned_words, mastered_words, custom_words, word_progress, wrong_words, study_history, preferences, updated_at
     FROM user_progress
     WHERE user_id = ?
     LIMIT 1`
  )
    .bind(user.id)
    .first();

  if (!row) {
    return json({ progress: EMPTY_PROGRESS, updatedAt: '' });
  }

  return json({
    progress: {
      learnedWords: parseProgressText(row.learned_words),
      masteredWords: parseProgressText(row.mastered_words),
      customWords: parseProgressText(row.custom_words),
      wordProgress: parseProgressObjectText(row.word_progress),
      wrongWords: parseProgressText(row.wrong_words),
      studyHistory: normalizeStudyHistory(parseProgressText(row.study_history)),
      preferences: normalizePreferences(parseProgressObjectText(row.preferences)),
    },
    updatedAt: String(row.updated_at || ''),
  });
};

export const handlePutProgress = async (request, env) => {
  const user = await getSessionUser(env, request);
  if (!user) {
    return errorJson('请先登录账号。', 401, 'UNAUTHORIZED');
  }

  const body = await parseJsonBody(request);
  const normalized = normalizeProgress(body?.progress || body || EMPTY_PROGRESS);
  const baseUpdatedAt = String(body?.baseUpdatedAt || '').trim();
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const existing = await env.DB.prepare(
      'SELECT * FROM user_progress WHERE user_id = ? LIMIT 1'
    ).bind(user.id).first();
    const existingProgress = existing ? {
      learnedWords: parseProgressText(existing.learned_words),
      masteredWords: parseProgressText(existing.mastered_words),
      customWords: parseProgressText(existing.custom_words),
      wordProgress: parseProgressObjectText(existing.word_progress),
      wrongWords: parseProgressText(existing.wrong_words),
      studyHistory: parseProgressText(existing.study_history),
      preferences: parseProgressObjectText(existing.preferences),
    } : EMPTY_PROGRESS;
    const conflictResolved = Boolean(existing) && (!baseUpdatedAt || baseUpdatedAt !== existing.updated_at);
    const finalProgress = conflictResolved ? mergeProgress(existingProgress, normalized) : normalized;
    // An older client omitting preferences must never erase saved settings.
    finalProgress.preferences = mergePreferences(existingProgress.preferences, normalized.preferences);
    finalProgress.studyHistory = preserveExamCategoryHistory(existingProgress.studyHistory, finalProgress.studyHistory);
    const updatedAt = new Date(Math.max(Date.now(), (Date.parse(existing?.updated_at) || 0) + 1)).toISOString();
    const saved = await env.DB.prepare(
      `INSERT INTO user_progress (user_id, learned_words, mastered_words, custom_words, word_progress, wrong_words, study_history, preferences, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET learned_words=excluded.learned_words,
       mastered_words=excluded.mastered_words, custom_words=excluded.custom_words,
       word_progress=excluded.word_progress, wrong_words=excluded.wrong_words,
       study_history=excluded.study_history, preferences=excluded.preferences, updated_at=excluded.updated_at
       WHERE user_progress.updated_at = ?`
    ).bind(user.id, JSON.stringify(finalProgress.learnedWords), JSON.stringify(finalProgress.masteredWords),
      JSON.stringify(finalProgress.customWords), JSON.stringify(finalProgress.wordProgress),
      JSON.stringify(finalProgress.wrongWords), JSON.stringify(finalProgress.studyHistory),
      JSON.stringify(finalProgress.preferences), updatedAt, existing?.updated_at || '').run();
    if (saved.meta.changes) return json({ updatedAt, progress: finalProgress, conflictResolved });
  }
  return errorJson('进度正在其他设备更新，请重试同步。', 409, 'SYNC_CONFLICT');
};
