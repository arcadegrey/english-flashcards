const error = (message, status = 400, code = 'INVALID_CODE') => Response.json({ error: message, code }, {
  status, headers: { 'cache-control': 'no-store' },
});

export async function hashEmailCode(email, mode, code, secret) {
  const bytes = new TextEncoder().encode(`${secret}:otp:${mode}:${email}:${String(code || '')}`);
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function checkEmailCode(env, email, mode, code) {
  if (!/^\d{6}$/.test(code)) return { response: error('请输入 6 位数字验证码。', 400, 'INVALID_CODE_FORMAT') };
  // Include consumed codes in latest selection: using a newer code must never
  // reactivate an older unused code for the same email and purpose.
  const row = await env.DB.prepare(`SELECT id, code_hash, expires_at, attempts, consumed_at FROM login_codes
    WHERE email = ? AND mode = ? ORDER BY created_at DESC, id DESC LIMIT 1`).bind(email, mode).first();
  if (!row || row.consumed_at) return { response: error('验证码已使用或失效，请重新发送。', 400, 'CODE_NOT_FOUND') };
  if (Date.parse(row.expires_at) <= Date.now()) return { response: error('验证码已过期，请重新发送。', 400, 'CODE_EXPIRED') };
  if (row.attempts >= 5) return { response: error('验证码尝试次数过多，请重新发送。', 429, 'TOO_MANY_ATTEMPTS') };
  if (await hashEmailCode(email, mode, code, env.SESSION_SECRET) !== row.code_hash) {
    await env.DB.prepare('UPDATE login_codes SET attempts = attempts + 1 WHERE id = ? AND attempts < 5 AND consumed_at IS NULL').bind(row.id).run();
    return { response: error('验证码错误，请重试。', 400, 'CODE_MISMATCH') };
  }
  return { row };
}

// Rechecked inside each transactional write, after any expensive password KDF.
export const validCodeSql = `EXISTS (SELECT 1 FROM login_codes WHERE id = ? AND code_hash = ?
  AND consumed_at IS NULL AND attempts < 5 AND expires_at > ?
  AND id = (SELECT id FROM login_codes WHERE email = ? AND mode = ? ORDER BY created_at DESC, id DESC LIMIT 1))`;
export const validCodeParams = (row, email, mode, now) => [row.id, row.code_hash, now, email, mode];
