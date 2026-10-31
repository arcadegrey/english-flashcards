import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createCoreVocabularyPreparation } from '../src/data/coreVocabularyPreparation.js'
import { createVocabularyMembership } from '../src/data/vocabularyMembership.js'

const words = [{ id: 1, word: 'one', meaning: '一' }, { id: 2, word: 'two', meaning: '二' }]
const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b }); return { promise, resolve, reject } }
const nextTurn = () => new Promise(resolve => setImmediate(resolve))
const prepare = options => createCoreVocabularyPreparation({ count: 2,
  hasCoreWord: id => id === 1 || id === 2, fallbackDelayMs: 5, fallbackTimeoutMs: 20, ...options })
const read = async file => JSON.parse(await readFile(new URL(`../${file}`, import.meta.url), 'utf8'))

test('generated fallback is exactly the complete public core summary with no example or extended vocabulary data', async () => {
  const startup = await read('src/data/vocabularyStartup.json')
  const [fallback, publicCore, canonicalCore] = await Promise.all([
    read('src/data/coreVocabularyCatalog.json'), read(`public${startup.coreCatalog.path}`), read('public/data/vocabulary/core.json'),
  ])
  assert.deepEqual(fallback, publicCore)
  assert.deepEqual(fallback.map(word => word.id), canonicalCore.map(word => word.id))
  assert.equal(fallback.length, 3545)
  assert(fallback.every(word => !Object.hasOwn(word, 'example') && !Object.hasOwn(word, 'exampleCn')))
  const membership = createVocabularyMembership(startup.coreIdRanges)
  const coreIds = new Set(canonicalCore.map(word => word.id))
  const full = await read('public/data/vocabulary.json')
  for (const { id } of full) assert.equal(membership(id), coreIds.has(id), String(id))
})

test('fast or legacy-cache primary results are shared and do not download the fallback', async () => {
  let calls = 0
  const cached = words.map(word => ({ ...word, example: 'Keep existing complete example.' }))
  const load = prepare({ loadPrimary: () => { calls++; return cached }, loadFallback: () => assert.fail('no extra request on the fast path') })
  const a = load(), b = load()
  assert.strictEqual(a, b)
  assert.strictEqual(await a, cached)
  assert.strictEqual(await load(), cached)
  assert.equal(calls, 1)
})

test('a stalled primary cannot strand bootstrap; the alternate route supplies the complete validated core', async () => {
  const primary = deferred()
  let fallbackCalls = 0
  const load = prepare({ loadPrimary: () => primary.promise, loadFallback: () => { fallbackCalls++; return words } })
  const a = load(), b = load()
  assert.strictEqual(a, b)
  assert.strictEqual(await a, words)
  primary.reject(new Error('late original network timeout'))
  await nextTurn()
  assert.strictEqual(await load(), words)
  assert.equal(fallbackCalls, 1)
})

test('an immediate JSON failure starts the fallback without waiting for the slow-path delay', async () => {
  const load = prepare({ fallbackDelayMs: 60000, loadPrimary: () => { throw new Error('public JSON blocked') }, loadFallback: () => words })
  assert.strictEqual(await load(), words)
})

test('an invalid fallback never releases a partial, mixed-core or malformed vocabulary into the application', async () => {
  for (const invalid of [words.slice(1), [words[0], words[0]], [words[0], { ...words[1], id: 3 }],
    [words[0], { ...words[1], meaning: null }]]) {
    const primary = deferred(), fallbackTried = deferred()
    const load = prepare({ loadPrimary: () => primary.promise,
      loadFallback: () => { fallbackTried.resolve(); return invalid } })
    const request = load()
    await fallbackTried.promise
    await nextTurn()
    primary.resolve(words)
    assert.strictEqual(await request, words)
  }
})

test('both failed paths expose the original actionable error and an explicit retry can recover', async () => {
  let tries = 0
  const original = new Error('词库目录加载失败：请求超时，请检查网络后重试')
  const load = prepare({ loadPrimary: () => { tries++; throw original },
    loadFallback: () => { if (tries === 1) throw new Error('code chunk unavailable'); return words } })
  await assert.rejects(load(), error => error === original)
  assert.strictEqual(await load(), words)
  assert.equal(tries, 2)
})

test('a stalled code fallback is bounded, and its late completion cannot overwrite a subsequent retry', async () => {
  const stale = deferred()
  let tries = 0
  const load = prepare({ loadPrimary: () => { tries++; throw new Error('primary unavailable') },
    loadFallback: () => tries === 1 ? stale.promise : words })
  await assert.rejects(load(), /primary unavailable/)
  assert.strictEqual(await load(), words)
  stale.resolve(words.map(word => ({ ...word, meaning: 'stale' })))
  await nextTurn()
  assert.strictEqual(await load(), words)
})

test('a winning primary is retained when an already-started code fallback later fails', async () => {
  const primary = deferred(), fallback = deferred(), fallbackStarted = deferred()
  const load = prepare({ loadPrimary: () => primary.promise,
    loadFallback: () => { fallbackStarted.resolve(); return fallback.promise } })
  const request = load()
  await fallbackStarted.promise
  primary.resolve(words)
  assert.strictEqual(await request, words)
  fallback.reject(new Error('late import error'))
  await nextTurn()
  assert.strictEqual(await load(), words)
})
