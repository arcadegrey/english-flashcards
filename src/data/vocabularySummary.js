import { buildHiddenSentence } from '../utils/assessmentRounds.js'

export function summarizeVocabularyWord(word) {
  const summary = { ...word, exampleDeferred: true }
  delete summary.example
  delete summary.exampleCn
  if (!buildHiddenSentence(word.example, word.word)) summary.fillBlankAvailable = false
  return summary
}

export const needsWordDetails = word => Boolean(word?.exampleDeferred
  && (typeof word.example !== 'string' || typeof word.exampleCn !== 'string'))

export function applyWordDetails(word, details) {
  if (!word || !details) return word
  if (String(details.id) !== String(word.id) || details.word !== word.word
    || typeof details.example !== 'string' || typeof details.exampleCn !== 'string') {
    throw new Error('例句与当前词条不匹配，请重试')
  }
  const result = { ...word, example: details.example, exampleCn: details.exampleCn }
  delete result.exampleDeferred
  delete result.fillBlankAvailable
  return result
}
