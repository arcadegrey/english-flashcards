import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import readings from '../src/data/readings.js'
import { createReadingVocabularyLoader, buildReadingWordLookup } from '../src/data/readingVocabularyLoader.js'
import { buildWordLookup, resolveVocabularyWord, tokenizeReadingText, isEnglishWordToken } from '../src/utils/readingText.js'
import { indexReadingVocabulary, applyReadingProgress, prepareReadingContent } from '../src/utils/readingLibrary.js'
import { createVocabularyDelivery } from '../src/data/vocabularyDelivery.js'
import { createVocabularyLoader } from '../src/data/vocabularyCache.js'
import { createHash } from 'node:crypto'

const read = async path => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'))
const [config, summaries, full, core, deliveryIndex] = await Promise.all([
  read('src/data/readingCatalog.json'), read('src/data/readingVocabulary.json'),
  read('public/data/vocabulary.json'), read('public/data/vocabulary/core.json'), read('src/data/vocabularyIndex.json'),
])
const makeLoader = overrides => createReadingVocabularyLoader({
  entries: config.entries, vocabularyIndex: config.vocabulary,
  loadCatalog: async () => summaries,
  loadFullCatalog: () => assert.fail('canonical readings must not download the full vocabulary'),
  ...overrides,
})
const nextTurn = () => new Promise(resolve => setImmediate(resolve))
const deferred = () => { let resolve; const promise = new Promise(done => { resolve = done }); return { promise, resolve } }
const english = article => tokenizeReadingText(article.content).filter(isEnglishWordToken)
const matchedIds = (article, lookup) => english(article).map(token => resolveVocabularyWord(token, lookup)?.id || null)

test('all 26 canonical readings resolve the same IDs as the complete vocabulary, including custom exact/derived forms', async () => {
  const load = makeLoader()
  for (const custom of [[], [
    { id: 'custom-wetlands', word: 'wetlands', meaning: 'account-specific exact form' },
    { id: 'custom-books', word: 'books', meaning: 'account-specific plural' },
    { id: 'custom-ocean', word: 'ocean', meaning: 'must not override the built-in headword' },
    { id: 'custom-unknown', word: 'telecommuting', example: 'We tried telecommuting.', exampleCn: '我们尝试远程办公。' },
  ]]) {
    const expected = buildWordLookup([...full, ...custom])
    const identityIndex = buildReadingWordLookup(config.vocabulary, custom)
    for (const article of readings) {
      const lookup = buildReadingWordLookup(await load(article), custom)
      assert.deepEqual(matchedIds(article, lookup), matchedIds(article, expected), article.title)
      assert.deepEqual(matchedIds(article, identityIndex), matchedIds(article, expected), `metadata: ${article.title}`)
    }
  }
})

test('core, daily, TOEFL, IELTS and full prior pools cannot change reading results or the active study pool', async () => {
  const daily = [...core, ...full.filter(word => word.categories?.includes('daily'))]
  const pools = [[], core, daily, full.filter(word => word.categories?.includes('toefl')),
    full.filter(word => word.categories?.includes('ielts')), full]
  const selected = readings.find(article => article.id === 16)
  const expected = matchedIds(selected, buildReadingWordLookup(full))
  for (const pool of pools) {
    const before = JSON.stringify(pool)
    const load = makeLoader()
    // No learning catalog is accepted by this API: previous page state cannot
    // silently decide completeness or leak extra/missing homograph matches.
    assert.deepEqual(matchedIds(selected, buildReadingWordLookup(await load(selected))), expected)
    assert.equal(JSON.stringify(pool), before)
  }
  const oldCount = new Set(matchedIds(selected, buildWordLookup(daily)).filter(Boolean)).size
  assert.equal(oldCount, 89, 'retain the concrete former partial-pool reproduction')
  assert.equal(new Set(expected.filter(Boolean)).size, 153)
})

test('picker and session statistics share stable denominators and respond only to account recognition/custom records', async () => {
  const prepared = prepareReadingContent(readings)
  const identities = indexReadingVocabulary(config.entries, buildReadingWordLookup(config.vocabulary))
  const complete = indexReadingVocabulary(prepared, buildReadingWordLookup(full))
  for (const mastered of [new Set(), new Set(['3725', '4416', '6508']), new Set(full.map(word => String(word.id)))]) {
    const project = rows => applyReadingProgress(rows, mastered).map(({ id, trackedWordCount, unmasteredCount }) => ({ id, trackedWordCount, unmasteredCount }))
    assert.deepEqual(project(identities), project(complete))
  }
  assert.equal(identities.find(row => row.article.id === 19).trackedIds.length, 45)
})

test('reading delivery remains light, preserves vocabulary fields and never embeds examples in startup', () => {
  assert.equal(summaries.length, config.vocabulary.length)
  assert(summaries.length < full.length / 4)
  assert(gzipSync(JSON.stringify(summaries)).length < 60000)
  assert.deepEqual(config.vocabulary, summaries.map(({ id, word }) => ({ id, word })))
  const source = new Map(full.map(word => [String(word.id), word]))
  for (const word of summaries) {
    for (const field of ['word', 'meaning', 'pos', 'phonetic', 'category', 'categories']) assert.deepEqual(word[field], source.get(String(word.id))[field])
    assert.equal(word.exampleDeferred, true)
    assert.equal(Object.hasOwn(word, 'example'), false)
    assert.equal(Object.hasOwn(word, 'exampleCn'), false)
  }
  assert(config.vocabulary.every(word => Object.keys(word).length === 2))
})

test('the public dictionary URL is content-hashed and matches the PWA fallback exactly', async () => {
  assert.deepEqual(await read(`public${config.vocabularyCatalog.path}`), summaries)
  const hash = createHash('sha256').update(JSON.stringify(summaries)).digest('hex').slice(0, 16)
  assert.equal(config.vocabularyCatalog.version, hash)
  assert.equal(config.vocabularyCatalog.path, `/data/reading-vocabulary/${hash}.json`)
})

test('a warmed reading dictionary survives a new loader offline and cannot evict reading, vocabulary or account caches', async () => {
  const stored = new Map(), removed = []
  const prefix = 'flashcards-reading-vocabulary-', version = config.vocabularyCatalog.version
  const cacheStorage = {
    open: async () => ({ match: async key => stored.get(key)?.clone(),
      put: async (key, value) => stored.set(key, value), delete: async key => stored.delete(key) }),
    keys: async () => [`${prefix}old`, `${prefix}${version}`, 'flashcards-vocabulary-existing',
      'flashcards-readings-existing', 'workbox-precache-v2', 'account-cache'],
    delete: async key => removed.push(key),
  }
  const make = fetchImpl => {
    const fetchJson = createVocabularyLoader({ version, cachePrefix: prefix, cacheStorage, fetchImpl })
    return makeLoader({ loadCatalog: valid => fetchJson(config.vocabularyCatalog.path, 'reading', valid) })
  }
  assert.deepEqual(await make(async () => Response.json(summaries))(readings[0]), summaries)
  await nextTurn()
  const offline = make(() => assert.fail('a warm dictionary must not request network or full catalogs'))
  assert.deepEqual(await offline(readings[15]), summaries)
  assert.deepEqual(removed, [`${prefix}old`])
})

test('metadata can prepare vocabulary concurrently with prose; concurrent readers share a public request', async () => {
  let calls = 0
  const gate = deferred()
  const load = makeLoader({ loadCatalog: async () => { calls++; await gate.promise; return summaries } })
  const first = load(config.entries[0].article), second = load(config.entries[15].article)
  await nextTurn()
  assert.equal(calls, 1)
  gate.resolve()
  assert.strictEqual(await first, await second)
  assert.strictEqual(await load(readings[18]), summaries)
  assert.equal(calls, 1)
})

test('network/code failures release explicit retry and never return a partial reading dictionary', async () => {
  let attempt = 0
  const load = makeLoader({ loadCatalog: async () => {
    attempt++
    if (attempt === 1) throw new Error('isolated offline reading chunk')
    return attempt === 2 ? summaries.slice(1) : summaries
  } })
  await assert.rejects(load(readings[0]), /offline reading chunk/)
  await assert.rejects(load(readings[0]), /不完整/)
  assert.strictEqual(await load(readings[0]), summaries)
  assert.equal(attempt, 3)
})

test('wrong identity, duplicate IDs and missing meanings cannot become a ready reading dictionary', async () => {
  for (const invalid of [null, {}, [...summaries.slice(1), summaries[1]],
    summaries.map((word, i) => i ? word : { ...word, word: 'wrong-spelling' }),
    summaries.map((word, i) => i ? word : { ...word, meaning: null })]) {
    const load = makeLoader({ loadCatalog: async () => invalid })
    await assert.rejects(load(readings[0]), /不完整/)
  }
})

test('old snapshots use their own text even when the ID matches a different canonical article', async () => {
  const unseen = full.find(word => /^[a-z]+$/.test(word.word) && !config.entries.some(entry => entry.tokens.includes(word.word)))
  assert(unseen)
  const snapshot = { id: 1, title: 'Saved assignment', content: `The ${unseen.word}.`,
    translation: '原始快照', questions: [{ id: 'saved-question', answer: 'B' }] }
  const before = JSON.stringify(snapshot)
  let calls = 0
  const load = makeLoader({ loadFullCatalog: async () => { calls++; return full } })
  const words = await load(snapshot)
  assert.equal(resolveVocabularyWord(unseen.word, buildReadingWordLookup(words)).id, unseen.id)
  assert.equal(calls, 1)
  assert.equal(JSON.stringify(snapshot), before)
  assert.notEqual(snapshot.content, readings[0].content)
})

test('a same-vocabulary snapshot reuses the reading subset without fetching canonical prose or a full library', async () => {
  const snapshot = { id: 'old-assignment', content: 'Ocean currents. A fruit shop.', questions: [] }
  assert.strictEqual(await makeLoader()(snapshot), summaries)
})

test('historical full-file caches restore unknown snapshot vocabulary offline without network or account writes', async () => {
  const fetchJson = () => assert.fail('a warm legacy full cache must work offline')
  fetchJson.readCached = async path => path === '/data/vocabulary.json' ? full : null
  const delivery = createVocabularyDelivery({ fetchJson, index: deliveryIndex })
  const load = makeLoader({ loadFullCatalog: delivery.loadFullCatalog })
  const unknown = full.find(word => /^[a-z]+$/.test(word.word) && !config.entries.some(entry => entry.tokens.includes(word.word)))
  const words = await load({ content: unknown.word })
  assert.equal(resolveVocabularyWord(unknown.word, buildReadingWordLookup(words)).id, unknown.id)
})

test('failed unknown-snapshot preparation can retry; absent prose cannot silently use an unrelated dictionary', async () => {
  let ready = false
  const load = makeLoader({ loadFullCatalog: async () => {
    if (!ready) throw new Error('snapshot offline')
    return full
  } })
  const snapshot = { content: 'xylophonist-not-in-the-current-reading-library' }
  await assert.rejects(load(snapshot), /snapshot offline/)
  ready = true
  assert.strictEqual(await load(snapshot), full)
  await assert.rejects(load({ contentDeferred: true, contentPath: '/unregistered.json' }), /缺少阅读正文/)
})

test('homographs, legacy aliases, custom examples and account changes keep deterministic identity', () => {
  const words = [
    { id: 9, word: 'spectator', meaning: 'later duplicate' },
    { id: 1, word: 'spectator', meaning: 'canonical earlier ID' },
    { id: 2, word: 'book', meaning: 'built-in base form' },
  ]
  const alice = [{ id: 'alice-books', word: 'books', example: 'My books.', exampleCn: '我的书。' }]
  const bob = [{ id: 'bob-books', word: 'books', example: 'Your books.', exampleCn: '你的书。' }]
  const before = JSON.stringify(words)
  const first = buildReadingWordLookup(words, alice), second = buildReadingWordLookup([...words].reverse(), bob)
  assert.equal(resolveVocabularyWord('spectator', first).id, 1)
  assert.equal(first.get('spectator').id, second.get('spectator').id)
  assert.equal(first.get('spectator').id, resolveVocabularyWord('sepectator', first).id)
  assert.equal(resolveVocabularyWord('books', first).id, 'alice-books')
  assert.equal(resolveVocabularyWord('books', second).id, 'bob-books')
  assert.strictEqual(resolveVocabularyWord('books', first), alice[0])
  assert.equal(resolveVocabularyWord('books', buildReadingWordLookup(words)).id, 2)
  assert.equal(JSON.stringify(words), before)
})
