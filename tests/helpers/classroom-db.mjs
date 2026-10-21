import { DatabaseSync } from 'node:sqlite'
import { readFile } from 'node:fs/promises'
import worker from '../../worker/index.js'

export const createClassroomFixture = async () => {
  const sqlite = new DatabaseSync(':memory:')
  const schema = await readFile(new URL('../../worker/schema.sql', import.meta.url), 'utf8')
  sqlite.exec(schema)
  const statement = (sql, params = []) => ({
    bind: (...values) => statement(sql, values),
    async first() { return sqlite.prepare(sql).get(...params) || null },
    async all() { return { results: sqlite.prepare(sql).all(...params) } },
    async run() {
      const result = sqlite.prepare(sql).run(...params)
      return { success: true, meta: { changes: Number(result.changes), last_row_id: Number(result.lastInsertRowid) } }
    },
  })
  const env = {
    DB: { prepare: statement }, SESSION_SECRET: 'classroom-integration-tests-only',
    RESEND_API_KEY: 'unused-test-value', RESEND_FROM_EMAIL: 'test@example.test',
  }
  const users = new Map()
  const addUser = async (id, role, displayName = `用户${id}`) => {
    const now = new Date().toISOString()
    const email = `user${id}@example.test`
    sqlite.prepare('INSERT INTO users (id, email, created_at, last_login_at) VALUES (?, ?, ?, ?)').run(id, email, now, now)
    if (role) sqlite.prepare('INSERT INTO account_profiles VALUES (?, ?, ?, ?, ?)').run(id, role, displayName, now, now)
    const token = `test-session-${id}`
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${env.SESSION_SECRET}:session:${token}`))
    const hash = Buffer.from(digest).toString('hex')
    sqlite.prepare('INSERT INTO sessions VALUES (?, ?, ?, ?)').run(hash, id, new Date(Date.now() + 86400000).toISOString(), now)
    users.set(id, { token, email })
    return { id, token, email }
  }
  const api = async (id, path, method = 'GET', body, extraHeaders = {}) => {
    const request = new Request(`https://flashcards.example.test/api${path}`, {
      method,
      headers: {
        ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
        ...(id ? { cookie: `ef_session=${users.get(id)?.token || 'invalid'}` } : {}),
        ...extraHeaders,
      }, body: body === undefined ? undefined : JSON.stringify(body),
    })
    const response = await worker.fetch(request, env)
    return { status: response.status, body: await response.json(), headers: response.headers }
  }
  return { sqlite, schema, env, addUser, api, users, worker }
}
