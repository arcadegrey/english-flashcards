import readings from '../src/data/readings.js';
import { gradeReadingAnswers, validateReadingAnswers } from '../shared/readingQuestions.js';

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});
const error = (message, status = 400) => json({ error: message }, status);
const parse = (text, fallback = {}) => { try { return JSON.parse(text) || fallback; } catch { return fallback; } };
const assignmentView = (row) => ({
  id: row.id, classId: row.class_id, className: row.class_name, articleId: row.article_id,
  article: parse(row.article_json), dueAt: row.due_at, createdAt: row.created_at,
  submittedAt: row.submitted_at || '', questionsAnswered: row.questions_answered ?? null,
  questionsCorrect: row.questions_correct ?? null,
  answers: row.submitted_at ? parse(row.answers_json) : {},
  status: row.submitted_at ? row.submitted_at > row.due_at ? 'submitted_late' : 'submitted'
    : new Date().toISOString() > row.due_at ? 'overdue' : 'pending',
});

const studentAssignment = (db, assignmentId, userId) => db.prepare(
  `SELECT a.*, c.name AS class_name, s.submitted_at, s.questions_answered, s.questions_correct,s.answers_json
   FROM reading_assignments a JOIN classes c ON c.id=a.class_id
   JOIN class_memberships m ON m.class_id=a.class_id AND m.student_id=?
   LEFT JOIN assignment_submissions s ON s.assignment_id=a.id AND s.student_id=? WHERE a.id=?`
).bind(userId, userId, assignmentId).first();

export const handleReadingApi = async (request, env, user) => {
  if (!user) return error('请先登录账号。', 401);
  if (request.method !== 'GET' && request.headers.get('sec-fetch-site') === 'cross-site') return error('不允许跨站操作。', 403);
  if (['POST', 'PUT'].includes(request.method) && !request.headers.get('content-type')?.startsWith('application/json')) return error('请使用 JSON 提交。', 415);
  const url = new URL(request.url);
  const db = env.DB;
  const method = request.method;
  const body = ['POST', 'PUT'].includes(method) ? await request.json().catch(() => null) : {};
  if (!body || typeof body !== 'object' || Array.isArray(body)) return error('请求内容无效。');

  const draftMatch = url.pathname.match(/^\/api\/reading-sessions\/([^/]+)$/);
  if (draftMatch) {
    const key = decodeURIComponent(draftMatch[1]);
    let article;
    if (key.startsWith('assignment:')) {
      if (user.role !== 'student') return error('只有学生可以完成作业。', 403);
      const assignment = await studentAssignment(db, key.slice(11), user.id);
      if (!assignment) return error('作业不存在或你已退出班级。', 404);
      article = parse(assignment.article_json);
    } else if (key.startsWith('reading:')) article = readings.find((item) => String(item.id) === key.slice(8));
    if (!article) return error('阅读内容不存在。', 404);
    if (method === 'PUT') {
      if (!Number.isFinite(Date.parse(body.updatedAt)) || Date.parse(body.updatedAt) > Date.now() + 300000) return error('保存时间无效，请检查设备时间。');
      const answers = validateReadingAnswers(article, body.answers);
      const updatedAt = new Date(body.updatedAt).toISOString();
      await db.prepare(`INSERT INTO reading_sessions (user_id,session_key,answers_json,updated_at) VALUES (?,?,?,?)
        ON CONFLICT(user_id,session_key) DO UPDATE SET answers_json=excluded.answers_json,updated_at=excluded.updated_at
        WHERE reading_sessions.updated_at < excluded.updated_at`)
        .bind(user.id, key, JSON.stringify(answers), updatedAt).run();
    } else if (method !== 'GET') return error('接口不存在。', 404);
    const session = await db.prepare('SELECT answers_json,updated_at FROM reading_sessions WHERE user_id=? AND session_key=?')
      .bind(user.id, key).first();
    return json({ session: session ? { answers: parse(session.answers_json), updatedAt: session.updated_at } : null });
  }

  if (!user.profileConfigured) return error('请先设置老师或学生身份。', 403);
  if (url.pathname === '/api/assignments' && method === 'GET') {
    if (user.role !== 'student') return error('只有学生可以查看个人作业。', 403);
    const rows = await db.prepare(`SELECT a.*, c.name AS class_name, s.submitted_at,s.questions_answered,s.questions_correct,s.answers_json
      FROM reading_assignments a JOIN classes c ON c.id=a.class_id
      JOIN class_memberships m ON m.class_id=a.class_id AND m.student_id=?
      LEFT JOIN assignment_submissions s ON s.assignment_id=a.id AND s.student_id=?
      ORDER BY CASE WHEN s.submitted_at IS NULL THEN 0 ELSE 1 END, a.due_at, a.created_at DESC`)
      .bind(user.id, user.id).all();
    return json({ assignments: rows.results.map(assignmentView) });
  }
  const classMatch = url.pathname.match(/^\/api\/classes\/([\w-]+)\/assignments$/);
  if (classMatch) {
    if (user.role !== 'teacher') return error('只有老师可以发布和管理作业。', 403);
    const owned = await db.prepare('SELECT id FROM classes WHERE id=? AND teacher_id=?').bind(classMatch[1], user.id).first();
    if (!owned) return error('班级不存在或没有访问权限。', 404);
    if (method === 'POST') {
      const article = readings.find((item) => String(item.id) === String(body.articleId));
      if (!article?.questions?.length) return error('请选择带有题目的阅读文章。');
      if (!Number.isFinite(Date.parse(body.dueAt)) || Date.parse(body.dueAt) <= Date.now()) return error('截止时间应晚于当前时间。');
      const assignment = { id: crypto.randomUUID(), dueAt: new Date(body.dueAt).toISOString(), createdAt: new Date().toISOString() };
      await db.prepare('INSERT INTO reading_assignments (id,class_id,article_id,article_json,due_at,created_at) VALUES (?,?,?,?,?,?)')
        .bind(assignment.id, owned.id, String(article.id), JSON.stringify(article), assignment.dueAt, assignment.createdAt).run();
      return json({ assignment: { ...assignment, articleId: String(article.id) } }, 201);
    }
    if (method === 'GET') {
      const rows = await db.prepare(`SELECT a.*,
        (SELECT COUNT(*) FROM class_memberships m WHERE m.class_id=a.class_id) AS student_count,
        (SELECT COUNT(*) FROM assignment_submissions s JOIN class_memberships m
          ON m.class_id=a.class_id AND m.student_id=s.student_id WHERE s.assignment_id=a.id) AS submitted_count
        FROM reading_assignments a WHERE a.class_id=? ORDER BY a.created_at DESC`).bind(owned.id).all();
      return json({ assignments: rows.results.map((row) => ({ ...assignmentView(row), studentCount: row.student_count, submittedCount: row.submitted_count })) });
    }
  }
  const assignmentMatch = url.pathname.match(/^\/api\/assignments\/([\w-]+)\/(submit|submissions)$/);
  if (assignmentMatch) {
    const [, id, action] = assignmentMatch;
    if (action === 'submit' && method === 'POST') {
      if (user.role !== 'student') return error('只有学生可以提交作业。', 403);
      const assignment = await studentAssignment(db, id, user.id);
      if (!assignment) return error('作业不存在或你已退出班级。', 404);
      const grade = gradeReadingAnswers(parse(assignment.article_json), body.answers);
      if (!grade.questionsTotal || grade.questionsAnswered !== grade.questionsTotal) return error('请完成全部阅读题后提交作业。');
      const now = new Date().toISOString();
      // Keep the first submission immutable; retries return the same result.
      await db.prepare(`INSERT INTO assignment_submissions
        (assignment_id,student_id,answers_json,questions_answered,questions_correct,submitted_at)
        SELECT ?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM class_memberships WHERE class_id=? AND student_id=?)
        ON CONFLICT(assignment_id,student_id) DO NOTHING`)
        .bind(id, user.id, JSON.stringify(grade.answers), grade.questionsAnswered, grade.questionsCorrect, now, assignment.class_id, user.id).run();
      const saved = await studentAssignment(db, id, user.id);
      if (!saved?.submitted_at) return error('班级关系已变更，请刷新后重试。', 409);
      return json({ assignment: assignmentView(saved) });
    }
    if (action === 'submissions' && method === 'GET') {
      if (user.role !== 'teacher') return error('只有老师可以查看提交情况。', 403);
      const assignment = await db.prepare(`SELECT a.* FROM reading_assignments a JOIN classes c ON c.id=a.class_id
        WHERE a.id=? AND c.teacher_id=?`).bind(id, user.id).first();
      if (!assignment) return error('作业不存在或没有访问权限。', 404);
      const rows = await db.prepare(`SELECT u.id,u.email,p.display_name,s.submitted_at,s.questions_answered,s.questions_correct
        FROM class_memberships m JOIN users u ON u.id=m.student_id
        LEFT JOIN account_profiles p ON p.user_id=u.id
        LEFT JOIN assignment_submissions s ON s.assignment_id=? AND s.student_id=u.id
        WHERE m.class_id=? ORDER BY CASE WHEN s.submitted_at IS NULL THEN 0 ELSE 1 END,p.display_name,u.id`)
        .bind(id, assignment.class_id).all();
      return json({ assignment: assignmentView(assignment), students: rows.results.map((row) => ({
        id: String(row.id), email: row.email, displayName: row.display_name || row.email.split('@')[0],
        submittedAt: row.submitted_at || '', questionsAnswered: row.questions_answered, questionsCorrect: row.questions_correct,
        status: assignmentView({ ...assignment, ...row }).status,
      })) });
    }
  }
  return error('接口不存在。', 404);
};
