import { useEffect, useMemo, useRef, useState } from 'react';
import Card from './Card';
import Quiz from './Quiz';
import FillBlank from './FillBlank';
import SpellingTest from './SpellingTest';
import VoiceSettings from './VoiceSettings';
import {
  DEFAULT_SPEECH_RATE,
  SLOW_SPEECH_RATE,
  getSpeechRate,
  setSpeechRate,
  speak,
} from '../utils/speech';
import '../styles/word-learning-refresh.css';

const MODE_OPTIONS = [
  { id: 'learn', icon: '🎯', label: '学习' },
  { id: 'quiz', icon: '✏️', label: '测验' },
  { id: 'fillblank', icon: '🧩', label: '填空' },
  { id: 'spelling', icon: '🔤', label: '拼写' },
];
const MODE_SUBTITLE = {
  quiz: '选择正确释义',
  fillblank: '听例句并完成填空',
  spelling: '听发音拼写单词',
};
const MENU_CLOSE_DURATION_MS = 220;

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
  onAddMastered,
  learnedWords,
  onBack,
}) {
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [hintOpenForWordId, setHintOpenForWordId] = useState(null);
  const [isModeMenuMounted, setIsModeMenuMounted] = useState(false);
  const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [speechRate, setSpeechRateState] = useState(() => getSpeechRate());
  const menuRef = useRef(null);
  const menuCloseTimerRef = useRef(null);

  const learnedWordSet = useMemo(() => new Set(learnedWords), [learnedWords]);
  const learnedVocabulary = useMemo(
    () => allVocabulary.filter((word) => learnedWordSet.has(word.id)),
    [allVocabulary, learnedWordSet]
  );
  const useLearnedPool = learnedVocabulary.length > 0;
  const quizVocabulary = useLearnedPool ? learnedVocabulary : allVocabulary;
  const quizSourceLabel = useLearnedPool ? '已学习词库' : '随机测验 · 全词库';
  const fillBlankVocabulary = useLearnedPool ? learnedVocabulary : allVocabulary;
  const fillBlankSourceLabel = useLearnedPool ? '已学习词库' : '随机测验 · 全词库';

  const totalCount = filteredVocabulary.length;
  const progressCurrent = totalCount > 0 ? Math.min(currentIndex + 1, totalCount) : 0;
  const currentModeMeta = MODE_OPTIONS.find((item) => item.id === mode) || MODE_OPTIONS[0];
  const totalMenuSlots = MODE_OPTIONS.length + 3;
  const currentWordId = currentWord?.id ?? null;
  const showHint = currentWordId != null && String(hintOpenForWordId) === String(currentWordId);
  const isSlowSpeech = speechRate < DEFAULT_SPEECH_RATE - 0.01;

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setToast('');
    }, 1600);

    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!isModeMenuMounted) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsModeMenuOpen(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsModeMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown, { passive: true });
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isModeMenuMounted]);

  useEffect(() => {
    if (isModeMenuOpen) {
      if (menuCloseTimerRef.current) {
        clearTimeout(menuCloseTimerRef.current);
        menuCloseTimerRef.current = null;
      }
      return undefined;
    }

    if (!isModeMenuMounted) {
      return undefined;
    }

    menuCloseTimerRef.current = setTimeout(() => {
      setIsModeMenuMounted(false);
      menuCloseTimerRef.current = null;
    }, MENU_CLOSE_DURATION_MS);

    return () => {
      if (menuCloseTimerRef.current) {
        clearTimeout(menuCloseTimerRef.current);
        menuCloseTimerRef.current = null;
      }
    };
  }, [isModeMenuOpen, isModeMenuMounted]);

  useEffect(() => {
    return () => {
      if (menuCloseTimerRef.current) {
        clearTimeout(menuCloseTimerRef.current);
      }
    };
  }, []);

  const openModeMenu = () => {
    if (menuCloseTimerRef.current) {
      clearTimeout(menuCloseTimerRef.current);
      menuCloseTimerRef.current = null;
    }
    setIsModeMenuMounted(true);
    requestAnimationFrame(() => {
      setIsModeMenuOpen(true);
    });
  };

  const closeModeMenu = () => {
    setIsModeMenuOpen(false);
  };

  const toggleModeMenu = () => {
    if (isModeMenuOpen) {
      closeModeMenu();
      return;
    }
    openModeMenu();
  };

  const handleSelectMode = (nextMode) => {
    setMode(nextMode);
    closeModeMenu();
  };

  const handleOpenVoiceSettings = () => {
    closeModeMenu();
    setShowVoiceSettings(true);
  };

  const handleSpeakCurrentWord = () => {
    if (!currentWord?.word) {
      return;
    }

    speak(currentWord.word, { rate: 1 });
  };

  const handleToggleSlowSpeech = () => {
    const nextRate = isSlowSpeech ? DEFAULT_SPEECH_RATE : SLOW_SPEECH_RATE;
    setSpeechRate(nextRate);
    setSpeechRateState(nextRate);
    setToast(isSlowSpeech ? '已切换为标准语速 1.0x' : '已切换为慢速发音 0.5x');
    closeModeMenu();
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
          <button type="button" className="learn-refresh-back" onClick={onBack} aria-label="返回首页">
            <span aria-hidden="true">←</span>
            <span>返回</span>
          </button>

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
              onClick={handleSpeakCurrentWord}
              aria-label="播放发音"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 9v6h4l5 4V5L7 9H3z" />
                <path d="M16.5 8.5a4.5 4.5 0 010 7" />
                <path d="M19.5 6a8 8 0 010 12" />
              </svg>
            </button>

            <div className="learn-refresh-menu-wrap" ref={menuRef}>
              <button
                type="button"
                className="learn-refresh-icon-btn"
                onClick={toggleModeMenu}
                aria-haspopup="menu"
                aria-expanded={isModeMenuOpen}
                aria-label="打开模式菜单"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 8.75a3.25 3.25 0 100 6.5 3.25 3.25 0 000-6.5z" />
                  <path d="M4 12a8 8 0 011.1-4.03l1.72.99a6 6 0 000 6.08l-1.72.99A8 8 0 014 12zm15.9-4.03A8 8 0 0120 12a8 8 0 01-1.1 4.03l-1.72-.99a6 6 0 000-6.08l1.72-.99zM12 4a8 8 0 014.03 1.1l-.99 1.72a6 6 0 00-6.08 0l-.99-1.72A8 8 0 0112 4zm4.03 14.9A8 8 0 0112 20a8 8 0 01-4.03-1.1l.99-1.72a6 6 0 006.08 0l.99 1.72z" />
                </svg>
              </button>

              {isModeMenuMounted && (
                <div
                  className={`learn-refresh-menu ${isModeMenuOpen ? 'is-open' : 'is-closing'}`}
                  role="menu"
                  aria-label="学习模式菜单"
                >
                  {MODE_OPTIONS.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      role="menuitem"
                      className={`learn-refresh-menu-item ${mode === item.id ? 'is-active' : ''}`}
                      onClick={() => handleSelectMode(item.id)}
                      style={{
                        '--menu-index': index,
                        '--menu-reverse-index': totalMenuSlots - 1 - index,
                      }}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                  <div
                    className="learn-refresh-menu-divider"
                    style={{
                      '--menu-index': MODE_OPTIONS.length,
                      '--menu-reverse-index': totalMenuSlots - 1 - MODE_OPTIONS.length,
                    }}
                  />
                  <button
                    type="button"
                    role="menuitem"
                    className="learn-refresh-menu-item"
                    onClick={handleOpenVoiceSettings}
                    style={{
                      '--menu-index': MODE_OPTIONS.length + 1,
                      '--menu-reverse-index': totalMenuSlots - 1 - (MODE_OPTIONS.length + 1),
                    }}
                  >
                    <span>🔊</span>
                    <span>语音设置</span>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className={`learn-refresh-menu-item ${isSlowSpeech ? 'is-active' : ''}`}
                    onClick={handleToggleSlowSpeech}
                    style={{
                      '--menu-index': MODE_OPTIONS.length + 2,
                      '--menu-reverse-index': totalMenuSlots - 1 - (MODE_OPTIONS.length + 2),
                    }}
                  >
                    <span>🐢</span>
                    <span>{isSlowSpeech ? '慢速发音 0.5x（已开）' : '慢速发音 0.5x'}</span>
                  </button>
                </div>
              )}
            </div>
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
            vocabulary={quizVocabulary}
            optionVocabulary={allVocabulary}
            sourceLabel={quizSourceLabel}
            masteredWords={masteredWords}
            onAddMastered={onAddMastered}
          />
        ) : mode === 'fillblank' ? (
          <FillBlank vocabulary={fillBlankVocabulary} sourceLabel={fillBlankSourceLabel} />
        ) : mode === 'spelling' ? (
          <SpellingTest vocabulary={filteredVocabulary} />
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

      {showVoiceSettings && <VoiceSettings onClose={() => setShowVoiceSettings(false)} />}
    </div>
  );
}

export default LearningView;
