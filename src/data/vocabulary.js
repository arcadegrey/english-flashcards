export const VOCABULARY_URL = '/data/vocabulary.json'

export const loadVocabulary = async () => {
  const response = await fetch(VOCABULARY_URL)

  if (!response.ok) {
    throw new Error(`词库加载失败 (${response.status})`)
  }

  const vocabulary = await response.json()

  if (!Array.isArray(vocabulary)) {
    throw new Error('词库格式无效')
  }

  return vocabulary
}
