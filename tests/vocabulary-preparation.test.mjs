import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { loadVocabularyRange } from '../src/utils/vocabularyPreparation.js'
import { filterVocabularySelection } from '../src/utils/vocabularyCatalog.js'

const read = async path => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'))
const [full, toeflManifest, ieltsManifest, index] = await Promise.all([
  read('../public/data/vocabulary.json'), read('../public/data/vocabulary/toefl/manifest.json'),
  read('../public/data/vocabulary/ielts/manifest.json'), read('../src/data/vocabularyIndex.json'),
])
const fileCache = new Map()
const catalog = async path => {
  if (!fileCache.has(path)) fileCache.set(path, read(`../public${index.catalog.lists[path].path}`))
  return fileCache.get(path)
}
const sources = {
  toeflManifest, ieltsManifest,
  loadToeflList: (manifest, level, list) => catalog(manifest.toefl.levels.find(item => String(item.key) === String(level)).lists.find(item => String(item.key) === String(list)).path),
  loadIeltsList: (manifest, list) => catalog(manifest.ielts.lists.find(item => String(item.key) === String(list)).path),
}
const expected = ({ category, level = '', list = '', topic = '' }) => filterVocabularySelection(full, {
  selectedCategory: category, selectedToeflLevel: level, selectedToeflList: category === 'toefl' ? list : '',
  selectedIeltsTopic: topic, selectedIeltsList: category === 'ielts' ? list : '',
}).map(word => word.id).sort((a, b) => a - b)
const deferred = () => { let resolve; const promise = new Promise(done => { resolve = done }); return { promise, resolve } }
const nextTurn = () => new Promise(resolve => setImmediate(resolve))

for (const selection of [
  { category: 'toefl' }, { category: 'toefl', level: '3' }, { category: 'toefl', level: '3', list: '1' },
  { category: 'ielts' }, { category: 'ielts', topic: 'nature-geography' }, { category: 'ielts', topic: 'nature-geography', list: '2' },
]) {
  test(`complete real scope preserves every canonical ID: ${JSON.stringify(selection)}`, async () => {
    const words = await loadVocabularyRange(selection, sources)
    assert.deepEqual(words.map(word => word.id), expected(selection))
    assert.equal(new Set(words.map(word => String(word.id))).size, words.length)
    for (const word of words) assert.equal(word.word, full.find(item => item.id === word.id).word)
  })
}

test('no partial result is published, downloads are bounded and completion waits for every List', async () => {
  const gates = Array.from({ length: 7 }, deferred)
  const manifest = { toefl: { levels: [{ key: '3', lists: gates.map((_, i) => ({ key: String(i + 1), count: 1 })) }] } }
  let active = 0, peak = 0, finished = false
  const promise = loadVocabularyRange({ category: 'toefl' }, { toeflManifest: manifest,
    loadToeflList: async (_manifest, _level, list) => {
      peak = Math.max(peak, ++active)
      await gates[Number(list) - 1].promise
      active--
      return [{ id: Number(list), word: `word-${list}`, category: 'toefl', level: '3', list }]
    },
  }).then(words => { finished = true; return words })
  await nextTurn()
  assert.equal(peak, 4)
  for (let i = 0; i < 6; i++) { gates[i].resolve(); await nextTurn(); assert.equal(finished, false) }
  gates[6].resolve()
  assert.equal((await promise).length, 7)
  assert.equal(active, 0)
  assert.equal(peak, 4)
})

test('partial failures never commit a reduced scope and a subsequent retry can succeed', async () => {
  let fail = true, commits = 0
  const local = { ...sources, loadToeflList: async (...args) => {
    if (String(args[2]) === '2' && fail) throw new Error('isolated connection failure')
    return sources.loadToeflList(...args)
  } }
  await assert.rejects(loadVocabularyRange({ category: 'toefl', level: '3' }, local).then(() => { commits++ }), /connection failure/)
  assert.equal(commits, 0)
  fail = false
  const words = await loadVocabularyRange({ category: 'toefl', level: '3' }, local)
  assert.deepEqual(words.map(word => word.id), expected({ category: 'toefl', level: '3' }))
})

test('a missing manifest is awaited, duplicate List descriptors load once and distinct homographs retain both IDs', async () => {
  let manifests = 0, downloads = 0
  const words = await loadVocabularyRange({ category: 'ielts' }, {
    loadIeltsManifest: async () => { manifests++; return { ielts: { lists: [{ key: '1', count: 2 }, { key: '1', count: 2 }] } } },
    loadIeltsList: async () => { downloads++; return [
      { id: 1, word: 'same', category: 'ielts', ieltsLists: ['1'] },
      { id: 2, word: 'same', category: 'ielts', ieltsLists: ['1'] },
    ] },
  })
  assert.equal(manifests, 1)
  assert.equal(downloads, 1)
  assert.deepEqual(words.map(word => word.id), [1, 2])
})

test('unknown/empty scopes and malformed/incomplete Lists reject instead of entering an empty or partial study', async () => {
  await assert.rejects(loadVocabularyRange({ category: 'daily' }, sources), /不支持/)
  await assert.rejects(loadVocabularyRange({ category: 'toefl', level: 'missing' }, sources), /暂无可用词表/)
  await assert.rejects(loadVocabularyRange({ category: 'ielts', topic: 'missing' }, sources), /暂无可用词表/)
  const duplicates = Array.from({ length: 97 }, () => ({ id: 1, word: 'same', category: 'toefl', level: '3', list: '1' }))
  for (const result of [null, [], duplicates]) {
    await assert.rejects(loadVocabularyRange({ category: 'toefl', level: '3', list: '1' }, { ...sources, loadToeflList: async () => result }), /不完整/)
  }
})

test('cancelled preparation keeps shared in-flight requests intact but starts no queued Lists', async () => {
  const gate = deferred()
  let current = true, started = 0
  const manifest = { toefl: { levels: [{ key: '3', lists: Array.from({ length: 10 }, (_, i) => ({ key: String(i + 1), count: 1 })) }] } }
  const result = loadVocabularyRange({ category: 'toefl' }, { toeflManifest: manifest, isCurrent: () => current,
    loadToeflList: async (_manifest, _level, list) => {
      started++
      await gate.promise
      return [{ id: Number(list), word: `word-${list}`, category: 'toefl', level: '3', list }]
    },
  })
  await nextTurn()
  assert.equal(started, 4)
  current = false
  gate.resolve()
  assert.equal(await result, null)
  assert.equal(started, 4)
})
