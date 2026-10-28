import { useLayoutEffect, useRef, useState } from 'react'
import { mergeVocabularyList } from '../../utils/vocabularyMerge.js'
import { getIeltsTopicKey } from '../../utils/vocabularyCatalog.js'

// Coordinate TOEFL/IELTS selection with the existing catalog loaders.
export function useVocabularyNavigation(navigationState, catalog, ownerId) {
  const {
    setView, setMode, setAssessmentBackTarget, setSelectedCategory, selectedToeflLevel, setSelectedToeflLevel,
    setSelectedToeflList, selectedIeltsTopic, setSelectedIeltsTopic, setSelectedIeltsList,
    view, selectedCategory, selectedToeflList, selectedIeltsList, setCurrentIndex, pendingStartWordIdRef,
  } = navigationState
  const {
    toeflGrouping, ieltsGrouping, prepareVocabularyRange, setVocabulary,
  } = catalog

  const [preparation, setPreparation] = useState(null)
  const requestRef = useRef(0)

  useLayoutEffect(() => () => {
    requestRef.current += 1
    setPreparation(null)
  }, [view, selectedCategory, selectedToeflLevel, selectedToeflList, selectedIeltsTopic, selectedIeltsList, ownerId])

  const startRange = async (selection) => {
    const request = ++requestRef.current
    setPreparation({ selection, loading: true, error: '' })
    try {
      const words = await prepareVocabularyRange(selection, () => request === requestRef.current)
      if (request !== requestRef.current) return
      // One catalog commit and one navigation, never a sequence of partially ready pools.
      setVocabulary(current => mergeVocabularyList(current, words))
      pendingStartWordIdRef.current = selection.focusWordId ?? null
      setAssessmentBackTarget('home')
      setSelectedCategory(selection.category)
      setSelectedToeflLevel(selection.level || '')
      setSelectedToeflList(selection.category === 'toefl' ? selection.list || '' : '')
      setSelectedIeltsTopic(selection.topic || '')
      setSelectedIeltsList(selection.category === 'ielts' ? selection.list || '' : '')
      setCurrentIndex(0)
      setMode('learn')
      setView('learn')
      setPreparation(null)
    } catch (error) {
      if (request === requestRef.current) setPreparation({ selection, loading: false,
        error: error?.message || '所选词库准备失败，请重试' })
    }
  }

  const handleCategorySelect = (categoryId, options = {}) => {
    if (categoryId === 'toefl' || categoryId === 'ielts') return startRange({ category: categoryId, focusWordId: options.focusWordId })
    pendingStartWordIdRef.current = options.focusWordId ?? null
    setAssessmentBackTarget('home')
    setSelectedCategory(categoryId)
    if (categoryId !== 'toefl') {
      setSelectedToeflLevel('')
      setSelectedToeflList('')
    }
    if (categoryId !== 'ielts') {
      setSelectedIeltsTopic('')
      setSelectedIeltsList('')
    }
    setMode('learn')
    setView('learn')
  }

  const openToeflLevels = () => {
    pendingStartWordIdRef.current = null
    setAssessmentBackTarget('home')
    setSelectedCategory('toefl')
    setSelectedToeflLevel('')
    setSelectedToeflList('')
    setSelectedIeltsTopic('')
    setSelectedIeltsList('')
    setView('toeflLevels')
  }

  const openIeltsTopics = () => {
    pendingStartWordIdRef.current = null
    setAssessmentBackTarget('home')
    setSelectedCategory('ielts')
    setSelectedToeflLevel('')
    setSelectedToeflList('')
    setSelectedIeltsTopic('')
    setSelectedIeltsList('')
    setView('ieltsTopics')
  }

  const handleToeflLevelSelect = (levelKey) => {
    const nextLists = toeflGrouping.listsByLevel[levelKey] || []
    if (!nextLists.length) return startRange({ category: 'toefl', level: levelKey })
    pendingStartWordIdRef.current = null
    setSelectedCategory('toefl')
    setSelectedToeflLevel(levelKey)
    setSelectedToeflList('')
    setSelectedIeltsTopic('')
    setSelectedIeltsList('')

    setView('toeflLists')
  }

  const handleToeflListSelect = (listKey) => startRange({ category: 'toefl', level: selectedToeflLevel, list: listKey })
  const handleStartAllToefl = () => startRange({ category: 'toefl' })
  const handleStartCurrentLevel = () => startRange({ category: 'toefl', level: selectedToeflLevel })

  const handleIeltsTopicSelect = (topicKey) => {
    const nextLists = ieltsGrouping.listsByTopic[topicKey] || []
    if (!nextLists.length) return startRange({ category: 'ielts', topic: topicKey })
    pendingStartWordIdRef.current = null
    setSelectedCategory('ielts')
    setSelectedToeflLevel('')
    setSelectedToeflList('')
    setSelectedIeltsTopic(topicKey)
    setSelectedIeltsList('')

    setView('ieltsLists')
  }

  const handleIeltsListSelect = (listKey) => startRange({ category: 'ielts',
    topic: selectedIeltsTopic || getIeltsTopicKey(listKey), list: listKey })
  const handleStartAllIelts = () => startRange({ category: 'ielts' })
  const handleStartCurrentIeltsTopic = () => startRange({ category: 'ielts', topic: selectedIeltsTopic })
  const retryVocabularyPreparation = () => preparation && startRange(preparation.selection)

  return {
    vocabularyPreparing: Boolean(preparation?.loading), vocabularyPreparationError: preparation?.error || '',
    retryVocabularyPreparation, handleCategorySelect, openToeflLevels, openIeltsTopics, handleToeflLevelSelect, handleToeflListSelect,
    handleStartAllToefl, handleStartCurrentLevel, handleIeltsTopicSelect, handleIeltsListSelect,
    handleStartAllIelts, handleStartCurrentIeltsTopic,
  }
}
