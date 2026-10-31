import startup from './vocabularyStartup.json'
import { createVocabularyLoader } from './vocabularyCache.js'
import { loadVocabularyCatalogEntry } from './vocabularyCatalogEntry.js'
import { createVocabularyMembership } from './vocabularyMembership.js'
import { createCoreVocabularyPreparation } from './coreVocabularyPreparation.js'

// A single public-content loader is shared by bootstrap and all later APIs.
// Existing versioned CacheStorage keys, inactivity timeout and retries stay intact.
export const fetchVocabularyJson = createVocabularyLoader({
  version: import.meta.env?.VITE_VOCABULARY_VERSION || 'development',
})
export const VOCABULARY_COUNTS = startup.counts
export const hasBundledVocabularyId = createVocabularyMembership(startup.idRanges)
export const loadCoreVocabularyCatalog = createCoreVocabularyPreparation({
  loadPrimary: () => loadVocabularyCatalogEntry(
    fetchVocabularyJson, startup.core, startup.coreCatalog, hasBundledVocabularyId,
  ),
  loadFallback: () => import('./coreVocabularyCatalog.json').then(module => module.default),
  count: startup.coreCatalog.count,
  hasCoreWord: createVocabularyMembership(startup.coreIdRanges),
})
