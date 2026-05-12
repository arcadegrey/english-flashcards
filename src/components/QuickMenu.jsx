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
                <span>{item.icon}</span>
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
              <span>{QUICK_MENU_READING_OPTION.icon}</span>
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
              <span>🔊</span>
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
              <span>🐢</span>
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
                  <span>{item.icon}</span>
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
