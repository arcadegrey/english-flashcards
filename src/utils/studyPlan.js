import { wordBelongsToCategory } from './wordCategories.js'

import { PLAN_CATEGORY_IDS } from '../../shared/planPreferences.js'
export { DAILY_NEW_WORD_TARGETS, PLAN_CATEGORY_IDS } from '../../shared/planPreferences.js'

export const normalizePlanCategory = (value) => PLAN_CATEGORY_IDS.includes(value) ? value : 'all'

export const getPlanVocabulary = (vocabulary, category) =>
  vocabulary.filter((word) => wordBelongsToCategory(word, normalizePlanCategory(category)))

export const getExamVocabulary = (vocabulary, { category = 'all', scope = 'all', learnedWords = [], masteredWords = [] } = {}) => {
  const categoryWords = getPlanVocabulary(vocabulary, category)
  if (scope === 'all') return categoryWords
  const ids = new Set((scope === 'mastered' ? masteredWords : learnedWords).map(String))
  return categoryWords.filter((word) => ids.has(String(word.id)))
}

export const getPlanWordStats = (vocabulary, wordProgress, learnedWords, masteredWords, date = new Date().toISOString().slice(0, 10)) => {
  const seenIds = new Set([...learnedWords, ...masteredWords].map(String))
  const masteredIds = new Set(masteredWords.map(String))
  const reviewedToday = vocabulary.filter((word) => String(wordProgress[word.id]?.lastReviewed || '').slice(0, 10) === date)
  return {
    todayStudied: reviewedToday.length,
    todayMastered: reviewedToday.filter((word) => masteredIds.has(String(word.id))).length,
    remaining: vocabulary.filter((word) => !seenIds.has(String(word.id))).length,
  }
}

export const recordPlanExamAnswer = (activity, category, isCorrect, date = new Date().toISOString().slice(0, 10)) => {
  const categories = activity?.date === date ? activity.categories || {} : {}
  const current = categories[category] || {}
  return {
    date,
    categories: {
      ...categories,
      [category]: {
        answered: (Number(current.answered) || 0) + 1,
        correct: (Number(current.correct) || 0) + (isCorrect ? 1 : 0),
      },
    },
  }
}
