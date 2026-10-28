import {
  fetchVocabularyJson as fetchJson, loadCoreVocabularyCatalog, hasBundledVocabularyId,
} from './vocabularyStartup.js'
import startup from './vocabularyStartup.json'
import { createFullVocabularyCatalogLoader } from './fullVocabularyCatalog.js'
import { createVocabularyDelivery } from './vocabularyDelivery.js'
import { createVocabularyDetailsLoader } from './vocabularyDetails.js'
export { VOCABULARY_COUNTS, hasBundledVocabularyId } from './vocabularyStartup.js'

export const VOCABULARY_URL = '/data/vocabulary/core.json'
export const FULL_VOCABULARY_URL = '/data/vocabulary.json'
export const TOEFL_MANIFEST_URL = '/data/vocabulary/toefl/manifest.json'
export const IELTS_MANIFEST_URL = '/data/vocabulary/ielts/manifest.json'
let delivery, indexRequest, detailsService, detailsRequest, legacyDetailsService
let categoryLoaderRequest
const getIndex = () => {
  indexRequest ??= import('./vocabularyIndex.json').then(module => module.default)
    .catch(error => { indexRequest = null; throw new Error('词库索引加载失败，请重试', { cause: error }) })
  return indexRequest
}
const getDelivery = () => getIndex().then(index => {
  delivery ??= createVocabularyDelivery({ fetchJson, index })
  return delivery
})
const getDetailsService = () => {
  if (detailsService) return Promise.resolve(detailsService)
  if (delivery) return Promise.resolve(delivery)
  detailsRequest ??= import('./vocabularyDetailsIndex.json').then(({ default: config }) => {
    detailsService = createVocabularyDetailsLoader({ fetchJson, hasWord: hasBundledVocabularyId, config,
      getLegacyPaths: async word => {
        try {
          const index = await getIndex()
          return [...(index.coreIds.includes(Number(word.id)) ? [index.core]
            : [index.paths[index.wordPaths[String(word.id)]], index.extended]), FULL_VOCABULARY_URL]
        } catch {
          // Old core/full caches can still recover without a new locator chunk.
          return [startup.core, startup.extended, FULL_VOCABULARY_URL]
        }
      },
    })
    return detailsService
  }).catch(error => { detailsRequest = null; throw new Error('例句索引加载失败，请重试', { cause: error }) })
  return detailsRequest
}
export const loadFullVocabulary = async () => (await getDelivery()).loadFull()
export const loadVocabularyByIds = async ids => ids.some(hasBundledVocabularyId) ? (await getDelivery()).loadIds(ids) : []
export const loadVocabularyCatalog = loadCoreVocabularyCatalog
export const loadFullVocabularyCatalog = createFullVocabularyCatalogLoader({
  fetchJson, index: startup, loadCoreCatalog: loadCoreVocabularyCatalog, hasWord: hasBundledVocabularyId,
})
export const preloadWordDetails = getDetailsService
export const loadVocabularyCatalogByIds = async ids => ids.some(hasBundledVocabularyId) ? (await getDelivery()).loadCatalogIds(ids) : []
export const loadVocabularyCategoryCatalog = async category => {
  if (category === 'all') return loadFullVocabularyCatalog()
  categoryLoaderRequest ??= Promise.all([
    import('./categoryVocabularyCatalog.js'), import('./vocabularyCategoryIndex.json'),
  ]).then(([{ createCategoryVocabularyCatalogLoader }, { default: categories }]) =>
    createCategoryVocabularyCatalogLoader({ fetchJson, categories, startup,
      loadCoreCatalog: loadCoreVocabularyCatalog, loadByIds: loadVocabularyCatalogByIds }))
    .catch(error => { categoryLoaderRequest = null; throw error })
  return (await categoryLoaderRequest)(category)
}
export const peekWordDetails = word => typeof word?.example === 'string' && typeof word?.exampleCn === 'string'
  ? word : detailsService?.peekDetails(word) || delivery?.peekDetails(word) || legacyDetailsService?.peekDetails(word) || null
export const loadWordDetails = word => {
  const cached = peekWordDetails(word)
  if (cached) return Promise.resolve(cached)
  if (!word?.exampleDeferred || !hasBundledVocabularyId(word.id)) return Promise.resolve(null)
  return getDetailsService().then(service => service.loadDetails(word), error => {
    // A missing new code chunk must not strand already cached complete examples.
    legacyDetailsService ??= createVocabularyDetailsLoader({ fetchJson, hasWord: hasBundledVocabularyId,
      config: { batchSize: 50, batches: {} },
      getLegacyPaths: () => [startup.core, startup.extended, FULL_VOCABULARY_URL],
    })
    return legacyDetailsService.loadDetails(word).catch(() => { throw error })
  })
}

export const loadVocabulary = async () => {
  const vocabulary = await (await getDelivery()).loadCore()

  if (!Array.isArray(vocabulary)) {
    throw new Error('词库格式无效')
  }

  return vocabulary
}

export const loadToeflManifest = async () => {
  const manifest = await fetchJson(TOEFL_MANIFEST_URL, '托福词库目录加载失败',
    (data) => Array.isArray(data?.toefl?.levels))

  if (!manifest || typeof manifest !== 'object' || !Array.isArray(manifest?.toefl?.levels)) {
    throw new Error('托福词库目录格式无效')
  }

  return manifest
}

export const findToeflListEntry = (manifest, levelKey, listKey) => {
  const level = manifest?.toefl?.levels?.find((item) => String(item.key) === String(levelKey))
  if (!level) return null
  return level.lists?.find((item) => String(item.key) === String(listKey)) || null
}

export const loadIeltsManifest = async () => {
  const manifest = await fetchJson(IELTS_MANIFEST_URL, '雅思词库目录加载失败',
    (data) => Array.isArray(data?.ielts?.lists))

  if (!manifest || typeof manifest !== 'object' || !Array.isArray(manifest?.ielts?.lists)) {
    throw new Error('雅思词库目录格式无效')
  }

  return manifest
}

export const findIeltsListEntry = (manifest, listKey) =>
  manifest?.ielts?.lists?.find((item) => String(item.key) === String(listKey)) || null

export const loadToeflListVocabulary = async (manifest, levelKey, listKey) => {
  const listEntry = findToeflListEntry(manifest, levelKey, listKey)
  if (!listEntry?.path) {
    throw new Error('未找到托福 List 数据')
  }

  const vocabulary = await fetchJson(listEntry.path, '托福 List 加载失败')

  if (!Array.isArray(vocabulary)) {
    throw new Error('托福 List 格式无效')
  }

  return vocabulary
}

export const loadIeltsListVocabulary = async (manifest, listKey) => {
  const listEntry = findIeltsListEntry(manifest, listKey)
  if (!listEntry?.path) {
    throw new Error('未找到雅思 List 数据')
  }

  const vocabulary = await fetchJson(listEntry.path, '雅思 List 加载失败')

  if (!Array.isArray(vocabulary)) {
    throw new Error('雅思 List 格式无效')
  }

  return vocabulary
}

export const loadToeflListCatalog = async (manifest, levelKey, listKey) => {
  const entry = findToeflListEntry(manifest, levelKey, listKey)
  if (!entry?.path) throw new Error('未找到托福 List 数据')
  return (await getDelivery()).loadListCatalog(entry.path)
}

export const loadIeltsListCatalog = async (manifest, listKey) => {
  const entry = findIeltsListEntry(manifest, listKey)
  if (!entry?.path) throw new Error('未找到雅思 List 数据')
  return (await getDelivery()).loadListCatalog(entry.path)
}
