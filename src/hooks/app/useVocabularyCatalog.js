import { useVocabularySelection } from '../useVocabularySelection.js'
import { mergeVocabularyList } from '../../utils/vocabularyMerge.js'
import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import {
  loadFullVocabularyCatalog as loadFullVocabulary, loadVocabularyCatalogByIds as loadVocabularyByIds,
  hasBundledVocabularyId, VOCABULARY_COUNTS, loadIeltsListCatalog as loadIeltsListVocabulary,
  loadIeltsManifest, loadToeflListCatalog as loadToeflListVocabulary, loadToeflManifest,
  loadVocabularyCatalog as loadVocabulary,
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
  const loadingToeflListsRef = useRef(new Set())
  const loadingIeltsListsRef = useRef(new Set())
  const [listLoads, setListLoads] = useState(0)
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

  const ensureToeflListLoaded = useCallback(
    async (levelKey, listKey) => {
      if (!toeflManifest || !levelKey || !listKey) return

      const cacheKey = `${levelKey}::${listKey}`
      if (loadingToeflListsRef.current.has(cacheKey)) return
      loadingToeflListsRef.current.add(cacheKey)
      setListLoads(count => count + 1)

      try {
        const listVocabulary = await loadToeflListVocabulary(toeflManifest, levelKey, listKey)
        setVocabulary((prev) => mergeVocabularyList(prev, listVocabulary))
      } catch (error) {
        setVocabularyError(error?.message || '托福 List 加载失败')
      } finally {
        loadingToeflListsRef.current.delete(cacheKey)
        setListLoads(count => count - 1)
      }
    },
    [toeflManifest]
  )

  const ensureToeflLevelLoaded = useCallback(
    (levelKey) => {
      const lists = toeflGrouping.listsByLevel[levelKey] || []
      lists.forEach((item) => {
        ensureToeflListLoaded(levelKey, item.key)
      })
    },
    [ensureToeflListLoaded, toeflGrouping.listsByLevel]
  )

  const ensureAllToeflLoaded = useCallback(() => {
    toeflGrouping.levels.forEach((level) => {
      ensureToeflLevelLoaded(level.key)
    })
  }, [ensureToeflLevelLoaded, toeflGrouping.levels])

  const ensureIeltsListLoaded = useCallback(
    async (listKey) => {
      if (!ieltsManifest || !listKey) return

      if (loadingIeltsListsRef.current.has(listKey)) return
      loadingIeltsListsRef.current.add(listKey)
      setListLoads(count => count + 1)

      try {
        const listVocabulary = await loadIeltsListVocabulary(ieltsManifest, listKey)
        setVocabulary((prev) => mergeVocabularyList(prev, listVocabulary))
      } catch (error) {
        setVocabularyError(error?.message || '雅思 List 加载失败')
      } finally {
        loadingIeltsListsRef.current.delete(listKey)
        setListLoads(count => count - 1)
      }
    },
    [ieltsManifest]
  )

  const ensureAllIeltsLoaded = useCallback(() => {
    ieltsGrouping.lists.forEach((item) => {
      ensureIeltsListLoaded(item.key)
    })
  }, [ensureIeltsListLoaded, ieltsGrouping.lists])

  const loadAllExamVocabulary = useCallback(async () => {
    if (fullVocabularyLoadedRef.current) return null
    return loadFullVocabulary()
  }, [])

  const ensureIeltsTopicLoaded = useCallback(
    (topicKey) => {
      const lists = ieltsGrouping.listsByTopic[topicKey] || []
      lists.forEach((item) => {
        ensureIeltsListLoaded(item.key)
      })
    },
    [ensureIeltsListLoaded, ieltsGrouping.listsByTopic]
  )

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
    toeflManifest, ieltsManifest, allVocabulary, wordCounts, fullVocabularyLoadedRef, listLoads,
    filteredVocabulary, toeflGrouping, ieltsGrouping, toeflListsForSelectedLevel, ieltsListsForSelectedTopic,
    currentCategoryName, ensureToeflListLoaded, ensureToeflLevelLoaded, ensureAllToeflLoaded,
    ensureIeltsListLoaded, ensureAllIeltsLoaded, loadAllExamVocabulary, ensureIeltsTopicLoaded,
    savedWordsLoading, savedWordsError, prepareSavedWords,
  }
}
