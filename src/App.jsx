import { useState, useEffect, useMemo } from 'react'
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

const TOEFL_UNKNOWN_LEVEL = 'unknown'
const TOEFL_UNKNOWN_LIST = 'unknown'

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

  const currentWord = shuffledWords[currentIndex]

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId)
    if (categoryId !== 'toefl') {
      setSelectedToeflLevel('')
      setSelectedToeflList('')
    }
    setView('learn')
  }

  const openToeflLevels = () => {
    setSelectedCategory('toefl')
    setSelectedToeflLevel('')
    setSelectedToeflList('')
    setView('toeflLevels')
  }

  const handleToeflLevelSelect = (levelKey) => {
    setSelectedCategory('toefl')
    setSelectedToeflLevel(levelKey)
    setSelectedToeflList('')

    const nextLists = toeflGrouping.listsByLevel[levelKey] || []
    setView(nextLists.length > 0 ? 'toeflLists' : 'learn')
  }

  const handleToeflListSelect = (listKey) => {
    setSelectedCategory('toefl')
    setSelectedToeflList(listKey)
    setView('learn')
  }

  const handleStartAllToefl = () => {
    setSelectedCategory('toefl')
    setSelectedToeflLevel('')
    setSelectedToeflList('')
    setView('learn')
  }

  const handleStartCurrentLevel = () => {
    setSelectedCategory('toefl')
    setSelectedToeflList('')
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

  const prevCard = () => {
    if (shuffledWords.length === 0) return
    setCurrentIndex((prev) => (prev - 1 + shuffledWords.length) % shuffledWords.length)
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
    if (view === 'home') {
      return 'bg-[#f8fafc]'
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
            onNext={nextCard}
            onPrev={prevCard}
            onMarkLearned={markAsLearned}
            onMarkMastered={markAsMastered}
            isLearned={learnedWords.includes(currentWord?.id)}
            isMastered={masteredWords.includes(currentWord?.id)}
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

  return (
    <div className={`min-h-screen ${appBackground} py-8 px-4`}>
      <div className="w-full" style={{ maxWidth: '1200px', marginInline: 'auto' }}>
        {view === 'home' && (
          <div className="mb-8 w-full" style={{ maxWidth: '960px', marginInline: 'auto' }}>
            <div className="rounded-[14px] border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.08)]">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
