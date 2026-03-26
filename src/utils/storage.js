const STORAGE_KEYS = {
  LEARNED_WORDS: 'flashcards_learned_words',
  MASTERED_WORDS: 'flashcards_mastered_words',
  STUDY_HISTORY: 'flashcards_study_history',
  THEME: 'flashcards_theme',
  SELECTED_VOICE: 'flashcards_selected_voice',
  TTS_PROVIDER: 'flashcards_tts_provider',
  KOKORO_ENDPOINT: 'flashcards_kokoro_endpoint',
  KOKORO_VOICE: 'flashcards_kokoro_voice',
  KOKORO_SPEED: 'flashcards_kokoro_speed',
  WORD_PROGRESS: 'flashcards_word_progress',
  CUSTOM_WORDS: 'flashcards_custom_words',
};

export const storage = {
  // === Existing Methods ===
  getLearnedWords: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEARNED_WORDS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load learned words:', error);
      return [];
    }
  },

  setLearnedWords: (words) => {
    try {
      localStorage.setItem(STORAGE_KEYS.LEARNED_WORDS, JSON.stringify(words));
    } catch (error) {
      console.error('Failed to save learned words:', error);
    }
  },

  getMasteredWords: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MASTERED_WORDS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load mastered words:', error);
      return [];
    }
  },

  setMasteredWords: (words) => {
    try {
      localStorage.setItem(STORAGE_KEYS.MASTERED_WORDS, JSON.stringify(words));
    } catch (error) {
      console.error('Failed to save mastered words:', error);
    }
  },

  getCustomWords: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_WORDS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load custom words:', error);
      return [];
    }
  },

  setCustomWords: (words) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_WORDS, JSON.stringify(words));
    } catch (error) {
      console.error('Failed to save custom words:', error);
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.LEARNED_WORDS);
      localStorage.removeItem(STORAGE_KEYS.MASTERED_WORDS);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  },

  // === New Storage Methods ===

  // Study History: array of { date: 'YYYY-MM-DD', wordsLearned: N, wordsMastered: N, timeSpent: N }
  getStudyHistory: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDY_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load study history:', error);
      return [];
    }
  },

  setStudyHistory: (data) => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDY_HISTORY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save study history:', error);
    }
  },

  // Theme: 'light' | 'dark'
  getTheme: () => {
    try {
      return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    } catch (error) {
      console.error('Failed to load theme:', error);
      return 'light';
    }
  },

  setTheme: (theme) => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  },

  // Selected Voice: voice name string
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

  // TTS Provider: 'browser' | 'kokoro'
  getTtsProvider: () => {
    try {
      return localStorage.getItem(STORAGE_KEYS.TTS_PROVIDER) || 'browser';
    } catch (error) {
      console.error('Failed to load TTS provider:', error);
      return 'browser';
    }
  },

  setTtsProvider: (provider) => {
    try {
      localStorage.setItem(STORAGE_KEYS.TTS_PROVIDER, provider || 'browser');
    } catch (error) {
      console.error('Failed to save TTS provider:', error);
    }
  },

  // Kokoro endpoint, e.g. http://127.0.0.1:8880/v1/audio/speech
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

  // Word Progress: { wordId: { nextReview: date, easeFactor: N, reps: N, interval: N } }
  getWordProgress: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WORD_PROGRESS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to load word progress:', error);
      return {};
    }
  },

  setWordProgress: (data) => {
    try {
      localStorage.setItem(STORAGE_KEYS.WORD_PROGRESS, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save word progress:', error);
    }
  },

  // Helper: Update word progress for a single word
  updateWordProgress: (wordId, progressData) => {
    try {
      const current = storage.getWordProgress();
      current[wordId] = { ...current[wordId], ...progressData };
      storage.setWordProgress(current);
    } catch (error) {
      console.error('Failed to update word progress:', error);
    }
  },

  // Helper: Record study session
  recordStudySession: (wordsLearned = 0, wordsMastered = 0, timeSpent = 0) => {
    try {
      const history = storage.getStudyHistory();
      const today = new Date().toISOString().split('T')[0];
      const existingToday = history.findIndex(h => h.date === today);
      
      if (existingToday >= 0) {
        history[existingToday].wordsLearned += wordsLearned;
        history[existingToday].wordsMastered += wordsMastered;
        history[existingToday].timeSpent += timeSpent;
      } else {
        history.push({
          date: today,
          wordsLearned,
          wordsMastered,
          timeSpent,
        });
      }
      
      // Keep only last 90 days
      const recentHistory = history.slice(-90);
      storage.setStudyHistory(recentHistory);
    } catch (error) {
      console.error('Failed to record study session:', error);
    }
  },
};
