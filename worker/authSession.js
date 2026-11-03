import { profileFields } from './classroom.js';
import { json, errorJson } from './http.js';
import { COOKIE_NAME, nowIso, addSecondsIso, toInt, parseCookie, randomToken, hashSessionToken } from './authSupport.js';

const buildClientSession = (user, ttlSeconds) => ({
  access_token: 'cookie-session',
  refresh_token: '',
  expires_at: Math.floor(Date.now() / 1000) + ttlSeconds,
  user,
});

export const getUserByEmail = async (env, email) =>
  env.DB.prepare(`SELECT u.id, u.email, p.role, p.display_name, c.password_hash FROM users u
    LEFT JOIN account_profiles p ON p.user_id = u.id
    LEFT JOIN password_credentials c ON c.user_id = u.id WHERE u.email = ? LIMIT 1`).bind(email).first();

export const getSessionUser = async (env, request) => {
  const cookies = parseCookie(request.headers.get('cookie') || '');
  const sessionToken = cookies[COOKIE_NAME];
  if (!sessionToken) return null;

  const sessionHash = await hashSessionToken(sessionToken, env.SESSION_SECRET);
  const row = await env.DB.prepare(
    `SELECT s.id, s.expires_at, u.id AS user_id, u.email, p.role, p.display_name, c.user_id AS has_password
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     LEFT JOIN account_profiles p ON p.user_id = u.id
     LEFT JOIN password_credentials c ON c.user_id = u.id
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
    hasPassword: Boolean(row.has_password),
    ...profileFields(row),
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

export const issueSession = async (request, env, user, message, expectedPasswordHash) => {
  const sessionTtlSeconds = toInt(env.SESSION_TTL_SECONDS, 60 * 60 * 24 * 30);
  const rawToken = randomToken(32), sessionHash = await hashSessionToken(rawToken, env.SESSION_SECRET);
  const now = nowIso();
  const condition = expectedPasswordHash
    ? 'EXISTS(SELECT 1 FROM password_credentials WHERE user_id=? AND password_hash=?)'
    : 'NOT EXISTS(SELECT 1 FROM password_credentials WHERE user_id=?)';
  const saved = await env.DB.prepare(`INSERT INTO sessions(id,user_id,expires_at,created_at) SELECT ?,?,?,? WHERE ${condition}`)
    .bind(sessionHash, user.id, addSecondsIso(sessionTtlSeconds), now, user.id, ...(expectedPasswordHash ? [expectedPasswordHash] : [])).run();
  if (!saved.meta.changes) return errorJson('登录状态已变化，请使用当前密码或新的验证码重新登录。', 409, 'CREDENTIAL_CHANGED');
  await env.DB.prepare('UPDATE users SET last_login_at=? WHERE id=?').bind(now, user.id).run();
  await env.DB.prepare('DELETE FROM sessions WHERE expires_at <= ?').bind(now).run();
  const userPayload = { id: String(user.id), email: String(user.email), hasPassword: Boolean(user.password_hash), ...profileFields(user) };
  return json({ message, user: userPayload, session: buildClientSession(userPayload, sessionTtlSeconds) }, 200, {
    'Set-Cookie': createSessionCookie(rawToken, request, sessionTtlSeconds),
  });
};

export const handleAuthMe = async (request, env) => {
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

export const handleLogout = async (request, env, allDevices = false) => {
  const origin = request.headers.get('origin');
  if (request.headers.get('sec-fetch-site') === 'cross-site' || (origin && origin !== new URL(request.url).origin)) {
    return errorJson('不允许跨站操作。', 403, 'CROSS_SITE');
  }
  if (allDevices) {
    if (!request.headers.get('content-type')?.startsWith('application/json')) return errorJson('请使用 JSON 提交。', 415);
    const user = await getSessionUser(env, request);
    if (!user) return errorJson('请先登录账号。', 401, 'UNAUTHORIZED');
    await env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(user.id).run();
  } else {
    const token = parseCookie(request.headers.get('cookie') || '')[COOKIE_NAME];
    if (token) await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(await hashSessionToken(token, env.SESSION_SECRET)).run();
  }
  return json({ message: allDevices ? '已退出全部设备。' : '已退出当前设备。' }, 200, {
    'Set-Cookie': clearSessionCookie(request),
  });
};
