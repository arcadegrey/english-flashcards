import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../worker/index.js';
import { createClassroomFixture } from './helpers/classroom-db.mjs';

test('auth origin and JSON guards run before route dispatch, including unknown auth endpoints', async () => {
  for (const path of ['/api/auth/send-code', '/api/auth/password/login', '/api/auth/unknown']) {
    for (const headers of [{ origin: 'https://foreign.example.test' }, { 'sec-fetch-site': 'cross-site' }]) {
      const response = await worker.fetch(new Request(`https://flashcards.example.test${path}`, {
        method: 'POST', headers, body: '{}',
      }), {});
      assert.equal(response.status, 403, path);
      assert.equal((await response.json()).code, 'CROSS_SITE');
      assert.equal(response.headers.get('cache-control'), 'no-store');
    }
    const response = await worker.fetch(new Request(`https://flashcards.example.test${path}`, {
      method: 'POST', headers: { 'content-type': 'text/plain' }, body: '{}',
    }), {});
    assert.equal(response.status, 415, path);
  }
});

test('expected-account checks protect every dispatched feature before reads or writes', async () => {
  const f = await createClassroomFixture();
  try {
    await f.addUser(1, 'student'); await f.addUser(2, 'student');
    await f.api(2, '/progress', 'PUT', { progress: { learnedWords: [77] } });
    const before = f.sqlite.prepare('SELECT * FROM user_progress WHERE user_id=2').get();
    for (const path of ['/progress', '/auth/me', '/classroom/profile', '/classes', '/reading-attempts', '/exam-attempts', '/word-assignments', '/reading-sessions/reading%3A13']) {
      for (const method of ['GET', 'POST']) {
        const response = await f.api(2, path, method, method === 'POST' ? {} : undefined, { 'x-flashcards-user': '1' });
        assert.equal(response.status, 409, `${method} ${path}`);
        assert.equal(response.body.code, 'ACCOUNT_CHANGED');
        const anonymous = await f.api(null, path, method, method === 'POST' ? {} : undefined, { 'x-flashcards-user': '1' });
        assert.equal(anonymous.status, 401, `${method} ${path}`);
      }
    }
    assert.deepEqual(f.sqlite.prepare('SELECT * FROM user_progress WHERE user_id=2').get(), before);
  } finally { f.sqlite.close(); }
});

test('router retains unknown-route and auth-service failure response boundaries', async () => {
  const request = (path, method = 'GET') => new Request(`https://flashcards.example.test${path}`, {
    method, ...(method === 'POST' ? { headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'user@example.test', password: 'Test passphrase' }) } : {}),
  });
  const unknown = await worker.fetch(request('/api/unknown'), {});
  assert.equal(unknown.status, 404);
  assert.equal((await unknown.json()).code, 'NOT_FOUND');
  const legacy = await worker.fetch(request('/api/auth/send-code', 'POST'), {});
  assert.equal(legacy.status, 500);
  assert.equal((await legacy.json()).code, 'INTERNAL_ERROR');
  const password = await worker.fetch(request('/api/auth/password/login', 'POST'), {});
  assert.equal(password.status, 503);
  assert.equal(typeof (await password.json()).error, 'string');
  const failedDatabase = await worker.fetch(request('/api/auth/password/login', 'POST'), {
    DB: { prepare() { throw new Error('Disposable database unavailable'); } }, SESSION_SECRET: 'test',
  });
  assert.equal(failedDatabase.status, 503);
  assert.equal((await failedDatabase.json()).code, 'AUTH_UNAVAILABLE');
  const unavailable = await worker.fetch(request('/'), {});
  assert.equal(unavailable.status, 404);
});
