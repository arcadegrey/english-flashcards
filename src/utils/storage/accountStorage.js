import { STORAGE_KEYS } from './keys.js';

export function createAccountStorage(storage) {
  return {
    getLearningOwner: () => {
      try { return localStorage.getItem('flashcards_progress_owner') || storage.getAuthSession()?.user?.id || 'guest'; } catch { return 'guest'; }
    },

    getLearningSnapshot: () => ({
      learnedWords: storage.getLearnedWords(), masteredWords: storage.getMasteredWords(),
      customWords: storage.getCustomWords(), wordProgress: storage.getWordProgress(),
      wrongWords: storage.getWrongWords(), studyHistory: storage.getStudyHistory(),
      planExamActivity: storage.getPlanExamActivity(),
      preferences: { wordBookmarks: storage.getWordBookmarks(), dailyNewWordTarget: storage.getDailyNewWordTarget(), studyPlanCategory: storage.getStudyPlanCategory(), updatedAt: storage.getPlanPreferencesUpdatedAt() },
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
      localStorage.setItem(STORAGE_KEYS.WORD_BOOKMARKS, JSON.stringify(snapshot.preferences.wordBookmarks || {}));
      localStorage.setItem('flashcards_progress_owner', owner);
      return snapshot;
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
  };
}
