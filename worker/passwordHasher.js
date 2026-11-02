import { hashPassword, verifyPassword } from './passwordCrypto.js';

// An internal SQLite-backed Durable Object has a separate CPU allowance on the
// Free plan. It stores nothing: credentials remain in D1; plaintext only exists
// during the internal request. There is no public route to this object.
export class PasswordHasher {
  async fetch(request) {
    if (request.method !== 'POST' || !request.headers.get('content-type')?.startsWith('application/json')) return new Response('Invalid request', { status: 405 });
    const text = await request.text();
    if (text.length > 8192) return new Response('Invalid request', { status: 413 });
    let body;
    try { body = JSON.parse(text); } catch { return new Response('Invalid request', { status: 400 }); }
    if (typeof body?.password !== 'string' || !body.password || Array.from(body.password).length > 128) return new Response('Invalid request', { status: 400 });
    const path = new URL(request.url).pathname;
    if (path === '/hash') return Response.json({ hash: await hashPassword(body.password) });
    if (path === '/verify') return Response.json({ valid: await verifyPassword(body.password, body.encoded) });
    return new Response('Not found', { status: 404 });
  }
}

export async function passwordKdf(env, action, email, password, encoded) {
  if (!env.PASSWORD_HASHER) throw new Error('密码服务暂不可用，请稍后重试。');
  // A bounded set of objects avoids creating unbounded instances for unknown
  // email addresses. This hash only chooses a shard; it has no auth role.
  let shard = 0;
  for (const char of email) shard = ((shard * 31) + char.codePointAt(0)) >>> 0;
  const id = env.PASSWORD_HASHER.idFromName(`password-auth-${shard % 8}`);
  const response = await env.PASSWORD_HASHER.get(id).fetch(`https://password-hasher.internal/${action}`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password, encoded }),
  });
  if (!response.ok) throw new Error('密码服务暂不可用，请稍后重试。');
  return response.json();
}
