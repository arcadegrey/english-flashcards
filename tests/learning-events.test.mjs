import test from 'node:test'
import assert from 'node:assert/strict'
import { applyStudyEvent, applyReadingCompletion, uniqueReadingArticleIds } from '../src/utils/learningEvents.js'

const date = '2026-10-28'
const freeze = value => {
  if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value) }
  return value
}

test('study events add only the requested counters and preserve reading results and category history', () => {
  const history = freeze([{ date, wordsLearned: 2, wordsMastered: 1, timeSpent: 4,
    examByCategory: { ielts: { answered: 2, correct: 1 } },
    readingArticleResults: [{ articleId: 'a', questionsAnswered: 3, questionsCorrect: 2, completedAt: date }],
  }])
  const [day] = applyStudyEvent(history, { wordsLearned: 1, timeSpent: 2 }, date)
  assert.equal(day.wordsLearned, 3)
  assert.equal(day.wordsMastered, 1)
  assert.equal(day.timeSpent, 6)
  assert.equal(day.readingsCompleted, 1)
  assert.deepEqual(day.examByCategory.ielts, { answered: 2, correct: 1 })
  assert.equal(day.readingArticleResults[0].questionsCorrect, 2)
  assert.equal(history[0].wordsLearned, 2)
})

test('new-day events normalize invalid counters without rewriting prior days', () => {
  const history = freeze([{ date: '2026-10-27', wordsLearned: 8 }])
  const next = applyStudyEvent(history, { wordsLearned: '2', timeSpent: Infinity, examQuestionsAnswered: 4, examQuestionsCorrect: 2 }, date)
  assert.equal(next[0].wordsLearned, 8)
  assert.equal(next[1].wordsLearned, 2)
  assert.equal(next[1].timeSpent, 0)
  assert.equal(next[1].examQuestionsAnswered, 4)
  assert.equal(next[1].examQuestionsCorrect, 2)
  assert.deepEqual(next[1].readingArticleIds, [])
})

test('reading completion records its first result once per day, including time and question totals', () => {
  const initial = applyReadingCompletion([], { articleId: 12, questionsAnswered: 3, questionsCorrect: 2, timeSpent: 5 }, date)
  freeze(initial)
  const retry = applyReadingCompletion(initial, { articleId: '12', questionsAnswered: 8, questionsCorrect: 8, timeSpent: 20 }, date)
  assert.deepEqual(retry, initial)
  const next = applyReadingCompletion(retry, { articleId: '13', questionsAnswered: 2, questionsCorrect: 1, timeSpent: 4 }, date)[0]
  assert.equal(next.readingsCompleted, 2)
  assert.equal(next.readingQuestionsAnswered, 5)
  assert.equal(next.readingQuestionsCorrect, 3)
  assert.equal(next.timeSpent, 9)
  assert.deepEqual(next.readingArticleIds, ['12', '13'])
  assert.equal(next.readingArticleResults[0].questionsCorrect, 2)
})

test('old aggregate completions stay compatible and are not reconstructed from a retry', () => {
  const legacy = freeze([{ date, readingsCompleted: 4, readingArticleIds: [12], readingQuestionsAnswered: 10, readingQuestionsCorrect: 7 }])
  const day = applyReadingCompletion(legacy, { articleId: '12', questionsAnswered: 2, questionsCorrect: 2 }, date)[0]
  assert.equal(day.readingsCompleted, 4)
  assert.equal(day.readingQuestionsAnswered, 10)
  assert.deepEqual(day.readingArticleResults, [])
  assert.equal(applyReadingCompletion(legacy, {}), legacy)
  assert.deepEqual(uniqueReadingArticleIds(['12', 12, null, ' ', ' a ', 'a']), ['12', 'a'])
})

test('event and reading updates retain only the latest 90 normalized day records', () => {
  const history = Array.from({ length: 100 }, (_, index) => ({ date: new Date(Date.UTC(2026, 0, index + 1)).toISOString().slice(0, 10), wordsLearned: 1 }))
  const study = applyStudyEvent(freeze(history), { wordsLearned: 1 }, date)
  const reading = applyReadingCompletion(history, { articleId: 'a' }, date)
  assert.equal(study.length, 90)
  assert.equal(reading.length, 90)
  assert.equal(study.at(-1).date, date)
  assert.equal(reading.at(-1).readingArticleIds[0], 'a')
})

test('default event dates switch at Beijing midnight and allow the next day first reading result', context => {
  context.mock.timers.enable({ apis: ['Date'], now: Date.parse('2026-10-27T15:59:59Z') })
  try {
    const before = applyReadingCompletion([], { articleId: 'a', questionsAnswered: 1, questionsCorrect: 0 })
    assert.equal(before[0].date, '2026-10-27')
    context.mock.timers.tick(1000)
    const after = applyReadingCompletion(before, { articleId: 'a', questionsAnswered: 1, questionsCorrect: 1 })
    assert.equal(after[1].date, '2026-10-28')
    assert.equal(after[1].readingsCompleted, 1)
    assert.equal(applyStudyEvent(after, { wordsLearned: 1 }).at(-1).wordsLearned, 1)
  } finally { context.mock.timers.reset() }
})
