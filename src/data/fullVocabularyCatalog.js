import { mergeVocabularyList } from '../utils/vocabularyMerge.js'
import { loadVocabularyCatalogEntry } from './vocabularyCatalogEntry.js'

// Full learning summaries need only two known catalog entries, not the ID/List
// locator. Keep this path independent so deferring the locator adds no waterfall.
export function createFullVocabularyCatalogLoader({ fetchJson, index, loadCoreCatalog, hasWord }) {
  let request
  return () => {
    request ??= (async () => {
      const cached = await fetchJson.readCached?.('/data/vocabulary.json')
      if (cached?.length === index.total) return cached
      const [core, extended] = await Promise.all([
        loadCoreCatalog(), loadVocabularyCatalogEntry(fetchJson, index.extended, index.catalog.extended, hasWord),
      ])
      const words = mergeVocabularyList(core, extended)
      if (words.length !== index.total) throw new Error('全范围词库目录加载失败：词库数据不完整')
      return words
    })().catch(error => { request = null; throw error })
    return request
  }
}
