import Card from './Card'
import Quiz from './Quiz'
import Progress from './Progress'

function LearningView({ 
  mode, 
  setMode, 
  currentWord, 
  filteredVocabulary, 
  currentIndex,
  onNext, 
  onPrev, 
  onMarkLearned, 
  onMarkMastered, 
  isLearned, 
  isMastered,
  masteredWords,
  onAddMastered,
  categoryName,
  learnedWords,
  resetProgress,
  onBack 
}) {
  return (
    <div className="min-h-screen">
      <header className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="group flex items-center gap-3 px-6 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-2xl transition-all duration-300 border border-white/20 hover:border-white/40"
          >
            <span className="text-2xl transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
            <span className="text-white font-bold text-lg">返回首页</span>
          </button>

          <div className="flex items-center gap-3 px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <span className="text-white/80 text-lg">当前分类：</span>
            <span className="font-bold text-white text-xl">{categoryName}</span>
            <span className="text-white/60 text-lg">({filteredVocabulary.length} 词)</span>
          </div>
        </div>
      </header>

      <div className="flex justify-center mb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-3 inline-flex gap-4 shadow-xl border border-white/20">
          <button
            onClick={() => setMode('learn')}
            className={`px-8 py-4 rounded-2xl font-black text-2xl transition-all duration-300 ${
              mode === 'learn'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-xl scale-105'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            🎯 学习模式
          </button>
          <button
            onClick={() => setMode('quiz')}
            className={`px-8 py-4 rounded-2xl font-black text-2xl transition-all duration-300 ${
              mode === 'quiz'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-xl scale-105'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            ✏️ 测验模式
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 mb-8">
          {mode === 'learn' ? (
            <Card
              word={currentWord}
              total={filteredVocabulary.length}
              onNext={onNext}
              onPrev={onPrev}
              onMarkLearned={onMarkLearned}
              onMarkMastered={onMarkMastered}
              isLearned={isLearned}
              isMastered={isMastered}
            />
          ) : (
            <Quiz 
              vocabulary={filteredVocabulary} 
              masteredWords={masteredWords}
              onAddMastered={onAddMastered}
            />
          )}
        </div>

        <Progress
          total={filteredVocabulary.length}
          learned={learnedWords.filter(id => filteredVocabulary.some(w => w.id === id)).length}
          mastered={masteredWords.filter(id => filteredVocabulary.some(w => w.id === id)).length}
          categoryName={categoryName}
          onReset={resetProgress}
        />
      </div>
    </div>
  )
}

export default LearningView
