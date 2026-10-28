import { useMemo } from 'react'
import {
  buildToeflGrouping, buildIeltsGrouping, filterVocabularySelection, getVocabularySelectionLabel,
} from '../utils/vocabularyCatalog.js'

// Memoization belongs at the React boundary; directory models remain independently testable.
export function useVocabularySelection(allVocabulary, toeflManifest, ieltsManifest, {
  selectedCategory, selectedToeflLevel, selectedToeflList, selectedIeltsTopic, selectedIeltsList,
}) {
  const toeflGrouping = useMemo(() => buildToeflGrouping(allVocabulary, toeflManifest), [allVocabulary, toeflManifest])
  const ieltsGrouping = useMemo(() => buildIeltsGrouping(allVocabulary, ieltsManifest), [allVocabulary, ieltsManifest])
  const filteredVocabulary = useMemo(() => filterVocabularySelection(allVocabulary, {
    selectedCategory, selectedToeflLevel, selectedToeflList, selectedIeltsTopic, selectedIeltsList,
  }), [allVocabulary, selectedCategory, selectedToeflLevel, selectedToeflList, selectedIeltsTopic, selectedIeltsList])
  const toeflListsForSelectedLevel = useMemo(() => {
    if (!selectedToeflLevel) return []
    return toeflGrouping.listsByLevel[selectedToeflLevel] || []
  }, [selectedToeflLevel, toeflGrouping.listsByLevel])
  const ieltsListsForSelectedTopic = useMemo(() => {
    if (!selectedIeltsTopic) return []
    return ieltsGrouping.listsByTopic[selectedIeltsTopic] || []
  }, [ieltsGrouping.listsByTopic, selectedIeltsTopic])
  const currentCategoryName = useMemo(() => getVocabularySelectionLabel({
    selectedCategory, selectedToeflLevel, selectedToeflList, selectedIeltsTopic, selectedIeltsList,
  }, { topics: ieltsGrouping.topics }), [ieltsGrouping.topics, selectedCategory, selectedToeflLevel, selectedToeflList, selectedIeltsTopic, selectedIeltsList])

  return { filteredVocabulary, toeflGrouping, ieltsGrouping, toeflListsForSelectedLevel, ieltsListsForSelectedTopic, currentCategoryName }
}
