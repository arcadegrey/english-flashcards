import { useEffect, useRef, useState } from 'react';
import VoiceSettings from './VoiceSettings';
import {
  DEFAULT_SPEECH_RATE,
  SLOW_SPEECH_RATE,
  getSpeechRate,
  setSpeechRate,
  speak,
} from '../utils/speech';

const MODE_OPTIONS = [
  { id: 'learn', icon: '🎯', label: '学习' },
  { id: 'quiz', icon: '✏️', label: '测验' },
  { id: 'fillblank', icon: '🧩', label: '填空' },
  { id: 'spelling', icon: '🔤', label: '拼写' },
];

const MENU_CLOSE_DURATION_MS = 220;

function ReadingListView({ readings = [], mode = 'learn', onBack, onOpenReading, onOpenMode }) {
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [speechRate, setSpeechRateState] = useState(() => getSpeechRate());
  const menuRef = useRef(null);
  const menuCloseTimerRef = useRef(null);
  const totalMenuSlots = MODE_OPTIONS.length + 3;
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

  const handleSpeakIntro = () => {
    speak('Reading mode. Choose one article to start.', { rate: 1 });
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

  return (
    <div className="learn-refresh-page">
      <header className="learn-refresh-topbar">
        <div className="learn-refresh-topbar-inner">
          <button type="button" className="learn-refresh-back" onClick={onBack} aria-label="返回入口页">
            <span aria-hidden="true">←</span>
            <span>返回</span>
          </button>

          <div className="learn-refresh-progress">
            <p className="learn-refresh-progress-main">{readings.length} 篇</p>
            <p className="learn-refresh-progress-sub">阅读文章库</p>
          </div>

          <div className="learn-refresh-top-actions">
            <button
              type="button"
              className="learn-refresh-icon-btn"
              onClick={handleSpeakIntro}
              aria-label="播放阅读模式提示"
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

      <main className="learn-refresh-main">
        <section className="learn-refresh-card learn-refresh-card-enter reading-list-card">
          <header className="reading-list-header">
            <h1 className="reading-list-title">阅读训练</h1>
            <p className="reading-list-subtitle">点击文章开始阅读，难词会根据你的掌握状态自动高亮。</p>
          </header>

          <div className="reading-list-grid">
            {readings.map((article) => (
              <button
                key={article.id}
                type="button"
                className="reading-list-item"
                onClick={() => onOpenReading?.(article.id)}
              >
                <p className="reading-list-item-title">{article.title}</p>
                <div className="reading-list-item-meta">
                  <span>{article.level || 'B1'}</span>
                  <span>{article.estimatedMinutes || 1} 分钟</span>
                  <span>{article.unmasteredCount || 0} 个难词</span>
                </div>
              </button>
            ))}
          </div>

          {readings.length === 0 && <p className="learn-refresh-empty">暂无阅读文章，请先导入 CSV。</p>}
        </section>
      </main>

      {toast && (
        <div className="learn-refresh-toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}

      {showVoiceSettings && <VoiceSettings onClose={() => setShowVoiceSettings(false)} />}
    </div>
  );
}

export default ReadingListView;
