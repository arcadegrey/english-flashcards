import { beforeQualityReview, beforeFollowupReview } from './helpers/vocabulary-history.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { vocabularyNoteKey, matchesVocabularyQuery, distinctVocabularyWords } from '../shared/vocabularyAliases.js';
import { getCoreWordHints } from '../src/utils/wordHints.js';
import { buildWordLookup, resolveVocabularyWord } from '../src/utils/readingText.js';
import { parseVocabularyCsv } from '../src/utils/csvImport.js';
import { buildWordAssignment, gradeWordAssignment } from '../shared/wordAssignments.js';
import { createExamAttempt } from '../shared/examAttempts.js';
import { correctedVocabularyAudioUrl } from '../shared/vocabularyAudio.js';
import { FOLLOWUP_VOCABULARY_AUDIO } from '../shared/followupVocabularyAudio.js';
import { RETIRED_VOCABULARY } from '../shared/retiredVocabulary.js';
import { summarizeVocabularyWord } from '../src/data/vocabularySummary.js';

const root = new URL('../', import.meta.url);
const readJson = async path => JSON.parse(await readFile(new URL(path, root), 'utf8'));
const vocabulary = await readJson('public/data/vocabulary.json');
const register = await readJson('data/vocabulary-audit-reviews.json');
const referenceVocabulary = [...vocabulary, ...RETIRED_VOCABULARY];
const byId = new Map(referenceVocabulary.map(word => [word.id, word]));

test('the 33 repairs remain intact in active or historical data; their original baseline is recoverable', () => {
  assert.equal(register.reviews.length, 33);
  assert.equal(new Set(register.reviews.map(item => item.id)).size, 33);
  assert.equal(vocabulary.length, 8699);
  assert.equal(byId.size, 8699 + RETIRED_VOCABULARY.length);
  const restored = new Map();
  for (const review of register.reviews) {
    assert.equal(review.status, 'resolved');
    assert.deepEqual(beforeFollowupReview([byId.get(review.id)])[0], review.after);
    assert.notDeepEqual(review.before, review.after);
    for (const key of ['id', 'category', 'categories', 'level', 'list', 'ieltsList', 'ieltsLists']) {
      assert.deepEqual(review.before[key], review.after[key], `${review.word} ${key}`);
    }
    restored.set(review.id, review.before);
  }
  const original = JSON.stringify(beforeQualityReview(referenceVocabulary).filter(word => word.id <= 8699).sort((a, b) => a.id - b.id).map(word => restored.get(word.id) || word), null, 2) + '\n';
  assert.equal(createHash('sha256').update(original).digest('hex'), register.baselineSha256);
});

test('all shipped shards and the server assignment catalog match the corrected source', async () => {
  async function visit(path) {
    for (const entry of await readdir(new URL(path, root), { withFileTypes: true })) {
      const child = `${path}/${entry.name}`;
      if (entry.isDirectory()) await visit(child);
      else if (entry.name.endsWith('.json')) {
        const data = await readJson(child);
        if (Array.isArray(data)) for (const word of data) {
          const source = byId.get(word.id);
          assert(source, `${child}: unknown word ${word.id}`);
          const expected = child.startsWith('public/data/vocabulary/catalog/') ? summarizeVocabularyWord(source)
            : child.startsWith('public/data/vocabulary/details/')
              ? { id: source.id, word: source.word, example: source.example, exampleCn: source.exampleCn }
              : source;
          assert.deepEqual(word, expected, child);
        }
      }
    }
  }
  await visit('public/data/vocabulary');
  const catalog = await readJson('worker/data/assignment-vocabulary.json');
  assert.equal(catalog.length, vocabulary.length);
  for (const word of catalog) {
    assert.equal(word.word, byId.get(word.id).word);
    assert.equal(word.meaning, byId.get(word.id).meaning);
  }
});

test('legacy spelling lookup and imports retain the corrected IDs and both sets of learning notes', () => {
  for (const [id, sibling, old, canonical] of [[1234, 4293, 'sepectator', 'spectator'], [3318, 7977, 'precauition', 'precaution']]) {
    const word = byId.get(id);
    assert.equal(word.word, canonical);
    assert.equal(byId.get(sibling).word, canonical);
    assert(matchesVocabularyQuery(word, old));
    assert(matchesVocabularyQuery(word, canonical));
    assert.equal(vocabularyNoteKey(word), old);
    assert.equal(vocabularyNoteKey(byId.get(sibling)), canonical);
    assert(getCoreWordHints(word).length);
    assert(getCoreWordHints({ word: old }).length);
    assert(getCoreWordHints(byId.get(sibling)).length);
    assert.equal(resolveVocabularyWord(old, buildWordLookup([word])).id, id);
    assert.equal(resolveVocabularyWord(canonical, buildWordLookup([{ ...word, word: old }])).id, id);
    const imported = parseVocabularyCsv({ csvText: `word,meaning\n${old},旧词\n${canonical},新词`, existingWords: [word], validCategoryIds: ['daily'] });
    assert.equal(imported.importedWords.length, 0);
    assert.equal(imported.summary.skippedDuplicate, 2);
  }
});

test('same-headword records never become competing options; old assignment snapshots keep their answers', () => {
  const pair = [byId.get(1234), byId.get(4293)];
  assert.equal(distinctVocabularyWords(pair).length, 1);
  assert.equal(distinctVocabularyWords(pair, [pair[0]]).length, 0);
  assert.equal(distinctVocabularyWords(pair.toReversed())[0].id, pair[1].id);
  const words = [...pair, ...vocabulary.slice(0, 4)];
  const assignment = buildWordAssignment(words);
  assert(!assignment[0].options.some(option => option.label === pair[1].meaning));
  assert(!assignment[1].options.some(option => option.label === pair[0].meaning));
  const oldWord = register.reviews.find(item => item.id === 1234).before;
  const oldAssignment = buildWordAssignment([oldWord, ...vocabulary.slice(0, 4)]);
  const answers = Object.fromEntries(oldAssignment.map(word => [word.id, word.answer]));
  const beforeGrade = gradeWordAssignment(oldAssignment, answers);
  assert.deepEqual(gradeWordAssignment(JSON.parse(JSON.stringify(oldAssignment)), answers), beforeGrade);
  assert.equal(oldAssignment[0].word, 'sepectator');
});

test('new spelling practice requires corrected spelling and local historical snapshots remain readable', () => {
  const word = byId.get(1234);
  const base = { id: 'repair-test', mode: 'spelling', category: 'all', scope: 'all', startedAt: '2026-10-23T00:00:00Z', completedAt: '2026-10-23T00:01:00Z' };
  const answer = { wordId: String(word.id), word: word.word, meaning: word.meaning };
  assert.equal(createExamAttempt({ ...base, answers: [{ ...answer, input: 'spectator' }] }, [word]).questionsCorrect, 1);
  assert.equal(createExamAttempt({ ...base, answers: [{ ...answer, input: 'sepectator' }] }, [word]).questionsCorrect, 0);
  assert.equal(createExamAttempt({ ...base, answers: [{ ...answer, word: 'sepectator', input: 'sepectator' }] }).questionsCorrect, 1);
});

test('every changed R2 recording has four versioned manifest entries and matching local hashes when present', async () => {
  const manifest = await readJson('public/audio-updates/2026-10-24/manifest.json');
  assert.equal(manifest.files.length, 60);
  assert.equal(new Set(manifest.files.map(file => file.path)).size, 60);
  for (const review of register.reviews) {
    for (const field of ['word', 'example']) {
      const changed = review.before[field] !== review.after[field]
        || (field === 'word' && ['les', 'sara'].includes(review.after.word));
      for (const voice of manifest.voices) {
        const url = correctedVocabularyAudioUrl(review.after, field, voice);
        if (!changed) {
          if (FOLLOWUP_VOCABULARY_AUDIO[review.id]?.[field]) assert.match(url, /2026-10-25-followup/);
          else assert.equal(url, null);
          continue;
        }
        const entry = manifest.files.find(file => file.path === new URL(url).pathname);
        assert(entry, `${review.word} ${field} ${voice}`);
        assert.equal(entry.text, review.after[field]);
        assert.equal(entry.textSha256, createHash('sha256').update(review.after[field]).digest('hex'));
        assert.match(entry.sha256, /^[a-f0-9]{64}$/);
        assert(entry.bytes > 1000);
        assert(entry.seconds > 0.1 && entry.seconds < 30);
        if (review.before[field] !== review.after[field]) assert.equal(correctedVocabularyAudioUrl(review.before, field, voice), null);
        let bytes;
        try { bytes = await readFile(new URL(`public${entry.path}`, root)); }
        catch (error) { if (error.code === 'ENOENT') continue; throw error; }
        assert.equal(bytes.length, entry.bytes);
        assert(bytes.length > 1000);
        assert(entry.seconds > 0.1 && entry.seconds < 30);
        assert.equal(createHash('sha256').update(bytes).digest('hex'), entry.sha256);
      }
    }
  }
  assert.equal(correctedVocabularyAudioUrl(byId.get(1234), 'word', '../../bad'), null);
  assert.equal(correctedVocabularyAudioUrl({ ...byId.get(1234), word: 'custom content' }, 'word', 'af_bella'), null);
});
