import assert from 'node:assert/strict'
import test from 'node:test'
import { mergeVocabularyUpsertWord } from '../scripts/import-global-vocabulary.mjs'
import { parseReadingCsv, parseVocabularyCsv } from '../src/utils/csvImport.js'

const validCategoryIds = ['daily', 'cet4', 'toefl', 'ielts']

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

test('parseVocabularyCsv stores IELTS list separately from TOEFL list', () => {
  const csvText = [
    'word,meaning,category,level,list',
    'atmosphere,大气,ielts,,List 1',
  ].join('\n')

  const { importedWords } = parseVocabularyCsv({
    csvText,
    existingWords: [],
    validCategoryIds,
  })

  assert.deepEqual(importedWords[0].categories, ['ielts'])
  assert.equal(importedWords[0].level, undefined)
  assert.equal(importedWords[0].list, undefined)
  assert.equal(importedWords[0].ieltsList, '1')
  assert.deepEqual(importedWords[0].ieltsLists, ['1'])
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

test('mergeVocabularyUpsertWord preserves existing content while adding categories', () => {
  const current = {
    id: 1,
    word: 'abandon',
    phonetic: '/əˈbændən/',
    pos: 'v.',
    meaning: '放弃；抛弃',
    example: 'They had to abandon the plan.',
    exampleCn: '他们不得不放弃这个计划。',
    category: 'daily',
    categories: ['daily'],
  }

  const incoming = {
    word: 'abandon',
    phonetic: '/new/',
    pos: 'n.',
    meaning: '新的释义',
    example: 'A different sentence for TTS.',
    exampleCn: '新的例句翻译。',
    category: 'toefl',
    categories: ['toefl'],
    level: 'Level 3',
    list: 'List 2',
  }

  const merged = mergeVocabularyUpsertWord(current, incoming)

  assert.equal(merged.phonetic, current.phonetic)
  assert.equal(merged.pos, current.pos)
  assert.equal(merged.meaning, current.meaning)
  assert.equal(merged.example, current.example)
  assert.equal(merged.exampleCn, current.exampleCn)
  assert.deepEqual(merged.categories, ['daily', 'toefl'])
  assert.equal(merged.category, 'daily')
  assert.equal(merged.level, '3')
  assert.equal(merged.list, '2')
})

test('mergeVocabularyUpsertWord keeps TOEFL and IELTS list positions separate', () => {
  const current = {
    id: 1,
    word: 'atmosphere',
    meaning: '大气层',
    category: 'toefl',
    categories: ['toefl'],
    level: '6',
    list: '4',
  }

  const incoming = {
    word: 'atmosphere',
    meaning: '大气',
    category: 'ielts',
    categories: ['ielts'],
    ieltsList: '1',
  }

  const merged = mergeVocabularyUpsertWord(current, incoming)

  assert.deepEqual(merged.categories, ['toefl', 'ielts'])
  assert.equal(merged.level, '6')
  assert.equal(merged.list, '4')
  assert.equal(merged.ieltsList, '1')
  assert.deepEqual(merged.ieltsLists, ['1'])
})

test('mergeVocabularyUpsertWord keeps duplicate IELTS words in multiple lists', () => {
  const current = {
    id: 1,
    word: 'trunk',
    meaning: '树干',
    category: 'ielts',
    categories: ['ielts'],
    ieltsList: '6',
  }

  const incoming = {
    word: 'trunk',
    meaning: '躯干',
    category: 'ielts',
    categories: ['ielts'],
    ieltsList: '8',
  }

  const merged = mergeVocabularyUpsertWord(current, incoming)

  assert.equal(merged.ieltsList, '6')
  assert.deepEqual(merged.ieltsLists, ['6', '8'])
})

test('parseVocabularyCsv can keep duplicate rows for upsert merging', () => {
  const csvText = [
    'word,meaning,category,level,list',
    'apply,申请,ielts,,17',
    'apply,应用,ielts,,18',
  ].join('\n')

  const { importedWords, summary } = parseVocabularyCsv({
    csvText,
    existingWords: [],
    validCategoryIds,
    allowDuplicateWords: true,
  })

  assert.equal(summary.importedCount, 2)
  assert.equal(summary.skippedDuplicate, 0)
  assert.deepEqual(importedWords.map((word) => word.ieltsList), ['17', '18'])
})

test('parseReadingCsv imports exam type and JSON questions', () => {
  const questions = JSON.stringify([
    {
      id: 'q1',
      prompt: 'What is the main idea?',
      options: ['Small habits support progress', 'Sleep is unnecessary'],
      answer: 'A',
      explanation: 'The passage focuses on tiny repeatable actions.',
    },
  ]).replaceAll('"', '""')

  const csvText = [
    'title,level,category,content,translation,source,tags,examType,questions',
    `"A Small Habit",B1,self-improvement,"Small habits move you forward.","微习惯推动你前进。",cambridge,habit|study,IELTS,"${questions}"`,
  ].join('\n')

  const { importedReadings, summary } = parseReadingCsv({
    csvText,
    existingReadings: [],
  })

  assert.equal(summary.importedCount, 1)
  assert.equal(importedReadings[0].examType, 'IELTS')
  assert.deepEqual(importedReadings[0].tags, ['habit', 'study'])
  assert.equal(importedReadings[0].questions.length, 1)
  assert.equal(importedReadings[0].questions[0].options[0].id, 'A')
  assert.equal(importedReadings[0].questions[0].answer, 'A')
})
