import catalog from './data/assignment-vocabulary.json' with { type: 'json' };
import { WORD_ASSIGNMENT_CATEGORIES, selectAssignmentWords, buildWordAssignment, gradeWordAssignment } from '../shared/wordAssignments.js';

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const error = (message, status = 400) => json({ error: message }, status);
const parse = (text) => { try { return JSON.parse(text); } catch { return {}; } };
const view = (row) => ({ id: row.id, type: 'words', classId: row.class_id, className: row.class_name, title: row.title,
  scope: parse(row.scope_json), words: parse(row.words_json).map(({ answer, meaning, ...word }) => row.submitted_at ? { ...word, answer, meaning } : word),
  dueAt: row.due_at, createdAt: row.created_at, submittedAt: row.submitted_at || '',
  questionsAnswered: row.questions_answered ?? null, questionsCorrect: row.questions_correct ?? null,
  answers: row.submitted_at ? parse(row.answers_json) : {},
  status: row.submitted_at ? row.submitted_at > row.due_at ? 'submitted_late' : 'submitted' : new Date().toISOString() > row.due_at ? 'overdue' : 'pending' });
const memberAssignment = (db, id, userId) => db.prepare(`SELECT a.*,c.name AS class_name,s.answers_json,s.questions_answered,s.questions_correct,s.submitted_at
  FROM word_assignments a JOIN classes c ON c.id=a.class_id JOIN class_memberships m ON m.class_id=a.class_id AND m.student_id=?
  LEFT JOIN word_assignment_submissions s ON s.assignment_id=a.id AND s.student_id=? WHERE a.id=?`).bind(userId,userId,id).first();

export async function handleWordAssignments(request, env, user) {
  if (!user) return error('请先登录。', 401);
  if (!user.profileConfigured) return error('请先设置师生身份。', 403);
  if (request.method !== 'GET' && request.headers.get('sec-fetch-site') === 'cross-site') return error('不允许跨站操作。', 403);
  if (['POST','PUT'].includes(request.method) && !request.headers.get('content-type')?.startsWith('application/json')) return error('请使用 JSON 提交。', 415);
  const path = new URL(request.url).pathname;
  const db = env.DB;
  const method = request.method;
  const body = ['POST','PUT'].includes(method) ? await request.json().catch(() => null) : {};
  if (!body || typeof body !== 'object' || Array.isArray(body)) return error('请求内容无效。');
  const classMatch = path.match(/^\/api\/classes\/([\w-]+)\/word-assignments$/);
  if (classMatch) {
    if (user.role !== 'teacher') return error('只有老师可以管理作业。',403);
    const owned = await db.prepare('SELECT id FROM classes WHERE id=? AND teacher_id=?').bind(classMatch[1],user.id).first();
    if (!owned) return error('班级不存在或没有权限。',404);
    if (method === 'POST') {
      if (!Number.isFinite(Date.parse(body.dueAt)) || Date.parse(body.dueAt) <= Date.now()) return error('截止时间应晚于当前时间。');
      let words;
      try { words = buildWordAssignment(selectAssignmentWords(catalog, body)); } catch (err) { return error(err.message); }
      const id = crypto.randomUUID(), dueAt = new Date(body.dueAt).toISOString(), createdAt = new Date().toISOString();
      const scope = { category: body.category, start: body.start, count: body.count };
      const title = `${WORD_ASSIGNMENT_CATEGORIES[body.category]} · 第 ${body.start}–${body.start + body.count - 1} 词`;
      await db.prepare('INSERT INTO word_assignments (id,class_id,title,scope_json,words_json,due_at,created_at) VALUES (?,?,?,?,?,?,?)')
        .bind(id,owned.id,title,JSON.stringify(scope),JSON.stringify(words),dueAt,createdAt).run();
      return json({ assignment: { id, type:'words', title, scope, dueAt, createdAt } },201);
    }
    if (method === 'GET') {
      const rows = await db.prepare(`SELECT a.*,(SELECT COUNT(*) FROM class_memberships WHERE class_id=a.class_id) AS student_count,
        (SELECT COUNT(*) FROM word_assignment_submissions s JOIN class_memberships m ON m.student_id=s.student_id AND m.class_id=a.class_id WHERE s.assignment_id=a.id) AS submitted_count
        FROM word_assignments a WHERE class_id=? ORDER BY created_at DESC`).bind(owned.id).all();
      return json({ assignments: rows.results.map((row) => ({ ...view(row), studentCount:row.student_count, submittedCount:row.submitted_count })) });
    }
  }
  if (path === '/api/word-assignments' && method === 'GET') {
    if (user.role !== 'student') return error('只有学生可以查看个人任务。',403);
    const rows = await db.prepare(`SELECT a.*,c.name AS class_name,s.answers_json,s.questions_answered,s.questions_correct,s.submitted_at
      FROM word_assignments a JOIN classes c ON c.id=a.class_id JOIN class_memberships m ON m.class_id=a.class_id AND m.student_id=?
      LEFT JOIN word_assignment_submissions s ON s.assignment_id=a.id AND s.student_id=? ORDER BY a.due_at,a.created_at DESC`).bind(user.id,user.id).all();
    return json({ assignments: rows.results.map(view) });
  }
  const match = path.match(/^\/api\/word-assignments\/([\w-]+)\/(submit|submissions|session)$/);
  if (match) {
    const [,id,action] = match;
    if (action === 'submissions' && method === 'GET') {
      if (user.role !== 'teacher') return error('只有老师可以查看成绩。',403);
      const assignment = await db.prepare('SELECT a.* FROM word_assignments a JOIN classes c ON c.id=a.class_id WHERE a.id=? AND c.teacher_id=?').bind(id,user.id).first();
      if (!assignment) return error('作业不存在或没有权限。',404);
      const students = await db.prepare(`SELECT u.id,u.email,p.display_name,s.submitted_at,s.questions_answered,s.questions_correct
        FROM class_memberships m JOIN users u ON u.id=m.student_id LEFT JOIN account_profiles p ON p.user_id=u.id
        LEFT JOIN word_assignment_submissions s ON s.assignment_id=? AND s.student_id=u.id WHERE m.class_id=? ORDER BY p.display_name,u.id`).bind(id,assignment.class_id).all();
      return json({ assignment:view(assignment), students:students.results.map((row) => ({ id:String(row.id),displayName:row.display_name || row.email,email:row.email,
        submittedAt:row.submitted_at || '',questionsAnswered:row.questions_answered,questionsCorrect:row.questions_correct,status:view({...assignment,...row}).status })) });
    }
    if (user.role !== 'student') return error('只有学生可以完成作业。',403);
    const assignment = await memberAssignment(db,id,user.id);
    if (!assignment) return error('作业不存在或你已退出班级。',404);
    const words = parse(assignment.words_json);
    if (action === 'session' && ['GET','PUT'].includes(method)) {
      if (method === 'PUT') {
        if (!Number.isFinite(Date.parse(body.updatedAt)) || Date.parse(body.updatedAt) > Date.now()+300000) return error('保存时间无效。');
        const answers = gradeWordAssignment(words,body.answers).answers;
        await db.prepare(`INSERT INTO word_assignment_sessions (user_id,assignment_id,answers_json,updated_at) VALUES (?,?,?,?)
          ON CONFLICT(user_id,assignment_id) DO UPDATE SET answers_json=excluded.answers_json,updated_at=excluded.updated_at WHERE word_assignment_sessions.updated_at<excluded.updated_at`)
          .bind(user.id,id,JSON.stringify(answers),new Date(body.updatedAt).toISOString()).run();
      }
      const row = await db.prepare('SELECT * FROM word_assignment_sessions WHERE user_id=? AND assignment_id=?').bind(user.id,id).first();
      return json({session:row ? {answers:parse(row.answers_json),updatedAt:row.updated_at} : null});
    }
    if (action === 'submit' && method === 'POST') {
      const grade = gradeWordAssignment(words,body.answers);
      if (grade.questionsAnswered !== words.length) return error('请完成全部词汇题后提交。');
      await db.prepare(`INSERT INTO word_assignment_submissions (assignment_id,student_id,answers_json,questions_answered,questions_correct,submitted_at)
        SELECT ?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM class_memberships WHERE class_id=? AND student_id=?) ON CONFLICT(assignment_id,student_id) DO NOTHING`)
        .bind(id,user.id,JSON.stringify(grade.answers),grade.questionsAnswered,grade.questionsCorrect,new Date().toISOString(),assignment.class_id,user.id).run();
      const saved = await memberAssignment(db,id,user.id);
      if (!saved?.submitted_at) return error('班级关系已变更，请刷新。',409);
      return json({assignment:view(saved)});
    }
  }
  return error('接口不存在。',404);
}
