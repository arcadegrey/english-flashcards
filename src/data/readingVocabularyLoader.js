import { tokenizeReadingText, isEnglishWordToken, buildWordLookup } from '../utils/readingText.js'

// Public content only. Never reuse a page's partial learning pool or mutate it.
export function createReadingVocabularyLoader({ entries, vocabularyIndex, loadCatalog, loadFullCatalog }) {
  const knownPaths = new Set(entries.map(entry => entry.article.contentPath))
  const knownTokens = new Set(entries.flatMap(entry => entry.tokens))
  const expected = new Map(vocabularyIndex.map(word => [String(word.id), word.word]))
  const valid = words => {
    if (!Array.isArray(words)) return false
    const found = new Map(words.map(word => [String(word?.id), word]))
    return words.length === expected.size && found.size === expected.size
      && [...expected].every(([id, spelling]) => found.get(id)?.word === spelling
        && typeof found.get(id)?.meaning === 'string')
  }
  let catalogRequest
  const catalog = () => {
    catalogRequest ??= Promise.resolve().then(() => loadCatalog(valid)).then(words => {
      if (!valid(words)) throw new Error('阅读词汇数据不完整，请重试。')
      return words
    }).catch(error => { catalogRequest = null; throw error })
    return catalogRequest
  }
  return async article => {
    if (article?.contentDeferred && knownPaths.has(article.contentPath)) return catalog()
    if (typeof article?.content !== 'string') throw new Error('缺少阅读正文，无法准备查词。')
    const tokens = tokenizeReadingText(article.content).filter(isEnglishWordToken)
    // Older assignments/history can contain prose absent from today's library.
    // Use the original full catalog APIs/caches for those snapshots only; never
    // replace their text/questions with a canonical article sharing the same ID.
    return tokens.every(token => knownTokens.has(token.toLowerCase())) ? catalog() : loadFullCatalog()
  }
}

export function buildReadingWordLookup(words, customWords = []) {
  // Match the stable numeric-ID order used by the canonical catalog merger,
  // including legacy full-file caches that retain a different physical order.
  return buildWordLookup([...words].sort((a, b) => Number(a.id) - Number(b.id)).concat(customWords))
}
