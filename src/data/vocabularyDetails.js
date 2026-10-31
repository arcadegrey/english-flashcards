import { needsWordDetails, validWordExamples } from './vocabularySummary.js'

// The same detail validation/cache is used by the legacy full delivery service
// and the small detail-only locator. Public identity stays ID + exact headword.
export function createVocabularyDetailsLoader({ fetchJson, hasWord, config, getLegacyPaths }) {
  const details = new Map()
  const keyFor = word => `${word?.id}\0${word?.word}`
  const completeExample = word => typeof word?.example === 'string' && typeof word?.exampleCn === 'string' && validWordExamples(word)
  const peekDetails = word => completeExample(word) ? word : details.get(keyFor(word)) || null
  const matchDetails = (words, word) => {
    const entry = words?.find(item => String(item.id) === String(word.id) && item.word === word.word)
    if (!completeExample(entry)) return null
    const result = { id: entry.id, word: entry.word, example: entry.example, exampleCn: entry.exampleCn,
      ...(Array.isArray(entry.examples) ? { examples: entry.examples } : {}) }
    details.set(keyFor(word), result)
    return result
  }
  const loadDetails = async word => {
    const cached = peekDetails(word)
    if (cached) return cached
    if (!needsWordDetails(word) || !hasWord(word.id)) return null
    const path = config.batches[Math.floor(Number(word.id) / config.batchSize)]
    try {
      if (!path) throw new Error('例句索引缺失')
      const batch = await fetchJson(path, '例句加载失败', entries => Array.isArray(entries)
        && entries.every(entry => completeExample(entry) && typeof entry.word === 'string')
        && entries.some(entry => String(entry.id) === String(word.id) && entry.word === word.word))
      const result = matchDetails(batch, word)
      if (!result) throw new Error('例句与当前词条不匹配，请重试')
      return result
    } catch (error) {
      // Cache-only recovery never downloads a whole library for one sentence.
      for (const legacyPath of await getLegacyPaths(word)) {
        const old = await fetchJson.readCached?.(legacyPath)
        const result = matchDetails(old, word)
        if (result) return result
      }
      throw error
    }
  }
  return { loadDetails, peekDetails }
}
