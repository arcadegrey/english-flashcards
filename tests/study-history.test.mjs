import assert from 'node:assert/strict'
import test from 'node:test'
import { mergeStudyHistory, normalizeStudyHistoryItem } from '../shared/studyHistory.js'
import { mergeProgress } from '../worker/index.js'
import { buildStudentReadingOverview } from '../src/utils/classroom.js'

const day = '2026-10-21'
const article = (id, answered, correct, date = day) => ({ articleId: String(id), questionsAnswered: answered, questionsCorrect: correct, completedAt: date })

test('conflicting devices preserve distinct reading completions and their full question totals', () => {
  const first = { studyHistory: [{ date: day, readingArticleResults: [article(13, 5, 4)], examQuestionsAnswered: 7, examQuestionsCorrect: 5 }] }
  const second = { studyHistory: [{ date: day, readingArticleResults: [article(14, 4, 2)], examQuestionsAnswered: 9, examQuestionsCorrect: 6 }] }
  const merged = mergeProgress(first, second)
  const history = merged.studyHistory[0]
  assert.deepEqual(history.readingArticleIds, ['13', '14'])
  assert.equal(history.readingsCompleted, 2)
  assert.equal(history.readingQuestionsAnswered, 9)
  assert.equal(history.readingQuestionsCorrect, 6)
  assert.equal(history.examQuestionsAnswered, 9)
  assert.equal(history.examQuestionsCorrect, 6)
  assert.deepEqual(mergeProgress(merged, second), merged)
})

test('duplicate articles use their latest completion detail without multiplying completions', () => {
  const history = mergeStudyHistory(
    [{ date: day, readingArticleResults: [article(13, 5, 3, `${day}T01:00:00Z`)] }],
    [{ date: day, readingArticleResults: [article('13', 5, 4, `${day}T02:00:00Z`)] }],
  )[0]
  assert.equal(history.readingsCompleted, 1)
  assert.equal(history.readingArticleResults.length, 1)
  assert.equal(history.readingArticleResults[0].questionsCorrect, 4)
  assert.equal(history.readingQuestionsAnswered, 5)
})

test('legacy aggregates, empty history and missing article content render without invented accuracy', () => {
  const overview = buildStudentReadingOverview([
    { date: day, readingsCompleted: 3, readingQuestionsAnswered: 5, readingQuestionsCorrect: 3, readingArticleIds: ['missing'] },
  ], [], new Date(`${day}T12:00:00Z`))
  assert.equal(overview.totals.readingsCompleted, 3)
  assert.equal(overview.accuracy, 60)
  assert.equal(overview.rows[0].title, '文章 #missing')
  assert.equal(overview.rows[0].hasResult, false)
  assert.equal(overview.rows[0].accuracy, null)
  assert.equal(buildStudentReadingOverview().accuracy, null)
  assert.deepEqual(buildStudentReadingOverview().rows, [])
})

test('same article completed on different days stays separate and summary uses weighted accuracy', () => {
  const overview = buildStudentReadingOverview([
    { date: '2026-10-20', readingArticleResults: [article(13, 1, 1, '2026-10-20')] },
    { date: day, readingArticleResults: [article(13, 9, 3)] },
  ], [{ id: 13, title: 'Wetlands', level: 'B2', examType: 'IELTS' }], new Date(`${day}T12:00:00Z`))
  assert.equal(overview.totals.readingsCompleted, 2)
  assert.equal(overview.today.readingsCompleted, 1)
  assert.equal(overview.accuracy, 40)
  assert.equal(overview.rows.length, 2)
  assert.equal(overview.rows[0].title, 'Wetlands')
  assert.notEqual(overview.rows[0].id, overview.rows[1].id)
})

test('malformed counters cannot produce negative totals or accuracy above 100 percent', () => {
  const item = normalizeStudyHistoryItem({ date: day, wordsLearned: -3, examQuestionsAnswered: 2, examQuestionsCorrect: 9,
    readingArticleResults: [null, { articleId: 13, questionsAnswered: 5, questionsCorrect: 99 }] })
  assert.equal(item.wordsLearned, 0)
  assert.equal(item.examQuestionsCorrect, 2)
  assert.equal(item.readingQuestionsCorrect, 5)
  assert.equal(item.readingArticleResults.length, 1)
  assert.equal(normalizeStudyHistoryItem(null), null)
})
