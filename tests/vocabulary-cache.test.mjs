import assert from 'node:assert/strict'
import test from 'node:test'
import { createVocabularyLoader } from '../src/data/vocabularyCache.js'

const words = [{ id: 1, word: 'learn', meaning: '学习' }]
const url = '/data/vocabulary.json'
const label = '全范围词库加载失败'
const settleWrites = () => new Promise((resolve) => setTimeout(resolve, 0))

const createCacheStorage = () => {
  const stores = new Map()
  return {
    stores,
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map())
      const entries = stores.get(name)
      return {
        async match(key) { return entries.get(key)?.clone() },
        async put(key, value) { entries.set(key, value.clone()) },
        async delete(key) { return entries.delete(key) },
      }
    },
    async keys() { return [...stores.keys()] },
    async delete(name) { return stores.delete(name) },
  }
}

test('concurrent and repeated full-library loads share one request', async () => {
  let calls = 0
  const load = createVocabularyLoader({
    version: 'v1',
    fetchImpl: async (path) => {
      calls += 1
      assert.equal(path, `${url}?v=v1`)
      return Response.json(words)
    },
  })
  const [first, second] = await Promise.all([load(url, label), load(url, label)])
  assert.deepEqual(first, words)
  assert.strictEqual(first, second)
  assert.strictEqual(await load(url, label), first)
  assert.equal(calls, 1)
})

test('a fresh app instance reads persisted vocabulary without a network request', async () => {
  const cacheStorage = createCacheStorage()
  const load = createVocabularyLoader({ version: 'v1', cacheStorage, fetchImpl: async () => Response.json(words) })
  await load(url, label)
  await settleWrites()
  const offlineLoad = createVocabularyLoader({ version: 'v1', cacheStorage, fetchImpl: () => assert.fail('must use disk cache') })
  assert.deepEqual(await offlineLoad(url, label), words)
})

test('readCached checks old vocabulary without making a network request on a miss', async () => {
  const cacheStorage = createCacheStorage()
  const load = createVocabularyLoader({ version: 'v1', cacheStorage, fetchImpl: async () => Response.json(words) })
  assert.equal(await load.readCached(url), null)
  await load(url, label)
  await settleWrites()
  const offlineLoad = createVocabularyLoader({ version: 'v1', cacheStorage, fetchImpl: () => assert.fail('readCached must not fetch') })
  assert.deepEqual(await offlineLoad.readCached(url), words)
  assert.equal(await offlineLoad.readCached('/missing.json'), null)
})

test('a vocabulary revision fetches new data and only removes old vocabulary caches', async () => {
  const cacheStorage = createCacheStorage()
  await cacheStorage.open('unrelated-app-cache')
  await createVocabularyLoader({ version: 'v1', cacheStorage, fetchImpl: async () => Response.json(words) })(url, label)
  await settleWrites()
  const updated = [...words, { id: 2, word: 'study', meaning: '学习' }]
  const load = createVocabularyLoader({ version: 'v2', cacheStorage, fetchImpl: async () => Response.json(updated) })
  assert.deepEqual(await load(url, label), updated)
  await settleWrites()
  assert.deepEqual((await cacheStorage.keys()).sort(), ['flashcards-vocabulary-v2', 'unrelated-app-cache'])
})

test('storage denial does not prevent loading', async () => {
  const load = createVocabularyLoader({
    version: 'v1', cacheStorage: { open: async () => { throw new Error('denied') } },
    fetchImpl: async () => Response.json(words),
  })
  assert.deepEqual(await load(url, label), words)
})

test('a corrupt disk entry falls back to the network', async () => {
  const cacheStorage = createCacheStorage()
  const cache = await cacheStorage.open('flashcards-vocabulary-v1')
  await cache.put(`${url}?v=v1`, new Response('broken json'))
  const load = createVocabularyLoader({ version: 'v1', cacheStorage, fetchImpl: async () => Response.json(words) })
  assert.deepEqual(await load(url, label), words)
})

test('invalid responses are not cached and a retry can succeed', async () => {
  let calls = 0
  const load = createVocabularyLoader({
    version: 'v1', cacheStorage: createCacheStorage(),
    fetchImpl: async () => Response.json(++calls === 1 ? { invalid: true } : words),
  })
  await assert.rejects(load(url, label), /词库格式无效/)
  assert.deepEqual(await load(url, label), words)
  assert.equal(calls, 2)
})

test('HTTP failures release the pending request so retry works', async () => {
  let calls = 0
  const load = createVocabularyLoader({
    version: 'v1',
    fetchImpl: async () => ++calls === 1 ? new Response('', { status: 503 }) : Response.json(words),
  })
  await assert.rejects(load(url, label), /503/)
  assert.deepEqual(await load(url, label), words)
})

test('a hanging request times out, aborts, and allows retry', async () => {
  let calls = 0
  let signal
  const load = createVocabularyLoader({
    version: 'v1', timeoutMs: 20,
    fetchImpl: async (_url, options) => {
      signal = options.signal
      if (++calls === 1) return new Promise(() => {})
      return Response.json(words)
    },
  })
  await assert.rejects(load(url, label), /请求超时/)
  assert.equal(signal.aborted, true)
  assert.deepEqual(await load(url, label), words)
})

test('a stalled response body times out', async () => {
  const stalledBody = createVocabularyLoader({
    version: 'v1', timeoutMs: 20,
    fetchImpl: async () => ({ ok: true, json: () => new Promise(() => {}) }),
  })
  await assert.rejects(stalledBody(url, label), /请求超时/)
})

for (const stage of ['open', 'match', 'json', 'delete']) {
  test(`a stalled cache ${stage} does not block a healthy network request`, async () => {
    const hang = () => new Promise(() => {})
    const cache = {
      match: stage === 'match' ? hang : async () => stage === 'json'
        ? { json: hang } : Response.json({ invalid: true }),
      delete: stage === 'delete' ? hang : async () => {},
      put: async () => {},
    }
    let calls = 0
    const load = createVocabularyLoader({
      version: 'v1', timeoutMs: 50, cacheReadTimeoutMs: 5,
      cacheStorage: { open: stage === 'open' ? hang : async () => cache, keys: async () => [] },
      fetchImpl: async () => { calls += 1; return Response.json(words) },
    })
    assert.deepEqual(await load(url, label), words)
    assert.equal(calls, 1)
  })
}

test('a slow download continues while chunks arrive and preserves UTF-8 across chunks', async () => {
  const bytes = new TextEncoder().encode(JSON.stringify(words))
  let offset = 0
  const load = createVocabularyLoader({
    version: 'v1', timeoutMs: 80,
    fetchImpl: async () => new Response(new ReadableStream({
      async pull(controller) {
        await new Promise(resolve => setTimeout(resolve, 10))
        if (offset === bytes.length) controller.close()
        else controller.enqueue(bytes.slice(offset, ++offset))
      },
    })),
  })
  // The total download takes much longer than the inactivity limit.
  assert.deepEqual(await load(url, label), words)
})

test('a download that stops after headers is cancelled and can be retried', async () => {
  let calls = 0
  let cancelled = false
  const load = createVocabularyLoader({
    version: 'v1', timeoutMs: 20,
    fetchImpl: async () => ++calls === 1 ? new Response(new ReadableStream({
      start(controller) { controller.enqueue(new TextEncoder().encode('[{"id":')) },
      cancel() { cancelled = true },
    })) : Response.json(words),
  })
  await assert.rejects(load(url, label), /请求超时/)
  assert.equal(cancelled, true)
  assert.deepEqual(await load(url, label), words)
})

test('late data from a timed-out request cannot populate memory or disk cache', async () => {
  const cacheStorage = createCacheStorage()
  let finishBody
  let calls = 0
  const load = createVocabularyLoader({
    version: 'v1', timeoutMs: 20, cacheStorage,
    fetchImpl: async () => ++calls === 1
      ? { ok: true, json: () => new Promise(resolve => { finishBody = resolve }) }
      : Response.json(words),
  })
  await assert.rejects(load(url, label), /请求超时/)
  finishBody([{ id: 2, word: 'stale' }])
  await settleWrites()
  assert.equal(cacheStorage.stores.get('flashcards-vocabulary-v1').size, 0)
  assert.deepEqual(await load(url, label), words)
})
