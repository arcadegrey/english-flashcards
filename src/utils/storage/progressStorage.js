import { STORAGE_KEYS } from './keys.js';
import { getStudyDateKey } from '../../../shared/studyDate.js';

export function createProgressStorage(storage) {
  return {
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

    updateWordProgress: (wordId, progressData) => {
      try {
        const current = storage.getWordProgress();
        current[wordId] = { ...current[wordId], ...progressData };
        storage.setWordProgress(current);
      } catch (error) {
        console.error('Failed to update word progress:', error);
      }
    },

    recordStudySession: (wordsLearned = 0, wordsMastered = 0, timeSpent = 0, extra = {}) => {
      try {
        const delta =
          wordsLearned && typeof wordsLearned === 'object'
            ? wordsLearned
            : { wordsLearned, wordsMastered, timeSpent, ...extra };
        const history = storage.getStudyHistory();
        const today = getStudyDateKey();
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
}
