import { useState, useEffect } from 'react'
import { speak } from '../utils/speech'

function Quiz({ vocabulary, masteredWords, onAddMastered }) {
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [options, setOptions] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [score, setScore] = useState(0)
  const [questionCount, setQuestionCount] = useState(0)
  const [streak, setStreak] = useState(0)

  // 生成新题目
  const generateQuestion = () => {
    const correctIndex = Math.floor(Math.random() * vocabulary.length)
    const correctWord = vocabulary[correctIndex]

    const wrongOptions = []
    while (wrongOptions.length < 3) {
      const randomIndex = Math.floor(Math.random() * vocabulary.length)
      if (randomIndex !== correctIndex && !wrongOptions.includes(vocabulary[randomIndex])) {
        wrongOptions.push(vocabulary[randomIndex])
      }
    }

    const allOptions = [correctWord, ...wrongOptions].sort(() => Math.random() - 0.5)

    setCurrentQuestion(correctWord)
    setOptions(allOptions)
    setSelectedAnswer(null)
    setIsCorrect(null)
  }

  useEffect(() => {
    generateQuestion()
  }, [])

  const handleAnswer = (word) => {
    if (selectedAnswer) return

    setSelectedAnswer(word)
    const correct = word.id === currentQuestion.id
    setIsCorrect(correct)

    if (correct) {
      setScore(score + 1)
      setStreak(streak + 1)
      onAddMastered(currentQuestion.id)
    } else {
      setStreak(0)
    }

    setTimeout(() => {
      setQuestionCount(questionCount + 1)
      generateQuestion()
    }, 1500)
  }

  if (!currentQuestion) return <div className="text-gray-500 text-center">加载中...</div>

  return (
    <div className="space-y-8">
      {/* 得分统计 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border-2 border-blue-300 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📊</span>
            <span className="text-gray-700 font-bold text-lg">得分</span>
          </div>
          <p className="text-4xl font-black text-blue-600">{score}</p>
          <p className="text-gray-600 font-bold text-xs mt-1">/ {questionCount} 题</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-5 border-2 border-orange-300 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🔥</span>
            <span className="text-gray-700 font-bold text-lg">连击</span>
          </div>
          <p className={`text-4xl font-black ${streak >= 5 ? 'text-yellow-600' : 'text-orange-600'}`}>
            {streak} 连对
          </p>
          <p className="text-gray-600 font-bold text-xs mt-1">
            {streak >= 10 ? '🔥🔥🔥 太厉害了！' : streak >= 5 ? '🔥 继续加油！' : '再接再厉！'}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border-2 border-green-300 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🎯</span>
            <span className="text-gray-700 font-bold text-lg">正确率</span>
          </div>
          <p className="text-4xl font-black text-green-600">
            {questionCount > 0 ? Math.round((score / questionCount) * 100) : 0}%
          </p>
          <p className="text-gray-600 font-bold text-xs mt-1">
            {questionCount > 0 ? (score / questionCount >= 0.8 ? '太棒了！' : '继续练习！') : '开始答题吧！'}
          </p>
        </div>
      </div>

      {/* 题目卡片 */}
      <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-200">
        <p className="text-gray-500 text-center mb-6 text-lg font-medium">请选择正确的释义</p>
        <h2 className="text-6xl md:text-7xl font-bold text-gray-800 text-center mb-6 tracking-tight">
          {currentQuestion.word}
        </h2>
        <p className="text-2xl text-gray-500 text-center font-mono bg-gray-100 inline-block mx-auto px-8 py-3 rounded-full">
          {currentQuestion.phonetic}
        </p>
        
        <button
          onClick={(e) => {
            e.stopPropagation()
            speak(currentQuestion.word, { rate: 0.8 })
          }}
          className="mt-8 mx-auto block px-11 py-5 min-h-[56px] bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full hover:from-purple-600 hover:to-indigo-600 transition-all shadow-xl hover:shadow-2xl font-black text-3xl flex items-center gap-4"
        >
          <span class="text-4xl">🔊</span>
          <span>听发音</span>
        </button>
      </div>

      {/* 选项 */}
      <div className="grid grid-cols-1 gap-5">
        {options.map((option, index) => {
          let buttonClass = 'bg-white hover:bg-gray-50 text-gray-800 border-2 border-transparent'
          
          if (selectedAnswer) {
            if (option.id === currentQuestion.id) {
              buttonClass = 'bg-green-500 text-white border-green-400 shadow-xl shadow-green-500/30'
            } else if (option.id === selectedAnswer.id) {
              buttonClass = 'bg-red-500 text-white border-red-400 shadow-xl shadow-red-500/30'
            } else {
              buttonClass = 'bg-gray-100 text-gray-400'
            }
          }

          return (
            <button
              key={option.id}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`px-8 py-8 min-h-[90px] rounded-3xl font-black text-8xl transition-all text-center shadow-xl hover:shadow-2xl ${buttonClass} ${
                !selectedAnswer ? 'hover:scale-[1.03] active:scale-[0.97]' : ''
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                <span className={`inline-flex w-20 h-20 rounded-2xl font-black text-5xl items-center justify-center ${
                  selectedAnswer 
                    ? 'bg-white/20' 
                    : 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg'
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="leading-relaxed">{option.meaning}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* 反馈信息 */}
      {selectedAnswer && (
        <div className={`text-center p-6 rounded-2xl backdrop-blur-sm border ${
          isCorrect 
            ? 'bg-green-500/20 border-green-500/30' 
            : 'bg-red-500/20 border-red-500/30'
        }`}>
          <p className={`text-3xl font-bold mb-2 ${
            isCorrect ? 'text-green-300' : 'text-red-300'
          }`}>
            {isCorrect ? '🎉 回答正确！' : '❌ 回答错误'}
          </p>
          {!isCorrect && (
            <p className="text-white/80 text-lg">
              <span className="opacity-70">正确答案：</span> {currentQuestion.meaning}
            </p>
          )}
        </div>
      )}

      {/* 已掌握进度 */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/70">📚 已掌握单词</span>
          <span className="text-white font-bold text-lg">{masteredWords.length} / {vocabulary.length}</span>
        </div>
        <div className="h-4 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-emerald-400 transition-all duration-500"
            style={{ width: `${(masteredWords.length / vocabulary.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default Quiz
