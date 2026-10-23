import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { CORE_WORD_NOTES, CORE_SYNONYM_GROUPS, CORE_WORD_FORMATIONS, WORD_NOTE_SOURCES } from '../src/data/coreWordNotes.js';
import { getCoreWordHints, getWordHints } from '../src/utils/wordHints.js';

const allowedHosts = new Set(['dictionary.cambridge.org', 'downloads.bbc.co.uk', 'stella.glasgow.ac.uk']);

test('all 100 notes match existing vocabulary without introducing word IDs or rewriting records', async () => {
  const vocabulary = JSON.parse(await readFile(new URL('../public/data/vocabulary.json', import.meta.url), 'utf8'));
  assert.equal(Object.keys(CORE_WORD_NOTES).length, 100);
  assert.equal(Object.values(CORE_WORD_NOTES).filter(entry => entry.formation).length, 47);
  for (const [word, entry] of Object.entries(CORE_WORD_NOTES)) {
    const stored = vocabulary.find(item => item.word === word);
    assert(stored, word);
    const frozen = Object.freeze({ ...stored });
    const before = JSON.stringify(frozen);
    const hints = getCoreWordHints(frozen);
    assert.equal(hints[0].label, CORE_SYNONYM_GROUPS[entry.synonymGroup].comparisonType === 'confusable' ? '易混词辨析' : '近义词辨析');
    assert.equal(hints.length, entry.formation ? 2 : 1);
    assert.equal(JSON.stringify(frozen), before);
    assert(CORE_SYNONYM_GROUPS[entry.synonymGroup].words.includes(word));
  }
});

test('the expansion distinguishes confusable words, polysemy and grammar while retaining target-word emphasis', () => {
  assert.equal(Object.keys(CORE_SYNONYM_GROUPS).length, 56);
  for (const word of ['look', 'see', 'watch', 'hear', 'listen', 'bring', 'take', 'come', 'arrive', 'tired', 'sleepy', 'new', 'recent', 'common', 'ordinary']) {
    assert.equal(getCoreWordHints({ word })[0].label, '易混词辨析');
  }
  assert.match(getCoreWordHints({ word: 'listen' })[0].text, /listen.*to/);
  assert.match(getCoreWordHints({ word: 'say' })[0].text, /say something to someone/);
  assert.match(getCoreWordHints({ word: 'reply' })[0].text, /reply to/);
  assert.match(getCoreWordHints({ word: 'poor' })[0].scope, /质量/);
  assert.match(getCoreWordHints({ word: 'pretty' })[0].text, /副词/);
  assert.match(getCoreWordHints({ word: 'mad' })[0].scope, /生气/);
  assert.match(getCoreWordHints({ word: 'beautiful' })[1].text, /y 变成 i/);
  assert.match(getCoreWordHints({ word: 'incorrect' })[1].text, /^in- \+ correct → incorrect/);
  const comparison = getCoreWordHints({ word: 'buy' })[0];
  assert.equal(comparison.emphasis, 'purchase');
  assert.deepEqual(comparison.exampleWords, ['buy', 'purchase']);
  assert.deepEqual(getCoreWordHints({ word: 'helpful' })[0].exampleWords, ['helpful', 'useful']);
});

test('every displayed synonym comparison has a sense, two bilingual examples and checkable primary references', () => {
  for (const [id, group] of Object.entries(CORE_SYNONYM_GROUPS)) {
    assert.equal(group.review.status, 'source-checked', id);
    assert.equal(new Set(group.words).size, group.words.length);
    assert(group.words.length >= 2);
    assert(group.sense.length > 4);
    assert(group.note.length > 20);
    assert.equal(group.examples.length, 2);
    for (const example of group.examples) {
      assert.match(example.en, /[a-zA-Z]/);
      assert.match(example.zh, /[\u4e00-\u9fff]/);
      assert.doesNotMatch(example.en, /[<>]/);
    }
    assert(group.sourceIds.length > 0);
    for (const sourceId of group.sourceIds) assert(WORD_NOTE_SOURCES[sourceId], `${id}: ${sourceId}`);
  }
  for (const source of Object.values(WORD_NOTE_SOURCES)) {
    const url = new URL(source.url);
    assert.equal(url.protocol, 'https:');
    assert(allowedHosts.has(url.hostname));
    assert(Number.isFinite(Date.parse(source.checkedAt)));
    assert(source.title.length > 2);
  }
});

test('formation notes preserve prefix order, real base words, spelling changes and the difference between current-word analysis and word-family extension', () => {
  for (const [word, entry] of Object.entries(CORE_WORD_NOTES)) {
    if (!entry.formation) continue;
    const formation = CORE_WORD_FORMATIONS[entry.formation];
    assert([formation.base, formation.derived].includes(word));
    assert.equal(formation.review.status, 'source-checked');
    const expected = formation.affixRole === '前缀'
      ? `${formation.affix} + ${formation.base} → ${formation.derived}`
      : `${formation.base} + ${formation.affix} → ${formation.derived}`;
    assert.equal(formation.expression, expected);
    for (const id of formation.sourceIds) assert(WORD_NOTE_SOURCES[id]);
  }
  assert.match(getCoreWordHints({ word: 'impossible' })[1].text, /^im- \+ possible → impossible/);
  assert.match(getCoreWordHints({ word: 'helpful' })[1].scope, /本词构词/);
  assert.match(getCoreWordHints({ word: 'help' })[1].scope, /词族拓展/);
  assert.match(getCoreWordHints({ word: 'easy' })[1].text, /y 变成 i/);
  assert.match(getCoreWordHints({ word: 'friendly' })[1].text, /是形容词/);
});

test('polysemous words have an explicit sense boundary and unsupported words never receive generated synonyms or roots', () => {
  assert.match(getCoreWordHints({ word: 'kind', pos: 'n.', meaning: '种类' })[0].scope, /形容词/);
  assert.match(getCoreWordHints({ word: 'kind' })[0].text, /不适用于.*种类/);
  assert.match(getCoreWordHints({ word: 'hard' })[0].text, /坚硬/);
  assert.match(getCoreWordHints({ word: 'work' })[0].text, /不可数/);
  assert.deepEqual(getCoreWordHints({ word: ' HELP ' }), getCoreWordHints({ word: 'help' }));
  for (const word of ['butterfly', 'helpfulness', 'helpfully', '__proto__', 'constructor', '']) {
    assert.deepEqual(getCoreWordHints({ word }), []);
    assert.equal(getWordHints({ word })[0].label, '词义回顾');
  }
});

test('draft content, missing references and unrelated formation mappings are withheld from the UI', () => {
  const synonyms = CORE_SYNONYM_GROUPS['help-assist'];
  const originalStatus = synonyms.review.status;
  const originalIds = synonyms.sourceIds;
  const originalFormation = CORE_WORD_NOTES.help.formation;
  try {
    synonyms.review.status = 'draft';
    assert(!getCoreWordHints({ word: 'help' }).some(hint => hint.label === '近义词辨析'));
    synonyms.review.status = originalStatus;
    synonyms.sourceIds = ['missing-source'];
    assert(!getCoreWordHints({ word: 'help' }).some(hint => hint.label === '近义词辨析'));
    CORE_WORD_NOTES.help.formation = 'teacher';
    assert(!getCoreWordHints({ word: 'help' }).some(hint => hint.label === '词根词缀'));
  } finally {
    synonyms.review.status = originalStatus;
    synonyms.sourceIds = originalIds;
    CORE_WORD_NOTES.help.formation = originalFormation;
  }
});
