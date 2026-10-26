import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { getCoreWordHints } from '../src/utils/wordHints.js';
import { CORE_SYNONYM_GROUPS } from '../src/data/coreWordNotes.js';
import { correctedVocabularyAudioUrl } from '../shared/vocabularyAudio.js';
import { buildWordAssignment, gradeWordAssignment } from '../shared/wordAssignments.js';
import { beforeNamePlaceReplacement } from '../shared/vocabularyHistory.js';
const read = async path => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'));
const vocabulary = beforeNamePlaceReplacement(await read('public/data/vocabulary.json'));
const register = await read('data/vocabulary-followup/reviews-2026-10-25.json');
const historicalAudit = await read('docs/base-vocabulary-audit.json');
const checks = await read('data/vocabulary-followup/source-checks-2026-10-25.json');
const manifest = await read('public/audio-updates/2026-10-25-followup/manifest.json');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const byId = new Map(vocabulary.map(word => [word.id, word]));

test('the exact 73 open candidates are reviewed, with 72 missing IPA fields filled and no unrelated record changes', () => {
  const expected = historicalAudit.candidates.filter(item => byId.has(item.id) && item.id !== 3849).map(item => item.id);
  assert.equal(expected.length, 73);
  assert.deepEqual(new Set(register.targetIds), new Set(expected));
  assert.equal(register.reviews.length, 73);
  assert.equal(register.reviews.filter(item => !item.before.phonetic).length, 72);
  assert(vocabulary.every(word => word.phonetic));
  const originals = new Map(register.reviews.map(review => [review.id, review.before]));
  for (const review of register.reviews) {
    assert.equal(review.status, 'resolved');
    assert.deepEqual(byId.get(review.id), review.after);
    for (const key of ['id', 'word', 'category', 'categories', 'level', 'list', 'ieltsList', 'ieltsLists']) assert.deepEqual(review.after[key], review.before[key], `${review.id}: ${key}`);
    assert.match(review.after.phonetic, /^\/.+\/$/u);
    assert(review.sources.length);
    assert(review.sources.every(source => checks.sources.some(check => check.url === source.url && check.checkedAt === review.checkedAt)));
    if (['dictionary-ipa', 'dictionary-inflection', 'dictionary-spelling-variant'].includes(review.phoneticMethod)) {
      assert(review.sources.some(source => checks.sources.find(check => check.url === source.url)?.dictionaryIpa.includes(review.after.phonetic.slice(1, -1))), `${review.id}: dictionary IPA must be visible in the checked extract`);
    }
  }
  const restored = JSON.stringify(vocabulary.map(word => originals.get(word.id) || word), null, 2) + '\n';
  assert.equal(hash(restored), register.baselineSha256);
});

test('source-reviewed parts of speech and hints teach their actual example sense', () => {
  const word = id => byId.get(id);
  assert.match(word(6682).meaning, /朝鲜半岛/);
  assert.match(word(6682).example, /map of Korea/);
  assert.doesNotMatch(word(8267).example, /a brilliant academic\.$/);
  assert.match(word(6127).meaning, /Digital Equipment Corporation/);
  assert.match(getCoreWordHints(word(6127))[0].scope, /公司/);
  assert.match(getCoreWordHints(word(6413))[0].scope, /人名/);
  assert.match(getCoreWordHints(word(5674))[0].scope, /介词/);
  assert.match(getCoreWordHints(word(5963))[0].scope, /关系/);
  for (const id of [5896, 6736]) assert.match(getCoreWordHints(word(id))[0].scope, /形容词.*副词/);
  for (const id of [6287, 6330, 6396, 6397]) assert.match(word(id).meaning, /朗读时读全称/);
});

test('the 23 rewritten examples and 22 replacement hint examples are original and free of exact duplicates', async () => {
  const hints = await read('src/data/followupWordNotes.json');
  const changed = register.reviews.filter(review => review.changedFields.includes('example'));
  assert.equal(changed.length, 23);
  const normalize = text => text.toLowerCase().replaceAll('’', "'").trim();
  const originals = new Map(register.reviews.map(review => [review.id, review.before]));
  const old = new Set([
    ...vocabulary.map(word => (originals.get(word.id) || word).example),
    ...Object.values(CORE_SYNONYM_GROUPS).flatMap(group => group.examples.map(example => example.en)),
    ...[5873, 5941, 5947, 6258].flatMap(id => getCoreWordHints(byId.get(id)).flatMap(hint => hint.examples?.map(example => example.en) || [])),
  ].filter(Boolean).map(normalize));
  const unique = new Set();
  for (const text of [...changed.map(review => review.after.example), ...Object.values(hints).flatMap(entry => entry.hint.examples.map(example => example.en))]) {
    const key = normalize(text);
    assert(!old.has(key) && !unique.has(key), text); unique.add(key);
  }
  assert.equal(unique.size, 45);
});

test('400 new recordings have matching text, metadata and available local hashes; historical example snapshots keep old audio', async () => {
  assert.equal(manifest.ready, true);
  assert.equal(manifest.files.length, 400);
  assert.equal(new Set(manifest.files.map(file => file.path)).size, 400);
  for (const review of register.reviews) for (const voice of manifest.voices) {
    const url = correctedVocabularyAudioUrl(review.after, 'word', voice);
    assert.match(url, /audio-updates\/2026-10-25-followup\/word\//);
    if (review.changedFields.includes('example')) {
      assert.match(correctedVocabularyAudioUrl(review.after, 'example', voice), /2026-10-25-followup/);
      const oldUrl = correctedVocabularyAudioUrl(review.before, 'example', voice);
      assert(!oldUrl || !oldUrl.includes('2026-10-25-followup'));
    }
  }
  for (const file of manifest.files) {
    assert.equal(byId.get(file.id)[file.field], file.text);
    assert.equal(hash(file.text), file.textSha256);
    assert.equal(new URL(correctedVocabularyAudioUrl(byId.get(file.id), file.field, file.voice)).pathname, file.path);
    assert(file.seconds > 0.1 && file.seconds < 40);
    let bytes;
    try { bytes = await readFile(new URL(`../public${file.path}`, import.meta.url)); }
    catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    assert.equal(bytes.length, file.bytes); assert.equal(hash(bytes), file.sha256);
  }
  const british = manifest.files.filter(file => file.voice === 'bf_emma' && file.field === 'word');
  assert.match(british.find(file => file.id === 4340).phonemes, /aʊ/);
  assert.equal(british.find(file => file.id === 6287).synthesis, 'October');
  assert.equal(british.find(file => file.id === 6127).synthesis, '[DEC](/dˈɛk/)');
});

test('previously published assignments keep their snapshots and IDs after source review', () => {
  const oldWords = register.reviews.slice(0, 5).map(review => review.before);
  const snapshot = buildWordAssignment(oldWords);
  const answers = Object.fromEntries(snapshot.map(word => [word.id, word.answer]));
  const grade = gradeWordAssignment(snapshot, answers);
  assert.equal(grade.questionsCorrect, 5);
  assert.deepEqual(gradeWordAssignment(JSON.parse(JSON.stringify(snapshot)), answers), grade);
  assert.equal(snapshot[0].word, oldWords[0].word);
});

test('the base queue stays closed and the 38-item sense/register queue accounts for later retirements', async () => {
  const queue = await read('docs/vocabulary-quality-followup.json');
  assert.equal(queue.base.filter(item => item.status === 'needs_source_review').length, 0);
  assert.equal(queue.base.length, 111);
  assert.equal(queue.base.filter(item => ['resolved_source_review', 'retired_reference_only', 'resolved_source_review'].includes(item.status)).length, 110);
  assert.equal(queue.sense.length, 38);
  assert(queue.sense.every(item => ['needs_source_review', 'partially_corrected_followup_required', 'retired_reference_only', 'resolved_source_review'].includes(item.status)));
});
