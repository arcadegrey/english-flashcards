import { useEffect, useMemo, useRef, useState } from 'react';
import VoiceSettings from './VoiceSettings';
import {
  DEFAULT_SPEECH_RATE,
  SLOW_SPEECH_RATE,
  getSpeechRate,
  setSpeechRate,
  speak,
} from '../utils/speech';
import { isEnglishWordToken, resolveVocabularyWord, tokenizeReadingText } from '../utils/readingText';

const MODE_OPTIONS = [
  { id: 'learn', icon: '🎯', label: '学习' },
  { id: 'quiz', icon: '✏️', label: '测验' },
  { id: 'fillblank', icon: '🧩', label: '填空' },
  { id: 'spelling', icon: '🔤', label: '拼写' },
];

const MENU_CLOSE_DURATION_MS = 220;

function ReadingSessionView({
  article,
  mode = 'learn',
  onBack,
  onOpenMode,
  masteredWords = [],
  wordLookup,
  onMarkAsLearned,
  onMarkAsMastered,
}) {
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [activeWord, setActiveWord] = useState(null);
  const [toast, setToast] = useState('');
  const [speechRate, setSpeechRateState] = useState(() => getSpeechRate());
  const menuRef = useRef(null);
  const menuCloseTimerRef = useRef(null);
  const totalMenuSlots = MODE_OPTIONS.length + 3;
  const masteredWordSet = useMemo(
    () => new Set((masteredWords || []).map((item) => String(item))),
    [masteredWords]
  );
  const isSlowSpeech = speechRate < DEFAULT_SPEECH_RATE - 0.01;

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 1600);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!isMenuMounted) return undefined;

    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
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
  }, [isMenuMounted]);

  useEffect(() => {
    if (isMenuOpen) {
      if (menuCloseTimerRef.current) {
        clearTimeout(menuCloseTimerRef.current);
        menuCloseTimerRef.current = null;
      }
      return undefined;
    }

    if (!isMenuMounted) return undefined;

    menuCloseTimerRef.current = setTimeout(() => {
      setIsMenuMounted(false);
      menuCloseTimerRef.current = null;
    }, MENU_CLOSE_DURATION_MS);

    return () => {
      if (menuCloseTimerRef.current) {
        clearTimeout(menuCloseTimerRef.current);
        menuCloseTimerRef.current = null;
      }
    };
  }, [isMenuOpen, isMenuMounted]);

  useEffect(() => {
    return () => {
      if (menuCloseTimerRef.current) {
        clearTimeout(menuCloseTimerRef.current);
      }
    };
  }, []);

  const readingStats = useMemo(() => {
    const tokens = tokenizeReadingText(article?.content || '');
    const uniqueWordIds = new Set();

    tokens.forEach((token) => {
      if (!isEnglishWordToken(token)) return;
      const matchedWord = resolveVocabularyWord(token, wordLookup);
      if (!matchedWord?.id) return;
      uniqueWordIds.add(String(matchedWord.id));
    });

    const totalTracked = uniqueWordIds.size;
    let masteredCount = 0;
    uniqueWordIds.forEach((id) => {
      if (masteredWordSet.has(id)) masteredCount += 1;
    });

    return {
      totalTracked,
      masteredCount,
      unmasteredCount: Math.max(totalTracked - masteredCount, 0),
    };
  }, [article?.content, masteredWordSet, wordLookup]);

  const openMenu = () => {
    if (menuCloseTimerRef.current) {
      clearTimeout(menuCloseTimerRef.current);
      menuCloseTimerRef.current = null;
    }
    setIsMenuMounted(true);
    requestAnimationFrame(() => setIsMenuOpen(true));
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu();
      return;
    }
    openMenu();
  };

  const handleToggleSlowSpeech = () => {
    const nextRate = isSlowSpeech ? DEFAULT_SPEECH_RATE : SLOW_SPEECH_RATE;
    setSpeechRate(nextRate);
    setSpeechRateState(nextRate);
    setToast(isSlowSpeech ? '已切换为标准语速 1.0x' : '已切换为慢速发音 0.5x');
    closeMenu();
  };

  const handleOpenVoiceSettings = () => {
    setShowVoiceSettings(true);
    closeMenu();
  };

  const handleSelectMode = (nextMode) => {
    onOpenMode?.(nextMode);
    closeMenu();
  };

  const handleSpeakArticle = () => {
    if (!article?.content) return;
    speak(article.content, { rate: 1 });
  };

  const handleSpeakActiveWord = () => {
    if (!activeWord?.word) return;
    speak(activeWord.word, { rate: 1 });
  };

  const handleMarkUnknown = () => {
    if (!activeWord?.id) return;
    onMarkAsLearned?.(activeWord.id);
    setToast(`已加入已学习：${activeWord.word}`);
  };

  const handleMarkKnown = () => {
    if (!activeWord?.id) return;
    onMarkAsMastered?.(activeWord.id);
    setToast(`已标记掌握：${activeWord.word}`);
  };

  const contentBlocks = useMemo(() => {
    const paragraphs = String(article?.content || '')
      .split(/\n{2,}/)
      .map((item) => item.trim())
      .filter(Boolean);

    return paragraphs.map((paragraph, paragraphIndex) => {
      const tokens = tokenizeReadingText(paragraph);
      return (
        <p key={`p-${paragraphIndex}`} className="reading-session-paragraph">
          {tokens.map((token, tokenIndex) => {
            if (!isEnglishWordToken(token)) {
              return (
                <span key={`t-${paragraphIndex}-${tokenIndex}`} className="reading-token-plain">
                  {token}
                </span>
              );
            }

            const matchedWord = resolveVocabularyWord(token, wordLookup);
            const isHighlight = Boolean(
              matchedWord?.id && !masteredWordSet.has(String(matchedWord.id))
            );

            if (!isHighlight) {
              return (
                <span key={`t-${paragraphIndex}-${tokenIndex}`} className="reading-token-plain">
                  {token}
                </span>
              );
            }

            return (
              <button
                key={`t-${paragraphIndex}-${tokenIndex}`}
                type="button"
                className="reading-token-highlight"
                onClick={() => setActiveWord(matchedWord)}
              >
                {token}
              </button>
            );
          })}
        </p>
      );
    });
  }, [article?.content, masteredWordSet, wordLookup]);

  if (!article) {
    return (
      <div className="learn-refresh-page">
        <main className="learn-refresh-main">
          <article className="learn-refresh-card learn-refresh-card-enter">
            <p className="learn-refresh-empty">未找到阅读文章，请返回阅读列表重试。</p>
          </article>
        </main>
      </div>
    );
  }

  return (
    <div className="learn-refresh-page">
      <header className="learn-refresh-topbar">
        <div className="learn-refresh-topbar-inner">
          <button type="button" className="learn-refresh-back" onClick={onBack} aria-label="返回阅读列表">
            <span aria-hidden="true">←</span>
            <span>返回</span>
          </button>

          <div className="learn-refresh-progress">
            <p className="learn-refresh-progress-main">
              {readingStats.masteredCount} / {readingStats.totalTracked}
            </p>
            <p className="learn-refresh-progress-sub">难词掌握</p>
          </div>

          <div className="learn-refresh-top-actions">
            <button
              type="button"
              className="learn-refresh-icon-btn"
              onClick={handleSpeakArticle}
              aria-label="朗读全文"
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
                onClick={toggleMenu}
                aria-haspopup="menu"
                aria-expanded={isMenuOpen}
                aria-label="打开模式菜单"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 8.75a3.25 3.25 0 100 6.5 3.25 3.25 0 000-6.5z" />
                  <path d="M4 12a8 8 0 011.1-4.03l1.72.99a6 6 0 000 6.08l-1.72.99A8 8 0 014 12zm15.9-4.03A8 8 0 0120 12a8 8 0 01-1.1 4.03l-1.72-.99a6 6 0 000-6.08l1.72-.99zM12 4a8 8 0 014.03 1.1l-.99 1.72a6 6 0 00-6.08 0l-.99-1.72A8 8 0 0112 4zm4.03 14.9A8 8 0 0112 20a8 8 0 01-4.03-1.1l.99-1.72a6 6 0 006.08 0l.99 1.72z" />
                </svg>
              </button>

              {isMenuMounted && (
                <div
                  className={`learn-refresh-menu ${isMenuOpen ? 'is-open' : 'is-closing'}`}
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
                    <span>{isSlowSpeech ? '切换标准语速 1.0x' : '切换慢速发音 0.5x'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="learn-refresh-main reading-session-main">
        <section className="learn-refresh-card learn-refresh-card-enter reading-session-card">
          <header className="reading-session-header">
            <h1 className="reading-session-title">{article.title}</h1>
            <div className="reading-session-meta">
              <span className="reading-session-chip">{article.level || 'B1'}</span>
              <span className="reading-session-chip">{article.estimatedMinutes || 1} 分钟</span>
              <span className="reading-session-chip">{readingStats.unmasteredCount} 个未掌握词</span>
            </div>
          </header>

          <section className="reading-session-content">{contentBlocks}</section>

          {article.translation && (
            <section className="learn-refresh-example-block reading-session-translation">
              <div className="learn-refresh-example-head">
                <span className="learn-refresh-example-label">全文翻译</span>
                <button
                  type="button"
                  onClick={() => setShowTranslation((prev) => !prev)}
                  className="learn-refresh-example-audio"
                >
                  {showTranslation ? '收起翻译' : '显示翻译'}
                </button>
              </div>
              {showTranslation && <p className="learn-refresh-example-cn">{article.translation}</p>}
            </section>
          )}
        </section>
      </main>

      {activeWord && (
        <div className="reading-word-modal-layer" role="dialog" aria-modal="true" aria-label="单词详情">
          <button
            type="button"
            className="reading-word-modal-mask"
            aria-label="关闭单词详情"
            onClick={() => setActiveWord(null)}
          />
          <section className="reading-word-modal learn-refresh-card learn-refresh-card-enter">
            <div className="reading-word-modal-head">
              <h2 className="learn-refresh-word">{activeWord.word}</h2>
              <button
                type="button"
                className="learn-refresh-inline-audio"
                onClick={handleSpeakActiveWord}
                aria-label="播放发音"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 9v6h4l5 4V5L7 9H3z" />
                  <path d="M16.5 8.5a4.5 4.5 0 010 7" />
                  <path d="M19.5 6a8 8 0 010 12" />
                </svg>
              </button>
            </div>
            <p className="learn-refresh-phonetic">{activeWord.phonetic || '暂无音标'}</p>
            <p className="learn-refresh-meaning">
              {[activeWord.pos, activeWord.meaning].filter(Boolean).join(' ')}
            </p>
            <section className="learn-refresh-example-block">
              <div className="learn-refresh-example-head">
                <span className="learn-refresh-example-label">例句</span>
              </div>
              <p className="learn-refresh-example-en">{activeWord.example || '暂无英文例句。'}</p>
              <p className="learn-refresh-example-cn">{activeWord.exampleCn || '暂无中文例句。'}</p>
            </section>
            <div className="reading-word-modal-actions">
              <button
                type="button"
                className="learn-refresh-action learn-refresh-action-secondary"
                onClick={handleMarkUnknown}
              >
                不认识
              </button>
              <button
                type="button"
                className="learn-refresh-action learn-refresh-action-primary"
                onClick={handleMarkKnown}
              >
                认识了
              </button>
            </div>
          </section>
        </div>
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

export default ReadingSessionView;
