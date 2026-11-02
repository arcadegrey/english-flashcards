import { randomInt } from 'node:crypto';
import { passwordError } from '../shared/passwordPolicy.js';
import { DUMMY_PASSWORD_HASH } from './passwordCrypto.js';
import { passwordKdf } from './passwordHasher.js';
import { checkEmailCode, hashEmailCode, validCodeSql, validCodeParams } from './emailCodes.js';

const json = (value, status = 200, headers = {}) => Response.json(value, {
  status, headers: { 'cache-control': 'no-store', ...headers },
});
const error = (message, status = 400) => json({ error: message }, status);
const resetNotice = '如果该邮箱已注册，将收到重置验证码。请检查收件箱及垃圾邮件。';
const invalidCode = () => error('验证码已使用或失效，请重新发送。');

async function reserveAttempt(env, value, limit, windowMs) {
  const bytes = new TextEncoder().encode(`${env.SESSION_SECRET}:auth-rate:${value}`);
  const key = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), b => b.toString(16).padStart(2, '0')).join('');
  const now = Date.now();
  // One atomic reservation; concurrent requests cannot all read the old count.
  const row = await env.DB.prepare(`INSERT INTO auth_rate_limits (key,window_start,attempts,expires_at) VALUES (?,?,1,?)
    ON CONFLICT(key) DO UPDATE SET
      window_start=CASE WHEN window_start <= ? THEN excluded.window_start ELSE window_start END,
      attempts=CASE WHEN window_start <= ? THEN 1 ELSE attempts+1 END,
      expires_at=CASE WHEN window_start <= ? THEN excluded.expires_at ELSE expires_at END
    WHERE window_start <= ? OR attempts < ? RETURNING attempts`)
    .bind(key, now, now + windowMs, now - windowMs, now - windowMs, now - windowMs, now - windowMs, limit).first();
  await env.DB.prepare('DELETE FROM auth_rate_limits WHERE key IN (SELECT key FROM auth_rate_limits WHERE expires_at < ? LIMIT 100)').bind(now).run();
  return Boolean(row);
}

async function throttle(request, env, action, email) {
  const ip = request.headers.get('cf-connecting-ip') || 'local';
  return await reserveAttempt(env, `ip:${ip}`, 60, 15 * 60000)
    && await reserveAttempt(env, `${action}:${email}`, action.endsWith('send') ? 5 : 10, action.endsWith('send') ? 3600000 : 15 * 60000);
}

async function sendPasswordCode(env, email, mode, sendCodeEmail) {
  const last = await env.DB.prepare('SELECT created_at FROM login_codes WHERE email=? AND mode=? ORDER BY created_at DESC,id DESC LIMIT 1').bind(email, mode).first();
  const interval = Math.max(60, Number(env.LOGIN_CODE_SEND_INTERVAL_SECONDS) || 60);
  if (last && Date.now() - Date.parse(last.created_at) < interval * 1000) return false;
  const code = String(randomInt(1000000)).padStart(6, '0'), now = new Date().toISOString();
  await env.DB.prepare(`INSERT INTO login_codes(email,mode,code_hash,expires_at,attempts,created_at,consumed_at) VALUES(?,?,?,?,0,?,NULL)`)
    .bind(email, mode, await hashEmailCode(email, mode, code, env.SESSION_SECRET), new Date(Date.now() + 600000).toISOString(), now).run();
  await sendCodeEmail(env, email, code, mode);
  return true;
}

export async function handlePasswordAuth(request, env, auth, context) {
  if (!env?.DB || !env.SESSION_SECRET) return error('账号服务暂不可用，请稍后重试。', 503);
  if (request.method !== 'POST') return error('请求方式不支持。', 405);
  const origin = request.headers.get('origin');
  if (request.headers.get('sec-fetch-site') === 'cross-site' || origin && origin !== new URL(request.url).origin) return error('不允许跨站操作。', 403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return error('请使用 JSON 提交。', 415);
  const text = await request.text();
  if (text.length > 8192) return error('请求内容过长。', 413);
  let body;
  try { body = JSON.parse(text); } catch { return error('请求内容无效。'); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return error('请求内容无效。');
  const action = new URL(request.url).pathname.slice('/api/auth/password/'.length);
  if (!['login', 'register', 'reset-code', 'reset', 'set-code', 'set'].includes(action)) return error('接口不存在。', 404);
  const setting = action === 'set' || action === 'set-code';
  const currentUser = setting ? await auth.getSessionUser(env, request) : null;
  if (setting && !currentUser) return error('请先登录账号。', 401);
  const email = String(setting ? currentUser.email : body.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return error('请输入有效邮箱地址。');
  if (!await throttle(request, env, action.endsWith('code') ? `${action}-send` : action, email)) return error('操作过于频繁，请稍后再试。', 429);
  const user = await auth.getUserByEmail(env, email);

  if (action === 'reset-code' || action === 'set-code') {
    if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) return error('邮箱服务暂不可用，请稍后重试。', 503);
    if (action === 'reset-code') {
      // No account-existence signal in the public reset response. Production
      // delivery runs after the response; no reset credentials are logged.
      if (user) {
        const delivery = sendPasswordCode(env, email, 'reset-password', auth.sendCodeEmail).catch(() => {});
        if (context?.waitUntil) context.waitUntil(delivery); else await delivery;
      }
      return json({ message: resetNotice });
    }
    if (!await sendPasswordCode(env, email, 'set-password', auth.sendCodeEmail)) return error('验证码发送过于频繁，请稍后再试。', 429);
    return json({ message: '设置密码的验证码已发送，请查收邮箱。' });
  }

  const password = body.password;
  if (action === 'login') {
    // Bound work for malformed input, but do the same KDF for unknown accounts
    // and existing accounts with no password. No password-as-OTP fallback.
    if (typeof password !== 'string' || !password || Array.from(password).length > 128) return error('邮箱或密码不正确。', 401);
    const { valid } = await passwordKdf(env, 'verify', email, password, user?.password_hash || DUMMY_PASSWORD_HASH);
    if (!valid || !user?.password_hash) return error('邮箱或密码不正确。', 401);
    return auth.issueSession(request, env, user, '登录成功。', user.password_hash);
  }

  const invalidPassword = passwordError(password, email);
  if (invalidPassword) return error(invalidPassword);
  if (action === 'register' && user) return error('该邮箱已注册，请直接登录。', 409);
  const mode = action === 'register' ? 'register' : setting ? 'set-password' : 'reset-password';
  const checked = await checkEmailCode(env, email, mode, String(body.verificationCode || '').trim());
  if (checked.response) return action === 'reset'
    ? error('验证码无效或已过期，请重新发送。') : checked.response;
  if (action !== 'register' && !user) return invalidCode();
  const role = body.role || 'student', displayName = String(body.displayName || email.split('@')[0]).trim();
  if (action === 'register' && (!['student', 'teacher'].includes(role) || !displayName || displayName.length > 40)) return error('请选择学生或老师身份，姓名不能超过 40 字。');
  const { hash: encoded } = await passwordKdf(env, 'hash', email, password);
  const now = new Date().toISOString();
  const proof = validCodeParams(checked.row, email, mode, now);

  if (action === 'register') {
    // All writes recheck the same unconsumed purpose-bound proof. D1 batch is
    // transactional: a profile/credential failure rolls back the user too.
    const saved = await env.DB.batch([
      env.DB.prepare(`INSERT INTO users(email,created_at,last_login_at) SELECT ?,?,? WHERE ${validCodeSql}`).bind(email, now, now, ...proof),
      env.DB.prepare(`INSERT INTO account_profiles(user_id,role,display_name,created_at,updated_at)
        SELECT id,?,?,?,? FROM users WHERE email=? AND ${validCodeSql}`).bind(role, displayName, now, now, email, ...proof),
      env.DB.prepare(`INSERT INTO password_credentials(user_id,password_hash,updated_at)
        SELECT id,?,? FROM users WHERE email=? AND ${validCodeSql}`).bind(encoded, now, email, ...proof),
      env.DB.prepare(`UPDATE login_codes SET consumed_at=? WHERE id=? AND ${validCodeSql}`).bind(now, checked.row.id, ...proof),
    ]);
    if (!saved[0].meta.changes || !saved[3].meta.changes) return invalidCode();
    return auth.issueSession(request, env, await auth.getUserByEmail(env, email), '注册并登录成功。', encoded);
  }

  const saved = await env.DB.batch([
    env.DB.prepare(`INSERT INTO password_credentials(user_id,password_hash,updated_at) SELECT ?,?,? WHERE ${validCodeSql}
      ON CONFLICT(user_id) DO UPDATE SET password_hash=excluded.password_hash,updated_at=excluded.updated_at`)
      .bind(user.id, encoded, now, ...proof),
    env.DB.prepare(`DELETE FROM sessions WHERE user_id=? AND EXISTS(SELECT 1 FROM password_credentials WHERE user_id=? AND password_hash=?)`).bind(user.id, user.id, encoded),
    env.DB.prepare(`UPDATE login_codes SET consumed_at=? WHERE email=? AND consumed_at IS NULL
      AND EXISTS(SELECT 1 FROM password_credentials WHERE user_id=? AND password_hash=?)`).bind(now, email, user.id, encoded),
  ]);
  if (!saved[0].meta.changes) return invalidCode();
  const notify = auth.sendCodeEmail(env, email, '', 'password-changed').catch(() => {});
  if (context?.waitUntil) context.waitUntil(notify); else await notify;
  if (setting) return auth.issueSession(request, env, await auth.getUserByEmail(env, email), '密码已保存，其他设备需重新登录。', encoded);
  // Recovery never automatically signs in or merges local guest work.
  return json({ message: '密码已重置，请使用新密码登录。' }, 200);
}
