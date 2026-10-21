import assert from 'node:assert/strict'
import test from 'node:test'
import { createClassroomFixture } from './helpers/classroom-db.mjs'

const addCode = async (f, email, mode, code = '123456') => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${f.env.SESSION_SECRET}:otp:${mode}:${email}:${code}`))
  f.sqlite.prepare('INSERT INTO login_codes (email,mode,code_hash,expires_at,created_at) VALUES (?,?,?,?,?)')
    .run(email, mode, Buffer.from(digest).toString('hex'), new Date(Date.now() + 600000).toISOString(), new Date().toISOString())
}

test('verified registration persists roles while login ignores attempted role elevation', async () => {
  const f = await createClassroomFixture()
  const email = 'new-teacher@example.test'
  await addCode(f, email, 'register')
  const created = await f.api(null, '/auth/verify-code', 'POST', { email, mode: 'register', code: '123456', role: 'teacher', displayName: '王老师' })
  assert.equal(created.status, 200, JSON.stringify(created.body))
  assert.equal(created.body.user.role, 'teacher')
  assert.equal(created.body.user.displayName, '王老师')
  assert.equal(f.sqlite.prepare('SELECT role FROM account_profiles WHERE user_id = ?').get(created.body.user.id).role, 'teacher')
  assert.match(created.headers.get('set-cookie'), /HttpOnly/)
  await f.addUser(10, 'student')
  await addCode(f, 'user10@example.test', 'login')
  const login = await f.api(null, '/auth/verify-code', 'POST', { email: 'user10@example.test', mode: 'login', code: '123456', role: 'teacher' })
  assert.equal(login.status, 200)
  assert.equal(login.body.user.role, 'student')
  f.sqlite.close()
})

const setup = async () => {
  const f = await createClassroomFixture()
  for (const [id, role] of [[1, 'teacher'], [2, 'student'], [3, 'teacher'], [4, 'student'], [5, null]]) await f.addUser(id, role)
  const created = await f.api(1, '/classes', 'POST', { name: '托福一班' })
  assert.equal(created.status, 201, JSON.stringify(created.body))
  return { ...f, classroom: created.body.classroom }
}

test('classroom schema can be applied repeatedly without changing existing records', async () => {
  const f = await setup()
  f.sqlite.exec(f.schema)
  assert.equal(f.sqlite.prepare('SELECT COUNT(*) AS count FROM users').get().count, 5)
  assert.equal(f.sqlite.prepare('SELECT COUNT(*) AS count FROM classes').get().count, 1)
  f.sqlite.close()
})

test('all classroom endpoints authenticate cookies and enforce teacher/student roles', async () => {
  const f = await setup()
  assert.equal((await f.api(null, '/classroom')).status, 401)
  assert.equal((await f.api(999, '/classroom')).status, 401)
  assert.equal((await f.api(2, '/classes', 'POST', { name: '伪造班级', role: 'teacher' })).status, 403)
  assert.equal((await f.api(1, '/classes/join', 'POST', { inviteCode: f.classroom.inviteCode })).status, 403)
  assert.equal((await f.api(2, `/classes/${f.classroom.id}/students`)).status, 403)
  assert.equal((await f.api(5, '/classes/join', 'POST', { inviteCode: f.classroom.inviteCode })).status, 403)
  assert.equal((await f.api(3, `/classes/${f.classroom.id}/students`)).status, 404)
  assert.equal((await f.api(3, `/classes/${f.classroom.id}/invite-code`, 'POST', {})).status, 404)
  assert.equal((await f.api(3, `/classes/${f.classroom.id}/students/2`, 'DELETE')).status, 404)
  f.sqlite.close()
})

test('legacy users choose a cloud profile and cannot change role while associated with a class', async () => {
  const f = await setup()
  const legacy = await f.api(5, '/auth/me')
  assert.equal(legacy.body.user.profileConfigured, false)
  assert.equal((await f.api(5, '/classroom/profile', 'POST', { role: 'admin', displayName: '学生' })).status, 400)
  assert.equal((await f.api(5, '/classroom/profile', 'POST', { role: 'student', displayName: '小明' })).status, 200)
  assert.equal((await f.api(5, '/auth/me')).body.user.displayName, '小明')
  assert.equal((await f.api(5, '/classes/join', 'POST', { inviteCode: f.classroom.inviteCode.toLowerCase() })).status, 200)
  assert.equal((await f.api(5, '/classroom/profile', 'POST', { role: 'teacher', displayName: '小明' })).status, 409)
  assert.equal((await f.api(1, '/classroom/profile', 'POST', { role: 'student', displayName: '老师' })).status, 409)
  assert.equal((await f.api(5, `/classes/${f.classroom.id}/membership`, 'DELETE')).status, 200)
  assert.equal((await f.api(5, '/classroom/profile', 'POST', { role: 'teacher', displayName: '小明' })).status, 200)
  f.sqlite.close()
})

test('joining is idempotent; the owning teacher sees synced progress and only shared custom words', async () => {
  const f = await setup()
  const id = f.classroom.id
  for (let i = 0; i < 2; i++) assert.equal((await f.api(2, '/classes/join', 'POST', { inviteCode: f.classroom.inviteCode })).status, 200)
  const saved = await f.api(2, '/progress', 'PUT', { progress: {
    learnedWords: [1, 'custom-shared'], masteredWords: [2], wrongWords: [1],
    customWords: [{ id: 'custom-shared', word: 'shared', meaning: '已学习的自定义词' }, { id: 'private', word: 'private', meaning: '未学习的自定义词' }],
    wordProgress: { 1: { lastReviewed: new Date().toISOString() }, private: { lastReviewed: 'private' } },
    studyHistory: [{ date: new Date().toISOString().slice(0, 10), wordsLearned: 2, wordsMastered: 1 }],
  } })
  assert.equal(saved.status, 200)
  const roster = await f.api(1, `/classes/${id}/students`)
  assert.equal(roster.body.total, 1)
  assert.equal(roster.body.students[0].learnedCount, 2)
  assert.equal(roster.body.students[0].masteredCount, 1)
  assert.equal(roster.body.students[0].todayStudied, 3)
  const detail = await f.api(1, `/classes/${id}/students/2/progress`)
  assert.equal(detail.status, 200)
  assert.equal(detail.body.progress.customWords.length, 1)
  assert.equal(detail.body.progress.customWords[0].word, 'shared')
  assert.equal(detail.body.progress.wordProgress.private, undefined)
  assert.equal((await f.api(1, `/classes/${id}/students/4/progress`)).status, 404)
  assert.equal((await f.api(3, `/classes/${id}/students/2/progress`)).status, 404)
  assert.equal((await f.api(4, `/classes/${id}/students/2/progress`)).status, 403)
  assert.equal((await f.api(1, `/classes/${id}/students/2/progress`, 'PUT', { progress: {} })).status, 404)
  assert.deepEqual((await f.api(2, '/progress')).body.progress.learnedWords, [1, 'custom-shared'])
  assert.equal((await f.api(2, '/classroom')).body.classes[0].inviteCode, undefined)
  f.sqlite.close()
})

test('leaving or removal immediately revokes teacher access without deleting learning progress', async () => {
  const f = await setup()
  const path = `/classes/${f.classroom.id}`
  await f.api(2, '/classes/join', 'POST', { inviteCode: f.classroom.inviteCode })
  await f.api(2, '/progress', 'PUT', { progress: { learnedWords: [7] } })
  await f.api(2, `${path}/membership`, 'DELETE')
  assert.equal((await f.api(1, `${path}/students/2/progress`)).status, 404)
  await f.api(2, '/classes/join', 'POST', { inviteCode: f.classroom.inviteCode })
  await f.api(1, `${path}/students/2`, 'DELETE')
  assert.equal((await f.api(1, `${path}/students/2/progress`)).status, 404)
  assert.deepEqual((await f.api(2, '/progress')).body.progress.learnedWords, [7])
  f.sqlite.close()
})

test('rotating an invite code blocks old codes and preserves existing memberships', async () => {
  const f = await setup()
  await f.api(2, '/classes/join', 'POST', { inviteCode: f.classroom.inviteCode })
  const rotated = await f.api(1, `/classes/${f.classroom.id}/invite-code`, 'POST', {})
  assert.match(rotated.body.inviteCode, /^[A-HJ-NP-Z2-9]{10}$/)
  assert.notEqual(rotated.body.inviteCode, f.classroom.inviteCode)
  assert.equal((await f.api(4, '/classes/join', 'POST', { inviteCode: f.classroom.inviteCode })).status, 404)
  assert.equal((await f.api(4, '/classes/join', 'POST', { inviteCode: rotated.body.inviteCode })).status, 200)
  assert.equal((await f.api(1, `/classes/${f.classroom.id}/students`)).body.total, 2)
  f.sqlite.close()
})

test('class mutations reject cross-site form requests and invalid input', async () => {
  const f = await setup()
  assert.equal((await f.api(1, '/classes', 'POST', { name: 'test' }, { 'content-type': 'text/plain' })).status, 415)
  assert.equal((await f.api(1, '/classes', 'POST', { name: 'test' }, { 'sec-fetch-site': 'cross-site' })).status, 403)
  for (const name of ['', ' '.repeat(3), 'a'.repeat(61)]) assert.equal((await f.api(1, '/classes', 'POST', { name })).status, 400)
  assert.equal((await f.api(1, '/classes', 'POST', null)).status, 400)
  assert.equal((await f.api(2, '/classes/join', 'POST', { inviteCode: "' OR 1=1" })).status, 400)
  f.sqlite.close()
})

test('roster pagination counts all enrolled students and exposes only the requested page', async () => {
  const f = await setup()
  for (let id = 10; id < 31; id++) {
    await f.addUser(id, 'student')
    await f.api(id, '/classes/join', 'POST', { inviteCode: f.classroom.inviteCode })
  }
  const first = await f.api(1, `/classes/${f.classroom.id}/students`)
  const second = await f.api(1, `/classes/${f.classroom.id}/students?page=2`)
  assert.equal(first.body.total, 21)
  assert.equal(first.body.students.length, 20)
  assert.equal(second.body.students.length, 1)
  assert.equal(second.body.students[0].lastSyncedAt, '')
  assert.equal(second.body.students[0].learnedCount, 0)
  f.sqlite.close()
})
