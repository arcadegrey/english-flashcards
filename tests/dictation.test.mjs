import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dictationTokens, dictationCandidates, evaluateDictation, isDictationExample } from '../shared/dictation.js';
import { createExamAttempt } from '../shared/examAttempts.js';
import { createExamplePlayback } from '../src/utils/examplePlayback.js';
import { createExamHistoryStore } from '../src/utils/examHistory.js';
import { buildWeeklyReport, weekRange } from '../shared/weeklyReport.js';
import { createClassroomFixture } from './helpers/classroom-db.mjs';
import register from '../worker/data/dictation-examples.json' with { type: 'json' };
import catalog from '../worker/data/assignment-vocabulary.json' with { type: 'json' };

const example = 'We need to make a decision today.';
const word = { id: 'sentence-1', word: 'decision', meaning: '决定', example, exampleCn: '我们今天需要作出决定。', categories: ['daily'] };
const attempt = (changes = {}) => ({ id: 'dictation-one', mode: 'dictation', category: 'daily', scope: 'all',
  startedAt: new Date(Date.now() - 1000).toISOString(), completedAt: new Date().toISOString(),
  answers: [{ wordId: word.id, ...word, input: example }], ...changes });

test('dictation ignores case, punctuation and whitespace, preserves contractions and accented words', () => {
  assert.equal(evaluateDictation(example, 'we NEED to make a decision today!').correct, true);
  assert.equal(evaluateDictation('You’re welcome.', "YOU'RE   welcome").correct, true);
  assert.equal(evaluateDictation("Don't leave.", 'Dont leave').correct, true);
  assert.equal(evaluateDictation("Don't leave.", 'Do not leave').correct, false);
  assert.equal(evaluateDictation('A café nearby.', 'A cafe nearby').correct, false);
  assert.deepEqual(dictationTokens('A twenty-year-old child.'), ['A', 'twenty', 'year', 'old', 'child']);
  assert.equal(evaluateDictation('', '').correct, false);
});

test('alignment identifies repeated-word omissions and inserts without shifting correct later words', () => {
  const missing = evaluateDictation('We need to make a decision today.', 'We need make a decision today.');
  assert.equal(missing.missing, 1); assert.equal(missing.matched, 6);
  assert.deepEqual(missing.parts.find(part => part.type === 'missing'), { type: 'missing', expected: 'to', actual: '' });
  const extra = evaluateDictation('We need help.', 'We really need help.');
  assert.equal(extra.extra, 1); assert.equal(extra.matched, 3);
  const replacement = evaluateDictation('We need help.', 'We need money.');
  assert.equal(replacement.replacements, 1);
  assert.equal(evaluateDictation('I think that that is right.', 'I think that is right.').missing, 1);
  assert.equal(evaluateDictation('We need help.', '').missing, 3);
});

test('eligible sentence pools retain deferred details but reject empty or unbounded examples', () => {
  const deferred = { id: 2, word: 'test', exampleDeferred: true };
  assert.deepEqual(dictationCandidates([word, deferred, { id: 3, word: 'x', example: 'X.' }, { ...word, example: '' }]), [word, deferred]);
  assert.deepEqual(dictationCandidates([null, { exampleDeferred: true }, {}]), []);
  assert.deepEqual(dictationCandidates(null), []);
  assert.equal(isDictationExample({ ...word, example: 'word '.repeat(61) }), false);
  assert.equal(isDictationExample({ ...word, example: 'w'.repeat(1001) + ' test' }), false);
});

test('sentence scoring derives correctness from the registered example and keeps assistance flags', () => {
  const value = attempt(); value.answers[0].correct = false; value.questionsCorrect = 0;
  const result = createExamAttempt(value, [word]);
  assert.equal(result.questionsCorrect, 1);
  assert.equal(result.answers[0].exampleCn, word.exampleCn);
  assert.equal(createExamAttempt(attempt({ answers: [{ ...value.answers[0], input: 'We need help.', correct: true }] }), [word]).questionsCorrect, 0);
  const hint = createExamAttempt(attempt({ answers: [{ ...value.answers[0], hintUsed: true }] }), [word]);
  assert.equal(hint.questionsCorrect, 1); assert.equal(hint.answers[0].hintUsed, true);
  const revealed = createExamAttempt(attempt({ answers: [{ ...value.answers[0], input: '', revealed: true }] }), [word]);
  assert.equal(revealed.questionsCorrect, 0); assert.equal(revealed.answers[0].revealed, true);
});

test('forged sentences, unsupported flags, oversized answers and out-of-category words are rejected', () => {
  for (const patch of [{ example: 'Forged sentence.' }, { input: '' }, { input: 'a'.repeat(1001) }, { hintUsed: 'yes' }, { revealed: 1 }]) {
    assert.throws(() => createExamAttempt(attempt({ answers: [{ ...attempt().answers[0], ...patch }] }), [word]));
  }
  assert.throws(() => createExamAttempt(attempt({ category: 'ielts' }), [word]));
});

test('registered historical examples survive current example changes and cannot be freely invented', () => {
  const current = { ...word, example: 'A different current example.' };
  const historical = { [word.id]: [word] };
  const saved = createExamAttempt(attempt(), [current], historical);
  assert.equal(saved.questionsCorrect, 1); assert.equal(saved.answers[0].example, example);
  assert.throws(() => createExamAttempt(attempt({ answers: [{ ...attempt().answers[0], example: current.example }] }), [current], historical));
  assert.deepEqual(createExamAttempt(saved), saved, 'local cache round trips keep sentence snapshots');
});

test('the grading register covers canonical examples and rebuilding is byte-identical', () => {
  const file = new URL('../worker/data/dictation-examples.json', import.meta.url);
  const before = readFileSync(file);
  execFileSync(process.execPath, ['scripts/build-dictation-catalog.mjs']);
  assert.deepEqual(readFileSync(file), before);
  const words = JSON.parse(readFileSync(new URL('../public/data/vocabulary.json', import.meta.url)));
  for (const item of words.filter(isDictationExample)) {
    assert.ok(register[item.id].some(version => version.word === item.word && version.example === item.example && version.exampleCn === item.exampleCn));
  }
});

test('playback prefers existing recordings, tracks real start, and cancels only the owned operation', async () => {
  const calls = [];
  const player = createExamplePlayback((value, options) => new Promise(resolve => { calls.push({ value, options, resolve }); }));
  const first = player.toggle(word); assert.equal(player.getSnapshot().status, 'preparing');
  assert.equal(calls[0].value, word); assert.equal(calls[0].options.recordingOnly, true);
  calls[0].options.onStart(); assert.equal(player.getSnapshot().status, 'playing');
  const slow = player.toggle(word, 0.75); assert.equal(calls[0].options.signal.aborted, true);
  calls[0].options.onStart(); assert.equal(player.getSnapshot().status, 'preparing');
  assert.equal(calls[1].options.rate, 0.75);
  calls[0].resolve(); await first; assert.equal(player.getSnapshot().rate, 0.75);
  player.stop(); assert.equal(calls[1].options.signal.aborted, true); assert.equal(player.getSnapshot().status, 'idle');
  calls[1].resolve(); await slow;
});

test('playback stop, failures and stalled preparation remain retryable', async () => {
  let calls = 0;
  const player = createExamplePlayback((_, options) => {
    calls++;
    if (calls === 1) return Promise.reject(new Error('unavailable'));
    if (calls === 2) return new Promise(resolve => options.signal.addEventListener('abort', resolve));
    return Promise.resolve();
  }, 10);
  await player.toggle(word); assert.equal(player.getSnapshot().status, 'error');
  await player.toggle(word); assert.match(player.getSnapshot().error, /超时/);
  await player.toggle(word); assert.equal(player.getSnapshot().status, 'idle');
  const pending = createExamplePlayback((_, options) => new Promise(resolve => options.signal.addEventListener('abort', resolve)));
  const playing = pending.toggle(word); await pending.toggle(word);
  await playing; assert.equal(pending.getSnapshot().status, 'idle');
});

test('offline dictation history is durable, account scoped and preserves snapshots after syncing', async () => {
  const values = new Map();
  globalThis.localStorage = { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value) };
  let online = false;
  const requests = [];
  const store = createExamHistoryStore('alice', async (path, options) => {
    requests.push(options.expectedUserId);
    if (!online) throw new Error('offline');
    return options.method === 'POST' ? { attempt: createExamAttempt(options.body, [word]) } : { attempts: [] };
  });
  store.record(attempt());
  assert.equal(store.read().pending.length, 1);
  await assert.rejects(store.sync(new AbortController().signal));
  assert.equal(createExamHistoryStore('alice').read().attempts[0].answers[0].example, example);
  assert.equal(createExamHistoryStore('bob').read().attempts.length, 0);
  online = true; await store.sync(new AbortController().signal);
  assert.equal(store.read().pending.length, 0); assert.ok(requests.every(id => id === 'alice'));
  delete globalThis.localStorage;
});

test('API grades canonical audio sentences, isolates accounts and freezes the first saved result', async () => {
  const f = await createClassroomFixture();
  try {
    await f.addUser(1, 'student'); await f.addUser(2, 'student');
    const item = catalog[0], registered = register[item.id][0];
    const body = attempt({ category: 'all', answers: [{ wordId: item.id, ...item, ...registered, input: registered.example, correct: false }] });
    const saved = await f.api(1, '/exam-attempts', 'POST', body);
    assert.equal(saved.status, 201, JSON.stringify(saved.body)); assert.equal(saved.body.attempt.questionsCorrect, 1);
    const replay = await f.api(1, '/exam-attempts', 'POST', { ...body, answers: [{ ...body.answers[0], input: 'wrong' }] });
    assert.deepEqual(replay.body.attempt, saved.body.attempt);
    assert.equal((await f.api(2, '/exam-attempts')).body.attempts.length, 0);
    assert.equal((await f.api(null, '/exam-attempts', 'POST', body)).status, 401);
    assert.equal((await f.api(1, '/exam-attempts', 'POST', { ...body, id: 'forged', answers: [{ ...body.answers[0], example: 'Forged sentence.' }] })).status, 400);
    assert.equal((await f.api(1, '/exam-attempts', 'POST', { ...body, id: 'stale-owner' }, { 'x-flashcards-user': '2' })).status, 409);
    const progress = (await f.api(1, '/progress')).body.progress;
    assert.equal(progress.studyHistory.length, 0, 'history save does not double-count activity');
    assert.equal(progress.masteredWords.length, 0);
  } finally { f.sqlite.close(); }
});

test('custom dictation sentences must be synced to the submitting account', async () => {
  const f = await createClassroomFixture();
  try {
    await f.addUser(1, 'student'); await f.addUser(2, 'student');
    await f.api(1, '/progress', 'PUT', { progress: { customWords: [{ ...word, category: 'daily' }] } });
    const saved = await f.api(1, '/exam-attempts', 'POST', attempt());
    assert.equal(saved.status, 201, JSON.stringify(saved.body)); assert.equal(saved.body.attempt.questionsCorrect, 1);
    assert.equal((await f.api(2, '/exam-attempts', 'POST', attempt())).status, 400);
  } finally { f.sqlite.close(); }
});

test('sentence mistakes remain saved tests without becoming weak-word recommendations', () => {
  const saved = createExamAttempt(attempt({ answers: [{ ...attempt().answers[0], input: 'We need help.' }] }));
  const report = buildWeeklyReport({ students: [{ id: 1 }], exams: [{ user_id: 1, attempt_json: JSON.stringify(saved) }],
    readings: [], assignments: [], submissions: [], range: weekRange(), catalog: [word], articles: [] });
  assert.equal(report.totals.savedTests, 1); assert.deepEqual(report.commonWords, []); assert.deepEqual(report.suggestedWords, []);
});
