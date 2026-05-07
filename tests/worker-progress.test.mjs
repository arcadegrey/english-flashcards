import assert from 'node:assert/strict'
import test from 'node:test'
import { mergeProgress } from '../worker/index.js'

test('mergeProgress keeps mastered words out of learned and wrong lists', () => {
  const merged = mergeProgress(
    {
      learnedWords: [1, 2],
      masteredWords: [3],
      wrongWords: [2, 3],
    },
    {
      learnedWords: [3, 4],
      masteredWords: [2],
      wrongWords: [4, 2],
    }
  )

  assert.deepEqual(merged.masteredWords, [3, 2])
  assert.deepEqual(merged.learnedWords, [1, 4])
  assert.deepEqual(merged.wrongWords, [4])
})

test('mergeProgress resolves concurrent wordProgress by applying incoming progress last', () => {
  const merged = mergeProgress(
    {
      wordProgress: {
        1: { reps: 1, interval: 1, nextReview: '2026-05-08T00:00:00.000Z' },
        2: { reps: 2, interval: 6, nextReview: '2026-05-13T00:00:00.000Z' },
      },
    },
    {
      wordProgress: {
        1: { reps: 0, interval: 0, nextReview: '2026-05-07T00:00:00.000Z' },
        3: { reps: 1, interval: 1, nextReview: '2026-05-08T00:00:00.000Z' },
      },
    }
  )

  assert.deepEqual(merged.wordProgress, {
    1: { reps: 0, interval: 0, nextReview: '2026-05-07T00:00:00.000Z' },
    2: { reps: 2, interval: 6, nextReview: '2026-05-13T00:00:00.000Z' },
    3: { reps: 1, interval: 1, nextReview: '2026-05-08T00:00:00.000Z' },
  })
})

test('mergeProgress merges study history by day with max counters', () => {
  const merged = mergeProgress(
    {
      studyHistory: [
        { date: '2026-05-06', wordsLearned: 2, wordsMastered: 1, timeSpent: 10 },
        { date: '2026-05-07', wordsLearned: 1, wordsMastered: 0, timeSpent: 5 },
      ],
    },
    {
      studyHistory: [
        { date: '2026-05-06', wordsLearned: 3, wordsMastered: 0, timeSpent: 8 },
        { date: '2026-05-08', wordsLearned: 1, wordsMastered: 1, timeSpent: 6 },
      ],
    }
  )

  assert.deepEqual(merged.studyHistory, [
    { date: '2026-05-06', wordsLearned: 3, wordsMastered: 1, timeSpent: 10 },
    { date: '2026-05-07', wordsLearned: 1, wordsMastered: 0, timeSpent: 5 },
    { date: '2026-05-08', wordsLearned: 1, wordsMastered: 1, timeSpent: 6 },
  ])
})
