import catalog from './data/assignment-vocabulary.json' with { type: 'json' };
import { RETIRED_VOCABULARY } from '../shared/retiredVocabulary.js';
import { createExamAttempt } from '../shared/examAttempts.js';

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});

export async function handleExamAttempts(request, env, user) {
  if (!user) return json({ error: '请先登录。' }, 401);
  if (request.method === 'GET') {
    const rows = await env.DB.prepare('SELECT attempt_json FROM exam_attempts WHERE user_id=? ORDER BY completed_at DESC, id LIMIT 100').bind(user.id).all();
    return json({ attempts: rows.results.map(row => JSON.parse(row.attempt_json)) });
  }
  if (request.method !== 'POST') return json({ error: '接口不存在。' }, 404);
  if (request.headers.get('sec-fetch-site') === 'cross-site') return json({ error: '不允许跨站操作。' }, 403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return json({ error: '请使用 JSON 提交。' }, 415);
  const raw = await request.text();
  if (raw.length > 100000) return json({ error: '测试记录过大。' }, 413);
  let body;
  try { body = JSON.parse(raw); } catch { return json({ error: '测试记录无效。' }, 400); }
  if (!body || typeof body.id !== 'string' || !/^[\w-]{1,80}$/.test(body.id)) return json({ error: '测试记录无效。' }, 400);
  const existing = await env.DB.prepare('SELECT attempt_json FROM exam_attempts WHERE user_id=? AND id=?').bind(user.id, body.id).first();
  if (existing) return json({ attempt: JSON.parse(existing.attempt_json) });
  const progress = await env.DB.prepare('SELECT custom_words FROM user_progress WHERE user_id=?').bind(user.id).first();
  const custom = progress ? JSON.parse(progress.custom_words) : [];
  // Built-in vocabulary always wins; custom words must already belong to this account.
  // Accept offline answers from an older vocabulary version without reusing retired IDs.
  const gradingCatalog = [...catalog, ...RETIRED_VOCABULARY];
  const builtInIds = new Set(gradingCatalog.map(word => String(word.id)));
  let attempt;
  try { attempt = createExamAttempt(body, [...gradingCatalog, ...custom.filter(word => !builtInIds.has(String(word.id)))]); }
  catch (err) { return json({ error: err.message }, 400); }
  await env.DB.prepare('INSERT INTO exam_attempts (user_id,id,attempt_json,completed_at) VALUES (?,?,?,?) ON CONFLICT(user_id,id) DO NOTHING')
    .bind(user.id, attempt.id, JSON.stringify(attempt), attempt.completedAt).run();
  const saved = await env.DB.prepare('SELECT attempt_json FROM exam_attempts WHERE user_id=? AND id=?').bind(user.id, attempt.id).first();
  return json({ attempt: JSON.parse(saved.attempt_json) }, 201);
}
