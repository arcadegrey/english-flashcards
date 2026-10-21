const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});
const error = (message, status = 400) => json({ error: message }, status);
const parse = (value, fallback) => {
  try { return JSON.parse(value) ?? fallback; } catch { return fallback; }
};
const array = (value) => { const result = parse(value, []); return Array.isArray(result) ? result : []; };
const record = (value) => { const result = parse(value, {}); return result && typeof result === 'object' && !Array.isArray(result) ? result : {}; };
const ids = (values) => [...new Set(values.filter((id) => id != null).map(String))];
export const createInviteCode = () => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from(crypto.getRandomValues(new Uint8Array(10)), (byte) => alphabet[byte & 31]).join('');
};

export const profileFields = (row) => ({
  role: row.role === 'teacher' ? 'teacher' : 'student',
  displayName: String(row.display_name || row.email?.split('@')[0] || '学习者'),
  profileConfigured: Boolean(row.role),
});

const summary = (row) => {
  const mastered = new Set(ids(array(row.mastered_words)));
  const history = array(row.study_history);
  const today = new Date().toISOString().slice(0, 10);
  const todayRecord = history.find((item) => item.date === today);
  return {
    id: String(row.student_id || row.user_id || row.id), email: row.email,
    displayName: row.display_name || row.email?.split('@')[0] || '学生',
    joinedAt: row.joined_at,
    learnedCount: ids(array(row.learned_words)).filter((id) => !mastered.has(id)).length,
    masteredCount: mastered.size,
    wrongCount: ids(array(row.wrong_words)).filter((id) => !mastered.has(id)).length,
    todayStudied: Number(todayRecord?.wordsLearned || 0) + Number(todayRecord?.wordsMastered || 0),
    lastSyncedAt: row.updated_at || '',
  };
};

export const handleClassroomApi = async (request, env, user) => {
  if (!user) return error('请先登录账号。', 401);
  if (request.headers.get('sec-fetch-site') === 'cross-site' && request.method !== 'GET') return error('不允许跨站操作。', 403);
  if (request.method === 'POST' && !request.headers.get('content-type')?.startsWith('application/json')) return error('请使用 JSON 提交。', 415);
  const url = new URL(request.url);
  const path = url.pathname;
  const db = env.DB;
  const now = new Date().toISOString();
  const body = request.method === 'POST' ? await request.json().catch(() => null) : {};
  if (!body || typeof body !== 'object' || Array.isArray(body)) return error('请求内容无效。');

  if (path === '/api/classroom/profile' && request.method === 'POST') {
    const role = body.role;
    const name = String(body.displayName || '').trim();
    if (!['teacher', 'student'].includes(role) || !name || name.length > 40) return error('请选择老师或学生身份，并填写 1–40 字的姓名。');
    // The conditional upsert also prevents a concurrent role change during class joining/creation.
    const result = await db.prepare(`INSERT INTO account_profiles (user_id, role, display_name, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET
      role = excluded.role, display_name = excluded.display_name, updated_at = excluded.updated_at
      WHERE account_profiles.role = excluded.role OR (
        NOT EXISTS (SELECT 1 FROM classes WHERE teacher_id = excluded.user_id) AND
        NOT EXISTS (SELECT 1 FROM class_memberships WHERE student_id = excluded.user_id))`)
      .bind(user.id, role, name, now, now).run();
    if (!result.meta.changes) return error('已有班级关联，不能切换身份。学生请先退出班级。', 409);
    return json({ user: { id: user.id, email: user.email, role, displayName: name, profileConfigured: true } });
  }

  if (path === '/api/classroom' && request.method === 'GET') {
    const classes = user.role === 'teacher'
      ? await db.prepare(`SELECT c.id, c.name, c.invite_code AS inviteCode, c.created_at AS createdAt,
          (SELECT COUNT(*) FROM class_memberships m WHERE m.class_id = c.id) AS studentCount
          FROM classes c WHERE c.teacher_id = ? ORDER BY c.created_at DESC`).bind(user.id).all()
      : await db.prepare(`SELECT c.id, c.name, m.joined_at AS joinedAt,
          COALESCE(p.display_name, '老师') AS teacherName
          FROM class_memberships m JOIN classes c ON c.id = m.class_id
          LEFT JOIN account_profiles p ON p.user_id = c.teacher_id
          WHERE m.student_id = ? ORDER BY m.joined_at DESC`).bind(user.id).all();
    return json({ profile: user, classes: classes.results });
  }

  if (!user.profileConfigured) return error('请先设置老师或学生身份。', 403);

  if (path === '/api/classes' && request.method === 'POST') {
    if (user.role !== 'teacher') return error('只有老师可以创建班级。', 403);
    const name = String(body.name || '').trim();
    if (!name || name.length > 60) return error('班级名称需要 1–60 个字。');
    const classroom = { id: crypto.randomUUID(), name, inviteCode: createInviteCode(), createdAt: now, studentCount: 0 };
    const result = await db.prepare(`INSERT INTO classes (id, teacher_id, name, invite_code, created_at)
      SELECT ?, ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM account_profiles WHERE user_id = ? AND role = 'teacher')`)
      .bind(classroom.id, user.id, name, classroom.inviteCode, now, user.id).run();
    if (!result.meta.changes) return error('身份已变更，请刷新后重试。', 409);
    return json({ classroom }, 201);
  }

  if (path === '/api/classes/join' && request.method === 'POST') {
    if (user.role !== 'student') return error('只有学生可以加入班级。', 403);
    const code = String(body.inviteCode || '').replace(/\s/g, '').toUpperCase();
    if (!/^[A-HJ-NP-Z2-9]{10}$/.test(code)) return error('请输入 10 位班级邀请码。');
    await db.prepare(`INSERT INTO class_memberships (class_id, student_id, joined_at)
      SELECT c.id, ?, ? FROM classes c JOIN account_profiles p ON p.user_id = ? AND p.role = 'student'
      WHERE c.invite_code = ? AND c.teacher_id != ? ON CONFLICT(class_id, student_id) DO NOTHING`)
      .bind(user.id, now, user.id, code, user.id).run();
    const joined = await db.prepare(`SELECT c.id, c.name FROM classes c JOIN class_memberships m ON m.class_id = c.id
      WHERE c.invite_code = ? AND m.student_id = ?`).bind(code, user.id).first();
    if (!joined) return error('邀请码无效或已更新，请向老师确认。', 404);
    return json({ classroom: joined });
  }

  const match = path.match(/^\/api\/classes\/([\w-]+)\/(students(?:\/(\d+)(?:\/progress)?)?|invite-code|membership)$/);
  if (!match) return error('接口不存在。', 404);
  const [, classId, action, studentId] = match;
  if (action === 'membership' && request.method === 'DELETE') {
    if (user.role !== 'student') return error('只有学生可以退出班级。', 403);
    await db.prepare('DELETE FROM class_memberships WHERE class_id = ? AND student_id = ?').bind(classId, user.id).run();
    return json({ message: '已退出班级，老师无法再查看你的记录。' });
  }

  if (user.role !== 'teacher') return error('只有老师可以查看学生记录。', 403);
  const owned = await db.prepare('SELECT id FROM classes WHERE id = ? AND teacher_id = ?').bind(classId, user.id).first();
  if (!owned) return error('班级不存在或你没有访问权限。', 404);

  if (action === 'invite-code' && request.method === 'POST') {
    const inviteCode = createInviteCode();
    await db.prepare('UPDATE classes SET invite_code = ? WHERE id = ? AND teacher_id = ?').bind(inviteCode, classId, user.id).run();
    return json({ inviteCode });
  }
  if (studentId && request.method === 'DELETE' && !action.endsWith('/progress')) {
    await db.prepare('DELETE FROM class_memberships WHERE class_id = ? AND student_id = ?').bind(classId, studentId).run();
    return json({ message: '已移除学生。' });
  }
  if (studentId && action.endsWith('/progress') && request.method === 'GET') {
    const row = await db.prepare(`SELECT u.id AS student_id, u.email, p.display_name, m.joined_at,
        up.learned_words, up.mastered_words, up.wrong_words, up.word_progress, up.study_history, up.custom_words, up.updated_at
      FROM class_memberships m JOIN users u ON u.id = m.student_id
      JOIN account_profiles p ON p.user_id = u.id AND p.role = 'student'
      LEFT JOIN user_progress up ON up.user_id = u.id
      WHERE m.class_id = ? AND m.student_id = ?`).bind(classId, studentId).first();
    if (!row) return error('学生不在此班级中。', 404);
    const learnedWords = array(row.learned_words);
    const masteredWords = array(row.mastered_words);
    const wrongWords = array(row.wrong_words);
    const tracked = new Set(ids([...learnedWords, ...masteredWords, ...wrongWords]));
    return json({ student: summary(row), updatedAt: row.updated_at || '', progress: {
      learnedWords, masteredWords, wrongWords,
      // Unstudied private custom words and unrelated scheduling entries are not shared.
      customWords: array(row.custom_words).filter((word) => tracked.has(String(word.id))),
      wordProgress: Object.fromEntries(Object.entries(record(row.word_progress)).filter(([id]) => tracked.has(id))),
      studyHistory: array(row.study_history),
    } });
  }
  if (action === 'students' && request.method === 'GET') {
    const page = Math.max(1, Math.min(100000, Math.floor(Number(url.searchParams.get('page')) || 1)));
    const pageSize = 20;
    const total = await db.prepare('SELECT COUNT(*) AS count FROM class_memberships WHERE class_id = ?').bind(classId).first();
    const students = await db.prepare(`SELECT u.id AS student_id, u.email, p.display_name, m.joined_at,
        up.learned_words, up.mastered_words, up.wrong_words, up.study_history, up.updated_at
      FROM class_memberships m JOIN users u ON u.id = m.student_id
      LEFT JOIN account_profiles p ON p.user_id = u.id LEFT JOIN user_progress up ON up.user_id = u.id
      WHERE m.class_id = ? ORDER BY m.joined_at, m.student_id LIMIT ? OFFSET ?`)
      .bind(classId, pageSize, (page - 1) * pageSize).all();
    return json({ students: students.results.map(summary), page, pageSize, total: total.count });
  }
  return error('接口不存在。', 404);
};
