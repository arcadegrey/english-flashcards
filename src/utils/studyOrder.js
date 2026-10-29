import { shuffle } from './random.js'

// Preserve record identity/multiplicity and an explicitly requested first word.
// Learning order is prepared once per scope; catalog hydration never reshuffles it.
export function createStudyWordOrder(words, startWordId, random = Math.random) {
  const index = startWordId == null ? -1 : words.findIndex(word => String(word.id) === String(startWordId))
  if (index < 0) return shuffle(words, random)
  return [words[index], ...shuffle(words.filter((_, i) => i !== index), random)]
}
