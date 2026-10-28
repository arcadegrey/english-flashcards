import { getStudyDateKey } from '../../shared/studyDate.js'
import { normalizeStudyHistoryItem, normalizeStudyHistory } from '../../shared/studyHistory.js'

const toNumber = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0)

export const uniqueReadingArticleIds = (value) => {
  const safeList = Array.isArray(value) ? value : []
  const seen = new Set()
  const output = []

  safeList.forEach((item) => {
    if (item === null || item === undefined) return
    const key = String(item).trim()
    if (!key || seen.has(key)) return
    seen.add(key)
    output.push(key)
  })

  return output
}

export function applyStudyEvent(history, delta, today = getStudyDateKey()) {
  const safeList = normalizeStudyHistory(history)
  const index = safeList.findIndex((item) => item.date === today)
  const nextList = [...safeList]
  if (index >= 0) {
    const item = nextList[index]
    nextList[index] = {
      ...item,
      wordsLearned: toNumber(item.wordsLearned) + toNumber(delta.wordsLearned),
      wordsMastered: toNumber(item.wordsMastered) + toNumber(delta.wordsMastered),
      timeSpent: toNumber(item.timeSpent) + toNumber(delta.timeSpent),
      readingsCompleted: toNumber(item.readingsCompleted) + toNumber(delta.readingsCompleted),
      readingQuestionsAnswered: toNumber(item.readingQuestionsAnswered) + toNumber(delta.readingQuestionsAnswered),
      readingQuestionsCorrect: toNumber(item.readingQuestionsCorrect) + toNumber(delta.readingQuestionsCorrect),
      examQuestionsAnswered: toNumber(item.examQuestionsAnswered) + toNumber(delta.examQuestionsAnswered),
      examQuestionsCorrect: toNumber(item.examQuestionsCorrect) + toNumber(delta.examQuestionsCorrect),
    }
  } else {
    nextList.push({
      date: today,
      wordsLearned: toNumber(delta.wordsLearned),
      wordsMastered: toNumber(delta.wordsMastered),
      timeSpent: toNumber(delta.timeSpent),
      readingsCompleted: toNumber(delta.readingsCompleted),
      readingQuestionsAnswered: toNumber(delta.readingQuestionsAnswered),
      readingQuestionsCorrect: toNumber(delta.readingQuestionsCorrect),
      examQuestionsAnswered: toNumber(delta.examQuestionsAnswered),
      examQuestionsCorrect: toNumber(delta.examQuestionsCorrect),
      readingArticleIds: [],
    })
  }
  return normalizeStudyHistory(nextList).slice(-90)
}

export function applyReadingCompletion(history, { articleId, questionsAnswered = 0, questionsCorrect = 0, timeSpent = 0 } = {}, today = getStudyDateKey()) {
  if (articleId == null) return history
  const articleKey = String(articleId)
  const safeList = normalizeStudyHistory(history)
  const index = safeList.findIndex((item) => item.date === today)
  const nextList = [...safeList]
  const current = index >= 0 ? nextList[index] : normalizeStudyHistoryItem({ date: today })
  const articleIds = uniqueReadingArticleIds(current.readingArticleIds)
  const wasCompleted = articleIds.includes(articleKey)
  const nextArticleIds = wasCompleted ? articleIds : [...articleIds, articleKey]
  const existingResults = Array.isArray(current.readingArticleResults) ? current.readingArticleResults : []
  const nextResults = wasCompleted
    ? existingResults
    : [
        ...existingResults.filter((result) => String(result?.articleId) !== articleKey),
        {
          articleId: articleKey,
          questionsAnswered: toNumber(questionsAnswered),
          questionsCorrect: toNumber(questionsCorrect),
          completedAt: today,
        },
      ]
  const nextItem = {
    ...current,
    readingsCompleted: Math.max(
      toNumber(current.readingsCompleted) + (wasCompleted ? 0 : 1),
      nextArticleIds.length
    ),
    readingQuestionsAnswered: Math.max(
      toNumber(current.readingQuestionsAnswered),
      toNumber(current.readingQuestionsAnswered) + (wasCompleted ? 0 : toNumber(questionsAnswered))
    ),
    readingQuestionsCorrect: Math.max(
      toNumber(current.readingQuestionsCorrect),
      toNumber(current.readingQuestionsCorrect) + (wasCompleted ? 0 : toNumber(questionsCorrect))
    ),
    timeSpent: toNumber(current.timeSpent) + (wasCompleted ? 0 : toNumber(timeSpent)),
    readingArticleIds: nextArticleIds,
    readingArticleResults: nextResults,
  }

  if (index >= 0) {
    nextList[index] = nextItem
  } else {
    nextList.push(nextItem)
  }

  return normalizeStudyHistory(nextList).slice(-90)
}
