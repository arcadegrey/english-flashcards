import { useState, useEffect, useMemo } from 'react'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import vocabulary from './data/vocabulary'
import categories from './data/categories'
import Card from './components/Card'
import Quiz from './components/Quiz'
import Progress from './components/Progress'
import CategorySelector from './components/CategorySelector'
import HomeScreen from './components/HomeScreen'
import LearningView from './components/LearningView'
import Statistics from './components/Statistics'
import Calendar from './components/Calendar'
import WordCollectionView from './components/WordCollectionView'
import { storage } from './utils/storage'

function AppContent() {
  const { isDark } = useTheme()
  const [view, setView] = useState('home')
  const [mode, setMode] = useState('learn')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [learnedWords, setLearnedWords] = useState([])
  const [masteredWords, setMasteredWords] = useState([])
  const [shuffledWords, setShuffledWords] = useState([])

  const wordCounts = useMemo(() => {
    const counts = { all: vocabulary.length }
    vocabulary.forEach(word => {
      if (word.category) {
        counts[word.category] = (counts[word.category] || 0) + 1
      }
    })
    return counts
  }, [])

  const filteredVocabulary = useMemo(() => {
    if (selectedCategory === 'all') {
      return vocabulary
    }
    return vocabulary.filter(word => word.category === selectedCategory)
  }, [selectedCategory])

  useEffect(() => {
    const shuffled = [...filteredVocabulary].sort(() => Math.random() - 0.5)
    setShuffledWords(shuffled)
    setCurrentIndex(0)
  }, [filteredVocabulary])

  useEffect(() => {
    const savedLearned = storage.getLearnedWords()
    const savedMastered = storage.getMasteredWords()
    setLearnedWords(savedLearned)
    setMasteredWords(savedMastered)
  }, [])

  useEffect(() => {
    storage.setLearnedWords(learnedWords)
  }, [learnedWords])

  useEffect(() => {
    storage.setMasteredWords(masteredWords)
  }, [masteredWords])

  const currentWord = shuffledWords[currentIndex]

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId)
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
    setCurrentIndex((prev) => (prev + 1) % shuffledWords.length)
  }

  const prevCard = () => {
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
    const cat = categories.find(c => c.id === selectedCategory)
    return cat ? cat.name : '全部单词'
  }, [selectedCategory])

  const vocabularyMap = useMemo(() => {
    const map = new Map()
    vocabulary.forEach((word) => map.set(word.id, word))
    return map
  }, [])

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
      return isDark
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800'
        : 'bg-gradient-to-br from-indigo-900 via-violet-900 to-fuchsia-900'
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
            learnedWordIds={learnedWords}
            masteredWordIds={masteredWords}
            onOpenLearnedWords={() => setView('learnedWords')}
            onOpenMasteredWords={() => setView('masteredWords')}
          />
        )
      case 'learn':
        return (
          <LearningView
            mode={mode}
            setMode={setMode}
            allVocabulary={vocabulary}
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
              <Statistics learnedWords={learnedWords} masteredWords={masteredWords} />
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
      {view === 'home' && (
        <div className="max-w-7xl mx-auto mb-8 flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => setView('statistics')}
            className="px-6 py-3 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-2xl transition-all font-bold text-lg flex items-center gap-2 border border-white/20"
          >
            <span>📊</span>
            <span>统计</span>
          </button>
          <button
            onClick={() => setView('calendar')}
            className="px-6 py-3 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-2xl transition-all font-bold text-lg flex items-center gap-2 border border-white/20"
          >
            <span>📅</span>
            <span>日历</span>
          </button>
        </div>
      )}
      {renderView()}
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
