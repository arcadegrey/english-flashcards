import { useState, useEffect, useMemo } from 'react'
import vocabulary from './data/vocabulary'
import categories from './data/categories'
import Card from './components/Card'
import Quiz from './components/Quiz'
import Progress from './components/Progress'
import CategorySelector from './components/CategorySelector'
import HomeScreen from './components/HomeScreen'
import LearningView from './components/LearningView'
import { storage } from './utils/storage'

function App() {
  const [view, setView] = useState('home')
  const [mode, setMode] = useState('learn')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [learnedWords, setLearnedWords] = useState([])
  const [masteredWords, setMasteredWords] = useState([])
  const [shuffledWords, setShuffledWords] = useState([])

  // Calculate word counts for each category
  const wordCounts = useMemo(() => {
    const counts = { all: vocabulary.length }
    vocabulary.forEach(word => {
      if (word.category) {
        counts[word.category] = (counts[word.category] || 0) + 1
      }
    })
    return counts
  }, [])

  // Filter vocabulary by selected category
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

  // 标记为已学习
  const markAsLearned = () => {
    if (currentWord && !learnedWords.includes(currentWord.id)) {
      setLearnedWords([...learnedWords, currentWord.id])
    }
    nextCard()
  }

  // 标记为已掌握
  const markAsMastered = () => {
    if (currentWord && !masteredWords.includes(currentWord.id)) {
      setMasteredWords([...masteredWords, currentWord.id])
    }
    nextCard()
  }

  // 下一张卡片
  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % shuffledWords.length)
  }

  // 上一张卡片
  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + shuffledWords.length) % shuffledWords.length)
  }

  // 重置进度
  const resetProgress = () => {
    setLearnedWords([])
    setMasteredWords([])
    setCurrentIndex(0)
    storage.clear()
    const shuffled = [...filteredVocabulary].sort(() => Math.random() - 0.5)
    setShuffledWords(shuffled)
  }

  // 获取当前分类名称
  const currentCategoryName = useMemo(() => {
    const cat = categories.find(c => c.id === selectedCategory)
    return cat ? cat.name : '全部单词'
  }, [selectedCategory])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8 px-4">
      {view === 'home' ? (
        <HomeScreen 
          onCategorySelect={handleCategorySelect}
          wordCounts={wordCounts}
        />
      ) : (
        <LearningView
          mode={mode}
          setMode={setMode}
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
      )}
    </div>
  )
}

export default App