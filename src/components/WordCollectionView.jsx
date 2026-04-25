import { useEffect, useMemo, useRef, useState } from 'react';
import Card from './Card';
import VoiceSettings from './VoiceSettings';
import {
  DEFAULT_SPEECH_RATE,
  SLOW_SPEECH_RATE,
  getSpeechRate,
  setSpeechRate,
  speak,
} from '../utils/speech';

const MENU_CLOSE_DURATION_MS = 220;
const MODE_OPTIONS = [
  { id: 'learn', icon: '🎯', label: '学习' },
  { id: 'quiz', icon: '✏️', label: '测验' },
  { id: 'fillblank', icon: '🧩', label: '填空' },
  { id: 'spelling', icon: '🔤', label: '拼写' },
];

function WordCollectionView({
  title,
  words,
  onBack,
  mode = 'learn',
  onOpenMode,
  emptyHint,
  onMarkAsMastered,
  onMarkAsUnknown,
  masteredActionLabel = '认识了',
  unknownActionLabel = '不认识',
  progressLabel,
  onHome,
  onSyncAccount,
}) {
  const [query, setQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [hintOpenForWordId, setHintOpenForWordId] = useState(null);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toast, setToast] = useState('');
  const [speechRate, setSpeechRateState] = useState(() => getSpeechRate());
  const menuRef = useRef(null);
  const menuCloseTimerRef = useRef(null);
  const totalMenuSlots = MODE_OPTIONS.length + 5;

  const filteredWords = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return words;

    return words.filter(
      (word) =>
        word.word.toLowerCase().includes(keyword) ||
        word.meaning.toLowerCase().includes(keyword) ||
        (word.phonetic || '').toLowerCase().includes(keyword)
    );
  }, [query, words]);

  const safeCurrentIndex =
    filteredWords.length > 0 ? Math.min(currentIndex, filteredWords.length - 1) : 0;
  const currentWord = filteredWords[safeCurrentIndex] || null;
  const progressCurrent = filteredWords.length > 0 ? safeCurrentIndex + 1 : 0;
  const currentWordId = currentWord?.id ?? null;
  const showHint = currentWordId != null && String(hintOpenForWordId) === String(currentWordId);
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

  const nextCard = () => {
    if (filteredWords.length <= 1) return;
    setCurrentIndex((prev) => {
      const normalized = Math.min(prev, filteredWords.length - 1);
      return (normalized + 1) % filteredWords.length;
    });
  };

  const handleSelectMode = (nextMode) => {
    onOpenMode?.(nextMode);
    closeMenu();
  };

  const handleOpenVoiceSettings = () => {
    setShowVoiceSettings(true);
    closeMenu();
  };

  const handleToggleSearch = () => {
    setShowSearch((prev) => !prev);
    closeMenu();
  };

  const handleSpeakCurrentWord = () => {
    if (!currentWord?.word) return;
    speak(currentWord.word, { rate: 1 });
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

  const handleToggleSlowSpeech = () => {
    const nextRate = isSlowSpeech ? DEFAULT_SPEECH_RATE : SLOW_SPEECH_RATE;
    setSpeechRate(nextRate);
    setSpeechRateState(nextRate);
    setToast(isSlowSpeech ? '已切换为标准语速 1.0x' : '已切换为慢速发音 0.5x');
    closeMenu();
  };

  const handleMarkUnknown = () => {
    if (!currentWord) return;

    if (typeof onMarkAsUnknown === 'function') {
      onMarkAsUnknown(currentWord.id);
      setToast('已移回已学习');
      setHintOpenForWordId(null);
      nextCard();
      return;
    }

    setToast('已加入复习队列');
    setHintOpenForWordId(null);
    nextCard();
  };

  const handleMarkKnown = () => {
    if (!currentWord) return;

    if (typeof onMarkAsMastered === 'function') {
      onMarkAsMastered(currentWord.id);
      setToast('已标记为“认识”');
      setHintOpenForWordId(null);
      nextCard();
      return;
    }

    setToast('已保持为已掌握');
    setHintOpenForWordId(null);
    nextCard();
  };

  const handleToggleHint = () => {
    if (currentWordId == null) {
      return;
    }
    setHintOpenForWordId((prev) => (String(prev) === String(currentWordId) ? null : currentWordId));
  };

  return (
    <div className="learn-refresh-page">
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
              {progressCurrent} / {filteredWords.length}
            </p>
            <p className="learn-refresh-progress-sub">{progressLabel || `今日目标 ${filteredWords.length}`}</p>
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
                    <span>{isSlowSpeech ? '慢速发音 0.5x（已开）' : '慢速发音 0.5x'}</span>
                  </button>
                  <div
                    className="learn-refresh-menu-divider"
                    style={{
                      '--menu-index': MODE_OPTIONS.length + 3,
                      '--menu-reverse-index': totalMenuSlots - 1 - (MODE_OPTIONS.length + 3),
                    }}
                  />
                  <button
                    type="button"
                    role="menuitem"
                    className="learn-refresh-menu-item"
                    onClick={handleToggleSearch}
                    style={{
                      '--menu-index': MODE_OPTIONS.length + 4,
                      '--menu-reverse-index': totalMenuSlots - 1 - (MODE_OPTIONS.length + 4),
                    }}
                  >
                    <span>{showSearch ? '🙈' : '🔎'}</span>
                    <span>{showSearch ? '隐藏搜索栏' : '显示搜索栏'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="learn-refresh-main">
        {showSearch && (
          <section className="mb-4 rounded-[16px] border border-[#e8e8ed] bg-white px-4 py-4">
            <input
              type="text"
              value={query}
              onChange={(event) => {
                setCurrentIndex(0);
                setQuery(event.target.value);
              }}
              placeholder={`搜索${title.replace(/^[^\u4e00-\u9fa5A-Za-z0-9]+/, '')}...`}
              className="w-full min-h-[46px] rounded-[12px] border border-[#e8e8ed] bg-white px-4 text-center text-base text-[#1d1d1f] placeholder:text-[#9ca3af] outline-none transition focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20"
            />
          </section>
        )}

        {words.length === 0 ? (
          <article className="learn-refresh-card learn-refresh-card-enter">
            <p className="learn-refresh-empty">{emptyHint}</p>
          </article>
        ) : filteredWords.length === 0 ? (
          <article className="learn-refresh-card learn-refresh-card-enter">
            <p className="learn-refresh-empty">没有匹配结果，试试别的关键词。</p>
          </article>
        ) : (
          <Card
            key={`${currentWord?.id || 'collection-empty'}-${safeCurrentIndex}`}
            word={currentWord}
            showHint={showHint}
          />
        )}
      </main>

      {filteredWords.length > 0 && (
        <footer className="learn-refresh-bottombar">
          <div className="learn-refresh-bottombar-inner">
            <button
              type="button"
              className="learn-refresh-action learn-refresh-action-secondary"
              onClick={handleMarkUnknown}
            >
              {unknownActionLabel}
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
              {masteredActionLabel}
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

export default WordCollectionView;
