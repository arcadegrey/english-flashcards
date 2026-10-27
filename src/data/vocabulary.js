import { createVocabularyLoader } from './vocabularyCache.js'
import { createVocabularyDelivery } from './vocabularyDelivery.js'
import vocabularyIndex from './vocabularyIndex.json'

export const VOCABULARY_URL = '/data/vocabulary/core.json'
export const FULL_VOCABULARY_URL = '/data/vocabulary.json'
export const TOEFL_MANIFEST_URL = '/data/vocabulary/toefl/manifest.json'
export const IELTS_MANIFEST_URL = '/data/vocabulary/ielts/manifest.json'
export const VOCABULARY_COUNTS = vocabularyIndex.counts

const fetchJson = createVocabularyLoader({
  version: import.meta.env?.VITE_VOCABULARY_VERSION || 'development',
})

const delivery = createVocabularyDelivery({ fetchJson, index: vocabularyIndex })
export const loadFullVocabulary = delivery.loadFull
export const loadVocabularyByIds = delivery.loadIds
export const hasBundledVocabularyId = delivery.hasWord
export const loadVocabularyCatalog = delivery.loadCoreCatalog
export const loadFullVocabularyCatalog = delivery.loadFullCatalog
export const loadVocabularyCatalogByIds = delivery.loadCatalogIds
export const loadWordDetails = delivery.loadDetails
export const peekWordDetails = delivery.peekDetails

export const loadVocabulary = async () => {
  const vocabulary = await delivery.loadCore()

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
  return delivery.loadListCatalog(entry.path)
}

export const loadIeltsListCatalog = async (manifest, listKey) => {
  const entry = findIeltsListEntry(manifest, listKey)
  if (!entry?.path) throw new Error('未找到雅思 List 数据')
  return delivery.loadListCatalog(entry.path)
}
