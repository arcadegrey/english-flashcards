import { weekRange, buildWeeklyReport } from '../shared/weeklyReport.js';
import catalog from './data/assignment-vocabulary.json' with { type: 'json' };
import articles from '../src/data/readings.js';

const json = (body, status = 200) => new Response(JSON.stringify(body), { status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

export async function handleWeeklyReport(request, env, user) {
  if (!user) return json({ error: '请先登录。' }, 401);
  if (user.role !== 'teacher' || !user.profileConfigured) return json({ error: '只有老师可以查看班级周报。' }, 403);
  if (request.method !== 'GET') return json({ error: '接口不存在。' }, 404);
  const url = new URL(request.url);
  const classId = url.pathname.match(/^\/api\/classes\/([\w-]+)\/weekly-report$/)?.[1];
  const owned = await env.DB.prepare('SELECT id FROM classes WHERE id=? AND teacher_id=?').bind(classId, user.id).first();
  if (!owned) return json({ error: '班级不存在或没有权限。' }, 404);
  let range;
  try {
    const week = url.searchParams.get('week');
    if (week && (!/^\d{4}-\d{2}-\d{2}$/.test(week) || new Date(week).toISOString().slice(0, 10) !== week)) throw new Error();
    range = weekRange(week || new Date());
    if (range.start > weekRange().start) throw new Error();
  } catch { return json({ error: '请选择有效的本周或历史周。' }, 400); }
  const db = env.DB, from = `${range.start}T00:00:00.000Z`, to = `${range.end}T00:00:00.000Z`;
  const results = await Promise.all([
    db.prepare(`SELECT u.id,u.email,p.display_name,up.study_history,up.updated_at FROM class_memberships m
      JOIN users u ON u.id=m.student_id JOIN account_profiles p ON p.user_id=u.id AND p.role='student'
      LEFT JOIN user_progress up ON up.user_id=u.id WHERE m.class_id=? ORDER BY p.display_name,u.id`).bind(classId).all(),
    db.prepare(`SELECT e.* FROM exam_attempts e JOIN class_memberships m ON m.student_id=e.user_id
      WHERE m.class_id=? AND e.completed_at>=? AND e.completed_at<?`).bind(classId, from, to).all(),
    db.prepare(`SELECT r.* FROM reading_attempts r JOIN class_memberships m ON m.student_id=r.user_id
      WHERE m.class_id=? AND r.completed_at>=? AND r.completed_at<? ORDER BY r.completed_at`).bind(classId, from, to).all(),
    db.prepare(`SELECT id,'reading' AS type,due_at,article_json,NULL AS words_json FROM reading_assignments WHERE class_id=?
      UNION ALL SELECT id,'words' AS type,due_at,NULL AS article_json,words_json FROM word_assignments WHERE class_id=?`).bind(classId, classId).all(),
    db.prepare(`SELECT s.*,'reading' AS type FROM assignment_submissions s JOIN reading_assignments a ON a.id=s.assignment_id
      JOIN class_memberships m ON m.class_id=a.class_id AND m.student_id=s.student_id WHERE a.class_id=?
      UNION ALL SELECT s.*,'words' AS type FROM word_assignment_submissions s JOIN word_assignments a ON a.id=s.assignment_id
      JOIN class_memberships m ON m.class_id=a.class_id AND m.student_id=s.student_id WHERE a.class_id=?`).bind(classId, classId).all(),
  ]);
  const [students, exams, readings, assignments, submissions] = results.map(result => result.results);
  return json(buildWeeklyReport({ students, exams, readings, assignments, submissions, range, catalog, articles }));
}
