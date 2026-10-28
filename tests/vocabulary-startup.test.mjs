import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createVocabularyMembership } from '../src/data/vocabularyMembership.js'
import { loadVocabularyCatalogEntry } from '../src/data/vocabularyCatalogEntry.js'
import { createVocabularyLoader } from '../src/data/vocabularyCache.js'
import { createFullVocabularyCatalogLoader } from '../src/data/fullVocabularyCatalog.js'
import { createVocabularyDetailsLoader } from '../src/data/vocabularyDetails.js'

const read = async path => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'))
const [startup, index, full, core] = await Promise.all([
  read('../src/data/vocabularyStartup.json'), read('../src/data/vocabularyIndex.json'),
  read('../public/data/vocabulary.json'), read('../public/data/vocabulary/core.json'),
])
const hasWord = createVocabularyMembership(startup.idRanges)
const summaries = await read(`../public${startup.coreCatalog.path}`)
const load = fetchJson => loadVocabularyCatalogEntry(fetchJson, startup.core, startup.coreCatalog, hasWord)

test('light startup metadata matches the complete delivery index and every canonical/retired ID', () => {
  assert.equal(startup.total, full.length)
  assert.deepEqual(startup.counts, index.counts)
  assert.equal(startup.core, index.core)
  assert.deepEqual(startup.coreCatalog, index.catalog.core)
  assert.equal(startup.extended, index.extended)
  assert.deepEqual(startup.catalog.extended, index.catalog.extended)
  const ids = new Set(full.map(word => String(word.id)))
  for (let id = -1; id <= Math.max(...full.map(word => word.id)) + 1; id++) {
    assert.equal(hasWord(id), ids.has(String(id)), `number ${id}`)
    assert.equal(hasWord(String(id)), ids.has(String(id)), `string ${id}`)
  }
  for (const id of ['01', '1.0', '1e0', ' 1', '1 ', '', '-0', 'custom-1', null, undefined, NaN, Infinity, true, 1n]) {
    assert.equal(hasWord(id), ids.has(String(id)), `legacy string-key semantics ${String(id)}`)
  }
  assert(Buffer.byteLength(JSON.stringify(startup)) < Buffer.byteLength(JSON.stringify(index)) / 10)
})

test('early bootstrap and application callers share one original validated core request', async () => {
  let calls = 0, release
  const gate = new Promise(resolve => { release = resolve })
  const fetchJson = createVocabularyLoader({ version: 'shared-startup', cacheStorage: undefined, fetchImpl: async path => {
    calls++
    assert.equal(path, `${startup.coreCatalog.path}?v=shared-startup`)
    await gate
    return Response.json(summaries)
  } })
  const early = load(fetchJson), app = load(fetchJson)
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(calls, 1)
  release()
  const [first, second] = await Promise.all([early, app])
  assert.strictEqual(first, second)
  assert.deepEqual(first, summaries)
  assert.strictEqual(await load(fetchJson), first)
  assert.equal(calls, 1)
})

test('old complete core caches remain offline usable with their original fields and identities', async () => {
  const fetchJson = () => assert.fail('warm legacy core must not request a new summary')
  fetchJson.readCached = async (path, validate) => {
    assert.equal(path, index.core)
    assert.equal(validate(core), true)
    return core
  }
  assert.strictEqual(await load(fetchJson), core)
})

test('failed preparation and malformed core responses release explicit retry without partial results', async () => {
  let calls = 0
  const fetchJson = createVocabularyLoader({ version: 'startup-retry', cacheStorage: undefined, fetchImpl: async () => {
    if (++calls === 1) throw new Error('isolated failure')
    return Response.json(calls === 2 ? summaries.slice(1) : summaries)
  } })
  await assert.rejects(load(fetchJson), /isolated failure/)
  await assert.rejects(load(fetchJson), /格式无效/)
  assert.deepEqual(await load(fetchJson), summaries)
  assert.equal(calls, 3)
})

test('core validation retains active membership, unique IDs and required text checks', async () => {
  const invalid = [
    summaries.map((word, i) => i ? word : { ...word, id: 'custom-poison' }),
    summaries.map((word, i) => i ? summaries[0] : word),
    summaries.map((word, i) => i ? word : { ...word, meaning: null }),
  ]
  for (const words of invalid) {
    const fetchJson = createVocabularyLoader({ version: 'invalid-core', cacheStorage: undefined, fetchImpl: async () => Response.json(words) })
    await assert.rejects(load(fetchJson), /格式无效/)
  }
})

test('complete learning summaries do not require the ID/List locator and retain retry/cache semantics', async () => {
  const requests = []
  const fetchJson = createVocabularyLoader({ version: 'light-full', cacheStorage: undefined, fetchImpl: async path => {
    requests.push(path.split('?')[0])
    return Response.json(await read(`../public${path.split('?')[0]}`))
  } })
  const loadFull = createFullVocabularyCatalogLoader({ fetchJson, index: startup, loadCoreCatalog: () => load(fetchJson), hasWord })
  const [first, second] = await Promise.all([loadFull(), loadFull()])
  assert.strictEqual(first, second)
  assert.deepEqual(first.map(word => word.id), full.map(word => word.id).sort((a, b) => a - b))
  assert.deepEqual(requests.sort(), [startup.coreCatalog.path, startup.catalog.extended.path].sort())
  assert.strictEqual(await loadFull(), first)
  const offline = () => assert.fail('legacy full cache must remain available')
  offline.readCached = async path => path === '/data/vocabulary.json' ? full : null
  assert.strictEqual(await createFullVocabularyCatalogLoader({ fetchJson: offline, index: startup, loadCoreCatalog: () => assert.fail('no core request'), hasWord })(), full)
})

test('detail-only locator is identical to the original batches without requiring ID/List locations', async () => {
  const config = await read('../src/data/vocabularyDetailsIndex.json')
  assert.deepEqual(config, index.details)
  assert(Buffer.byteLength(JSON.stringify(config)) < Buffer.byteLength(JSON.stringify(index)) / 4)
  const calls = []
  const service = createVocabularyDetailsLoader({ config, hasWord,
    fetchJson: async path => { calls.push(path); return read(`../public${path}`) },
    getLegacyPaths: () => assert.fail('normal example delivery needs no full locator'),
  })
  const word = full.find(word => word.id === 9026)
  const deferred = { id: word.id, word: word.word, exampleDeferred: true }
  const details = await service.loadDetails(deferred)
  assert.equal(details.example, word.example)
  assert.equal(details.exampleCn, word.exampleCn)
  assert.strictEqual(service.peekDetails(deferred), details)
  assert.deepEqual(calls, [config.batches[Math.floor(word.id / config.batchSize)]])
})
