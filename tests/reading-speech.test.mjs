import test from 'node:test';
import assert from 'node:assert/strict';
import readings from '../src/data/readings.js';
import { buildReadingSentences } from '../src/utils/readingSentences.js';
import { createSentencePlayback } from '../src/utils/sentencePlayback.js';

for (const Segmenter of [Intl.Segmenter, null]) {
  test(`sentence splitting preserves all canonical text and stable IDs (${Segmenter ? 'Intl' : 'fallback'})`, () => {
    for (const article of readings) {
      const paragraphs = buildReadingSentences(article.content, Segmenter);
      const all = paragraphs.flatMap(p => p.sentences);
      assert(all.length > 1, `article ${article.id} must no longer read as a whole`);
      assert.deepEqual(all.map(s => s.ordinal), all.map((_, i) => i + 1));
      assert.equal(new Set(all.map(s => s.id)).size, all.length);
      for (const paragraph of paragraphs) assert.equal(paragraph.sentences.map(s => s.text).join(''), paragraph.text);
      assert.deepEqual(buildReadingSentences(article.content, Segmenter), paragraphs);
    }
  });
}

test('abbreviations, decimals, quotes, punctuation and CRLF paragraphs remain readable', () => {
  const text = 'Dr. Smith paid 3.50 dollars. "Really?" Yes!\r\n\r\nNo final punctuation';
  for (const Segmenter of [Intl.Segmenter, null]) {
    const paragraphs = buildReadingSentences(text, Segmenter);
    assert.equal(paragraphs.length, 2);
    assert.equal(paragraphs[0].sentences[0].text, 'Dr. Smith paid 3.50 dollars. ');
    assert.equal(paragraphs[0].sentences.map(s => s.text).join(''), paragraphs[0].text);
    assert.equal(paragraphs[1].sentences[0].text, 'No final punctuation');
  }
  assert.deepEqual(buildReadingSentences(' \n\n'), []);
});

function harness() {
  const calls = [], player = createSentencePlayback((text, options) => new Promise((resolve, reject) => {
    calls.push({ text, ...options, resolve, reject });
  }));
  return { player, calls };
}
const first = { id: 'p0-s0', text: 'First sentence.' }, second = { id: 'p0-s1', text: 'Second sentence.' };

test('one click plays only one sentence, native start updates state and completion never queues the next', async () => {
  const { player, calls } = harness(), changes = [];
  const unsubscribe = player.subscribe(() => changes.push(player.getSnapshot().status));
  const pending = player.toggle(first); assert.equal(player.getSnapshot().status, 'preparing');
  calls[0].onStart(); assert.equal(player.getSnapshot().status, 'playing');
  calls[0].resolve(); await pending;
  assert.equal(player.getSnapshot().status, 'idle'); assert.equal(calls.length, 1);
  assert.equal(calls[0].text, first.text); unsubscribe();
  assert.deepEqual(changes, ['preparing', 'playing', 'idle']);
});

test('same-sentence stop and fast switching ignore stale starts/completions', async () => {
  const { player, calls } = harness();
  const a = player.toggle(first); await player.toggle(first);
  assert.equal(calls[0].signal.aborted, true); assert.equal(player.getSnapshot().status, 'idle');
  const b = player.toggle(second); calls[0].onStart(); calls[0].resolve(); await a;
  assert.equal(player.getSnapshot().sentenceId, second.id);
  const c = player.toggle(first); calls[1].resolve(); await b;
  assert.equal(calls[1].signal.aborted, true); assert.equal(player.getSnapshot().sentenceId, first.id);
  calls[2].onStart(); calls[2].resolve(); await c;
  assert.equal(player.getSnapshot().status, 'idle');
});

test('leaving the view aborts owned speech and late failures cannot overwrite a later sentence', async () => {
  const { player, calls } = harness();
  const a = player.toggle(first); player.stop();
  assert.equal(calls[0].signal.aborted, true);
  const b = player.toggle(second); calls[0].reject(new Error('stale')); await a;
  assert.equal(player.getSnapshot().sentenceId, second.id);
  calls[1].reject(new Error('voice unavailable')); await b;
  assert.equal(player.getSnapshot().error, '这句暂时无法朗读，请重试。');
  const c = player.toggle(first); assert.equal(player.getSnapshot().error, '');
  calls[2].resolve({ cancelled: true }); await c;
  assert.equal(player.getSnapshot().status, 'idle');
});
