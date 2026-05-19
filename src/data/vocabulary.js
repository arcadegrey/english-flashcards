export const VOCABULARY_URL = '/data/vocabulary/core.json'
export const TOEFL_MANIFEST_URL = '/data/vocabulary/toefl/manifest.json'
export const IELTS_MANIFEST_URL = '/data/vocabulary/ielts/manifest.json'

const fetchJson = async (url, errorLabel) => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`${errorLabel} (${response.status})`)
  }

  return response.json()
}

export const loadVocabulary = async () => {
  const vocabulary = await fetchJson(VOCABULARY_URL, '词库加载失败')

  if (!Array.isArray(vocabulary)) {
    throw new Error('词库格式无效')
  }

  return vocabulary
}

export const loadToeflManifest = async () => {
  const manifest = await fetchJson(TOEFL_MANIFEST_URL, '托福词库目录加载失败')

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
  const manifest = await fetchJson(IELTS_MANIFEST_URL, '雅思词库目录加载失败')

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
