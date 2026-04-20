const WORD_REGEX = /[A-Za-z]+(?:'[A-Za-z]+)?|[^A-Za-z]+/g;
const ENGLISH_WORD_REGEX = /^[A-Za-z]+(?:'[A-Za-z]+)?$/;

const unique = (list) => Array.from(new Set(list.filter(Boolean)));

const trimPossessive = (token) => token.replace(/'s$/i, '').replace(/s'$/i, '');

const deriveVariants = (token = '') => {
  const lower = trimPossessive(String(token).toLowerCase());
  if (!lower) return [];

  const variants = [lower];

  const addIfValid = (value) => {
    if (value && value.length >= 2) {
      variants.push(value);
    }
  };

  if (lower.endsWith('ies') && lower.length > 4) addIfValid(`${lower.slice(0, -3)}y`);
  if (lower.endsWith('es') && lower.length > 4) addIfValid(lower.slice(0, -2));
  if (lower.endsWith('s') && lower.length > 3) addIfValid(lower.slice(0, -1));

  if (lower.endsWith('ing') && lower.length > 5) {
    const stem = lower.slice(0, -3);
    addIfValid(stem);
    addIfValid(`${stem}e`);
    if (stem.length > 2 && stem.at(-1) === stem.at(-2)) {
      addIfValid(stem.slice(0, -1));
    }
  }

  if (lower.endsWith('ed') && lower.length > 4) {
    const stem = lower.slice(0, -2);
    addIfValid(stem);
    addIfValid(`${stem}e`);
    if (stem.length > 2 && stem.at(-1) === stem.at(-2)) {
      addIfValid(stem.slice(0, -1));
    }
  }

  return unique(variants);
};

export const tokenizeReadingText = (content = '') => {
  const safeContent = String(content || '');
  return safeContent.match(WORD_REGEX) || [];
};

export const isEnglishWordToken = (token = '') => ENGLISH_WORD_REGEX.test(String(token));

export const buildWordLookup = (words = []) => {
  const lookup = new Map();
  words.forEach((word) => {
    const key = String(word?.word || '').trim().toLowerCase();
    if (!key || lookup.has(key)) return;
    lookup.set(key, word);
  });
  return lookup;
};

export const resolveVocabularyWord = (token, wordLookup) => {
  if (!isEnglishWordToken(token) || !wordLookup) return null;
  const variants = deriveVariants(token);
  for (const variant of variants) {
    const matched = wordLookup.get(variant);
    if (matched) return matched;
  }
  return null;
};

