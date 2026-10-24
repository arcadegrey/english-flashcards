import assert from 'node:assert/strict';
import test from 'node:test';
import { changeWordBookmark, mergeWordBookmarks, normalizeWordBookmarks } from '../shared/wordBookmarks.js';
import { mergePreferences } from '../shared/planPreferences.js';
import { getWordHints, getWordMeaningLine } from '../src/utils/wordHints.js';
import { storage } from '../src/utils/storage.js';
import { createClassroomFixture } from './helpers/classroom-db.mjs';

const early = '2026-10-23T01:00:00.000Z';
const late = '2026-10-23T02:00:00.000Z';
const entry = (saved, updatedAt = early) => ({ saved, updatedAt });

test('dictionary formatting removes literal newlines and duplicate part-of-speech prefixes without changing entries', () => {
  const word = { pos: 'n.', meaning: 'n. 放射性\\n[化] 放射性' };
  assert.equal(getWordMeaningLine(word), 'n. 放射性；[化] 放射性');
  assert.equal(word.meaning, 'n. 放射性\\n[化] 放射性');
  assert.equal(getWordMeaningLine({ pos: 'v.', meaning: 'n. 工作\nvt. 使运转' }), 'n. 工作；vt. 使运转');
  assert.equal(getWordMeaningLine({ pos: 'n.', meaning: '能力' }), 'n. 能力');
  assert.equal(getWordMeaningLine({ pos: 'n.' }), '暂无释义');
  assert.match(getWordHints({ word: 'unlistedwordfortest', example: 'An example without a translation.' })[1].text, /对照释义/);
});

test('learning hints use the given definition and example without inventing synonyms or word roots', () => {
  const hints = getWordHints({ word: 'unlistedwordfortest', meaning: '蝴蝶；蝶泳', example: 'A butterfly landed on the flower.' });
  assert.equal(hints[0].text, '蝴蝶；蝶泳');
  assert.match(hints[1].text, /unlistedwordfortest/);
  assert.deepEqual(hints.map(hint => hint.label), ['词义回顾', '例句练习', '回忆练习']);
  assert.doesNotMatch(JSON.stringify(hints), /but \+ terfly|词根|近义/);
  assert.match(getWordHints({})[1].text, /没有例句/);
  assert.match(getWordHints({})[0].text, /暂无释义/);
});

test('bookmark removals survive stale devices and equal-time conflicts, independently of plan settings', () => {
  const cloud = { '1': entry(false, late), '2': entry(true) };
  const stale = { '1': entry(true), '3': entry(true) };
  assert.deepEqual(mergeWordBookmarks(cloud, stale), { '1': entry(false, late), '2': entry(true), '3': entry(true) });
  assert.equal(mergeWordBookmarks({ '1': entry(false) }, { '1': entry(true) })['1'].saved, false);
  assert.equal(mergeWordBookmarks({ '1': entry(true) }, { '1': entry(false) })['1'].saved, false);
  const prefs = mergePreferences({ dailyNewWordTarget: 40, updatedAt: late, wordBookmarks: cloud },
    { dailyNewWordTarget: 10, updatedAt: early, wordBookmarks: stale });
  assert.equal(prefs.dailyNewWordTarget, 40);
  assert.deepEqual(prefs.wordBookmarks, mergeWordBookmarks(cloud, stale));
  assert.deepEqual(mergePreferences(prefs, {}).wordBookmarks, prefs.wordBookmarks);
});

test('bookmark timestamps advance despite repeated clicks or a clock moving backwards; invalid records are discarded', () => {
  const first = changeWordBookmark({}, 1, true, Date.parse(late));
  const removed = changeWordBookmark(first, '1', false, Date.parse(early));
  assert(removed['1'].updatedAt > first['1'].updatedAt);
  assert.equal(removed['1'].saved, false);
  assert.deepEqual(normalizeWordBookmarks({ a: { saved: 'true', updatedAt: early }, b: entry(true, 'bad') }), {});
  assert.deepEqual(normalizeWordBookmarks(JSON.parse('{"__proto__":{"saved":true,"updatedAt":"2026-10-23T01:00:00Z"}}')), {});
  assert.throws(() => changeWordBookmark({}, '__proto__', true));
});

test('bookmarks persist through reload, isolate accounts, merge other-tab changes and report storage failure', () => {
  const previous = globalThis.localStorage;
  const data = new Map();
  globalThis.localStorage = { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) };
  try {
    storage.switchLearningAccount('a');
    const saved = storage.changeWordBookmark('a', {}, 1, true);
    assert.deepEqual(storage.getLearningSnapshot().preferences.wordBookmarks, saved);
    storage.changeWordBookmark('a', {}, 2, true);
    assert.equal(storage.getWordBookmarks()['1'].saved, true);
    assert.equal(storage.getWordBookmarks()['2'].saved, true);
    assert.deepEqual(storage.switchLearningAccount('b').preferences.wordBookmarks || {}, {});
    assert.deepEqual(storage.getWordBookmarks(), {});
    assert.throws(() => storage.changeWordBookmark('a', saved, 3, true), /账号已切换/);
    storage.changeWordBookmark('b', {}, 9, true);
    storage.switchLearningAccount('a');
    assert.equal(storage.getWordBookmarks()['1'].saved, true);
    assert.equal(storage.getWordBookmarks()['9'], undefined);
    globalThis.localStorage.setItem = () => { throw new Error('QuotaExceededError'); };
    assert.throws(() => storage.changeWordBookmark('a', saved, 3, true), /QuotaExceededError/);
    assert.equal(storage.getWordBookmarks()['3'], undefined);
  } finally {
    if (previous === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = previous;
  }
});

test('authenticated bookmark sync round-trips, preserves old-client compatibility and prevents account leakage', async () => {
  const f = await createClassroomFixture();
  try {
    await f.addUser(1, 'student'); await f.addUser(2, 'student');
    const first = await f.api(1, '/progress', 'PUT', { progress: { preferences: { dailyNewWordTarget: 40, updatedAt: early, wordBookmarks: { '1': entry(true), '2': entry(true) } } } });
    assert.equal(first.status, 200);
    const second = await f.api(1, '/progress', 'PUT', { baseUpdatedAt: first.body.updatedAt, progress: { preferences: { wordBookmarks: { '1': entry(false, late) } } } });
    assert.equal(second.status, 200);
    // An old client omits bookmarks, and a stale device later resubmits its old snapshot.
    assert.equal((await f.api(1, '/progress', 'PUT', { progress: { learnedWords: [4] } })).status, 200);
    const stale = await f.api(1, '/progress', 'PUT', { baseUpdatedAt: first.body.updatedAt, progress: first.body.progress });
    assert.equal(stale.status, 200);
    const fresh = (await f.api(1, '/progress')).body.progress;
    assert.deepEqual(fresh.preferences.wordBookmarks, { '1': entry(false, late), '2': entry(true) });
    assert.equal(fresh.preferences.dailyNewWordTarget, 40);
    assert.equal((await f.api(2, '/progress')).body.progress.preferences.wordBookmarks, undefined);
    assert.equal((await f.api(2, '/progress', 'PUT', { progress: fresh }, { 'x-flashcards-user': '1' })).status, 409);
    assert.equal((await f.api(null, '/progress')).status, 401);
    await f.addUser(3, 'teacher');
    const classroom = (await f.api(3, '/classes', 'POST', { name: '收藏隔离测试班' })).body.classroom;
    await f.api(1, '/classes/join', 'POST', { inviteCode: classroom.inviteCode });
    const teacherView = await f.api(3, `/classes/${classroom.id}/students/1/progress`);
    assert.equal(teacherView.status, 200);
    assert.doesNotMatch(JSON.stringify(teacherView.body), /wordBookmarks/);
  } finally { f.sqlite.close(); }
});
