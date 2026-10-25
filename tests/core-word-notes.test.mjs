import { vocabularyNoteKey } from '../shared/vocabularyAliases.js';
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { CORE_WORD_NOTES, CORE_SYNONYM_GROUPS, CORE_WORD_FORMATIONS, WORD_NOTE_SOURCES } from '../src/data/coreWordNotes.js';
import { getCoreWordHints, getHintExampleParts, getWordHints } from '../src/utils/wordHints.js';
import { EVERYDAY_WORD_NOTES, EVERYDAY_SYNONYM_GROUPS } from '../src/data/everydayWordNotes.js';
import { USAGE_WORD_NOTES, USAGE_SYNONYM_GROUPS } from '../src/data/usageWordNotes.js';
import * as expansionOne from '../src/data/expansionOneWordNotes.js';
import * as expansionTwo from '../src/data/expansionTwoWordNotes.js';
import * as expansionThree from '../src/data/expansionThreeWordNotes.js';
import * as expansionFour from '../src/data/expansionFourWordNotes.js';
import * as expansionFive from '../src/data/expansionFiveWordNotes.js';
import * as expansionSix from '../src/data/expansionSixWordNotes.js';
import * as expansionSeven from '../src/data/expansionSevenWordNotes.js';
import * as expansionEight from '../src/data/expansionEightWordNotes.js';
import * as expansionNine from '../src/data/expansionNineWordNotes.js';

const allowedHosts = new Set(['dictionary.cambridge.org', 'downloads.bbc.co.uk', 'stella.glasgow.ac.uk', 'www.merriam-webster.com', 'www.oxfordlearnersdictionaries.com', 'www.collinsdictionary.com', 'www.dictionary.com', 'agrovoc.fao.org', 'www.microsoft.com', 'news.microsoft.com', 'www.guinness.com', 'www.tandfonline.com']);

test('reviewed example forms highlight plurals, past tense and third-person verbs with visible references', () => {
  for (const [lookup, word, form] of [
    ['begin', 'begin', 'begins'], ['teach', 'teach', 'teaches'], ['teach', 'instruct', 'instructed'], ['learn', 'learn', 'learned'],
    ['learner', 'learner', 'learners'], ['learner', 'student', 'students'], ['worker', 'worker', 'workers'], ['buy', 'buy', 'bought'],
  ]) {
    const hint = getCoreWordHints({ word: lookup })[0];
    const example = hint.examples.find(item => item.forms?.some(entry => entry.form === form));
    assert(example, word);
    const parts = getHintExampleParts(example, hint.exampleWords);
    assert.equal(parts.map(part => part.text).join(''), example.en, `${word}: preserve text`);
    assert(parts.some(part => part.highlighted && part.text.toLowerCase() === form), word);
    assert(hint.sources.some(source => source.id === `forms-mw-${word}`), `${word}: reference displayed`);
    assert.equal(new Set(hint.sources.map(source => source.id)).size, hint.sources.length);
  }
  // A form belongs only to its annotated example, even within the same comparison.
  const buyHint = getCoreWordHints({ word: 'buy' })[0];
  assert.deepEqual(getHintExampleParts({ en: 'We bought tickets.' }, buyHint.exampleWords)
    .filter(part => part.highlighted), []);
});

test('unreviewed, missing-source and unrelated forms never become highlights or visible references', () => {
  const hint = getCoreWordHints({ word: 'buy' })[0];
  const example = hint.examples[0];
  const original = example.forms;
  const valid = original[0];
  try {
    for (const invalid of [
      { ...valid, review: { ...valid.review, status: 'draft' } },
      { ...valid, review: { status: 'source-checked', checkedAt: 'not-a-date' } },
      { ...valid, sourceIds: [] },
      { ...valid, sourceIds: ['missing-source'] },
      { ...valid, word: 'teach' },
      { ...valid, form: 'buy' }, // Not present in this example.
      { ...valid, form: 'bought a' },
      { ...valid, form: 'bought|notebook' },
      null,
    ]) {
      example.forms = [invalid];
      assert.deepEqual(getHintExampleParts(example, hint.exampleWords).filter(part => part.highlighted), []);
      assert(!getCoreWordHints({ word: 'buy' })[0].sources.some(source => source.id === valid.sourceIds[0]));
    }
    example.forms = 'bought';
    assert.deepEqual(getHintExampleParts(example, hint.exampleWords).filter(part => part.highlighted), []);
  } finally {
    example.forms = original;
  }
  assert(getHintExampleParts({ en: 'Buy tickets. We bought them.' }, ['buy'])
    .some(part => part.text === 'Buy' && part.highlighted));
});

test('example emphasis preserves case and punctuation without matching substrings, compounds or contractions', () => {
  const en = "BUY, buy! buyer rebuy buy2 _buy buy-in buy's cafébuy 买buy; make-up makeup can't cant.";
  const parts = getHintExampleParts({ en }, ['buy', 'make-up', "can't"]);
  assert.equal(parts.map(part => part.text).join(''), en);
  assert.deepEqual(parts.filter(part => part.highlighted).map(part => part.text), ['BUY', 'buy', 'make-up', "can't"]);
  assert.deepEqual(getHintExampleParts({ en: 'Helpful and USEFUL, unhelpful usefulness.' }, ['helpful', 'useful'])
    .filter(part => part.highlighted).map(part => part.text), ['Helpful', 'USEFUL']);
});

test('accented headwords and multiword phrases receive complete literal emphasis', () => {
  for (const [en, words, expected] of [
    ['Meet at the CAFÉ, then pass the cafébar.', ['café'], ['CAFÉ']],
    ['Income per capita grew; the per capitalization figure is unrelated.', ['per capita'], ['per capita']],
    ['El Niño is discussed in New Zealand.', ['el niño', 'new zealand'], ['El Niño', 'New Zealand']],
    ['Science fiction differs from fiction.', ['fiction', 'science fiction'], ['Science fiction', 'fiction']],
    ['A (test) and a+b are literal labels, not regex patterns.', ['(test)', 'a+b'], ['(test)', 'a+b']],
    ["The label says 'café'; ‘per capita’ is a phrase, but café's ending differs.", ['café', 'per capita'], ['café', 'per capita']],
  ]) {
    const parts = getHintExampleParts({ en }, words);
    assert.equal(parts.map(part => part.text).join(''), en);
    assert.deepEqual(parts.filter(part => part.highlighted).map(part => part.text), expected);
  }
});

test('every checked form belongs to its comparison, occurs as a complete token and has a direct headword source', () => {
  let count = 0;
  for (const group of Object.values(CORE_SYNONYM_GROUPS)) {
    for (const example of group.examples) {
      for (const annotation of example.forms || []) {
        count += 1;
        assert(group.words.includes(annotation.word));
        assert.equal(annotation.review.status, 'source-checked');
        assert(annotation.sourceIds.length > 0);
        for (const id of annotation.sourceIds) {
          const source = WORD_NOTE_SOURCES[id];
          assert(source, id);
          assert.equal(source.checkedAt, annotation.review.checkedAt);
          const sourcePath = decodeURIComponent(new URL(source.url).pathname).toLowerCase();
          assert([annotation.word, annotation.form].some(term => {
            const literal = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            return new RegExp(`[/#]${literal}(?:_\\d+)?(?:$|[/\\s])`).test(sourcePath);
          }), `${annotation.word}: direct word or inflected-form reference`);
        }
        assert(getHintExampleParts(example, group.words).some(part =>
          part.highlighted && part.text.toLowerCase() === annotation.form.toLowerCase()));
      }
    }
  }
  assert(count >= 8, 'retain the initial eight annotations while allowing reviewed new examples');
});

test('the final 2699 notes cover the exact vocabulary difference with unique original examples and sourced corrections', async () => {
  const { RETIRED_VOCABULARY } = await import('../shared/retiredVocabulary.js');
  const vocabulary = [...JSON.parse(await readFile(new URL('../public/data/vocabulary.json', import.meta.url), 'utf8')).filter(word => word.id <= 8699), ...RETIRED_VOCABULARY];
  const normalize = text => text.trim().toLowerCase();
  const previousWords = new Set(Object.entries(CORE_WORD_NOTES).filter(([, entry]) => !/^(e[789]-|practical-)/.test(entry.synonymGroup)).map(([word]) => word));
  const expected = new Set(vocabulary.map(vocabularyNoteKey).filter(word => !previousWords.has(word)));
  const previousExamples = new Set(Object.entries(CORE_SYNONYM_GROUPS).filter(([id]) => !/^e[789]-/.test(id)).flatMap(([, group]) => group.examples.map(example => normalize(example.en))));
  const vocabularyExamples = new Set(vocabulary.map(entry => entry.example).filter(Boolean).map(normalize));
  const seen = new Set(), examples = new Set(), groupsSeen = new Set(), sourcesSeen = new Set();
  assert.equal(previousWords.size, 6000);
  for (const [batch, prefix, count] of [[expansionSeven, 'SEVEN', 900], [expansionEight, 'EIGHT', 900], [expansionNine, 'NINE', 899]]) {
    const notes = batch[`EXPANSION_${prefix}_WORD_NOTES`];
    const groups = batch[`EXPANSION_${prefix}_SYNONYM_GROUPS`];
    const sources = batch[`EXPANSION_${prefix}_NOTE_SOURCES`];
    assert.equal(Object.keys(notes).length, count);
    for (const [word, entry] of Object.entries(notes)) {
      assert(!seen.has(word) && expected.has(word), word);
      seen.add(word);
      assert.equal(word, normalize(word));
      assert.deepEqual(CORE_WORD_NOTES[word], entry);
      assert(!entry.formation, `${word}: no unreviewed roots`);
      const group = groups[entry.synonymGroup];
      assert.equal(group.review.status, 'source-checked', word);
      assert.equal(group.comparisonType, 'usage', word);
      assert.deepEqual(group.words, [word]);
      assert(group.sourceIds.length > 0);
      for (const id of group.sourceIds) {
        assert(sources[id], `${word}: local source`);
        assert.equal(sources[id].checkedAt, group.review.checkedAt);
      }
      const hint = getCoreWordHints({ word })[0];
      assert.equal(hint.label, '用法提示', word);
      if (group.correction) {
        assert(group.correction.canonical && group.correction.canonical !== word);
        assert(group.note.includes(group.correction.canonical), `${word}: explain canonical form`);
        assert.deepEqual(hint.exampleWords, [group.correction.canonical]);
      }
      for (const example of group.examples) {
        const key = normalize(example.en);
        assert(!examples.has(key) && !previousExamples.has(key) && !vocabularyExamples.has(key), `${word}: repeated example`);
        assert(getHintExampleParts(example, hint.exampleWords).some(part => part.highlighted), `${word}: complete target`);
        assert.doesNotMatch(example.en, /Students often meet the word|example sentence for|placeholder/i, word);
        examples.add(key);
      }
    }
    for (const [id, group] of Object.entries(groups)) {
      assert(!groupsSeen.has(id)); groupsSeen.add(id);
      assert.deepEqual(CORE_SYNONYM_GROUPS[id], group);
    }
    for (const [id, source] of Object.entries(sources)) {
      assert(!sourcesSeen.has(id)); sourcesSeen.add(id);
      assert.deepEqual(WORD_NOTE_SOURCES[id], source);
    }
  }
  assert.deepEqual(seen, expected);
  assert.equal(seen.size, 2699);
  assert.equal(examples.size, 5398);
});

test('hong and kong retain independently sourced senses instead of unsupported place-name corrections', () => {
  const hong = getCoreWordHints({ word: 'hong' })[0];
  const kong = getCoreWordHints({ word: 'kong' })[0];
  assert.deepEqual(hong.exampleWords, ['hong']);
  assert.deepEqual(kong.exampleWords, ['kong']);
  assert.match(hong.scope, /商行/);
  assert.match(kong.scope, /采锡.*基岩/);
  assert.match(kong.text, /地区|地域/);
  assert(hong.sources.some(source => source.url === 'https://www.merriam-webster.com/dictionary/hong'));
  assert(kong.sources.some(source => source.url.includes('10.1080/21622671.2024.2334821')));
  for (const word of ['hong', 'kong']) {
    const group = CORE_SYNONYM_GROUPS[CORE_WORD_NOTES[word].synonymGroup];
    assert.equal(group.correction, undefined);
    for (const example of group.examples) assert.doesNotMatch(example.en, /Hong Kong/);
  }
});

test('all active and retired vocabulary retains its own notes without rewriting records', async () => {
  const vocabulary = JSON.parse(await readFile(new URL('../public/data/vocabulary.json', import.meta.url), 'utf8'));
  const { RETIRED_VOCABULARY } = await import('../shared/retiredVocabulary.js');
  const bySpelling = new Map([...vocabulary, ...RETIRED_VOCABULARY].map(entry => [vocabularyNoteKey(entry), entry]));
  assert.equal(Object.keys(CORE_WORD_NOTES).length, 8946);
  assert.deepEqual(new Set(Object.keys(CORE_WORD_NOTES)), new Set(bySpelling.keys()));
  assert.equal(Object.values(CORE_WORD_NOTES).filter(entry => entry.formation).length, 47);
  for (const [word, entry] of Object.entries(CORE_WORD_NOTES)) {
    const stored = bySpelling.get(word);
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

test('three additional 1000-word batches add unique, sourced usage notes and original examples', async () => {
  const vocabulary = JSON.parse(await readFile(new URL('../public/data/vocabulary.json', import.meta.url), 'utf8'));
  const vocabularyExamples = new Set(vocabulary.map(entry => entry.example?.trim().toLowerCase()).filter(Boolean));
  // Explicitly reviewed dictionary lookups; do not infer roots or strip endings.
  const referenceHeadwords = {
    according: ['according-to'], works: ['work'], developing: ['develop'],
    greater: ['great'], closest: ['close'], forwards: ['forward'],
    'make-up': ['makeup'], consist: ['consist-of'], passageway: ['passage'], cobble: ['cobble-together'],
  };
  const dictionaryLabels = {
    'dictionary.cambridge.org': '剑桥', 'www.oxfordlearnersdictionaries.com': '牛津',
    'www.merriam-webster.com': '韦氏', 'www.collinsdictionary.com': '柯林斯',
  };
  const seenWords = new Set();
  const seenGroups = new Set();
  const seenSources = new Set();
  const seenExamples = new Set();
  const previousWords = new Set(Object.entries(CORE_WORD_NOTES).filter(([, entry]) => !/^(e[4-9]-|practical-)/.test(entry.synonymGroup)).map(([word]) => word));
  assert.equal(previousWords.size, 3000, 'previous notes remain intact');
  const previousExamples = new Set(Object.values(CORE_SYNONYM_GROUPS).filter(group => group.words.some(word => previousWords.has(word))).flatMap(group => group.examples.map(example => example.en.trim().toLowerCase())));
  for (const [batch, prefix] of [[expansionFour, 'FOUR'], [expansionFive, 'FIVE'], [expansionSix, 'SIX']]) {
    const notes = batch[`EXPANSION_${prefix}_WORD_NOTES`];
    const groups = batch[`EXPANSION_${prefix}_SYNONYM_GROUPS`];
    const sources = batch[`EXPANSION_${prefix}_NOTE_SOURCES`];
    assert.equal(Object.keys(notes).length, 1000, prefix);
    for (const [word, entry] of Object.entries(notes)) {
      assert(!seenWords.has(word) && !previousWords.has(word), `overlapping word: ${word}`);
      seenWords.add(word);
      assert.deepEqual(CORE_WORD_NOTES[word], entry, word);
      assert(!Object.hasOwn(entry, 'formation'), `unsupported formation: ${word}`);
      const group = groups[entry.synonymGroup];
      assert(group, word);
      assert.equal(group.comparisonType, 'usage', word);
      assert.deepEqual(group.words, [word]);
      assert.equal(group.review.status, 'source-checked', word);
      for (const sourceId of group.sourceIds) {
        const source = sources[sourceId];
        assert(source, `${word}: direct source`);
        assert.equal(source.checkedAt, group.review.checkedAt, word);
        const dictionaryLabel = dictionaryLabels[new URL(source.url).hostname];
        if (dictionaryLabel) assert(source.title.includes(dictionaryLabel), `${word}: dictionary title matches URL`);
        const checkedHeadwords = [word, ...(referenceHeadwords[word] || [])];
        assert(checkedHeadwords.some(headword => new RegExp(`[/#]${headword}(?:_\\d+)?(?:$|[/#?])`).test(decodeURIComponent(source.url).toLowerCase())), `${word}: headword reference`);
      }
      const hint = getCoreWordHints({ word })[0];
      assert.equal(hint.label, '用法提示');
      assert.equal(hint.text, group.note);
      for (const example of group.examples) {
        const normalized = example.en.trim().toLowerCase();
        assert.match(example.en, new RegExp(`\\b${word}\\b`, 'i'), `${word}: complete headword`);
        assert(!seenExamples.has(normalized) && !previousExamples.has(normalized), `${word}: duplicate example`);
        assert(!vocabularyExamples.has(normalized), `${word}: copied vocabulary example`);
        assert.doesNotMatch(example.en, /Students often meet the word|example sentence for|placeholder/i, word);
        seenExamples.add(normalized);
      }
    }
    for (const id of Object.keys(groups)) {
      assert(!seenGroups.has(id), `group collision: ${id}`);
      seenGroups.add(id);
      assert.deepEqual(CORE_SYNONYM_GROUPS[id], groups[id]);
    }
    for (const id of Object.keys(sources)) {
      assert(!seenSources.has(id), `source collision: ${id}`);
      seenSources.add(id);
      assert.deepEqual(WORD_NOTE_SOURCES[id], sources[id]);
    }
  }
  assert.equal(seenWords.size, 3000);
  assert.equal(seenExamples.size, 6000);
});
