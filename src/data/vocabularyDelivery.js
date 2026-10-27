import { mergeVocabularyList } from '../utils/vocabularyMerge.js'

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

  return { loadCore, loadFull, loadIds, hasWord }
}
