import { useEffect, useRef } from 'react'

const NAVIGATION_STATE_KEY = 'english_flashcards_navigation_v1'

// Browser history mirrors view state; it never restores assignment sessions or learning data.
export function useNavigationHistory({
  view, mode, selectedCategory, selectedToeflLevel, selectedToeflList, selectedIeltsTopic, selectedIeltsList, selectedReadingId,
}, {
  setView, setMode, setSelectedCategory, setSelectedToeflLevel, setSelectedToeflList, setSelectedIeltsTopic, setSelectedIeltsList, setSelectedReadingId,
  setActiveReadingAssignment, setActiveWordAssignment, setReadingRetry, setHomePanelRequest,
}) {
  const historyReadyRef = useRef(false)
  const restoringFromHistoryRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const initialState = {
      __appNavigation: NAVIGATION_STATE_KEY,
      view: 'studyHub',
      mode: 'learn',
      selectedCategory: 'all',
      selectedToeflLevel: '',
      selectedToeflList: '',
      selectedIeltsTopic: '',
      selectedIeltsList: '',
      selectedReadingId: null,
    }

    window.history.replaceState(initialState, '', window.location.href)
    historyReadyRef.current = true

    const handlePopState = (event) => {
      const state = event.state
      restoringFromHistoryRef.current = true

      if (!state || state.__appNavigation !== NAVIGATION_STATE_KEY) {
        setView('studyHub')
        setMode('learn')
        setSelectedCategory('all')
        setSelectedToeflLevel('')
        setSelectedToeflList('')
        setSelectedIeltsTopic('')
        setSelectedIeltsList('')
        setSelectedReadingId(null)
        return
      }

      setActiveReadingAssignment(null)
      setActiveWordAssignment(null)
      setReadingRetry(null)
      const restoredView = typeof state.view === 'string' ? state.view : 'studyHub'
      if (restoredView === 'readingList') {
        setHomePanelRequest((request) => ({ panel: 'reading', nonce: request.nonce + 1 }))
        setView('home')
      } else {
        setView(restoredView)
      }
      setMode(typeof state.mode === 'string' ? state.mode : 'learn')
      setSelectedCategory(typeof state.selectedCategory === 'string' ? state.selectedCategory : 'all')
      setSelectedToeflLevel(
        typeof state.selectedToeflLevel === 'string' ? state.selectedToeflLevel : ''
      )
      setSelectedToeflList(typeof state.selectedToeflList === 'string' ? state.selectedToeflList : '')
      setSelectedIeltsTopic(typeof state.selectedIeltsTopic === 'string' ? state.selectedIeltsTopic : '')
      setSelectedIeltsList(typeof state.selectedIeltsList === 'string' ? state.selectedIeltsList : '')
      setSelectedReadingId(state.selectedReadingId ?? null)
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [setView, setMode, setSelectedCategory, setSelectedToeflLevel, setSelectedToeflList, setSelectedIeltsTopic, setSelectedIeltsList, setSelectedReadingId, setActiveReadingAssignment, setActiveWordAssignment, setReadingRetry, setHomePanelRequest])

  useEffect(() => {
    if (typeof window === 'undefined' || !historyReadyRef.current) return

    const nextState = {
      __appNavigation: NAVIGATION_STATE_KEY,
      view,
      mode,
      selectedCategory,
      selectedToeflLevel,
      selectedToeflList,
      selectedIeltsTopic,
      selectedIeltsList,
      selectedReadingId,
    }

    if (restoringFromHistoryRef.current) {
      restoringFromHistoryRef.current = false

      const currentState = window.history.state
      if (!currentState || currentState.__appNavigation !== NAVIGATION_STATE_KEY) {
        window.history.replaceState(nextState, '', window.location.href)
      }
      return
    }

    const currentState = window.history.state
    const isSameState =
      currentState &&
      currentState.__appNavigation === NAVIGATION_STATE_KEY &&
      currentState.view === nextState.view &&
      currentState.mode === nextState.mode &&
      currentState.selectedCategory === nextState.selectedCategory &&
      currentState.selectedToeflLevel === nextState.selectedToeflLevel &&
      currentState.selectedToeflList === nextState.selectedToeflList &&
      currentState.selectedIeltsTopic === nextState.selectedIeltsTopic &&
      currentState.selectedIeltsList === nextState.selectedIeltsList &&
      currentState.selectedReadingId === nextState.selectedReadingId

    if (isSameState) return
    window.history.pushState(nextState, '', window.location.href)
  }, [view, mode, selectedCategory, selectedToeflLevel, selectedToeflList, selectedIeltsTopic, selectedIeltsList, selectedReadingId])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [view])
}
