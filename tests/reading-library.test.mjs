import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareReadingContent, indexReadingVocabulary, applyReadingProgress } from '../src/utils/readingLibrary.js';
import { buildWordLookup } from '../src/utils/readingText.js';

test('recognition updates reuse indexed vocabulary without re-tokenizing or mutating article content', () => {
  const article = { id: 1, content: 'Books and books. We read.', title: 'Books', questions: [{ id: 'q1' }] };
  const prepared = prepareReadingContent([article]);
  const indexed = indexReadingVocabulary(prepared, buildWordLookup([{ id: 10, word: 'book' }, { id: 11, word: 'read' }]));
  const first = applyReadingProgress(indexed, new Set());
  const second = applyReadingProgress(indexed, new Set(['10']));
  assert.equal(first[0].trackedWordCount, 2); assert.equal(first[0].unmasteredCount, 2);
  assert.equal(second[0].unmasteredCount, 1);
  assert.equal(second[0].questions, article.questions);
  assert.equal(second[0].content, article.content);
  assert.equal(prepared[0].tokens.length, 5);
  assert.equal(indexed[0].trackedIds.length, 2);
});

test('new vocabulary shards can re-index existing content and empty articles keep one-minute estimate', () => {
  const prepared = prepareReadingContent([{ id: 1, content: 'We read books.' }, { id: 2, content: '' }]);
  const empty = applyReadingProgress(indexReadingVocabulary(prepared, new Map()), new Set());
  assert.equal(empty[0].trackedWordCount, 0);
  const loaded = applyReadingProgress(indexReadingVocabulary(prepared, buildWordLookup([{ id: 1, word: 'book' }])), new Set());
  assert.equal(loaded[0].trackedWordCount, 1);
  assert.equal(loaded[1].estimatedMinutes, 1);
  assert.equal(loaded[1].unmasteredCount, 0);
});
