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
