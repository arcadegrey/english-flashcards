import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { beforeMultiSenseReview, beforeNeutralExampleReview } from '../shared/vocabularyHistory.js';
import { correctedVocabularyAudioUrl } from '../shared/vocabularyAudio.js';
import { createVocabularyDelivery } from '../src/data/vocabularyDelivery.js';
import { summarizeVocabularyWord, applyWordDetails } from '../src/data/vocabularySummary.js';
import { getCoreWordHints } from '../src/utils/wordHints.js';
import { buildHiddenSentence } from '../src/utils/assessmentRounds.js';
import { buildWordAssignment, gradeWordAssignment } from '../shared/wordAssignments.js';
const read = async path => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'));
const hash = value => createHash('sha256').update(value).digest('hex');
const serialize = value => JSON.stringify(value, null, 2) + '\n';
const currentWords = await read('public/data/vocabulary.json'), currentById = new Map(currentWords.map(word => [word.id, word]));
const words = beforeNeutralExampleReview(currentWords), byId = new Map(words.map(word => [word.id, word]));
const register = await read('data/vocabulary-multi-sense-repair/reviews-2026-10-31.json');
const original = await read('data/vocabulary-multi-sense-repair/source-register-2026-10-31.json');
const ids = new Set([...original.entries, ...original.gaps].map(entry => entry.id));

test('only the 133 audited IDs change; every original ID, category and unrelated record remains intact', () => {
  assert.equal(ids.size, 133); assert.equal(register.reviews.length, 133); assert.equal(words.length, 8749);
  assert.equal(new Set(words.map(word => word.id)).size, words.length);
  assert.equal(hash(serialize(words)), register.afterSha256);
  assert.equal(hash(serialize(beforeMultiSenseReview(words))), original.inputSha256);
  assert.deepEqual(new Set(register.reviews.map(review => review.id)), ids);
  for (const review of register.reviews) {
    assert.deepEqual(byId.get(review.id), review.after);
    for (const field of new Set([...Object.keys(review.before), ...Object.keys(review.after)])) {
      if (!['pos','meaning','phonetic','example','exampleCn','examples'].includes(field)) assert.deepEqual(review.after[field], review.before[field], `${review.word}: ${field}`);
    }
    assert(review.changedFields.every(field => ['pos','meaning','phonetic','example','exampleCn','examples'].includes(field)));
  }
});

test('424 short bilingual examples have explicit sense labels and preserve the default exercise sentence', () => {
  assert.equal(register.counts.examples, 424);
  for (const { after } of register.reviews) {
    assert(after.examples.length >= 2 && after.examples.length <= 6, after.word);
    assert.equal(after.example, after.examples[0].en); assert.equal(after.exampleCn, after.examples[0].zh);
    assert.equal(new Set(after.examples.map(example => example.en)).size, after.examples.length);
    assert(buildHiddenSentence(after.example, after.word), `${after.word}: default is not usable in fill-blank practice`);
    for (const example of after.examples) {
      const tag = example.sense.match(/^(modal v|n|v|adj|adv|prep|pron|num|interj)\./)?.[0];
      assert(tag, `${after.word}: unlabelled sense`); assert(after.pos.includes(tag), `${after.word}: missing ${tag}`);
      assert.match(example.en, /[.!?]$/); assert.match(example.zh, /[。！？]$/);
      assert(example.en.split(/\s+/).length <= 12, `${after.word}: unnecessary sentence length`);
      assert.doesNotMatch(example.en, /\//, `${after.word}: multiple alternatives in one sentence`);
    }
  }
});

test('gap candidates, misleading tags and heteronym distinctions have source-backed corrections', () => {
  for (const gap of original.gaps) assert(byId.get(gap.id).examples.length >= 2, gap.word);
  for (const [id, match] of [[3936,/瞳孔/],[4174,/太阳穴/],[4407,/粉丝/],[4431,/pron\..*我的/],[4419,/铅.*led/],[472,/亲密/]]) assert.match(byId.get(id).meaning, match);
  assert.match(byId.get(5757).meaning, /过去分词通常是 bitten/);
  assert.doesNotMatch(byId.get(5809).meaning, /宣$/);
  assert.match(byId.get(5569).meaning, /v\..*日落/);
  for (const review of register.reviews) {
    assert(review.note); assert(review.sourceIds.length);
    for (const id of review.sourceIds) { const source = register.sources.find(source => source.id === id); assert(source?.url.startsWith('https://dictionary.cambridge.org/')); assert(source.pageSha256 && source.definitionCount > 0); }
  }
});

test('cold summaries and details reconstruct all current multi-sense records without eagerly loading examples', async () => {
  const index = await read('src/data/vocabularyIndex.json'), requests = [];
  const delivery = createVocabularyDelivery({ index, fetchJson: async path => { requests.push(path); return read(`public${path}`); } });
  const summaries = await delivery.loadCatalogIds([...ids]); assert.equal(summaries.length, 133);
  assert(summaries.every(word => !Object.hasOwn(word, 'examples')));
  assert(requests.every(path => path.includes('/catalog/')));
  for (const summary of summaries) assert.deepEqual(applyWordDetails(summary, await delivery.loadDetails(summary)), currentById.get(summary.id));
  const custom = { ...register.reviews[0].before, example: 'My own saved example.', exampleCn: '我自己保存的例句。' };
  assert.strictEqual(await delivery.loadDetails(custom), custom);
});

test('new notes apply only to the reviewed snapshot, while historical assignment meanings and answers stay frozen', () => {
  const old = buildWordAssignment(register.reviews.map(review => review.before));
  const saved = serialize(old), answers = Object.fromEntries(old.map(word => [word.id, word.answer]));
  const grade = gradeWordAssignment(old, answers);
  buildWordAssignment(register.reviews.map(review => review.after));
  assert.equal(serialize(old), saved); assert.deepEqual(gradeWordAssignment(JSON.parse(saved), answers), grade);
  for (const review of register.reviews) {
    const hint = getCoreWordHints(review.after).find(hint => hint.label === '多义用法');
    assert.equal(hint?.text, review.note); assert(hint.sources.every(source => source.url));
    assert(!getCoreWordHints(review.before).some(hint => hint.label === '多义用法'));
    assert(!getCoreWordHints({ ...review.after, example: 'Different snapshot text.' }).some(hint => hint.label === '多义用法'));
  }
});

test('the 1736-file voice matrix selects every exact sentence and protects historical word pronunciations', async () => {
  const manifest = await read('public/audio-updates/2026-10-31-multi-sense/manifest.json');
  assert(manifest.ready); assert.equal(manifest.expectedFiles, 1736); assert.equal(manifest.files.length, 1736);
  assert.equal(new Set(manifest.files.map(file => file.path)).size, manifest.files.length);
  for (const review of register.reviews) for (const voice of manifest.voices) {
    for (const example of review.after.examples) {
      const file = manifest.files.find(file => file.id === review.id && file.field === 'example' && file.voice === voice && file.text === example.en);
      assert(file, `${review.word}: ${example.en}`); assert.equal(file.textSha256, hash(example.en));
      assert.equal(new URL(correctedVocabularyAudioUrl({ ...review.after, example: example.en }, 'example', voice)).pathname, file.path);
    }
    if (review.audioFields.includes('word')) {
      const file = manifest.files.find(file => file.id === review.id && file.field === 'word' && file.voice === voice); assert(file);
      assert(file.targetPhonemes && file.phonemes.includes(file.targetPhonemes));
      assert.equal(new URL(correctedVocabularyAudioUrl(review.after, 'word', voice)).pathname, file.path);
      assert(!correctedVocabularyAudioUrl(review.before, 'word', voice)?.includes(register.batch));
    } else assert.equal(correctedVocabularyAudioUrl(review.after, 'word', voice), correctedVocabularyAudioUrl(review.before, 'word', voice));
  }
  for (const file of manifest.files.filter(file => file.targetPhonemes)) assert(file.phonemes.includes(file.targetPhonemes), file.path);
});
