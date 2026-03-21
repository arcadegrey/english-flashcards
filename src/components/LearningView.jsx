import { useState } from 'react';
import Card from './Card';
import Quiz from './Quiz';
import Progress from './Progress';
import FillBlank from './FillBlank';
import SpellingTest from './SpellingTest';
import VoiceSettings from './VoiceSettings';
import { useTheme } from '../context/ThemeContext';

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
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen">
      <header className={`max-w-5xl mx-auto px-4 py-6 ${isDark ? 'bg-gray-900/50' : ''} rounded-xl`}>
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className={`group flex items-center gap-2 px-5 py-3 rounded-2xl transition-all border ${
              isDark 
                ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700 text-white' 
                : 'bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border-white/20'
            }`}
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-bold">返回首页</span>
          </button>

          <div className={`hidden sm:flex items-center gap-2 px-5 py-3 rounded-2xl border ${
            isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white/10 backdrop-blur-md border-white/20'
          }`}>
            <span className={`${isDark ? 'text-gray-300' : 'text-white/70'}`}>当前分类：</span>
            <span className="font-bold text-white">{categoryName}</span>
            <span className={`${isDark ? 'text-gray-500' : 'text-white/50'}`}>({filteredVocabulary.length} 词)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-2xl transition-all border border-white/20"
              title={isDark ? '切换到浅色模式' : '切换到深色模式'}
            >
              <span className="text-2xl">{isDark ? '☀️' : '🌙'}</span>
            </button>
            <button
              onClick={() => setShowVoiceSettings(true)}
              className="flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-2xl transition-all border border-white/20"
              title="语音设置"
            >
              <span className="text-2xl">⚙️</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex justify-center mb-8 px-4">
        <div className={`rounded-3xl p-2 inline-flex gap-2 shadow-xl border ${
          isDark ? 'bg-gray-800/60 border-gray-700' : 'bg-white/10 backdrop-blur-md border-white/20'
        }`}>
          <button
            onClick={() => setMode('learn')}
            className={`px-5 py-3 rounded-2xl font-bold text-lg transition-all ${
              mode === 'learn'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            🎯 学习
          </button>
          <button
            onClick={() => setMode('quiz')}
            className={`px-5 py-3 rounded-2xl font-bold text-lg transition-all ${
              mode === 'quiz'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            ✏️ 测验
          </button>
          <button
            onClick={() => setMode('fillblank')}
            className={`px-5 py-3 rounded-2xl font-bold text-lg transition-all ${
              mode === 'fillblank'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            📝 填空
          </button>
          <button
            onClick={() => setMode('spelling')}
            className={`px-5 py-3 rounded-2xl font-bold text-lg transition-all ${
              mode === 'spelling'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            🔤 拼写
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className={`rounded-3xl p-8 md:p-12 shadow-2xl border mb-8 ${
          isDark ? 'bg-gray-800/60 border-gray-700' : 'bg-white/10 backdrop-blur-md border-white/20'
        }`}>
          {mode === 'learn' ? (
            <Card
              word={currentWord}
              total={filteredVocabulary.length}
              currentIndex={currentIndex}
              onNext={onNext}
              onPrev={onPrev}
              onMarkLearned={onMarkLearned}
              onMarkMastered={onMarkMastered}
              isLearned={isLearned}
              isMastered={isMastered}
            />
          ) : mode === 'quiz' ? (
            <Quiz 
              vocabulary={filteredVocabulary} 
              masteredWords={masteredWords}
              onAddMastered={onAddMastered}
            />
          ) : mode === 'fillblank' ? (
            <FillBlank vocabulary={filteredVocabulary} />
          ) : mode === 'spelling' ? (
            <SpellingTest vocabulary={filteredVocabulary} />
          ) : null}
        </div>

        <Progress
          total={filteredVocabulary.length}
          learned={learnedWords.filter(id => filteredVocabulary.some(w => w.id === id)).length}
          mastered={masteredWords.filter(id => filteredVocabulary.some(w => w.id === id)).length}
          categoryName={categoryName}
          onReset={resetProgress}
        />
      </div>

      {showVoiceSettings && (
        <VoiceSettings onClose={() => setShowVoiceSettings(false)} />
      )}
    </div>
  );
}

export default LearningView;