import {beforeExpansion50Review} from '../shared/vocabularyHistory.js';
import { beforeQualityReview } from './helpers/vocabulary-history.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { ORIGINAL_RETIRED_VOCABULARY as RETIRED_VOCABULARY, activeProgressIds, isRetiredVocabularyId } from '../shared/retiredVocabulary.js';
import { getCoreWordHints } from '../src/utils/wordHints.js';
import { selectAssignmentWords, buildWordAssignment, gradeWordAssignment } from '../shared/wordAssignments.js';
import { createClassroomFixture } from './helpers/classroom-db.mjs';
import { correctedVocabularyAudioUrl } from '../shared/vocabularyAudio.js';
import catalog from '../worker/data/assignment-vocabulary.json' with { type: 'json' };

const json = async path => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'));
const vocabulary = beforeExpansion50Review(await json('public/data/vocabulary.json'));
const additions = await json('data/vocabulary-replacement/practical-2026-10-25.json');
const audit = await json('docs/vocabulary-inclusion-audit.json');
const hash = value => createHash('sha256').update(value).digest('hex');

test('exactly the 247 authorized IDs leave active courses; every other original record and retired text is preserved', () => {
  const authorized = audit.records.filter(word => ['exclude_default', 'topic_only'].includes(word.decision)).map(word => word.id);
  assert.deepEqual(RETIRED_VOCABULARY.map(word => word.id), authorized.sort((a, b) => a - b));
  assert.equal(vocabulary.length, 8699);
  assert.equal(additions.length, 247);
  assert.equal(new Set(vocabulary.map(word => word.id)).size, 8699);
  assert(vocabulary.every(word => !isRetiredVocabularyId(word.id)));
  const old = [...beforeQualityReview(vocabulary).filter(word => word.id <= 8699), ...RETIRED_VOCABULARY].sort((a, b) => a.id - b.id);
  assert.equal(hash(JSON.stringify(old, null, 2) + '\n'), audit.inputSha256);
  const previousSpellings = new Set(old.map(word => word.word.toLowerCase()));
  for (const [index, word] of additions.entries()) {
    assert.equal(word.id, 8700 + index);
    assert(!previousSpellings.has(word.word.toLowerCase()), word.word);
    assert.deepEqual(vocabulary.find(entry => entry.id === word.id), word);
    assert.deepEqual(word.categories, ['daily']);
  }
  assert.deepEqual(activeProgressIds([RETIRED_VOCABULARY[0].id, String(RETIRED_VOCABULARY[1].id), 8700, 'custom-1']), [8700, 'custom-1']);
});

test('new words have scoped notes and four-voice versioned paths; unrelated and historical audio keeps its identity', () => {
  for (const word of additions) {
    assert(word.phonetic && word.meaning && word.example && word.exampleCn);
    const [hint] = getCoreWordHints(word);
    assert(hint.scope && hint.text.length > 20);
    assert.equal(hint.examples.length, 2);
    assert(hint.sources.some(source => source.url.startsWith('https://www.oxfordlearnersdictionaries.com/')));
    for (const voice of ['af_bella', 'am_michael', 'bf_emma', 'bm_george']) {
      for (const field of ['word', 'example']) {
        const url = correctedVocabularyAudioUrl(word, field, voice);
        assert.equal(new URL(url).origin, 'https://pub-47e027cd6ce64af29a76f038ecb22373.r2.dev');
        assert(new URL(url).pathname.startsWith(`/audio-updates/2026-10-25/${field}/${voice}/${word.id}-`));
        assert.equal(correctedVocabularyAudioUrl({ ...word, [field]: 'different historical text' }, field, voice), null);
      }
    }
  }
  assert.equal(correctedVocabularyAudioUrl(RETIRED_VOCABULARY.find(word => word.word === 'sam'), 'word', 'af_bella'), null);
});

test('all 494 replacement examples are distinct from each other and previous vocabulary/notes', async () => {
  const { CORE_SYNONYM_GROUPS } = await import('../src/data/coreWordNotes.js');
  const normalize = value => value.trim().toLowerCase().replaceAll('’', "'");
  const previous = new Set([
    ...vocabulary.filter(word => word.id <= 8699).map(word => word.example),
    ...RETIRED_VOCABULARY.map(word => word.example),
    ...Object.entries(CORE_SYNONYM_GROUPS).filter(([id]) => !/^practical-\d+$/.test(id)).flatMap(([, group]) => group.examples.map(example => example.en)),
  ].filter(Boolean).map(normalize));
  const seen = new Set();
  for (const [id, group] of Object.entries(CORE_SYNONYM_GROUPS).filter(([id]) => /^practical-\d+$/.test(id))) {
    for (const example of group.examples) {
      const key = normalize(example.en);
      assert(!seen.has(key) && !previous.has(key), `${id}: ${example.en}`);
      seen.add(key);
    }
  }
  assert.equal(seen.size, 494);
});

test('new assignments reject retired IDs while already published snapshots still grade unchanged', () => {
  assert(catalog.every(word => !isRetiredVocabularyId(word.id)));
  const old = RETIRED_VOCABULARY.slice(0, 5);
  assert.throws(() => selectAssignmentWords(catalog, { category: 'all', wordIds: old.map(word => word.id) }));
  const snapshot = buildWordAssignment(old);
  const answers = Object.fromEntries(snapshot.map(word => [word.id, word.answer]));
  assert.equal(gradeWordAssignment(JSON.parse(JSON.stringify(snapshot)), answers).questionsCorrect, 5);
  const selected = selectAssignmentWords(catalog, { category: 'daily', wordIds: additions.slice(0, 5).map(word => word.id) });
  assert.equal(selected.length, 5);
});

test('all 1976 R2 recording manifests match current text; available local MP3s match file hashes', async () => {
  const manifest = await json('public/audio-updates/2026-10-25/manifest.json');
  assert.equal(manifest.files.length, 1976);
  assert.equal(new Set(manifest.files.map(file => file.path)).size, 1976);
  assert.deepEqual(manifest.voices, ['af_bella', 'am_michael', 'bf_emma', 'bm_george']);
  for (const word of additions) for (const voice of manifest.voices) for (const field of ['word', 'example']) {
    const url = correctedVocabularyAudioUrl(word, field, voice);
    const file = manifest.files.find(item => item.path === new URL(url).pathname);
    assert(file, `${word.word} ${field} ${voice}`);
    assert.equal(file.text, word[field]);
    assert.equal(file.textSha256, hash(word[field]));
    assert.match(file.sha256, /^[a-f0-9]{64}$/);
    let bytes;
    try { bytes = await readFile(new URL(`../public${file.path}`, import.meta.url)); }
    catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    assert(bytes.length > 1000);
    assert.equal(bytes.length, file.bytes);
    assert.equal(hash(bytes), file.sha256);
  }
});

test('offline answers for retired IDs can sync without transferring scores to replacements or another account', async () => {
  const f = await createClassroomFixture();
  try {
    await f.addUser(1, 'student'); await f.addUser(2, 'student');
    const old = RETIRED_VOCABULARY.find(word => word.word === 'sam');
    for (const mode of ['quiz', 'fillblank', 'spelling', 'matching']) {
      const body = { id: `retired-${mode}`, mode, category: 'daily', scope: 'all',
        startedAt: new Date(Date.now() - 60000).toISOString(), completedAt: new Date().toISOString(),
        answers: [{ wordId: String(old.id), ...(mode === 'spelling' ? { input: old.word } : { selectedWordId: String(old.id) }) }] };
      const result = await f.api(1, '/exam-attempts', 'POST', body);
      assert.equal(result.status, 201, JSON.stringify(result.body));
      assert.equal(result.body.attempt.questionsCorrect, 1);
      assert.equal(result.body.attempt.answers[0].word, 'sam');
      assert.equal(result.body.attempt.answers[0].wordId, String(old.id));
      const retry = await f.api(1, '/exam-attempts', 'POST', { ...body, answers: [{ wordId: '8700', input: 'wrong', selectedWordId: '8701' }] });
      assert.deepEqual(retry.body.attempt, result.body.attempt);
    }
    assert.equal((await f.api(1, '/exam-attempts')).body.attempts.length, 4);
    assert.equal((await f.api(2, '/exam-attempts')).body.attempts.length, 0);
    assert.equal((await f.api(1, '/exam-attempts', 'POST', {}, { 'x-flashcards-user': '2' })).status, 409);
  } finally { f.sqlite.close(); }
});

test('the server still grades published retired-word assignment snapshots, independent of the new catalog', async () => {
  const f = await createClassroomFixture();
  try {
    await f.addUser(1, 'teacher'); await f.addUser(2, 'student');
    const classroom = (await f.api(1, '/classes', 'POST', { name: '历史快照验收' })).body.classroom;
    await f.api(2, '/classes/join', 'POST', { inviteCode: classroom.inviteCode });
    const task = (await f.api(1, `/classes/${classroom.id}/word-assignments`, 'POST', {
      category: 'all', start: 1, count: 5, dueAt: new Date(Date.now() + 86400000).toISOString(),
    })).body.assignment;
    // Simulate a task published before the catalog replacement.
    const snapshot = buildWordAssignment(RETIRED_VOCABULARY.slice(0, 5));
    f.sqlite.prepare('UPDATE word_assignments SET words_json=? WHERE id=?').run(JSON.stringify(snapshot), task.id);
    const result = await f.api(2, `/word-assignments/${task.id}/submit`, 'POST', {
      answers: Object.fromEntries(snapshot.map(word => [word.id, word.answer])),
    });
    assert.equal(result.status, 200, JSON.stringify(result.body));
    assert.equal(result.body.assignment.questionsCorrect, 5);
    assert.equal(JSON.parse(f.sqlite.prepare('SELECT words_json FROM word_assignments WHERE id=?').get(task.id).words_json)[0].id, snapshot[0].id);
  } finally { f.sqlite.close(); }
});
