import test from 'node:test'
import assert from 'node:assert/strict'
import { RETIRED_VOCABULARY } from '../shared/retiredVocabulary.js'
import { RETIRED_VOCABULARY_IDS, isRetiredVocabularyId, activeProgressIds } from '../shared/retiredVocabularyIds.js'
import { resolveCollectionWords } from '../src/utils/collectionVocabulary.js'

test('lightweight retirement membership exactly matches all historical records', () => {
  assert.deepEqual(RETIRED_VOCABULARY_IDS, RETIRED_VOCABULARY.map(word => word.id))
  assert.equal(new Set(RETIRED_VOCABULARY_IDS).size, 327)
  for (const word of RETIRED_VOCABULARY) {
    assert.equal(isRetiredVocabularyId(word.id), true)
    assert.equal(isRetiredVocabularyId(String(word.id)), true)
  }
  assert.deepEqual(activeProgressIds([2735, '2735', 9026, 'custom-one']), [9026, 'custom-one'])
})

test('historical collections retain every archived record, input order and active/custom precedence', () => {
  const ids = RETIRED_VOCABULARY.map(word => String(word.id)).reverse()
  const custom = { id: 'custom-one', word: 'custom', example: 'Own example.' }
  const current = { id: RETIRED_VOCABULARY[0].id, word: 'current override' }
  const active = Object.freeze([custom, current])
  const requested = Object.freeze(['custom-one', ...ids, 'missing-id'])
  const result = resolveCollectionWords(active, requested, RETIRED_VOCABULARY)
  assert.equal(result.length, 328)
  assert.equal(result[0], custom)
  assert.equal(result.at(-1), current)
  for (const original of RETIRED_VOCABULARY.slice(1)) assert.equal(result.find(word => word.id === original.id), original)
  assert.equal(resolveCollectionWords(active, undefined, RETIRED_VOCABULARY), active)
})
