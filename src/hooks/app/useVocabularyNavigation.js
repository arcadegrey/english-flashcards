import { getIeltsTopicKey } from '../../utils/vocabularyCatalog.js'

// Coordinate TOEFL/IELTS selection with the existing catalog loaders.
export function useVocabularyNavigation(navigationState, catalog) {
  const {
    setView, setMode, setAssessmentBackTarget, setSelectedCategory, selectedToeflLevel, setSelectedToeflLevel,
    setSelectedToeflList, selectedIeltsTopic, setSelectedIeltsTopic, setSelectedIeltsList,
    pendingStartWordIdRef,
  } = navigationState
  const {
    toeflGrouping, ieltsGrouping, ensureToeflListLoaded, ensureToeflLevelLoaded, ensureAllToeflLoaded,
    ensureIeltsListLoaded, ensureAllIeltsLoaded, ensureIeltsTopicLoaded,
  } = catalog

  const handleCategorySelect = (categoryId, options = {}) => {
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
    pendingStartWordIdRef.current = null
    setSelectedCategory('toefl')
    setSelectedToeflLevel(levelKey)
    setSelectedToeflList('')
    setSelectedIeltsTopic('')
    setSelectedIeltsList('')

    const nextLists = toeflGrouping.listsByLevel[levelKey] || []
    if (nextLists.length === 0) {
      setMode('learn')
    }
    setView(nextLists.length > 0 ? 'toeflLists' : 'learn')
  }

  const handleToeflListSelect = (listKey) => {
    pendingStartWordIdRef.current = null
    setAssessmentBackTarget('home')
    setSelectedCategory('toefl')
    setSelectedToeflList(listKey)
    setSelectedIeltsTopic('')
    setSelectedIeltsList('')
    ensureToeflListLoaded(selectedToeflLevel, listKey)
    setMode('learn')
    setView('learn')
  }

  const handleStartAllToefl = () => {
    pendingStartWordIdRef.current = null
    setAssessmentBackTarget('home')
    setSelectedCategory('toefl')
    setSelectedToeflLevel('')
    setSelectedToeflList('')
    setSelectedIeltsTopic('')
    setSelectedIeltsList('')
    ensureAllToeflLoaded()
    setMode('learn')
    setView('learn')
  }

  const handleStartCurrentLevel = () => {
    pendingStartWordIdRef.current = null
    setAssessmentBackTarget('home')
    setSelectedCategory('toefl')
    setSelectedToeflList('')
    setSelectedIeltsTopic('')
    setSelectedIeltsList('')
    ensureToeflLevelLoaded(selectedToeflLevel)
    setMode('learn')
    setView('learn')
  }

  const handleIeltsTopicSelect = (topicKey) => {
    pendingStartWordIdRef.current = null
    setSelectedCategory('ielts')
    setSelectedToeflLevel('')
    setSelectedToeflList('')
    setSelectedIeltsTopic(topicKey)
    setSelectedIeltsList('')

    const nextLists = ieltsGrouping.listsByTopic[topicKey] || []
    if (nextLists.length === 0) {
      setMode('learn')
    }
    setView(nextLists.length > 0 ? 'ieltsLists' : 'learn')
  }

  const handleIeltsListSelect = (listKey) => {
    pendingStartWordIdRef.current = null
    setAssessmentBackTarget('home')
    setSelectedCategory('ielts')
    setSelectedToeflLevel('')
    setSelectedToeflList('')
    if (!selectedIeltsTopic) {
      setSelectedIeltsTopic(getIeltsTopicKey(listKey))
    }
    setSelectedIeltsList(listKey)
    ensureIeltsListLoaded(listKey)
    setMode('learn')
    setView('learn')
  }

  const handleStartAllIelts = () => {
    pendingStartWordIdRef.current = null
    setAssessmentBackTarget('home')
    setSelectedCategory('ielts')
    setSelectedToeflLevel('')
    setSelectedToeflList('')
    setSelectedIeltsTopic('')
    setSelectedIeltsList('')
    ensureAllIeltsLoaded()
    setMode('learn')
    setView('learn')
  }

  const handleStartCurrentIeltsTopic = () => {
    pendingStartWordIdRef.current = null
    setAssessmentBackTarget('home')
    setSelectedCategory('ielts')
    setSelectedToeflLevel('')
    setSelectedToeflList('')
    setSelectedIeltsList('')
    ensureIeltsTopicLoaded(selectedIeltsTopic)
    setMode('learn')
    setView('learn')
  }

  return {
    handleCategorySelect, openToeflLevels, openIeltsTopics, handleToeflLevelSelect, handleToeflListSelect,
    handleStartAllToefl, handleStartCurrentLevel, handleIeltsTopicSelect, handleIeltsListSelect,
    handleStartAllIelts, handleStartCurrentIeltsTopic,
  }
}
