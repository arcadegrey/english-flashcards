import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { getExamVocabulary, getPlanVocabulary, getPlanWordStats, normalizePlanCategory, recordPlanExamAnswer } from '../src/utils/studyPlan.js'
import { storage } from '../src/utils/storage.js'

const words = [
  { id: 1, word: 'a', category: 'daily' },
  { id: 2, word: 'b', category: 'toefl' },
  { id: 3, word: 'c', category: 'ielts', categories: ['ielts', 'toefl'] },
  { id: 4, word: 'd', category: 'ielts' },
]

test('plan vocabulary includes shared-category words and excludes unrelated words', () => {
  assert.deepEqual(getPlanVocabulary(words, 'toefl').map((word) => word.id), [2, 3])
  assert.deepEqual(getPlanVocabulary(words, 'ielts').map((word) => word.id), [3, 4])
  assert.deepEqual(getPlanVocabulary(words, 'all'), words)
})

test('all three exam scopes are intersections of the chosen category and progress', () => {
  const progress = { category: 'toefl', learnedWords: ['1', 2, 4], masteredWords: [1, '3', 4] }
  assert.deepEqual(getExamVocabulary(words, { ...progress, scope: 'all' }).map((word) => word.id), [2, 3])
  assert.deepEqual(getExamVocabulary(words, { ...progress, scope: 'learned' }).map((word) => word.id), [2])
  assert.deepEqual(getExamVocabulary(words, { ...progress, scope: 'mastered' }).map((word) => word.id), [3])
  assert.deepEqual(getExamVocabulary(words, { category: 'cet4', scope: 'all' }), [])
})

test('real TOEFL and IELTS plans use complete category vocabulary, including core overlaps', async () => {
  const vocabulary = JSON.parse(await readFile(new URL('../public/data/vocabulary.json', import.meta.url), 'utf8'))
  const counts = { all: 8699, daily: 2047, cet4: 2028, cet6: 1516, toefl: 3245, ielts: 3246 }
  for (const [category, count] of Object.entries(counts)) {
    const pool = getExamVocabulary(vocabulary, { category })
    assert.equal(pool.length, count, category)
    assert.equal(new Set(pool.map((word) => String(word.id))).size, count)
  }
})

test('today plan progress excludes other categories and previous days', () => {
  const progress = {
    1: { lastReviewed: '2026-10-21T02:00:00Z' },
    2: { lastReviewed: '2026-10-21T02:00:00Z' },
    3: { lastReviewed: '2026-10-20T02:00:00Z' },
  }
  assert.deepEqual(getPlanWordStats(getPlanVocabulary(words, 'toefl'), progress, [1, 2], [3], '2026-10-21'), {
    todayStudied: 1, todayMastered: 0, remaining: 0,
  })
})

test('switching category keeps separate exam counters and a new day resets them', () => {
  const toefl = recordPlanExamAnswer({}, 'toefl', true, '2026-10-21')
  const ielts = recordPlanExamAnswer(toefl, 'ielts', false, '2026-10-21')
  assert.deepEqual(ielts.categories, { toefl: { answered: 1, correct: 1 }, ielts: { answered: 1, correct: 0 } })
  assert.deepEqual(recordPlanExamAnswer(ielts, 'toefl', false, '2026-10-22').categories, { toefl: { answered: 1, correct: 0 } })
})

test('invalid or legacy category preferences safely default to all vocabulary', () => {
  for (const value of [null, undefined, '', 'unsupported', {}, ['toefl']]) assert.equal(normalizePlanCategory(value), 'all')
})

test('category preference persists independently of the existing daily target and progress', () => {
  const values = new Map([
    ['flashcards_daily_new_word_target', '40'],
    ['flashcards_learned_words', '[1,2]'],
  ])
  const previousStorage = globalThis.localStorage
  globalThis.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  }
  try {
    assert.equal(storage.getStudyPlanCategory(), 'all')
    storage.setStudyPlanCategory('toefl')
    assert.equal(storage.getStudyPlanCategory(), 'toefl')
    assert.equal(storage.getDailyNewWordTarget(), 40)
    for (const target of [70, 100]) {
      storage.setDailyNewWordTarget(target)
      assert.equal(storage.getDailyNewWordTarget(), target)
    }
    assert.deepEqual(storage.getLearnedWords(), [1, 2])
    storage.setPlanExamActivity(recordPlanExamAnswer({}, 'toefl', true, '2026-10-21'))
    assert.equal(storage.getPlanExamActivity().categories.toefl.answered, 1)
    storage.clearProgress()
    assert.deepEqual(storage.getPlanExamActivity(), {})
    assert.equal(storage.getStudyPlanCategory(), 'toefl')
  } finally {
    if (previousStorage === undefined) delete globalThis.localStorage
    else globalThis.localStorage = previousStorage
  }
})
