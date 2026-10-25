import assert from 'node:assert/strict';
import test from 'node:test';
import catalog from '../worker/data/assignment-vocabulary.json' with { type: 'json' };
import readings from '../src/data/readings.js';
import { createClassroomFixture } from './helpers/classroom-db.mjs';
import { createExamAttempt, boundExamCache } from '../shared/examAttempts.js';
import { createExamHistoryStore, readExamHistory } from '../src/utils/examHistory.js';
import { buildWeeklyReport, weekRange } from '../shared/weeklyReport.js';
import { availableStudyRewards, studyRewardProgress } from '../shared/studyRewards.js';

const makeAttempt = (id = 'test-one', mode = 'quiz', completedAt = new Date().toISOString()) => ({
  id, mode, category: 'all', scope: 'all', startedAt: new Date(Date.parse(completedAt) - 60000).toISOString(), completedAt,
  answers: catalog.slice(0, 3).map((word, index) => ({ wordId: String(word.id), word: word.word, meaning: word.meaning,
    ...(mode === 'spelling' ? { input: index ? word.word.toUpperCase() : 'wrong-input' } : { selectedWordId: String(index ? word.id : catalog[3].id) }) })),
});
const setup = async () => {
  const f = await createClassroomFixture();
  for (const [id, role] of [[1, 'teacher'], [2, 'student'], [3, 'teacher'], [4, 'student']]) await f.addUser(id, role);
  const classroom = (await f.api(1, '/classes', 'POST', { name: 'P2 班级' })).body.classroom;
  await f.api(2, '/classes/join', 'POST', { inviteCode: classroom.inviteCode });
  return { ...f, classroom };
};

test('all four personal test modes derive grades from answers rather than forged totals or correctness flags', () => {
  for (const mode of ['quiz', 'fillblank', 'spelling', 'matching']) {
    const input = makeAttempt('mode-test', mode);
    input.questionsCorrect = 999;
    input.answers.forEach(answer => { answer.correct = true; answer.word = 'forged'; });
    const attempt = createExamAttempt(input, catalog);
    assert.equal(attempt.questionsCorrect, 2); assert.equal(attempt.questionsAnswered, 3);
    assert.equal(attempt.answers[0].word, catalog[0].word);
    assert.equal(attempt.answers[0].correct, false);
  }
  for (const changes of [{ mode: 'admin' }, { category: 'unknown' }, { scope: 'unknown' }, { startedAt: 'bad' }, { completedAt: '3000-01-01' }, { answers: [] }, { answers: Array(21).fill(makeAttempt().answers[0]) }]) {
    assert.throws(() => createExamAttempt({ ...makeAttempt(), ...changes }, catalog));
  }
});

test('personal history APIs authenticate, isolate accounts, persist immutable results and validate input', async () => {
  const f = await setup(); try {
    const first = await f.api(2, '/exam-attempts', 'POST', makeAttempt());
    assert.equal(first.status, 201, JSON.stringify(first.body)); assert.equal(first.body.attempt.questionsCorrect, 2);
    const retry = await f.api(2, '/exam-attempts', 'POST', { ...makeAttempt(), questionsCorrect: 999, answers: makeAttempt().answers.map(answer => ({ ...answer, selectedWordId: answer.wordId })) });
    assert.deepEqual(retry.body.attempt, first.body.attempt);
    assert.equal((await f.api(4, '/exam-attempts')).body.attempts.length, 0);
    assert.equal((await f.api(null, '/exam-attempts')).status, 401);
    assert.equal((await f.api(2, '/exam-attempts', 'GET', undefined, { 'x-flashcards-user': '4' })).status, 409);
    assert.equal((await f.api(2, '/exam-attempts', 'POST', makeAttempt('cross'), { 'sec-fetch-site': 'cross-site' })).status, 403);
    assert.equal((await f.api(2, '/exam-attempts', 'POST', makeAttempt('text'), { 'content-type': 'text/plain' })).status, 415);
    assert.equal((await f.api(2, '/exam-attempts', 'POST', { ...makeAttempt('invalid'), answers: [{ wordId: 'private', word: 'x', meaning: 'x', selectedWordId: 'private' }] })).status, 400);
    assert.equal((await f.api(2, '/progress')).body.progress.studyHistory.length, 0, 'saving history must not double-count daily totals');
  } finally { f.sqlite.close(); }
});

test('personal scoring only resolves synced custom words owned by the same account and enforces the plan category', async () => {
  const f = await setup(); try {
    await f.api(2, '/progress', 'PUT', { progress: { customWords: [{ id: 'my-word', word: 'owned', meaning: '我的词', category: 'daily' }] } });
    const body = { ...makeAttempt('custom', 'spelling'), category: 'daily', answers: [{ wordId: 'my-word', word: 'forged', meaning: 'forged', input: 'OWNED' }] };
    const result = await f.api(2, '/exam-attempts', 'POST', body);
    assert.equal(result.status, 201); assert.equal(result.body.attempt.questionsCorrect, 1); assert.equal(result.body.attempt.answers[0].word, 'owned');
    assert.equal((await f.api(4, '/exam-attempts', 'POST', body)).status, 400);
    const unrelated = catalog.find(word => !word.categories.includes('ielts'));
    assert.equal((await f.api(2, '/exam-attempts', 'POST', { ...makeAttempt('category'), category: 'ielts', answers: [{ wordId: unrelated.id, selectedWordId: unrelated.id }] })).status, 400);
    f.sqlite.exec(f.schema);
    assert.equal((await f.api(2, '/exam-attempts')).body.attempts.length, 1, 'reapplying schema retains personal grades');
  } finally { f.sqlite.close(); }
});

test('owning teacher sees synced test history and membership removal immediately revokes detail and report access to that student', async () => {
  const f = await setup(); try {
    await f.api(2, '/exam-attempts', 'POST', makeAttempt());
    const detail = `/classes/${f.classroom.id}/students/2/progress`;
    assert.equal((await f.api(1, detail)).body.examAttempts.length, 1);
    assert.equal((await f.api(3, detail)).status, 404);
    assert.equal((await f.api(4, detail)).status, 403);
    const report = `/classes/${f.classroom.id}/weekly-report`;
    assert.equal((await f.api(3, report)).status, 404);
    assert.equal((await f.api(2, report)).status, 403);
    assert.equal((await f.api(null, report)).status, 401);
    assert.equal((await f.api(1, report)).body.totals.savedTests, 1);
    await f.api(1, `/classes/${f.classroom.id}/students/2`, 'DELETE');
    assert.equal((await f.api(1, detail)).status, 404);
    const after = (await f.api(1, report)).body;
    assert.equal(after.totals.studentCount, 0); assert.deepEqual(after.commonWords, []); assert.equal(after.totals.savedTests, 0);
    assert.equal((await f.api(2, '/exam-attempts')).body.attempts.length, 1);
  } finally { f.sqlite.close(); }
});

test('weekly summaries use current members, UTC week bounds and weighted daily rates without double-counting saved tests', () => {
  const range = weekRange('2026-10-22T16:00:00Z');
  assert.deepEqual(range, { start: '2026-10-19', end: '2026-10-26', last: '2026-10-25' });
  assert.equal(weekRange('2026-10-25T23:59:59Z').start, range.start);
  const students = [{ id: 2, display_name: '学生', study_history: JSON.stringify([
    { date: '2026-10-18', wordsLearned: 999 }, { date: range.start, wordsLearned: 3, examQuestionsAnswered: 10, examQuestionsCorrect: 8 },
    { date: '2026-10-20', readingQuestionsAnswered: 2, readingQuestionsCorrect: 1, examQuestionsAnswered: 2, examQuestionsCorrect: 0 },
  ]) }];
  const exam = createExamAttempt(makeAttempt('weekly', 'quiz', '2026-10-20T01:00:00Z'));
  const input = { students, exams: [{ user_id: 2, attempt_json: JSON.stringify(exam) }, { user_id: 4, attempt_json: JSON.stringify(exam) }], readings: [], assignments: [], submissions: [], range, catalog, articles: readings };
  const result = buildWeeklyReport(input);
  assert.equal(result.totals.wordsStudied, 3); assert.equal(result.totals.examAnswered, 12); assert.equal(result.totals.examAccuracy, 67);
  assert.equal(result.totals.readingAccuracy, 50); assert.equal(result.students[0].activeDays, 2); assert.equal(result.totals.savedTests, 1);
  assert.equal(result.commonWords.length, 1); assert.equal(result.commonWords[0].students, 1); assert.equal(result.suggestedWords.length, 5);
  assert.equal(new Set(result.suggestedWords.map(word => word.id)).size, 5);
});

test('weekly reading weaknesses use the latest same question and do not count assignment review twice', async () => {
  const f = await setup(); try {
    const article = readings.find(item => item.id === 19);
    const answers = Object.fromEntries(article.questions.map(question => [question.id, question.answer]));
    answers[article.questions[0].id] = article.questions[0].answer === 'A' ? 'B' : 'A';
    await f.api(2, '/reading-attempts', 'POST', { id: 'reading-one', articleId: article.id, answers, completedAt: new Date(Date.now() - 1000).toISOString() });
    const path = `/classes/${f.classroom.id}/weekly-report`;
    const initial = (await f.api(1, path)).body;
    assert.equal(initial.weakReadings.length, 1); assert.equal(initial.weakReadings[0].answered, 1);
    assert.equal(initial.weakReadings[0].accuracy, 0); assert.equal(initial.weakReadings[0].assignable, true);
    answers[article.questions[0].id] = article.questions[0].answer;
    await f.api(2, '/reading-attempts', 'POST', { id: 'reading-two', articleId: article.id, answers, completedAt: new Date().toISOString() });
    assert.equal((await f.api(1, path)).body.weakReadings.length, 0);
    for (const week of ['bad', '2026-02-30', '3000-01-01']) assert.equal((await f.api(1, `${path}?week=${week}`)).status, 400);
  } finally { f.sqlite.close(); }
});

test('weekly reports deduplicate an assignment and its saved review, then recover a weak point after a correct retry', async () => {
  const f = await setup(); try {
    const article = readings.find(item => item.id === 19);
    const answers = Object.fromEntries(article.questions.map(question => [question.id, question.answer]));
    answers[article.questions[0].id] = article.questions[0].answer === 'A' ? 'B' : 'A';
    const task = (await f.api(1, `/classes/${f.classroom.id}/assignments`, 'POST', { articleId: article.id, dueAt: new Date(Date.now() + 86400000).toISOString() })).body.assignment;
    await f.api(2, `/assignments/${task.id}/submit`, 'POST', { answers });
    const parent = await f.api(2, '/reading-attempts', 'POST', { id: 'assignment-copy', assignmentId: task.id, articleId: article.id, completedAt: new Date(Date.now() - 1000).toISOString() });
    assert.equal(parent.status, 201);
    const path = `/classes/${f.classroom.id}/weekly-report`;
    assert.equal((await f.api(1, path)).body.weakReadings[0].answered, 1);
    const retry = await f.api(2, '/reading-attempts', 'POST', { id: 'assignment-retry', parentId: 'assignment-copy', answers: { [article.questions[0].id]: article.questions[0].answer }, completedAt: new Date().toISOString() });
    assert.equal(retry.status, 201); assert.equal((await f.api(1, path)).body.weakReadings.length, 0);
  } finally { f.sqlite.close(); }
});

test('a report can publish an exact weak-word set with frozen server-scored assignment semantics', async () => {
  const f = await setup(); try {
    const report = `/classes/${f.classroom.id}/weekly-report`;
    await f.api(2, '/exam-attempts', 'POST', makeAttempt());
    const wordIds = (await f.api(1, report)).body.suggestedWords.map(word => word.id);
    const path = `/classes/${f.classroom.id}/word-assignments`;
    // Keep this assignment in the report's UTC week, including Sunday runs.
    const body = { category: 'all', wordIds, dueAt: new Date(Date.parse(`${weekRange().end}T00:00:00.000Z`) - 1).toISOString() };
    const published = await f.api(1, path, 'POST', body);
    assert.equal(published.status, 201, JSON.stringify(published.body));
    assert.deepEqual(published.body.assignment.scope.wordIds, wordIds);
    const stored = JSON.parse(f.sqlite.prepare('SELECT words_json FROM word_assignments WHERE id=?').get(published.body.assignment.id).words_json);
    const submitted = await f.api(2, `/word-assignments/${published.body.assignment.id}/submit`, 'POST', { answers: Object.fromEntries(stored.map(word => [word.id, word.answer])), questionsCorrect: 999 });
    assert.equal(submitted.body.assignment.questionsCorrect, wordIds.length);
    const overview = (await f.api(1, report)).body;
    assert.equal(overview.assignments.submitted, 1); assert.equal(overview.assignments.expected, 1);
    for (const invalid of [[], [1, 1, 2, 3, 4], [1, 2, 3, 4, 'unknown']]) assert.equal((await f.api(1, path, 'POST', { ...body, wordIds: invalid })).status, 400);
    assert.equal((await f.api(3, path, 'POST', body)).status, 404);
  } finally { f.sqlite.close(); }
});

test('weekly due-work counts distinguish late submissions, overdue current members and tasks outside the selected week', async () => {
  const f = await setup(); try {
    await f.api(4, '/classes/join', 'POST', { inviteCode: f.classroom.inviteCode });
    const task = (await f.api(1, `/classes/${f.classroom.id}/word-assignments`, 'POST', { category: 'all', start: 1, count: 5, dueAt: new Date(Date.now() + 86400000).toISOString() })).body.assignment;
    const row = f.sqlite.prepare('SELECT words_json FROM word_assignments WHERE id=?').get(task.id);
    f.sqlite.prepare('UPDATE word_assignments SET due_at=? WHERE id=?').run(new Date(Date.now() - 1000).toISOString(), task.id);
    await f.api(2, `/word-assignments/${task.id}/submit`, 'POST', { answers: Object.fromEntries(JSON.parse(row.words_json).map(word => [word.id, word.answer])) });
    const path = `/classes/${f.classroom.id}/weekly-report`;
    const report = (await f.api(1, path)).body;
    assert.deepEqual(report.assignments, { total: 1, expected: 2, submitted: 1, late: 1, overdue: 1 });
    const lastWeek = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
    assert.equal((await f.api(1, `${path}?week=${lastWeek}`)).body.assignments.expected, 0);
  } finally { f.sqlite.close(); }
});

test('pending exam records survive offline retries, restore on new instances, and sync without moving data between accounts', async () => {
  const old = globalThis.localStorage; const values = new Map();
  globalThis.localStorage = { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value) };
  try {
    const offline = createExamHistoryStore('2', async () => { throw new Error('offline'); });
    offline.record(makeAttempt());
    await assert.rejects(offline.sync(new AbortController().signal));
    assert.equal(readExamHistory('2').pending.length, 1); assert.equal(readExamHistory('4').attempts.length, 0); assert.equal(readExamHistory(null).attempts.length, 0);
    const calls = [];
    const online = createExamHistoryStore('2', async (path, options) => { calls.push(options); return options.method === 'POST' ? { attempt: createExamAttempt(options.body, catalog) } : { attempts: [] }; });
    await online.sync(new AbortController().signal);
    assert.equal(online.read().pending.length, 0); assert.equal(online.read().attempts.length, 1); assert(calls.every(call => call.expectedUserId === '2'));
    const guest = createExamHistoryStore(null, async () => { throw new Error('guest must not send requests'); });
    guest.record(makeAttempt('guest')); await guest.sync(new AbortController().signal);
    assert.equal(guest.read().pending.length, 0); assert.equal(online.read().attempts.length, 1);
  } finally { globalThis.localStorage = old; }
});

test('test cache protects all pending attempts when another device has newer history and storage failures never report success', () => {
  const attempts = Array.from({ length: 100 }, (_, i) => createExamAttempt(makeAttempt(`cloud-${i}`)));
  const pending = createExamAttempt(makeAttempt('older', 'quiz', '2026-01-01T00:00:00Z'));
  const cache = boundExamCache([pending, ...attempts], ['older']);
  assert.equal(cache.attempts.length, 100); assert(cache.attempts.some(item => item.id === 'older'));
  const old = globalThis.localStorage;
  globalThis.localStorage = { getItem: () => null, setItem: () => { throw new Error('quota'); } };
  try {
    const store = createExamHistoryStore('2', async () => ({}));
    assert.throws(() => store.record(makeAttempt()), /quota/); assert.equal(store.read().attempts.length, 0);
  } finally { globalThis.localStorage = old; }
});

test('pending queue capacity fails visibly instead of dropping unsynced grades', () => {
  const old = globalThis.localStorage; const values = new Map();
  globalThis.localStorage = { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value) };
  try {
    const store = createExamHistoryStore('2', async () => ({}));
    for (let i = 0; i < 100; i++) store.record(makeAttempt(`pending-${i}`));
    assert.throws(() => store.record(makeAttempt('pending-overflow')), /100/);
    assert.equal(store.read().pending.length, 100); assert.equal(readExamHistory('2').pending.length, 100);
    assert(!readExamHistory('2').attempts.some(item => item.id === 'pending-overflow'));
  } finally { globalThis.localStorage = old; }
});

test('independent tabs preserve each other’s pending test results and aborted sync responses cannot touch another owner', async () => {
  const old = globalThis.localStorage; const values = new Map();
  globalThis.localStorage = { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value) };
  try {
    const tabOne = createExamHistoryStore('2', async () => ({}));
    const tabTwo = createExamHistoryStore('2', async () => ({}));
    tabOne.record(makeAttempt('one')); tabTwo.record(makeAttempt('two'));
    assert.equal(readExamHistory('2').pending.length, 2);
    let resolve;
    const late = createExamHistoryStore('2', () => new Promise(done => { resolve = done; }));
    const controller = new AbortController(); const running = late.sync(controller.signal);
    await Promise.resolve(); await Promise.resolve(); controller.abort();
    resolve({ attempt: createExamAttempt(makeAttempt('one')) }); await running;
    assert.equal(readExamHistory('2').pending.length, 2); assert.equal(readExamHistory('4').attempts.length, 0);
  } finally { globalThis.localStorage = old; }
});

test('weekly goals count distinct real activity days and milestone keys stay stable for deduplicated celebrations', () => {
  const now = new Date('2026-10-23T12:00:00Z');
  const history = Array.from({ length: 7 }, (_, i) => ({ date: new Date(Date.parse('2026-10-17') + i * 86400000).toISOString().slice(0, 10), readingsCompleted: 1 }));
  const progress = studyRewardProgress([...history, history[0]], now);
  assert.equal(progress.streak, 7); assert.equal(progress.activeDays, 5); assert.equal(progress.milestone, 7);
  assert.equal(progress.nextMilestone, 14);
  const rewards = availableStudyRewards({ progress, today: '2026-10-23', wordsDone: true, readingDone: true, examDone: true, allDone: true });
  assert(rewards.some(reward => reward.key === 'streak:7')); assert(rewards.some(reward => reward.key === 'week:2026-10-19'));
  const empty = studyRewardProgress([], now);
  assert.equal(empty.streak, 0); assert.equal(empty.activeDays, 0);
  assert.deepEqual(availableStudyRewards({ progress: empty, today: '2026-10-23' }), []);
});
