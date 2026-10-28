import { useNavigationHistory } from '../useNavigationHistory.js'
import { mergeVocabularyList } from '../../utils/vocabularyMerge.js'
import { wrongReadingQuestions } from '../../../shared/readingAttempts.js'
import { submitReadingAssignment } from '../../utils/classroomApi'
import { useEffect, useMemo } from 'react'
import { storage } from '../../utils/storage'
import { normalizePlanCategory } from '../../utils/studyPlan'
import { stopSpeak } from '../../utils/speech'
import { useVocabularyNavigation } from './useVocabularyNavigation.js'

// Coordinate view transitions and invalidate late study preparation responses.
export function useStudyNavigation(navigationState, learning, catalog, overview, account) {
  const {
    view, setView, mode, setMode, examScope, setExamScope, setExamPreparing, setExamPreparationError,
    examRequestRef, planRequestRef, assessmentBackTarget, setAssessmentBackTarget, selectedCategory,
    setSelectedCategory, selectedToeflLevel, setSelectedToeflLevel, selectedToeflList, setSelectedToeflList,
    selectedIeltsTopic, setSelectedIeltsTopic, selectedIeltsList, setSelectedIeltsList, selectedReadingId,
    setSelectedReadingId, activeReadingAssignment, setActiveReadingAssignment, setActiveWordAssignment,
    readingRetry, setReadingRetry, assignmentReturnView, setAssignmentReturnView, setHomePanelRequest,
    currentIndex, setCurrentIndex, shuffledWords, setShuffledWords, pendingStartWordIdRef,
  } = navigationState
  const {
    wordBookmarks, studyPlanCategory, setPlanPreferencesUpdatedAt, setStudyPlanCategory,
    recordReadingCompletion, setWordAsLearned, setWordAsMastered, resetLearningProgress,
  } = learning
  const {
    setVocabulary, fullVocabularyLoadedRef, filteredVocabulary, loadAllExamVocabulary, prepareSavedWords,
  } = catalog
  const {
    readingLibrary, suggestedReading, setPlanPreparing, setPlanPreparationError,
  } = overview
  const {
    authUser, setShowAuthModal,
  } = account

  const vocabularyNavigation = useVocabularyNavigation(navigationState, catalog)

  useEffect(() => {
    stopSpeak()
    return stopSpeak
  }, [view, mode, currentIndex, selectedReadingId, selectedCategory])

  useEffect(() => () => {
    // Ignore a late response after the user leaves the test picker.
    examRequestRef.current += 1
    planRequestRef.current += 1
    setExamPreparing(false)
  }, [examRequestRef, planRequestRef, setExamPreparing, view])

  useEffect(() => {
    const pendingStartWordId = pendingStartWordIdRef.current
    pendingStartWordIdRef.current = null

    if (pendingStartWordId != null) {
      const startWordIndex = filteredVocabulary.findIndex(
        (word) => String(word.id) === String(pendingStartWordId)
      )

      if (startWordIndex >= 0) {
        const startWord = filteredVocabulary[startWordIndex]
        const restWords = filteredVocabulary
          .filter((_, index) => index !== startWordIndex)
          .sort(() => Math.random() - 0.5)

        setShuffledWords([startWord, ...restWords])
        setCurrentIndex(0)
        return
      }
    }

    const shuffled = [...filteredVocabulary].sort(() => Math.random() - 0.5)
    setShuffledWords(shuffled)
    setCurrentIndex(0)
  }, [filteredVocabulary, pendingStartWordIdRef, setCurrentIndex, setShuffledWords])

  useNavigationHistory({
    view, mode, selectedCategory, selectedToeflLevel, selectedToeflList, selectedIeltsTopic, selectedIeltsList, selectedReadingId,
  }, {
    setView, setMode, setSelectedCategory, setSelectedToeflLevel, setSelectedToeflList, setSelectedIeltsTopic, setSelectedIeltsList, setSelectedReadingId,
    setActiveReadingAssignment, setActiveWordAssignment, setReadingRetry, setHomePanelRequest,
  })

  const currentWord = shuffledWords[currentIndex]

  const selectedReading = useMemo(
    () => readingRetry?.article || activeReadingAssignment?.article || readingLibrary.find((item) => String(item.id) === String(selectedReadingId)) || null,
    [readingRetry, activeReadingAssignment, readingLibrary, selectedReadingId]
  )

  const handleBackToHome = () => {
    setAssessmentBackTarget('home')
    setView('home')
  }

  const handleOpenWordStudy = () => {
    setAssessmentBackTarget('home')
    setHomePanelRequest((request) => ({ panel: 'words', nonce: request.nonce + 1 }))
    setView('home')
  }

  const handleOpenReadingList = () => {
    setActiveReadingAssignment(null)
    setActiveWordAssignment(null)
    setReadingRetry(null)
    setAssessmentBackTarget('home')
    setSelectedReadingId(null)
    setHomePanelRequest((request) => ({ panel: 'reading', nonce: request.nonce + 1 }))
    setView('home')
  }

  const handleOpenTodayReview = () => {
    setAssessmentBackTarget('home')
    setView('todayReview')
  }

  const handleOpenSavedWords = async () => {
    setShowAuthModal(false)
    setView('savedWords')
    await prepareSavedWords(wordBookmarks)
  }

  const handleOpenWrongWords = () => {
    setAssessmentBackTarget('home')
    setView('wrongWords')
  }

  const handleOpenStatistics = () => {
    setView('statistics')
  }

  const handleOpenClassroom = () => {
    setShowAuthModal(false)
    setView('classroom')
  }

  const handleSelectExamScope = (scope) => {
    examRequestRef.current += 1
    setExamPreparing(false)
    setExamPreparationError(null)
    setExamScope(scope)
  }

  const handleOpenExamPractice = () => {
    setExamPreparing(false)
    setExamPreparationError(null)
    setView('examPractice')
  }

  const handleOpenPlanSettings = () => {
    setView('planSettings')
  }

  const handleSelectPlanCategory = (category) => {
    const nextCategory = normalizePlanCategory(category)
    planRequestRef.current += 1
    examRequestRef.current += 1
    const updatedAt = new Date().toISOString()
    storage.setPlanPreferencesUpdatedAt(updatedAt)
    setPlanPreferencesUpdatedAt(updatedAt)
    storage.setStudyPlanCategory(nextCategory)
    setStudyPlanCategory(nextCategory)
    setPlanPreparationError('')
    setExamPreparationError(null)
    setExamScope('all')
  }

  const handleStartPlanLearning = async () => {
    const requestId = ++planRequestRef.current
    setPlanPreparing(true)
    setPlanPreparationError('')
    try {
      const words = await loadAllExamVocabulary()
      if (requestId !== planRequestRef.current) return
      if (words) {
        setVocabulary((prev) => mergeVocabularyList(prev, words))
        fullVocabularyLoadedRef.current = true
      }
      pendingStartWordIdRef.current = null
      setAssessmentBackTarget('studyHub')
      setSelectedCategory(studyPlanCategory)
      setSelectedToeflLevel('')
      setSelectedToeflList('')
      setSelectedIeltsTopic('')
      setSelectedIeltsList('')
      setCurrentIndex(0)
      setMode('learn')
      setView('learn')
    } catch (error) {
      if (requestId === planRequestRef.current) setPlanPreparationError(error?.message || '计划词库加载失败，请重试')
    } finally {
      if (requestId === planRequestRef.current) setPlanPreparing(false)
    }
  }

  const handleStartExamPractice = async (nextMode, scope = examScope, backTarget = 'examPractice') => {
    const requestId = ++examRequestRef.current
    pendingStartWordIdRef.current = null
    setAssessmentBackTarget(backTarget)
    setExamScope(scope)
    setExamPreparing(true)
    setExamPreparationError(null)

    try {
      const loadedVocabulary = await loadAllExamVocabulary()
      if (requestId !== examRequestRef.current) return
      if (loadedVocabulary) {
        setVocabulary((prev) => mergeVocabularyList(prev, loadedVocabulary))
        fullVocabularyLoadedRef.current = true
      }

      setSelectedCategory(studyPlanCategory)
      setSelectedToeflLevel('')
      setSelectedToeflList('')
      setSelectedIeltsTopic('')
      setSelectedIeltsList('')
      setCurrentIndex(0)
      setMode(nextMode)
      setView('learn')
    } catch (error) {
      if (requestId === examRequestRef.current) {
        setExamPreparationError({ message: error?.message || '词库加载失败，请重试', mode: nextMode, scope })
      }
    } finally {
      if (requestId === examRequestRef.current) setExamPreparing(false)
    }
  }

  const handleOpenReadingSession = (readingId) => {
    setActiveReadingAssignment(null)
    setActiveWordAssignment(null)
    setReadingRetry(null)
    setSelectedReadingId(readingId)
    setView('readingSession')
  }

  const handleStartReadingAssignment = (assignment) => {
    setReadingRetry(null)
    if (assignment.type === 'words') {
      setAssignmentReturnView(view === 'classroom' ? 'classroom' : 'studyHub')
      setActiveWordAssignment(assignment)
      setView('wordAssignment')
      return
    }
    setAssignmentReturnView(view === 'classroom' ? 'classroom' : 'studyHub')
    setActiveReadingAssignment(assignment)
    setSelectedReadingId(assignment.articleId)
    setView('readingSession')
  }

  const handleRetryReading = (attempt) => {
    setActiveReadingAssignment(null)
    setReadingRetry({ ...attempt, article: { ...attempt.article, questions: wrongReadingQuestions(attempt) } })
    setSelectedReadingId(attempt.article.id)
    setView('readingSession')
  }

  const handleSubmitReadingAssignment = async (answers) => {
    if (!activeReadingAssignment) throw new Error('作业信息已失效，请返回列表重试')
    const result = await submitReadingAssignment(activeReadingAssignment.id, answers, authUser?.id)
    setActiveReadingAssignment(result.assignment)
    recordReadingCompletion({ articleId: result.assignment.articleId,
      questionsAnswered: result.assignment.questionsAnswered,
      questionsCorrect: result.assignment.questionsCorrect, timeSpent: activeReadingAssignment.article.estimatedMinutes || 1 })
    return result.assignment
  }

  const handleOpenSuggestedReading = () => {
    if (suggestedReading?.id != null) {
      handleOpenReadingSession(suggestedReading.id)
      return
    }
    handleOpenReadingList()
  }

  const handleBackToStudyHub = () => {
    setAssessmentBackTarget('home')
    setView('studyHub')
  }

  const handleBackToReadingList = () => {
    if (activeReadingAssignment) {
      setActiveReadingAssignment(null)
      setActiveWordAssignment(null)
      setReadingRetry(null)
      setView(assignmentReturnView)
      return
    }
    handleOpenReadingList()
  }

  const handleOpenModeFromReading = (nextMode) => {
    if (nextMode === 'learn') handleStartPlanLearning()
    else handleStartExamPractice(nextMode, examScope, 'home')
  }

  const handleOpenModeFromHome = (nextMode) => {
    if (nextMode === 'learn') handleStartPlanLearning()
    else handleStartExamPractice(nextMode, examScope, 'home')
  }

  const handleOpenModeFromCollection = (nextMode) => {
    if (nextMode === 'learn') handleStartPlanLearning()
    else handleStartExamPractice(nextMode, examScope, 'home')
  }

  const handleLearningBack = () => {
    if (mode === 'learn' && assessmentBackTarget === 'studyHub') {
      handleBackToStudyHub()
      return
    }
    if (mode !== 'learn' && assessmentBackTarget === 'examPractice') {
      handleOpenExamPractice()
      return
    }

    handleBackToHome()
  }

  const markAsLearned = () => {
    if (currentWord?.id != null) {
      setWordAsLearned(currentWord.id)
    }
    nextCard()
  }

  const markAsMastered = () => {
    if (currentWord?.id != null) {
      setWordAsMastered(currentWord.id)
    }
    nextCard()
  }

  const markLearnedWordAsMastered = (wordId) => {
    setWordAsMastered(wordId)
  }

  const markMasteredWordAsLearned = (wordId) => {
    setWordAsLearned(wordId)
  }

  const nextCard = () => {
    if (shuffledWords.length === 0) return
    setCurrentIndex((prev) => (prev + 1) % shuffledWords.length)
  }

  const resetProgress = () => {
    resetLearningProgress()
    setCurrentIndex(0)
    const shuffled = [...filteredVocabulary].sort(() => Math.random() - 0.5)
    setShuffledWords(shuffled)
  }

  return {
    handleSelectExamScope, currentWord, selectedReading, handleBackToHome, handleOpenWordStudy, handleOpenReadingList,
    handleOpenTodayReview, handleOpenSavedWords, handleOpenWrongWords, handleOpenStatistics,
    handleOpenClassroom, handleOpenExamPractice, handleOpenPlanSettings, handleSelectPlanCategory,
    handleStartPlanLearning, handleStartExamPractice, handleOpenReadingSession, handleStartReadingAssignment,
    handleRetryReading, handleSubmitReadingAssignment, handleOpenSuggestedReading, handleBackToStudyHub,
    handleBackToReadingList, handleOpenModeFromReading, handleOpenModeFromHome, handleOpenModeFromCollection,
    handleLearningBack, markAsLearned, markAsMastered, markLearnedWordAsMastered, markMasteredWordAsLearned,
    resetProgress, ...vocabularyNavigation,
  }
}
