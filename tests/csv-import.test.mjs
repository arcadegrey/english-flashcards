import assert from 'node:assert/strict'
import test from 'node:test'
import { parseVocabularyCsv } from '../src/utils/csvImport.js'

const validCategoryIds = ['daily', 'cet4', 'toefl']

test('parseVocabularyCsv skips duplicates and invalid rows', () => {
  const csvText = [
    'word,meaning,category',
    'Known,旧词,cet4',
    'Fresh,新词,cet4',
    ',缺少单词,cet4',
    'NoMeaning,,cet4',
    'Fresh,重复导入,cet4',
  ].join('\n')

  const { importedWords, summary } = parseVocabularyCsv({
    csvText,
    existingWords: [{ id: 7, word: 'known', meaning: 'exists' }],
    validCategoryIds,
  })

  assert.equal(summary.importedCount, 1)
  assert.equal(summary.skippedDuplicate, 2)
  assert.equal(summary.skippedInvalid, 2)
  assert.equal(importedWords[0].id, 8)
  assert.equal(importedWords[0].word, 'Fresh')
})

test('parseVocabularyCsv normalizes TOEFL level and list only for TOEFL words', () => {
  const csvText = [
    'word,meaning,category,level,list',
    'academic,学术的,toefl|cet4,Level 3,List 10',
    'general,普通的,cet4,Level 4,List 2',
  ].join('\n')

  const { importedWords } = parseVocabularyCsv({
    csvText,
    existingWords: [],
    validCategoryIds,
  })

  assert.deepEqual(importedWords[0].categories, ['toefl', 'cet4'])
  assert.equal(importedWords[0].level, '3')
  assert.equal(importedWords[0].list, '10')
  assert.equal(importedWords[1].level, undefined)
  assert.equal(importedWords[1].list, undefined)
})

test('parseVocabularyCsv handles quoted commas, escaped quotes, and newlines', () => {
  const csvText = [
    'word,meaning,example,exampleCn,category',
    '"phrase","短语,表达","He said ""hello""',
    'again.","他说了“你好”，然后又说了一遍。",daily',
  ].join('\n')

  const { importedWords, summary } = parseVocabularyCsv({
    csvText,
    existingWords: [],
    validCategoryIds,
  })

  assert.equal(summary.importedCount, 1)
  assert.equal(importedWords[0].meaning, '短语,表达')
  assert.equal(importedWords[0].example, 'He said "hello"\nagain.')
})
