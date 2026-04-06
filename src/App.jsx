import { useState, useEffect, useMemo, useRef } from 'react'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import vocabulary from './data/vocabulary'
import categories from './data/categories'
import HomeScreen from './components/HomeScreen'
import LearningView from './components/LearningView'
import Statistics from './components/Statistics'
import Calendar from './components/Calendar'
import WordCollectionView from './components/WordCollectionView'
import ToeflSelectionView from './components/ToeflSelectionView'
import { storage } from './utils/storage'
import {
  fetchCurrentUser,
  isCloudAuthConfigured,
  loadCloudProgress,
  refreshSession,
  signInWithEmail,
  signOut,
  signUpWithEmail,
  upsertCloudProgress,
} from './utils/cloudAuth'

const TOEFL_UNKNOWN_LEVEL = 'unknown'
const TOEFL_UNKNOWN_LIST = 'unknown'
const NAVIGATION_STATE_KEY = 'english_flashcards_navigation_v1'

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
  const keys = ['phonetic', 'pos', 'meaning', 'example', 'exampleCn', 'category', 'level', 'list']
  return keys.reduce((count, key) => {
    const value = String(word[key] ?? '').trim()
    return value ? count + 1 : count
  }, 0)
}

const pickRicherWord = (currentWord, incomingWord) => {
  if (!currentWord) return incomingWord
  if (!incomingWord) return currentWord
  return countFilledFields(incomingWord) >= countFilledFields(currentWord) ? incomingWord : currentWord
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

const mergeProgress = (localProgress, cloudProgress) => ({
  learnedWords: dedupeIdList([...(cloudProgress.learnedWords || []), ...(localProgress.learnedWords || [])]),
  masteredWords: dedupeIdList([...(cloudProgress.masteredWords || []), ...(localProgress.masteredWords || [])]),
  customWords: mergeCustomWordList(cloudProgress.customWords || [], localProgress.customWords || []),
})

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
  if (!word || word.category !== 'toefl') {
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
  const { isDark } = useTheme()

  const [view, setView] = useState('home')
  const [mode, setMode] = useState('learn')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedToeflLevel, setSelectedToeflLevel] = useState('')
  const [selectedToeflList, setSelectedToeflList] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [learnedWords, setLearnedWords] = useState([])
  const [masteredWords, setMasteredWords] = useState([])
  const [customWords, setCustomWords] = useState([])
  const [shuffledWords, setShuffledWords] = useState([])
  const historyReadyRef = useRef(false)
  const restoringFromHistoryRef = useRef(false)
  const pendingStartWordIdRef = useRef(null)
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

  const allVocabulary = useMemo(() => [...vocabulary, ...customWords], [customWords])

  const wordCounts = useMemo(() => {
    const counts = { all: allVocabulary.length }
    allVocabulary.forEach((word) => {
      if (word.category) {
        counts[word.category] = (counts[word.category] || 0) + 1
      }
    })
    return counts
  }, [allVocabulary])

  const filteredVocabulary = useMemo(() => {
    if (selectedCategory === 'all') {
      return allVocabulary
    }

    let filtered = allVocabulary.filter((word) => word.category === selectedCategory)
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
  }, [allVocabulary, selectedCategory, selectedToeflLevel, selectedToeflList])

  const toeflGrouping = useMemo(() => {
    const levelBuckets = new Map()

    allVocabulary.forEach((word) => {
      if (word.category !== 'toefl') return

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
  }, [allVocabulary])

  const toeflListsForSelectedLevel = useMemo(() => {
    if (!selectedToeflLevel) {
      return []
    }
    return toeflGrouping.listsByLevel[selectedToeflLevel] || []
  }, [selectedToeflLevel, toeflGrouping.listsByLevel])

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

    setLearnedWords(savedLearned)
    setMasteredWords(savedMastered)
    setCustomWords(Array.isArray(savedCustomWords) ? savedCustomWords : [])
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
    return () => {
      if (cloudSyncTimerRef.current) {
        clearTimeout(cloudSyncTimerRef.current)
      }
    }
  }, [])

  const applyMergedProgress = (mergedProgress, { skipNextPush = false } = {}) => {
    if (skipNextPush) {
      skipNextCloudPushRef.current = true
    }

    setLearnedWords(mergedProgress.learnedWords)
    setMasteredWords(mergedProgress.masteredWords)
    setCustomWords(mergedProgress.customWords)

    storage.setLearnedWords(mergedProgress.learnedWords)
    storage.setMasteredWords(mergedProgress.masteredWords)
    storage.setCustomWords(mergedProgress.customWords)
  }

  const pushProgressToCloud = async (session, user, progress) => {
    if (!cloudEnabled || !session?.access_token || !user?.id) return ''

    setSyncState('syncing')
    setSyncError('')

    const syncedAtIso = await upsertCloudProgress({
      userId: user.id,
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      progress,
    })

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
  }

  const hydrateFromCloud = async ({ session, user }) => {
    if (!cloudEnabled || !session?.access_token || !user?.id) return

    const cloudProgress = await loadCloudProgress({
      userId: user.id,
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
    })

    const merged = mergeProgress(
      {
        learnedWords,
        masteredWords,
        customWords,
      },
      cloudProgress
    )

    applyMergedProgress(merged, { skipNextPush: true })
    cloudHydratedRef.current = true
    await pushProgressToCloud(session, user, merged)
  }

  const ensureFreshSession = async (session) => {
    if (!session?.access_token) return null

    const now = Math.floor(Date.now() / 1000)
    const expiresAt = Number(session.expires_at || 0)
    if (expiresAt && expiresAt - now > 60) {
      return session
    }

    if (!session.refresh_token) {
      return null
    }

    const refreshed = await refreshSession(session.refresh_token)
    return refreshed.session
  }

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
          (await fetchCurrentUser(activeSession.access_token, activeSession.refresh_token))

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
      } finally {
        setAuthLoading(false)
      }
    }

    bootstrap()
  }, [cloudEnabled, customWords, learnedWords, localDataLoaded, masteredWords])

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
  }, [authLoading, authSession, authUser, cloudEnabled, customWords, learnedWords, masteredWords])

  const handleAuthLogin = async ({ email, password }) => {
    if (!cloudEnabled) {
      throw new Error('云端账号服务未配置')
    }

    setAuthError('')
    const { session, user } = await signInWithEmail({ email, password })
    storage.setAuthSession(session)
    setAuthSession(session)
    setAuthUser(user)
    await hydrateFromCloud({ session, user })
    return { message: '登录成功，进度已同步。', sessionReady: true }
  }

  const handleAuthRegister = async ({ email, password, verificationCode }) => {
    if (!cloudEnabled) {
      throw new Error('云端账号服务未配置')
    }

    setAuthError('')
    const { session, user, emailConfirmationRequired, message } = await signUpWithEmail({
      email,
      password,
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
  }

  const handleAuthLogout = async () => {
    if (authSession?.access_token) {
      try {
        await signOut(authSession.access_token)
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
    })
    return { message: syncedAtText ? `同步完成（${syncedAtText}）` : '同步完成。' }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const initialState = {
      __appNavigation: NAVIGATION_STATE_KEY,
      view,
      mode,
      selectedCategory,
      selectedToeflLevel,
      selectedToeflList,
    }

    window.history.replaceState(initialState, '', window.location.href)
    historyReadyRef.current = true

    const handlePopState = (event) => {
      const state = event.state
      restoringFromHistoryRef.current = true

      if (!state || state.__appNavigation !== NAVIGATION_STATE_KEY) {
        setView('home')
        setMode('learn')
        setSelectedCategory('all')
        setSelectedToeflLevel('')
        setSelectedToeflList('')
        return
      }

      setView(typeof state.view === 'string' ? state.view : 'home')
      setMode(typeof state.mode === 'string' ? state.mode : 'learn')
      setSelectedCategory(typeof state.selectedCategory === 'string' ? state.selectedCategory : 'all')
      setSelectedToeflLevel(
        typeof state.selectedToeflLevel === 'string' ? state.selectedToeflLevel : ''
      )
      setSelectedToeflList(typeof state.selectedToeflList === 'string' ? state.selectedToeflList : '')
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
      currentState.selectedToeflList === nextState.selectedToeflList

    if (isSameState) return
    window.history.pushState(nextState, '', window.location.href)
  }, [view, mode, selectedCategory, selectedToeflLevel, selectedToeflList])

  const currentWord = shuffledWords[currentIndex]

  const handleCategorySelect = (categoryId, options = {}) => {
    pendingStartWordIdRef.current = options.focusWordId ?? null
    setSelectedCategory(categoryId)
    if (categoryId !== 'toefl') {
      setSelectedToeflLevel('')
      setSelectedToeflList('')
    }
    setMode('learn')
    setView('learn')
  }

  const openToeflLevels = () => {
    pendingStartWordIdRef.current = null
    setSelectedCategory('toefl')
    setSelectedToeflLevel('')
    setSelectedToeflList('')
    setView('toeflLevels')
  }

  const handleToeflLevelSelect = (levelKey) => {
    pendingStartWordIdRef.current = null
    setSelectedCategory('toefl')
    setSelectedToeflLevel(levelKey)
    setSelectedToeflList('')

    const nextLists = toeflGrouping.listsByLevel[levelKey] || []
    if (nextLists.length === 0) {
      setMode('learn')
    }
    setView(nextLists.length > 0 ? 'toeflLists' : 'learn')
  }

  const handleToeflListSelect = (listKey) => {
    pendingStartWordIdRef.current = null
    setSelectedCategory('toefl')
    setSelectedToeflList(listKey)
    setMode('learn')
    setView('learn')
  }

  const handleStartAllToefl = () => {
    pendingStartWordIdRef.current = null
    setSelectedCategory('toefl')
    setSelectedToeflLevel('')
    setSelectedToeflList('')
    setMode('learn')
    setView('learn')
  }

  const handleStartCurrentLevel = () => {
    pendingStartWordIdRef.current = null
    setSelectedCategory('toefl')
    setSelectedToeflList('')
    setMode('learn')
    setView('learn')
  }

  const handleBackToHome = () => {
    setView('home')
  }

  const markAsLearned = () => {
    if (currentWord && !learnedWords.includes(currentWord.id)) {
      setLearnedWords([...learnedWords, currentWord.id])
    }
    nextCard()
  }

  const markAsMastered = () => {
    if (currentWord && !masteredWords.includes(currentWord.id)) {
      setMasteredWords([...masteredWords, currentWord.id])
    }
    nextCard()
  }

  const nextCard = () => {
    if (shuffledWords.length === 0) return
    setCurrentIndex((prev) => (prev + 1) % shuffledWords.length)
  }

  const resetProgress = () => {
    setLearnedWords([])
    setMasteredWords([])
    setCurrentIndex(0)
    storage.clear()
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

    const cat = categories.find((c) => c.id === selectedCategory)
    return cat ? cat.name : '全部单词'
  }, [selectedCategory, selectedToeflLevel, selectedToeflList])

  const vocabularyMap = useMemo(() => {
    const map = new Map()
    allVocabulary.forEach((word) => map.set(word.id, word))
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

  const appBackground = useMemo(() => {
    if (view === 'home' || view === 'toeflLevels' || view === 'toeflLists') {
      return 'bg-[#f8fafc]'
    }

    if (view === 'learn') {
      return 'bg-[#fbfbfd]'
    }

    return isDark
      ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900'
      : 'bg-gradient-to-br from-slate-100 via-sky-50 to-indigo-100'
  }, [isDark, view])

  const renderView = () => {
    switch (view) {
      case 'home':
        return (
          <HomeScreen
            onCategorySelect={handleCategorySelect}
            wordCounts={wordCounts}
            vocabularyData={allVocabulary}
            learnedWordIds={learnedWords}
            masteredWordIds={masteredWords}
            onOpenLearnedWords={() => setView('learnedWords')}
            onOpenMasteredWords={() => setView('masteredWords')}
            onOpenToeflLevels={openToeflLevels}
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
            onAuthLogin={handleAuthLogin}
            onAuthRegister={handleAuthRegister}
            onAuthLogout={handleAuthLogout}
            onAuthSyncNow={handleManualSync}
          />
        )
      case 'toeflLevels':
        return (
          <ToeflSelectionView
            mode="level"
            title="🌍 托福词汇分级"
            subtitle="先选择 Level，再进入对应 List；也可以直接学习全部托福词汇。"
            items={toeflGrouping.levels}
            totalCount={toeflGrouping.total}
            onBack={handleBackToHome}
            onSelect={handleToeflLevelSelect}
            onSelectAll={handleStartAllToefl}
            selectAllLabel="学习全部托福词汇"
          />
        )
      case 'toeflLists': {
        const levelLabel =
          selectedToeflLevel === TOEFL_UNKNOWN_LEVEL ? '未分级' : `Level ${selectedToeflLevel}`
        const totalForLevel = toeflListsForSelectedLevel.reduce((sum, item) => sum + item.count, 0)

        return (
          <ToeflSelectionView
            mode="list"
            title={`📘 ${levelLabel}`}
            subtitle="选择 List 开始学习，或者直接学习当前 Level 全部词汇。"
            items={toeflListsForSelectedLevel}
            totalCount={totalForLevel}
            onBack={() => setView('toeflLevels')}
            onSelect={handleToeflListSelect}
            onSelectAll={handleStartCurrentLevel}
            selectAllLabel={`学习${levelLabel}全部词汇`}
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
            onAddMastered={(id) => {
              if (!masteredWords.includes(id)) {
                setMasteredWords([...masteredWords, id])
              }
            }}
            categoryName={currentCategoryName}
            learnedWords={learnedWords}
            resetProgress={resetProgress}
            onBack={handleBackToHome}
          />
        )
      case 'statistics':
        return (
          <div className="min-h-screen py-8 px-4">
            <div className="max-w-5xl mx-auto">
              <button
                onClick={handleBackToHome}
                className="mb-6 flex items-center gap-3 px-6 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-2xl transition-all duration-300 border border-white/20 hover:border-white/40"
              >
                <span className="text-2xl">←</span>
                <span className="text-white font-bold text-lg">返回首页</span>
              </button>
              <Statistics
                learnedWords={learnedWords}
                masteredWords={masteredWords}
                totalWords={allVocabulary.length}
              />
            </div>
          </div>
        )
      case 'calendar':
        return (
          <div className="min-h-screen py-8 px-4">
            <div className="max-w-5xl mx-auto">
              <button
                onClick={handleBackToHome}
                className="mb-6 flex items-center gap-3 px-6 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-2xl transition-all duration-300 border border-white/20 hover:border-white/40"
              >
                <span className="text-2xl">←</span>
                <span className="text-white font-bold text-lg">返回首页</span>
              </button>
              <Calendar />
            </div>
          </div>
        )
      case 'learnedWords':
        return (
          <WordCollectionView
            title="📖 已学习单词"
            subtitle="这里会展示你标记为“已学习”的所有单词"
            words={learnedWordList}
            emptyHint="你还没有已学习单词，先进入学习模式标记一些吧。"
            onBack={handleBackToHome}
          />
        )
      case 'masteredWords':
        return (
          <WordCollectionView
            title="✅ 已掌握单词"
            subtitle="这里会展示你已经掌握的单词"
            words={masteredWordList}
            emptyHint="你还没有已掌握单词，继续练习后会出现在这里。"
            onBack={handleBackToHome}
          />
        )
      default:
        return null
    }
  }

  if (view === 'learn') {
    return <div className={`min-h-screen ${appBackground}`}>{renderView()}</div>
  }

  return (
    <div className={`min-h-screen ${appBackground} py-8 px-4`}>
      <div className="w-full" style={{ maxWidth: '1200px', marginInline: 'auto' }}>
        {view === 'home' && (
          <div className="mb-8 w-full" style={{ maxWidth: '960px', marginInline: 'auto' }}>
            <div className="rounded-[14px] border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.08)]">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setView('statistics')}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] border border-[#d1d5db] bg-white px-4 py-2 text-base font-semibold text-[#111827] transition duration-200 hover:border-[#0071e3] hover:bg-[#0071e3] hover:text-white"
                >
                  <span>📊</span>
                  <span>统计</span>
                </button>
                <button
                  onClick={() => setView('calendar')}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] border border-[#d1d5db] bg-white px-4 py-2 text-base font-semibold text-[#111827] transition duration-200 hover:border-[#0071e3] hover:bg-[#0071e3] hover:text-white"
                >
                  <span>📅</span>
                  <span>日历</span>
                </button>
              </div>
            </div>
          </div>
        )}
        {renderView()}
      </div>
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
