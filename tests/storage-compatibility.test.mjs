import assert from 'node:assert/strict';
import test from 'node:test';
import { storage, WORD_BOOKMARKS_STORAGE_KEY } from '../src/utils/storage.js';

function localStore(t) {
  const values = new Map();
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, writable: true, value: {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key),
  } });
  t.after(() => {
    if (previous) Object.defineProperty(globalThis, 'localStorage', previous);
    else delete globalThis.localStorage;
  });
  return values;
}

test('switching accounts and clearing learning preserve device preferences and the signed-in session', t => {
  localStore(t);
  storage.setTheme('dark'); storage.setSelectedVoice('Saved English Voice');
  storage.setTtsProvider('browser'); storage.setKokoroVoice('bf_emma');
  storage.setKokoroEndpoint('https://legacy.example.test');
  storage.setKokoroSpeed(1.25); storage.setSpeechRate(0.75);
  storage.switchLearningAccount('one'); storage.setAuthSession({ user: { id: 'one' } });
  storage.setLearnedWords([1]); storage.setWordProgress({ 1: { reps: 2 } });
  storage.setCustomWords([{ id: 'custom', word: 'original' }]);
  storage.changeWordBookmark('one', {}, 1, true);
  storage.setDailyNewWordTarget(40); storage.setStudyPlanCategory('ielts');
  storage.clear();
  assert.deepEqual(storage.getLearnedWords(), []);
  assert.deepEqual(storage.getWordProgress(), {});
  assert.equal(storage.getCustomWords()[0].word, 'original');
  assert.equal(storage.getWordBookmarks()['1'].saved, true);
  assert.equal(storage.getDailyNewWordTarget(), 40);
  assert.equal(storage.getStudyPlanCategory(), 'ielts');
  assert.equal(storage.getAuthSession().user.id, 'one');
  storage.switchLearningAccount('two');
  assert.equal(storage.getTheme(), 'dark');
  assert.equal(storage.hasThemePreference(), true);
  assert.equal(storage.getSelectedVoice(), 'Saved English Voice');
  assert.equal(storage.getTtsProvider(), 'browser');
  assert.equal(storage.getKokoroVoice(), 'bf_emma');
  assert.equal(storage.getKokoroEndpoint(), 'https://legacy.example.test');
  assert.equal(storage.getKokoroSpeed(), 1.25);
  assert.equal(storage.getSpeechRate(), 0.75);
  assert.equal(storage.getDailyNewWordTarget(), 15);
  assert.deepEqual(storage.getWordBookmarks(), {});
});

test('legacy account ownership and latest in-flight progress restore without leaking into another account', t => {
  const values = localStore(t);
  storage.setAuthSession({ user: { id: 'legacy' } });
  storage.setLearnedWords([4]);
  assert.equal(storage.getLearningOwner(), 'legacy');
  storage.switchLearningAccount('other', { learnedWords: [4, 5], wrongWords: [5] });
  assert.deepEqual(storage.getLearnedWords(), []);
  assert.deepEqual(storage.getWrongWords(), []);
  const restored = storage.switchLearningAccount('legacy');
  assert.deepEqual(restored.learnedWords, [4, 5]);
  assert.deepEqual(restored.wrongWords, [5]);
  assert.equal(values.get('flashcards_progress_owner'), 'legacy');
  assert.deepEqual(JSON.parse(values.get('flashcards_account_progress:other')).learnedWords, []);
  storage.setAuthSession(null);
  assert.equal(storage.getAuthSession(), null);
});

test('malformed legacy archives reset only the selected account to compatible defaults', t => {
  const values = localStore(t);
  storage.switchLearningAccount('one'); storage.setLearnedWords([12]);
  for (const broken of ['not json', '[]', 'null']) {
    values.set('flashcards_account_progress:broken', broken);
    const restored = storage.switchLearningAccount('broken');
    assert.deepEqual(restored.learnedWords, []);
    assert.deepEqual(restored.preferences, { dailyNewWordTarget: 15, studyPlanCategory: 'all', updatedAt: '' });
    assert.deepEqual(storage.switchLearningAccount('one').learnedWords, [12]);
  }
});

test('a failed account archive stops before replacing the active learning cache', t => {
  const values = localStore(t);
  storage.switchLearningAccount('one'); storage.setLearnedWords([22]);
  const before = Object.fromEntries(values);
  t.mock.method(localStorage, 'setItem', () => { throw new Error('QuotaExceededError'); });
  assert.throws(() => storage.switchLearningAccount('two'), /QuotaExceededError/);
  assert.deepEqual(Object.fromEntries(values), before);
  assert.equal(storage.getLearningOwner(), 'one');
  assert.deepEqual(storage.getLearnedWords(), [22]);
});

test('storage denial retains legacy defaults and preserves explicit bookmark failure reporting', t => {
  localStore(t);
  t.mock.method(console, 'error', () => {});
  t.mock.method(localStorage, 'getItem', () => { throw new Error('SecurityError'); });
  t.mock.method(localStorage, 'setItem', () => { throw new Error('SecurityError'); });
  assert.equal(storage.getTheme(), null);
  assert.equal(storage.hasThemePreference(), false);
  assert.equal(storage.getTtsProvider(), 'kokoro');
  assert.equal(storage.getKokoroVoice(), 'af_bella');
  assert.equal(storage.getSpeechRate(), 1);
  assert.equal(storage.getDailyNewWordTarget(), 15);
  assert.equal(storage.getStudyPlanCategory(), 'all');
  assert.deepEqual(storage.getLearnedWords(), []);
  assert.deepEqual(storage.getWordProgress(), {});
  assert.deepEqual(storage.getWordBookmarks(), {});
  assert.doesNotThrow(() => storage.setLearnedWords([1]));
  assert.doesNotThrow(() => storage.setTheme('dark'));
  assert.throws(() => storage.setWordBookmarks({}), /SecurityError/);
  assert.equal(WORD_BOOKMARKS_STORAGE_KEY, 'flashcards_word_bookmarks');
});
