import { mergeVocabularyList } from '../utils/vocabularyMerge.js'
import { needsWordDetails } from './vocabularySummary.js'

// Public content only: selection uses stable IDs, never spelling or account data.
export function createVocabularyDelivery({ fetchJson, index }) {
  const coreIds = new Set(index.coreIds.map(String))
  let fullRequest
  const hasWord = id => coreIds.has(String(id)) || Object.hasOwn(index.wordPaths, String(id))
  const loadCore = () => fetchJson(index.core, '词库加载失败')

  const loadFull = () => {
    fullRequest ??= (async () => {
      // Existing offline installations may already have the old full-file cache.
      const cached = await fetchJson.readCached?.('/data/vocabulary.json')
      if (cached?.length === index.total) return cached
      const [core, extended] = await Promise.all([loadCore(), fetchJson(index.extended, '全范围词库加载失败')])
      const words = mergeVocabularyList(core, extended)
      if (words.length !== index.total) throw new Error('全范围词库加载失败：词库数据不完整')
      return words
    })().catch(error => { fullRequest = null; throw error })
    return fullRequest
  }

  const loadIds = async ids => {
    const requested = new Set(ids.map(String).filter(hasWord))
    const paths = [...new Set([...requested].map(id => coreIds.has(id) ? index.core : index.paths[index.wordPaths[id]]))]
    const bytes = paths.reduce((sum, path) => sum + (index.sizes[index.paths.indexOf(path)] || 0), 0)
    if (bytes > index.extendedBytes) {
      return (await loadFull()).filter(word => requested.has(String(word.id)))
    }
    const batches = []
    let next = 0
    // Avoid flooding slow mobile connections when many different Lists are needed.
    await Promise.all(Array.from({ length: Math.min(4, paths.length) }, async () => {
      while (next < paths.length) {
        const path = paths[next++]
        batches.push(await fetchJson(path, '学习词条加载失败'))
      }
    }))
    const words = mergeVocabularyList([], batches.flat()).filter(word => requested.has(String(word.id)))
    if (words.length !== requested.size) throw new Error('学习词条加载失败：词库数据不完整')
    return words
  }

  const cachedOrFetchCatalog = async (legacyPath, entry) => {
    const validate = words => Array.isArray(words) && words.length === entry.count
      && new Set(words.map(word => word?.id)).size === words.length
      && words.every(word => hasWord(word?.id) && typeof word?.word === 'string' && typeof word?.meaning === 'string')
    const cached = await fetchJson.readCached?.(legacyPath, validate)
    return cached || fetchJson(entry.path, '词库目录加载失败', validate)
  }
  const loadCoreCatalog = () => cachedOrFetchCatalog(index.core, index.catalog.core)
  let catalogRequest
  const loadFullCatalog = () => {
    catalogRequest ??= (async () => {
      const cached = await fetchJson.readCached?.('/data/vocabulary.json')
      if (cached?.length === index.total) return cached
      const [core, extended] = await Promise.all([
        loadCoreCatalog(), cachedOrFetchCatalog(index.extended, index.catalog.extended),
      ])
      const words = mergeVocabularyList(core, extended)
      if (words.length !== index.total) throw new Error('全范围词库目录加载失败：词库数据不完整')
      return words
    })().catch(error => { catalogRequest = null; throw error })
    return catalogRequest
  }
  const loadListCatalog = legacyPath => cachedOrFetchCatalog(legacyPath, index.catalog.lists[legacyPath])
  const loadCatalogIds = async ids => {
    const requested = new Set(ids.map(String).filter(hasWord))
    // Full-study summaries already on disk also cover later bookmarks/reviews.
    // Reuse them before requesting a List that may never have been opened offline.
    const cachedPaths = new Set()
    for (const id of requested) {
      if (coreIds.has(id)) { cachedPaths.add(index.catalog.core.path); cachedPaths.add(index.core) }
      else { cachedPaths.add(index.catalog.extended.path); cachedPaths.add(index.extended); cachedPaths.add('/data/vocabulary.json') }
    }
    const cached = mergeVocabularyList([], (await Promise.all([...cachedPaths].map(path => fetchJson.readCached?.(path)))).filter(Array.isArray).flat())
      .filter(word => requested.has(String(word.id)))
    const found = new Set(cached.map(word => String(word.id)))
    const missing = [...requested].filter(id => !found.has(id))
    const paths = [...new Set(missing.map(id => coreIds.has(id) ? index.core : index.paths[index.wordPaths[id]]))]
    const bytes = paths.reduce((sum, path) => sum + (index.catalog.lists[path]?.size || 0), 0)
    if (bytes > index.catalog.extended.size) return (await loadFullCatalog()).filter(word => requested.has(String(word.id)))
    const batches = []
    let next = 0
    await Promise.all(Array.from({ length: Math.min(4, paths.length) }, async () => {
      while (next < paths.length) {
        const path = paths[next++]
        batches.push(await (path === index.core ? loadCoreCatalog() : loadListCatalog(path)))
      }
    }))
    const words = mergeVocabularyList(cached, batches.flat()).filter(word => requested.has(String(word.id)))
    if (words.length !== requested.size) throw new Error('学习词条目录加载失败：词库数据不完整')
    return words
  }

  const details = new Map()
  const keyFor = word => `${word?.id}\0${word?.word}`
  const completeExample = word => typeof word?.example === 'string' && typeof word?.exampleCn === 'string'
  const peekDetails = word => completeExample(word) ? word : details.get(keyFor(word)) || null
  const matchDetails = (words, word) => {
    const entry = words?.find(item => String(item.id) === String(word.id) && item.word === word.word)
    if (!completeExample(entry)) return null
    const result = { id: entry.id, word: entry.word, example: entry.example, exampleCn: entry.exampleCn }
    details.set(keyFor(word), result)
    return result
  }
  const loadDetails = async word => {
    const cached = peekDetails(word)
    if (cached) return cached
    // Custom and retired words keep their own inline content and never borrow
    // a canonical sentence just because their spelling happens to match.
    if (!needsWordDetails(word) || !hasWord(word.id)) return null
    const path = index.details.batches[Math.floor(Number(word.id) / index.details.batchSize)]
    try {
      if (!path) throw new Error('例句索引缺失')
      const batch = await fetchJson(path, '例句加载失败', entries => Array.isArray(entries)
        && entries.every(entry => completeExample(entry) && typeof entry.word === 'string')
        && entries.some(entry => String(entry.id) === String(word.id) && entry.word === word.word))
      const result = matchDetails(batch, word)
      if (!result) throw new Error('例句与当前词条不匹配，请重试')
      return result
    } catch (error) {
      // Offline upgrades can still use previously saved complete vocabulary.
      // These are cache-only reads; a missing sentence never downloads a full library.
      const legacyPaths = coreIds.has(String(word.id)) ? [index.core] : [index.paths[index.wordPaths[String(word.id)]], index.extended]
      for (const legacyPath of [...legacyPaths, '/data/vocabulary.json']) {
        const old = await fetchJson.readCached?.(legacyPath)
        const result = matchDetails(old, word)
        if (result) return result
      }
      throw error
    }
  }

  return { loadCore, loadFull, loadIds, hasWord, loadCoreCatalog, loadFullCatalog, loadListCatalog, loadCatalogIds, loadDetails, peekDetails }
}
