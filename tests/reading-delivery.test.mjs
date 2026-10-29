import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { gzipSync } from 'node:zlib'
import readings from '../src/data/readings.js'
import { prepareReadingContent, indexReadingVocabulary, applyReadingProgress } from '../src/utils/readingLibrary.js'
import { buildWordLookup } from '../src/utils/readingText.js'
import { createReadingContentLoader } from '../src/data/readingContentLoader.js'
import { createVocabularyLoader } from '../src/data/vocabularyCache.js'
import { createReadingAttempt, wrongReadingQuestions } from '../shared/readingAttempts.js'

const root = new URL('../', import.meta.url)
const read = async path => JSON.parse(await readFile(new URL(path, root), 'utf8'))
const config = await read('src/data/readingCatalog.json')
const metadata = config.entries.map(entry => entry.article)
const hash = text => createHash('sha256').update(text).digest('hex').slice(0, 16)
const loader = (options = {}) => {
  const calls = []
  const fetchJson = createVocabularyLoader({ version: config.version, cachePrefix: 'flashcards-readings-',
    cacheStorage: undefined, fetchImpl: async path => {
      calls.push(path.split('?')[0])
      return options.fetchImpl ? options.fetchImpl(path.split('?')[0]) : Response.json(await read(`public${path.split('?')[0]}`))
    } })
  return { calls, load: createReadingContentLoader({ metadata, fetchJson, loadLegacyArticles: options.loadLegacyArticles }) }
}

test('generated metadata and every content-hashed file exactly preserve canonical article data and question order', async () => {
  assert.equal(config.version, hash(JSON.stringify(readings)))
  assert.deepEqual(metadata.map(article => article.id), readings.map(article => article.id))
  const files = await readdir(new URL('public/data/readings/', root))
  assert.equal(files.filter(file => file.endsWith('.json')).length, readings.length)
  for (let i = 0; i < readings.length; i++) {
    const article = readings[i], entry = metadata[i]
    assert.equal(entry.contentRevision, hash(JSON.stringify(article)))
    assert(entry.contentPath.includes(entry.contentRevision))
    assert.equal(entry.questionCount, article.questions?.length || 0)
    for (const field of ['content', 'translation', 'questions']) assert.equal(Object.hasOwn(entry, field), false)
    for (const field of ['id', 'title', 'level', 'source', 'category', 'tags', 'examType', 'sourceUrl']) assert.deepEqual(entry[field], article[field])
    assert.deepEqual(await read(`public${entry.contentPath}`), { revision: entry.contentRevision, article })
  }
  assert(gzipSync(JSON.stringify(config)).length < gzipSync(JSON.stringify(readings)).length / 2)
})

test('generated unique tokens preserve all reading statistics with core/full/custom lookups and mastery changes', async () => {
  const prepared = prepareReadingContent(readings)
  const core = await read('public/data/vocabulary/core.json')
  const full = await read('public/data/vocabulary.json')
  for (const words of [[], core, full, [...core, { id: 'custom-we', word: 'we' }, { id: 'custom-z', word: 'wetlands' }]]) {
    const lookup = buildWordLookup(words)
    const original = indexReadingVocabulary(prepared, lookup), generated = indexReadingVocabulary(config.entries, lookup)
    for (const mastered of [new Set(), new Set(words.filter((_, i) => i % 2).map(word => String(word.id)))]) {
      const before = applyReadingProgress(original, mastered), after = applyReadingProgress(generated, mastered)
      assert.deepEqual(after.map(({ id, estimatedMinutes, trackedWordCount, unmasteredCount }) => ({ id, estimatedMinutes, trackedWordCount, unmasteredCount })),
        before.map(({ id, estimatedMinutes, trackedWordCount, unmasteredCount }) => ({ id, estimatedMinutes, trackedWordCount, unmasteredCount })))
    }
  }
})

test('only the selected article is fetched; concurrent calls dedupe and every canonical article remains unchanged', async () => {
  const { load, calls } = loader()
  for (const article of readings) {
    const [first, second] = await Promise.all([load(article.id), load(String(article.id))])
    assert.strictEqual(first, second)
    assert.strictEqual(await load(article.id), first)
    assert.deepEqual(first, article)
  }
  assert.deepEqual(calls, metadata.map(article => article.contentPath))
  await assert.rejects(load('unknown-reading'), /未找到/)
  assert.equal(calls.length, readings.length)
})

test('bad revision, wrong article ID, missing content and missing questions cannot enter a session; failures release retry', async () => {
  const entry = metadata.find(article => article.questionCount)
  const good = await read(`public${entry.contentPath}`)
  let count = 0
  const { load } = loader({ fetchImpl: async () => {
    count++
    if (count === 1) throw new Error('isolated network failure')
    if (count === 2) return Response.json({ ...good, revision: 'stale' })
    if (count === 3) return Response.json({ ...good, article: { ...good.article, id: 'another' } })
    if (count === 4) return Response.json({ ...good, article: { ...good.article, content: '' } })
    if (count === 5) return Response.json({ ...good, article: { ...good.article, questions: [] } })
    return Response.json(good)
  } })
  await assert.rejects(load(entry.id), /network failure/)
  for (let i = 0; i < 4; i++) await assert.rejects(load(entry.id), /格式无效/)
  assert.deepEqual(await load(entry.id), good.article)
  assert.equal(count, 6)
})

test('the lazy original source restores unopened articles offline, while stale or failed fallback releases retry', async () => {
  let good = false
  const { load } = loader({ fetchImpl: () => { throw new Error('offline article data') }, loadLegacyArticles: async () => good ? readings : [] })
  await assert.rejects(load(13), /offline article data/)
  good = true
  assert.deepEqual(await load(13), readings.find(article => article.id === 13))
  assert.deepEqual(await load(26), readings.find(article => article.id === 26))
})

test('warmed per-article cache works without full-source fallback after a new loader is created', async () => {
  const stored = new Map()
  const cacheStorage = { open: async () => ({
    match: async key => stored.get(key)?.clone(), put: async (key, response) => stored.set(key, response), delete: async key => stored.delete(key),
  }), keys: async () => [`flashcards-readings-${config.version}`], delete: async () => assert.fail('same version must stay cached') }
  const make = fetchImpl => createReadingContentLoader({ metadata, fetchJson: createVocabularyLoader({
    version: config.version, cachePrefix: 'flashcards-readings-', cacheStorage, fetchImpl,
  }), loadLegacyArticles: () => assert.fail('a warmed article must not load every article') })
  const first = await make(async path => Response.json(await read(`public${path.split('?')[0]}`)))(13)
  await new Promise(resolve => setImmediate(resolve))
  assert.deepEqual(await make(() => assert.fail('offline warm article must not request network'))(13), first)
})

test('reading cache maintenance never evicts vocabulary caches, unrelated caches or same-version articles', async () => {
  const deleted = []
  const cacheStorage = { open: async () => ({ match: async () => null, put: async () => {} }),
    keys: async () => ['flashcards-vocabulary-existing', 'flashcards-readings-old', 'flashcards-readings-current', 'workbox-precache-v2'],
    delete: async name => deleted.push(name) }
  const fetchJson = createVocabularyLoader({ version: 'current', cachePrefix: 'flashcards-readings-', cacheStorage,
    fetchImpl: async () => Response.json(['public article']) })
  await fetchJson('/article', 'reading')
  await new Promise(resolve => setImmediate(resolve))
  assert.deepEqual(deleted, ['flashcards-readings-old'])
})

test('loaded canonical articles create the same history snapshots and wrong-only question sets as before layering', async () => {
  const { load } = loader()
  for (const article of readings.filter(article => article.questions?.length)) {
    const loaded = await load(article.id)
    const answers = Object.fromEntries(article.questions.map(question => [question.id, 'B']))
    const values = { id: `attempt-${article.id}`, completedAt: '2026-10-28T12:00:00.000Z', answers }
    const before = createReadingAttempt({ ...values, article }), after = createReadingAttempt({ ...values, article: loaded })
    assert.deepEqual(after, before)
    assert.deepEqual(wrongReadingQuestions(after), wrongReadingQuestions(before))
  }
})
