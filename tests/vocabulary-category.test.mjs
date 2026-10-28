import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { gzipSync } from 'node:zlib'
import { createCategoryVocabularyCatalogLoader } from '../src/data/categoryVocabularyCatalog.js'
import { createVocabularyMembership } from '../src/data/vocabularyMembership.js'
import { createVocabularyLoader } from '../src/data/vocabularyCache.js'
import { createVocabularyDelivery } from '../src/data/vocabularyDelivery.js'
import { summarizeVocabularyWord } from '../src/data/vocabularySummary.js'
import { needsPlanCatalog } from '../src/utils/dailyPlan.js'
import { getWordCategories } from '../src/utils/wordCategories.js'

const read = async path => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'))
const [categories, startup, index, full, core] = await Promise.all([
  read('src/data/vocabularyCategoryIndex.json'), read('src/data/vocabularyStartup.json'),
  read('src/data/vocabularyIndex.json'), read('public/data/vocabulary.json'), read('public/data/vocabulary/core.json'),
])
const coreIds = new Set(core.map(word => String(word.id)))
const inCategory = (words, category) => words.filter(word => getWordCategories(word).includes(category))
const sorted = words => [...words].sort((a, b) => a.id - b.id)
const make = ({ cached = new Map(), fetchImpl, loadByIds } = {}) => {
  const calls = []
  const fetchJson = createVocabularyLoader({ version: 'category-test', cacheStorage: undefined, fetchImpl: async path => {
    path = path.split('?')[0]
    calls.push(path)
    return fetchImpl ? fetchImpl(path) : Response.json(await read(`public${path}`))
  } })
  const readCached = fetchJson.readCached
  fetchJson.readCached = async (path, validate = Array.isArray) => {
    const value = cached.get(path)
    return value && validate(value) ? value : readCached(path, validate)
  }
  return { calls, load: createCategoryVocabularyCatalogLoader({ fetchJson, categories, startup,
    loadCoreCatalog: async () => core, loadByIds }) }
}

test('every category delta is hashed canonical content with exact core/missing membership and unchanged examples eligibility', async () => {
  for (const [category, config] of Object.entries(categories)) {
    const expected = inCategory(full, category)
    const missing = expected.filter(word => !coreIds.has(String(word.id)))
    const hasWord = createVocabularyMembership(config.idRanges)
    const hasMissing = createVocabularyMembership(config.missing.idRanges)
    for (const word of full) {
      assert.equal(hasWord(word.id), expected.includes(word), `${category} ${word.id}`)
      assert.equal(hasMissing(word.id), missing.includes(word), `${category} missing ${word.id}`)
    }
    assert.equal(config.count, expected.length)
    assert.equal(config.count, startup.counts[category])
    assert.equal(config.missing.count, missing.length)
    const buffer = await readFile(new URL(`../public${config.missing.path}`, import.meta.url))
    assert.equal(config.missing.size, buffer.length)
    assert(config.missing.path.includes(createHash('sha256').update(buffer).digest('hex').slice(0, 16)))
    assert.deepEqual(JSON.parse(buffer), missing.map(summarizeVocabularyWord))
  }
})

test('cold categories share in-flight work and return the complete unique category without full or List downloads', async () => {
  const service = make()
  for (const category of Object.keys(categories)) {
    const [first, second] = await Promise.all([service.load(category), service.load(category)])
    assert.strictEqual(first, second)
    assert.strictEqual(await service.load(category), first)
    const expected = inCategory(full, category)
    assert.deepEqual(first.map(word => word.id), sorted(expected).map(word => word.id))
    for (const word of first) assert.deepEqual(word, coreIds.has(String(word.id))
      ? full.find(item => item.id === word.id) : summarizeVocabularyWord(full.find(item => item.id === word.id)))
    assert.equal(needsPlanCatalog([...core, ...first], [], category, expected.length), false)
  }
  assert.deepEqual(service.calls, Object.values(categories).map(config => config.missing.path))
})

test('partial categories and duplicate IDs cannot report ready; restored records outside the plan are still required', async () => {
  for (const category of Object.keys(categories)) {
    const expected = inCategory(full, category)
    assert.equal(needsPlanCatalog(core, [], category, expected.length), true)
    assert.equal(needsPlanCatalog([...expected.slice(1), expected[1]], [], category, expected.length), true)
    assert.equal(needsPlanCatalog(expected, [], category, expected.length), false)
    const outside = full.find(word => !getWordCategories(word).includes(category))
    assert.equal(needsPlanCatalog(expected, [outside.id], category, expected.length), true)
    assert.equal(needsPlanCatalog([...expected, outside], [outside.id], category, expected.length), false)
  }
  // The all plan still needs only recorded IDs until an explicit full-study start.
  assert.equal(needsPlanCatalog(core, []), false)
  assert.equal(needsPlanCatalog(core, [full.find(word => !coreIds.has(String(word.id))).id]), true)
})

test('old full, extension, and light extension caches satisfy category plans without new delivery requests', async () => {
  for (const path of [startup.catalog.extended.path, startup.extended, '/data/vocabulary.json']) {
    const cached = path === '/data/vocabulary.json' ? full : full.filter(word => !coreIds.has(String(word.id)))
    const service = make({ cached: new Map([[path, cached]]), fetchImpl: () => assert.fail('warm old cache must work offline') })
    for (const category of Object.keys(categories)) {
      assert.deepEqual((await service.load(category)).map(word => word.id), sorted(inCategory(full, category)).map(word => word.id))
    }
    assert.deepEqual(service.calls, [])
  }
})

test('an incomplete old cache does not hide missing words; failed and malformed deltas release category retry', async () => {
  const category = 'cet6', config = categories[category]
  let count = 0
  const service = make({ cached: new Map([[startup.extended, []]]), fetchImpl: async () => {
    if (++count === 1) throw new Error('offline')
    const words = await read(`public${config.missing.path}`)
    if (count === 2) return Response.json(words.slice(1))
    if (count === 3) return Response.json(words.map((word, i) => i ? word : { ...word, id: core[0].id }))
    if (count === 4) return Response.json(words.map((word, i) => i ? word : { ...word, categories: ['daily'], category: 'daily' }))
    return Response.json(words)
  } })
  await assert.rejects(service.load(category), /offline/)
  for (let i = 0; i < 3; i++) await assert.rejects(service.load(category), /格式无效/)
  assert.equal((await service.load(category)).length, config.count)
  assert.equal(count, 5)
})

test('legacy List-only caches recover all missing category IDs with no remapping or complete-library adoption', async () => {
  const category = 'cet6'
  const missing = inCategory(full, category).filter(word => !coreIds.has(String(word.id)))
  const legacyPaths = new Set(missing.map(word => index.paths[index.wordPaths[String(word.id)]]))
  const cached = new Map(await Promise.all([...legacyPaths].map(async path => [index.catalog.lists[path].path,
    (await read(`public${path}`)).map(summarizeVocabularyWord)])))
  const offline = async path => {
    if (cached.has(path)) return cached.get(path)
    throw new Error('offline: new category file unavailable')
  }
  offline.readCached = async (path, validate = Array.isArray) => validate(cached.get(path)) ? cached.get(path) : null
  const delivery = createVocabularyDelivery({ fetchJson: offline, index })
  const service = createCategoryVocabularyCatalogLoader({ fetchJson: offline, categories, startup,
    loadCoreCatalog: async () => core, loadByIds: delivery.loadCatalogIds })
  const words = await service(category)
  assert.deepEqual(words.map(word => word.id), sorted(inCategory(full, category)).map(word => word.id))
  assert.equal(words.length, categories[category].count)
  assert(words.length < full.length)
})

test('a failed category does not poison another category or claim all-library completeness', async () => {
  const service = make({ fetchImpl: async path => {
    if (path === categories.cet6.missing.path) throw new Error('isolated failure')
    return Response.json(await read(`public${path}`))
  } })
  await assert.rejects(service.load('cet6'), /isolated failure/)
  assert.equal((await service.load('daily')).length, categories.daily.count)
  await assert.rejects(service.load('all'), /未找到/)
  await assert.rejects(service.load('__proto__'), /未找到/)
  assert(service.calls.every(path => !path.includes('extended')))
})

test('category delta gzip bytes are smaller than the full extension, especially for daily/CET plans', async () => {
  const extension = gzipSync(await readFile(new URL(`../public${startup.catalog.extended.path}`, import.meta.url))).length
  for (const [category, config] of Object.entries(categories)) {
    const bytes = gzipSync(await readFile(new URL(`../public${config.missing.path}`, import.meta.url))).length
    assert(bytes < extension, `${category}: ${bytes} vs ${extension}`)
    if (['daily', 'cet4', 'cet6'].includes(category)) assert(bytes < extension * 0.05)
  }
})
