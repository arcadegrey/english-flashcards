import { useState, useEffect } from 'react'
import vocabulary from './data/vocabulary'
import Card from './components/Card'
import Quiz from './components/Quiz'
import Progress from './components/Progress'
import { storage } from './utils/storage'

function App() {
  const [mode, setMode] = useState('learn')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [learnedWords, setLearnedWords] = useState([])
  const [masteredWords, setMasteredWords] = useState([])
  const [shuffledWords, setShuffledWords] = useState([])

  useEffect(() => {
    const shuffled = [...vocabulary].sort(() => Math.random() - 0.5)
    setShuffledWords(shuffled)
    
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
    const shuffled = [...vocabulary].sort(() => Math.random() - 0.5)
    setShuffledWords(shuffled)
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 头部 - 顶部独立区域 */}
        <header className="text-center py-8 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-wide">📚 英语单词卡片</h1>
          <p className="text-white/70 text-lg">四六级核心词汇 · 高效记忆</p>
        </header>

        {/* 模式切换 - 独立一行 */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-3xl p-3 inline-flex gap-4 shadow-xl">
            <button
              onClick={() => setMode('learn')}
              className={`px-11 py-5 min-h-[50px] rounded-2xl font-black text-3xl transition-all ${
                mode === 'learn'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-xl scale-110'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🎯 学习模式
            </button>
            <button
              onClick={() => setMode('quiz')}
              className={`px-11 py-5 min-h-[50px] rounded-2xl font-black text-3xl transition-all ${
                mode === 'quiz'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-xl scale-110'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✏️ 测验模式
            </button>
          </div>
        </div>

        {/* 主内容区 - 独立大卡片 */}
        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-xl mb-12">
          {mode === 'learn' ? (
            <Card
              word={currentWord}
              onNext={nextCard}
              onPrev={prevCard}
              onMarkLearned={markAsLearned}
              onMarkMastered={markAsMastered}
              isLearned={learnedWords.includes(currentWord?.id)}
              isMastered={masteredWords.includes(currentWord?.id)}
            />
          ) : (
            <Quiz 
              vocabulary={vocabulary} 
              masteredWords={masteredWords}
              onAddMastered={(id) => {
                if (!masteredWords.includes(id)) {
                  setMasteredWords([...masteredWords, id])
                }
              }}
            />
          )}
        </div>

        {/* 进度追踪 - 底部独立区域，与主内容区分开 */}
        <div className="mb-12">
          <Progress
            total={vocabulary.length}
            learned={learnedWords.length}
            mastered={masteredWords.length}
            onReset={resetProgress}
          />
        </div>
      </div>
    </div>
  )
}

export default App
