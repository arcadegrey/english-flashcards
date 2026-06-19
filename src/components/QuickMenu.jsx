import { useEffect, useRef, useState } from 'react';
import VoiceSettings from './VoiceSettings';
import {
  DEFAULT_SPEECH_RATE,
  SLOW_SPEECH_RATE,
  getSpeechRate,
  setSpeechRate,
} from '../utils/speech';
import { QUICK_MENU_MODE_OPTIONS, QUICK_MENU_READING_OPTION } from './quickMenuOptions';

const MENU_CLOSE_DURATION_MS = 220;

const menuIcons = {
  learn: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="m15.5 8.5 3-3" />
      <path d="M17 5.5h3v3" />
    </svg>
  ),
  quiz: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 4h14v16H5z" />
      <path d="M8 8h8" />
      <path d="M8 12h5" />
      <path d="m8 16 1.5 1.5L13 14" />
    </svg>
  ),
  fillblank: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h6" />
      <path d="M14 7h6" />
      <path d="M4 12h3" />
      <path d="M11 12h9" />
      <path d="M4 17h8" />
      <path d="M16 17h4" />
    </svg>
  ),
  spelling: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m4 19 5-14 5 14" />
      <path d="M6.2 14h5.6" />
      <path d="M16 9h4" />
      <path d="M18 7v4" />
      <path d="M16 17h4" />
    </svg>
  ),
  matching: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 7h8" />
      <path d="M8 17h8" />
      <circle cx="5" cy="7" r="2" />
      <circle cx="19" cy="17" r="2" />
      <path d="M7 8.5 17 15.5" />
    </svg>
  ),
  reading: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v18H7.5A3.5 3.5 0 0 0 4 23V5.5Z" />
      <path d="M8 6h8" />
      <path d="M8 10h7" />
    </svg>
  ),
  voice: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 9v6h4l5 4V5L7 9H3z" />
      <path d="M16.5 8.5a4.5 4.5 0 0 1 0 7" />
      <path d="M19.5 6a8 8 0 0 1 0 12" />
    </svg>
  ),
  slow: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v5l3 2" />
      <path d="M4 4l2.2 2.2" />
      <path d="M20 4l-2.2 2.2" />
    </svg>
  ),
};

function QuickMenu({
  mode = 'learn',
  onOpenMode,
  onOpenReading,
  onSlowSpeechChange,
  extraItems = [],
}) {
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [speechRate, setSpeechRateState] = useState(() => getSpeechRate());
  const menuRef = useRef(null);
  const menuCloseTimerRef = useRef(null);
  const isSlowSpeech = speechRate < DEFAULT_SPEECH_RATE - 0.01;
  const baseSlotCount = QUICK_MENU_MODE_OPTIONS.length + 4;
  const totalMenuSlots = baseSlotCount + (extraItems.length > 0 ? extraItems.length + 1 : 0);

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

  const handleOpenMode = (nextMode) => {
    onOpenMode?.(nextMode);
    closeMenu();
  };

  const handleOpenReading = () => {
    onOpenReading?.();
    closeMenu();
  };

  const handleOpenVoiceSettings = () => {
    setShowVoiceSettings(true);
    closeMenu();
  };

  const handleToggleSlowSpeech = () => {
    const nextRate = isSlowSpeech ? DEFAULT_SPEECH_RATE : SLOW_SPEECH_RATE;
    setSpeechRate(nextRate);
    setSpeechRateState(nextRate);
    onSlowSpeechChange?.(isSlowSpeech ? '已切换为标准语速 1.0x' : '已切换为慢速发音 0.5x');
    closeMenu();
  };

  return (
    <>
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
            {QUICK_MENU_MODE_OPTIONS.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                className={`learn-refresh-menu-item ${mode === item.id ? 'is-active' : ''}`}
                onClick={() => handleOpenMode(item.id)}
                style={{
                  '--menu-index': index,
                  '--menu-reverse-index': totalMenuSlots - 1 - index,
                }}
              >
                <span className="learn-refresh-menu-icon">{menuIcons[item.id]}</span>
                <span>{item.label}</span>
              </button>
            ))}
            <button
              type="button"
              role="menuitem"
              className="learn-refresh-menu-item"
              onClick={handleOpenReading}
              style={{
                '--menu-index': QUICK_MENU_MODE_OPTIONS.length,
                '--menu-reverse-index': totalMenuSlots - 1 - QUICK_MENU_MODE_OPTIONS.length,
              }}
            >
              <span className="learn-refresh-menu-icon">{menuIcons.reading}</span>
              <span>{QUICK_MENU_READING_OPTION.label}</span>
            </button>
            <div
              className="learn-refresh-menu-divider"
              style={{
                '--menu-index': QUICK_MENU_MODE_OPTIONS.length + 1,
                '--menu-reverse-index': totalMenuSlots - 1 - (QUICK_MENU_MODE_OPTIONS.length + 1),
              }}
            />
            <button
              type="button"
              role="menuitem"
              className="learn-refresh-menu-item"
              onClick={handleOpenVoiceSettings}
              style={{
                '--menu-index': QUICK_MENU_MODE_OPTIONS.length + 2,
                '--menu-reverse-index': totalMenuSlots - 1 - (QUICK_MENU_MODE_OPTIONS.length + 2),
              }}
            >
              <span className="learn-refresh-menu-icon">{menuIcons.voice}</span>
              <span>语音设置</span>
            </button>
            <button
              type="button"
              role="menuitem"
              className={`learn-refresh-menu-item ${isSlowSpeech ? 'is-active' : ''}`}
              onClick={handleToggleSlowSpeech}
              style={{
                '--menu-index': QUICK_MENU_MODE_OPTIONS.length + 3,
                '--menu-reverse-index': totalMenuSlots - 1 - (QUICK_MENU_MODE_OPTIONS.length + 3),
              }}
            >
              <span className="learn-refresh-menu-icon">{menuIcons.slow}</span>
              <span>{isSlowSpeech ? '慢速发音 0.5x（已开）' : '慢速发音 0.5x'}</span>
            </button>
            {extraItems.length > 0 && (
              <div
                className="learn-refresh-menu-divider"
                style={{
                  '--menu-index': baseSlotCount,
                  '--menu-reverse-index': totalMenuSlots - 1 - baseSlotCount,
                }}
              />
            )}
            {extraItems.map((item, index) => {
              const menuIndex = baseSlotCount + 1 + index;

              return (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  className={`learn-refresh-menu-item ${item.isActive ? 'is-active' : ''}`}
                  onClick={() => {
                    item.onClick?.();
                    closeMenu();
                  }}
                  style={{
                    '--menu-index': menuIndex,
                    '--menu-reverse-index': totalMenuSlots - 1 - menuIndex,
                  }}
                >
                  <span className="learn-refresh-menu-icon">{item.icon || menuIcons.learn}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
      {showVoiceSettings && <VoiceSettings onClose={() => setShowVoiceSettings(false)} />}
    </>
  );
}

export default QuickMenu;
