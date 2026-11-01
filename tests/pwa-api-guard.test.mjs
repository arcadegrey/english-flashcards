import test from 'node:test'
import assert from 'node:assert/strict'
import { requestApi } from '../src/utils/workerAuth.js'
import { pwaUpdates } from '../src/utils/pwaUpdates.js'

test('API update guard spans response parsing and preserves auth headers; every failure releases it', async () => {
  const original = globalThis.fetch
  pwaUpdates.setBusy(false)
  try {
    let resolve
    globalThis.fetch = async (url, options) => {
      assert.equal(url, '/api/progress')
      assert.equal(options.credentials, 'include')
      assert.equal(options.headers['x-flashcards-user'], 'account-a')
      return { ok: true, headers: new Headers({ 'content-type': 'application/json' }),
        json: () => new Promise(done => { resolve = done }) }
    }
    const pending = requestApi('/progress', { expectedUserId: 'account-a' })
    await new Promise(done => setImmediate(done))
    assert.equal(pwaUpdates.getSnapshot().busy, true)
    resolve({ version: 7 }); assert.deepEqual(await pending, { version: 7 })
    assert.equal(pwaUpdates.getSnapshot().busy, false)
    for (const response of [new Error('network failure'), Response.json({ error: 'not authorized' }, { status: 401 })]) {
      globalThis.fetch = async () => { if (response instanceof Error) throw response; return response }
      await assert.rejects(requestApi('/progress'))
      assert.equal(pwaUpdates.getSnapshot().busy, false)
    }
    globalThis.fetch = async () => Response.json({}, { status: 401 })
    assert.equal((await requestApi('/auth/me', { allowUnauthorized: true })).unauthorized, true)
    assert.equal(pwaUpdates.getSnapshot().busy, false)
  } finally { globalThis.fetch = original; pwaUpdates.setBusy(true) }
})
