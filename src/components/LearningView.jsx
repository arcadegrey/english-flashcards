import { useMemo, useState } from 'react';
import Card from './Card';
import Quiz from './Quiz';
import Progress from './Progress';
import FillBlank from './FillBlank';
import SpellingTest from './SpellingTest';
import VoiceSettings from './VoiceSettings';
import { useTheme } from '../context/ThemeContext';

const MODE_OPTIONS = [
  { id: 'learn', icon: '🎯', label: '学习' },
  { id: 'quiz', icon: '✏️', label: '测验' },
  { id: 'fillblank', icon: '🧩', label: '填空' },
  { id: 'spelling', icon: '🔤', label: '拼写' },
];

function LearningView({
  mode,
  setMode,
  allVocabulary,
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
  onBack,
}) {
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const learnedWordSet = useMemo(() => new Set(learnedWords), [learnedWords]);
  const learnedVocabulary = useMemo(
    () => allVocabulary.filter((word) => learnedWordSet.has(word.id)),
    [allVocabulary, learnedWordSet]
  );
  const useLearnedPool = learnedVocabulary.length > 0;
  const quizVocabulary = useLearnedPool ? learnedVocabulary : allVocabulary;
  const quizSourceLabel = useLearnedPool ? '已学习词库' : '随机测验 · 全词库';

  const shellClass = isDark
    ? 'border-slate-800 bg-slate-900/86 text-slate-100 shadow-[0_18px_60px_rgba(2,6,23,0.55)]'
    : 'border-slate-200/85 bg-white/86 text-slate-700 shadow-[0_20px_55px_rgba(15,23,42,0.12)]';
  const actionButtonClass = isDark
    ? 'border-slate-700 bg-slate-800/80 text-slate-200 hover:border-slate-600 hover:bg-slate-800'
    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50';
  const tabShellClass = isDark
    ? 'border-slate-800 bg-slate-950/65'
    : 'border-slate-200/85 bg-slate-100/90';
  const activeTabClass = isDark
    ? 'bg-cyan-300 text-slate-900 shadow-[0_10px_24px_rgba(34,211,238,0.38)]'
    : 'bg-slate-900 text-white shadow-[0_10px_24px_rgba(15,23,42,0.26)]';
  const idleTabClass = isDark
    ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
    : 'text-slate-500 hover:bg-white hover:text-slate-900';

  return (
    <div className="min-h-screen pb-12">
      <header className="mx-auto max-w-6xl px-4 pt-5 md:pt-7">
        <div className={`rounded-[28px] border px-4 py-4 backdrop-blur-xl md:px-6 md:py-5 ${shellClass}`}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onBack}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${actionButtonClass}`}
              >
                <span>←</span>
                <span>返回首页</span>
              </button>

              <div
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm ${
                  isDark ? 'border-slate-700 bg-slate-800/70 text-slate-200' : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <span className="uppercase tracking-[0.15em] text-xs opacity-75">Category</span>
                <span className="font-semibold text-base">{categoryName}</span>
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                  {filteredVocabulary.length} 词
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowVoiceSettings(true)}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${actionButtonClass}`}
                title="语音设置"
              >
                <span>🔊</span>
                <span>语音</span>
              </button>
              <button
                onClick={toggleTheme}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${actionButtonClass}`}
                title={isDark ? '切换到浅色模式' : '切换到深色模式'}
              >
                <span>{isDark ? '☀️' : '🌙'}</span>
                <span>{isDark ? '浅色' : '深色'}</span>
              </button>
            </div>
          </div>

          <div className={`mt-4 rounded-2xl border p-1.5 ${tabShellClass}`}>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {MODE_OPTIONS.map((item) => {
                const isActive = mode === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setMode(item.id)}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                      isActive ? activeTabClass : idleTabClass
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto mt-6 max-w-6xl px-4">
        <div className={`rounded-[30px] border p-4 backdrop-blur-xl md:p-8 ${shellClass}`}>
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
              vocabulary={quizVocabulary}
              optionVocabulary={allVocabulary}
              sourceLabel={quizSourceLabel}
              masteredWords={masteredWords}
              onAddMastered={onAddMastered}
            />
          ) : mode === 'fillblank' ? (
            <FillBlank vocabulary={filteredVocabulary} />
          ) : mode === 'spelling' ? (
            <SpellingTest vocabulary={filteredVocabulary} />
          ) : null}
        </div>

        <div className="mt-6">
          <Progress
            total={filteredVocabulary.length}
            learned={learnedWords.filter((id) => filteredVocabulary.some((w) => w.id === id)).length}
            mastered={masteredWords.filter((id) => filteredVocabulary.some((w) => w.id === id)).length}
            categoryName={categoryName}
            onReset={resetProgress}
          />
        </div>
      </div>

      {showVoiceSettings && <VoiceSettings onClose={() => setShowVoiceSettings(false)} />}
    </div>
  );
}

export default LearningView;
