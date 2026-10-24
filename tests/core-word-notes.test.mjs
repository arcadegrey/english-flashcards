import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { CORE_WORD_NOTES, CORE_SYNONYM_GROUPS, CORE_WORD_FORMATIONS, WORD_NOTE_SOURCES } from '../src/data/coreWordNotes.js';
import { getCoreWordHints, getWordHints } from '../src/utils/wordHints.js';
import { EVERYDAY_WORD_NOTES, EVERYDAY_SYNONYM_GROUPS } from '../src/data/everydayWordNotes.js';
import { USAGE_WORD_NOTES, USAGE_SYNONYM_GROUPS } from '../src/data/usageWordNotes.js';
import * as expansionOne from '../src/data/expansionOneWordNotes.js';
import * as expansionTwo from '../src/data/expansionTwoWordNotes.js';
import * as expansionThree from '../src/data/expansionThreeWordNotes.js';

const allowedHosts = new Set(['dictionary.cambridge.org', 'downloads.bbc.co.uk', 'stella.glasgow.ac.uk', 'www.merriam-webster.com', 'www.oxfordlearnersdictionaries.com', 'www.collinsdictionary.com']);

test('all 3000 notes match existing vocabulary without introducing word IDs or rewriting records', async () => {
  const vocabulary = JSON.parse(await readFile(new URL('../public/data/vocabulary.json', import.meta.url), 'utf8'));
  assert.equal(Object.keys(CORE_WORD_NOTES).length, 3000);
  assert.equal(Object.values(CORE_WORD_NOTES).filter(entry => entry.formation).length, 47);
  for (const [word, entry] of Object.entries(CORE_WORD_NOTES)) {
    const stored = vocabulary.find(item => item.word === word);
    assert(stored, word);
    const frozen = Object.freeze({ ...stored });
    const before = JSON.stringify(frozen);
    const hints = getCoreWordHints(frozen);
    const type = CORE_SYNONYM_GROUPS[entry.synonymGroup].comparisonType;
    assert.equal(hints[0].label, type === 'usage' ? '用法提示' : type === 'confusable' ? '易混词辨析' : '近义词辨析');
    assert.equal(hints.length, entry.formation ? 2 : 1);
    assert.equal(JSON.stringify(frozen), before);
    assert(CORE_SYNONYM_GROUPS[entry.synonymGroup].words.includes(word));
  }
});

test('the expansion distinguishes confusable words, polysemy and grammar while retaining target-word emphasis', () => {
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

test('every displayed note has a sense, two bilingual examples and checkable primary references', () => {
  for (const [id, group] of Object.entries(CORE_SYNONYM_GROUPS)) {
    assert.equal(group.review.status, 'source-checked', id);
    assert.equal(new Set(group.words).size, group.words.length);
    assert(group.comparisonType === 'usage' ? group.words.length === 1 : group.words.length >= 2);
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
  for (const word of ['unlistedwordfortest', 'helpfully-not-a-word', '__proto__', '']) {
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

test('two independent 100-word batches have no mapping collisions and each example teaches its intended headword', () => {
  const allNewWords = new Set();
  const examples = new Set();
  for (const [notes, groups] of [[EVERYDAY_WORD_NOTES, EVERYDAY_SYNONYM_GROUPS], [USAGE_WORD_NOTES, USAGE_SYNONYM_GROUPS]]) {
    assert.equal(Object.keys(notes).length, 100);
    assert.equal(Object.keys(groups).length, 50);
    for (const [word, entry] of Object.entries(notes)) {
      assert(!allNewWords.has(word), `duplicate batch word: ${word}`);
      allNewWords.add(word);
      assert.deepEqual(CORE_WORD_NOTES[word], entry, word);
      const group = groups[entry.synonymGroup];
      assert(group.words.includes(word));
      // A direct dictionary reference is required for each new headword, not just a valid hostname.
      const source = WORD_NOTE_SOURCES[`expansion-mw-${word}`];
      assert.equal(source.url, `https://www.merriam-webster.com/dictionary/${word}`);
      assert(group.sourceIds.includes(`expansion-mw-${word}`));
      assert.equal(group.review.checkedAt, source.checkedAt);
    }
    for (const [id, group] of Object.entries(groups)) {
      assert(['synonym', 'confusable'].includes(group.comparisonType), id);
      assert.match(group.sense, /^(名词|动词|形容词|限定词|副词|介词)/, id);
      assert.equal(group.words.length, group.examples.length);
      for (const [index, word] of group.words.entries()) {
        const example = group.examples[index];
        assert.match(example.en, new RegExp(`\\b${word}\\b`, 'i'), `${id}: intended example`);
        assert(!examples.has(example.en), `${id}: reused example`);
        examples.add(example.en);
        assert(!Object.hasOwn(notes[word], 'id'), word);
        // Formations are optional; this batch must not invent unreviewed word roots.
        assert(!Object.hasOwn(notes[word], 'formation'), word);
        assert.equal(getCoreWordHints({ word }).length, 1);
        assert.deepEqual(getCoreWordHints({ word })[0].exampleWords, group.words);
      }
    }
  }
  assert.equal(allNewWords.size, 200);
  assert.equal(examples.size, 200);
});

test('new comparisons preserve countability, direction, time reference and polysemy boundaries', () => {
  for (const word of ['house', 'family', 'parent', 'neighbour', 'book', 'ticket', 'glass', 'hungry', 'clean', 'high', 'low', 'light', 'true', 'famous', 'lonely', 'much', 'each', 'another', 'near', 'ago', 'during', 'between', 'above', 'beside', 'borrow', 'win']) {
    assert.equal(getCoreWordHints({ word })[0].label, '易混词辨析', word);
  }
  for (const [word, expected] of [
    ['room', /不可数.*a room/], ['food', /foods.*meal/],
    ['high', /height.*名词/], ['full', /吃饱义不能/],
    ['light', /重量轻义/], ['brave', /粗体字义/],
    ['lonely', /未必难过/], ['sick', /英式英语.*呕吐/],
    ['much', /much.*不可数.*many.*复数/], ['each', /each of.*every of/],
    ['another', /another three days/], ['near', /不.*nearby the station/],
    ['ago', /现在为参照.*一般过去时/], ['during', /名词.*while.*从句/],
    ['between', /不只限于两个/], ['above', /above zero/],
    ['borrow', /borrow something from someone.*lend something to someone/],
    ['win', /比赛、奖项.*对手或队伍/],
  ]) assert.match(getCoreWordHints({ word })[0].text, expected, word);
});

test('new batches with draft or missing-source comparisons remain hidden without leaking guessed fallbacks', () => {
  for (const word of ['house', 'during']) {
    const group = CORE_SYNONYM_GROUPS[CORE_WORD_NOTES[word].synonymGroup];
    const status = group.review.status;
    const ids = group.sourceIds;
    try {
      group.review.status = 'draft';
      assert.deepEqual(getCoreWordHints({ word }), []);
      assert.equal(getWordHints({ word })[0].label, '词义回顾');
      group.review.status = status;
      group.sourceIds = [...ids, 'unregistered-reference'];
      assert.deepEqual(getCoreWordHints({ word }), []);
    } finally {
      group.review.status = status;
      group.sourceIds = ids;
    }
  }
});

test('single-word usage notes share the hint layout without fake synonyms or a leading separator', () => {
  const group = CORE_SYNONYM_GROUPS[CORE_WORD_NOTES.house.synonymGroup];
  const originalType = group.comparisonType;
  const originalWords = group.words;
  try {
    group.comparisonType = 'usage';
    group.words = ['house'];
    const hint = getCoreWordHints({ word: 'house' })[0];
    assert.equal(hint.label, '用法提示');
    assert.equal(hint.text, group.note);
    assert.equal(hint.emphasis, undefined);
    assert.deepEqual(hint.exampleWords, ['house']);
    assert.equal(hint.examples.length, 2);
    assert(hint.sources.length > 0);
  } finally {
    group.comparisonType = originalType;
    group.words = originalWords;
  }
});

test('three 900-word expansions retain independent mappings and complete teaching examples', () => {
  const seen = new Set();
  for (const [batch, prefix] of [[expansionOne, 'ONE'], [expansionTwo, 'TWO'], [expansionThree, 'THREE']]) {
    const notes = batch[`EXPANSION_${prefix}_WORD_NOTES`];
    const groups = batch[`EXPANSION_${prefix}_SYNONYM_GROUPS`];
    const sources = batch[`EXPANSION_${prefix}_NOTE_SOURCES`];
    assert.equal(Object.keys(notes).length, 900, prefix);
    for (const [word, note] of Object.entries(notes)) {
      assert(!seen.has(word), `overlapping batches: ${word}`);
      seen.add(word);
      assert.deepEqual(CORE_WORD_NOTES[word], note);
      const group = groups[note.synonymGroup];
      assert(group, word);
      assert.match(group.examples.map(example => example.en).join(' '), new RegExp(`\\b${word}\\b`, 'i'), word);
      for (const example of group.examples) {
        assert.doesNotMatch(example.en, /Students often meet the word|example sentence for|placeholder/i, word);
      }
      assert(group.sourceIds.every(id => Object.hasOwn(sources, id)), word);
      assert(!Object.hasOwn(note, 'formation'), `unreviewed formation: ${word}`);
    }
  }
  assert.equal(seen.size, 2700);
});
