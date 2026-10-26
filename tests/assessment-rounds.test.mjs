import test from 'node:test';
import assert from 'node:assert/strict';
import { createQuizRound, createFillBlankRound, createMatchingRound } from '../src/utils/assessmentRounds.js';
import { sample, shuffle } from '../src/utils/random.js';

const words = [
  { id: 1, word: 'plan', meaning: '计划', example: 'We have a plan.' },
  { id: 2, word: 'book', meaning: '书', example: 'This book is useful.' },
  { id: 3, word: 'study', meaning: '学习', example: 'I study every day.' },
  { id: 4, word: 'time', meaning: '时间', example: 'It takes time.' },
  { id: 5, word: 'read', meaning: '阅读', example: 'We read books.' },
  { id: 6, word: 'PLAN', meaning: '策划', example: 'We plan the trip.' },
];

test('quiz options preserve category-scoped pools and exclude duplicate headwords and legacy aliases', () => {
  const round = createQuizRound([words[0]], [...words, { id: 7, word: 'Plan', meaning: '计划' }]);
  assert.equal(round.question.id, 1);
  assert.equal(round.options.length, 4);
  assert.equal(round.options.filter(word => word.word.toLowerCase() === 'plan').length, 1);
  assert.ok(round.options.every(word => words.includes(word)));
});

test('quiz falls back to question vocabulary when a small option pool cannot supply three distractors', () => {
  const round = createQuizRound(words.slice(0, 4), [words[0]]);
  assert.equal(round.options.length, 4);
  assert.equal(new Set(round.options.map(word => word.id)).size, 4);
  assert.ok(round.options.includes(round.question));
  assert.deepEqual(createQuizRound([]), { question: null, options: [] });
});

test('fill blank keeps sentence hiding and complete answer options, including explicit phrase text', () => {
  const phrase = { id: 10, word: 'look after', meaning: '照顾', example: 'We look after the dog.' };
  const round = createFillBlankRound([phrase]);
  assert.equal(round.sentence, 'We ______ the dog.');
  assert.deepEqual(round.options, [phrase]);
  assert.equal(round.error, '');
  const full = createFillBlankRound(words);
  assert.ok(full.sentence.includes('______'));
  assert.ok(full.options.includes(full.question));
  assert.equal(new Set(full.options.map(word => word.word.toLowerCase())).size, full.options.length);
});

test('fill blank explicitly handles empty vocabulary, missing examples and unhideable targets', () => {
  for (const pool of [[], [{ id: 1, word: 'plan' }], [{ id: 1, word: 'plan', example: 'Another sentence.' }]]) {
    const round = createFillBlankRound(pool);
    assert.ok(round.error); assert.equal(round.question, null); assert.deepEqual(round.options, []);
  }
});

test('matching pairs only usable distinct headwords, preserves IDs, and never mutates the input', () => {
  const before = structuredClone(words);
  const round = createMatchingRound([...words, null, { id: 7, word: 'missing meaning' }]);
  assert.equal(round.words.length, 5);
  assert.equal(new Set(round.words.map(word => word.word.toLowerCase())).size, 5);
  assert.deepEqual(new Set(round.meanings.map(word => word.id)), new Set(round.words.map(word => word.id)));
  assert.deepEqual(words, before);
  assert.ok(createMatchingRound([words[0], words[5]]).error);
  assert.ok(createMatchingRound([]).error);
});

test('partial sampling uses only requested random draws, supports bounds and leaves the pool intact', () => {
  const pool = Array.from({ length: 8699 }, (_, i) => i);
  let draws = 0;
  const result = sample(pool, 5, () => { draws += 1; return 0.5; });
  assert.equal(draws, 5); assert.equal(new Set(result).size, 5);
  assert.equal(pool[0], 0); assert.equal(pool.at(-1), 8698);
  assert.deepEqual(sample([1, 2], 0), []);
  assert.equal(sample([1, 2], 8).length, 2);
  assert.deepEqual([...shuffle([1, 2, 3])].sort(), [1, 2, 3]);
});

test('equal-headword IDs remain eligible across matching rounds rather than permanently selecting the first ID', () => {
  const random = Math.random;
  try {
    const pool = [words[0], words[5], words[1]];
    Math.random = () => 0;
    const first = createMatchingRound(pool).words;
    Math.random = () => 0.5;
    const second = createMatchingRound(pool).words;
    assert.ok(first.some(word => word.id === 1));
    assert.ok(second.some(word => word.id === 6));
    assert.equal(first.length, 2); assert.equal(second.length, 2);
  } finally { Math.random = random; }
});
