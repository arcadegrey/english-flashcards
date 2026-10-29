import { readingMetadata, READING_CONTENT_VERSION } from './readingMetadata.js'
import { createVocabularyLoader } from './vocabularyCache.js'
import { createReadingContentLoader } from './readingContentLoader.js'

// Independent public-content versions: a reading update must not evict vocabulary
// caches or account-scoped drafts/attempts, and vice versa.
export const loadReadingArticle = createReadingContentLoader({
  metadata: readingMetadata,
  fetchJson: createVocabularyLoader({ version: READING_CONTENT_VERSION, cachePrefix: 'flashcards-readings-' }),
  loadLegacyArticles: () => import('./readings.js').then(module => module.default),
})
