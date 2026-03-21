// SM-2 Spaced Repetition Algorithm Implementation
// Based on the SuperMemo-2 algorithm

// Rating levels:
// 1 = Again (complete blackout)
// 2 = Hard (incorrect response; correct one remembered)
// 3 = Good (correct response after hesitation)
// 4 = Easy (correct response with perfect recall)

const DEFAULT_EASE_FACTOR = 2.5;
const DEFAULT_INTERVAL = 0;
const DEFAULT_REPS = 0;

/**
 * Calculate next review date using SM-2 algorithm
 * @param {Object} wordProgress - Current progress { easeFactor, reps, interval, nextReview }
 * @param {number} rating - User rating (1-4)
 * @returns {Object} - { nextReview: Date, interval: days, easeFactor: number, reps: number }
 */
export const calculateNextReview = (wordProgress = {}, rating) => {
  let {
    easeFactor = DEFAULT_EASE_FACTOR,
    reps = DEFAULT_REPS,
    interval = DEFAULT_INTERVAL,
  } = wordProgress;

  // Update repetition count
  if (rating >= 3) {
    reps += 1;
  } else {
    reps = 0;
  }

  // Update interval based on reps
  if (reps === 1) {
    interval = 1;
  } else if (reps === 2) {
    interval = 6;
  } else {
    interval = Math.round(interval * easeFactor);
  }

  // Update ease factor using SM-2 formula
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  // Where q is the rating (1-4), clamped to minimum 1.3
  easeFactor = easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
  easeFactor = Math.max(1.3, Math.min(3.0, easeFactor));

  // If rating < 3, reset interval to 0 (review again today)
  if (rating < 3) {
    interval = 0;
  }

  // Calculate next review date
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    nextReview,
    interval,
    easeFactor: Math.round(easeFactor * 100) / 100,
    reps,
  };
};

/**
 * Get words that are due for review today
 * @param {Array} allWords - All vocabulary words
 * @param {Object} wordProgress - Word progress data { wordId: { nextReview, ... } }
 * @returns {Array} - Words due for review
 */
export const getWordsForReview = (allWords, wordProgress = {}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return allWords.filter((word) => {
    const progress = wordProgress[word.id];
    
    // No progress yet = new word, include for learning
    if (!progress) {
      return false; // New words handled separately in learn mode
    }

    const nextReviewDate = new Date(progress.nextReview);
    nextReviewDate.setHours(0, 0, 0, 0);

    // Due if next review is today or in the past
    return nextReviewDate <= today;
  });
};

/**
 * Initialize word progress for a new word
 * @returns {Object} - Initial progress object
 */
export const initializeWordProgress = () => ({
  nextReview: new Date(),
  easeFactor: DEFAULT_EASE_FACTOR,
  reps: DEFAULT_REPS,
  interval: DEFAULT_INTERVAL,
});

/**
 * Get review statistics
 * @param {Array} allWords - All vocabulary words
 * @param {Object} wordProgress - Word progress data
 * @returns {Object} - Statistics object
 */
export const getReviewStats = (allWords, wordProgress = {}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let dueCount = 0;
  let learnedCount = 0;
  let masteredCount = 0;

  allWords.forEach((word) => {
    const progress = wordProgress[word.id];
    
    if (!progress) {
      return; // New word
    }

    if (progress.reps >= 5 && progress.easeFactor >= 2.5) {
      masteredCount++;
    } else if (progress.reps >= 1) {
      learnedCount++;
    }

    const nextReviewDate = new Date(progress.nextReview);
    nextReviewDate.setHours(0, 0, 0, 0);

    if (nextReviewDate <= today) {
      dueCount++;
    }
  });

  return {
    due: dueCount,
    learned: learnedCount,
    mastered: masteredCount,
    new: allWords.length - learnedCount - masteredCount,
  };
};

/**
 * Get words grouped by review priority
 * @param {Array} allWords - All vocabulary words
 * @param {Object} wordProgress - Word progress data
 * @returns {Object} - { overdue: [], due: [], upcoming: [] }
 */
export const getWordsByPriority = (allWords, wordProgress = {}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdue = [];
  const due = [];
  const upcoming = [];

  allWords.forEach((word) => {
    const progress = wordProgress[word.id];
    
    if (!progress) {
      return;
    }

    const nextReviewDate = new Date(progress.nextReview);
    nextReviewDate.setHours(0, 0, 0, 0);

    const daysUntilReview = Math.ceil((nextReviewDate - today) / (1000 * 60 * 60 * 24));

    if (daysUntilReview < 0) {
      overdue.push({ ...word, daysOverdue: Math.abs(daysUntilReview), ...progress });
    } else if (daysUntilReview === 0) {
      due.push({ ...word, ...progress });
    } else if (daysUntilReview <= 7) {
      upcoming.push({ ...word, daysUntilReview, ...progress });
    }
  });

  // Sort by priority (most overdue first, then by ease factor)
  overdue.sort((a, b) => b.daysOverdue - a.daysOverdue);
  due.sort((a, b) => a.easeFactor - b.easeFactor);
  upcoming.sort((a, b) => a.daysUntilReview - b.daysUntilReview);

  return { overdue, due, upcoming };
};

export default {
  calculateNextReview,
  getWordsForReview,
  initializeWordProgress,
  getReviewStats,
  getWordsByPriority,
};
