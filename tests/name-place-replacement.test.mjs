import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { RETIRED_VOCABULARY, isRetiredVocabularyId, activeProgressIds } from '../shared/retiredVocabulary.js';
import { beforeNamePlaceReplacement, beforeSenseReview } from '../shared/vocabularyHistory.js';
import { getCoreWordHints, getHintExampleParts } from '../src/utils/wordHints.js';
import { CORE_SYNONYM_GROUPS } from '../src/data/coreWordNotes.js';
import { correctedVocabularyAudioUrl } from '../shared/vocabularyAudio.js';
import { selectAssignmentWords, buildWordAssignment, gradeWordAssignment } from '../shared/wordAssignments.js';
import { practiceVocabulary } from '../shared/vocabularyPracticePolicy.js';
import { createClassroomFixture } from './helpers/classroom-db.mjs';
const read = async path => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'));
const vocabulary = await read('public/data/vocabulary.json');
const additions = await read('data/name-place-replacement/practical-2026-10-26.json');
const retired = await read('data/name-place-replacement/retired-2026-10-26.json');
const manifest = await read('data/name-place-replacement/replacement-manifest.json');
const review = await read('data/sense-review/reviews-2026-10-26.json');
const byId = new Map(vocabulary.map(word => [word.id, word]));
const hash = value => createHash('sha256').update(value).digest('hex');

test('80 named/context-conflicted records are replaced with fresh IDs, preserving the exact earlier vocabulary and all unrelated records', () => {
  assert.equal(retired.length, 80);
  assert.equal(additions.length, 80);
  assert.equal(vocabulary.length, 8699);
  assert.equal(new Set(vocabulary.map(word => word.id)).size, 8699);
  assert.equal(RETIRED_VOCABULARY.length, 327);
  assert.equal(hash(JSON.stringify(beforeNamePlaceReplacement(vocabulary), null, 2) + '\n'), manifest.baselineSha256);
  assert.equal(hash(JSON.stringify(beforeSenseReview(vocabulary), null, 2) + '\n'), review.baselineSha256);
  for (const [i, word] of additions.entries()) {
    assert.equal(word.id, 8947 + i);
    assert.deepEqual(byId.get(word.id), word);
    assert.deepEqual(word.categories, ['daily']);
    assert.equal(word.category, 'daily');
    assert(!byId.has(retired[i].id));
    assert.deepEqual(RETIRED_VOCABULARY.find(item => item.id === retired[i].id), retired[i]);
    assert.equal(beforeNamePlaceReplacement([word])[0].id, retired[i].id);
  }
  assert.deepEqual(activeProgressIds([retired[0].id, String(retired[1].id), additions[0].id, 'custom-1']), [additions[0].id, 'custom-1']);
  for (const word of ['mark', 'frank', 'bill', 'will', 'hope', 'grace', 'rose', 'jack', 'Greek', 'Celsius', 'may']) {
    assert(vocabulary.some(item => item.word === word), `${word}: keep useful ordinary-word senses`);
  }
  assert(!vocabulary.some(word => /人名|男子名|女子名|姓氏）|姓氏\)/u.test(word.meaning)));
  const historicalAudit = new Set(retired.map(word => word.word.toLowerCase()));
  assert(vocabulary.every(word => !historicalAudit.has(word.word.toLowerCase())));
});

test('80 new notes have source facts, explicit IPA methods, complete phrase emphasis and 160 original bilingual examples', async () => {
  const sources = await read('data/name-place-replacement/sources-2026-10-26.json');
  const phonetics = await read('data/name-place-replacement/phonetics-2026-10-26.json');
  const normalize = text => text.trim().toLowerCase().replaceAll('’', "'");
  const previous = new Set([
    ...beforeNamePlaceReplacement(vocabulary).map(word => word.example), ...RETIRED_VOCABULARY.map(word => word.example),
    ...Object.entries(CORE_SYNONYM_GROUPS).filter(([id]) => !id.startsWith('practical-2026-10-26-')).flatMap(([, group]) => group.examples.map(example => example.en)),
  ].map(normalize));
  const seen = new Set();
  for (const word of additions) {
    const source = sources.find(item => item.word === word.word);
    assert.equal(source.status, 'source-checked');
    assert(source.fact && source.url.startsWith('https://') && source.hashOf);
    assert.match(source.sha256, /^[a-f0-9]{64}$/);
    assert.equal(phonetics[word.word].ipa, word.phonetic);
    assert(phonetics[word.word].method && phonetics[word.word].note);
    const [hint] = getCoreWordHints(word);
    assert.equal(hint.examples.length, 2);
    assert.equal(hint.sources[0].url, source.url);
    for (const example of hint.examples) {
      assert.match(example.zh, /[\u4e00-\u9fff]/);
      const key = normalize(example.en);
      assert(!seen.has(key) && !previous.has(key), `${word.word}: duplicate ${example.en}`);
      seen.add(key);
      assert(getHintExampleParts(example, hint.exampleWords).some(part => part.highlighted), word.word);
    }
  }
  assert.equal(seen.size, 160);
});

test('all remaining 19 active sense reviews align notes and content without changing their ID, category, or headword', async () => {
  const queue = await read('docs/vocabulary-quality-followup.json');
  assert.equal(review.reviews.length, 19);
  assert.deepEqual(queue.summary.inclusionCandidates, { resolved_source_review: 19, retired_reference_only: 19 });
  for (const record of review.reviews) {
    assert.equal(record.status, 'resolved_source_review');
    assert.deepEqual(byId.get(record.id), record.after);
    for (const key of ['id', 'word', 'categories', 'category', 'level', 'list', 'ieltsList', 'ieltsLists']) assert.deepEqual(record.before[key], record.after[key]);
    const [hint] = getCoreWordHints(record.after);
    assert.equal(hint.scope, record.finding);
    assert(hint.sources.every(source => source.checkedAt === '2026-10-26'));
    for (const example of hint.examples) assert(getHintExampleParts(example, hint.exampleWords).some(part => part.highlighted));
  }
  assert.match(byId.get(8123).example, /lame excuse/);
  assert.doesNotMatch(byId.get(8123).example, /dress/);
  assert.match(byId.get(5956).meaning, /月份 August 另读/);
  assert.match(byId.get(6358).meaning, /Sept\..*September/);
});

test('multiword inflections are explicit, source-checked and confined to their annotated phrase example', () => {
  const word = additions.find(item => item.word === 'be supposed to');
  const hint = getCoreWordHints(word)[0];
  const example = hint.examples[0];
  assert.deepEqual(getHintExampleParts(example, hint.exampleWords).filter(part => part.highlighted).map(part => part.text), ['are supposed to']);
  assert.equal(getHintExampleParts({ en: example.en }, hint.exampleWords).filter(part => part.highlighted).length, 0);
  for (const form of [
    { ...example.forms[0], review: { status: 'draft', checkedAt: '2026-10-26' } },
    { ...example.forms[0], sourceIds: [] },
    { ...example.forms[0], word: 'buy' },
    { ...example.forms[0], form: 'were supposed to' },
  ]) assert.equal(getHintExampleParts({ ...example, forms: [form] }, hint.exampleWords).filter(part => part.highlighted).length, 0);
  assert.equal(getHintExampleParts({ ...example, en: 'They care supposed to-us.' }, hint.exampleWords).filter(part => part.highlighted).length, 0);
});

test('676 new recordings use exact field text, immutable revisions, four voices, and preserve older snapshot URLs', async () => {
  let count = 0;
  for (const batch of ['2026-10-26-name-place', '2026-10-26-sense']) {
    const audio = await read(`public/audio-updates/${batch}/manifest.json`);
    assert.equal(audio.ready, true);
    assert.equal(audio.files.length, audio.expectedFiles);
    assert.equal(audio.voices.length, 4);
    const paths = new Set();
    for (const file of audio.files) {
      const word = byId.get(file.id);
      assert.equal(file.text, word[file.field]);
      assert.equal(file.textSha256, hash(file.text));
      assert.equal(new URL(correctedVocabularyAudioUrl(word, file.field, file.voice)).pathname, file.path);
      assert(!paths.has(file.path)); paths.add(file.path);
      let bytes;
      try { bytes = await readFile(new URL(`../public${file.path}`, import.meta.url)); }
      catch (error) { if (error.code !== 'ENOENT') throw error; }
      if (bytes) { assert.equal(bytes.length, file.bytes); assert.equal(hash(bytes), file.sha256); }
      assert(file.seconds > 0.1 && file.seconds < 40);
    }
    count += audio.files.length;
  }
  assert.equal(count, 676);
  for (const record of review.reviews.filter(item => item.changedFields.includes('example'))) {
    assert(!correctedVocabularyAudioUrl(record.before, 'example', 'bf_emma')?.includes('2026-10-26-sense'));
  }
  const audio = await read('public/audio-updates/2026-10-26-sense/manifest.json');
  assert.equal(audio.files.find(file => file.id === 6358 && file.field === 'word').synthesis, 'September');
  assert.match(audio.files.find(file => file.id === 5956 && file.field === 'word').phonemes, /ɡˈʌst/);
});

test('new exercises exclude context-only language while old assignments, answers and offline history keep grading and account isolation', async () => {
  const catalog = await read('worker/data/assignment-vocabulary.json');
  const oldWords = retired.slice(0, 5);
  assert(oldWords.every(word => isRetiredVocabularyId(word.id)));
  assert.throws(() => selectAssignmentWords(catalog, { category: 'all', wordIds: oldWords.map(word => word.id) }));
  const oldSnapshot = buildWordAssignment(oldWords);
  const answers = Object.fromEntries(oldSnapshot.map(word => [word.id, word.answer]));
  assert.equal(gradeWordAssignment(JSON.parse(JSON.stringify(oldSnapshot)), answers).questionsCorrect, 5);
  const context = byId.get(8164), regular = vocabulary.slice(0, 4);
  assert(!practiceVocabulary([context, ...regular]).includes(context));
  assert.deepEqual(practiceVocabulary([{ id: 'custom-1', word: 'negro' }]), [{ id: 'custom-1', word: 'negro' }]);
  assert.throws(() => selectAssignmentWords(catalog, { category: 'all', wordIds: [context, ...regular].map(word => word.id) }), /历史语境/);
  const position = catalog.findIndex(word => word.id === context.id);
  assert.throws(() => selectAssignmentWords(catalog, { category: 'all', start: position + 1, count: 5 }), /历史语境/);
  // Grade an already published snapshot directly; no new-exercise policy is applied.
  assert.equal(gradeWordAssignment([{ id: '8164', options: [{ id: 'A', label: context.meaning }], answer: 'A' }], { 8164: 'A' }).questionsCorrect, 1);
  const fixture = await createClassroomFixture();
  await fixture.addUser(1, 'student');
  await fixture.addUser(2, 'student');
  const body = { id: 'name-retired-offline', mode: 'spelling', category: 'all', scope: 'all',
    startedAt: '2026-10-25T03:00:00.000Z', completedAt: '2026-10-25T03:01:00.000Z',
    answers: [{ wordId: String(retired[0].id), input: retired[0].word }] };
  const saved = await fixture.api(1, '/exam-attempts', 'POST', body);
  assert.equal(saved.status, 201);
  assert.equal(saved.body.attempt.questionsCorrect, 1);
  const other = await fixture.api(2, '/exam-attempts');
  assert.equal(other.body.attempts.length, 0);
  fixture.sqlite.close();
});
