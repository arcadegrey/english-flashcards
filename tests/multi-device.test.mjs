import test from 'node:test';
import assert from 'node:assert/strict';
import { createClassroomFixture } from './helpers/classroom-db.mjs';

async function loginAnotherDevice(f, id) {
  const email = `user${id}@example.test`, code = '123456';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${f.env.SESSION_SECRET}:otp:login:${email}:${code}`));
  f.sqlite.prepare('INSERT INTO login_codes (email,mode,code_hash,expires_at,created_at) VALUES (?,?,?,?,?)')
    .run(email, 'login', Buffer.from(digest).toString('hex'), new Date(Date.now() + 600000).toISOString(), new Date().toISOString());
  const response = await f.api(null, '/auth/verify-code', 'POST', { email, code, mode: 'login' });
  assert.equal(response.status, 200);
  return { cookie: response.headers.get('set-cookie').split(';')[0], 'x-flashcards-user': String(id) };
}

test('two device logins stay valid; current-device logout leaves the other session and progress intact', async () => {
  const f = await createClassroomFixture();
  try {
    await f.addUser(1, 'student');
    await f.api(1, '/progress', 'PUT', { progress: { learnedWords: [1234] } });
    const second = await loginAnotherDevice(f, 1);
    assert.equal((await f.api(1, '/auth/me')).status, 200);
    assert.equal((await f.api(null, '/auth/me', 'GET', undefined, second)).status, 200);
    assert.deepEqual((await f.api(null, '/progress', 'GET', undefined, second)).body.progress.learnedWords, [1234]);
    assert.equal((await f.api(null, '/auth/logout', 'POST', {}, second)).status, 200);
    assert.equal((await f.api(null, '/auth/me', 'GET', undefined, second)).status, 401);
    assert.equal((await f.api(1, '/auth/me')).status, 200);
  } finally { f.sqlite.close(); }
});

test('logout-all revokes only the authenticated account and rejects stale-tab/cross-site requests', async () => {
  const f = await createClassroomFixture();
  try {
    await f.addUser(1, 'student'); await f.addUser(2, 'student');
    const second = await loginAnotherDevice(f, 1);
    assert.equal((await f.api(null, '/auth/logout-all', 'POST', {})).status, 401);
    assert.equal((await f.api(1, '/auth/logout-all', 'POST', {}, { 'x-flashcards-user': '2' })).status, 409);
    assert.equal((await f.api(1, '/auth/logout-all', 'POST', {}, { 'sec-fetch-site': 'cross-site' })).status, 403);
    assert.equal((await f.api(1, '/auth/logout-all', 'POST', {}, { origin: 'https://other.example' })).status, 403);
    assert.equal((await f.api(1, '/auth/logout-all', 'POST', {}, { 'content-type': 'text/plain' })).status, 415);
    const logout = await f.api(null, '/auth/logout-all', 'POST', {}, second);
    assert.equal(logout.status, 200); assert.match(logout.headers.get('set-cookie'), /Max-Age=0/);
    assert.equal((await f.api(1, '/auth/me')).status, 401);
    assert.equal((await f.api(null, '/auth/me', 'GET', undefined, second)).status, 401);
    assert.equal((await f.api(2, '/auth/me')).status, 200);
    assert.equal((await f.api(null, '/progress', 'PUT', { progress: { learnedWords: [9] } }, second)).status, 401);
  } finally { f.sqlite.close(); }
});

test('failed session deletion is reported as a failure and does not claim logout succeeded', async () => {
  const f = await createClassroomFixture();
  try {
    await f.addUser(1, 'student');
    const prepare = f.env.DB.prepare;
    f.env.DB.prepare = sql => sql.startsWith('DELETE FROM sessions') ? { bind: () => ({ run: async () => { throw new Error('test deletion failure'); } }) } : prepare(sql);
    assert.equal((await f.api(1, '/auth/logout-all', 'POST', {})).status, 500);
    assert.equal((await f.api(1, '/auth/me')).status, 200);
  } finally { f.sqlite.close(); }
});

test('a stale device sync keeps newer review schedules and both devices\' distinct word records', async () => {
  const f = await createClassroomFixture();
  try {
    await f.addUser(1, 'student');
    const second = await loginAnotherDevice(f, 1);
    const firstSchedule = { lastReviewed: '2026-10-25T03:00:00Z', interval: 6, nextReview: '2026-10-31T00:00:00Z' };
    const staleSchedule = { lastReviewed: '2026-10-24T03:00:00Z', interval: 1, nextReview: '2026-10-25T00:00:00Z' };
    await f.api(1, '/progress', 'PUT', { progress: { learnedWords: [1, 2], wordProgress: { 1: firstSchedule, 2: firstSchedule } } });
    const synced = await f.api(null, '/progress', 'PUT', { baseUpdatedAt: 'stale-version',
      progress: { learnedWords: [1, 3], wordProgress: { 1: staleSchedule, 3: staleSchedule } } }, second);
    assert.equal(synced.status, 200);
    assert.equal(synced.body.conflictResolved, true);
    assert.deepEqual(synced.body.progress.wordProgress, { 1: firstSchedule, 2: firstSchedule, 3: staleSchedule });
    assert.deepEqual(new Set(synced.body.progress.learnedWords), new Set([1, 2, 3]));
  } finally { f.sqlite.close(); }
});

test('concurrent verification cannot reuse one code to create multiple device sessions', async () => {
  const f = await createClassroomFixture();
  try {
    await f.addUser(1, 'student');
    const email = 'user1@example.test', code = '654321';
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${f.env.SESSION_SECRET}:otp:login:${email}:${code}`));
    f.sqlite.prepare('INSERT INTO login_codes (email,mode,code_hash,expires_at,created_at) VALUES (?,?,?,?,?)')
      .run(email, 'login', Buffer.from(digest).toString('hex'), new Date(Date.now() + 600000).toISOString(), new Date().toISOString());
    const responses = await Promise.all(Array.from({ length: 2 }, () => f.api(null, '/auth/verify-code', 'POST', { email, code, mode: 'login' })));
    assert.deepEqual(responses.map(response => response.status).sort(), [200, 400]);
    assert.equal(f.sqlite.prepare('SELECT COUNT(*) AS count FROM sessions WHERE user_id=1').get().count, 2);
  } finally { f.sqlite.close(); }
});

test('a newer forgotten-word review beats stale mastery on another authenticated device', async () => {
  const f = await createClassroomFixture();
  try {
    await f.addUser(1, 'student');
    const second = await loginAnotherDevice(f, 1);
    const known = { masteredWords: [1], wordProgress: { 1: { lastReviewed: '2026-11-01T01:00:00Z', interval: 6 } } };
    const forgotten = { learnedWords: [1], wrongWords: [1], wordProgress: { 1: { lastReviewed: '2026-11-02T01:00:00Z', interval: 1 } } };
    const first = await f.api(1, '/progress', 'PUT', { progress: known });
    const saved = await f.api(null, '/progress', 'PUT', { baseUpdatedAt: 'offline-version', progress: forgotten }, second);
    assert.equal(saved.status, 200);
    assert.equal(saved.body.conflictResolved, true);
    assert.deepEqual(saved.body.progress.learnedWords, [1]);
    assert.deepEqual(saved.body.progress.masteredWords, []);
    assert.deepEqual(saved.body.progress.wrongWords, [1]);
    const retried = await f.api(1, '/progress', 'PUT', { baseUpdatedAt: first.body.updatedAt, progress: known });
    assert.deepEqual(retried.body.progress.learnedWords, [1]);
    assert.deepEqual(retried.body.progress.masteredWords, []);
    assert.equal(retried.body.progress.wordProgress[1].interval, 1);
  } finally { f.sqlite.close(); }
});

test('offline preference and bookmark changes converge without leaking into a second account', async () => {
  const f = await createClassroomFixture();
  try {
    await f.addUser(1, 'student'); await f.addUser(2, 'student');
    const second = await loginAnotherDevice(f, 1);
    const early = '2026-11-01T01:00:00.000Z', late = '2026-11-02T01:00:00.000Z';
    const before = await f.api(1, '/progress', 'PUT', { progress: { learnedWords: [1], preferences: {
      dailyNewWordTarget: 15, updatedAt: early, wordBookmarks: { 1: { saved: true, updatedAt: early } },
    } } });
    await f.api(1, '/progress', 'PUT', { baseUpdatedAt: before.body.updatedAt, progress: { learnedWords: [1, 2], preferences: {
      dailyNewWordTarget: 25, updatedAt: late, wordBookmarks: { 1: { saved: false, updatedAt: late } },
    } } });
    const retried = await f.api(null, '/progress', 'PUT', { baseUpdatedAt: before.body.updatedAt, progress: {
      learnedWords: [1, 3], preferences: { dailyNewWordTarget: 15, updatedAt: early, wordBookmarks: {
        1: { saved: true, updatedAt: early }, 2: { saved: true, updatedAt: late },
      } },
    } }, second);
    assert.equal(retried.body.conflictResolved, true);
    assert.deepEqual(new Set(retried.body.progress.learnedWords), new Set([1, 2, 3]));
    assert.equal(retried.body.progress.preferences.dailyNewWordTarget, 25);
    assert.equal(retried.body.progress.preferences.wordBookmarks[1].saved, false);
    assert.equal(retried.body.progress.preferences.wordBookmarks[2].saved, true);
    const rejected = await f.api(2, '/progress', 'PUT', { progress: retried.body.progress }, { 'x-flashcards-user': '1' });
    assert.equal(rejected.status, 409);
    const isolated = await f.api(2, '/progress');
    assert.deepEqual(isolated.body.progress.learnedWords, []);
    assert.deepEqual(isolated.body.progress.preferences, {});
    assert.deepEqual((await f.api(1, '/progress')).body.progress, retried.body.progress);
  } finally { f.sqlite.close(); }
});
