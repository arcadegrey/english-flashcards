import readings from '../src/data/readings.js';
import { createReadingAttempt, wrongReadingQuestions } from '../shared/readingAttempts.js';
const json = (body,status=200) => new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const error = (message,status=400) => json({error:message},status);

export async function handleReadingAttempts(request,env,user) {
  if (!user) return error('请先登录。',401);
  const db=env.DB;
  if (request.method==='GET') {
    const rows=await db.prepare('SELECT attempt_json FROM reading_attempts WHERE user_id=? ORDER BY completed_at DESC LIMIT 100').bind(user.id).all();
    return json({attempts:rows.results.map(row=>JSON.parse(row.attempt_json))});
  }
  if (request.method!=='POST') return error('接口不存在。',404);
  if (request.headers.get('sec-fetch-site')==='cross-site') return error('不允许跨站操作。',403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return error('请使用 JSON 提交。',415);
  const body=await request.json().catch(()=>null);
  if (!body || typeof body !== 'object' || Array.isArray(body) || !/^[\w-]{1,80}$/.test(body.id || '') || !Number.isFinite(Date.parse(body.completedAt)) || Date.parse(body.completedAt)>Date.now()+300000) return error('阅读记录无效。');
  if ([body.parentId,body.assignmentId].some(value=>value && (typeof value!=='string' || !/^[\w-]{1,80}$/.test(value)))) return error('关联记录无效。');
  const existing=await db.prepare('SELECT attempt_json FROM reading_attempts WHERE user_id=? AND id=?').bind(user.id,body.id).first();
  if (existing) return json({attempt:JSON.parse(existing.attempt_json)});
  let article;
  if (body.parentId) {
    const parent=await db.prepare('SELECT attempt_json FROM reading_attempts WHERE user_id=? AND id=?').bind(user.id,body.parentId).first();
    if (!parent) return error('原始练习尚未同步，请先同步历史。',409);
    const attempt=JSON.parse(parent.attempt_json);
    article={...attempt.article,questions:wrongReadingQuestions(attempt)};
    if (!article.questions.length) return error('本次练习没有错题。');
  } else if (body.assignmentId) {
    const row=await db.prepare(`SELECT a.article_json,s.answers_json FROM reading_assignments a
      JOIN class_memberships m ON m.class_id=a.class_id AND m.student_id=?
      JOIN assignment_submissions s ON s.assignment_id=a.id AND s.student_id=? WHERE a.id=?`).bind(user.id,user.id,body.assignmentId).first();
    if (!row) return error('作业不存在、未提交或你已退出班级。',404);
    article=JSON.parse(row.article_json);
    body.answers=JSON.parse(row.answers_json);
  } else {
    const source=readings.find(item=>String(item.id)===String(body.articleId));
    if (body.article) {
      // Personal practice may have been completed offline on an older content revision.
      // Its snapshot is private; assignment grades always use the server-published snapshot above.
      if (!source || String(body.article.id)!==String(source.id) || JSON.stringify(body.article).length>200000) return error('文章快照无效。');
      article=body.article;
    } else article=source;
  }
  let attempt;
  try { attempt=createReadingAttempt({...body,article,completedAt:new Date(body.completedAt).toISOString()}); }
  catch(err) { return error(err.message); }
  await db.prepare('INSERT INTO reading_attempts (user_id,id,attempt_json,completed_at) VALUES (?,?,?,?) ON CONFLICT(user_id,id) DO NOTHING')
    .bind(user.id,attempt.id,JSON.stringify(attempt),attempt.completedAt).run();
  const saved=await db.prepare('SELECT attempt_json FROM reading_attempts WHERE user_id=? AND id=?').bind(user.id,attempt.id).first();
  return json({attempt:JSON.parse(saved.attempt_json)},201);
}
