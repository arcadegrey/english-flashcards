import { mergeVocabularyList } from '../utils/vocabularyMerge.js'
import { createVocabularyDetailsLoader } from './vocabularyDetails.js'
import { loadVocabularyCatalogEntry } from './vocabularyCatalogEntry.js'
import { createFullVocabularyCatalogLoader } from './fullVocabularyCatalog.js'

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

  const cachedOrFetchCatalog = (legacyPath, entry) => loadVocabularyCatalogEntry(fetchJson, legacyPath, entry, hasWord)
  const loadCoreCatalog = () => cachedOrFetchCatalog(index.core, index.catalog.core)
  const loadFullCatalog = createFullVocabularyCatalogLoader({ fetchJson, index, loadCoreCatalog, hasWord })
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

  const { loadDetails, peekDetails } = createVocabularyDetailsLoader({
    fetchJson, hasWord, config: index.details,
    getLegacyPaths: word => [...(coreIds.has(String(word.id)) ? [index.core]
      : [index.paths[index.wordPaths[String(word.id)]], index.extended]), '/data/vocabulary.json'],
  })

  return { loadCore, loadFull, loadIds, hasWord, loadCoreCatalog, loadFullCatalog, loadListCatalog, loadCatalogIds, loadDetails, peekDetails }
}
