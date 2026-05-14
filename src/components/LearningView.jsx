import { useEffect, useMemo, useState } from 'react';
import Card from './Card';
import Quiz from './Quiz';
import FillBlank from './FillBlank';
import SpellingTest from './SpellingTest';
import MatchingTest from './MatchingTest';
import QuickMenu from './QuickMenu';
import { QUICK_MENU_MODE_OPTIONS } from './quickMenuOptions';
import { speakWord } from '../utils/speech';
import '../styles/word-learning-refresh.css';

const MODE_SUBTITLE = {
  quiz: '选择正确释义',
  fillblank: '听例句并完成填空',
  spelling: '听发音拼写单词',
  matching: '单词和释义配对',
};

function LearningView({
  mode,
  setMode,
  allVocabulary,
  currentWord,
  filteredVocabulary,
  currentIndex,
  onMarkLearned,
  onMarkMastered,
  masteredWords,
  examScope = 'learned',
  onAddMastered,
  onWrongAnswer,
  learnedWords,
  onBack,
  onHome,
  onSyncAccount,
  onOpenReading,
}) {
  const [hintOpenForWordId, setHintOpenForWordId] = useState(null);
  const [toast, setToast] = useState('');

  const learnedWordSet = useMemo(() => new Set(learnedWords.map(String)), [learnedWords]);
  const masteredWordSet = useMemo(() => new Set(masteredWords.map(String)), [masteredWords]);
  const learnedVocabulary = useMemo(
    () => allVocabulary.filter((word) => learnedWordSet.has(String(word.id))),
    [allVocabulary, learnedWordSet]
  );
  const masteredVocabulary = useMemo(
    () => allVocabulary.filter((word) => masteredWordSet.has(String(word.id))),
    [allVocabulary, masteredWordSet]
  );
  const examVocabulary = useMemo(() => {
    if (examScope === 'mastered') return masteredVocabulary;
    if (examScope === 'all') return allVocabulary;
    return learnedVocabulary;
  }, [allVocabulary, examScope, learnedVocabulary, masteredVocabulary]);
  const examSourceLabel =
    examScope === 'mastered'
      ? '已掌握范围'
      : examScope === 'all'
        ? '全范围随机'
        : '已学习范围';

  const totalCount = filteredVocabulary.length;
  const progressCurrent = totalCount > 0 ? Math.min(currentIndex + 1, totalCount) : 0;
  const currentModeMeta = QUICK_MENU_MODE_OPTIONS.find((item) => item.id === mode) || QUICK_MENU_MODE_OPTIONS[0];
  const currentWordId = currentWord?.id ?? null;
  const showHint = currentWordId != null && String(hintOpenForWordId) === String(currentWordId);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setToast('');
    }, 1600);

    return () => clearTimeout(timer);
  }, [toast]);

  const handleSpeakCurrentWord = () => {
    if (!currentWord?.word) {
      return;
    }

    speakWord(currentWord, { rate: 1 });
  };

  const handleSyncAccount = async () => {
    if (typeof onSyncAccount !== 'function') {
      setToast('当前页面暂不可同步');
      return;
    }

    setToast('正在同步账号...');
    try {
      const result = await onSyncAccount();
      setToast(result?.message || '同步请求已完成');
    } catch (error) {
      setToast(error?.message || '同步失败，请稍后重试');
    }
  };

  const handleMarkUnknown = () => {
    onMarkLearned();
    setToast('已加入复习队列');
    setHintOpenForWordId(null);
  };

  const handleMarkKnown = () => {
    onMarkMastered();
    setToast('已标记为“认识”');
    setHintOpenForWordId(null);
  };

  const handleToggleHint = () => {
    if (currentWordId == null) {
      return;
    }
    setHintOpenForWordId((prev) => (String(prev) === String(currentWordId) ? null : currentWordId));
  };

  const progressSubText = mode === 'learn' ? `今日目标 ${totalCount}` : MODE_SUBTITLE[mode] || currentModeMeta.label;

  return (
    <div className={`learn-refresh-page ${mode === 'learn' ? '' : 'learn-refresh-page--assessment'}`}>
      <header className="learn-refresh-topbar">
        <div className="learn-refresh-topbar-inner">
          <div className="learn-refresh-left-actions">
            <button type="button" className="learn-refresh-back" onClick={onBack} aria-label="返回">
              <span aria-hidden="true">←</span>
              <span>返回</span>
            </button>
            <button type="button" className="learn-refresh-home-btn" onClick={onHome} aria-label="回到首页">
              <span aria-hidden="true">🏠</span>
            </button>
          </div>

          <div className="learn-refresh-progress">
            <p className="learn-refresh-progress-main">
              {progressCurrent} / {totalCount}
            </p>
            <p className="learn-refresh-progress-sub">{progressSubText}</p>
          </div>

          <div className="learn-refresh-top-actions">
            <button
              type="button"
              className="learn-refresh-icon-btn"
              onClick={handleSyncAccount}
              aria-label="同步账号"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 6v5h-5" />
                <path d="M4 18v-5h5" />
                <path d="M6.2 9A7 7 0 0118.5 7.5L20 11" />
                <path d="M17.8 15A7 7 0 015.5 16.5L4 13" />
              </svg>
            </button>
            <button
              type="button"
              className="learn-refresh-icon-btn"
              onClick={handleSpeakCurrentWord}
              aria-label="播放发音"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 9v6h4l5 4V5L7 9H3z" />
                <path d="M16.5 8.5a4.5 4.5 0 010 7" />
                <path d="M19.5 6a8 8 0 010 12" />
              </svg>
            </button>

            <QuickMenu
              mode={mode}
              onOpenMode={setMode}
              onOpenReading={onOpenReading}
              onSlowSpeechChange={setToast}
            />
          </div>
        </div>
      </header>

      <main className={`learn-refresh-main ${mode === 'learn' ? '' : 'learn-refresh-main--assessment'}`}>
        {mode === 'learn' ? (
          <Card
            key={`${currentWord?.id || 'learn-empty'}-${currentIndex}`}
            word={currentWord}
            showHint={showHint}
          />
        ) : mode === 'quiz' ? (
          <Quiz
            vocabulary={examVocabulary}
            optionVocabulary={allVocabulary}
            sourceLabel={examSourceLabel}
            masteredWords={masteredWords}
            onAddMastered={onAddMastered}
            onWrongAnswer={onWrongAnswer}
          />
        ) : mode === 'fillblank' ? (
          <FillBlank
            vocabulary={examVocabulary}
            sourceLabel={examSourceLabel}
            onWrongAnswer={onWrongAnswer}
            onCorrectAnswer={onAddMastered}
          />
        ) : mode === 'spelling' ? (
          <SpellingTest
            vocabulary={examVocabulary}
            sourceLabel={examSourceLabel}
            onWrongAnswer={onWrongAnswer}
            onCorrectAnswer={onAddMastered}
          />
        ) : mode === 'matching' ? (
          <MatchingTest
            vocabulary={examVocabulary}
            sourceLabel={examSourceLabel}
            onWrongAnswer={onWrongAnswer}
            onCorrectAnswer={onAddMastered}
          />
        ) : null}
      </main>

      {mode === 'learn' && (
        <footer className="learn-refresh-bottombar">
          <div className="learn-refresh-bottombar-inner">
            <button
              type="button"
              className="learn-refresh-action learn-refresh-action-secondary"
              onClick={handleMarkUnknown}
            >
              不认识
            </button>
            <button
              type="button"
              className="learn-refresh-action learn-refresh-action-ghost"
              onClick={handleToggleHint}
            >
              {showHint ? '收起提示' : '显示提示'}
            </button>
            <button
              type="button"
              className="learn-refresh-action learn-refresh-action-primary"
              onClick={handleMarkKnown}
            >
              认识了
            </button>
          </div>
        </footer>
      )}

      {toast && (
        <div className="learn-refresh-toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  );
}

export default LearningView;
