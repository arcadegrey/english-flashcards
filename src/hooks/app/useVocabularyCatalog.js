import { loadVocabularyRange } from '../../utils/vocabularyPreparation.js'
import { useVocabularySelection } from '../useVocabularySelection.js'
import { mergeVocabularyList } from '../../utils/vocabularyMerge.js'
import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import {
  loadFullVocabularyCatalog as loadFullVocabulary, loadVocabularyCatalogByIds as loadVocabularyByIds,
  hasBundledVocabularyId, VOCABULARY_COUNTS, loadIeltsListCatalog as loadIeltsListVocabulary,
  loadIeltsManifest, loadToeflListCatalog as loadToeflListVocabulary, loadToeflManifest,
  loadVocabularyCatalog as loadVocabulary,
  preloadWordDetails,
} from '../../data/vocabulary'
import { getWordCategories } from '../../utils/wordCategories'

// Own vocabulary loading, manifests, List requests and saved-word hydration.
export function useVocabularyCatalog(learning, navigationState) {
  const {
    customWords,
  } = learning
  const {
    selectedCategory, selectedToeflLevel, selectedToeflList, selectedIeltsTopic, selectedIeltsList,
  } = navigationState

  const [vocabulary, setVocabulary] = useState([])
  const [vocabularyLoading, setVocabularyLoading] = useState(true)
  const [vocabularyError, setVocabularyError] = useState('')
  const [vocabularyReloadKey, setVocabularyReloadKey] = useState(0)
  const [toeflManifest, setToeflManifest] = useState(null)
  const [ieltsManifest, setIeltsManifest] = useState(null)
  const fullVocabularyLoadedRef = useRef(false)
  const [savedWordsLoading, setSavedWordsLoading] = useState(false)
  const [savedWordsError, setSavedWordsError] = useState('')

  const allVocabulary = useMemo(() => [...vocabulary, ...customWords], [customWords, vocabulary])
  const wordCounts = useMemo(() => {
    const counts = { ...VOCABULARY_COUNTS }
    customWords.filter(word => !hasBundledVocabularyId(word.id)).forEach((word) => {
      getWordCategories(word).forEach((categoryId) => {
        counts[categoryId] = (counts[categoryId] || 0) + 1
      })
    })
    if (toeflManifest?.toefl?.total) {
      counts.toefl = Number(toeflManifest.toefl.total) || counts.toefl || 0
    }
    if (ieltsManifest?.ielts?.total) {
      counts.ielts = Number(ieltsManifest.ielts.total) || counts.ielts || 0
    }
    counts.all = Number(toeflManifest?.sourceTotal) || Number(ieltsManifest?.sourceTotal) || VOCABULARY_COUNTS.all
    return counts
  }, [customWords, ieltsManifest, toeflManifest])

  const { filteredVocabulary, toeflGrouping, ieltsGrouping, toeflListsForSelectedLevel, ieltsListsForSelectedTopic, currentCategoryName } = useVocabularySelection(
    allVocabulary, toeflManifest, ieltsManifest,
    { selectedCategory, selectedToeflLevel, selectedToeflList, selectedIeltsTopic, selectedIeltsList }
  )

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setVocabularyLoading(true)
      setVocabularyError('')

      try {
        const loadedVocabulary = await loadVocabulary()
        if (cancelled) return
        setVocabulary(loadedVocabulary)
        fullVocabularyLoadedRef.current = false
      } catch (error) {
        if (cancelled) return
        setVocabulary([])
        setToeflManifest(null)
        setIeltsManifest(null)
        setVocabularyError(error?.message || '词库加载失败')
      } finally {
        if (!cancelled) {
          setVocabularyLoading(false)
        }
      }
    }

    load()
    // Optional list directories must not hold the entire app behind a loading screen.
    loadToeflManifest().then((manifest) => {
      if (!cancelled) setToeflManifest(manifest)
    }).catch(() => {})
    loadIeltsManifest().then((manifest) => {
      if (!cancelled) setIeltsManifest(manifest)
    }).catch(() => {})

    return () => {
      cancelled = true
    }
  }, [vocabularyReloadKey])

  const prepareVocabularyRange = useCallback((selection, isCurrent) => loadVocabularyRange(selection, {
    isCurrent,
    toeflManifest, ieltsManifest,
    loadToeflManifest: async () => {
      const manifest = await loadToeflManifest()
      if (!isCurrent || isCurrent()) setToeflManifest(manifest)
      return manifest
    },
    loadIeltsManifest: async () => {
      const manifest = await loadIeltsManifest()
      if (!isCurrent || isCurrent()) setIeltsManifest(manifest)
      return manifest
    },
    loadToeflList: loadToeflListVocabulary, loadIeltsList: loadIeltsListVocabulary,
  }), [toeflManifest, ieltsManifest])

  const loadAllExamVocabulary = useCallback(async () => {
    // Confirmed learning intent: overlap the small example locator with both
    // page code and complete summaries; never prefetch the full ID/List index.
    void preloadWordDetails().catch(() => {})
    if (fullVocabularyLoadedRef.current) return null
    return loadFullVocabulary()
  }, [])

  const prepareSavedWords = async (wordBookmarks) => {
    setSavedWordsError('')
    const savedIds = Object.entries(wordBookmarks).filter(([, entry]) => entry.saved).map(([id]) => id)
    if (fullVocabularyLoadedRef.current || savedIds.every((id) => allVocabulary.some((word) => String(word.id) === id))) return
    const loadedIds = new Set(allVocabulary.map(word => String(word.id)))
    setSavedWordsLoading(true)
    try {
      const words = await loadVocabularyByIds(savedIds.filter(id => !loadedIds.has(id)))
      setVocabulary((current) => mergeVocabularyList(current, words))
    } catch {
      setSavedWordsError('部分收藏词汇尚未加载，请联网后重试。已保存的收藏不会丢失。')
    } finally {
      setSavedWordsLoading(false)
    }
  }

  return {
    vocabulary, setVocabulary, vocabularyLoading, vocabularyError, vocabularyReloadKey, setVocabularyReloadKey,
    toeflManifest, ieltsManifest, allVocabulary, wordCounts, fullVocabularyLoadedRef,
    filteredVocabulary, toeflGrouping, ieltsGrouping, toeflListsForSelectedLevel, ieltsListsForSelectedTopic,
    currentCategoryName, prepareVocabularyRange, loadAllExamVocabulary,
    savedWordsLoading, savedWordsError, prepareSavedWords,
  }
}
