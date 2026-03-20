import { useState } from 'react'
import { speak } from '../utils/speech'

function Card({ word, total, onNext, onPrev, onMarkLearned, onMarkMastered, isLearned, isMastered }) {
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
      {/* 卡片进度 - 顶部独立行 */}
      <div className="flex justify-between items-center bg-white/5 rounded-xl px-6 py-4">
        <span className="text-white/70">
          单词 <span className="text-white font-bold text-lg">{word.id}</span> / {total}
        </span>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
          isMastered 
            ? 'bg-green-500/20 text-green-300' 
            : isLearned 
              ? 'bg-blue-500/20 text-blue-300' 
              : 'bg-purple-500/20 text-purple-300'
        }`}>
          {isMastered ? '✅ 已掌握' : isLearned ? '📖 已学习' : '🆕 新单词'}
        </span>
      </div>

      {/* 翻转卡片 - 更大尺寸 */}
      <div
        className="relative h-[400px] cursor-pointer perspective-1000"
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
          {/* 正面 - 单词 */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center backface-hidden border border-white/20"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="text-sm text-gray-400 mb-4">点击卡片翻转</p>
            <h2 className="text-6xl md:text-7xl font-bold text-gray-800 mb-6 tracking-tight">{word.word}</h2>
            <p className="text-2xl text-gray-500 font-mono bg-gray-100 px-8 py-3 rounded-full">{word.phonetic}</p>
            <button
              onClick={speakWord}
              className="mt-8 px-11 py-5 min-h-[56px] bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full hover:from-purple-600 hover:to-indigo-600 transition-all shadow-xl hover:shadow-2xl font-black text-3xl flex items-center gap-4"
            >
              <span class="text-4xl">🔊</span>
              <span>听发音</span>
            </button>
          </div>

          {/* 反面 - 释义 */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center backface-hidden"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="text-white text-center space-y-6 max-w-md">
              <span className="inline-block px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-sm font-medium">
                {word.pos}
              </span>
              <p className="text-3xl font-bold leading-relaxed">{word.meaning}</p>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mt-4 border border-white/10">
                <p className="text-white/95 text-lg italic leading-relaxed">"{word.example}"</p>
                {word.exampleCn && (
                  <p className="text-white/80 text-base mt-3 leading-relaxed">{word.exampleCn}</p>
                )}
                <button
                  onClick={speakExample}
                  className="mt-6 px-8 py-4 min-h-[50px] bg-white/25 hover:bg-white/35 rounded-full font-black text-2xl transition-all flex items-center gap-3 mx-auto"
                >
                  <span class="text-3xl">🔊</span>
                  <span>听例句</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 控制按钮 - 分组布局 */}
      <div className="space-y-6">
        {/* 导航按钮 */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onPrev}
            className="flex-1 max-w-[200px] px-8 py-5 min-h-[70px] bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-all font-black text-6xl flex items-center justify-center gap-3 shadow-xl"
          >
            <span class="text-7xl">⬅️</span>
            <span>上一个</span>
          </button>
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex-1 max-w-[200px] px-8 py-5 min-h-[70px] bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all font-black text-6xl flex items-center justify-center gap-3 shadow-2xl"
          >
            <span class="text-7xl">🔄</span>
            <span>翻转</span>
          </button>
          <button
            onClick={onNext}
            className="flex-1 max-w-[200px] px-8 py-5 min-h-[70px] bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-all font-black text-6xl flex items-center justify-center gap-3 shadow-xl"
          >
            <span>下一个</span>
            <span class="text-7xl">➡️</span>
          </button>
        </div>

        {/* 学习状态按钮 */}
        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={onMarkLearned}
            disabled={isLearned || isMastered}
            className={`flex-1 max-w-[250px] px-8 py-5 min-h-[70px] rounded-2xl font-black text-6xl transition-all ${
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
            className={`flex-1 max-w-[250px] px-8 py-5 min-h-[70px] rounded-2xl font-black text-6xl transition-all ${
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
