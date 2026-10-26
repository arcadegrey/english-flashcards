import { dedupeIdList, normalizeProgressState, mergeProgress, areProgressStatesEqual, serializeProgressState, rebaseProgress } from './utils/progressState.js'
import { createProgressSyncQueue } from './utils/progressSync.js'
import { prepareReadingContent, indexReadingVocabulary, applyReadingProgress } from './utils/readingLibrary.js'
import PageLoadBoundary from './components/PageLoadBoundary.jsx'
import { getStudyDateKey } from '../shared/studyDate.js'
import { useStudyDay } from './hooks/useStudyDay.js'
import { mergeVocabularyList } from './utils/vocabularyMerge.js'
import { WordBookmarksContext } from './context/word-bookmarks-context'
import { RETIRED_VOCABULARY, activeProgressIds } from '../shared/retiredVocabulary.js'
import { mergeWordBookmarks } from '../shared/wordBookmarks.js'
import { wrongReadingQuestions } from '../shared/readingAttempts.js'
import { submitReadingAssignment } from './utils/classroomApi'
import { normalizeStudyHistoryItem, normalizeStudyHistory, recordDailyExamAnswer, mergeLegacyPlanExamActivity } from '../shared/studyHistory.js'
import { getDailyPlanExamActivity } from '../shared/planActivity.js'
import { buildTomorrowPlan, needsPlanCatalog } from './utils/dailyPlan.js'
import { useState, useEffect, useMemo, useRef, useCallback, lazy, Suspense } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { useTheme } from './context/theme-context'
import {
  loadFullVocabulary,
  loadIeltsListVocabulary,
  loadIeltsManifest,
  loadToeflListVocabulary,
  loadToeflManifest,
  loadVocabulary,
} from './data/vocabulary'
import readings from './data/readings'
import categories from './data/categories'
import StudyHub from './components/StudyHub'
import AppLayout from './components/layout/AppLayout'
import ExamHistoryProvider from './context/ExamHistoryProvider'
import { getAccountRoleLabel } from './utils/classroom'
import { storage, WORD_BOOKMARKS_STORAGE_KEY } from './utils/storage'
import { getExamVocabulary, getPlanVocabulary, getPlanWordStats, normalizePlanCategory, recordPlanExamAnswer } from './utils/studyPlan'
import { buildWordLookup } from './utils/readingText'
import { calculateNextReview, getWordsForReview, initializeWordProgress } from './utils/spacedRepetition'
import { speak, stopSpeak } from './utils/speech'
import {
  getWordCategories,
  wordBelongsToCategory,
  getWordIeltsLists,
  wordHasIeltsCategory,
  wordHasToeflCategory,
} from './utils/wordCategories'
import {
  fetchCurrentUser,
  isCloudAuthConfigured,
  loadCloudProgress,
  refreshSession,
  signInWithEmail,
  signOut,
  signUpWithEmail,
  upsertCloudProgress,
} from './utils/workerAuth'

const WordAssignmentSession = lazy(() => import('./components/classroom/WordAssignmentSession'))
const HomeScreen = lazy(() => import('./components/HomeScreen'))
const LearningView = lazy(() => import('./components/LearningView'))
const Statistics = lazy(() => import('./components/Statistics'))
const WordCollectionView = lazy(() => import('./components/WordCollectionView'))
const ToeflSelectionView = lazy(() => import('./components/ToeflSelectionView'))
const ReadingSessionView = lazy(() => import('./components/ReadingSessionView'))
const ExamPracticeView = lazy(() => import('./components/ExamPracticeView'))
const PlanSettingsView = lazy(() => import('./components/PlanSettingsView'))
const AuthPanel = lazy(() => import('./components/AuthPanel'))
const ClassroomView = lazy(() => import('./components/ClassroomView'))
const VoiceSettings = lazy(() => import('./components/VoiceSettings'))

const TOEFL_UNKNOWN_LEVEL = 'unknown'
const TOEFL_UNKNOWN_LIST = 'unknown'
const IELTS_UNKNOWN_TOPIC = 'unknown'
const NAVIGATION_STATE_KEY = 'english_flashcards_navigation_v1'
const AUTH_TRANSITION_MIN_MS = 900
const preparedReadings = prepareReadingContent(readings)

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const toNumber = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0)

const uniqueStringList = (value) => {
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

const isBrowserOnline = () => typeof navigator === 'undefined' || navigator.onLine !== false

const getSyncStatusText = ({ authLoading, hasUser, syncState, lastSyncedAt }) => {
  if (authLoading) return '初始化中'
  if (!hasUser) return '未登录'
  if (syncState === 'syncing') return '同步中'
  if (syncState === 'pending') return '待同步'
  if (syncState === 'error') return '同步失败'
  if (syncState === 'synced' && lastSyncedAt) return `已同步 ${lastSyncedAt}`
  return '已连接'
}

const extractNumericTag = (value) => {
  const text = String(value ?? '').trim()
  if (!text) return null

  const match = text.match(/\d+/)
  if (!match) return null

  const parsed = Number(match[0])
  if (!Number.isFinite(parsed) || parsed <= 0) return null
  return parsed
}

const getToeflMeta = (word) => {
  if (!word || !wordHasToeflCategory(word)) {
    return { level: null, list: null }
  }

  const wordId = Number(word.id)
  let level = extractNumericTag(word.level)
  let list = extractNumericTag(word.list)

  // Backward compatibility for the previously imported 300 TOEFL words (id 501-800).
  if (!level && Number.isInteger(wordId) && wordId >= 501 && wordId <= 800) {
    level = 3
  }
  if (!list && level === 3 && Number.isInteger(wordId) && wordId >= 501 && wordId <= 800) {
    list = Math.ceil((wordId - 500) / 30)
  }

  return { level, list }
}

const matchesToeflLevel = (word, selectedLevel) => {
  const { level } = getToeflMeta(word)
  if (selectedLevel === TOEFL_UNKNOWN_LEVEL) {
    return level == null
  }
  return String(level) === String(selectedLevel)
}

const matchesToeflList = (word, selectedList) => {
  const { list } = getToeflMeta(word)
  if (selectedList === TOEFL_UNKNOWN_LIST) {
    return list == null
  }
  return String(list) === String(selectedList)
}

const getIeltsMeta = (word) => {
  if (!word || !wordHasIeltsCategory(word)) {
    return { lists: [] }
  }

  return { lists: getWordIeltsLists(word) }
}

const matchesIeltsList = (word, selectedList) => {
  const { lists } = getIeltsMeta(word)
  if (selectedList === TOEFL_UNKNOWN_LIST) {
    return lists.length === 0
  }
  return lists.some((list) => String(list) === String(selectedList))
}

const getIeltsTopicKey = (list) => {
  const numericList = Number(list)

  if (Number.isFinite(numericList)) {
    if (numericList >= 1 && numericList <= 4) return 'nature-geography'
    if (numericList >= 5 && numericList <= 6) return 'plant-research'
    if (numericList >= 7 && numericList <= 9) return 'animal-conservation'
    if (numericList === 10) return 'space-exploration'
    if (numericList >= 11 && numericList <= 17) return 'school-education'
    if (numericList >= 18 && numericList <= 19) return 'technology-invention'
    if (numericList === 20) return 'culture-history'
    if (numericList >= 21 && numericList <= 22) return 'language-evolution'
    if (numericList >= 23 && numericList <= 25) return 'entertainment-sports'
    if (numericList >= 26 && numericList <= 27) return 'objects-materials'
    if (numericList >= 28 && numericList <= 29) return 'fashion-trends'
    if (numericList >= 30 && numericList <= 32) return 'food-health'
    if (numericList >= 33 && numericList <= 35) return 'architecture-places'
    if (numericList >= 36 && numericList <= 37) return 'transport-travel'
    if (numericList >= 38 && numericList <= 40) return 'nation-government'
    if (numericList >= 41 && numericList <= 43) return 'society-economy'
    if (numericList >= 44 && numericList <= 45) return 'law-regulation'
    if (numericList >= 46 && numericList <= 47) return 'warfare-battlefield'
    if (numericList >= 48 && numericList <= 49) return 'warfare-battlefield'
    if (numericList === 50) return 'social-relationships'
    if (numericList >= 51 && numericList <= 56) return 'actions-behaviors'
  }

  return IELTS_UNKNOWN_TOPIC
}

const getIeltsTopicLabel = (topicKey) => {
  const labels = {
    'nature-geography': '自然地理',
    'plant-research': '植物研究',
    'animal-conservation': '动物保护',
    'space-exploration': '太空探索',
    'school-education': '学校教育',
    'technology-invention': '科技发明',
    'culture-history': '文化历史',
    'language-evolution': '语言演化',
    'entertainment-sports': '娱乐运动',
    'objects-materials': '物品材料',
    'fashion-trends': '时尚潮流',
    'food-health': '饮食健康',
    'architecture-places': '建筑场所',
    'transport-travel': '交通旅游',
    'nation-government': '国家政府',
    'society-economy': '社会经济',
    'law-regulation': '法律法规',
    'warfare-battlefield': '征战沙场',
    'social-relationships': '社会关系',
    'actions-behaviors': '行为动作',
    [IELTS_UNKNOWN_TOPIC]: '未分主题',
  }
  return labels[topicKey] || '未分主题'
}

const matchesIeltsTopic = (word, selectedTopic) => {
  const { lists } = getIeltsMeta(word)
  if (lists.length === 0) {
    return String(selectedTopic || IELTS_UNKNOWN_TOPIC) === IELTS_UNKNOWN_TOPIC
  }
  return lists.some((list) => getIeltsTopicKey(list) === String(selectedTopic || IELTS_UNKNOWN_TOPIC))
}

const sortNumericKeyWithUnknownLast = (a, b, unknownKey) => {
  if (a === unknownKey && b !== unknownKey) return 1
  if (b === unknownKey && a !== unknownKey) return -1

  const aNum = Number(a)
  const bNum = Number(b)
  if (Number.isFinite(aNum) && Number.isFinite(bNum)) {
    return aNum - bNum
  }
  return String(a).localeCompare(String(b))
}

function AppContent() {
  const studyDay = useStudyDay()
  const [initialLocalProgress] = useState(() => {
    try { return storage.switchLearningAccount(storage.getAuthSession()?.user?.id) }
    catch { return storage.getLearningSnapshot() }
  })
  const { isDark, toggleTheme } = useTheme()

  const [view, setView] = useState('studyHub')
  const [mode, setMode] = useState('learn')
  const [examScope, setExamScope] = useState('all')
  const [examPreparing, setExamPreparing] = useState(false)
  const [examPreparationError, setExamPreparationError] = useState(null)
  const examRequestRef = useRef(0)
  const fullVocabularyLoadedRef = useRef(false)
  const planRequestRef = useRef(0)
  const [studyPlanCategory, setStudyPlanCategory] = useState(() => storage.getStudyPlanCategory())
  const [planExamActivity, setPlanExamActivity] = useState(() => storage.getPlanExamActivity())
  const [planPreparing, setPlanPreparing] = useState(false)
  const [planPreparationError, setPlanPreparationError] = useState('')
  const [planPreparationAttempt, setPlanPreparationAttempt] = useState(0)
  const [assessmentBackTarget, setAssessmentBackTarget] = useState('home')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedToeflLevel, setSelectedToeflLevel] = useState('')
  const [selectedToeflList, setSelectedToeflList] = useState('')
  const [selectedIeltsTopic, setSelectedIeltsTopic] = useState('')
  const [selectedIeltsList, setSelectedIeltsList] = useState('')
  const [selectedReadingId, setSelectedReadingId] = useState(null)
  const [activeReadingAssignment, setActiveReadingAssignment] = useState(null)
  const [activeWordAssignment, setActiveWordAssignment] = useState(null)
  const [readingRetry, setReadingRetry] = useState(null)
  const [assignmentReturnView, setAssignmentReturnView] = useState('studyHub')
  const [homePanelRequest, setHomePanelRequest] = useState({ panel: '', nonce: 0 })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [learnedWords, setLearnedWords] = useState(initialLocalProgress.learnedWords)
  const [masteredWords, setMasteredWords] = useState(initialLocalProgress.masteredWords)
  const [wrongWords, setWrongWords] = useState(initialLocalProgress.wrongWords)
  const [wordBookmarks, setWordBookmarks] = useState(initialLocalProgress.preferences?.wordBookmarks || {})
  const [savedWordsLoading, setSavedWordsLoading] = useState(false)
  const [savedWordsError, setSavedWordsError] = useState('')
  const [wordProgress, setWordProgress] = useState(initialLocalProgress.wordProgress)
  const [studyHistory, setStudyHistory] = useState(() => mergeLegacyPlanExamActivity(initialLocalProgress.studyHistory, initialLocalProgress.planExamActivity))
  const [customWords, setCustomWords] = useState(initialLocalProgress.customWords)
  const [dailyNewWordTarget, setDailyNewWordTarget] = useState(() => storage.getDailyNewWordTarget())
  const [planPreferencesUpdatedAt, setPlanPreferencesUpdatedAt] = useState(() => storage.getPlanPreferencesUpdatedAt())
  const [vocabulary, setVocabulary] = useState([])
  const [vocabularyLoading, setVocabularyLoading] = useState(true)
  const [vocabularyError, setVocabularyError] = useState('')
  const [vocabularyReloadKey, setVocabularyReloadKey] = useState(0)
  const [toeflManifest, setToeflManifest] = useState(null)
  const [ieltsManifest, setIeltsManifest] = useState(null)
  const [shuffledWords, setShuffledWords] = useState([])
  const historyReadyRef = useRef(false)
  const restoringFromHistoryRef = useRef(false)
  const pendingStartWordIdRef = useRef(null)
  const loadingToeflListsRef = useRef(new Set())
  const loadingIeltsListsRef = useRef(new Set())
  const cloudEnabled = isCloudAuthConfigured()
  const [localDataLoaded, setLocalDataLoaded] = useState(false)
  const [authLoading, setAuthLoading] = useState(cloudEnabled)
  const [authUser, setAuthUser] = useState(null)
  const [authSession, setAuthSession] = useState(null)
  const [authError, setAuthError] = useState('')
  const [syncState, setSyncState] = useState('idle')
  const [syncError, setSyncError] = useState('')
  const [lastSyncedAt, setLastSyncedAt] = useState('')
  const authBootstrappedRef = useRef(false)
  const cloudHydratedRef = useRef(false)
  const cloudSyncTimerRef = useRef(null)
  const [progressSyncQueue] = useState(createProgressSyncQueue)
  const learningResetRef = useRef(0)
  const cloudProgressVersionRef = useRef('')
  const latestProgressRef = useRef(null)
  const lastSyncedProgressRef = useRef('')
  const progressDirtyRef = useRef(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const authModalRef = useRef(null)
  const [showVoiceSettings, setShowVoiceSettings] = useState(false)
  const [homeAccountNotice, setHomeAccountNotice] = useState(null)
  const [authTransition, setAuthTransition] = useState(null)
  const homeNoticeTimerRef = useRef(null)

  useEffect(() => {
    stopSpeak()
    return stopSpeak
  }, [view, mode, currentIndex, selectedReadingId, selectedCategory])

  useEffect(() => {
    if (!showAuthModal) return undefined
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    const modal = authModalRef.current
    const getFocusable = () => [...(modal?.querySelectorAll('button:not(:disabled), input:not(:disabled)') || [])]
      .filter((element) => element.getClientRects().length > 0)

    document.body.style.overflow = 'hidden'
    const initialFocus = getFocusable()[0] || modal
    initialFocus?.focus()

    const handleModalKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setShowAuthModal(false)
      }
      if (event.key !== 'Tab') return
      const focusable = getFocusable()
      const first = focusable[0]
      const last = focusable.at(-1)
      if (!first) return
      if (!modal?.contains(document.activeElement) || (event.shiftKey && document.activeElement === first)) {
        event.preventDefault()
        const target = event.shiftKey ? last : first
        target.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleModalKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleModalKey)
      if (previousFocus?.isConnected) previousFocus.focus()
    }
  }, [showAuthModal])

  useEffect(() => {
    const accountChanged = (event) => {
      if (event.key !== 'flashcards_auth_session') return
      let nextUserId
      try { nextUserId = JSON.parse(event.newValue || 'null')?.user?.id } catch { return }
      if (String(nextUserId || '') !== String(authUser?.id || '')) window.location.reload()
    }
    window.addEventListener('storage', accountChanged)
    return () => window.removeEventListener('storage', accountChanged)
  }, [authUser?.id])

  const allVocabulary = useMemo(() => [...vocabulary, ...customWords], [customWords, vocabulary])
  const vocabularyLookup = useMemo(() => buildWordLookup(allVocabulary), [allVocabulary])
  const masteredWordIdSet = useMemo(
    () => new Set(masteredWords.map((item) => String(item))),
    [masteredWords]
  )
  const indexedReadings = useMemo(() => indexReadingVocabulary(preparedReadings, vocabularyLookup), [vocabularyLookup])
  const readingLibrary = useMemo(() => applyReadingProgress(indexedReadings, masteredWordIdSet), [indexedReadings, masteredWordIdSet])

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
  latestProgressRef.current = currentProgress
  const selectedReading = useMemo(
    () => readingRetry?.article || activeReadingAssignment?.article || readingLibrary.find((item) => String(item.id) === String(selectedReadingId)) || null,
    [readingRetry, activeReadingAssignment, readingLibrary, selectedReadingId]
  )
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
      readingArticleIds: uniqueStringList(todayData.readingArticleIds),
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

  const wordCounts = useMemo(() => {
    const counts = { all: allVocabulary.length }
    allVocabulary.forEach((word) => {
      getWordCategories(word).forEach((categoryId) => {
        counts[categoryId] = (counts[categoryId] || 0) + 1
      })
    })
    if (toeflManifest?.toefl?.total) {
      counts.toefl = Number(toeflManifest.toefl.total) || counts.toefl || 0
    }
    if (ieltsManifest?.ielts?.total) {
      counts.ielts = Number(ieltsManifest.ielts.total) || counts.ielts || 0
    }
    counts.all = Number(toeflManifest?.sourceTotal) || Number(ieltsManifest?.sourceTotal) || allVocabulary.length
    return counts
  }, [allVocabulary, ieltsManifest, toeflManifest])

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
  const planNeedsCatalog = useMemo(() => needsPlanCatalog(allVocabulary,
    activeProgressIds([...learnedWords, ...masteredWords, ...Object.keys(wordProgress)]), studyPlanCategory),
    [allVocabulary, learnedWords, masteredWords, wordProgress, studyPlanCategory])
  const planExamStats = getDailyPlanExamActivity({ ...todayStudyStats, date: studyDay }, studyPlanCategory, planExamActivity)
  const planTodayWordsLearned = studyPlanCategory === 'all'
    ? todayStudyStats.wordsLearned + todayStudyStats.wordsMastered : planWordStats.todayStudied
  const planTodayExamAnswered = planExamStats.answered
  const planTodayExamCorrect = planExamStats.correct
  const planLearnedCount = useMemo(() => getExamVocabulary(allVocabulary, { category: studyPlanCategory, scope: 'learned', learnedWords }).length,
    [allVocabulary, studyPlanCategory, learnedWords])
  const planMasteredCount = useMemo(() => getExamVocabulary(allVocabulary, { category: studyPlanCategory, scope: 'mastered', masteredWords }).length,
    [allVocabulary, studyPlanCategory, masteredWords])

  const filteredVocabulary = useMemo(() => {
    if (selectedCategory === 'all') {
      return allVocabulary
    }

    let filtered = allVocabulary.filter((word) => wordBelongsToCategory(word, selectedCategory))
    if (selectedCategory === 'ielts') {
      if (selectedIeltsTopic) {
        filtered = filtered.filter((word) => matchesIeltsTopic(word, selectedIeltsTopic))
      }
      if (selectedIeltsList) {
        filtered = filtered.filter((word) => matchesIeltsList(word, selectedIeltsList))
      }
      return filtered
    }

    if (selectedCategory !== 'toefl') {
      return filtered
    }

    if (selectedToeflLevel) {
      filtered = filtered.filter((word) => matchesToeflLevel(word, selectedToeflLevel))
    }

    if (selectedToeflList) {
      filtered = filtered.filter((word) => matchesToeflList(word, selectedToeflList))
    }

    return filtered
  }, [allVocabulary, selectedCategory, selectedIeltsList, selectedIeltsTopic, selectedToeflLevel, selectedToeflList])

  const toeflGrouping = useMemo(() => {
    if (toeflManifest?.toefl?.levels?.length) {
      const levels = toeflManifest.toefl.levels
        .map((entry) => ({
          key: String(entry.key),
          label: entry.label || (String(entry.key) === TOEFL_UNKNOWN_LEVEL ? '未分级' : `Level ${entry.key}`),
          count: Number(entry.count) || 0,
          meta: entry.meta || `${entry.lists?.length || 0} 个 List`,
        }))
        .sort((a, b) => sortNumericKeyWithUnknownLast(a.key, b.key, TOEFL_UNKNOWN_LEVEL))

      const listsByLevel = {}
      toeflManifest.toefl.levels.forEach((entry) => {
        listsByLevel[String(entry.key)] = (entry.lists || [])
          .map((item) => ({
            key: String(item.key),
            label: item.label || (String(item.key) === TOEFL_UNKNOWN_LIST ? '未分 List' : `List ${item.key}`),
            count: Number(item.count) || 0,
            path: item.path,
          }))
          .sort((a, b) => sortNumericKeyWithUnknownLast(a.key, b.key, TOEFL_UNKNOWN_LIST))
      })

      return {
        total: Number(toeflManifest.toefl.total) || levels.reduce((sum, item) => sum + item.count, 0),
        levels,
        listsByLevel,
      }
    }

    const levelBuckets = new Map()

    allVocabulary.forEach((word) => {
      if (!wordHasToeflCategory(word)) return

      const { level, list } = getToeflMeta(word)
      const levelKey = level ? String(level) : TOEFL_UNKNOWN_LEVEL
      const listKey = list ? String(list) : TOEFL_UNKNOWN_LIST

      if (!levelBuckets.has(levelKey)) {
        levelBuckets.set(levelKey, {
          key: levelKey,
          count: 0,
          lists: new Map(),
        })
      }

      const levelEntry = levelBuckets.get(levelKey)
      levelEntry.count += 1
      levelEntry.lists.set(listKey, (levelEntry.lists.get(listKey) || 0) + 1)
    })

    const levels = Array.from(levelBuckets.values())
      .map((entry) => ({
        key: entry.key,
        label: entry.key === TOEFL_UNKNOWN_LEVEL ? '未分级' : `Level ${entry.key}`,
        count: entry.count,
        meta: `${entry.lists.size} 个 List`,
      }))
      .sort((a, b) => sortNumericKeyWithUnknownLast(a.key, b.key, TOEFL_UNKNOWN_LEVEL))

    const listsByLevel = {}
    levelBuckets.forEach((entry, levelKey) => {
      listsByLevel[levelKey] = Array.from(entry.lists.entries())
        .map(([listKey, count]) => ({
          key: listKey,
          label: listKey === TOEFL_UNKNOWN_LIST ? '未分 List' : `List ${listKey}`,
          count,
        }))
        .sort((a, b) => sortNumericKeyWithUnknownLast(a.key, b.key, TOEFL_UNKNOWN_LIST))
    })

    return {
      total: levels.reduce((sum, item) => sum + item.count, 0),
      levels,
      listsByLevel,
    }
  }, [allVocabulary, toeflManifest])

  const toeflListsForSelectedLevel = useMemo(() => {
    if (!selectedToeflLevel) {
      return []
    }
    return toeflGrouping.listsByLevel[selectedToeflLevel] || []
  }, [selectedToeflLevel, toeflGrouping.listsByLevel])

  const ieltsGrouping = useMemo(() => {
    if (ieltsManifest?.ielts?.lists?.length) {
      const manifestTopics = Array.isArray(ieltsManifest.ielts.topics) ? ieltsManifest.ielts.topics : []
      const lists = ieltsManifest.ielts.lists
        .map((item) => ({
          key: String(item.key),
          label: item.label || (String(item.key) === TOEFL_UNKNOWN_LIST ? '未分 List' : `List ${item.key}`),
          count: Number(item.count) || 0,
          path: item.path,
          topicKey: String(item.topicKey || getIeltsTopicKey(item.key)),
          topicLabel: item.topicLabel,
        }))
        .sort((a, b) => sortNumericKeyWithUnknownLast(a.key, b.key, TOEFL_UNKNOWN_LIST))

      const listsByTopic = {}
      const topics =
        manifestTopics.length > 0
          ? manifestTopics
              .map((topic) => ({
                key: String(topic.key),
                label: topic.label || (String(topic.key) === IELTS_UNKNOWN_TOPIC ? '未分主题' : String(topic.key)),
                count: Number(topic.count) || 0,
                meta: topic.meta || `${topic.lists?.length || 0} 个 List`,
              }))
          : []

      if (manifestTopics.length > 0) {
        manifestTopics.forEach((topic) => {
          listsByTopic[String(topic.key)] = (topic.lists || [])
            .map((item) => ({
              key: String(item.key),
              label: item.label || (String(item.key) === TOEFL_UNKNOWN_LIST ? '未分 List' : `List ${item.key}`),
              count: Number(item.count) || 0,
              path: item.path,
              topicKey: String(topic.key),
            }))
            .sort((a, b) => sortNumericKeyWithUnknownLast(a.key, b.key, TOEFL_UNKNOWN_LIST))
        })
      } else {
        lists.forEach((item) => {
          const topicKey = item.topicKey
          if (!listsByTopic[topicKey]) listsByTopic[topicKey] = []
          listsByTopic[topicKey].push(item)
        })
        Object.entries(listsByTopic).forEach(([topicKey, topicLists]) => {
          topics.push({
            key: topicKey,
            label: topicKey === IELTS_UNKNOWN_TOPIC ? '未分主题' : topicLists[0]?.topicLabel || getIeltsTopicLabel(topicKey),
            count: topicLists.reduce((sum, item) => sum + item.count, 0),
            meta: `${topicLists.length} 个 List`,
          })
        })
      }

      return {
        total: Number(ieltsManifest.ielts.total) || lists.reduce((sum, item) => sum + item.count, 0),
        topics,
        listsByTopic,
        lists,
      }
    }

    const listBuckets = new Map()
    allVocabulary.forEach((word) => {
      if (!wordHasIeltsCategory(word)) return
      const { list } = getIeltsMeta(word)
      const listKey = list ? String(list) : TOEFL_UNKNOWN_LIST
      listBuckets.set(listKey, (listBuckets.get(listKey) || 0) + 1)
    })

    const lists = Array.from(listBuckets.entries())
      .map(([listKey, count]) => ({
        key: listKey,
        label: listKey === TOEFL_UNKNOWN_LIST ? '未分 List' : `List ${listKey}`,
        count,
      }))
      .sort((a, b) => sortNumericKeyWithUnknownLast(a.key, b.key, TOEFL_UNKNOWN_LIST))

    const topicBuckets = new Map()
    lists.forEach((item) => {
      const topicKey = getIeltsTopicKey(item.key)
      if (!topicBuckets.has(topicKey)) {
        topicBuckets.set(topicKey, {
          key: topicKey,
          label: getIeltsTopicLabel(topicKey),
          count: 0,
          lists: [],
        })
      }
      const topic = topicBuckets.get(topicKey)
      topic.count += item.count
      topic.lists.push(item)
    })

    const topics = Array.from(topicBuckets.values()).map((topic) => ({
      key: topic.key,
      label: topic.label,
      count: topic.count,
      meta: `${topic.lists.length} 个 List`,
    }))
    const listsByTopic = {}
    topicBuckets.forEach((topic) => {
      listsByTopic[topic.key] = topic.lists
    })

    return {
      total: lists.reduce((sum, item) => sum + item.count, 0),
      topics,
      listsByTopic,
      lists,
    }
  }, [allVocabulary, ieltsManifest])

  const ieltsListsForSelectedTopic = useMemo(() => {
    if (!selectedIeltsTopic) {
      return []
    }
    return ieltsGrouping.listsByTopic[selectedIeltsTopic] || []
  }, [ieltsGrouping.listsByTopic, selectedIeltsTopic])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setVocabularyLoading(true)
      setVocabularyError('')

      try {
        const loadedVocabulary = await loadVocabulary()
        if (cancelled) return
        setVocabulary(loadedVocabulary)
        fullVocabularyLoadedRef.current = false
      } catch (error) {
        if (cancelled) return
        setVocabulary([])
        setToeflManifest(null)
        setIeltsManifest(null)
        setVocabularyError(error?.message || '词库加载失败')
      } finally {
        if (!cancelled) {
          setVocabularyLoading(false)
        }
      }
    }

    load()
    // Optional list directories must not hold the entire app behind a loading screen.
    loadToeflManifest().then((manifest) => {
      if (!cancelled) setToeflManifest(manifest)
    }).catch(() => {})
    loadIeltsManifest().then((manifest) => {
      if (!cancelled) setIeltsManifest(manifest)
    }).catch(() => {})

    return () => {
      cancelled = true
    }
  }, [vocabularyReloadKey])

  useEffect(() => () => {
    // Ignore a late response after the user leaves the test picker.
    examRequestRef.current += 1
    planRequestRef.current += 1
    setExamPreparing(false)
  }, [view])

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
        const words = await loadFullVocabulary()
        if (cancelled) return
        if (!fullVocabularyLoadedRef.current) setVocabulary((prev) => mergeVocabularyList(prev, words))
        fullVocabularyLoadedRef.current = true
      } catch (error) {
        if (!cancelled) setPlanPreparationError(error?.message || '计划词库加载失败，请重试')
      } finally {
        if (!cancelled) setPlanPreparing(false)
      }
    }
    preparePlan()
    return () => { cancelled = true }
  }, [planNeedsCatalog, studyPlanCategory, vocabularyLoading, view, planPreparationAttempt])

  useEffect(() => {
    storage.setPlanExamActivity(planExamActivity)
  }, [planExamActivity])

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
  }, [filteredVocabulary])

  useEffect(() => {
    const savedLearned = storage.getLearnedWords()
    const savedMastered = storage.getMasteredWords()
    const savedCustomWords = storage.getCustomWords()
    const savedWrongWords = storage.getWrongWords()
    const savedWordProgress = storage.getWordProgress()
    const savedStudyHistory = storage.getStudyHistory()

    setWordBookmarks(storage.getWordBookmarks())
    setLearnedWords(savedLearned)
    setMasteredWords(savedMastered)
    setCustomWords(Array.isArray(savedCustomWords) ? savedCustomWords : [])
    setWrongWords(Array.isArray(savedWrongWords) ? savedWrongWords : [])
    setWordProgress(savedWordProgress && typeof savedWordProgress === 'object' ? savedWordProgress : {})
    setStudyHistory(mergeLegacyPlanExamActivity(Array.isArray(savedStudyHistory) ? savedStudyHistory : [], storage.getPlanExamActivity()))
    setLocalDataLoaded(true)
  }, [])

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

  useEffect(() => {
    return () => {
      if (cloudSyncTimerRef.current) {
        clearTimeout(cloudSyncTimerRef.current)
      }
      if (homeNoticeTimerRef.current) {
        clearTimeout(homeNoticeTimerRef.current)
      }
    }
  }, [])

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

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== WORD_BOOKMARKS_STORAGE_KEY || String(storage.getLearningOwner()) !== String(authUser?.id || 'guest')) return
      setWordBookmarks((current) => mergeWordBookmarks(current, storage.getWordBookmarks()))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [authUser?.id])

  const pushProgressToCloud = useCallback(async (session, user, progress, options = {}) => {
    if (!cloudEnabled || !session?.access_token || !user?.id) return ''

    if (!isBrowserOnline()) {
      progressDirtyRef.current = true
      setSyncState('pending')
      setSyncError('网络恢复后将自动同步')
      if (options.requireOnline) {
        throw new Error('当前网络不可用，恢复后将自动同步。')
      }
      return ''
    }

    const requestedVersion = cloudProgressVersionRef.current
    return progressSyncQueue.enqueue(async (isCurrent) => {
      if (String(storage.getAuthSession()?.user?.id) !== String(user.id)) return ''
      const resetAtStart = learningResetRef.current
      const progressToSync = normalizeProgressState(latestProgressRef.current || progress || {})
      if (String(storage.getLearningOwner()) === String(user.id)) {
        progressToSync.studyHistory = mergeLegacyPlanExamActivity(progressToSync.studyHistory, storage.getPlanExamActivity())
      }

      setSyncState('syncing')
      setSyncError('')

      let syncResult
      try {
        syncResult = await upsertCloudProgress({
          progress: progressToSync,
          expectedUserId: user.id,
          baseUpdatedAt:
            typeof options.baseUpdatedAt === 'string' && requestedVersion === cloudProgressVersionRef.current
              ? options.baseUpdatedAt
              : cloudProgressVersionRef.current,
        })
      } catch (error) {
        if (!isCurrent() || String(storage.getAuthSession()?.user?.id) !== String(user.id)) return ''
        progressDirtyRef.current = true
        setSyncState('error')
        setSyncError(error?.message || '同步失败，请重试')
        throw error
      }
      if (!isCurrent() || String(storage.getAuthSession()?.user?.id) !== String(user.id)) return ''
      const syncedAtIso = syncResult?.updatedAt || new Date().toISOString()
      cloudProgressVersionRef.current = syncedAtIso

      const syncedProgress = normalizeProgressState(syncResult?.progress || progressToSync)
      const rebased = rebaseProgress(progressToSync, latestProgressRef.current || progressToSync, syncedProgress,
        { resetLearning: learningResetRef.current !== resetAtStart })
      if (!areProgressStatesEqual(latestProgressRef.current, rebased)) {
        applyMergedProgress(rebased)
      }

      const syncedAtText = new Date(syncedAtIso).toLocaleString('zh-CN', {
        hour12: false,
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })

      const syncedSnapshot = serializeProgressState(syncedProgress)
      const latestSnapshot = serializeProgressState(latestProgressRef.current || progressToSync)
      lastSyncedProgressRef.current = syncedSnapshot

      if (latestSnapshot === syncedSnapshot) {
        progressDirtyRef.current = false
        setSyncState('synced')
        setSyncError('')
      } else {
        progressDirtyRef.current = true
        setSyncState('pending')
        setSyncError('')
      }

      setLastSyncedAt(syncedAtText)
      return syncedAtText
    })
  }, [applyMergedProgress, cloudEnabled, progressSyncQueue])

  const hydrateFromCloud = useCallback(async ({ session, user, localProgress }) => {
    if (!cloudEnabled || !session?.access_token || !user?.id) return

    const hydrated = await progressSyncQueue.enqueue(async (isCurrent) => {
      if (String(storage.getAuthSession()?.user?.id) !== String(user.id)) return null
      const localAtStart = normalizeProgressState(latestProgressRef.current || localProgress || {})
      const resetAtStart = learningResetRef.current
      const { progress: cloudProgress, updatedAt } = await loadCloudProgress(user.id)
      if (!isCurrent() || String(storage.getAuthSession()?.user?.id) !== String(user.id)) return null

      const merged = rebaseProgress(localAtStart, latestProgressRef.current || localAtStart, mergeProgress(localAtStart, cloudProgress),
        { resetLearning: learningResetRef.current !== resetAtStart })
      if (String(storage.getLearningOwner()) === String(user.id)) {
        merged.studyHistory = mergeLegacyPlanExamActivity(merged.studyHistory, storage.getPlanExamActivity())
      }
      merged.preferences.wordBookmarks = mergeWordBookmarks(merged.preferences.wordBookmarks, storage.getWordBookmarks())

      applyMergedProgress(merged)
      cloudProgressVersionRef.current = updatedAt
      cloudHydratedRef.current = true
      return isCurrent
    })
    if (hydrated?.()) await pushProgressToCloud(session, user, latestProgressRef.current)

  }, [
    applyMergedProgress,
    cloudEnabled,
    pushProgressToCloud,
    progressSyncQueue,
  ])

  const ensureFreshSession = useCallback(async (session) => {
    if (!session?.access_token) return null

    const now = Math.floor(Date.now() / 1000)
    const expiresAt = Number(session.expires_at || 0)
    if (expiresAt && expiresAt - now > 60) {
      return session
    }

    const refreshed = await refreshSession()
    return refreshed.session
  }, [])

  useEffect(() => {
    if (!localDataLoaded || authBootstrappedRef.current) {
      return
    }

    authBootstrappedRef.current = true
    if (!cloudEnabled) {
      setAuthLoading(false)
      return
    }

    const bootstrap = async () => {
      setAuthLoading(true)
      setAuthError('')
      const savedSession = storage.getAuthSession()
      if (!savedSession) {
        setAuthLoading(false)
        setSyncState('idle')
        cloudProgressVersionRef.current = ''
        return
      }

      try {
        const activeSession = await ensureFreshSession(savedSession)
        if (!activeSession) {
          throw new Error('登录已过期，请重新登录。')
        }

        const user = await fetchCurrentUser()
        const verifiedSession = { ...activeSession, user }
        const localProgress = String(storage.getLearningOwner()) === String(user.id)
          ? latestProgressRef.current : storage.switchLearningAccount(user.id, latestProgressRef.current)
        applyMergedProgress(localProgress)
        latestProgressRef.current = localProgress
        storage.setAuthSession(verifiedSession)
        setAuthSession(verifiedSession)
        setAuthUser(user)
        await hydrateFromCloud({ session: verifiedSession, user, localProgress })
      } catch (error) {
        if (error.status !== 401 && savedSession.user?.id) {
          // Cached identity only scopes local drafts; server permissions still use the cookie.
          setAuthSession(savedSession)
          setAuthUser(savedSession.user)
          setSyncState('pending')
          setSyncError('云端暂不可用，本机学习记录已保留，请重试同步。')
        } else {
          try {
            const guestProgress = storage.switchLearningAccount(null, latestProgressRef.current)
            applyMergedProgress(guestProgress)
            latestProgressRef.current = guestProgress
            setPlanExamActivity(guestProgress.planExamActivity || {})
          } catch { /* Preserve the existing cache if browser storage is unavailable. */ }
          storage.clearAuthSession()
          setAuthSession(null)
          setAuthUser(null)
          setAuthError(error?.message || '恢复登录失败')
          setSyncState('error')
          setSyncError(error?.message || '恢复登录失败')
          cloudProgressVersionRef.current = ''
        }
      } finally {
        setAuthLoading(false)
      }
    }

    bootstrap()
  }, [applyMergedProgress, cloudEnabled, ensureFreshSession, hydrateFromCloud, localDataLoaded])

  const flushCloudProgress = useCallback(() => {
    if (!cloudEnabled || authLoading || !cloudHydratedRef.current) {
      return Promise.resolve('')
    }

    if (!authSession?.access_token || !authUser?.id) {
      return Promise.resolve('')
    }

    const progress = latestProgressRef.current || currentProgress
    const progressSnapshot = serializeProgressState(progress)
    if (!progressDirtyRef.current && progressSnapshot === lastSyncedProgressRef.current) {
      return Promise.resolve('')
    }

    if (!isBrowserOnline()) {
      progressDirtyRef.current = true
      setSyncState('pending')
      setSyncError('网络恢复后将自动同步')
      return Promise.resolve('')
    }

    if (cloudSyncTimerRef.current) {
      clearTimeout(cloudSyncTimerRef.current)
      cloudSyncTimerRef.current = null
    }

    return pushProgressToCloud(authSession, authUser, progress).catch((error) => {
      progressDirtyRef.current = true
      setSyncState('error')
      setSyncError(error?.message || '自动同步失败')
      throw error
    })
  }, [authLoading, authSession, authUser, cloudEnabled, currentProgress, pushProgressToCloud])

  useEffect(() => {
    if (!cloudEnabled || authLoading || !cloudHydratedRef.current) {
      return
    }

    if (!authSession?.access_token || !authUser?.id) {
      return
    }

    const progressSnapshot = serializeProgressState(currentProgress)
    if (!progressDirtyRef.current && progressSnapshot === lastSyncedProgressRef.current) {
      return
    }

    progressDirtyRef.current = true

    if (!isBrowserOnline()) {
      setSyncState('pending')
      setSyncError('网络恢复后将自动同步')
      return
    }

    setSyncState((previousState) => (previousState === 'syncing' ? previousState : 'pending'))
    setSyncError('')

    if (cloudSyncTimerRef.current) {
      clearTimeout(cloudSyncTimerRef.current)
    }

    cloudSyncTimerRef.current = setTimeout(() => {
      flushCloudProgress().catch(() => {
        // Error state is set inside flushCloudProgress.
      })
    }, 1200)

    return () => {
      if (cloudSyncTimerRef.current) {
        clearTimeout(cloudSyncTimerRef.current)
      }
    }
  }, [
    authLoading,
    authSession,
    authUser,
    cloudEnabled,
    currentProgress,
    flushCloudProgress,
  ])

  useEffect(() => {
    if (!cloudEnabled) return undefined

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushCloudProgress().catch(() => {})
      }
    }

    const handlePageHide = () => {
      flushCloudProgress().catch(() => {})
    }

    const handleOnline = () => {
      if (progressDirtyRef.current) {
        setSyncState('pending')
        setSyncError('')
      }
      const operation = !cloudHydratedRef.current && authSession?.access_token && authUser?.id
        ? hydrateFromCloud({ session: authSession, user: authUser }) : flushCloudProgress()
      operation.catch((error) => { setSyncState('error'); setSyncError(error.message || '同步失败，请重试') })
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('pagehide', handlePageHide)
    window.addEventListener('online', handleOnline)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('pagehide', handlePageHide)
      window.removeEventListener('online', handleOnline)
    }
  }, [authSession, authUser, cloudEnabled, flushCloudProgress, hydrateFromCloud])

  const beginProgressSession = () => {
    progressSyncQueue.invalidate()
    cloudHydratedRef.current = false
    cloudProgressVersionRef.current = ''
    lastSyncedProgressRef.current = ''
    progressDirtyRef.current = false
  }

  const handleAuthLogin = async ({ email, password, verificationCode }) => {
    if (!cloudEnabled) {
      throw new Error('云端账号服务未配置')
    }

    setAuthError('')
    const shouldShowTransition = Boolean(String(verificationCode || password || '').trim())
    let transitionStartedAt = 0

    if (shouldShowTransition) {
      transitionStartedAt = Date.now()
      setAuthTransition({
        mode: 'login',
        title: '正在登录',
        detail: '正在同步你的学习进度',
      })
    }

    try {
      const { session, user, pendingVerification, message } = await signInWithEmail({
        email,
        password,
        verificationCode,
      })
      if (!session || pendingVerification) {
        return {
          message: message || '登录验证码已发送，请输入验证码完成登录。',
          sessionReady: false,
        }
      }
      beginProgressSession()
      const guestProgress = storage.getLearningOwner() === 'guest' ? latestProgressRef.current : null
      const accountProgress = storage.switchLearningAccount(user.id, latestProgressRef.current)
      const localProgress = guestProgress ? mergeProgress(guestProgress, accountProgress) : accountProgress
      applyMergedProgress(localProgress)
      latestProgressRef.current = localProgress
      setPlanExamActivity(accountProgress.planExamActivity || {})
      storage.setAuthSession(session)
      setAuthSession(session)
      setAuthUser(user)
      await hydrateFromCloud({ session, user, localProgress })
      return { message: message || '登录成功，进度已同步。', sessionReady: true }
    } finally {
      if (shouldShowTransition) {
        const elapsed = Date.now() - transitionStartedAt
        if (elapsed < AUTH_TRANSITION_MIN_MS) {
          await wait(AUTH_TRANSITION_MIN_MS - elapsed)
        }
        setAuthTransition(null)
      }
    }
  }

  const handleAuthRegister = async ({ email, verificationCode, role, displayName }) => {
    if (!cloudEnabled) {
      throw new Error('云端账号服务未配置')
    }

    setAuthError('')
    const shouldShowTransition = Boolean(String(verificationCode || '').trim())
    let transitionStartedAt = 0

    if (shouldShowTransition) {
      transitionStartedAt = Date.now()
      setAuthTransition({
        mode: 'register',
        title: '正在创建账号',
        detail: '正在准备你的学习空间',
      })
    }

    try {
      const { session, user, emailConfirmationRequired, message } = await signUpWithEmail({
        email,
        verificationCode,
        role,
        displayName,
      })
      if (!session) {
        return {
          message:
            message ||
            (emailConfirmationRequired
              ? '验证码已发送，请输入验证码完成注册。'
              : '注册成功，请登录。'),
          sessionReady: false,
        }
      }

      const accountUser = user || session.user
      beginProgressSession()
      const guestProgress = storage.getLearningOwner() === 'guest' ? latestProgressRef.current : null
      const accountProgress = storage.switchLearningAccount(accountUser.id, latestProgressRef.current)
      const localProgress = guestProgress ? mergeProgress(guestProgress, accountProgress) : accountProgress
      applyMergedProgress(localProgress)
      latestProgressRef.current = localProgress
      setPlanExamActivity(accountProgress.planExamActivity || {})
      storage.setAuthSession(session)
      setAuthSession(session)
      setAuthUser(accountUser)
      await hydrateFromCloud({ session, user: accountUser, localProgress })
      return { message: message || '注册并登录成功，进度已同步。', sessionReady: true }
    } finally {
      if (shouldShowTransition) {
        const elapsed = Date.now() - transitionStartedAt
        if (elapsed < AUTH_TRANSITION_MIN_MS) {
          await wait(AUTH_TRANSITION_MIN_MS - elapsed)
        }
        setAuthTransition(null)
      }
    }
  }

  const handleAuthLogout = async ({ allDevices = false } = {}) => {
    if (authSession?.access_token && authUser?.id) {
      try {
        await flushCloudProgress()
      } catch {
        // Sign-out should still work if the final best-effort sync fails.
      }
    }

    if (authSession?.access_token) {
      // Do not report remote revocation as successful when the request failed.
      await signOut({ allDevices, expectedUserId: authUser?.id })
    }

    beginProgressSession()
    const guestProgress = storage.switchLearningAccount(null, latestProgressRef.current)
    applyMergedProgress(guestProgress)
    latestProgressRef.current = guestProgress
    setPlanExamActivity(guestProgress.planExamActivity || {})
    setActiveReadingAssignment(null)
    setActiveWordAssignment(null)
    setReadingRetry(null)
    setView('studyHub')
    storage.clearAuthSession()
    setAuthSession(null)
    setAuthUser(null)
    setAuthError('')
    setSyncState('idle')
    setSyncError('')
    setLastSyncedAt('')
    cloudProgressVersionRef.current = ''
    cloudHydratedRef.current = false
    lastSyncedProgressRef.current = ''
    progressDirtyRef.current = false
  }

  const handleManualSync = async () => {
    if (!authSession?.access_token || !authUser?.id) {
      throw new Error('请先登录账号')
    }

    if (!cloudHydratedRef.current) {
      try { await hydrateFromCloud({ session: authSession, user: authUser }) }
      catch (error) { setSyncState('error'); setSyncError(error.message || '同步失败，请重试'); throw error }
      return { message: '云端进度已恢复并同步。' }
    }

    const syncedAtText = await pushProgressToCloud(
      authSession,
      authUser,
      latestProgressRef.current || currentProgress,
      { requireOnline: true }
    )
    return { message: syncedAtText ? `同步完成（${syncedAtText}）` : '同步完成。' }
  }

  const showNotice = (message, type = 'info') => {
    if (!message) return
    setHomeAccountNotice({ message, type })
    if (homeNoticeTimerRef.current) {
      clearTimeout(homeNoticeTimerRef.current)
    }
    homeNoticeTimerRef.current = setTimeout(() => {
      setHomeAccountNotice(null)
    }, 3200)
  }

  const handleHomeSync = async () => {
    if (!cloudEnabled) {
      showNotice('未配置云端账号服务，暂时无法同步账号。', 'error')
      return { ok: false, message: '未配置云端账号服务，暂时无法同步账号。' }
    }

    if (authLoading) {
      showNotice('账号初始化中，请稍后再试。', 'info')
      return { ok: false, message: '账号初始化中，请稍后再试。' }
    }

    if (!authUser?.id) {
      setShowAuthModal(true)
      showNotice('请先登录账号，再执行同步。', 'error')
      return { ok: false, message: '请先登录账号，再执行同步。' }
    }

    try {
      const result = await handleManualSync()
      showNotice(result?.message || '同步完成。', 'success')
      return { ok: true, message: result?.message || '同步完成。' }
    } catch (error) {
      const message = error?.message || '同步失败，请稍后重试。'
      showNotice(message, 'error')
      return { ok: false, message }
    }
  }

  const handleModalLogin = async (payload) => {
    const result = await handleAuthLogin(payload)
    if (result?.sessionReady) {
      setShowAuthModal(false)
      showNotice(result?.message || '登录成功，进度已同步。', 'success')
    } else {
      showNotice(result?.message || '验证码已发送，请输入后完成登录。', 'info')
    }
    return result
  }

  const handleModalRegister = async (payload) => {
    const result = await handleAuthRegister(payload)
    if (result?.sessionReady) {
      setShowAuthModal(false)
      showNotice(result?.message || '注册并登录成功，进度已同步。', 'success')
    }
    return result
  }

  const handleModalLogout = async (options = {}) => {
    await handleAuthLogout(options)
    showNotice(options.allDevices ? '已退出全部设备。' : '已退出当前设备。', 'info')
  }

  const handleModalSyncNow = async () => {
    const result = await handleManualSync()
    showNotice(result?.message || '同步完成。', 'success')
    return result
  }

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const initialState = {
      __appNavigation: NAVIGATION_STATE_KEY,
      view: 'studyHub',
      mode: 'learn',
      selectedCategory: 'all',
      selectedToeflLevel: '',
      selectedToeflList: '',
      selectedIeltsTopic: '',
      selectedIeltsList: '',
      selectedReadingId: null,
    }

    window.history.replaceState(initialState, '', window.location.href)
    historyReadyRef.current = true

    const handlePopState = (event) => {
      const state = event.state
      restoringFromHistoryRef.current = true

      if (!state || state.__appNavigation !== NAVIGATION_STATE_KEY) {
        setView('studyHub')
        setMode('learn')
        setSelectedCategory('all')
        setSelectedToeflLevel('')
        setSelectedToeflList('')
        setSelectedIeltsTopic('')
        setSelectedIeltsList('')
        setSelectedReadingId(null)
        return
      }

      setActiveReadingAssignment(null)
      setActiveWordAssignment(null)
      setReadingRetry(null)
      const restoredView = typeof state.view === 'string' ? state.view : 'studyHub'
      if (restoredView === 'readingList') {
        setHomePanelRequest((request) => ({ panel: 'reading', nonce: request.nonce + 1 }))
        setView('home')
      } else {
        setView(restoredView)
      }
      setMode(typeof state.mode === 'string' ? state.mode : 'learn')
      setSelectedCategory(typeof state.selectedCategory === 'string' ? state.selectedCategory : 'all')
      setSelectedToeflLevel(
        typeof state.selectedToeflLevel === 'string' ? state.selectedToeflLevel : ''
      )
      setSelectedToeflList(typeof state.selectedToeflList === 'string' ? state.selectedToeflList : '')
      setSelectedIeltsTopic(typeof state.selectedIeltsTopic === 'string' ? state.selectedIeltsTopic : '')
      setSelectedIeltsList(typeof state.selectedIeltsList === 'string' ? state.selectedIeltsList : '')
      setSelectedReadingId(state.selectedReadingId ?? null)
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !historyReadyRef.current) return

    const nextState = {
      __appNavigation: NAVIGATION_STATE_KEY,
      view,
      mode,
      selectedCategory,
      selectedToeflLevel,
      selectedToeflList,
      selectedIeltsTopic,
      selectedIeltsList,
      selectedReadingId,
    }

    if (restoringFromHistoryRef.current) {
      restoringFromHistoryRef.current = false

      const currentState = window.history.state
      if (!currentState || currentState.__appNavigation !== NAVIGATION_STATE_KEY) {
        window.history.replaceState(nextState, '', window.location.href)
      }
      return
    }

    const currentState = window.history.state
    const isSameState =
      currentState &&
      currentState.__appNavigation === NAVIGATION_STATE_KEY &&
      currentState.view === nextState.view &&
      currentState.mode === nextState.mode &&
      currentState.selectedCategory === nextState.selectedCategory &&
      currentState.selectedToeflLevel === nextState.selectedToeflLevel &&
      currentState.selectedToeflList === nextState.selectedToeflList &&
      currentState.selectedIeltsTopic === nextState.selectedIeltsTopic &&
      currentState.selectedIeltsList === nextState.selectedIeltsList &&
      currentState.selectedReadingId === nextState.selectedReadingId

    if (isSameState) return
    window.history.pushState(nextState, '', window.location.href)
  }, [view, mode, selectedCategory, selectedToeflLevel, selectedToeflList, selectedIeltsTopic, selectedIeltsList, selectedReadingId])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [view])

  const currentWord = shuffledWords[currentIndex]

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
    const today = getStudyDateKey()
    setStudyHistory((prev) => {
      const safeList = normalizeStudyHistory(prev)
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
    })
  }

  const recordReadingCompletion = ({ articleId, questionsAnswered = 0, questionsCorrect = 0, timeSpent = 0 } = {}) => {
    if (articleId == null) return
    const today = getStudyDateKey()
    const articleKey = String(articleId)

    setStudyHistory((prev) => {
      const safeList = normalizeStudyHistory(prev)
      const index = safeList.findIndex((item) => item.date === today)
      const nextList = [...safeList]
      const current = index >= 0 ? nextList[index] : normalizeStudyHistoryItem({ date: today })
      const articleIds = uniqueStringList(current.readingArticleIds)
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
    })
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

  const ensureToeflListLoaded = useCallback(
    async (levelKey, listKey) => {
      if (!toeflManifest || !levelKey || !listKey) return

      const cacheKey = `${levelKey}::${listKey}`
      if (loadingToeflListsRef.current.has(cacheKey)) return
      loadingToeflListsRef.current.add(cacheKey)

      try {
        const listVocabulary = await loadToeflListVocabulary(toeflManifest, levelKey, listKey)
        setVocabulary((prev) => mergeVocabularyList(prev, listVocabulary))
      } catch (error) {
        setVocabularyError(error?.message || '托福 List 加载失败')
      } finally {
        loadingToeflListsRef.current.delete(cacheKey)
      }
    },
    [toeflManifest]
  )

  const ensureToeflLevelLoaded = useCallback(
    (levelKey) => {
      const lists = toeflGrouping.listsByLevel[levelKey] || []
      lists.forEach((item) => {
        ensureToeflListLoaded(levelKey, item.key)
      })
    },
    [ensureToeflListLoaded, toeflGrouping.listsByLevel]
  )

  const ensureAllToeflLoaded = useCallback(() => {
    toeflGrouping.levels.forEach((level) => {
      ensureToeflLevelLoaded(level.key)
    })
  }, [ensureToeflLevelLoaded, toeflGrouping.levels])

  const ensureIeltsListLoaded = useCallback(
    async (listKey) => {
      if (!ieltsManifest || !listKey) return

      if (loadingIeltsListsRef.current.has(listKey)) return
      loadingIeltsListsRef.current.add(listKey)

      try {
        const listVocabulary = await loadIeltsListVocabulary(ieltsManifest, listKey)
        setVocabulary((prev) => mergeVocabularyList(prev, listVocabulary))
      } catch (error) {
        setVocabularyError(error?.message || '雅思 List 加载失败')
      } finally {
        loadingIeltsListsRef.current.delete(listKey)
      }
    },
    [ieltsManifest]
  )

  const ensureAllIeltsLoaded = useCallback(() => {
    ieltsGrouping.lists.forEach((item) => {
      ensureIeltsListLoaded(item.key)
    })
  }, [ensureIeltsListLoaded, ieltsGrouping.lists])

  const loadAllExamVocabulary = useCallback(async () => {
    if (fullVocabularyLoadedRef.current) return null
    return loadFullVocabulary()
  }, [])

  const ensureIeltsTopicLoaded = useCallback(
    (topicKey) => {
      const lists = ieltsGrouping.listsByTopic[topicKey] || []
      lists.forEach((item) => {
        ensureIeltsListLoaded(item.key)
      })
    },
    [ensureIeltsListLoaded, ieltsGrouping.listsByTopic]
  )

  const handleCategorySelect = (categoryId, options = {}) => {
    pendingStartWordIdRef.current = options.focusWordId ?? null
    setAssessmentBackTarget('home')
    setSelectedCategory(categoryId)
    if (categoryId !== 'toefl') {
      setSelectedToeflLevel('')
      setSelectedToeflList('')
    }
    if (categoryId !== 'ielts') {
      setSelectedIeltsTopic('')
      setSelectedIeltsList('')
    }
    setMode('learn')
    setView('learn')
  }

  const openToeflLevels = () => {
    pendingStartWordIdRef.current = null
    setAssessmentBackTarget('home')
    setSelectedCategory('toefl')
    setSelectedToeflLevel('')
    setSelectedToeflList('')
    setSelectedIeltsTopic('')
    setSelectedIeltsList('')
    setView('toeflLevels')
  }

  const openIeltsTopics = () => {
    pendingStartWordIdRef.current = null
    setAssessmentBackTarget('home')
    setSelectedCategory('ielts')
    setSelectedToeflLevel('')
    setSelectedToeflList('')
    setSelectedIeltsTopic('')
    setSelectedIeltsList('')
    setView('ieltsTopics')
  }

  const handleToeflLevelSelect = (levelKey) => {
    pendingStartWordIdRef.current = null
    setSelectedCategory('toefl')
    setSelectedToeflLevel(levelKey)
    setSelectedToeflList('')
    setSelectedIeltsTopic('')
    setSelectedIeltsList('')

    const nextLists = toeflGrouping.listsByLevel[levelKey] || []
    if (nextLists.length === 0) {
      setMode('learn')
    }
    setView(nextLists.length > 0 ? 'toeflLists' : 'learn')
  }

  const handleToeflListSelect = (listKey) => {
    pendingStartWordIdRef.current = null
    setAssessmentBackTarget('home')
    setSelectedCategory('toefl')
    setSelectedToeflList(listKey)
    setSelectedIeltsTopic('')
    setSelectedIeltsList('')
    ensureToeflListLoaded(selectedToeflLevel, listKey)
    setMode('learn')
    setView('learn')
  }

  const handleStartAllToefl = () => {
    pendingStartWordIdRef.current = null
    setAssessmentBackTarget('home')
    setSelectedCategory('toefl')
    setSelectedToeflLevel('')
    setSelectedToeflList('')
    setSelectedIeltsTopic('')
    setSelectedIeltsList('')
    ensureAllToeflLoaded()
    setMode('learn')
    setView('learn')
  }

  const handleStartCurrentLevel = () => {
    pendingStartWordIdRef.current = null
    setAssessmentBackTarget('home')
    setSelectedCategory('toefl')
    setSelectedToeflList('')
    setSelectedIeltsTopic('')
    setSelectedIeltsList('')
    ensureToeflLevelLoaded(selectedToeflLevel)
    setMode('learn')
    setView('learn')
  }

  const handleIeltsTopicSelect = (topicKey) => {
    pendingStartWordIdRef.current = null
    setSelectedCategory('ielts')
    setSelectedToeflLevel('')
    setSelectedToeflList('')
    setSelectedIeltsTopic(topicKey)
    setSelectedIeltsList('')

    const nextLists = ieltsGrouping.listsByTopic[topicKey] || []
    if (nextLists.length === 0) {
      setMode('learn')
    }
    setView(nextLists.length > 0 ? 'ieltsLists' : 'learn')
  }

  const handleIeltsListSelect = (listKey) => {
    pendingStartWordIdRef.current = null
    setAssessmentBackTarget('home')
    setSelectedCategory('ielts')
    setSelectedToeflLevel('')
    setSelectedToeflList('')
    if (!selectedIeltsTopic) {
      setSelectedIeltsTopic(getIeltsTopicKey(listKey))
    }
    setSelectedIeltsList(listKey)
    ensureIeltsListLoaded(listKey)
    setMode('learn')
    setView('learn')
  }

  const handleStartAllIelts = () => {
    pendingStartWordIdRef.current = null
    setAssessmentBackTarget('home')
    setSelectedCategory('ielts')
    setSelectedToeflLevel('')
    setSelectedToeflList('')
    setSelectedIeltsTopic('')
    setSelectedIeltsList('')
    ensureAllIeltsLoaded()
    setMode('learn')
    setView('learn')
  }

  const handleStartCurrentIeltsTopic = () => {
    pendingStartWordIdRef.current = null
    setAssessmentBackTarget('home')
    setSelectedCategory('ielts')
    setSelectedToeflLevel('')
    setSelectedToeflList('')
    setSelectedIeltsList('')
    ensureIeltsTopicLoaded(selectedIeltsTopic)
    setMode('learn')
    setView('learn')
  }

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
    setSavedWordsError('')
    const savedIds = Object.entries(wordBookmarks).filter(([, entry]) => entry.saved).map(([id]) => id)
    if (fullVocabularyLoadedRef.current || savedIds.every((id) => allVocabulary.some((word) => String(word.id) === id))) return
    setSavedWordsLoading(true)
    try {
      const words = await loadFullVocabulary()
      setVocabulary((current) => mergeVocabularyList(current, words))
      fullVocabularyLoadedRef.current = true
    } catch {
      setSavedWordsError('部分收藏词汇尚未加载，请联网后重试。已保存的收藏不会丢失。')
    } finally {
      setSavedWordsLoading(false)
    }
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

  const handleClassroomProfileUpdated = useCallback((user) => {
    setAuthUser((current) => JSON.stringify(current) === JSON.stringify(user) ? current : user)
    const session = storage.getAuthSession()
    if (session?.access_token && JSON.stringify(session.user) !== JSON.stringify(user)) {
      const updatedSession = { ...session, user }
      storage.setAuthSession(updatedSession)
      setAuthSession(updatedSession)
    }
  }, [])

  const handleOpenExamPractice = () => {
    setExamPreparing(false)
    setExamPreparationError(null)
    setView('examPractice')
  }

  const handleOpenPlanSettings = () => {
    setView('planSettings')
  }

  const handleSelectDailyNewWordTarget = (target) => {
    storage.setDailyNewWordTarget(target)
    const updatedAt = new Date().toISOString()
    storage.setPlanPreferencesUpdatedAt(updatedAt)
    setPlanPreferencesUpdatedAt(updatedAt)
    setDailyNewWordTarget(storage.getDailyNewWordTarget())
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
    learningResetRef.current += 1
    setLearnedWords([])
    setMasteredWords([])
    setWrongWords([])
    setWordProgress({})
    setStudyHistory([])
    setPlanExamActivity({})
    setCurrentIndex(0)
    storage.clearProgress()
    const shuffled = [...filteredVocabulary].sort(() => Math.random() - 0.5)
    setShuffledWords(shuffled)
  }

  const currentCategoryName = useMemo(() => {
    if (selectedCategory === 'toefl') {
      const levelLabel =
        selectedToeflLevel === TOEFL_UNKNOWN_LEVEL
          ? '未分级'
          : selectedToeflLevel
            ? `Level ${selectedToeflLevel}`
            : ''
      const listLabel =
        selectedToeflList === TOEFL_UNKNOWN_LIST
          ? '未分 List'
          : selectedToeflList
            ? `List ${selectedToeflList}`
            : ''

      return ['托福词汇', levelLabel, listLabel].filter(Boolean).join(' · ')
    }

    if (selectedCategory === 'ielts') {
      const topicLabel = selectedIeltsTopic
        ? ieltsGrouping.topics.find((item) => item.key === selectedIeltsTopic)?.label || '未分主题'
        : ''
      const listLabel =
        selectedIeltsList === TOEFL_UNKNOWN_LIST
          ? '未分 List'
          : selectedIeltsList
            ? `List ${selectedIeltsList}`
            : ''

      return ['雅思词汇', topicLabel, listLabel].filter(Boolean).join(' · ')
    }

    const cat = categories.find((c) => c.id === selectedCategory)
    return cat ? cat.name : '全部单词'
  }, [ieltsGrouping.topics, selectedCategory, selectedIeltsList, selectedIeltsTopic, selectedToeflLevel, selectedToeflList])

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

  const renderAuthModal = () => {
    if (!showAuthModal) return null

    return (
      <div className="auth-modal-overlay fixed inset-0 z-[80] flex items-center justify-center">
        <button
          type="button"
          aria-label="关闭登录弹窗"
          className="auth-modal-backdrop absolute inset-0"
          onClick={() => setShowAuthModal(false)}
        />
        <div ref={authModalRef} className="auth-modal-card" tabIndex={-1} role="dialog" aria-modal="true" aria-label="账号与云同步">
          <PageLoadBoundary>
            <Suspense fallback={<p className="auth-loading-text" role="status">正在准备账号面板…</p>}>
              <AuthPanel
                enabled={cloudEnabled}
                loading={authLoading}
                user={authUser}
                learnedCount={learnedWords.length}
                masteredCount={masteredWords.length}
                onClose={() => setShowAuthModal(false)}
                onOpenSavedWords={handleOpenSavedWords}
                syncStatusText={getSyncStatusText({
                  authLoading,
                  hasUser: Boolean(authUser?.id),
                  syncState,
                  lastSyncedAt,
                })}
                syncError={syncError || authError}
                onLogin={handleModalLogin}
                onRegister={handleModalRegister}
                onLogout={handleModalLogout}
                onSyncNow={handleModalSyncNow}
                onOpenClassroom={handleOpenClassroom}
              />
            </Suspense>
          </PageLoadBoundary>
        </div>
      </div>
    )
  }

  const renderAuthTransitionOverlay = () => {
    if (!authTransition) return null

    return (
      <div className="auth-transition-overlay" role="status" aria-live="polite" aria-busy="true">
        <div className="auth-transition-panel">
          <div className="auth-transition-orbit" aria-hidden="true">
            <span className="auth-transition-dot auth-transition-dot--blue" />
            <span className="auth-transition-dot auth-transition-dot--green" />
            <span className="auth-transition-dot auth-transition-dot--amber" />
            <span className="auth-transition-core" />
          </div>
          <div className="auth-transition-copy">
            <p className="auth-transition-kicker">
              {authTransition.mode === 'register' ? '欢迎加入' : '欢迎回来'}
            </p>
            <h2>{authTransition.title}</h2>
            <p>{authTransition.detail}</p>
          </div>
          <div className="auth-transition-steps" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    )
  }

  const appBackground = useMemo(() => {
    if (
      view === 'studyHub' ||
      view === 'home' ||
      view === 'toeflLevels' ||
      view === 'toeflLists' ||
      view === 'ieltsTopics' ||
      view === 'ieltsLists'
    ) {
      return isDark ? 'bg-[#0b1120]' : 'bg-[#f8fafc]'
    }

    if (
      view === 'learn' ||
      view === 'learnedWords' ||
      view === 'masteredWords' ||
      view === 'savedWords' ||
      view === 'todayReview' ||
      view === 'wrongWords' ||
      view === 'planSettings' ||
      view === 'readingSession' ||
      view === 'wordAssignment' ||
      view === 'statistics' ||
      view === 'examPractice'
    ) {
      return isDark ? 'bg-[#0b1120]' : 'bg-[#fbfbfd]'
    }

    return isDark
      ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900'
      : 'bg-gradient-to-br from-slate-100 via-sky-50 to-indigo-100'
  }, [isDark, view])

  if (vocabularyLoading) {
    return (
      <div className={`min-h-screen ${appBackground} flex items-center justify-center px-4`}>
        <div className="w-full max-w-[360px] rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-center shadow-[var(--app-shadow)]">
          <p className="text-lg font-semibold text-[var(--app-text)]">正在加载词库</p>
          <p className="mt-2 text-sm text-[var(--app-muted)]">首次打开会缓存到本机，之后会更快。</p>
        </div>
      </div>
    )
  }

  if (vocabularyError) {
    return (
      <div className={`min-h-screen ${appBackground} flex items-center justify-center px-4`}>
        <div className="w-full max-w-[380px] rounded-[16px] border border-[#fecaca] bg-[var(--app-surface)] p-6 text-center shadow-[var(--app-shadow)]">
          <p className="text-lg font-semibold text-[#991b1b]">词库加载失败</p>
          <p className="mt-2 text-sm text-[var(--app-muted)]">{vocabularyError}</p>
          <button
            type="button"
            className="mt-4 rounded-full bg-[#111827] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#374151]"
            onClick={() => setVocabularyReloadKey((key) => key + 1)}
          >
            重新加载
          </button>
        </div>
      </div>
    )
  }

  const selectionNavItems = [
    { id: 'plan', label: '今日计划', icon: 'plan', onClick: handleBackToStudyHub },
    { id: 'training', label: '训练中心', icon: 'training', onClick: handleBackToHome },
    { id: 'words', label: '单词', icon: 'words', onClick: handleOpenWordStudy },
    { id: 'reading', label: '阅读', icon: 'reading', onClick: handleOpenReadingList },
    { id: 'review', label: '复习', icon: 'review', onClick: handleOpenTodayReview },
    { id: 'test', label: '测试', icon: 'test', onClick: handleOpenExamPractice },
    { id: 'stats', label: '统计', icon: 'stats', onClick: handleOpenStatistics },
  ]

  const selectionTopbarProps = {
    onCalendar: handleOpenStatistics,
    onNotify: handleOpenWrongWords,
    notifyBadge: wrongWords.length ? String(Math.min(wrongWords.length, 9)) : undefined,
    onThemeToggle: toggleTheme,
    isDarkTheme: isDark,
    onVoiceSettings: () => setShowVoiceSettings(true),
    onUserClick: () => setShowAuthModal(true),
    userLabel: authUser?.email ? getAccountRoleLabel(authUser) : authLoading ? '同步中' : '未登录',
    sidebarProps: { studyHistory },
  }

  const wordBookmarkContext = {
    entries: wordBookmarks,
    ownerId: authUser?.id || 'guest',
    disabled: authLoading || Boolean(authTransition),
    toggle: (wordId, saved) => {
      const next = storage.changeWordBookmark(authUser?.id, wordBookmarks, wordId, saved)
      setWordBookmarks(next)
      latestProgressRef.current = { ...latestProgressRef.current,
        preferences: { ...latestProgressRef.current.preferences, wordBookmarks: next } }
    },
    onOpen: handleOpenSavedWords,
  }
  const savedWordIds = Object.entries(wordBookmarks).filter(([, entry]) => entry.saved).map(([id]) => id)
  const savedWordList = savedWordIds.map((id) => vocabularyMap.get(id)).filter(Boolean)
  const unavailableSavedCount = savedWordIds.length - savedWordList.length

  const renderView = () => {
    switch (view) {
      case 'classroom':
        return (
          <ClassroomView
            key={authUser?.id || 'guest'}
            user={authUser}
            navItems={selectionNavItems}
            topbarProps={selectionTopbarProps}
            onAuthOpen={() => setShowAuthModal(true)}
            onProfileUpdated={handleClassroomProfileUpdated}
            onSync={handleManualSync}
            initialVocabulary={vocabulary}
            onStartAssignment={handleStartReadingAssignment}
          />
        )
      case 'studyHub':
        return (
          <StudyHub
            key={authUser?.id || 'guest'}
            rewardsReady={!authLoading && localDataLoaded}
            planReady={planDataReady}
            tomorrowPlan={tomorrowPlan}
            onRetryPlan={() => setPlanPreparationAttempt(value => value + 1)}
            onOpenWordStudy={handleStartPlanLearning}
            onStartAssignment={handleStartReadingAssignment}
            onOpenTraining={handleBackToHome}
            onOpenReading={handleOpenReadingList}
            onOpenSuggestedReading={handleOpenSuggestedReading}
            onOpenTodayReview={handleOpenTodayReview}
            onOpenWrongWords={handleOpenWrongWords}
            onOpenStatistics={handleOpenStatistics}
            onOpenExamPractice={handleOpenExamPractice}
            onAuthOpen={() => setShowAuthModal(true)}
            onAuthSync={handleHomeSync}
            authUser={authUser}
            syncStatusText={getSyncStatusText({
              authLoading,
              hasUser: Boolean(authUser?.id),
              syncState,
              lastSyncedAt,
            })}
            accountNotice={homeAccountNotice}
            wordCount={planWordCount}
            remainingWordCount={remainingPlanWordCount}
            planCategoryName={planCategoryName}
            isPreparingWords={planPreparing}
            planError={planPreparationError}
            readingCount={readingLibrary.length}
            reviewCount={todayReviewWordList.length}
            wrongCount={wrongWordList.length}
            todayWordsLearned={planTodayWordsLearned}
            todayWordsMastered={todayStudyStats.wordsMastered}
            todayReadingsCompleted={todayStudyStats.readingsCompleted}
            todayExamQuestionsAnswered={planTodayExamAnswered}
            todayExamQuestionsCorrect={planTodayExamCorrect}
            suggestedReading={suggestedReading}
            studyHistory={studyHistory}
            newWordTarget={dailyNewWordTarget}
            onAdjustPlan={handleOpenPlanSettings}
            isDarkTheme={isDark}
            onThemeToggle={toggleTheme}
            onVoiceSettings={() => setShowVoiceSettings(true)}
          />
        )
      case 'planSettings':
        return (
          <PlanSettingsView
            navItems={selectionNavItems}
            topbarProps={selectionTopbarProps}
            dailyTarget={dailyNewWordTarget}
            todayWordsLearned={planTodayWordsLearned}
            wordCount={planWordCount}
            selectedCategory={studyPlanCategory}
            onSelectCategory={handleSelectPlanCategory}
            isPreparing={planPreparing}
            preparationError={planPreparationError}
            onSelectDailyTarget={handleSelectDailyNewWordTarget}
            onBack={handleBackToStudyHub}
            onStartLearning={handleStartPlanLearning}
          />
        )
      case 'examPractice':
        return (
          <ExamPracticeView
            onBack={handleBackToStudyHub}
            onHome={handleBackToStudyHub}
            onSelectMode={handleStartExamPractice}
            selectedScope={examScope}
            onSelectScope={(scope) => {
              examRequestRef.current += 1
              setExamPreparing(false)
              setExamPreparationError(null)
              setExamScope(scope)
            }}
            learnedCount={planLearnedCount}
            masteredCount={planMasteredCount}
            totalCount={planWordCount}
            categoryName={planCategoryName}
            isPreparing={examPreparing || planPreparing}
            preparationError={examPreparationError?.message}
            onRetryPreparation={() => {
              if (examPreparationError) handleStartExamPractice(examPreparationError.mode, examPreparationError.scope)
            }}
            onSyncAccount={handleHomeSync}
            mode={mode}
            onOpenMode={(nextMode) => handleStartExamPractice(nextMode, examScope)}
            onOpenReading={handleOpenReadingList}
            navItems={selectionNavItems}
            topbarProps={selectionTopbarProps}
          />
        )
      case 'home':
        return (
          <HomeScreen
            onCategorySelect={handleCategorySelect}
            wordCounts={wordCounts}
            readingCount={readingLibrary.length}
            readings={readingLibrary}
            vocabularyData={allVocabulary}
            learnedWordIds={learnedWords}
            masteredWordIds={masteredWords}
            todayReviewWordIds={todayReviewWordList.map((word) => word.id)}
            wrongWordIds={wrongWords}
            onOpenLearnedWords={() => setView('learnedWords')}
            onOpenMasteredWords={() => setView('masteredWords')}
            onOpenTodayReview={handleOpenTodayReview}
            onOpenWrongWords={handleOpenWrongWords}
            onOpenStatistics={handleOpenStatistics}
            onOpenExamPractice={handleOpenExamPractice}
            onOpenToeflLevels={openToeflLevels}
            onOpenIeltsLists={openIeltsTopics}
            authEnabled={cloudEnabled}
            authLoading={authLoading}
            authUser={authUser}
            syncStatusText={getSyncStatusText({
              authLoading,
              hasUser: Boolean(authUser?.id),
              syncState,
              lastSyncedAt,
            })}
            syncError={syncError || authError}
            onHome={handleBackToStudyHub}
            onAuthOpen={() => setShowAuthModal(true)}
            onSyncAccount={handleHomeSync}
            onSpeakIntro={() => speak('English flashcards. Choose a vocabulary category to start.', { rate: 1 })}
            onOpenMode={handleOpenModeFromHome}
            onOpenReading={handleOpenReadingList}
            onOpenReadingSession={handleOpenReadingSession}
            onRetryReading={handleRetryReading}
            mode={mode}
            onAuthLogin={handleAuthLogin}
            onAuthRegister={handleAuthRegister}
            onAuthLogout={handleAuthLogout}
            onAuthSyncNow={handleManualSync}
            showAuthPanel={false}
            isDarkTheme={isDark}
            onThemeToggle={toggleTheme}
            onVoiceSettings={() => setShowVoiceSettings(true)}
            panelRequest={homePanelRequest}
            studyHistory={studyHistory}
            dailyTarget={dailyNewWordTarget}
          />
        )
      case 'wordAssignment':
        return activeWordAssignment ? <WordAssignmentSession key={`${authUser?.id}:${activeWordAssignment.id}`} assignment={activeWordAssignment} userId={authUser?.id} navItems={selectionNavItems} topbarProps={selectionTopbarProps} onBack={() => { setActiveWordAssignment(null); setView(assignmentReturnView) }} /> : <AppLayout title="班级作业" navItems={selectionNavItems} topbarProps={selectionTopbarProps}><div className="classroom-panel"><p>请从任务列表重新进入作业。</p><button type="button" className="exam-back-button" onClick={() => setView('studyHub')}>返回今日计划</button></div></AppLayout>
      case 'readingSession':
        return (
          <ReadingSessionView
            key={`${authUser?.id || 'guest'}:${readingRetry?.id || activeReadingAssignment?.id || selectedReadingId}`}
            userId={authUser?.id}
            assignment={activeReadingAssignment}
            retryAttempt={readingRetry}
            onSubmitAssignment={handleSubmitReadingAssignment}
            article={selectedReading}
            mode={mode}
            onBack={handleBackToReadingList}
            onOpenMode={handleOpenModeFromReading}
            navItems={selectionNavItems}
            topbarProps={selectionTopbarProps}
            masteredWords={masteredWords}
            wordLookup={vocabularyLookup}
            onMarkAsLearned={setWordAsLearned}
            onMarkAsMastered={setWordAsMastered}
            onSyncAccount={handleHomeSync}
            onCompleteReading={recordReadingCompletion}
            isCompletedToday={todayStudyStats.readingArticleIds.includes(String(selectedReading?.id))}
            completedResult={studyHistory.find((day) => day.date === getStudyDateKey())?.readingArticleResults?.find((result) => result.articleId === String(selectedReading?.id))}
          />
        )
      case 'toeflLevels':
        return (
          <ToeflSelectionView
            mode="level"
            title="托福词汇分级"
            subtitle="先选择 Level，再进入对应 List；也可以直接学习全部托福词汇。"
            items={toeflGrouping.levels}
            totalCount={toeflGrouping.total}
            onBack={handleBackToHome}
            onSelect={handleToeflLevelSelect}
            onSelectAll={handleStartAllToefl}
            onSyncAccount={handleHomeSync}
            onSpeakIntro={() => speak('TOEFL vocabulary. Choose a level, then choose a list to start.', { rate: 1 })}
            selectAllLabel="学习全部托福词汇"
            vocabularyLabel="托福词汇"
            listLabel="托福 List"
            navItems={selectionNavItems}
            topbarProps={selectionTopbarProps}
            active="words"
            selectionKind="toefl-level"
          />
        )
      case 'toeflLists': {
        const levelLabel =
          selectedToeflLevel === TOEFL_UNKNOWN_LEVEL ? '未分级' : `Level ${selectedToeflLevel}`
        const totalForLevel = toeflListsForSelectedLevel.reduce((sum, item) => sum + item.count, 0)

        return (
          <ToeflSelectionView
            mode="list"
            title={levelLabel}
            subtitle="选择 List 开始学习，或者直接学习当前 Level 全部词汇。"
            items={toeflListsForSelectedLevel}
            totalCount={totalForLevel}
            onBack={() => setView('toeflLevels')}
            onSelect={handleToeflListSelect}
            onSelectAll={handleStartCurrentLevel}
            onSyncAccount={handleHomeSync}
            onSpeakIntro={() => speak(`${levelLabel}. Choose a list to start, or study all words in this level.`, { rate: 1 })}
            selectAllLabel={`学习${levelLabel}全部词汇`}
            vocabularyLabel="托福词汇"
            listLabel="托福 List"
            navItems={selectionNavItems}
            topbarProps={selectionTopbarProps}
            active="words"
            selectionKind="toefl-list"
          />
        )
      }
      case 'ieltsTopics':
        return (
          <ToeflSelectionView
            mode="level"
            title="雅思词汇主题"
            subtitle="先选择主题，再进入对应 List；也可以直接学习全部雅思词汇。"
            items={ieltsGrouping.topics}
            totalCount={ieltsGrouping.total}
            onBack={handleBackToHome}
            onSelect={handleIeltsTopicSelect}
            onSelectAll={handleStartAllIelts}
            onSyncAccount={handleHomeSync}
            onSpeakIntro={() => speak('IELTS vocabulary. Choose a topic, then choose a list to start.', { rate: 1 })}
            selectAllLabel="学习全部雅思词汇"
            vocabularyLabel="雅思词汇"
            listLabel="雅思主题"
            navItems={selectionNavItems}
            topbarProps={selectionTopbarProps}
            active="words"
            selectionKind="ielts-topic"
          />
        )
      case 'ieltsLists': {
        const topicLabel =
          ieltsGrouping.topics.find((item) => item.key === selectedIeltsTopic)?.label || '未分主题'
        const totalForTopic = ieltsListsForSelectedTopic.reduce((sum, item) => sum + item.count, 0)

        return (
          <ToeflSelectionView
            mode="list"
            title={topicLabel}
            subtitle="选择 List 开始学习，或者直接学习当前主题全部词汇。"
            items={ieltsListsForSelectedTopic}
            totalCount={totalForTopic}
            onBack={() => setView('ieltsTopics')}
            onSelect={handleIeltsListSelect}
            onSelectAll={handleStartCurrentIeltsTopic}
            onSyncAccount={handleHomeSync}
            onSpeakIntro={() => speak(`${topicLabel}. Choose a list to start, or study all words in this topic.`, { rate: 1 })}
            selectAllLabel={`学习${topicLabel}全部词汇`}
            vocabularyLabel="雅思词汇"
            listLabel="雅思 List"
            navItems={selectionNavItems}
            topbarProps={selectionTopbarProps}
            active="words"
            selectionKind="ielts-list"
          />
        )
      }
      case 'learn':
        return (
          <LearningView
            key={authUser?.id || 'guest'}
            mode={mode}
            setMode={setMode}
            allVocabulary={allVocabulary}
            currentWord={currentWord}
            filteredVocabulary={filteredVocabulary}
            currentIndex={currentIndex}
            onMarkLearned={markAsLearned}
            onMarkMastered={markAsMastered}
            masteredWords={masteredWords}
            examScope={examScope}
            examCategory={studyPlanCategory}
            onAddMastered={setWordAsMastered}
            onWrongAnswer={(id) => {
              addWrongWord(id)
              setWordAsLearned(id)
            }}
            onAssessmentAnswer={recordAssessmentAnswer}
            categoryName={currentCategoryName}
            dailyTarget={mode === 'learn' && assessmentBackTarget === 'studyHub' ? dailyNewWordTarget : undefined}
            todayWordsStudied={planTodayWordsLearned}
            learnedWords={learnedWords}
            resetProgress={resetProgress}
            onBack={handleLearningBack}
            onHome={handleBackToStudyHub}
            onSyncAccount={handleHomeSync}
            onOpenReading={handleOpenReadingList}
            onOpenStudyHub={handleBackToHome}
            onOpenWordStudy={handleOpenWordStudy}
            onOpenTodayReview={handleOpenTodayReview}
            onOpenExamPractice={handleOpenExamPractice}
            onOpenStatistics={handleOpenStatistics}
            onOpenWrongWords={handleOpenWrongWords}
            isDarkTheme={isDark}
            onThemeToggle={toggleTheme}
            onVoiceSettings={() => setShowVoiceSettings(true)}
            onUserClick={() => setShowAuthModal(true)}
            userLabel={authUser?.email ? getAccountRoleLabel(authUser) : authLoading ? '同步中' : '未登录'}
            studyHistory={studyHistory}
          />
        )
      case 'statistics':
        return (
          <AppLayout
            active="stats"
            navItems={selectionNavItems}
            title="统计"
            subtitle="用真实学习记录追踪复习、错题和认识标记。"
            topbarProps={selectionTopbarProps}
          >
            <Statistics
              learnedWords={learnedWords}
              masteredWords={masteredWords}
              totalWords={statisticsWordCount}
              wrongWords={wrongWords}
              studyHistory={studyHistory}
              dueReviewCount={todayReviewWordList.length}
            />
          </AppLayout>
        )
      case 'savedWords':
        return <WordCollectionView
          title="我的收藏"
          subtitle={authUser?.id ? '收藏独立于学习状态，随账号同步。取消收藏不会删除学习记录。' : '访客收藏仅保存在当前设备，登录后可随学习进度合并到账号。'}
          words={savedWordList}
          emptyTitle={savedWordsLoading ? '正在准备收藏' : savedWordsError ? '收藏词汇暂不可用' : '还没有收藏'}
          emptyHint={savedWordsLoading ? '正在加载收藏词汇…' : savedWordsError || '还没有收藏，点击单词卡右上角的星标即可保存。'}
          statusMessage={savedWordsLoading ? '正在加载完整词库…' : savedWordsError || (unavailableSavedCount ? `${unavailableSavedCount} 个收藏词暂时无法匹配，收藏记录已保留。` : '')}
          onRetry={savedWordsError || (unavailableSavedCount && !fullVocabularyLoadedRef.current) ? handleOpenSavedWords : undefined}
          onBack={handleBackToHome}
          onHome={handleBackToStudyHub}
          onOpenMode={handleOpenModeFromCollection}
          onSyncAccount={handleHomeSync}
          onOpenReading={handleOpenReadingList}
          onMarkAsUnknown={setWordAsLearned}
          onMarkAsMastered={setWordAsMastered}
          navItems={selectionNavItems}
          topbarProps={selectionTopbarProps}
          active="words"
          progressLabel="收藏词汇"
        />
      case 'todayReview':
        return (
          <WordCollectionView
            title="今日复习"
            subtitle="这些是今天需要回顾的已学习或已标记认识的单词"
            words={todayReviewWordList}
            mode={mode}
            emptyHint="今天没有到期复习词，保持得很好。"
            onBack={handleBackToHome}
            onOpenMode={handleOpenModeFromCollection}
            onMarkAsUnknown={setWordAsLearned}
            onMarkAsMastered={setWordAsMastered}
            progressLabel="今日复习"
            onHome={handleBackToStudyHub}
            onSyncAccount={handleHomeSync}
            onOpenReading={handleOpenReadingList}
            navItems={selectionNavItems}
            topbarProps={selectionTopbarProps}
            active="review"
            emptyArtSrc="/images/ui-assets/training-card-review-blue-v1.png"
          />
        )
      case 'wrongWords':
        return (
          <WordCollectionView
            title="错题本"
            subtitle="这里会展示你在测验、填空、拼写中答错过的单词"
            words={wrongWordList}
            mode={mode}
            emptyHint="错题本暂时是空的，答错的词会自动出现在这里。"
            onBack={handleBackToHome}
            onOpenMode={handleOpenModeFromCollection}
            onMarkAsUnknown={setWordAsLearned}
            onMarkAsMastered={setWordAsMastered}
            progressLabel="待巩固"
            onHome={handleBackToStudyHub}
            onSyncAccount={handleHomeSync}
            onOpenReading={handleOpenReadingList}
            navItems={selectionNavItems}
            topbarProps={selectionTopbarProps}
            active="review"
            emptyArtSrc="/images/ui-assets/training-card-review-blue-v1.png"
          />
        )
      case 'learnedWords':
        return (
          <WordCollectionView
            title="已学习单词"
            subtitle="这里会展示你标记为“已学习”的所有单词"
            words={learnedWordList}
            mode={mode}
            emptyHint="你还没有已学习单词，先进入学习模式标记一些吧。"
            onBack={handleBackToHome}
            onOpenMode={handleOpenModeFromCollection}
            onMarkAsUnknown={setWordAsLearned}
            onMarkAsMastered={markLearnedWordAsMastered}
            masteredActionLabel="认识了"
            onHome={handleBackToStudyHub}
            onSyncAccount={handleHomeSync}
            onOpenReading={handleOpenReadingList}
            navItems={selectionNavItems}
            topbarProps={selectionTopbarProps}
            active="words"
            emptyArtSrc="/images/ui-assets/category-all-words-blue-v1.png"
          />
        )
      case 'masteredWords':
        return (
          <WordCollectionView
            title="认识标记"
            subtitle="来自自评或练习结果的认识标记，不代表已验证长期记忆；仍按计划复习。"
            words={masteredWordList}
            mode={mode}
            emptyHint="还没有认识标记，可在学习或练习中记录。"
            onBack={handleBackToHome}
            onOpenMode={handleOpenModeFromCollection}
            onMarkAsUnknown={markMasteredWordAsLearned}
            onMarkAsMastered={setWordAsMastered}
            onHome={handleBackToStudyHub}
            onSyncAccount={handleHomeSync}
            onOpenReading={handleOpenReadingList}
            navItems={selectionNavItems}
            topbarProps={selectionTopbarProps}
            active="words"
            emptyArtSrc="/images/ui-assets/training-card-review-blue-v1.png"
          />
        )
      default:
        return null
    }
  }


  return (
    <div className={`min-h-screen ${appBackground}`}>
      <WordBookmarksContext.Provider value={wordBookmarkContext}>
        <ExamHistoryProvider key={authUser?.id || 'guest'} ownerId={authUser?.id}>
          <PageLoadBoundary key={view}>
            <Suspense fallback={<p className="auth-loading-text" role="status">正在准备学习页面…</p>}>
              {renderView()}
            </Suspense>
          </PageLoadBoundary>
        </ExamHistoryProvider>
      </WordBookmarksContext.Provider>
      {showVoiceSettings && <PageLoadBoundary><Suspense fallback={<p role="status">正在准备语音设置…</p>}><VoiceSettings onClose={() => setShowVoiceSettings(false)} /></Suspense></PageLoadBoundary>}
      {renderAuthModal()}
      {renderAuthTransitionOverlay()}
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
