import { STORAGE_KEYS } from './keys.js';

export const deviceStorage = {
  getTheme: () => {
    try {
      const theme = localStorage.getItem(STORAGE_KEYS.THEME);
      return theme === 'dark' || theme === 'light' ? theme : null;
    } catch (error) {
      console.error('Failed to load theme:', error);
      return null;
    }
  },

  hasThemePreference: () => {
    try {
      return localStorage.getItem(STORAGE_KEYS.THEME_EXPLICIT) === '1';
    } catch (error) {
      console.error('Failed to load theme preference marker:', error);
      return false;
    }
  },

  setTheme: (theme) => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      localStorage.setItem(STORAGE_KEYS.THEME_EXPLICIT, '1');
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  },

  getSelectedVoice: () => {
    try {
      return localStorage.getItem(STORAGE_KEYS.SELECTED_VOICE) || '';
    } catch (error) {
      console.error('Failed to load selected voice:', error);
      return '';
    }
  },

  setSelectedVoice: (voiceName) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_VOICE, voiceName);
    } catch (error) {
      console.error('Failed to save selected voice:', error);
    }
  },

  getTtsProvider: () => {
    try {
      return localStorage.getItem(STORAGE_KEYS.TTS_PROVIDER) || 'kokoro';
    } catch (error) {
      console.error('Failed to load TTS provider:', error);
      return 'kokoro';
    }
  },

  setTtsProvider: (provider) => {
    try {
      localStorage.setItem(STORAGE_KEYS.TTS_PROVIDER, provider || 'kokoro');
    } catch (error) {
      console.error('Failed to save TTS provider:', error);
    }
  },

  // Legacy preference remains readable; playback no longer uses this endpoint.
  getKokoroEndpoint: () => {
    try {
      return localStorage.getItem(STORAGE_KEYS.KOKORO_ENDPOINT) || '';
    } catch (error) {
      console.error('Failed to load Kokoro endpoint:', error);
      return '';
    }
  },

  setKokoroEndpoint: (endpoint) => {
    try {
      localStorage.setItem(STORAGE_KEYS.KOKORO_ENDPOINT, endpoint || '');
    } catch (error) {
      console.error('Failed to save Kokoro endpoint:', error);
    }
  },

  getKokoroVoice: () => {
    try {
      return localStorage.getItem(STORAGE_KEYS.KOKORO_VOICE) || 'af_bella';
    } catch (error) {
      console.error('Failed to load Kokoro voice:', error);
      return 'af_bella';
    }
  },

  setKokoroVoice: (voice) => {
    try {
      localStorage.setItem(STORAGE_KEYS.KOKORO_VOICE, voice || 'af_bella');
    } catch (error) {
      console.error('Failed to save Kokoro voice:', error);
    }
  },

  getKokoroSpeed: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.KOKORO_SPEED);
      const parsed = raw ? Number(raw) : 1;
      if (Number.isNaN(parsed)) return 1;
      return Math.max(0.5, Math.min(1.5, parsed));
    } catch (error) {
      console.error('Failed to load Kokoro speed:', error);
      return 1;
    }
  },

  setKokoroSpeed: (speed) => {
    try {
      const safe = Number.isFinite(Number(speed)) ? Number(speed) : 1;
      localStorage.setItem(STORAGE_KEYS.KOKORO_SPEED, String(Math.max(0.5, Math.min(1.5, safe))));
    } catch (error) {
      console.error('Failed to save Kokoro speed:', error);
    }
  },

  getSpeechRate: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SPEECH_RATE);
      const parsed = raw ? Number(raw) : 1;
      if (Number.isNaN(parsed)) return 1;
      return Math.max(0.5, Math.min(1.5, parsed));
    } catch (error) {
      console.error('Failed to load speech rate:', error);
      return 1;
    }
  },

  setSpeechRate: (rate) => {
    try {
      const safe = Number.isFinite(Number(rate)) ? Number(rate) : 1;
      localStorage.setItem(STORAGE_KEYS.SPEECH_RATE, String(Math.max(0.5, Math.min(1.5, safe))));
    } catch (error) {
      console.error('Failed to save speech rate:', error);
    }
  },
};
