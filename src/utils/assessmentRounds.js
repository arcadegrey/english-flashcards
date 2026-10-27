import { distinctVocabularyWords } from '../../shared/vocabularyAliases.js';
import { shuffle, sample } from './random.js';

export const createQuizRound = (vocabulary = [], optionVocabulary = []) => {
  if (!Array.isArray(vocabulary) || vocabulary.length === 0) {
    return { question: null, options: [] };
  }

  const correctWord = vocabulary[Math.floor(Math.random() * vocabulary.length)];

  const distractorBase =
    optionVocabulary.length > 0
      ? optionVocabulary.filter((word) => word.id !== correctWord.id)
      : vocabulary.filter((word) => word.id !== correctWord.id);

  const wrongOptions = sample(distinctVocabularyWords(distractorBase, [correctWord]), 3);

  if (wrongOptions.length < 3) {
    const fallbackPool = vocabulary.filter(
      (word) => word.id !== correctWord.id && !wrongOptions.some((wrong) => wrong.id === word.id)
    );
    wrongOptions.push(...distinctVocabularyWords(fallbackPool, [correctWord, ...wrongOptions]).slice(0, 3 - wrongOptions.length));
  }

  return {
    question: correctWord,
    options: shuffle([correctWord, ...wrongOptions]),
  };
};


const BLANK_TOKEN = '______';

const escapeRegExp = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const buildHiddenSentence = (example = '', answerWord = '') => {
  const safeExample = String(example || '').trim();
  const safeWord = String(answerWord || '').trim();
  if (!safeExample || !safeWord) return '';

  const escapedWord = escapeRegExp(safeWord);
  const exactRegex = new RegExp(`\\b${escapedWord}\\b`, 'i');
  if (exactRegex.test(safeExample)) {
    return safeExample.replace(exactRegex, BLANK_TOKEN);
  }

  const inflectionRegex = new RegExp(`\\b${escapedWord}(s|es|ed|ing)?\\b`, 'i');
  if (inflectionRegex.test(safeExample)) {
    return safeExample.replace(inflectionRegex, BLANK_TOKEN);
  }

  return '';
};

export const createFillBlankRound = (vocabulary = []) => {
  if (!Array.isArray(vocabulary) || vocabulary.length === 0) {
    return {
      error: '当前词库为空，暂时无法生成填空题。',
      question: null,
      options: [],
      sentence: '',
    };
  }

  const candidates = vocabulary.filter((item) => item?.word && (item.example
    || item.exampleDeferred && item.fillBlankAvailable !== false));
  if (candidates.length === 0) {
    return {
      error: '当前词库缺少可用例句，暂时无法生成填空题。',
      question: null,
      options: [],
      sentence: '',
    };
  }

  const shuffledCandidates = shuffle(candidates);

  let selectedWord = null;
  let hiddenSentence = '';

  for (const item of shuffledCandidates) {
    // The build has checked eligibility against the canonical sentence. Fetch
    // only this question's sentence before exposing its answer buttons.
    if (item.exampleDeferred && item.fillBlankAvailable !== false && !item.example) {
      selectedWord = item;
      break;
    }
    const nextHiddenSentence = buildHiddenSentence(item.example, item.word);
    if (nextHiddenSentence && nextHiddenSentence !== item.example) {
      selectedWord = item;
      hiddenSentence = nextHiddenSentence;
      break;
    }
  }

  if (!selectedWord) {
    return {
      error: '当前例句中无法自动挖空目标词，请切换词库后重试。',
      question: null,
      options: [],
      sentence: '',
    };
  }

  const distractorPool = distinctVocabularyWords(vocabulary, [selectedWord]);
  const wrongOptions = sample(distractorPool, 3);

  return {
    error: '',
    question: selectedWord,
    options: shuffle([selectedWord, ...wrongOptions]),
    sentence: hiddenSentence,
  };
};


const ROUND_SIZE = 5;

export const createMatchingRound = (vocabulary = []) => {
  const candidates = Array.isArray(vocabulary)
    ? distinctVocabularyWords(shuffle(vocabulary.filter((item) => item?.id != null && item?.word && item?.meaning)))
    : [];

  if (candidates.length < 2) {
    return {
      error: '当前范围至少需要 2 个带释义的单词，才能生成连线题。',
      words: [],
      meanings: [],
    };
  }

  const words = sample(candidates, ROUND_SIZE);
  return {
    error: '',
    words,
    meanings: shuffle(words),
  };
};
