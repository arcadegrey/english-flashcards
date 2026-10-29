import { preparedReadings, readingVocabularyIndex, readingVocabularyCatalog } from './readingMetadata.js'
import { createReadingVocabularyLoader } from './readingVocabularyLoader.js'
import { createVocabularyLoader } from './vocabularyCache.js'

const fetchJson = createVocabularyLoader({
  version: readingVocabularyCatalog.version, cachePrefix: 'flashcards-reading-vocabulary-',
})

export const loadReadingVocabulary = createReadingVocabularyLoader({
  entries: preparedReadings,
  vocabularyIndex: readingVocabularyIndex,
  // Explicit data requests can retry without a page reload. The lazy fallback
  // is precached by the existing PWA policy for unopened articles offline.
  // Examples still use the original detail API.
  loadCatalog: valid => fetchJson(readingVocabularyCatalog.path, '阅读词汇加载失败', valid).catch(async error => {
    try { return (await import('./readingVocabulary.json')).default }
    catch { throw error }
  }),
  loadFullCatalog: () => import('./vocabulary.js').then(module => module.loadFullVocabularyCatalog()),
})
