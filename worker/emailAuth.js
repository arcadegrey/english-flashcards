import { json, errorJson, parseJsonBody } from './http.js';
import { EMAIL_REGEX, nowIso, addSecondsIso, toInt, normalizeEmail, randomDigits, hashCode } from './authSupport.js';
import { getUserByEmail, issueSession } from './authSession.js';
import { checkEmailCode, validCodeSql, validCodeParams } from './emailCodes.js';

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

export const sendCodeEmail = async (env, email, code, mode) => {
  const modeText = ({ register: '注册', login: '登录', 'set-password': '设置密码', 'reset-password': '重置密码' })[mode] || '登录';
  const changed = mode === 'password-changed';
  const subject = changed ? '英语单词卡片：密码已更新' : `英语单词卡片 ${modeText}验证码：${code}`;
  const text = changed ? '你的账号密码已更新，旧会话已退出。如非本人操作，请立即通过邮箱找回密码。' : `你的${modeText}验证码是 ${code}，10 分钟内有效。`;
  const html = changed ? `<p>${text}</p>` : `<p>你的${modeText}验证码是 <strong>${code}</strong>，10 分钟内有效。</p>`;

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

export const handleSendCode = async (request, env) => {
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

export const handleVerifyCode = async (request, env) => {
  ensureEnv(env);

  const body = await parseJsonBody(request);
  const email = normalizeEmail(body.email);
  const mode = body.mode === 'register' ? 'register' : 'login';
  const code = String(body.code || '').trim();
  const role = body.role || 'student';
  const displayName = String(body.displayName || email.split('@')[0]).trim();
  if (mode === 'register' && (!['student', 'teacher'].includes(role) || !displayName || displayName.length > 40)) {
    return errorJson('请选择学生或老师身份，姓名不能超过 40 字。', 400, 'INVALID_PROFILE');
  }

  if (!EMAIL_REGEX.test(email)) {
    return errorJson('请输入有效邮箱地址。', 400, 'INVALID_EMAIL');
  }
  if (!/^\d{6}$/.test(code)) {
    return errorJson('请输入 6 位数字验证码。', 400, 'INVALID_CODE_FORMAT');
  }

  const credentialAtStart = await getUserByEmail(env, email);
  const checked = await checkEmailCode(env, email, mode, code);
  if (checked.response) return checked.response;
  const claimedAt = nowIso();
  const claimed = await env.DB.prepare(`UPDATE login_codes SET consumed_at = ? WHERE id = ? AND ${validCodeSql}`)
    .bind(claimedAt, checked.row.id, ...validCodeParams(checked.row, email, mode, claimedAt)).run();
  if (!claimed.meta.changes) return errorJson('验证码已使用或失效，请重新发送。', 400, 'CODE_ALREADY_USED');

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
    await env.DB.prepare(`INSERT INTO account_profiles (user_id, role, display_name, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)`).bind(user.id, role, displayName, loginAt, loginAt).run();
    user = await getUserByEmail(env, email);
  }

  if (!user) {
    return errorJson('账号不存在，请先注册。', 404, 'USER_NOT_FOUND');
  }

  return issueSession(request, env, user, mode === 'register' ? '注册并登录成功。' : '登录成功。',
    mode === 'register' ? user.password_hash : credentialAtStart?.password_hash);
};
