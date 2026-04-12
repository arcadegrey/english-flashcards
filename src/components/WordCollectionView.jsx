import { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { speak } from '../utils/speech';
import VoiceSettings from './VoiceSettings';

const MENU_CLOSE_DURATION_MS = 220;
const MODE_OPTIONS = [
  { id: 'learn', icon: '🎯', label: '学习' },
  { id: 'quiz', icon: '✏️', label: '测验' },
  { id: 'fillblank', icon: '🧩', label: '填空' },
  { id: 'spelling', icon: '🔤', label: '拼写' },
];

function WordCollectionView({
  title,
  subtitle,
  words,
  onBack,
  mode = 'learn',
  onOpenMode,
  emptyHint,
  onMarkAsMastered,
  masteredActionLabel = '认识了',
}) {
  const { isDark } = useTheme();
  const [query, setQuery] = useState('');
  const [showTopSection, setShowTopSection] = useState(true);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuCloseTimerRef = useRef(null);
  const totalMenuSlots = MODE_OPTIONS.length + 4;

  const filteredWords = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) {
      return words;
    }

    return words.filter(
      (word) =>
        word.word.toLowerCase().includes(keyword) ||
        word.meaning.toLowerCase().includes(keyword) ||
        (word.phonetic || '').toLowerCase().includes(keyword)
    );
  }, [query, words]);

  const topbarSubtext = title.replace(/^[^\u4e00-\u9fa5A-Za-z0-9]+/, '');

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

  const handleSelectMode = (nextMode) => {
    onOpenMode?.(nextMode);
    closeMenu();
  };

  const handleOpenVoiceSettings = () => {
    setShowVoiceSettings(true);
    closeMenu();
  };

  const handleToggleTopSection = () => {
    setShowTopSection((prev) => !prev);
    closeMenu();
  };

  return (
    <div
      className="min-h-screen px-4 pb-8"
      style={{ paddingTop: 'calc(108px + env(safe-area-inset-top))' }}
    >
      <header className="learn-refresh-topbar">
        <div className="learn-refresh-topbar-inner" style={{ maxWidth: '960px' }}>
          <button type="button" className="learn-refresh-back" onClick={onBack} aria-label="返回首页">
            <span aria-hidden="true">←</span>
            <span>返回</span>
          </button>

          <div className="learn-refresh-progress">
            <p className="learn-refresh-progress-main">
              {filteredWords.length} / {words.length}
            </p>
            <p className="learn-refresh-progress-sub">{topbarSubtext}</p>
          </div>

          <div className="learn-refresh-top-actions">
            <div className="learn-refresh-menu-wrap" ref={menuRef}>
              <button
                type="button"
                className="learn-refresh-icon-btn"
                onClick={toggleMenu}
                aria-haspopup="menu"
                aria-expanded={isMenuOpen}
                aria-label="打开功能菜单"
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
                  aria-label="功能菜单"
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
                  <div
                    className="learn-refresh-menu-divider"
                    style={{
                      '--menu-index': MODE_OPTIONS.length + 2,
                      '--menu-reverse-index': totalMenuSlots - 1 - (MODE_OPTIONS.length + 2),
                    }}
                  />
                  <button
                    type="button"
                    role="menuitem"
                    className="learn-refresh-menu-item"
                    onClick={handleToggleTopSection}
                    style={{
                      '--menu-index': MODE_OPTIONS.length + 3,
                      '--menu-reverse-index': totalMenuSlots - 1 - (MODE_OPTIONS.length + 3),
                    }}
                  >
                    <span>{showTopSection ? '🙈' : '🔎'}</span>
                    <span>{showTopSection ? '隐藏顶部区域' : '显示顶部区域'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="w-full" style={{ maxWidth: '960px', marginInline: 'auto' }}>
        <section
          className={`rounded-3xl p-6 md:p-8 shadow-2xl border ${
            isDark
              ? 'border-white/25 bg-white/12 backdrop-blur-md'
              : 'border-slate-200 bg-white/95'
          }`}
        >
          {showTopSection && (
            <div className="mb-6 text-center">
              <h2
                className={`text-3xl md:text-4xl font-black tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {title}
              </h2>
              <p className={`mt-2 ${isDark ? 'text-white/70' : 'text-slate-600'}`}>{subtitle}</p>
              <p className={`mt-2 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                共 <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{words.length}</span>{' '}
                个单词
              </p>
            </div>
          )}

          {showTopSection && (
            <div className="mb-6">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索单词、释义或音标..."
                className={`w-full rounded-2xl border px-5 py-4 text-center focus:outline-none focus:ring-2 ${
                  isDark
                    ? 'border-white/30 bg-white/15 text-white placeholder:text-white/50 focus:ring-white/40'
                    : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-sky-300'
                }`}
              />
            </div>
          )}

          {words.length === 0 ? (
            <div
              className={`rounded-2xl border border-dashed p-8 text-center ${
                isDark ? 'border-white/30 bg-white/5' : 'border-slate-300 bg-slate-50'
              }`}
            >
              <p className={`text-lg ${isDark ? 'text-white/70' : 'text-slate-600'}`}>{emptyHint}</p>
            </div>
          ) : filteredWords.length === 0 ? (
            <div
              className={`rounded-2xl border border-dashed p-8 text-center ${
                isDark ? 'border-white/30 bg-white/5' : 'border-slate-300 bg-slate-50'
              }`}
            >
              <p className={`text-lg ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                没有匹配结果，试试别的关键词
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredWords.map((word) => (
                <article
                  key={word.id}
                  className={`rounded-2xl border px-4 py-4 text-center md:px-5 md:py-5 shadow-lg ${
                    isDark ? 'border-slate-700 bg-slate-900/75' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        <h3
                          className={`text-2xl md:text-3xl font-black tracking-tight break-all ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {word.word}
                        </h3>
                        <span className={`${isDark ? 'text-sky-300' : 'text-cyan-700'} font-mono text-sm md:text-base break-all`}>
                          {word.phonetic || 'N/A'}
                        </span>
                        <span className={`${isDark ? 'text-slate-300' : 'text-slate-500'} text-sm`}>{word.pos}</span>
                      </div>
                      <p className={`text-base md:text-lg mt-2 break-words ${isDark ? 'text-slate-100' : 'text-slate-700'}`}>
                        {word.meaning}
                      </p>
                      {word.example && (
                        <p className={`text-sm md:text-base mt-2 break-words ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                          例句：{word.example}
                        </p>
                      )}
                      {word.exampleCn && (
                        <p className={`text-sm md:text-base mt-1 break-words ${isDark ? 'text-cyan-200/90' : 'text-cyan-800'}`}>
                          中文：{word.exampleCn}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={() => speak(word.word, { rate: 0.8 })}
                        className={`shrink-0 inline-flex min-w-[100px] items-center justify-center rounded-2xl border px-5 py-2.5 text-base font-semibold transition-colors ${
                          isDark
                            ? 'border-slate-600 bg-slate-800 text-slate-100 hover:border-slate-500 hover:bg-slate-700'
                            : 'border-[#d2d5dc] bg-[#f7f7fa] text-[#5f6470] hover:border-[#bcc6d8] hover:bg-[#f0f2f7]'
                        }`}
                      >
                        发音
                      </button>
                      {typeof onMarkAsMastered === 'function' && (
                        <button
                          onClick={() => onMarkAsMastered(word.id)}
                          className="shrink-0 inline-flex min-w-[132px] items-center justify-center rounded-2xl border border-[#0071e3] bg-[#0071e3] px-7 py-3 text-base font-semibold text-white transition-colors hover:border-[#0065cc] hover:bg-[#0065cc]"
                        >
                          {masteredActionLabel}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {showVoiceSettings && <VoiceSettings onClose={() => setShowVoiceSettings(false)} />}
    </div>
  );
}

export default WordCollectionView;
