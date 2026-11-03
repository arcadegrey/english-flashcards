import test from 'node:test';
import assert from 'node:assert/strict';
import catalog from '../worker/data/assignment-vocabulary.json' with { type: 'json' };
import { createClassroomFixture } from './helpers/classroom-db.mjs';
import { normalizeCollectionFocus } from '../shared/collectionPractice.js';
import { createExamAttempt, mergeExamAttempts, boundExamCache } from '../shared/examAttempts.js';
import { recordDailyExamAnswer } from '../shared/studyHistory.js';
import { collectionPracticeWords, createCollectionSnapshot, normalizeCollectionSnapshot, collectionFocus,
  collectionDraftKey, readCollectionDraft, readCollectionDrafts, writeCollectionDraft,
  prepareCollectionVocabulary, collectionModeError } from '../src/utils/collectionPractice.js';
import { createExamHistoryStore, readExamHistory } from '../src/utils/examHistory.js';

const words = catalog.slice(0, 4).map(word => ({ ...word, example: `We use ${word.word} in this example.`, exampleCn: '示例。' }));
const focus = { source: 'wrongWords', key: 'a'.repeat(64), wordCount: 4 };
const attempt = (id = 'focused-result', extra = {}) => ({ id, mode: 'quiz', category: 'all', scope: 'all',
  startedAt: new Date(Date.now() - 1000).toISOString(), completedAt: new Date().toISOString(), focus,
  answers: [{ wordId: String(words[0].id), word: words[0].word, meaning: words[0].meaning, selectedWordId: String(words[1].id) }], ...extra });

function localStore(t) {
  const data = new Map(), previous = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, String(value)), removeItem: key => data.delete(key),
  } });
  t.after(() => { if (previous) Object.defineProperty(globalThis, 'localStorage', previous); else delete globalThis.localStorage; });
  return data;
}

test('selection identity is stable for ID order/duplicates and distinct across source collections', async () => {
  const input = Object.freeze([3, '1', 3, 2]);
  const a = await createCollectionSnapshot('wrongWords', input);
  assert.deepEqual(a.wordIds, ['1', '2', '3']);
  assert.deepEqual(a, await createCollectionSnapshot('wrongWords', ['2', '1', '3']));
  assert.notEqual(a.key, (await createCollectionSnapshot('savedWords', input)).key);
  assert.notEqual(a.key, (await createCollectionSnapshot('wrongWords', [1, 2])).key);
  await assert.rejects(createCollectionSnapshot('__proto__', [1]));
  await assert.rejects(createCollectionSnapshot('savedWords', []));
  await assert.rejects(createCollectionSnapshot('savedWords', [null]));
});

test('new collection exercises exclude retired/context-only words without changing the historical collection', () => {
  const retired = { id: 2735, word: 'legacy', meaning: '历史词' };
  const contextual = { id: 8164, word: 'negro', meaning: '历史语境' };
  const input = Object.freeze([words[0], words[0], retired, contextual, null, { id: 'empty', word: 'empty' }]);
  assert.deepEqual(collectionPracticeWords(input), [words[0]]);
  assert.equal(input.length, 6);
  assert.equal(retired.meaning, '历史词');
});

test('scope metadata is compact, bounded and rejects malformed or privileged source names', () => {
  assert.deepEqual(normalizeCollectionFocus({ ...focus, private: 'ignored' }), focus);
  for (const change of [{ source: '__proto__' }, { key: 'wrong' }, { wordCount: 0 }, { wordCount: 10001 }, { wordCount: 1.5 }]) {
    assert.throws(() => normalizeCollectionFocus({ ...focus, ...change }));
  }
  assert.throws(() => normalizeCollectionSnapshot({ ...focus, wordIds: ['1', '1'] }));
});

test('preparation loads only selected IDs, uses authoritative built-ins and allows only owned custom entries', async () => {
  const custom = { id: 'owned-custom', word: 'original', meaning: '自定义词' };
  const snapshot = await createCollectionSnapshot('savedWords', [words[0].id, custom.id]);
  const requested = [];
  const prepared = await prepareCollectionVocabulary(snapshot, {
    loadWords: async ids => { requested.push(ids); return [words[0], words[1]]; },
    customWords: [custom, { ...words[0], word: 'forged' }], isBuiltIn: id => /^\d+$/.test(String(id)),
  });
  assert.deepEqual(requested, [snapshot.wordIds]);
  assert.equal(prepared.length, 2);
  assert(prepared.some(word => word.word === words[0].word));
  assert(!prepared.some(word => word.id === words[1].id));
  await assert.rejects(prepareCollectionVocabulary(snapshot, {
    loadWords: async () => [words[0]], customWords: [], isBuiltIn: id => /^\d+$/.test(String(id)),
  }), /暂不可用/);
  await assert.rejects(prepareCollectionVocabulary(await createCollectionSnapshot('wrongWords', [words[0].id]), {
    loadWords: async () => [], customWords: [{ ...words[0], word: 'forged' }], isBuiltIn: () => true,
  }), /暂不可用/);
});

test('tampered snapshots fail before content is requested or a different pool can be substituted', async () => {
  const snapshot = await createCollectionSnapshot('todayReview', [words[0].id]);
  let requested = false;
  await assert.rejects(prepareCollectionVocabulary({ ...snapshot, wordIds: [String(words[1].id)] }, {
    loadWords: async () => { requested = true; return words; }, isBuiltIn: () => true,
  }), /校验失败/);
  assert.equal(requested, false);
});

test('draft keys isolate account/source/mode and preserve frozen IDs when the live collection changes', async t => {
  localStore(t);
  const snapshot = await createCollectionSnapshot('wrongWords', words.map(word => word.id));
  const draft = writeCollectionDraft('one', 'quiz', snapshot);
  assert.deepEqual(readCollectionDraft('one', 'wrongWords', 'quiz').collectionSnapshot, snapshot);
  assert.equal(readCollectionDraft('two', 'wrongWords', 'quiz'), null);
  assert.equal(readCollectionDraft('one', 'savedWords', 'quiz'), null);
  assert.equal(readCollectionDraft('one', 'wrongWords', 'spelling'), null);
  const changed = await createCollectionSnapshot('wrongWords', [words[0].id]);
  assert.notEqual(changed.key, draft.focus.key);
  assert.equal(readCollectionDrafts('one', 'wrongWords').quiz.id, draft.id);
  assert(!collectionDraftKey('one', 'wrongWords', 'quiz').startsWith('flashcards_exam_draft:'));
});

test('invalid or out-of-selection answers cannot resume and damaged drafts are not silently deleted', async t => {
  const data = localStore(t);
  const snapshot = await createCollectionSnapshot('wrongWords', [words[0].id]);
  const draft = writeCollectionDraft('one', 'quiz', snapshot);
  draft.answers = attempt().answers.map(answer => ({ ...answer, wordId: String(words[1].id) }));
  const key = collectionDraftKey('one', 'wrongWords', 'quiz');
  data.set(key, JSON.stringify(draft));
  assert.equal(readCollectionDraft('one', 'wrongWords', 'quiz'), null);
  assert.equal(data.has(key), true);
  data.set(key, 'broken-json');
  assert.equal(readCollectionDraft('one', 'wrongWords', 'quiz'), null);
  assert.equal(data.get(key), 'broken-json');
});

test('explicit fresh-draft storage failure preserves the previous in-progress practice', async t => {
  const data = localStore(t), snapshot = await createCollectionSnapshot('savedWords', [words[0].id]);
  writeCollectionDraft('one', 'spelling', snapshot);
  const before = Object.fromEntries(data);
  t.mock.method(localStorage, 'setItem', () => { throw new Error('QuotaExceededError'); });
  assert.throws(() => writeCollectionDraft('one', 'spelling', snapshot), /草稿保存失败/);
  assert.deepEqual(Object.fromEntries(data), before);
});

test('completed grades keep provenance but omit the large draft snapshot and still recalculate scores', () => {
  const input = attempt('compact', { questionsCorrect: 999, collectionSnapshot: { wordIds: Array(1000).fill('private') } });
  input.answers[0].correct = true;
  const result = createExamAttempt(input, catalog);
  assert.deepEqual(result.focus, focus);
  assert.equal(result.questionsCorrect, 0);
  assert.equal(Object.hasOwn(result, 'collectionSnapshot'), false);
  assert.throws(() => createExamAttempt({ ...input, category: 'daily' }, catalog), /不能混用/);
  assert.throws(() => createExamAttempt(attempt('count', { focus: { ...focus, wordCount: 1 }, answers: [
    ...attempt().answers, { wordId: words[1].id, selectedWordId: words[1].id },
  ] }), catalog), /词数/);
});

test('legacy payloads remain valid and metadata-omitting duplicate caches cannot erase provenance', () => {
  const focused = createExamAttempt(attempt());
  const oldClient = { ...focused }; delete oldClient.focus;
  assert.equal(Object.hasOwn(createExamAttempt(oldClient), 'focus'), false);
  assert.deepEqual(mergeExamAttempts([focused], [oldClient])[0].focus, focus);
  assert.deepEqual(mergeExamAttempts([oldClient], [focused])[0].focus, focus);
  assert.deepEqual(boundExamCache([focused], [focused.id]).attempts[0].focus, focus);
});

test('mode eligibility never expands a small list to the normal plan vocabulary', () => {
  for (const mode of ['quiz', 'fillblank', 'matching']) assert.match(collectionModeError(mode, [words[0]]), /至少/);
  assert.equal(collectionModeError('spelling', [words[0]]), '');
  assert.equal(collectionModeError('dictation', [words[0]]), '');
  assert.match(collectionModeError('dictation', [{ ...words[0], example: '' }]), /例句/);
  assert.match(collectionModeError('fillblank', words.slice(0, 2).map(word => ({ ...word, example: 'No matching target.' }))), /例句/);
});

test('offline focused results survive reload and sync without sharing another account queue', async t => {
  localStore(t);
  const first = createExamHistoryStore('one', async () => { throw new Error('offline'); });
  first.record(attempt('offline-focus'));
  await assert.rejects(first.sync(new AbortController().signal), /offline/);
  assert.deepEqual(readExamHistory('one').pending, ['offline-focus']);
  assert.deepEqual(readExamHistory('two').attempts, []);
  const remote = [];
  const restored = createExamHistoryStore('one', async (path, options) => {
    assert.equal(options.expectedUserId, 'one');
    if (options.method === 'POST') { remote.push(createExamAttempt(options.body, catalog)); return { attempt: remote[0] }; }
    return { attempts: remote };
  });
  await restored.sync(new AbortController().signal);
  assert.deepEqual(restored.read().pending, []);
  assert.deepEqual(readExamHistory('one').attempts[0].focus, focus);
});

test('saved results suppress a leftover draft without deleting the saved grade', async t => {
  localStore(t);
  const snapshot = await createCollectionSnapshot('wrongWords', [words[0].id]);
  const draft = writeCollectionDraft('one', 'quiz', snapshot);
  createExamHistoryStore('one', async () => ({})).record(attempt(draft.id, { startedAt: draft.startedAt, focus: collectionFocus(snapshot) }));
  assert.equal(readCollectionDraft('one', 'wrongWords', 'quiz'), null);
  assert.equal(readExamHistory('one').attempts.length, 1);
});

test('focused cross-category practice increments global totals without crediting an unrelated plan category', () => {
  const date = '2026-11-03';
  const history = recordDailyExamAnswer([], { category: 'all', correct: true, date });
  assert.equal(history[0].examQuestionsAnswered, 1);
  assert.equal(history[0].examQuestionsCorrect, 1);
  assert.equal(history[0].examByCategory?.toefl, undefined);
});

test('real APIs preserve private provenance for the owner, grade canonically and redact it from teachers', async () => {
  const f = await createClassroomFixture();
  try {
    await f.addUser(1, 'teacher'); await f.addUser(2, 'student'); await f.addUser(3, 'student');
    const classroom = (await f.api(1, '/classes', 'POST', { name: '定向训练班' })).body.classroom;
    await f.api(2, '/classes/join', 'POST', { inviteCode: classroom.inviteCode });
    const body = attempt('private-source', { focus: { ...focus, source: 'savedWords' }, questionsCorrect: 999 });
    const result = await f.api(2, '/exam-attempts', 'POST', body);
    assert.equal(result.status, 201, JSON.stringify(result.body));
    assert.equal(result.body.attempt.questionsCorrect, 0);
    assert.equal(result.body.attempt.focus.source, 'savedWords');
    assert.deepEqual((await f.api(2, '/exam-attempts')).body.attempts[0].focus, body.focus);
    assert.deepEqual((await f.api(3, '/exam-attempts')).body.attempts, []);
    assert.equal((await f.api(3, '/exam-attempts', 'POST', body, { 'x-flashcards-user': '2' })).status, 409);
    const oldRetry = { ...body }; delete oldRetry.focus;
    assert.deepEqual((await f.api(2, '/exam-attempts', 'POST', oldRetry)).body.attempt.focus, body.focus);
    const detail = (await f.api(1, `/classes/${classroom.id}/students/2/progress`)).body;
    assert.equal(detail.examAttempts.length, 1);
    assert.equal(Object.hasOwn(detail.examAttempts[0], 'focus'), false);
    assert.equal(detail.examAttempts[0].practiceKind, 'collection');
    assert.doesNotMatch(JSON.stringify((await f.api(1, `/classes/${classroom.id}/weekly-report`)).body), /savedWords|"focus"/);
    assert.equal((await f.api(2, '/progress')).body.progress.studyHistory.length, 0);
    await f.api(2, `/classes/${classroom.id}/membership`, 'DELETE');
    assert.equal((await f.api(1, `/classes/${classroom.id}/students/2/progress`)).status, 404);
  } finally { f.sqlite.close(); }
});
