import { useState } from 'react'
import { speak } from '../utils/speech'

function Card({ word, total, currentIndex, onNext, onPrev, onMarkLearned, onMarkMastered, isLearned, isMastered }) {
  const [isFlipped, setIsFlipped] = useState(false)

  if (!word) return <div className="text-white text-center">加载中...</div>

  const speakWord = (e) => {
    e.stopPropagation()
    if (navigator.vibrate) {
      navigator.vibrate(10)
    }
    speak(word.word, { rate: 0.8 })
  }

  const speakExample = (e) => {
    e.stopPropagation()
    if (navigator.vibrate) {
      navigator.vibrate(10)
    }
    speak(word.example, { rate: 0.9 })
  }

  const handleFlip = () => {
    if (navigator.vibrate) {
      navigator.vibrate(5)
    }
    setIsFlipped(!isFlipped)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-white/80 text-lg">学习进度</span>
          <span className="text-white font-bold text-xl">{currentIndex + 1} / {total}</span>
        </div>
        <div className="w-full max-w-md h-3 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500 rounded-full"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>
        <div className="flex items-center gap-4 mt-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isMastered 
              ? 'bg-green-500/30 text-green-300' 
              : isLearned 
                ? 'bg-blue-500/30 text-blue-300' 
                : 'bg-purple-500/30 text-purple-300'
          }`}>
            {isMastered ? '✅ 已掌握' : isLearned ? '📖 已学习' : '🆕 新单词'}
          </span>
        </div>
      </div>

      <div
        className="relative h-[450px] cursor-pointer perspective-1000"
        onClick={handleFlip}
      >
        <div
          className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          <div
            className="absolute w-full h-full bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-10 flex flex-col items-center justify-center backface-hidden border border-white/20"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="text-base text-gray-400 mb-4">点击卡片翻转</p>
            <h2 className="text-7xl md:text-8xl font-black text-gray-800 mb-6 tracking-tight">{word.word}</h2>
            <p className="text-3xl text-gray-500 font-mono bg-gray-100 px-10 py-4 rounded-full">{word.phonetic}</p>
            <button
              onClick={speakWord}
              className="mt-8 px-10 py-5 min-h-[60px] bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full hover:from-purple-600 hover:to-indigo-600 transition-all shadow-xl hover:shadow-2xl font-bold text-2xl flex items-center gap-3"
            >
              <span class="text-3xl">🔊</span>
              <span>听发音</span>
            </button>
          </div>

          <div
            className="absolute w-full h-full bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center backface-hidden"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="text-white text-center space-y-5 w-full px-4">
              <span className="inline-block px-5 py-3 bg-white/15 backdrop-blur-sm rounded-full text-lg font-medium">
                {word.pos}
              </span>
              <p className="text-4xl md:text-5xl font-black leading-snug">{word.meaning}</p>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 w-full">
                <p className="text-white/95 text-xl md:text-2xl leading-relaxed">"{word.example}"</p>
                {word.exampleCn && (
                  <p className="text-white/80 text-lg md:text-xl mt-4 leading-relaxed">{word.exampleCn}</p>
                )}
                <button
                  onClick={speakExample}
                  className="mt-6 px-8 py-4 min-h-[50px] bg-white/25 hover:bg-white/35 rounded-full font-bold text-xl transition-all flex items-center gap-3 mx-auto"
                >
                  <span class="text-2xl">🔊</span>
                  <span>听例句</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center gap-4">
          <button
            onClick={onPrev}
            className="flex-1 max-w-[200px] px-8 py-5 min-h-[70px] bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-all font-bold text-2xl flex items-center justify-center gap-3 shadow-xl"
          >
            <span class="text-3xl">⬅️</span>
            <span>上一个</span>
          </button>
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex-1 max-w-[200px] px-8 py-5 min-h-[70px] bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all font-bold text-2xl flex items-center justify-center gap-3 shadow-2xl"
          >
            <span class="text-3xl">🔄</span>
            <span>翻转</span>
          </button>
          <button
            onClick={onNext}
            className="flex-1 max-w-[200px] px-8 py-5 min-h-[70px] bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-all font-bold text-2xl flex items-center justify-center gap-3 shadow-xl"
          >
            <span>下一个</span>
            <span class="text-3xl">➡️</span>
          </button>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={onMarkLearned}
            disabled={isLearned || isMastered}
            className={`flex-1 max-w-[250px] px-8 py-5 min-h-[70px] rounded-2xl font-bold text-2xl transition-all ${
              isLearned || isMastered
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-2xl'
            }`}
          >
            {isLearned ? '✓ 已学习' : '📖 标记为已学习'}
          </button>
          <button
            onClick={onMarkMastered}
            disabled={isMastered}
            className={`flex-1 max-w-[250px] px-8 py-5 min-h-[70px] rounded-2xl font-bold text-2xl transition-all ${
              isMastered
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-2xl'
            }`}
          >
            {isMastered ? '✓ 已掌握' : '✅ 标记为已掌握'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Card