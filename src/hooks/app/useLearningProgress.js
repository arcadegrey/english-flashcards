import { applyStudyEvent, applyReadingCompletion } from '../../utils/learningEvents.js'
import { normalizeProgressState } from '../../utils/progressState.js'
import { getStudyDateKey } from '../../../shared/studyDate.js'
import { mergeWordBookmarks } from '../../../shared/wordBookmarks.js'
import { recordDailyExamAnswer, mergeLegacyPlanExamActivity } from '../../../shared/studyHistory.js'
import { useState, useEffect, useLayoutEffect, useMemo, useRef, useCallback } from 'react'
import { storage } from '../../utils/storage'
import { recordPlanExamAnswer } from '../../utils/studyPlan'
import { calculateNextReview, initializeWordProgress } from '../../utils/spacedRepetition'

// Own account-scoped local progress, learning events and committed sync snapshots.
export function useLearningProgress() {
  const [initialLocalProgress] = useState(() => {
    try { return storage.switchLearningAccount(storage.getAuthSession()?.user?.id) }
    catch { return storage.getLearningSnapshot() }
  })
  const [learnedWords, setLearnedWords] = useState(initialLocalProgress.learnedWords)
  const [masteredWords, setMasteredWords] = useState(initialLocalProgress.masteredWords)
  const [wrongWords, setWrongWords] = useState(initialLocalProgress.wrongWords)
  const [wordBookmarks, setWordBookmarks] = useState(() => storage.getWordBookmarks())
  const [wordProgress, setWordProgress] = useState(initialLocalProgress.wordProgress)
  const [studyHistory, setStudyHistory] = useState(() => mergeLegacyPlanExamActivity(initialLocalProgress.studyHistory, initialLocalProgress.planExamActivity))
  const [customWords, setCustomWords] = useState(initialLocalProgress.customWords)
  const [dailyNewWordTarget, setDailyNewWordTarget] = useState(() => storage.getDailyNewWordTarget())
  const [planPreferencesUpdatedAt, setPlanPreferencesUpdatedAt] = useState(() => storage.getPlanPreferencesUpdatedAt())
  const [studyPlanCategory, setStudyPlanCategory] = useState(() => storage.getStudyPlanCategory())
  const [planExamActivity, setPlanExamActivity] = useState(() => storage.getPlanExamActivity())
  // The account-scoped snapshot is read synchronously by the initializer above.
  const localDataLoaded = true
  const learningResetRef = useRef(0)
  const latestProgressRef = useRef(null)

  const currentProgress = useMemo(
    () => ({
      learnedWords,
      masteredWords,
      customWords,
      wordProgress,
      wrongWords,
      studyHistory,
      preferences: {
        dailyNewWordTarget,
        studyPlanCategory,
        updatedAt: planPreferencesUpdatedAt,
        wordBookmarks,
      },
    }),
    [customWords, dailyNewWordTarget, planPreferencesUpdatedAt, studyPlanCategory, wordBookmarks, learnedWords, masteredWords, studyHistory, wordProgress, wrongWords]
  )

  // Publish the committed snapshot before passive sync effects or browser events run.
  useLayoutEffect(() => { latestProgressRef.current = currentProgress }, [currentProgress])

  useEffect(() => {
    storage.setPlanExamActivity(planExamActivity)
  }, [planExamActivity])

  useEffect(() => {
    storage.setLearnedWords(learnedWords)
  }, [learnedWords])

  useEffect(() => {
    storage.setMasteredWords(masteredWords)
  }, [masteredWords])

  useEffect(() => {
    storage.setCustomWords(customWords)
  }, [customWords])

  useEffect(() => {
    storage.setWrongWords(wrongWords)
  }, [wrongWords])

  useEffect(() => {
    storage.setWordProgress(wordProgress)
  }, [wordProgress])

  useEffect(() => {
    storage.setStudyHistory(studyHistory)
  }, [studyHistory])

  const applyMergedProgress = useCallback((mergedProgress) => {
    const normalized = normalizeProgressState(mergedProgress)
    normalized.studyHistory = mergeLegacyPlanExamActivity(normalized.studyHistory, storage.getPlanExamActivity())
    const bookmarks = mergeWordBookmarks(storage.getWordBookmarks(), normalized.preferences.wordBookmarks)
    normalized.preferences.wordBookmarks = bookmarks
    latestProgressRef.current = normalized
    storage.setWordBookmarks(bookmarks)
    setWordBookmarks(bookmarks)

    setLearnedWords(normalized.learnedWords)
    setMasteredWords(normalized.masteredWords)
    setCustomWords(normalized.customWords)
    setWordProgress(normalized.wordProgress)
    setWrongWords(normalized.wrongWords)
    setStudyHistory(normalized.studyHistory)
    if (normalized.preferences.dailyNewWordTarget) {
      setDailyNewWordTarget(normalized.preferences.dailyNewWordTarget)
      storage.setDailyNewWordTarget(normalized.preferences.dailyNewWordTarget)
    }
    if (normalized.preferences.studyPlanCategory) {
      setStudyPlanCategory(normalized.preferences.studyPlanCategory)
      storage.setStudyPlanCategory(normalized.preferences.studyPlanCategory)
    }
    setPlanPreferencesUpdatedAt(normalized.preferences.updatedAt || '')
    storage.setPlanPreferencesUpdatedAt(normalized.preferences.updatedAt || '')

    storage.setLearnedWords(normalized.learnedWords)
    storage.setMasteredWords(normalized.masteredWords)
    storage.setCustomWords(normalized.customWords)
    storage.setWordProgress(normalized.wordProgress)
    storage.setWrongWords(normalized.wrongWords)
    storage.setStudyHistory(normalized.studyHistory)
  }, [])

  const recordStudyEvent = (wordsLearnedDelta = 0, wordsMasteredDelta = 0, timeSpentDelta = 0, extraDelta = {}) => {
    const delta =
      wordsLearnedDelta && typeof wordsLearnedDelta === 'object'
        ? wordsLearnedDelta
        : {
            wordsLearned: wordsLearnedDelta,
            wordsMastered: wordsMasteredDelta,
            timeSpent: timeSpentDelta,
            ...extraDelta,
          }
    const date = getStudyDateKey()
    setStudyHistory(history => applyStudyEvent(history, delta, date))
  }

  const recordReadingCompletion = (result = {}) => {
    if (result.articleId == null) return
    const date = getStudyDateKey()
    setStudyHistory(history => applyReadingCompletion(history, result, date))
  }

  const recordAssessmentAnswer = (isCorrect) => {
    const date = getStudyDateKey()
    setPlanExamActivity((activity) => recordPlanExamAnswer(activity, studyPlanCategory, isCorrect, date))
    setStudyHistory(history => recordDailyExamAnswer(history, { category: studyPlanCategory, correct: isCorrect,
      date, legacy: planExamActivity }))
  }

  const updateReviewProgress = (wordId, rating) => {
    if (wordId == null) return
    setWordProgress((prev) => {
      const previousProgress = prev?.[wordId] || initializeWordProgress()
      const nextProgress = calculateNextReview(previousProgress, rating)
      return {
        ...prev,
        [wordId]: {
          ...nextProgress,
          nextReview:
            nextProgress.nextReview instanceof Date
              ? nextProgress.nextReview.toISOString()
              : String(nextProgress.nextReview || new Date().toISOString()),
          lastReviewed: new Date().toISOString(),
        },
      }
    })
  }

  const addWrongWord = (wordId) => {
    if (wordId == null) return
    setWrongWords((prev) => (prev.some((id) => String(id) === String(wordId)) ? prev : [...prev, wordId]))
  }

  const removeWrongWord = (wordId) => {
    if (wordId == null) return
    setWrongWords((prev) => prev.filter((id) => String(id) !== String(wordId)))
  }

  const setWordAsLearned = (wordId) => {
    if (wordId == null) return
    setMasteredWords((prev) => prev.filter((id) => String(id) !== String(wordId)))
    setLearnedWords((prev) => (prev.some((id) => String(id) === String(wordId)) ? prev : [...prev, wordId]))
    updateReviewProgress(wordId, 2)
    recordStudyEvent(1, 0, 1)
  }

  const setWordAsMastered = (wordId) => {
    if (wordId == null) return
    setLearnedWords((prev) => prev.filter((id) => String(id) !== String(wordId)))
    setMasteredWords((prev) => (prev.some((id) => String(id) === String(wordId)) ? prev : [...prev, wordId]))
    removeWrongWord(wordId)
    updateReviewProgress(wordId, 4)
    recordStudyEvent(0, 1, 1)
  }

  const handleSelectDailyNewWordTarget = (target) => {
    storage.setDailyNewWordTarget(target)
    const updatedAt = new Date().toISOString()
    storage.setPlanPreferencesUpdatedAt(updatedAt)
    setPlanPreferencesUpdatedAt(updatedAt)
    setDailyNewWordTarget(storage.getDailyNewWordTarget())
  }

  const resetLearningProgress = () => {
    learningResetRef.current += 1
    setLearnedWords([])
    setMasteredWords([])
    setWrongWords([])
    setWordProgress({})
    setStudyHistory([])
    setPlanExamActivity({})
    storage.clearProgress()
  }

  const toggleWordBookmark = (ownerId, wordId, saved) => {
    const next = storage.changeWordBookmark(ownerId, wordBookmarks, wordId, saved)
    setWordBookmarks(next)
    latestProgressRef.current = { ...latestProgressRef.current,
      preferences: { ...latestProgressRef.current.preferences, wordBookmarks: next } }
  }

  return {
    learnedWords, masteredWords, wrongWords, wordBookmarks, wordProgress, studyHistory, customWords,
    dailyNewWordTarget, planPreferencesUpdatedAt, studyPlanCategory, planExamActivity, localDataLoaded,
    learningResetRef, latestProgressRef, setWordBookmarks, toggleWordBookmark,
    setPlanPreferencesUpdatedAt,
    setStudyPlanCategory, setPlanExamActivity, currentProgress, applyMergedProgress,
    recordReadingCompletion, recordAssessmentAnswer, setWordAsLearned, setWordAsMastered, addWrongWord,
    handleSelectDailyNewWordTarget, resetLearningProgress,
  }
}
