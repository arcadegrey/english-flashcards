import { STORAGE_KEYS } from './keys.js';
import { normalizeWordBookmarks, mergeWordBookmarks, changeWordBookmark } from '../../../shared/wordBookmarks.js';
import { DAILY_NEW_WORD_TARGETS, normalizePlanCategory } from '../studyPlan.js';

export function createPlanStorage(storage) {
  return {
    getWordBookmarks: () => {
      try { return normalizeWordBookmarks(JSON.parse(localStorage.getItem(STORAGE_KEYS.WORD_BOOKMARKS) || '{}')); }
      catch { return {}; }
    },

    setWordBookmarks: (bookmarks) => {
      // Unlike legacy progress setters, propagate storage failure to the caller.
      localStorage.setItem(STORAGE_KEYS.WORD_BOOKMARKS, JSON.stringify(normalizeWordBookmarks(bookmarks)));
    },

    changeWordBookmark: (ownerId, bookmarks, wordId, saved) => {
      if (String(storage.getLearningOwner()) !== String(ownerId || 'guest')) {
        throw new Error('账号已切换，请刷新页面后重试。');
      }
      const next = changeWordBookmark(mergeWordBookmarks(storage.getWordBookmarks(), bookmarks), wordId, saved);
      storage.setWordBookmarks(next);
      return next;
    },

    getPlanPreferencesUpdatedAt: () => {
      try { return localStorage.getItem('flashcards_plan_preferences_updated_at') || ''; } catch { return ''; }
    },

    setPlanPreferencesUpdatedAt: (value) => {
      try { localStorage.setItem('flashcards_plan_preferences_updated_at', value); } catch { /* Storage can be disabled. */ }
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
  };
}
