import { useEffect, useMemo, useState } from 'react'
import { loadWordDetails, peekWordDetails } from '../data/vocabulary.js'
import { applyWordDetails, needsWordDetails } from '../data/vocabularySummary.js'

export function useWordDetails(word) {
  const [state, setState] = useState(null)
  const [attempt, setAttempt] = useState(0)
  const id = word?.id, spelling = word?.word, deferred = needsWordDetails(word)
  const key = `${id}\0${spelling}`
  const cached = deferred ? peekWordDetails(word) : null
  const error = deferred && state?.key === key ? state.error : null

  useEffect(() => {
    if (!deferred) return
    let cancelled = false
    loadWordDetails({ id, word: spelling, exampleDeferred: true }).then(() => {
      if (!cancelled) setState({ key })
    }).catch(error => { if (!cancelled) setState({ key, error: error.message }) })
    return () => { cancelled = true }
  }, [id, spelling, key, deferred, attempt])

  useEffect(() => {
    if (!deferred) return
    const retry = () => { setState(null); setAttempt(value => value + 1) }
    window.addEventListener('online', retry)
    return () => window.removeEventListener('online', retry)
  }, [deferred])

  const hydrated = useMemo(() => cached ? applyWordDetails(word, cached) : word, [word, cached])
  return { word: hydrated, loading: deferred && !cached && !error, error: cached ? null : error,
    retry: () => { setState(null); setAttempt(value => value + 1) } }
}
