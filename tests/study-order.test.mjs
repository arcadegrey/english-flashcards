import test from 'node:test'
import assert from 'node:assert/strict'
import { createStudyWordOrder } from '../src/utils/studyOrder.js'

test('study order preserves every original record, duplicates and frozen inputs', () => {
  const words = Object.freeze([Object.freeze({ id: 1 }), Object.freeze({ id: '1' }), Object.freeze({ id: 2 })])
  const order = createStudyWordOrder(words, undefined, () => 0.75)
  assert.notEqual(order, words)
  assert.equal(order.length, words.length)
  assert.deepEqual(new Set(order), new Set(words))
  assert.deepEqual(words.map(word => word.id), [1, '1', 2])
  assert.deepEqual(createStudyWordOrder([], 1), [])
  assert.strictEqual(createStudyWordOrder([words[0]])[0], words[0])
})

test('an explicitly requested word stays first while the rest shuffle without dropping records', () => {
  const words = Object.freeze([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
  for (const random of [() => 0, () => 0.5, () => 0.99999]) {
    const order = createStudyWordOrder(words, '3', random)
    assert.strictEqual(order[0], words[2])
    assert.deepEqual(new Set(order), new Set(words))
    assert.deepEqual(new Set(createStudyWordOrder(words, 'missing', random)), new Set(words))
  }
})

test('equal-sized random intervals yield all six three-word permutations with equal frequency', () => {
  const words = [{ id: 1 }, { id: 2 }, { id: 3 }], counts = new Map()
  for (let first = 0; first < 3; first++) for (let second = 0; second < 2; second++) {
    const draws = [(first + 0.5) / 3, (second + 0.5) / 2, 0.5]
    const key = createStudyWordOrder(words, null, () => draws.shift()).map(word => word.id).join(',')
    counts.set(key, (counts.get(key) || 0) + 1)
  }
  assert.equal(counts.size, 6)
  assert.deepEqual([...counts.values()], [1, 1, 1, 1, 1, 1])
})
