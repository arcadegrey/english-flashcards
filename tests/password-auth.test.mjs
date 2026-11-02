import test from 'node:test';
import assert from 'node:assert/strict';
import { createClassroomFixture } from './helpers/classroom-db.mjs';
import { hashPassword, verifyPassword } from '../worker/passwordCrypto.js';
import { PasswordHasher } from '../worker/passwordHasher.js';
import { hashEmailCode } from '../worker/emailCodes.js';
import { passwordError } from '../shared/passwordPolicy.js';
import { signInWithEmail, signUpWithEmail, requestPasswordCode, resetPasswordWithCode, setAccountPassword } from '../src/utils/workerAuth.js';

const initialPassword = 'An original study passphrase';
const nextPassword = 'A different learning passphrase';
async function addCode(f, email, mode, code = '123456', extra = {}) {
  const last = f.sqlite.prepare('SELECT MAX(created_at) AS value FROM login_codes').get().value;
  const now = new Date(Math.max(Date.now(), (Date.parse(last) || 0) + 1)).toISOString();
  f.sqlite.prepare('INSERT INTO login_codes(email,mode,code_hash,expires_at,attempts,created_at,consumed_at) VALUES(?,?,?,?,?,?,NULL)')
    .run(email, mode, await hashEmailCode(email, mode, code, f.env.SESSION_SECRET), extra.expires || new Date(Date.now() + 600000).toISOString(), extra.attempts || 0, now);
}
async function setup() {
  const f = await createClassroomFixture();
  await f.addUser(1, 'student'); await f.addUser(2, 'teacher');
  f.sqlite.prepare('INSERT INTO password_credentials VALUES(?,?,?)').run(1, await hashPassword(initialPassword), new Date().toISOString());
  return f;
}
async function mailTest(operation) {
  const original = globalThis.fetch, messages = [];
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails');
    messages.push(JSON.parse(options.body));
    return Response.json({ id: 'local-mail-test' });
  };
  try { await operation(messages); } finally { globalThis.fetch = original; }
}

test('password KDF salts identical passwords, rejects wrong/malformed hashes and preserves spaces/unicode', async () => {
  const password = '  a phrase with 空格 and words  ';
  const one = await hashPassword(password), two = await hashPassword(password);
  assert.notEqual(one, two);
  assert.match(one, /^scrypt\$16384\$8\$5\$/);
  assert(!one.includes(password));
  assert(await verifyPassword(password, one));
  assert(!await verifyPassword(password.trim(), one));
  assert(!await verifyPassword(password, 'damaged'));
  assert(passwordError('short'));
  assert(passwordError('123456789012345'));
  assert(passwordError('\n \t'.repeat(6)));
  assert.equal(passwordError('我的学习计划是每天坚持背十五个单词'), '');
  assert(passwordError('x'.repeat(129)));
});

test('password registration needs its own unused email proof, stores a hash, and keeps profile authority server-side', async () => {
  const f = await createClassroomFixture();
  try {
    const email = 'new@example.test', body = { email, verificationCode: '123456', password: initialPassword, role: 'teacher', displayName: '新老师' };
    assert.equal((await f.api(null, '/auth/password/register', 'POST', body)).status, 400);
    await addCode(f, email, 'login');
    assert.equal((await f.api(null, '/auth/password/register', 'POST', body)).status, 400);
    await addCode(f, email, 'register');
    const saved = await f.api(null, '/auth/password/register', 'POST', body);
    assert.equal(saved.status, 200, JSON.stringify(saved.body));
    assert.equal(saved.body.user.hasPassword, true);
    assert.equal(saved.body.user.role, 'teacher');
    assert(!JSON.stringify(saved.body).includes('scrypt$'));
    assert.match(saved.headers.get('set-cookie'), /HttpOnly; SameSite=Lax.*Secure/);
    assert(await verifyPassword(initialPassword, f.sqlite.prepare('SELECT password_hash FROM password_credentials').get().password_hash));
    assert.equal((await f.api(null, '/auth/password/register', 'POST', body)).status, 409);
    assert.equal(f.sqlite.prepare('SELECT COUNT(*) AS n FROM users').get().n, 1);
  } finally { f.sqlite.close(); }
});

test('password login keeps other device sessions, returns generic errors, and never accepts a password as an OTP', async () => {
  const f = await setup();
  try {
    const success = await f.api(null, '/auth/password/login', 'POST', { email: ' USER1@example.test ', password: initialPassword, role: 'teacher' });
    assert.equal(success.status, 200);
    assert.equal(success.body.user.role, 'student');
    const profile = await f.api(1, '/classroom/profile', 'POST', { role: 'student', displayName: '更新姓名' });
    assert.equal(profile.body.user.hasPassword, true);
    assert.equal((await f.api(1, '/auth/me')).status, 200);
    const results = [];
    for (const [email, password] of [['user1@example.test', 'wrong'], ['user2@example.test', initialPassword], ['absent@example.test', initialPassword]]) {
      results.push(await f.api(null, '/auth/password/login', 'POST', { email, password }));
    }
    assert(results.every(result => result.status === 401 && result.body.error === '邮箱或密码不正确。'));
    const codeLogin = await f.api(null, '/auth/verify-code', 'POST', { email: 'user1@example.test', mode: 'login', code: initialPassword });
    assert.equal(codeLogin.status, 400);
  } finally { f.sqlite.close(); }
});

test('legacy accounts set a password with an authenticated purpose-bound code; IDs, data, and roles remain intact', async () => mailTest(async messages => {
  const f = await setup();
  try {
    await f.api(2, '/progress', 'PUT', { progress: { learnedWords: [19], preferences: { studyPlanCategory: 'daily' } } });
    const before = (await f.api(2, '/progress')).body.progress;
    assert.equal((await f.api(null, '/auth/password/set-code', 'POST', {})).status, 401);
    const sent = await f.api(2, '/auth/password/set-code', 'POST', {});
    assert.equal(sent.status, 200);
    const code = messages.at(-1).text.match(/\d{6}/)[0];
    const changed = await f.api(2, '/auth/password/set', 'POST', { verificationCode: code, password: nextPassword, email: 'user1@example.test', role: 'student' });
    assert.equal(changed.status, 200, JSON.stringify(changed.body));
    assert.equal(changed.body.user.id, '2');
    assert.equal(changed.body.user.role, 'teacher');
    assert.equal(changed.body.user.hasPassword, true);
    const cookie = changed.headers.get('set-cookie').split(';')[0];
    assert.equal((await f.api(2, '/auth/me')).status, 401);
    assert.deepEqual((await f.api(null, '/progress', 'GET', undefined, { cookie })).body.progress, before);
    assert.equal((await f.api(null, '/auth/password/login', 'POST', { email: 'user1@example.test', password: initialPassword })).status, 200);
    assert(messages.at(-1).text.includes('密码已更新'));
    assert(!messages.some(message => JSON.stringify(message).includes(nextPassword)));
    assert.equal((await f.api(1, '/auth/password/set', 'POST', { verificationCode: code, password: initialPassword }, { 'x-flashcards-user': '2' })).status, 409);
  } finally { f.sqlite.close(); }
}));

test('password reset revokes all old sessions and outstanding codes, preserves learning and requires a new login', async () => mailTest(async messages => {
  const f = await setup();
  try {
    await f.api(1, '/progress', 'PUT', { progress: { masteredWords: [17] } });
    const progress = (await f.api(1, '/progress')).body.progress;
    await addCode(f, 'user1@example.test', 'login', '654321');
    await addCode(f, 'user1@example.test', 'set-password', '654321');
    const sent = await f.api(null, '/auth/password/reset-code', 'POST', { email: 'user1@example.test' });
    const absent = await f.api(null, '/auth/password/reset-code', 'POST', { email: 'absent@example.test' });
    assert.deepEqual(sent.body, absent.body);
    assert.equal(messages.length, 1);
    const code = messages[0].text.match(/\d{6}/)[0];
    const reset = await f.api(null, '/auth/password/reset', 'POST', { email: 'user1@example.test', verificationCode: code, password: nextPassword });
    assert.equal(reset.status, 200, JSON.stringify(reset.body));
    assert.equal(reset.headers.get('set-cookie'), null);
    assert.equal(reset.body.session, undefined);
    assert.equal((await f.api(1, '/auth/me')).status, 401);
    assert.equal((await f.api(2, '/auth/me')).status, 200);
    assert.equal((await f.api(null, '/auth/verify-code', 'POST', { email: 'user1@example.test', code: '654321', mode: 'login' })).status, 400);
    assert.equal((await f.api(null, '/auth/password/reset', 'POST', { email: 'user1@example.test', verificationCode: code, password: initialPassword })).status, 400);
    assert.equal((await f.api(null, '/auth/password/login', 'POST', { email: 'user1@example.test', password: initialPassword })).status, 401);
    const login = await f.api(null, '/auth/password/login', 'POST', { email: 'user1@example.test', password: nextPassword });
    assert.equal(login.status, 200);
    const cookie = login.headers.get('set-cookie').split(';')[0];
    assert.deepEqual((await f.api(null, '/progress', 'GET', undefined, { cookie })).body.progress, progress);
    assert(messages.at(-1).subject.includes('密码已更新'));
  } finally { f.sqlite.close(); }
}));

test('wrong/expired/exhausted codes cannot change a password and old unused codes never revive', async () => mailTest(async () => {
  const f = await setup();
  try {
    for (const extra of [{ expires: '2000-01-01T00:00:00Z' }, { attempts: 5 }]) {
      await addCode(f, 'user1@example.test', 'reset-password', '123456', extra);
      assert.notEqual((await f.api(null, '/auth/password/reset', 'POST', { email: 'user1@example.test', verificationCode: '123456', password: nextPassword })).status, 200);
    }
    await addCode(f, 'user1@example.test', 'reset-password', '111111');
    await addCode(f, 'user1@example.test', 'reset-password', '222222');
    for (let i = 0; i < 5; i++) assert.equal((await f.api(null, '/auth/password/reset', 'POST', { email: 'user1@example.test', verificationCode: '000000', password: nextPassword })).status, 400);
    const exhausted = await f.api(null, '/auth/password/reset', 'POST', { email: 'user1@example.test', verificationCode: '222222', password: nextPassword });
    const unknown = await f.api(null, '/auth/password/reset', 'POST', { email: 'unknown@example.test', verificationCode: '222222', password: nextPassword });
    assert.equal(exhausted.status, 400);
    assert.deepEqual(exhausted.body, unknown.body);
    assert.equal((await f.api(1, '/auth/me')).status, 200);
    await addCode(f, 'user1@example.test', 'login', '111111');
    await addCode(f, 'user1@example.test', 'login', '222222');
    assert.equal((await f.api(null, '/auth/verify-code', 'POST', { email: 'user1@example.test', code: '222222', mode: 'login' })).status, 200);
    assert.equal((await f.api(null, '/auth/verify-code', 'POST', { email: 'user1@example.test', code: '111111', mode: 'login' })).status, 400);
  } finally { f.sqlite.close(); }
}));

test('credential transactions roll back on storage failure without consuming the proof or revoking sessions', async () => mailTest(async () => {
  const f = await setup();
  try {
    await addCode(f, 'user1@example.test', 'reset-password');
    const hash = f.sqlite.prepare('SELECT password_hash FROM password_credentials WHERE user_id=1').get().password_hash;
    f.sqlite.exec("CREATE TRIGGER fail_password_update BEFORE UPDATE ON password_credentials BEGIN SELECT RAISE(ABORT,'test credential write failure'); END");
    assert.equal((await f.api(null, '/auth/password/reset', 'POST', { email: 'user1@example.test', verificationCode: '123456', password: nextPassword })).status, 503);
    assert.equal((await f.api(1, '/auth/me')).status, 200);
    assert.equal(f.sqlite.prepare('SELECT password_hash FROM password_credentials WHERE user_id=1').get().password_hash, hash);
    assert.equal(f.sqlite.prepare('SELECT consumed_at FROM login_codes').get().consumed_at, null);
    await addCode(f, 'brand-new@example.test', 'register');
    assert.equal((await f.api(null, '/auth/password/register', 'POST', { email: 'brand-new@example.test', verificationCode: '123456', password: initialPassword })).status, 200);
  } finally { f.sqlite.close(); }
}));

test('concurrent code redemption creates only one credential mutation and credential rotation blocks a stale login', async () => mailTest(async () => {
  const f = await setup();
  try {
    await addCode(f, 'user1@example.test', 'reset-password');
    const changes = await Promise.all([nextPassword, 'Another unique study passphrase'].map(password => f.api(null, '/auth/password/reset', 'POST', { email: 'user1@example.test', verificationCode: '123456', password })));
    assert.deepEqual(changes.map(r => r.status).sort(), [200, 400]);
    const current = await hashPassword(initialPassword);
    f.sqlite.prepare('UPDATE password_credentials SET password_hash=? WHERE user_id=1').run(current);
    const prepare = f.env.DB.prepare;
    f.env.DB.prepare = sql => {
      if (sql.startsWith('INSERT INTO sessions')) f.sqlite.prepare('UPDATE password_credentials SET password_hash=? WHERE user_id=1').run('changed-by-concurrent-reset');
      return prepare(sql);
    };
    const login = await f.api(null, '/auth/password/login', 'POST', { email: 'user1@example.test', password: initialPassword });
    assert.equal(login.status, 409);
    assert.equal(f.sqlite.prepare('SELECT COUNT(*) AS n FROM sessions WHERE user_id=1').get().n, 0);
  } finally { f.sqlite.close(); }
}));

test('password attempts have atomic time-window limits and reject cross-site/non-JSON/oversized requests', async () => {
  const f = await setup();
  try {
    for (let i = 0; i < 10; i++) assert.equal((await f.api(null, '/auth/password/login', 'POST', { email: 'user1@example.test', password: 'wrong' })).status, 401);
    assert.equal((await f.api(null, '/auth/password/login', 'POST', { email: 'user1@example.test', password: initialPassword })).status, 429);
    f.sqlite.prepare('UPDATE auth_rate_limits SET window_start=0,expires_at=0').run();
    assert.equal((await f.api(null, '/auth/password/login', 'POST', { email: 'user1@example.test', password: initialPassword })).status, 200);
    const body = { email: 'user1@example.test', password: initialPassword };
    for (const headers of [{ origin: 'https://evil.example' }, { 'sec-fetch-site': 'cross-site' }]) assert.equal((await f.api(null, '/auth/password/login', 'POST', body, headers)).status, 403);
    assert.equal((await f.api(null, '/auth/password/login', 'POST', body, { 'content-type': 'text/plain' })).status, 415);
    assert.equal((await f.api(null, '/auth/verify-code', 'POST', { email: 'user1@example.test', code: '123456' }, { origin: 'https://evil.example' })).status, 403);
    assert.equal((await f.api(null, '/auth/password/login', 'POST', { ...body, password: 'x'.repeat(9000) })).status, 413);
    f.sqlite.exec(f.schema);
    assert(await verifyPassword(initialPassword, f.sqlite.prepare('SELECT password_hash FROM password_credentials WHERE user_id=1').get().password_hash));
  } finally { f.sqlite.close(); }
});

test('password registration rolls back user/profile creation and can retry its code after a storage failure', async () => {
  const f = await createClassroomFixture();
  try {
    await addCode(f, 'new@example.test', 'register');
    const body = { email: 'new@example.test', password: initialPassword, verificationCode: '123456' };
    f.sqlite.exec("CREATE TRIGGER fail_credentials BEFORE INSERT ON password_credentials BEGIN SELECT RAISE(ABORT,'test insertion failure'); END");
    assert.equal((await f.api(null, '/auth/password/register', 'POST', body)).status, 503);
    assert.equal(f.sqlite.prepare('SELECT COUNT(*) AS n FROM users').get().n, 0);
    assert.equal(f.sqlite.prepare('SELECT COUNT(*) AS n FROM account_profiles').get().n, 0);
    assert.equal(f.sqlite.prepare('SELECT consumed_at FROM login_codes').get().consumed_at, null);
    f.sqlite.exec('DROP TRIGGER fail_credentials');
    const responses = await Promise.all([f.api(null, '/auth/password/register', 'POST', body), f.api(null, '/auth/password/register', 'POST', body)]);
    assert.deepEqual(responses.map(r => r.status).sort(), [200, 400]);
    assert.equal(f.sqlite.prepare('SELECT COUNT(*) AS n FROM password_credentials').get().n, 1);
  } finally { f.sqlite.close(); }
});

test('a password rotation during old-client OTP login cannot issue a post-reset session', async () => {
  const f = await setup();
  try {
    await addCode(f, 'user1@example.test', 'login');
    const prepare = f.env.DB.prepare;
    f.env.DB.prepare = sql => {
      const statement = prepare(sql);
      if (!sql.startsWith('UPDATE login_codes SET consumed_at = ?')) return statement;
      const bind = statement.bind;
      statement.bind = (...values) => {
        const bound = bind(...values), run = bound.run;
        bound.run = async () => {
          const result = await run();
          f.sqlite.prepare('UPDATE password_credentials SET password_hash=? WHERE user_id=1').run('rotated-by-reset');
          f.sqlite.prepare('DELETE FROM sessions WHERE user_id=1').run();
          return result;
        };
        return bound;
      };
      return statement;
    };
    const result = await f.api(null, '/auth/verify-code', 'POST', { email: 'user1@example.test', code: '123456' });
    assert.equal(result.status, 409);
    assert.equal(f.sqlite.prepare('SELECT COUNT(*) AS n FROM sessions WHERE user_id=1').get().n, 0);
  } finally { f.sqlite.close(); }
});

test('Free-plan hashing is isolated behind a bounded internal service and its failure never falls back to weak hashes', async () => {
  const f = await setup();
  try {
    const names = new Set(), real = f.env.PASSWORD_HASHER;
    f.env.PASSWORD_HASHER = { idFromName: name => { names.add(name); return name; }, get: real.get };
    for (let i = 0; i < 10; i++) await f.api(null, '/auth/password/login', 'POST', { email: `absent${i}@example.test`, password: initialPassword });
    assert(names.size <= 8);
    delete f.env.PASSWORD_HASHER;
    assert.equal((await f.api(null, '/auth/password/login', 'POST', { email: 'user1@example.test', password: initialPassword })).status, 503);
    assert.equal((await f.api(1, '/auth/me')).status, 200);
    await addCode(f, 'user1@example.test', 'login');
    assert.equal((await f.api(null, '/auth/verify-code', 'POST', { email: 'user1@example.test', code: '123456' })).status, 200);
    const service = new PasswordHasher();
    assert.equal((await service.fetch(new Request('https://internal/hash'))).status, 405);
    assert.equal((await service.fetch(new Request('https://internal/hash', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password: 'x'.repeat(9000) }) }))).status, 413);
  } finally { f.sqlite.close(); }
});

test('frontend requests keep passwords distinct from OTPs, use expected-user guards and never persist credentials', async () => {
  const original = globalThis.fetch, calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options, body: JSON.parse(options.body) });
    return Response.json({ user: { id: '1', hasPassword: true }, session: { access_token: 'cookie-session' }, message: 'ok' });
  };
  try {
    await signInWithEmail({ email: 'test@example.test', password: initialPassword, method: 'password' });
    await signInWithEmail({ email: 'test@example.test', verificationCode: '123456', method: 'code' });
    await signUpWithEmail({ email: 'test@example.test', password: initialPassword, verificationCode: '123456' });
    await requestPasswordCode({ purpose: 'set', expectedUserId: '1' });
    await resetPasswordWithCode({ email: 'test@example.test', password: nextPassword, verificationCode: '123456' });
    await setAccountPassword({ password: nextPassword, verificationCode: '123456', expectedUserId: '1' });
    assert.deepEqual(calls.map(c => c.url), ['/api/auth/password/login', '/api/auth/verify-code', '/api/auth/password/register', '/api/auth/password/set-code', '/api/auth/password/reset', '/api/auth/password/set']);
    assert.equal(calls[0].body.code, undefined);
    assert.equal(calls[1].body.password, undefined);
    assert.equal(calls[3].options.headers['x-flashcards-user'], '1');
    assert.equal(calls[5].options.headers['x-flashcards-user'], '1');
    assert(calls.every(c => c.options.credentials === 'include'));
  } finally { globalThis.fetch = original; }
});
