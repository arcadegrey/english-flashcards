const STORAGE_KEYS = {
  LEARNED_WORDS: 'flashcards_learned_words',
  MASTERED_WORDS: 'flashcards_mastered_words',
};

export const storage = {
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

  clear: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.LEARNED_WORDS);
      localStorage.removeItem(STORAGE_KEYS.MASTERED_WORDS);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  },
};
