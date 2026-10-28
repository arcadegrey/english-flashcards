import test from 'node:test'
import assert from 'node:assert/strict'
import { createLearningViewLoader } from '../src/utils/learningViewLoader.js'

test('learning resources stay deferred until intent and concurrent callers share the resolved module', async () => {
  let calls = 0, resolve
  const module = { default: () => null }
  const load = createLearningViewLoader(() => {
    calls++
    return new Promise(done => { resolve = done })
  })
  assert.equal(calls, 0)
  const preparation = load()
  const render = load()
  assert.equal(preparation, render)
  await Promise.resolve()
  assert.equal(calls, 1)
  resolve(module)
  assert.equal(await preparation, module)
  assert.equal(await load(), module)
  assert.equal(calls, 1)
})

test('a failed resource request rejects all waiters and the next explicit intent retries', async () => {
  const original = new Error('isolated chunk failure')
  let calls = 0
  const module = { default: () => null }
  const load = createLearningViewLoader(async () => {
    if (++calls === 1) throw original
    return module
  })
  const first = load(), second = load()
  const results = await Promise.allSettled([first, second])
  for (const result of results) {
    assert.equal(result.status, 'rejected')
    assert.match(result.reason.message, /学习页面加载失败.*重试/)
    assert.equal(result.reason.cause, original)
  }
  const retry = load()
  assert.notEqual(retry, first)
  assert.equal(await retry, module)
  assert.equal(calls, 2)
})
