import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { beforeUserFeedbackReview } from '../shared/vocabularyHistory.js';
import { correctedVocabularyAudioUrl } from '../shared/vocabularyAudio.js';
import { createSpeechService } from '../src/utils/speechEngine.js';
import { buildWordAssignment, gradeWordAssignment } from '../shared/wordAssignments.js';
import { buildHiddenSentence } from '../src/utils/assessmentRounds.js';
import { getCoreWordHints } from '../src/utils/wordHints.js';

const read = async path => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'));
const vocabulary = await read('public/data/vocabulary.json');
const register = await read('data/vocabulary-feedback/reviews-2026-10-29.json');
const byId = new Map(vocabulary.map(word => [word.id, word]));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

test('four reported entries preserve every ID, category, position and unrelated vocabulary record', () => {
  assert.deepEqual(register.reviews.map(review => review.id), [6508, 6718, 6919, 7580]);
  assert.equal(vocabulary.length, 8699);
  assert.equal(new Set(vocabulary.map(word => word.id)).size, 8699);
  assert.equal(hash(JSON.stringify(beforeUserFeedbackReview(vocabulary), null, 2) + '\n'), register.baselineSha256);
  for (const review of register.reviews) {
    assert.deepEqual(byId.get(review.id), review.after);
    for (const key of ['id', 'word', 'category', 'categories', 'level', 'list', 'ieltsList', 'ieltsLists']) {
      assert.deepEqual(review.after[key], review.before[key], `${review.id}: ${key}`);
    }
    assert(review.sources.length && review.sources.every(source => source.url.startsWith('https://') && source.fact));
    assert.equal(getCoreWordHints(review.after).length, getCoreWordHints(review.before).length);
    assert(getCoreWordHints(review.after).length > 0);
  }
});

test('default senses, teenage IPA and complete examples agree with the reported teaching goals', () => {
  assert.equal(byId.get(6508).pos, 'adj.');
  assert.equal(byId.get(6508).meaning, 'adj. 有天赋的；有才华的');
  assert.equal(byId.get(6718).phonetic, '/ˈtiːneɪdʒ/');
  assert.equal(byId.get(6919).meaning, 'n. 溃疡');
  assert.match(byId.get(7580).meaning, /王国.*领域.*界/);
  const expected = [
    [6508, 'My sister is a gifted singer.', '我姐姐是一位有天赋的歌手。'],
    [6718, 'My teenage brother plays basketball after school.', '我十几岁的弟弟放学后打篮球。'],
    [6919, 'She has a mouth ulcer.', '她得了口腔溃疡。'],
    [7580, 'The king ruled a small kingdom.', '这位国王统治着一个小王国。'],
  ];
  for (const [id, en, zh] of expected) {
    const word = byId.get(id);
    assert.equal(word.example, en);
    assert.equal(word.exampleCn, zh);
    assert(buildHiddenSentence(word.example, word.word), 'new sentence remains usable for fill-blank');
  }
});

test('old assignment snapshots retain original labels and grading while new assignments use reviewed meanings', () => {
  const oldWords = register.reviews.map(review => review.before);
  const oldAssignment = buildWordAssignment([...oldWords, ...vocabulary.slice(0, 4)]);
  const answers = Object.fromEntries(oldAssignment.map(item => [item.id, item.answer]));
  assert.deepEqual(gradeWordAssignment(JSON.parse(JSON.stringify(oldAssignment)), answers), gradeWordAssignment(oldAssignment, answers));
  const newAssignment = buildWordAssignment([...register.reviews.map(review => review.after), ...vocabulary.slice(0, 4)]);
  assert.equal(oldAssignment[0].meaning, register.reviews[0].before.meaning);
  assert.equal(newAssignment[0].meaning, register.reviews[0].after.meaning);
});

test('all twenty immutable recordings match reviewed text and exact snapshot/voice guards', async () => {
  const manifest = await read('public/audio-updates/2026-10-29-feedback/manifest.json');
  assert.equal(manifest.ready, true);
  assert.equal(manifest.expectedFiles, 20);
  assert.equal(manifest.files.length, 20);
  assert.equal(new Set(manifest.files.map(file => file.path)).size, 20);
  for (const file of manifest.files) {
    const word = byId.get(file.id);
    assert.equal(file.text, word[file.field]);
    assert.equal(file.textSha256, hash(file.text));
    assert.equal(new URL(correctedVocabularyAudioUrl(word, file.field, file.voice)).pathname, file.path);
    assert(file.bytes > 1000 && file.seconds > 0.1 && file.seconds < 15);
    if (file.id === 6718) {
      assert.match(file.phonemes, /Aʤ/);
      assert(file.phonemes.includes(file.voice.startsWith('b') ? 'tˈiːnAʤ' : 'tˈinˌAʤ'));
    }
    let bytes;
    try { bytes = await readFile(new URL(`../public${file.path}`, import.meta.url)); }
    catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    assert.equal(bytes.length, file.bytes);
    assert.equal(hash(bytes), file.sha256);
  }
  for (const { before, after } of register.reviews) for (const voice of manifest.voices) {
    assert.equal(correctedVocabularyAudioUrl(before, 'example', voice), null, 'old example must not select new recording');
    assert.match(correctedVocabularyAudioUrl(after, 'example', voice), /2026-10-29-feedback/);
    if (after.id !== 6718) assert.equal(correctedVocabularyAudioUrl(after, 'word', voice), null);
  }
  assert.equal(correctedVocabularyAudioUrl(byId.get(6718), 'word', '../bad'), null);
  assert.equal(correctedVocabularyAudioUrl({ ...byId.get(6718), word: 'custom' }, 'word', 'af_bella'), null);
});

test('speech service plays the new exact recording for every voice and falls back to the revised text on failure', async () => {
  const manifest = await read('public/audio-updates/2026-10-29-feedback/manifest.json');
  for (const file of manifest.files) {
    for (const fails of [false, true]) {
      const sources = [], spoken = [];
      const service = createSpeechService({ correctedAudioUrl: correctedVocabularyAudioUrl,
        storage: { getTtsProvider: () => 'kokoro', getSpeechRate: () => 1, getKokoroSpeed: () => 1,
          getKokoroVoice: () => file.voice, getSelectedVoice: () => '' },
        runtime: {
          Audio: class {
            pause() {}
            play() {
              sources.push(this.src);
              if (fails) return Promise.reject(new Error('unavailable'));
              queueMicrotask(() => this.onended?.());
              return Promise.resolve();
            }
          },
          SpeechSynthesisUtterance: class { constructor(text) { this.text = text; } },
          speechSynthesis: { getVoices: () => [{ name: 'English', lang: 'en-US' }], cancel() {},
            speak(utterance) { spoken.push(utterance.text); queueMicrotask(() => { utterance.onstart?.(); utterance.onend?.(); }); } },
        },
      });
      await service[file.field === 'word' ? 'speakWord' : 'speakExample'](byId.get(file.id));
      assert.deepEqual(sources.map(source => new URL(source).pathname), [file.path]);
      assert.deepEqual(spoken, fails ? [file.text] : []);
    }
  }
});
