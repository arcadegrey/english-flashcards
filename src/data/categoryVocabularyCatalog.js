import { mergeVocabularyList } from '../utils/vocabularyMerge.js'
import { wordBelongsToCategory } from '../utils/wordCategories.js'
import { createVocabularyMembership } from './vocabularyMembership.js'

// Public content only. Readiness is exact canonical membership, never a saved
// account flag; a rejected/partial response cannot complete a category or all.
export function createCategoryVocabularyCatalogLoader({ fetchJson, categories, startup, loadCoreCatalog, loadByIds }) {
  const requests = new Map()
  return category => {
    if (!Object.hasOwn(categories, category)) return Promise.reject(new Error('未找到计划分类词库'))
    if (requests.has(category)) return requests.get(category)
    const request = (async () => {
      const config = categories[category]
      const hasWord = createVocabularyMembership(config.idRanges)
      const hasMissingWord = createVocabularyMembership(config.missing.idRanges)
      const select = (words, hasId) => Array.isArray(words) ? words.filter(word => hasId(word?.id)) : []
      const validate = (words, count, hasId) => Array.isArray(words) && words.length === count
        && new Set(words.map(word => String(word?.id))).size === count
        && words.every(word => hasId(word?.id) && typeof word?.word === 'string'
          && typeof word?.meaning === 'string' && wordBelongsToCategory(word, category))
      const core = select(await loadCoreCatalog(), hasWord)
      if (validate(core, config.count, hasWord)) return core
      // Old summary/complete caches remain usable without the new category file.
      for (const path of [startup.catalog.extended.path, startup.extended, '/data/vocabulary.json']) {
        const cached = await fetchJson.readCached?.(path)
        const words = mergeVocabularyList(core, select(cached, hasWord))
        if (validate(words, config.count, hasWord)) return words
      }
      let missing
      try {
        missing = await fetchJson(config.missing.path, '分类词库加载失败',
          words => validate(words, config.missing.count, hasMissingWord))
        if (!validate(missing, config.missing.count, hasMissingWord)) throw new Error('分类词库数据不完整')
      } catch (error) {
        // Offline installations may only have old List caches. Resolve by the
        // existing ID API on failure; normal category loads never import it.
        if (!loadByIds) throw error
        const ids = config.missing.idRanges.flatMap(([start, end]) =>
          Array.from({ length: end - start + 1 }, (_, i) => start + i))
        try { missing = await loadByIds(ids) } catch { throw error }
      }
      const words = mergeVocabularyList(core, missing)
      if (!validate(words, config.count, hasWord)) throw new Error('分类词库数据不完整，请重试')
      return words
    })().catch(error => { requests.delete(category); throw error })
    requests.set(category, request)
    return request
  }
}
