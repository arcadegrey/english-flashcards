import { DAILY_NEW_WORD_TARGETS, normalizePlanCategory } from './studyPlan.js';

const STORAGE_KEYS = {
  LEARNED_WORDS: 'flashcards_learned_words',
  MASTERED_WORDS: 'flashcards_mastered_words',
  STUDY_HISTORY: 'flashcards_study_history',
  THEME: 'flashcards_theme',
  THEME_EXPLICIT: 'flashcards_theme_explicit',
  SELECTED_VOICE: 'flashcards_selected_voice',
  TTS_PROVIDER: 'flashcards_tts_provider',
  KOKORO_ENDPOINT: 'flashcards_kokoro_endpoint',
  KOKORO_VOICE: 'flashcards_kokoro_voice',
  KOKORO_SPEED: 'flashcards_kokoro_speed',
  SPEECH_RATE: 'flashcards_speech_rate',
  WORD_PROGRESS: 'flashcards_word_progress',
  WRONG_WORDS: 'flashcards_wrong_words',
  CUSTOM_WORDS: 'flashcards_custom_words',
  AUTH_SESSION: 'flashcards_auth_session',
  DAILY_NEW_WORD_TARGET: 'flashcards_daily_new_word_target',
  STUDY_PLAN_CATEGORY: 'flashcards_study_plan_category',
  PLAN_EXAM_ACTIVITY: 'flashcards_plan_exam_activity',
};

export const storage = {
  getLearningOwner: () => {
    try { return localStorage.getItem('flashcards_progress_owner') || storage.getAuthSession()?.user?.id || 'guest'; } catch { return 'guest'; }
  },
  getLearningSnapshot: () => ({
    learnedWords: storage.getLearnedWords(), masteredWords: storage.getMasteredWords(),
    customWords: storage.getCustomWords(), wordProgress: storage.getWordProgress(),
    wrongWords: storage.getWrongWords(), studyHistory: storage.getStudyHistory(),
    planExamActivity: storage.getPlanExamActivity(),
    preferences: { dailyNewWordTarget: storage.getDailyNewWordTarget(), studyPlanCategory: storage.getStudyPlanCategory(), updatedAt: storage.getPlanPreferencesUpdatedAt() },
  }),
  switchLearningAccount: (userId, latestProgress) => {
    const owner = String(userId || 'guest');
    const previous = String(storage.getLearningOwner());
    const current = storage.getLearningSnapshot();
    if (owner === previous) {
      localStorage.setItem('flashcards_progress_owner', owner);
      return current;
    }
    // Archive before replacing the active cache. Never merge another signed-in user's work.
    localStorage.setItem(`flashcards_account_progress:${previous}`, JSON.stringify({ ...current, ...latestProgress }));
    let saved;
    try { saved = JSON.parse(localStorage.getItem(`flashcards_account_progress:${owner}`) || 'null'); } catch { saved = null; }
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) saved = null;
    const snapshot = {
      learnedWords: [], masteredWords: [], customWords: [], wordProgress: {}, wrongWords: [], studyHistory: [], planExamActivity: {},
      ...saved,
      preferences: { dailyNewWordTarget: 15, studyPlanCategory: 'all', updatedAt: '', ...saved?.preferences },
    };
    const values = { LEARNED_WORDS: snapshot.learnedWords, MASTERED_WORDS: snapshot.masteredWords,
      CUSTOM_WORDS: snapshot.customWords, WORD_PROGRESS: snapshot.wordProgress, WRONG_WORDS: snapshot.wrongWords,
      STUDY_HISTORY: snapshot.studyHistory, PLAN_EXAM_ACTIVITY: snapshot.planExamActivity };
    for (const [key, value] of Object.entries(values)) localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
    localStorage.setItem(STORAGE_KEYS.DAILY_NEW_WORD_TARGET, String(snapshot.preferences.dailyNewWordTarget));
    localStorage.setItem(STORAGE_KEYS.STUDY_PLAN_CATEGORY, snapshot.preferences.studyPlanCategory);
    localStorage.setItem('flashcards_plan_preferences_updated_at', snapshot.preferences.updatedAt);
    localStorage.setItem('flashcards_progress_owner', owner);
    return snapshot;
  },
  getPlanPreferencesUpdatedAt: () => {
    try { return localStorage.getItem('flashcards_plan_preferences_updated_at') || ''; } catch { return ''; }
  },
  setPlanPreferencesUpdatedAt: (value) => {
    try { localStorage.setItem('flashcards_plan_preferences_updated_at', value); } catch { /* Storage can be disabled. */ }
  },
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

  clearProgress: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.LEARNED_WORDS);
      localStorage.removeItem(STORAGE_KEYS.MASTERED_WORDS);
      localStorage.removeItem(STORAGE_KEYS.WORD_PROGRESS);
      localStorage.removeItem(STORAGE_KEYS.WRONG_WORDS);
      localStorage.removeItem(STORAGE_KEYS.STUDY_HISTORY);
      localStorage.removeItem(STORAGE_KEYS.PLAN_EXAM_ACTIVITY);
    } catch (error) {
      console.error('Failed to clear progress:', error);
    }
  },

  clear: () => {
    storage.clearProgress();
  },

  getAuthSession: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load auth session:', error);
      return null;
    }
  },

  setAuthSession: (session) => {
    try {
      if (!session) {
        localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
        return;
      }
      localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to save auth session:', error);
    }
  },

  clearAuthSession: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    } catch (error) {
      console.error('Failed to clear auth session:', error);
    }
  },

  getDailyNewWordTarget: () => {
    try {
      const raw = Number(localStorage.getItem(STORAGE_KEYS.DAILY_NEW_WORD_TARGET));
      return DAILY_NEW_WORD_TARGETS.includes(raw) ? raw : 15;
    } catch (error) {
      console.error('Failed to load daily new word target:', error);
      return 15;
    }
  },

  hasDailyNewWordTarget: () => {
    try {
      return localStorage.getItem(STORAGE_KEYS.DAILY_NEW_WORD_TARGET) !== null;
    } catch (error) {
      console.error('Failed to check daily new word target:', error);
      return false;
    }
  },

  setDailyNewWordTarget: (target) => {
    try {
      const safeTarget = DAILY_NEW_WORD_TARGETS.includes(Number(target)) ? Number(target) : 15;
      localStorage.setItem(STORAGE_KEYS.DAILY_NEW_WORD_TARGET, String(safeTarget));
    } catch (error) {
      console.error('Failed to save daily new word target:', error);
    }
  },

  // === New Storage Methods ===

  getStudyPlanCategory: () => {
    try {
      return normalizePlanCategory(localStorage.getItem(STORAGE_KEYS.STUDY_PLAN_CATEGORY));
    } catch {
      return 'all';
    }
  },

  setStudyPlanCategory: (category) => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDY_PLAN_CATEGORY, normalizePlanCategory(category));
    } catch (error) {
      console.error('Failed to save study plan category:', error);
    }
  },

  getPlanExamActivity: () => {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLAN_EXAM_ACTIVITY) || 'null');
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch {
      return {};
    }
  },

  setPlanExamActivity: (activity) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAN_EXAM_ACTIVITY, JSON.stringify(activity));
    } catch (error) {
      console.error('Failed to save plan exam activity:', error);
    }
  },

  // Study History: daily learning activity records.
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

  getWrongWords: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WRONG_WORDS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load wrong words:', error);
      return [];
    }
  },

  setWrongWords: (words) => {
    try {
      localStorage.setItem(STORAGE_KEYS.WRONG_WORDS, JSON.stringify(words));
    } catch (error) {
      console.error('Failed to save wrong words:', error);
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
  recordStudySession: (wordsLearned = 0, wordsMastered = 0, timeSpent = 0, extra = {}) => {
    try {
      const delta =
        wordsLearned && typeof wordsLearned === 'object'
          ? wordsLearned
          : { wordsLearned, wordsMastered, timeSpent, ...extra };
      const history = storage.getStudyHistory();
      const today = new Date().toISOString().split('T')[0];
      const existingToday = history.findIndex(h => h.date === today);
      
      if (existingToday >= 0) {
        const current = history[existingToday];
        current.wordsLearned = Number(current.wordsLearned || 0) + Number(delta.wordsLearned || 0);
        current.wordsMastered = Number(current.wordsMastered || 0) + Number(delta.wordsMastered || 0);
        current.timeSpent = Number(current.timeSpent || 0) + Number(delta.timeSpent || 0);
        current.readingsCompleted = Number(current.readingsCompleted || 0) + Number(delta.readingsCompleted || 0);
        current.readingQuestionsAnswered = Number(current.readingQuestionsAnswered || 0) + Number(delta.readingQuestionsAnswered || 0);
        current.readingQuestionsCorrect = Number(current.readingQuestionsCorrect || 0) + Number(delta.readingQuestionsCorrect || 0);
        current.examQuestionsAnswered = Number(current.examQuestionsAnswered || 0) + Number(delta.examQuestionsAnswered || 0);
        current.examQuestionsCorrect = Number(current.examQuestionsCorrect || 0) + Number(delta.examQuestionsCorrect || 0);
      } else {
        history.push({
          date: today,
          wordsLearned: Number(delta.wordsLearned || 0),
          wordsMastered: Number(delta.wordsMastered || 0),
          timeSpent: Number(delta.timeSpent || 0),
          readingsCompleted: Number(delta.readingsCompleted || 0),
          readingQuestionsAnswered: Number(delta.readingQuestionsAnswered || 0),
          readingQuestionsCorrect: Number(delta.readingQuestionsCorrect || 0),
          examQuestionsAnswered: Number(delta.examQuestionsAnswered || 0),
          examQuestionsCorrect: Number(delta.examQuestionsCorrect || 0),
          readingArticleIds: [],
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
