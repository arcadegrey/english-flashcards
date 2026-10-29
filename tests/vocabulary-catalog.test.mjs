import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import {
  buildToeflGrouping, buildIeltsGrouping, filterVocabularySelection, getVocabularySelectionLabel,
} from '../src/utils/vocabularyCatalog.js'

const selection = (overrides = {}) => ({
  selectedCategory: 'all', selectedToeflLevel: '', selectedToeflList: '', selectedIeltsTopic: '', selectedIeltsList: '',
  ...overrides,
})
const ids = (words, overrides) => filterVocabularySelection(words, selection(overrides)).map(word => word.id)
const freeze = value => {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze)
    Object.freeze(value)
  }
  return value
}

test('TOEFL local directory retains legacy IDs, numeric order and unknown buckets', () => {
  const words = freeze([
    { id: 501, category: 'toefl' }, { id: 800, category: 'toefl' },
    { id: 900, category: 'toefl', level: 'Level 10', list: 'List 2' },
    { id: 901, category: 'toefl', level: 'Level 2', list: 'List 10' },
    { id: 902, category: 'toefl' }, { id: 903, category: 'daily' },
  ])
  const grouped = buildToeflGrouping(words, null)
  assert.equal(grouped.total, 5)
  assert.deepEqual(grouped.levels.map(item => item.key), ['2', '3', '10', 'unknown'])
  assert.deepEqual(grouped.listsByLevel['3'].map(item => [item.key, item.count]), [['1', 1], ['10', 1]])
  assert.equal(grouped.levels.at(-1).label, '未分级')
  assert.equal(grouped.listsByLevel.unknown[0].label, '未分 List')
  assert.deepEqual(ids(words, { selectedCategory: 'toefl', selectedToeflLevel: '3', selectedToeflList: '10' }), [800])
  assert.deepEqual(ids(words, { selectedCategory: 'toefl', selectedToeflLevel: 'unknown' }), [902])
})

test('TOEFL manifests supply complete counts and paths before all shards are loaded', () => {
  const manifest = freeze({ toefl: { total: 100, levels: [
    { key: 'unknown', count: 2, lists: [{ key: 'unknown', count: 2 }] },
    { key: 2, label: '第二级', count: 98, meta: '目录说明', lists: [
      { key: 10, count: 48, path: '/ten.json' }, { key: 2, count: 50, path: '/two.json' },
    ] },
  ] } })
  const grouped = buildToeflGrouping([], manifest)
  assert.equal(grouped.total, 100)
  assert.deepEqual(grouped.levels.map(item => item.key), ['2', 'unknown'])
  assert.equal(grouped.levels[0].label, '第二级')
  assert.equal(grouped.levels[0].meta, '目录说明')
  assert.deepEqual(grouped.listsByLevel['2'].map(item => item.path), ['/two.json', '/ten.json'])
  assert.equal(buildToeflGrouping([], { toefl: { levels: manifest.toefl.levels } }).total, 100)
})

test('IELTS manifests preserve explicit topics, labels, counts and list paths', () => {
  const grouped = buildIeltsGrouping([], freeze({ ielts: { total: 70,
    lists: [{ key: 1, count: 70, path: '/one.json' }],
    topics: [{ key: 'custom-topic', label: '自定义主题', count: 70, lists: [{ key: 1, count: 70, path: '/one.json' }] }],
  } }))
  assert.equal(grouped.total, 70)
  assert.equal(grouped.topics[0].label, '自定义主题')
  assert.equal(grouped.listsByTopic['custom-topic'][0].path, '/one.json')
  assert.equal(grouped.listsByTopic['custom-topic'][0].topicKey, 'custom-topic')
})

test('IELTS directories derive topics for older manifests without explicit topic entries', () => {
  const grouped = buildIeltsGrouping([], freeze({ ielts: { lists: [
    { key: 11, count: 3 }, { key: 2, count: 4, topicLabel: '自然专题' }, { key: 1, count: 5, topicLabel: '自然专题' },
    { key: 'unknown', count: 1 },
  ] } }))
  assert.equal(grouped.total, 13)
  assert.deepEqual(grouped.lists.map(item => item.key), ['1', '2', '11', 'unknown'])
  assert.deepEqual(grouped.topics.map(item => [item.label, item.count]), [['自然专题', 9], ['学校教育', 3], ['未分主题', 1]])
  assert.deepEqual(grouped.listsByTopic['nature-geography'].map(item => item.key), ['1', '2'])
})

test('IELTS filters intersect topics and Lists, including shared TOEFL/IELTS entries', () => {
  const words = freeze([
    { id: 1, category: 'daily' },
    { id: 2, category: 'ielts', list: 'List 2' },
    { id: 3, category: 'toefl', categories: ['toefl', 'ielts'], list: '30', ieltsLists: ['2', '11'] },
    { id: 4, category: 'ielts' },
  ])
  assert.equal(filterVocabularySelection(words, selection()), words)
  assert.deepEqual(ids(words, { selectedCategory: 'ielts', selectedIeltsTopic: 'nature-geography', selectedIeltsList: '2' }), [2, 3])
  assert.deepEqual(ids(words, { selectedCategory: 'ielts', selectedIeltsTopic: 'school-education', selectedIeltsList: '2' }), [3])
  assert.deepEqual(ids(words, { selectedCategory: 'ielts', selectedIeltsList: '30' }), [])
  assert.deepEqual(ids(words, { selectedCategory: 'ielts', selectedIeltsTopic: 'unknown', selectedIeltsList: 'unknown' }), [4])
  assert.deepEqual(ids(words, { selectedCategory: 'daily', selectedIeltsList: '2' }), [1])
})

test('IELTS without a manifest counts normalized List memberships and preserves unknown entries', () => {
  const words = freeze([
    { id: 1, category: 'ielts', list: 'List 2' },
    { id: 2, categories: ['toefl', 'ielts'], list: '30', ieltsLists: ['2', '11', '2'] },
    { id: 3, category: 'ielts', ieltsList: 'List 11' },
    { id: 4, category: 'ielts' },
    { id: 5, category: 'daily', list: '2' },
  ])
  const grouped = buildIeltsGrouping(words, null)
  assert.deepEqual(grouped.lists.map(item => [item.key, item.count]), [['2', 2], ['11', 2], ['unknown', 1]])
  assert.equal(grouped.total, 5)
  assert.deepEqual(grouped.topics.map(item => [item.key, item.count]), [['nature-geography', 2], ['school-education', 2], ['unknown', 1]])
  for (const list of grouped.lists) assert.equal(ids(words, { selectedCategory: 'ielts', selectedIeltsList: list.key }).length, list.count)
  assert.deepEqual(ids(words, { selectedCategory: 'ielts', selectedIeltsList: '30' }), [])
})

test('every real IELTS fallback List agrees with the manifest and the actual filter', async () => {
  const words = JSON.parse(await readFile(new URL('../public/data/vocabulary.json', import.meta.url), 'utf8'))
  const manifest = JSON.parse(await readFile(new URL('../public/data/vocabulary/ielts/manifest.json', import.meta.url), 'utf8'))
  const local = buildIeltsGrouping(words, null), canonical = buildIeltsGrouping(words, manifest)
  assert.deepEqual(local.lists.map(item => [item.key, item.count]), canonical.lists.map(item => [item.key, item.count]))
  assert.equal(local.total, canonical.total)
  for (const list of local.lists) assert.equal(ids(words, { selectedCategory: 'ielts', selectedIeltsList: list.key }).length, list.count)
})

test('empty directories and missing ranges yield empty choices without modifying vocabulary', () => {
  assert.deepEqual(buildToeflGrouping([], null), { total: 0, levels: [], listsByLevel: {} })
  assert.deepEqual(buildIeltsGrouping([], null), { total: 0, topics: [], listsByTopic: {}, lists: [] })
  assert.deepEqual(ids([], { selectedCategory: 'toefl', selectedToeflLevel: '1' }), [])
  assert.deepEqual(ids([{ id: 1, category: 'daily' }], { selectedCategory: 'unknown-category' }), [])
})

test('selection titles retain unknown labels and manifest topic names', () => {
  const grouped = { topics: [{ key: 'topic', label: '目录主题' }] }
  assert.equal(getVocabularySelectionLabel(selection({ selectedCategory: 'toefl', selectedToeflLevel: '3', selectedToeflList: '2' }), grouped), '托福词汇 · Level 3 · List 2')
  assert.equal(getVocabularySelectionLabel(selection({ selectedCategory: 'toefl', selectedToeflLevel: 'unknown', selectedToeflList: 'unknown' }), grouped), '托福词汇 · 未分级 · 未分 List')
  assert.equal(getVocabularySelectionLabel(selection({ selectedCategory: 'ielts', selectedIeltsTopic: 'topic', selectedIeltsList: '1' }), grouped), '雅思词汇 · 目录主题 · List 1')
  assert.equal(getVocabularySelectionLabel(selection({ selectedCategory: 'ielts', selectedIeltsTopic: 'missing' }), grouped), '雅思词汇 · 未分主题')
  assert.equal(getVocabularySelectionLabel(selection({ selectedCategory: 'daily' }), grouped), '日常常用')
  assert.equal(getVocabularySelectionLabel(selection({ selectedCategory: 'missing' }), grouped), '全部单词')
})

test('real manifests and complete study pools agree for every TOEFL and IELTS List', async () => {
  const json = async path => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'))
  const [words, toeflManifest, ieltsManifest] = await Promise.all([
    json('../public/data/vocabulary.json'), json('../public/data/vocabulary/toefl/manifest.json'), json('../public/data/vocabulary/ielts/manifest.json'),
  ])
  const toefl = buildToeflGrouping(words, toeflManifest)
  const ielts = buildIeltsGrouping(words, ieltsManifest)
  assert.equal(toefl.total, ids(words, { selectedCategory: 'toefl' }).length)
  // IELTS directory totals count List memberships; a word may belong to multiple Lists.
  assert.equal(ielts.total, ielts.lists.reduce((sum, list) => sum + list.count, 0))
  assert.ok(ielts.total >= ids(words, { selectedCategory: 'ielts' }).length)
  for (const level of toefl.levels) {
    for (const list of toefl.listsByLevel[level.key]) {
      assert.equal(ids(words, { selectedCategory: 'toefl', selectedToeflLevel: level.key, selectedToeflList: list.key }).length, list.count)
    }
  }
  for (const list of ielts.lists) {
    assert.equal(ids(words, { selectedCategory: 'ielts', selectedIeltsList: list.key }).length, list.count)
  }
})
