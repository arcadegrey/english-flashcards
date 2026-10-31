import { buildHiddenSentence } from '../utils/assessmentRounds.js'

export function summarizeVocabularyWord(word) {
  const summary = { ...word, exampleDeferred: true }
  delete summary.example
  delete summary.exampleCn
  delete summary.examples
  if (!buildHiddenSentence(word.example, word.word)) summary.fillBlankAvailable = false
  return summary
}

export const needsWordDetails = word => Boolean(word?.exampleDeferred
  && (typeof word.example !== 'string' || typeof word.exampleCn !== 'string'))

export const validWordExamples = word => word?.examples == null || Array.isArray(word.examples)
  && word.examples.length > 0
  && word.examples.every(example => typeof example?.sense === 'string' && example.sense.trim()
    && typeof example.en === 'string' && example.en.trim()
    && typeof example.zh === 'string' && example.zh.trim())
  && new Set(word.examples.map(example => example.en)).size === word.examples.length
  && word.examples[0].en === word.example && word.examples[0].zh === word.exampleCn

export const getWordExamples = word => Array.isArray(word?.examples) && validWordExamples(word)
  ? word.examples : [{ en: word?.example || '', zh: word?.exampleCn || '' }]

export function applyWordDetails(word, details) {
  if (!word || !details) return word
  if (String(details.id) !== String(word.id) || details.word !== word.word
    || typeof details.example !== 'string' || typeof details.exampleCn !== 'string' || !validWordExamples(details)) {
    throw new Error('例句与当前词条不匹配，请重试')
  }
  const result = { ...word, example: details.example, exampleCn: details.exampleCn }
  delete result.examples
  if (Array.isArray(details.examples)) result.examples = details.examples
  delete result.exampleDeferred
  delete result.fillBlankAvailable
  return result
}
