// Keep client feedback and server grading identical. Punctuation/case are not
// listening targets; contractions remain words ("don't" is not "do not").
export const DICTATION_MAX_LENGTH = 1000;
export function dictationTokens(value) {
  return String(value || '').normalize('NFKC').replace(/[’‘ʼ]/g, "'")
    .match(/[\p{L}\p{N}]+(?:'[\p{L}\p{N}]+)*/gu) || [];
}
const key = token => token.toLowerCase().replaceAll("'", '');

export function isDictationExample(word) {
  const sentence = word?.example;
  const length = typeof sentence === 'string' ? dictationTokens(sentence).length : 0;
  return Boolean(word?.id != null && word?.word && typeof sentence === 'string'
    && sentence.length <= DICTATION_MAX_LENGTH && length >= 2 && length <= 60);
}

export const dictationCandidates = vocabulary => (Array.isArray(vocabulary) ? vocabulary : []).filter(word =>
  isDictationExample(word) || word?.id != null && word.word && word.exampleDeferred && !word.example);

// Word-level edit distance aligns insertions/deletions without shifting the rest
// of a sentence. An identical word elsewhere cannot hide a missing occurrence.
export function evaluateDictation(example, input) {
  const expected = dictationTokens(example), actual = dictationTokens(input);
  const rows = Array.from({ length: expected.length + 1 }, () => new Uint16Array(actual.length + 1));
  for (let i = 0; i <= expected.length; i++) rows[i][0] = i;
  for (let j = 0; j <= actual.length; j++) rows[0][j] = j;
  for (let i = 1; i <= expected.length; i++) for (let j = 1; j <= actual.length; j++) {
    rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1,
      rows[i - 1][j - 1] + Number(key(expected[i - 1]) !== key(actual[j - 1])));
  }
  const parts = [];
  let i = expected.length, j = actual.length;
  while (i || j) {
    if (i && j && key(expected[i - 1]) === key(actual[j - 1]) && rows[i][j] === rows[i - 1][j - 1]) {
      parts.push({ type: 'correct', expected: expected[--i], actual: actual[--j] });
    } else if (i && j && rows[i][j] === rows[i - 1][j - 1] + 1) {
      parts.push({ type: 'replacement', expected: expected[--i], actual: actual[--j] });
    } else if (i && rows[i][j] === rows[i - 1][j] + 1) {
      parts.push({ type: 'missing', expected: expected[--i], actual: '' });
    } else {
      parts.push({ type: 'extra', expected: '', actual: actual[--j] });
    }
  }
  return { correct: expected.length > 0 && rows[expected.length][actual.length] === 0,
    total: expected.length, matched: parts.filter(part => part.type === 'correct').length,
    missing: parts.filter(part => part.type === 'missing').length,
    extra: parts.filter(part => part.type === 'extra').length,
    replacements: parts.filter(part => part.type === 'replacement').length, parts: parts.reverse() };
}
