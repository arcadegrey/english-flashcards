import assert from 'node:assert/strict'
import test from 'node:test'
import { buildStudentWordRows, getAccountRoleLabel } from '../src/utils/classroom.js'
import { getWordsForReview } from '../src/utils/spacedRepetition.js'

test('teacher due-review flags match the existing review queue, including uninitialized mastered words', () => {
  const words = [1, 2, 3, 4].map((id) => ({ id, word: `word-${id}` }))
  const now = new Date()
  const wordProgress = {
    1: { lastReviewed: now.toISOString() },
    3: { nextReview: new Date(now.getTime() - 86400000).toISOString() },
    4: { nextReview: new Date(now.getTime() + 86400000).toISOString() },
  }
  const expected = [...getWordsForReview(words, wordProgress), ...words.filter((word) => !wordProgress[word.id])].map((word) => String(word.id)).sort()
  const actual = buildStudentWordRows({ learnedWords: [1, 3], masteredWords: [2, 4], wordProgress }, words, now).filter((row) => row.due).map((row) => row.id).sort()
  assert.deepEqual(actual, expected)
})

test('student word records resolve shared custom words, keep unknown IDs, and preserve mastery priority', () => {
  const rows = buildStudentWordRows({
    learnedWords: [1, '1', 'custom', 99], masteredWords: ['1'], wrongWords: [1, 'custom', 7],
    customWords: [{ id: 'custom', word: 'handcrafted', meaning: '手工制作的' }],
    wordProgress: { custom: { lastReviewed: '2026-10-21T01:00:00Z', nextReview: '2026-10-20T01:00:00Z' }, 1: { nextReview: '2026-10-25T00:00:00Z' } },
  }, [{ id: 1, word: 'learn', meaning: '学习' }], new Date('2026-10-21T12:00:00Z'))
  assert.equal(rows.length, 4)
  assert.equal(rows.find((row) => row.id === '1').status, 'mastered')
  assert.equal(rows.find((row) => row.id === '1').wrong, false)
  assert.equal(rows.find((row) => row.id === '1').due, false)
  assert.equal(rows.find((row) => row.id === 'custom').word, 'handcrafted')
  assert.equal(rows.find((row) => row.id === 'custom').due, true)
  assert.equal(rows.find((row) => row.id === '99').missing, true)
  assert.equal(rows.find((row) => row.id === '7').status, 'wrong')
})

test('legacy accounts are not mislabeled before role configuration', () => {
  assert.equal(getAccountRoleLabel({}), '学习者')
  assert.equal(getAccountRoleLabel({ role: 'teacher', profileConfigured: true }), '老师')
  assert.equal(getAccountRoleLabel({ role: 'student', profileConfigured: true }), '学生')
})
