import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { useTheme } from './context/theme-context'
import {
  loadIeltsListVocabulary,
  loadIeltsManifest,
  loadToeflListVocabulary,
  loadToeflManifest,
  loadVocabulary,
} from './data/vocabulary'
import readings from './data/readings'
import categories from './data/categories'
import StudyHub from './components/StudyHub'
import HomeScreen from './components/HomeScreen'
import LearningView from './components/LearningView'
import Statistics from './components/Statistics'
import WordCollectionView from './components/WordCollectionView'
import ToeflSelectionView from './components/ToeflSelectionView'
import ReadingSessionView from './components/ReadingSessionView'
import ExamPracticeView from './components/ExamPracticeView'
import AuthPanel from './components/AuthPanel'
import { storage } from './utils/storage'
import { buildWordLookup, isEnglishWordToken, resolveVocabularyWord, tokenizeReadingText } from './utils/readingText'
import { calculateNextReview, getWordsForReview, initializeWordProgress } from './utils/spacedRepetition'
import { speak } from './utils/speech'
import {
  getWordCategories,
  mergeCategoryLists,
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

const TOEFL_UNKNOWN_LEVEL = 'unknown'
const TOEFL_UNKNOWN_LIST = 'unknown'
const IELTS_UNKNOWN_TOPIC = 'unknown'
const NAVIGATION_STATE_KEY = 'english_flashcards_navigation_v1'
const AUTH_TRANSITION_MIN_MS = 900

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const dedupeIdList = (list) => {
  const safeList = Array.isArray(list) ? list : []
  const seen = new Set()
  const result = []

  safeList.forEach((item) => {
    if (item === null || item === undefined) return
    const key = String(item)
    if (seen.has(key)) return
    seen.add(key)
    result.push(item)
  })

  return result
}

const countFilledFields = (word) => {
  if (!word || typeof word !== 'object') return 0
  const keys = ['phonetic', 'pos', 'meaning', 'example', 'exampleCn', 'category', 'categories', 'level', 'list', 'ieltsList', 'ieltsLists']
  return keys.reduce((count, key) => {
    const value = Array.isArray(word[key]) ? word[key].join('|') : String(word[key] ?? '').trim()
    return value ? count + 1 : count
  }, 0)
}

const pickRicherWord = (currentWord, incomingWord) => {
  if (!currentWord) return incomingWord
  if (!incomingWord) return currentWord
  const pickedWord = countFilledFields(incomingWord) >= countFilledFields(currentWord) ? incomingWord : currentWord
  const categories = mergeCategoryLists(currentWord.categories, currentWord.category, incomingWord.categories, incomingWord.category)

  if (categories.length === 0) {
    return pickedWord
  }

  return {
    ...pickedWord,
    category: pickedWord.category || categories[0],
    categories,
  }
}

const mergeCustomWordList = (baseList, extraList) => {
  const map = new Map()
  const applyList = (list) => {
    const safeList = Array.isArray(list) ? list : []
    safeList.forEach((word) => {
      const key = String(word?.word || '').trim().toLowerCase()
      if (!key) return
      map.set(key, pickRicherWord(map.get(key), word))
    })
  }

  applyList(baseList)
  applyList(extraList)
  return Array.from(map.values())
}

const mergeVocabularyList = (baseList, extraList) => {
  const byId = new Map()
  const byWord = new Map()
  const merged = []

  const upsertWord = (word) => {
    if (!word || typeof word !== 'object') return
    const idKey = word.id == null ? '' : String(word.id)
    const wordKey = String(word.word || '').trim().toLowerCase()
    let existingIndex = idKey ? byId.get(idKey) : undefined
    if (existingIndex === undefined && wordKey) {
      existingIndex = byWord.get(wordKey)
    }

    if (existingIndex !== undefined) {
      const current = merged[existingIndex]
      const nextWord = pickRicherWord(current, word)
      merged[existingIndex] = nextWord
      if (nextWord.id != null) byId.set(String(nextWord.id), existingIndex)
      if (nextWord.word) byWord.set(String(nextWord.word).trim().toLowerCase(), existingIndex)
      return
    }

    const nextIndex = merged.length
    merged.push(word)
    if (idKey) byId.set(idKey, nextIndex)
    if (wordKey) byWord.set(wordKey, nextIndex)
  }

  ;[...(Array.isArray(baseList) ? baseList : []), ...(Array.isArray(extraList) ? extraList : [])].forEach(upsertWord)
  return merged.sort((a, b) => Number(a.id || 0) - Number(b.id || 0))
}

const normalizeRecord = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {})

const normalizeStudyHistory = (value) => {
  const safeList = Array.isArray(value) ? value : []
  return safeList.filter((item) => item && typeof item === 'object' && String(item.date || '').trim())
}

const mergeStudyHistory = (baseList, extraList) => {
  const map = new Map()
  ;[...normalizeStudyHistory(baseList), ...normalizeStudyHistory(extraList)].forEach((item) => {
    const date = String(item.date || '').trim()
    if (!date) return
    const current = map.get(date) || { date, wordsLearned: 0, wordsMastered: 0, timeSpent: 0 }
    map.set(date, {
      date,
      wordsLearned: Math.max(Number(current.wordsLearned || 0), Number(item.wordsLearned || 0)),
      wordsMastered: Math.max(Number(current.wordsMastered || 0), Number(item.wordsMastered || 0)),
      timeSpent: Math.max(Number(current.timeSpent || 0), Number(item.timeSpent || 0)),
    })
  })

  return Array.from(map.values())
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
    .slice(-90)
}

const normalizeProgressState = (progress) => {
  const masteredWords = dedupeIdList(progress?.masteredWords || [])
  const masteredSet = new Set(masteredWords.map((item) => String(item)))
  const learnedWords = dedupeIdList(progress?.learnedWords || []).filter(
    (item) => !masteredSet.has(String(item))
  )
  const wrongWords = dedupeIdList(progress?.wrongWords || []).filter(
    (item) => !masteredSet.has(String(item))
  )

  return {
    learnedWords,
    masteredWords,
    customWords: mergeCustomWordList([], progress?.customWords || []),
    wordProgress: normalizeRecord(progress?.wordProgress),
    wrongWords,
    studyHistory: normalizeStudyHistory(progress?.studyHistory),
  }
}

const mergeProgress = (localProgress, cloudProgress) =>
  normalizeProgressState({
    learnedWords: [...(cloudProgress.learnedWords || []), ...(localProgress.learnedWords || [])],
    masteredWords: [...(cloudProgress.masteredWords || []), ...(localProgress.masteredWords || [])],
    customWords: mergeCustomWordList(cloudProgress.customWords || [], localProgress.customWords || []),
    wordProgress: {
      ...(cloudProgress.wordProgress || {}),
      ...(localProgress.wordProgress || {}),
    },
    wrongWords: [...(cloudProgress.wrongWords || []), ...(localProgress.wrongWords || [])],
    studyHistory: mergeStudyHistory(cloudProgress.studyHistory || [], localProgress.studyHistory || []),
  })

const areProgressStatesEqual = (left, right) => {
  const l = normalizeProgressState(left)
  const r = normalizeProgressState(right)
  return (
    JSON.stringify(l.learnedWords) === JSON.stringify(r.learnedWords) &&
    JSON.stringify(l.masteredWords) === JSON.stringify(r.masteredWords) &&
    JSON.stringify(l.customWords) === JSON.stringify(r.customWords) &&
    JSON.stringify(l.wordProgress) === JSON.stringify(r.wordProgress) &&
    JSON.stringify(l.wrongWords) === JSON.stringify(r.wrongWords) &&
    JSON.stringify(l.studyHistory) === JSON.stringify(r.studyHistory)
  )
}

const getSyncStatusText = ({ authLoading, hasUser, syncState, lastSyncedAt }) => {
  if (authLoading) return '初始化中'
  if (!hasUser) return '未登录'
  if (syncState === 'syncing') return '同步中'
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
  const { isDark, toggleTheme } = useTheme()

  const [view, setView] = useState('studyHub')
  const [mode, setMode] = useState('learn')
  const [examScope, setExamScope] = useState('learned')
  const [assessmentBackTarget, setAssessmentBackTarget] = useState('home')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedToeflLevel, setSelectedToeflLevel] = useState('')
  const [selectedToeflList, setSelectedToeflList] = useState('')
  const [selectedIeltsTopic, setSelectedIeltsTopic] = useState('')
  const [selectedIeltsList, setSelectedIeltsList] = useState('')
  const [selectedReadingId, setSelectedReadingId] = useState(null)
  const [homePanelRequest, setHomePanelRequest] = useState({ panel: '', nonce: 0 })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [learnedWords, setLearnedWords] = useState([])
  const [masteredWords, setMasteredWords] = useState([])
  const [wrongWords, setWrongWords] = useState([])
  const [wordProgress, setWordProgress] = useState({})
  const [studyHistory, setStudyHistory] = useState([])
  const [customWords, setCustomWords] = useState([])
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
  const skipNextCloudPushRef = useRef(false)
  const cloudSyncTimerRef = useRef(null)
  const cloudProgressVersionRef = useRef('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [homeAccountNotice, setHomeAccountNotice] = useState(null)
  const [authTransition, setAuthTransition] = useState(null)
  const homeNoticeTimerRef = useRef(null)

  const allVocabulary = useMemo(() => [...vocabulary, ...customWords], [customWords, vocabulary])
  const vocabularyLookup = useMemo(() => buildWordLookup(allVocabulary), [allVocabulary])
  const masteredWordIdSet = useMemo(
    () => new Set(masteredWords.map((item) => String(item))),
    [masteredWords]
  )
  const readingLibrary = useMemo(
    () =>
      readings.map((item) => {
        const tokens = tokenizeReadingText(item.content)
        let englishWordCount = 0
        const trackedWords = new Set()
        const unmasteredWords = new Set()

        tokens.forEach((token) => {
          if (!isEnglishWordToken(token)) return
          englishWordCount += 1
          const matchedWord = resolveVocabularyWord(token, vocabularyLookup)
          if (!matchedWord?.id) return
          const idKey = String(matchedWord.id)
          trackedWords.add(idKey)
          if (!masteredWordIdSet.has(idKey)) {
            unmasteredWords.add(idKey)
          }
        })

        const estimatedMinutes = Math.max(1, Math.round(englishWordCount / 180))

        return {
          ...item,
          estimatedMinutes,
          trackedWordCount: trackedWords.size,
          unmasteredCount: unmasteredWords.size,
        }
      }),
    [masteredWordIdSet, vocabularyLookup]
  )
  const selectedReading = useMemo(
    () => readingLibrary.find((item) => String(item.id) === String(selectedReadingId)) || null,
    [readingLibrary, selectedReadingId]
  )
  const todayStudyStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    const todayData = studyHistory.find((item) => item.date === today) || {}
    return {
      wordsLearned: Number(todayData.wordsLearned || 0),
      wordsMastered: Number(todayData.wordsMastered || 0),
    }
  }, [studyHistory])
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
        const [loadedVocabulary, loadedToeflManifest, loadedIeltsManifest] = await Promise.all([
          loadVocabulary(),
          loadToeflManifest().catch(() => null),
          loadIeltsManifest().catch(() => null),
        ])
        if (cancelled) return
        setVocabulary(loadedVocabulary)
        setToeflManifest(loadedToeflManifest)
        setIeltsManifest(loadedIeltsManifest)
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

    return () => {
      cancelled = true
    }
  }, [vocabularyReloadKey])

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

    setLearnedWords(savedLearned)
    setMasteredWords(savedMastered)
    setCustomWords(Array.isArray(savedCustomWords) ? savedCustomWords : [])
    setWrongWords(Array.isArray(savedWrongWords) ? savedWrongWords : [])
    setWordProgress(savedWordProgress && typeof savedWordProgress === 'object' ? savedWordProgress : {})
    setStudyHistory(Array.isArray(savedStudyHistory) ? savedStudyHistory : [])
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

  const applyMergedProgress = useCallback((mergedProgress, { skipNextPush = false } = {}) => {
    const normalized = normalizeProgressState(mergedProgress)

    if (skipNextPush) {
      skipNextCloudPushRef.current = true
    }

    setLearnedWords(normalized.learnedWords)
    setMasteredWords(normalized.masteredWords)
    setCustomWords(normalized.customWords)
    setWordProgress(normalized.wordProgress)
    setWrongWords(normalized.wrongWords)
    setStudyHistory(normalized.studyHistory)

    storage.setLearnedWords(normalized.learnedWords)
    storage.setMasteredWords(normalized.masteredWords)
    storage.setCustomWords(normalized.customWords)
    storage.setWordProgress(normalized.wordProgress)
    storage.setWrongWords(normalized.wrongWords)
    storage.setStudyHistory(normalized.studyHistory)
  }, [])

  const pushProgressToCloud = useCallback(async (session, user, progress, options = {}) => {
    if (!cloudEnabled || !session?.access_token || !user?.id) return ''

    setSyncState('syncing')
    setSyncError('')

    const syncResult = await upsertCloudProgress({
      progress,
      baseUpdatedAt:
        typeof options.baseUpdatedAt === 'string'
          ? options.baseUpdatedAt
          : cloudProgressVersionRef.current,
    })
    const syncedAtIso = syncResult?.updatedAt || new Date().toISOString()
    cloudProgressVersionRef.current = syncedAtIso

    if (syncResult?.conflictResolved && syncResult?.progress) {
      const hasDiff = !areProgressStatesEqual(
        {
          learnedWords,
          masteredWords,
          customWords,
          wordProgress,
          wrongWords,
          studyHistory,
        },
        syncResult.progress
      )
      if (hasDiff) {
        applyMergedProgress(syncResult.progress, { skipNextPush: true })
      }
    }

    const syncedAtText = new Date(syncedAtIso).toLocaleString('zh-CN', {
      hour12: false,
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })

    setSyncState('synced')
    setLastSyncedAt(syncedAtText)
    setSyncError('')
    return syncedAtText
  }, [applyMergedProgress, cloudEnabled, customWords, learnedWords, masteredWords, studyHistory, wordProgress, wrongWords])

  const hydrateFromCloud = useCallback(async ({ session, user }) => {
    if (!cloudEnabled || !session?.access_token || !user?.id) return

    const { progress: cloudProgress, updatedAt } = await loadCloudProgress()

    const merged = mergeProgress(
      {
        learnedWords,
        masteredWords,
        customWords,
        wordProgress,
        wrongWords,
        studyHistory,
      },
      cloudProgress
    )

    applyMergedProgress(merged, { skipNextPush: true })
    cloudHydratedRef.current = true
    await pushProgressToCloud(session, user, merged, { baseUpdatedAt: updatedAt })
  }, [
    applyMergedProgress,
    cloudEnabled,
    customWords,
    learnedWords,
    masteredWords,
    pushProgressToCloud,
    studyHistory,
    wordProgress,
    wrongWords,
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

        storage.setAuthSession(activeSession)
        const user =
          activeSession.user ||
          (await fetchCurrentUser())

        setAuthSession(activeSession)
        setAuthUser(user)
        await hydrateFromCloud({ session: activeSession, user })
      } catch (error) {
        storage.clearAuthSession()
        setAuthSession(null)
        setAuthUser(null)
        setAuthError(error?.message || '恢复登录失败')
        setSyncState('error')
        setSyncError(error?.message || '恢复登录失败')
        cloudProgressVersionRef.current = ''
      } finally {
        setAuthLoading(false)
      }
    }

    bootstrap()
  }, [cloudEnabled, ensureFreshSession, hydrateFromCloud, localDataLoaded])

  useEffect(() => {
    if (!cloudEnabled || authLoading || !cloudHydratedRef.current) {
      return
    }

    if (!authSession?.access_token || !authUser?.id) {
      return
    }

    if (skipNextCloudPushRef.current) {
      skipNextCloudPushRef.current = false
      return
    }

    if (cloudSyncTimerRef.current) {
      clearTimeout(cloudSyncTimerRef.current)
    }

    cloudSyncTimerRef.current = setTimeout(() => {
      pushProgressToCloud(authSession, authUser, {
        learnedWords,
        masteredWords,
        customWords,
        wordProgress,
        wrongWords,
        studyHistory,
      }).catch((error) => {
        setSyncState('error')
        setSyncError(error?.message || '自动同步失败')
      })
    }, 800)

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
    customWords,
    learnedWords,
    masteredWords,
    wordProgress,
    wrongWords,
    studyHistory,
    pushProgressToCloud,
  ])

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
      storage.setAuthSession(session)
      setAuthSession(session)
      setAuthUser(user)
      await hydrateFromCloud({ session, user })
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

  const handleAuthRegister = async ({ email, verificationCode }) => {
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

      storage.setAuthSession(session)
      setAuthSession(session)
      setAuthUser(user || session.user)
      await hydrateFromCloud({ session, user: user || session.user })
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

  const handleAuthLogout = async () => {
    if (authSession?.access_token) {
      try {
        await signOut()
      } catch {
        // Logout failure does not block local sign-out.
      }
    }

    storage.clearAuthSession()
    setAuthSession(null)
    setAuthUser(null)
    setAuthError('')
    setSyncState('idle')
    setSyncError('')
    setLastSyncedAt('')
    cloudProgressVersionRef.current = ''
    cloudHydratedRef.current = false
  }

  const handleManualSync = async () => {
    if (!authSession?.access_token || !authUser?.id) {
      throw new Error('请先登录账号')
    }

    const syncedAtText = await pushProgressToCloud(authSession, authUser, {
      learnedWords,
      masteredWords,
      customWords,
      wordProgress,
      wrongWords,
      studyHistory,
    })
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

  const handleModalLogout = async () => {
    await handleAuthLogout()
    showNotice('已退出登录。', 'info')
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

  const recordStudyEvent = (wordsLearnedDelta = 0, wordsMasteredDelta = 0, timeSpentDelta = 0) => {
    const today = new Date().toISOString().split('T')[0]
    setStudyHistory((prev) => {
      const safeList = normalizeStudyHistory(prev)
      const index = safeList.findIndex((item) => item.date === today)
      const nextList = [...safeList]
      if (index >= 0) {
        const item = nextList[index]
        nextList[index] = {
          ...item,
          wordsLearned: Number(item.wordsLearned || 0) + wordsLearnedDelta,
          wordsMastered: Number(item.wordsMastered || 0) + wordsMasteredDelta,
          timeSpent: Number(item.timeSpent || 0) + timeSpentDelta,
        }
      } else {
        nextList.push({
          date: today,
          wordsLearned: wordsLearnedDelta,
          wordsMastered: wordsMasteredDelta,
          timeSpent: timeSpentDelta,
        })
      }
      return nextList.slice(-90)
    })
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
    setView('home')
  }

  const handleOpenReadingList = () => {
    setAssessmentBackTarget('home')
    setSelectedReadingId(null)
    setHomePanelRequest((request) => ({ panel: 'reading', nonce: request.nonce + 1 }))
    setView('home')
  }

  const handleOpenTodayReview = () => {
    setAssessmentBackTarget('home')
    setView('todayReview')
  }

  const handleOpenWrongWords = () => {
    setAssessmentBackTarget('home')
    setView('wrongWords')
  }

  const handleOpenStatistics = () => {
    setView('statistics')
  }

  const handleOpenExamPractice = () => {
    setView('examPractice')
  }

  const handleStartExamPractice = (nextMode, scope = examScope) => {
    pendingStartWordIdRef.current = null
    setAssessmentBackTarget('examPractice')
    setExamScope(scope)
    setSelectedCategory('all')
    setSelectedToeflLevel('')
    setSelectedToeflList('')
    setSelectedIeltsTopic('')
    setSelectedIeltsList('')
    setCurrentIndex(0)
    setMode(nextMode)
    setView('learn')
  }

  const handleOpenReadingSession = (readingId) => {
    setSelectedReadingId(readingId)
    setView('readingSession')
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
    handleOpenReadingList()
  }

  const handleOpenModeFromReading = (nextMode) => {
    setAssessmentBackTarget('home')
    setMode(nextMode)
    setView('learn')
  }

  const handleOpenModeFromHome = (nextMode) => {
    pendingStartWordIdRef.current = null
    setAssessmentBackTarget('home')
    setSelectedCategory('all')
    setSelectedToeflLevel('')
    setSelectedToeflList('')
    setSelectedIeltsTopic('')
    setSelectedIeltsList('')
    setCurrentIndex(0)
    setMode(nextMode)
    setView('learn')
  }

  const handleOpenModeFromCollection = (nextMode) => {
    setAssessmentBackTarget('home')
    setMode(nextMode)
    setView('learn')
  }

  const handleLearningBack = () => {
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
    setLearnedWords([])
    setMasteredWords([])
    setWrongWords([])
    setWordProgress({})
    setStudyHistory([])
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
    allVocabulary.forEach((word) => {
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
    const ids = dedupeIdList([...learnedWords, ...masteredWords])
    return ids.map((id) => vocabularyMap.get(id)).filter(Boolean)
  }, [learnedWords, masteredWords, vocabularyMap])

  const todayReviewWordList = useMemo(() => {
    const dueWords = getWordsForReview(reviewBaseWordList, wordProgress)
    const uninitializedWords = reviewBaseWordList.filter((word) => !wordProgress?.[word.id])
    const seen = new Set()
    return [...dueWords, ...uninitializedWords].filter((word) => {
      const key = String(word.id)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [reviewBaseWordList, wordProgress])

  const wrongWordList = useMemo(
    () => wrongWords.map((id) => vocabularyMap.get(id)).filter(Boolean),
    [wrongWords, vocabularyMap]
  )

  const renderAuthModal = () => {
    if (!showAuthModal) return null

    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
        <button
          type="button"
          aria-label="关闭登录弹窗"
          className="absolute inset-0 bg-black/30"
          onClick={() => setShowAuthModal(false)}
        />
        <div className="relative w-full max-w-[680px] rounded-[16px] border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-[0_20px_45px_rgba(15,23,42,0.2)] md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-[var(--app-text)]">登录信息</h3>
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--app-border)] text-[var(--app-muted)] transition hover:border-[#0071e3] hover:bg-[#0071e3] hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="rounded-[12px] border border-[var(--app-border)] bg-[var(--app-soft)] p-3 text-center">
              <p className="text-2xl font-semibold text-[var(--app-text)]">{learnedWords.length}</p>
              <p className="text-sm text-[var(--app-muted)]">已学习单词</p>
            </div>
            <div className="rounded-[12px] border border-[#0071e3]/30 bg-[#0071e3] p-3 text-center">
              <p className="text-2xl font-semibold text-white">{masteredWords.length}</p>
              <p className="text-sm text-white/90">已掌握单词</p>
            </div>
          </div>

          <AuthPanel
            enabled={cloudEnabled}
            loading={authLoading}
            user={authUser}
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
          />
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
      view === 'todayReview' ||
      view === 'wrongWords' ||
      view === 'readingSession' ||
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
    onUserClick: () => setShowAuthModal(true),
    userLabel: authUser?.email ? '学习者' : authLoading ? '同步中' : '未登录',
  }

  const renderView = () => {
    switch (view) {
      case 'studyHub':
        return (
          <StudyHub
            onOpenWordStudy={handleOpenWordStudy}
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
            wordCount={wordCounts.all}
            readingCount={readingLibrary.length}
            reviewCount={todayReviewWordList.length}
            wrongCount={wrongWordList.length}
            todayWordsLearned={todayStudyStats.wordsLearned}
            todayWordsMastered={todayStudyStats.wordsMastered}
            suggestedReading={suggestedReading}
            isDarkTheme={isDark}
            onThemeToggle={toggleTheme}
          />
        )
      case 'examPractice':
        return (
          <ExamPracticeView
            onBack={handleBackToStudyHub}
            onHome={handleBackToStudyHub}
            onSelectMode={handleStartExamPractice}
            selectedScope={examScope}
            onSelectScope={setExamScope}
            learnedCount={learnedWords.length}
            masteredCount={masteredWords.length}
            totalCount={wordCounts.all}
            onSyncAccount={handleHomeSync}
            mode={mode}
            onOpenMode={(nextMode) => handleStartExamPractice(nextMode, examScope)}
            onOpenReading={handleOpenReadingList}
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
            mode={mode}
            onAuthLogin={handleAuthLogin}
            onAuthRegister={handleAuthRegister}
            onAuthLogout={handleAuthLogout}
            onAuthSyncNow={handleManualSync}
            showAuthPanel={false}
            isDarkTheme={isDark}
            onThemeToggle={toggleTheme}
            panelRequest={homePanelRequest}
          />
        )
      case 'readingSession':
        return (
          <ReadingSessionView
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
            onAddMastered={setWordAsMastered}
            onWrongAnswer={(id) => {
              addWrongWord(id)
              setWordAsLearned(id)
            }}
            categoryName={currentCategoryName}
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
            onUserClick={() => setShowAuthModal(true)}
            userLabel={authUser?.email ? '学习者' : authLoading ? '同步中' : '未登录'}
          />
        )
      case 'statistics':
        return (
          <div className="learn-refresh-page learn-refresh-page--dashboard">
            <header className="learn-refresh-topbar">
              <div className="learn-refresh-topbar-inner">
                <div className="learn-refresh-left-actions">
                  <button type="button" onClick={handleBackToStudyHub} className="learn-refresh-back">
                    <span>←</span>
                    <span>返回</span>
                  </button>
                  <button
                    type="button"
                    className="learn-refresh-home-btn"
                    onClick={handleBackToStudyHub}
                    aria-label="回到首页"
                  >
                    <span aria-hidden="true">🏠</span>
                  </button>
                </div>
                <div className="learn-refresh-progress">
                  <p className="learn-refresh-progress-main">学习统计</p>
                  <p className="learn-refresh-progress-sub">学习闭环</p>
                </div>
                <div className="learn-refresh-top-actions">
                  <button
                    type="button"
                    className="learn-refresh-icon-btn"
                    onClick={handleHomeSync}
                    aria-label="同步账号"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20 6v5h-5" />
                      <path d="M4 18v-5h5" />
                      <path d="M6.2 9A7 7 0 0118.5 7.5L20 11" />
                      <path d="M17.8 15A7 7 0 015.5 16.5L4 13" />
                    </svg>
                  </button>
                  <span className="learn-refresh-topbar-spacer" aria-hidden="true" />
                  <span className="learn-refresh-topbar-spacer" aria-hidden="true" />
                </div>
              </div>
            </header>
            <main className="learn-refresh-main learn-refresh-main--dashboard">
              <Statistics
                learnedWords={learnedWords}
                masteredWords={masteredWords}
                totalWords={allVocabulary.length}
                wrongWords={wrongWords}
                studyHistory={studyHistory}
                dueReviewCount={todayReviewWordList.length}
              />
            </main>
          </div>
        )
      case 'todayReview':
        return (
          <WordCollectionView
            title="🔁 今日复习"
            subtitle="这些是今天需要回顾的已学习或已掌握单词"
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
          />
        )
      case 'wrongWords':
        return (
          <WordCollectionView
            title="🧯 错题本"
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
          />
        )
      case 'learnedWords':
        return (
          <WordCollectionView
            title="📖 已学习单词"
            subtitle="这里会展示你标记为“已学习”的所有单词"
            words={learnedWordList}
            mode={mode}
            emptyHint="你还没有已学习单词，先进入学习模式标记一些吧。"
            onBack={handleBackToHome}
            onOpenMode={handleOpenModeFromCollection}
            onMarkAsMastered={markLearnedWordAsMastered}
            masteredActionLabel="认识了"
            onHome={handleBackToStudyHub}
            onSyncAccount={handleHomeSync}
            onOpenReading={handleOpenReadingList}
          />
        )
      case 'masteredWords':
        return (
          <WordCollectionView
            title="✅ 已掌握单词"
            subtitle="这里会展示你已经掌握的单词"
            words={masteredWordList}
            mode={mode}
            emptyHint="你还没有已掌握单词，继续练习后会出现在这里。"
            onBack={handleBackToHome}
            onOpenMode={handleOpenModeFromCollection}
            onMarkAsUnknown={markMasteredWordAsLearned}
            onHome={handleBackToStudyHub}
            onSyncAccount={handleHomeSync}
            onOpenReading={handleOpenReadingList}
          />
        )
      default:
        return null
    }
  }

  if (
    view === 'studyHub' ||
    view === 'home' ||
    view === 'learn' ||
    view === 'learnedWords' ||
    view === 'masteredWords' ||
    view === 'todayReview' ||
    view === 'wrongWords' ||
    view === 'readingSession' ||
    view === 'statistics' ||
    view === 'examPractice'
  ) {
    return (
      <div className={`min-h-screen ${appBackground}`}>
        {renderView()}
        {renderAuthModal()}
        {renderAuthTransitionOverlay()}
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${appBackground}`}>
      {renderView()}
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
