import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { beforeSingleExampleReview, beforeMultiSenseReview } from '../shared/vocabularyHistory.js';
import { correctedVocabularyAudioUrl } from '../shared/vocabularyAudio.js';
import { createVocabularyDelivery } from '../src/data/vocabularyDelivery.js';
import { applyWordDetails, getWordExamples, summarizeVocabularyWord, validWordExamples } from '../src/data/vocabularySummary.js';
import { buildHiddenSentence } from '../src/utils/assessmentRounds.js';
import { createSpeechService } from '../src/utils/speechEngine.js';

const read = async path => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'));
const hash = value => createHash('sha256').update(value).digest('hex');
const serialize = value => JSON.stringify(value, null, 2) + '\n';
const words = beforeMultiSenseReview(await read('public/data/vocabulary.json'));
const register = await read('data/vocabulary-single-example/reviews-2026-10-31.json');
const review = register.reviews[0], single = words.find(word => word.id === 5747);

test('single gains three short labelled senses while all other entries and word identity remain unchanged', () => {
  assert.equal(words.length, 8749);
  assert.equal(hash(serialize(words)), register.afterSha256);
  assert.equal(hash(serialize(beforeSingleExampleReview(words))), register.baselineSha256);
  assert.deepEqual(single, review.after);
  assert.deepEqual(Object.keys(single).filter(key => !['example', 'exampleCn', 'examples'].includes(key))
    .map(key => [key, single[key]]), Object.keys(review.before).filter(key => !['example', 'exampleCn', 'examples'].includes(key))
    .map(key => [key, review.before[key]]));
  assert.deepEqual(getWordExamples(single).map(example => example.sense), ['单身的', '单个的；仅一个', '单程的（英式用法）']);
  assert.equal(single.example, 'She is single.');
  for (const example of getWordExamples(single)) {
    assert(example.en.split(/\s+/).length <= 5);
    assert(buildHiddenSentence(example.en, single.word));
    assert.match(example.en, /[.!?]$/); assert.match(example.zh, /[。！？]$/);
  }
});

test('sense examples stay deferred until the detail request and reconstruct the complete current record', async () => {
  const requests = [], index = await read('src/data/vocabularyIndex.json');
  const loader = createVocabularyDelivery({ index, fetchJson: async path => { requests.push(path); return read(`public${path}`); } });
  const [summary] = await loader.loadCatalogIds([single.id]);
  assert.equal(Object.hasOwn(summary, 'examples'), false);
  assert.equal(Object.hasOwn(summary, 'example'), false);
  const details = await loader.loadDetails(summary);
  assert.deepEqual(details.examples, single.examples);
  assert.deepEqual(applyWordDetails(summary, details), single);
  assert(requests.some(path => path.includes('/details/')));
  assert.deepEqual((await read('public/data/vocabulary/core.json')).find(word => word.id === single.id), single);
});

test('malformed, duplicate or mismatched sense lists cannot populate public details; legacy and custom snapshots retain their own text', async () => {
  const summary = summarizeVocabularyWord(single);
  for (const examples of [[], [{ en: 'Missing sense.', zh: '缺义项。' }], [single.examples[1]],
    [single.examples[0], single.examples[0]], [{ ...single.examples[0], zh: 123 }]]) {
    const invalid = { ...single, examples };
    assert.equal(validWordExamples(invalid), false);
    assert.throws(() => applyWordDetails(summary, invalid), /不匹配/);
    assert.deepEqual(getWordExamples(invalid), [{ en: single.example, zh: single.exampleCn }]);
  }
  const custom = { ...review.before, example: 'My single question.', exampleCn: '我的唯一问题。' };
  const index = await read('src/data/vocabularyIndex.json');
  const loader = createVocabularyDelivery({ index, fetchJson: () => assert.fail('inline snapshots must not fetch canonical details') });
  assert.strictEqual(await loader.loadDetails(custom), custom);
  assert.strictEqual(await loader.loadDetails(review.before), review.before);
  assert.deepEqual(getWordExamples(review.before), [{ en: review.before.example, zh: review.before.exampleCn }]);
});

test('each sense selects its own four-voice immutable recording and historical snapshots keep their original URLs', async () => {
  const manifest = await read('public/audio-updates/2026-10-31-single-example/manifest.json');
  assert.equal(manifest.ready, true); assert.equal(manifest.files.length, 12); assert.equal(manifest.expectedFiles, 12);
  assert.equal(new Set(manifest.files.map(file => file.path)).size, 12);
  for (const example of single.examples) for (const voice of manifest.voices) {
    const file = manifest.files.find(file => file.text === example.en && file.voice === voice);
    assert(file); assert.equal(file.textSha256, hash(example.en));
    const target = { ...single, example: example.en, exampleCn: example.zh };
    assert.equal(new URL(correctedVocabularyAudioUrl(target, 'example', voice)).pathname, file.path);
    assert.equal(correctedVocabularyAudioUrl(review.before, 'example', voice), null);
    assert.equal(correctedVocabularyAudioUrl({ ...target, example: 'Different saved text.' }, 'example', voice), null);
    assert.equal(correctedVocabularyAudioUrl(target, 'word', voice), correctedVocabularyAudioUrl(review.before, 'word', voice));
    const bytes = await readFile(new URL(`../public${file.path}`, import.meta.url)).catch(error => {
      if (error.code === 'ENOENT') return null; throw error;
    });
    if (bytes) { assert.equal(hash(bytes), file.sha256); assert.equal(bytes.length, file.bytes); }
  }
});

test('each sense plays the selected recording and ordinary playback failures fall back to that exact sentence', async () => {
  for (const example of single.examples) for (const failure of [false, true]) {
    const played = [], spoken = [];
    const service = createSpeechService({ correctedAudioUrl: correctedVocabularyAudioUrl,
      storage: { getTtsProvider: () => 'kokoro', getSpeechRate: () => 1, getKokoroSpeed: () => 1, getKokoroVoice: () => 'af_bella', getSelectedVoice: () => '' },
      runtime: {
        Audio: class { pause() {} play() { played.push(this.src); if (failure) return Promise.reject(new Error('offline')); queueMicrotask(() => this.onended?.()); return Promise.resolve(); } },
        SpeechSynthesisUtterance: class { constructor(text) { this.text = text; } },
        speechSynthesis: { getVoices: () => [{ name: 'English', lang: 'en-US' }], cancel() {}, speak(utterance) { spoken.push(utterance.text); queueMicrotask(() => { utterance.onstart?.(); utterance.onend?.(); }); } },
      },
    });
    await service.speakExample({ ...single, example: example.en, exampleCn: example.zh });
    assert.equal(played.length, 1); assert.deepEqual(spoken, failure ? [example.en] : []);
  }
});
