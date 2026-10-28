import { uniqueReadingArticleIds } from '../../utils/learningEvents.js'
import { dedupeIdList } from '../../utils/progressState.js'
import { prepareReadingContent, indexReadingVocabulary, applyReadingProgress } from '../../utils/readingLibrary.js'
import { mergeVocabularyList } from '../../utils/vocabularyMerge.js'
import { RETIRED_VOCABULARY, activeProgressIds } from '../../../shared/retiredVocabulary.js'
import { getDailyPlanExamActivity } from '../../../shared/planActivity.js'
import { buildTomorrowPlan, needsPlanCatalog } from '../../utils/dailyPlan.js'
import { useState, useEffect, useMemo } from 'react'
import {
  loadFullVocabularyCatalog as loadFullVocabulary, loadVocabularyCatalogByIds as loadVocabularyByIds,
  hasBundledVocabularyId,
} from '../../data/vocabulary'
import readings from '../../data/readings'
import categories from '../../data/categories'
import { getExamVocabulary, getPlanVocabulary, getPlanWordStats } from '../../utils/studyPlan'
import { buildWordLookup } from '../../utils/readingText'
import { getWordsForReview } from '../../utils/spacedRepetition'

const preparedReadings = prepareReadingContent(readings)

// Project reading, collection and daily-plan data and prepare missing plan vocabulary.
export function useStudyOverview(learning, catalog, navigationState, clock) {
  const {
    learnedWords, masteredWords, wrongWords, wordBookmarks, wordProgress, studyHistory, customWords,
    dailyNewWordTarget, studyPlanCategory, planExamActivity,
  } = learning
  const {
    vocabulary, setVocabulary, vocabularyLoading, toeflManifest, ieltsManifest, allVocabulary, wordCounts,
    fullVocabularyLoadedRef,
  } = catalog
  const {
    view,
  } = navigationState
  const {
    studyDay,
  } = clock

  const [planPreparing, setPlanPreparing] = useState(false)
  const [planPreparationError, setPlanPreparationError] = useState('')
  const [planPreparationAttempt, setPlanPreparationAttempt] = useState(0)

  const vocabularyLookup = useMemo(() => buildWordLookup(allVocabulary), [allVocabulary])
  const masteredWordIdSet = useMemo(
    () => new Set(masteredWords.map((item) => String(item))),
    [masteredWords]
  )
  const indexedReadings = useMemo(() => indexReadingVocabulary(preparedReadings, vocabularyLookup), [vocabularyLookup])
  const readingLibrary = useMemo(() => applyReadingProgress(indexedReadings, masteredWordIdSet), [indexedReadings, masteredWordIdSet])

  const todayStudyStats = useMemo(() => {
    const today = studyDay
    const todayData = studyHistory.find((item) => item.date === today) || {}
    return {
      wordsLearned: Number(todayData.wordsLearned || 0),
      wordsMastered: Number(todayData.wordsMastered || 0),
      readingsCompleted: Number(todayData.readingsCompleted || 0),
      readingQuestionsAnswered: Number(todayData.readingQuestionsAnswered || 0),
      readingQuestionsCorrect: Number(todayData.readingQuestionsCorrect || 0),
      examQuestionsAnswered: Number(todayData.examQuestionsAnswered || 0),
      examQuestionsCorrect: Number(todayData.examQuestionsCorrect || 0),
      readingArticleIds: uniqueReadingArticleIds(todayData.readingArticleIds),
      examByCategory: todayData.examByCategory,
    }
  }, [studyHistory, studyDay])
  const suggestedReading = useMemo(
    () =>
      readingLibrary.find((item) => item.examType === 'IELTS' && String(item.level).toUpperCase() === 'B2') ||
      readingLibrary.find((item) => item.examType === 'TOEFL') ||
      readingLibrary.find((item) => item.examType) ||
      readingLibrary[0] ||
      null,
    [readingLibrary]
  )

  const statisticsWordCount = useMemo(() => {
    const recordedIds = new Set([...learnedWords, ...masteredWords].map(String))
    const archivedCount = RETIRED_VOCABULARY.filter(word => recordedIds.has(String(word.id))).length
    const activeCount = Number(toeflManifest?.sourceTotal) || Number(ieltsManifest?.sourceTotal) || vocabulary.length
    return activeCount + customWords.length + archivedCount
  }, [customWords.length, ieltsManifest, learnedWords, masteredWords, toeflManifest, vocabulary.length])

  const planCategoryName = categories.find((category) => category.id === studyPlanCategory)?.name || '全部单词'
  const planVocabulary = useMemo(() => getPlanVocabulary(allVocabulary, studyPlanCategory), [allVocabulary, studyPlanCategory])
  const planWordCount = studyPlanCategory === 'all' ? wordCounts.all : wordCounts[studyPlanCategory] || 0
  const planWordStats = useMemo(() => getPlanWordStats(planVocabulary, wordProgress, learnedWords, masteredWords, studyDay),
    [planVocabulary, wordProgress, learnedWords, masteredWords, studyDay])
  const planRecordedIds = useMemo(() => dedupeIdList(activeProgressIds([
    ...learnedWords, ...masteredWords, ...Object.keys(wordProgress),
  ])).filter(hasBundledVocabularyId), [learnedWords, masteredWords, wordProgress])
  const planMissingIds = useMemo(() => {
    const loadedIds = new Set(allVocabulary.map(word => String(word.id)))
    return planRecordedIds.filter(id => !loadedIds.has(String(id)))
  }, [allVocabulary, planRecordedIds])
  const planNeedsCatalog = useMemo(() => needsPlanCatalog(allVocabulary, planRecordedIds, studyPlanCategory),
    [allVocabulary, planRecordedIds, studyPlanCategory])
  const planExamStats = getDailyPlanExamActivity({ ...todayStudyStats, date: studyDay }, studyPlanCategory, planExamActivity)
  const planTodayWordsLearned = studyPlanCategory === 'all'
    ? todayStudyStats.wordsLearned + todayStudyStats.wordsMastered : planWordStats.todayStudied
  const planTodayExamAnswered = planExamStats.answered
  const planTodayExamCorrect = planExamStats.correct
  const planLearnedCount = useMemo(() => getExamVocabulary(allVocabulary, { category: studyPlanCategory, scope: 'learned', learnedWords }).length,
    [allVocabulary, studyPlanCategory, learnedWords])
  const planMasteredCount = useMemo(() => getExamVocabulary(allVocabulary, { category: studyPlanCategory, scope: 'mastered', masteredWords }).length,
    [allVocabulary, studyPlanCategory, masteredWords])

  useEffect(() => {
    if (vocabularyLoading) return
    let cancelled = false
    const preparePlan = async () => {
      setPlanPreparationError('')
      if (!planNeedsCatalog || fullVocabularyLoadedRef.current || !['studyHub', 'planSettings', 'examPractice'].includes(view)) {
        setPlanPreparing(false)
        return
      }
      setPlanPreparing(true)
      try {
        const words = studyPlanCategory === 'all'
          ? await loadVocabularyByIds(planMissingIds)
          : await loadFullVocabulary()
        if (cancelled) return
        if (!fullVocabularyLoadedRef.current) setVocabulary((prev) => mergeVocabularyList(prev, words))
        if (studyPlanCategory !== 'all') fullVocabularyLoadedRef.current = true
      } catch (error) {
        if (!cancelled) setPlanPreparationError(error?.message || '计划词库加载失败，请重试')
      } finally {
        if (!cancelled) setPlanPreparing(false)
      }
    }
    preparePlan()
    return () => { cancelled = true }
  }, [planNeedsCatalog, planMissingIds, studyPlanCategory, vocabularyLoading, view, planPreparationAttempt, fullVocabularyLoadedRef, setVocabulary])

  const vocabularyMap = useMemo(() => {
    const map = new Map()
    // Historical collections can still resolve old IDs; active courses only use allVocabulary.
    ;[...RETIRED_VOCABULARY, ...allVocabulary].forEach((word) => {
      map.set(word.id, word)
      map.set(String(word.id), word)
    })
    return map
  }, [allVocabulary])

  const learnedWordList = useMemo(
    () => learnedWords.map((id) => vocabularyMap.get(id)).filter(Boolean),
    [learnedWords, vocabularyMap]
  )

  const masteredWordList = useMemo(
    () => masteredWords.map((id) => vocabularyMap.get(id)).filter(Boolean),
    [masteredWords, vocabularyMap]
  )

  const reviewBaseWordList = useMemo(() => {
    const ids = dedupeIdList(activeProgressIds([...learnedWords, ...masteredWords]))
    return ids.map((id) => vocabularyMap.get(id)).filter(Boolean)
  }, [learnedWords, masteredWords, vocabularyMap])

  const todayReviewWordList = useMemo(() => {
    const dueWords = getWordsForReview(reviewBaseWordList, wordProgress, studyDay)
    const uninitializedWords = reviewBaseWordList.filter((word) => !wordProgress?.[word.id])
    const seen = new Set()
    return [...dueWords, ...uninitializedWords].filter((word) => {
      const key = String(word.id)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [reviewBaseWordList, wordProgress, studyDay])

  const wrongWordList = useMemo(
    () => wrongWords.map((id) => vocabularyMap.get(id)).filter(Boolean),
    [wrongWords, vocabularyMap]
  )

  const remainingPlanWordCount = studyPlanCategory === 'all'
    ? Math.max(0, planWordCount - new Set([...activeProgressIds(learnedWords), ...activeProgressIds(masteredWords)].map(String)).size)
    : planWordStats.remaining
  const planDataReady = !vocabularyLoading && !planPreparing && !planPreparationError
    && (!planNeedsCatalog || fullVocabularyLoadedRef.current)
  const tomorrowPlan = useMemo(() => buildTomorrowPlan({ reviewWords: reviewBaseWordList, wordProgress,
    remaining: remainingPlanWordCount, target: dailyNewWordTarget, readingCount: readingLibrary.length,
    wordCount: planWordCount, date: studyDay }),
    [reviewBaseWordList, wordProgress, remainingPlanWordCount, dailyNewWordTarget, readingLibrary.length, planWordCount, studyDay])

  const savedWordIds = Object.entries(wordBookmarks).filter(([, entry]) => entry.saved).map(([id]) => id)
  const savedWordList = savedWordIds.map((id) => vocabularyMap.get(id)).filter(Boolean)
  const unavailableSavedCount = savedWordIds.length - savedWordList.length

  return {
    readingLibrary, vocabularyLookup, todayStudyStats, suggestedReading, statisticsWordCount, planCategoryName,
    planVocabulary, planWordCount, planWordStats, planTodayWordsLearned, planTodayExamAnswered,
    planTodayExamCorrect, planLearnedCount, planMasteredCount, planPreparing, setPlanPreparing,
    planPreparationError, setPlanPreparationError, setPlanPreparationAttempt, vocabularyMap, learnedWordList,
    masteredWordList, reviewBaseWordList, todayReviewWordList, wrongWordList, remainingPlanWordCount,
    planDataReady, tomorrowPlan, savedWordList, unavailableSavedCount,
  }
}
