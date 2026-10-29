import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { beforeTeachingP1Review, beforeTeachingP2Review } from '../shared/vocabularyHistory.js';
import { correctedVocabularyAudioUrl } from '../shared/vocabularyAudio.js';
import { TEACHING_P1_VOCABULARY_AUDIO } from '../shared/teachingP1VocabularyAudio.js';
import { buildWordAssignment, gradeWordAssignment } from '../shared/wordAssignments.js';
import { buildHiddenSentence } from '../src/utils/assessmentRounds.js';
import { getCoreWordHints } from '../src/utils/wordHints.js';
import { createSpeechService } from '../src/utils/speechEngine.js';

const read = async path => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'));
// Assert this historical stage exactly; the later P2 stage has its own tests.
const vocabulary = beforeTeachingP2Review(await read('public/data/vocabulary.json'));
const register = await read('data/vocabulary-p1-repair/reviews-2026-10-29.json');
const audit = await read('data/vocabulary-teaching-audit/reviews-2026-10-29.json');
const manifest = await read('public/audio-updates/2026-10-29-p1/manifest.json');
const byId = new Map(vocabulary.map(word => [word.id, word]));
const hash = value => createHash('sha256').update(value).digest('hex');
const serialize = value => JSON.stringify(value, null, 2) + '\n';

test('the exact 124 P1 IDs retain order, identity, categories and all unrelated vocabulary bytes', () => {
  const targets = new Set(audit.issues.filter(issue => issue.priority === 'P1').map(issue => issue.id));
  assert.equal(targets.size, 124);
  assert.equal(register.reviews.length, 124);
  assert.deepEqual(new Set(register.reviews.map(review => review.id)), targets);
  assert.equal(register.reviews.flatMap(review => review.issueIds).length, 125);
  assert.equal(register.reviews.flatMap(review => review.alsoResolvedIssueIds).length, 2);
  assert.equal(vocabulary.length, 8699);
  assert.equal(new Set(vocabulary.map(word => word.id)).size, vocabulary.length);
  assert.equal(hash(serialize(beforeTeachingP1Review(vocabulary))), register.baselineSha256);
  assert.equal(hash(serialize(vocabulary)), register.afterSha256);
  assert.equal(register.baselineSha256, audit.inputSha256);
  for (const review of register.reviews) {
    assert.deepEqual(byId.get(review.id), review.after);
    for (const key of ['id', 'word', 'category', 'categories', 'level', 'list', 'ieltsList', 'ieltsLists']) {
      assert.deepEqual(review.before[key], review.after[key], `${review.id}: ${key}`);
    }
    assert(review.changedFields.every(field => ['pos', 'meaning', 'example', 'exampleCn', 'phonetic'].includes(field)));
    assert(getCoreWordHints(review.after).length, `${review.id}: existing curated notes remain available`);
  }
});

test('reviewed tags cover their teaching use and retain explicitly defined noun, verb and adjective senses', () => {
  const role = value => ({ a: 'adj', vt: 'v', vi: 'v', int: 'interj' }[value] || value);
  for (const { after } of register.reviews) {
    const defined = [...after.meaning.replaceAll('\\n', '\n').matchAll(/(?:^|[^a-z])(adj|adv|a|vt|vi|v|n|int|interj)\./g)].map(match => role(match[1]));
    const tagged = after.pos.match(/adj|adv|interj|\bn\b|\bv\b|pron|prep|aux|conj/g) || [];
    for (const pos of defined) assert(tagged.includes(pos), `${after.word}: missing ${pos}`);
  }
  for (const id of [5429,5442,5519,5564,5568,5569]) assert.match(byId.get(id).pos, /n\..*v\./);
  for (const id of [6006,6223,6361,6609,6710,7205,7744,7774,7871,7926,8115,8126,8232,8327,8610]) {
    assert.match(byId.get(id).pos, /adj\.\/n\./, `${id}: legitimate noun sense retained`);
  }
  assert.equal(byId.get(5824).pos, 'adj.');
  assert.equal(byId.get(8589).pos, 'interj.');
  assert.equal(byId.get(6109).pos, 'interj./n./v.');
  assert.match(byId.get(7577).meaning, /同性恋的.*较旧.*称呼他人时可能冒犯/);
  assert.match(byId.get(8146).meaning, /酷儿.*尊重本人用词/);
  assert.match(byId.get(6369).meaning, /宪法.*散步/);
  assert.match(byId.get(7871).meaning, /体谅.*交感神经的/);
  assert.equal(byId.get(5530).exampleCn, '雇工修好了栏杆。');
  assert.equal(byId.get(6567).exampleCn, '医学研究中令人鼓舞的进展。');
});

test('thirty reviewed English sentences remain fill-blank compatible and unchanged P2 examples are preserved', () => {
  const changed = register.reviews.filter(review => review.changedFields.includes('example'));
  assert.equal(changed.length, 30);
  assert.equal(register.reviews.filter(review => review.changedFields.includes('phonetic')).length, 1);
  for (const { after } of changed) {
    assert(buildHiddenSentence(after.example, after.word), `${after.word}: target remains present`);
    assert(/[.!?]$/.test(after.example));
    assert.doesNotMatch(after.example, /These news|Patry/);
    assert.match(after.exampleCn, /[\u4e00-\u9fff]/);
  }
  assert.equal(byId.get(6850).example, 'She felt depressed after hearing the news.');
  assert.equal(byId.get(7003).example, 'Please sign the printed form.');
  assert.equal(byId.get(5442).example, 'Old people.', 'independent P2 phrase work is not silently claimed complete');
  assert.equal(byId.get(6602).example, 'Gastric ulcer.', 'non-P1 ID is unchanged');
  assert.equal(byId.get(8017).phonetic, '/ˈlɜːnɪd/');
  assert.equal(byId.get(8017).example, 'He is a learned teacher.');
});

test('new assignments use revised meanings while saved snapshots retain their original labels and grading', () => {
  const oldWords = register.reviews.map(review => review.before);
  const oldAssignment = buildWordAssignment(oldWords);
  const answers = Object.fromEntries(oldAssignment.map(word => [word.id, word.answer]));
  assert.deepEqual(gradeWordAssignment(JSON.parse(JSON.stringify(oldAssignment)), answers), gradeWordAssignment(oldAssignment, answers));
  const newAssignment = buildWordAssignment(register.reviews.map(review => review.after));
  for (const review of register.reviews) {
    assert.equal(oldAssignment.find(word => word.id === String(review.id)).meaning, review.before.meaning);
    assert.equal(newAssignment.find(word => word.id === String(review.id)).meaning, review.after.meaning);
  }
});

test('all 124 recordings and mappings match exact text, voices and immutable local hashes when available', async () => {
  assert.equal(manifest.ready, true);
  assert.equal(manifest.expectedFiles, 124);
  assert.equal(manifest.files.length, 124);
  assert.equal(new Set(manifest.files.map(file => file.path)).size, 124);
  assert.equal(Object.values(TEACHING_P1_VOCABULARY_AUDIO).flatMap(Object.values).length, 31);
  for (const file of manifest.files) {
    const word = byId.get(file.id);
    assert.equal(file.text, word[file.field]);
    assert.equal(file.textSha256, hash(file.text));
    assert.equal(new URL(correctedVocabularyAudioUrl(word, file.field, file.voice)).pathname, file.path);
    assert(file.bytes > 1000 && file.seconds > 0.1 && file.seconds < 15);
    if (file.id === 8017) assert(file.phonemes.includes(file.voice.startsWith('b') ? 'lˈɜːnɪd' : 'lˈɜɹnɪd'));
    let bytes;
    try { bytes = await readFile(new URL(`../public${file.path}`, import.meta.url)); }
    catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    assert.equal(bytes.length, file.bytes);
    assert.equal(hash(bytes), file.sha256);
  }
  for (const review of register.reviews) for (const voice of manifest.voices) for (const field of ['word', 'example']) {
    const url = correctedVocabularyAudioUrl(review.after, field, voice);
    if (!review.audioFields.includes(field)) assert(!url?.includes('2026-10-29-p1'));
    else assert(url?.includes('2026-10-29-p1'));
    assert(!correctedVocabularyAudioUrl(review.before, field, voice)?.includes('2026-10-29-p1'), 'old snapshots cannot receive a new-sense recording');
  }
});

test('learned adjective audio cannot override the past-tense snapshot or incomplete/custom metadata', () => {
  const current = byId.get(8017), old = register.reviews.find(review => review.id === 8017).before;
  assert.equal(correctedVocabularyAudioUrl(old, 'word', 'af_bella'), null);
  assert.equal(correctedVocabularyAudioUrl({ id:8017, word:'learned' }, 'word', 'af_bella'), null);
  for (const patch of [{ pos:'v.' }, { meaning:'learn 的过去式' }, { phonetic:'/lɜːnd/' }, { word:'learn' }]) {
    assert.equal(correctedVocabularyAudioUrl({ ...current, ...patch }, 'word', 'af_bella'), null);
  }
  assert.equal(correctedVocabularyAudioUrl(current, 'word', '../bad'), null);
  for (const voice of manifest.voices) assert.match(correctedVocabularyAudioUrl(current, 'word', voice), /2026-10-29-p1/);
});

test('the real speech service selects every revised recording and uses revised text if that recording fails', async () => {
  for (const file of manifest.files) for (const fails of [false, true]) {
    const played = [], spoken = [];
    const service = createSpeechService({ correctedAudioUrl: correctedVocabularyAudioUrl,
      storage: { getTtsProvider:()=> 'kokoro', getSpeechRate:()=>1, getKokoroSpeed:()=>1,
        getKokoroVoice:()=>file.voice, getSelectedVoice:()=>'' },
      runtime: {
        Audio: class { pause() {} play() { played.push(this.src);
          if (fails) return Promise.reject(new Error('unavailable'));
          queueMicrotask(()=>this.onended?.()); return Promise.resolve(); } },
        SpeechSynthesisUtterance: class { constructor(text) { this.text = text; } },
        speechSynthesis: { getVoices:()=>[{name:'English',lang:'en-US'}], cancel(){},
          speak(utterance){spoken.push(utterance.text);queueMicrotask(()=>{utterance.onstart?.();utterance.onend?.();});} },
      } });
    await service[file.field === 'word' ? 'speakWord' : 'speakExample'](byId.get(file.id));
    assert.deepEqual(played.map(url=>new URL(url).pathname), [file.path]);
    assert.deepEqual(spoken, fails ? [file.text] : []);
  }
});
