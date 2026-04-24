const COOKIE_NAME = 'ef_session';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY_PROGRESS = {
  learnedWords: [],
  masteredWords: [],
  customWords: [],
  wordProgress: {},
  wrongWords: [],
  studyHistory: [],
};

const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...headers,
    },
  });

const errorJson = (message, status = 400, code = 'BAD_REQUEST') =>
  json(
    {
      error: message,
      code,
    },
    status
  );

const nowIso = () => new Date().toISOString();

const addSecondsIso = (seconds) => new Date(Date.now() + seconds * 1000).toISOString();

const toInt = (value, fallback) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
};

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

const parseJsonBody = async (request) => {
  try {
    return await request.json();
  } catch {
    return {};
  }
};

const parseCookie = (cookieHeader = '') => {
  const result = {};
  cookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .forEach((part) => {
      const index = part.indexOf('=');
      if (index <= 0) return;
      const key = part.slice(0, index).trim();
      const value = part.slice(index + 1).trim();
      result[key] = value;
    });
  return result;
};

const randomDigits = (length = 6) => {
  const values = new Uint8Array(length);
  crypto.getRandomValues(values);
  return Array.from(values, (value) => String(value % 10)).join('');
};

const randomToken = (bytes = 32) => {
  const values = new Uint8Array(bytes);
  crypto.getRandomValues(values);
  return Array.from(values, (value) => value.toString(16).padStart(2, '0')).join('');
};

const sha256Hex = async (input) => {
  const data = new TextEncoder().encode(String(input || ''));
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const hashCode = async (email, mode, code, secret) =>
  sha256Hex(`${secret}:otp:${mode}:${normalizeEmail(email)}:${String(code || '')}`);

const hashSessionToken = async (token, secret) => sha256Hex(`${secret}:session:${String(token || '')}`);

const normalizeIdArray = (value) => {
  const list = Array.isArray(value) ? value : [];
  const seen = new Set();
  const output = [];
  for (const item of list) {
    if (item == null) continue;
    const key = String(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    output.push(item);
  }
  return output;
};

const normalizeCustomWords = (value) => {
  const list = Array.isArray(value) ? value : [];
  return list.filter((item) => item && typeof item === 'object' && String(item.word || '').trim());
};

const normalizeRecord = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {});

const normalizeStudyHistory = (value) => {
  const list = Array.isArray(value) ? value : [];
  return list.filter((item) => item && typeof item === 'object' && String(item.date || '').trim());
};

const countFilledFields = (word) => {
  if (!word || typeof word !== 'object') return 0;
  const keys = ['phonetic', 'pos', 'meaning', 'example', 'exampleCn', 'category', 'level', 'list'];
  return keys.reduce((count, key) => {
    const value = String(word[key] ?? '').trim();
    return value ? count + 1 : count;
  }, 0);
};

const pickRicherWord = (currentWord, incomingWord) => {
  if (!currentWord) return incomingWord;
  if (!incomingWord) return currentWord;
  return countFilledFields(incomingWord) >= countFilledFields(currentWord) ? incomingWord : currentWord;
};

const mergeCustomWordList = (baseList, extraList) => {
  const map = new Map();
  const applyList = (list) => {
    const safeList = Array.isArray(list) ? list : [];
    safeList.forEach((word) => {
      const key = String(word?.word || '').trim().toLowerCase();
      if (!key) return;
      map.set(key, pickRicherWord(map.get(key), word));
    });
  };

  applyList(baseList);
  applyList(extraList);
  return Array.from(map.values());
};

const normalizeProgress = (progress) => ({
  learnedWords: normalizeIdArray(progress?.learnedWords),
  masteredWords: normalizeIdArray(progress?.masteredWords),
  customWords: normalizeCustomWords(progress?.customWords),
  wordProgress: normalizeRecord(progress?.wordProgress),
  wrongWords: normalizeIdArray(progress?.wrongWords),
  studyHistory: normalizeStudyHistory(progress?.studyHistory),
});

const mergeStudyHistory = (baseList, incomingList) => {
  const map = new Map();
  [...normalizeStudyHistory(baseList), ...normalizeStudyHistory(incomingList)].forEach((item) => {
    const date = String(item.date || '').trim();
    if (!date) return;
    const current = map.get(date) || { date, wordsLearned: 0, wordsMastered: 0, timeSpent: 0 };
    map.set(date, {
      date,
      wordsLearned: Math.max(Number(current.wordsLearned || 0), Number(item.wordsLearned || 0)),
      wordsMastered: Math.max(Number(current.wordsMastered || 0), Number(item.wordsMastered || 0)),
      timeSpent: Math.max(Number(current.timeSpent || 0), Number(item.timeSpent || 0)),
    });
  });

  return Array.from(map.values())
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
    .slice(-90);
};

const mergeProgress = (baseProgress, incomingProgress) => {
  const base = normalizeProgress(baseProgress);
  const incoming = normalizeProgress(incomingProgress);

  const masteredWords = normalizeIdArray([...(base.masteredWords || []), ...(incoming.masteredWords || [])]);
  const masteredSet = new Set(masteredWords.map((item) => String(item)));
  const learnedWords = normalizeIdArray([
    ...(base.learnedWords || []),
    ...(incoming.learnedWords || []),
  ]).filter((item) => !masteredSet.has(String(item)));
  const customWords = mergeCustomWordList(base.customWords || [], incoming.customWords || []);
  const wordProgress = {
    ...(base.wordProgress || {}),
    ...(incoming.wordProgress || {}),
  };
  const wrongWords = normalizeIdArray([...(base.wrongWords || []), ...(incoming.wrongWords || [])]).filter(
    (item) => !masteredSet.has(String(item))
  );
  const studyHistory = mergeStudyHistory(base.studyHistory || [], incoming.studyHistory || []);

  return {
    learnedWords,
    masteredWords,
    customWords,
    wordProgress,
    wrongWords,
    studyHistory,
  };
};

const parseProgressText = (value) => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const parseProgressObjectText = (value) => {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
};

const buildClientSession = (user, ttlSeconds) => ({
  access_token: 'cookie-session',
  refresh_token: '',
  expires_at: Math.floor(Date.now() / 1000) + ttlSeconds,
  user,
});

const ensureEnv = (env) => {
  if (!env?.DB) {
    throw new Error('D1 未绑定，请检查 wrangler.toml 的 DB binding。');
  }
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET 未配置。');
  }
  if (!env?.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY 未配置。');
  }
  if (!env?.RESEND_FROM_EMAIL) {
    throw new Error('RESEND_FROM_EMAIL 未配置。');
  }
};

const getUserByEmail = async (env, email) =>
  env.DB.prepare('SELECT id, email FROM users WHERE email = ? LIMIT 1').bind(email).first();

const sendCodeEmail = async (env, email, code, mode) => {
  const modeText = mode === 'register' ? '注册' : '登录';
  const subject = `英语单词卡片 ${modeText}验证码：${code}`;
  const text = `你的${modeText}验证码是 ${code}，10 分钟内有效。`; 
  const html = `<p>你的${modeText}验证码是 <strong>${code}</strong>，10 分钟内有效。</p>`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: [email],
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`发送邮件失败（${response.status}）${detail ? `: ${detail}` : ''}`);
  }
};

const getSessionUser = async (env, request) => {
  const cookies = parseCookie(request.headers.get('cookie') || '');
  const sessionToken = cookies[COOKIE_NAME];
  if (!sessionToken) return null;

  const sessionHash = await hashSessionToken(sessionToken, env.SESSION_SECRET);
  const row = await env.DB.prepare(
    `SELECT s.id, s.expires_at, u.id AS user_id, u.email
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.id = ?
     LIMIT 1`
  )
    .bind(sessionHash)
    .first();

  if (!row) return null;

  if (new Date(row.expires_at).getTime() <= Date.now()) {
    await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionHash).run();
    return null;
  }

  return {
    id: String(row.user_id),
    email: String(row.email || ''),
  };
};

const createSessionCookie = (token, request, ttlSeconds) => {
  const protocol = new URL(request.url).protocol;
  const secure = protocol === 'https:' ? '; Secure' : '';
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${ttlSeconds}${secure}`;
};

const clearSessionCookie = (request) => {
  const protocol = new URL(request.url).protocol;
  const secure = protocol === 'https:' ? '; Secure' : '';
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
};

const handleSendCode = async (request, env) => {
  ensureEnv(env);

  const body = await parseJsonBody(request);
  const email = normalizeEmail(body.email);
  const mode = body.mode === 'register' ? 'register' : 'login';

  if (!EMAIL_REGEX.test(email)) {
    return errorJson('请输入有效邮箱地址。', 400, 'INVALID_EMAIL');
  }

  const existingUser = await getUserByEmail(env, email);
  if (mode === 'register' && existingUser) {
    return errorJson('该邮箱已注册，请直接登录。', 409, 'EMAIL_EXISTS');
  }
  if (mode === 'login' && !existingUser) {
    return errorJson('账号不存在，请先注册。', 404, 'USER_NOT_FOUND');
  }

  const sendIntervalSeconds = toInt(env.LOGIN_CODE_SEND_INTERVAL_SECONDS, 60);
  const latestCode = await env.DB.prepare(
    `SELECT created_at FROM login_codes
     WHERE email = ? AND mode = ?
     ORDER BY created_at DESC
     LIMIT 1`
  )
    .bind(email, mode)
    .first();

  if (latestCode?.created_at) {
    const elapsedMs = Date.now() - new Date(latestCode.created_at).getTime();
    if (elapsedMs >= 0 && elapsedMs < sendIntervalSeconds * 1000) {
      return errorJson('验证码发送过于频繁，请稍后再试。', 429, 'TOO_MANY_REQUESTS');
    }
  }

  const code = randomDigits(6);
  const codeTtlSeconds = toInt(env.LOGIN_CODE_TTL_SECONDS, 600);
  const codeHash = await hashCode(email, mode, code, env.SESSION_SECRET);
  const createdAt = nowIso();
  const expiresAt = addSecondsIso(codeTtlSeconds);

  await env.DB.prepare(
    `INSERT INTO login_codes (email, mode, code_hash, expires_at, attempts, created_at, consumed_at)
     VALUES (?, ?, ?, ?, 0, ?, NULL)`
  )
    .bind(email, mode, codeHash, expiresAt, createdAt)
    .run();

  await sendCodeEmail(env, email, code, mode);

  return json({
    message: '验证码已发送，请查收邮箱。',
  });
};

const handleVerifyCode = async (request, env) => {
  ensureEnv(env);

  const body = await parseJsonBody(request);
  const email = normalizeEmail(body.email);
  const mode = body.mode === 'register' ? 'register' : 'login';
  const code = String(body.code || '').trim();

  if (!EMAIL_REGEX.test(email)) {
    return errorJson('请输入有效邮箱地址。', 400, 'INVALID_EMAIL');
  }
  if (!/^\d{6}$/.test(code)) {
    return errorJson('请输入 6 位数字验证码。', 400, 'INVALID_CODE_FORMAT');
  }

  const codeRow = await env.DB.prepare(
    `SELECT id, code_hash, expires_at, attempts
     FROM login_codes
     WHERE email = ? AND mode = ? AND consumed_at IS NULL
     ORDER BY created_at DESC
     LIMIT 1`
  )
    .bind(email, mode)
    .first();

  if (!codeRow) {
    return errorJson('请先发送验证码。', 400, 'CODE_NOT_FOUND');
  }

  if (new Date(codeRow.expires_at).getTime() <= Date.now()) {
    await env.DB.prepare('UPDATE login_codes SET consumed_at = ? WHERE id = ?').bind(nowIso(), codeRow.id).run();
    return errorJson('验证码已过期，请重新发送。', 400, 'CODE_EXPIRED');
  }

  if (toInt(codeRow.attempts, 0) >= 5) {
    return errorJson('验证码尝试次数过多，请重新发送。', 429, 'TOO_MANY_ATTEMPTS');
  }

  const expectedHash = await hashCode(email, mode, code, env.SESSION_SECRET);
  if (expectedHash !== String(codeRow.code_hash || '')) {
    await env.DB.prepare('UPDATE login_codes SET attempts = attempts + 1 WHERE id = ?').bind(codeRow.id).run();
    return errorJson('验证码错误，请重试。', 400, 'CODE_MISMATCH');
  }

  await env.DB.prepare('UPDATE login_codes SET consumed_at = ? WHERE id = ?').bind(nowIso(), codeRow.id).run();

  let user = await getUserByEmail(env, email);
  const loginAt = nowIso();

  if (mode === 'register') {
    if (user) {
      return errorJson('该邮箱已注册，请直接登录。', 409, 'EMAIL_EXISTS');
    }

    await env.DB.prepare('INSERT INTO users (email, created_at, last_login_at) VALUES (?, ?, ?)')
      .bind(email, loginAt, loginAt)
      .run();

    user = await getUserByEmail(env, email);
  }

  if (!user) {
    return errorJson('账号不存在，请先注册。', 404, 'USER_NOT_FOUND');
  }

  await env.DB.prepare('UPDATE users SET last_login_at = ? WHERE id = ?').bind(loginAt, user.id).run();
  await env.DB.prepare('DELETE FROM sessions WHERE user_id = ? OR expires_at <= ?').bind(user.id, nowIso()).run();

  const sessionTtlSeconds = toInt(env.SESSION_TTL_SECONDS, 60 * 60 * 24 * 30);
  const rawToken = randomToken(32);
  const sessionHash = await hashSessionToken(rawToken, env.SESSION_SECRET);
  const expiresAt = addSecondsIso(sessionTtlSeconds);

  await env.DB.prepare('INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)')
    .bind(sessionHash, user.id, expiresAt, nowIso())
    .run();

  const userPayload = {
    id: String(user.id),
    email: String(user.email || email),
  };

  const sessionPayload = buildClientSession(userPayload, sessionTtlSeconds);

  return json(
    {
      message: mode === 'register' ? '注册并登录成功。' : '登录成功。',
      user: userPayload,
      session: sessionPayload,
    },
    200,
    {
      'Set-Cookie': createSessionCookie(rawToken, request, sessionTtlSeconds),
    }
  );
};

const handleAuthMe = async (request, env) => {
  const user = await getSessionUser(env, request);
  if (!user) {
    return errorJson('登录已过期，请重新登录。', 401, 'UNAUTHORIZED');
  }

  const sessionTtlSeconds = toInt(env.SESSION_TTL_SECONDS, 60 * 60 * 24 * 30);
  return json({
    user,
    session: buildClientSession(user, sessionTtlSeconds),
  });
};

const handleLogout = async (request, env) => {
  try {
    const cookies = parseCookie(request.headers.get('cookie') || '');
    const sessionToken = cookies[COOKIE_NAME] || '';
    if (sessionToken && env?.SESSION_SECRET && env?.DB) {
      const hash = await hashSessionToken(sessionToken, env.SESSION_SECRET);
      await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(hash).run();
    }
  } catch {
    // ignore logout cleanup failure
  }

  return json(
    {
      message: '已退出登录。',
    },
    200,
    {
      'Set-Cookie': clearSessionCookie(request),
    }
  );
};

const handleGetProgress = async (request, env) => {
  const user = await getSessionUser(env, request);
  if (!user) {
    return errorJson('请先登录账号。', 401, 'UNAUTHORIZED');
  }

  const row = await env.DB.prepare(
    `SELECT learned_words, mastered_words, custom_words, word_progress, wrong_words, study_history
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
      studyHistory: parseProgressText(row.study_history),
    },
    updatedAt: String(row.updated_at || ''),
  });
};

const handlePutProgress = async (request, env) => {
  const user = await getSessionUser(env, request);
  if (!user) {
    return errorJson('请先登录账号。', 401, 'UNAUTHORIZED');
  }

  const body = await parseJsonBody(request);
  const normalized = normalizeProgress(body?.progress || body || EMPTY_PROGRESS);
  const baseUpdatedAt = String(body?.baseUpdatedAt || '').trim();
  const existing = await env.DB.prepare(
    `SELECT learned_words, mastered_words, custom_words, word_progress, wrong_words, study_history, updated_at
     FROM user_progress
     WHERE user_id = ?
     LIMIT 1`
  )
    .bind(user.id)
    .first();

  let finalProgress = normalized;
  let conflictResolved = false;

  if (existing) {
    const existingProgress = {
      learnedWords: parseProgressText(existing.learned_words),
      masteredWords: parseProgressText(existing.mastered_words),
      customWords: parseProgressText(existing.custom_words),
      wordProgress: parseProgressObjectText(existing.word_progress),
      wrongWords: parseProgressText(existing.wrong_words),
      studyHistory: parseProgressText(existing.study_history),
    };
    const currentUpdatedAt = String(existing.updated_at || '');
    const canReplaceDirectly = Boolean(baseUpdatedAt) && baseUpdatedAt === currentUpdatedAt;

    if (!canReplaceDirectly) {
      finalProgress = mergeProgress(existingProgress, normalized);
      conflictResolved = true;
    }
  }

  const updatedAt = nowIso();

  await env.DB.prepare(
    `INSERT INTO user_progress (user_id, learned_words, mastered_words, custom_words, word_progress, wrong_words, study_history, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       learned_words = excluded.learned_words,
       mastered_words = excluded.mastered_words,
       custom_words = excluded.custom_words,
       word_progress = excluded.word_progress,
       wrong_words = excluded.wrong_words,
       study_history = excluded.study_history,
       updated_at = excluded.updated_at`
  )
    .bind(
      user.id,
      JSON.stringify(finalProgress.learnedWords),
      JSON.stringify(finalProgress.masteredWords),
      JSON.stringify(finalProgress.customWords),
      JSON.stringify(finalProgress.wordProgress),
      JSON.stringify(finalProgress.wrongWords),
      JSON.stringify(finalProgress.studyHistory),
      updatedAt
    )
    .run();

  return json({
    updatedAt,
    progress: finalProgress,
    conflictResolved,
  });
};

const handleApi = async (request, env) => {
  const url = new URL(request.url);
  const { pathname } = url;

  if (request.method === 'POST' && pathname === '/api/auth/send-code') {
    return handleSendCode(request, env);
  }
  if (request.method === 'POST' && pathname === '/api/auth/verify-code') {
    return handleVerifyCode(request, env);
  }
  if (request.method === 'GET' && pathname === '/api/auth/me') {
    return handleAuthMe(request, env);
  }
  if (request.method === 'POST' && pathname === '/api/auth/logout') {
    return handleLogout(request, env);
  }
  if (request.method === 'GET' && pathname === '/api/progress') {
    return handleGetProgress(request, env);
  }
  if (request.method === 'PUT' && pathname === '/api/progress') {
    return handlePutProgress(request, env);
  }

  return errorJson('接口不存在。', 404, 'NOT_FOUND');
};

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      if (url.pathname.startsWith('/api/')) {
        return await handleApi(request, env);
      }

      if (env?.ASSETS?.fetch) {
        return env.ASSETS.fetch(request);
      }

      return new Response('Not Found', { status: 404 });
    } catch (error) {
      return errorJson(error?.message || '服务器内部错误。', 500, 'INTERNAL_ERROR');
    }
  },
};
