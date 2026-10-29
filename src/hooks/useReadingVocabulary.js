import { useCallback, useEffect, useMemo, useState } from 'react'
import { loadReadingVocabulary } from '../data/readingVocabulary.js'
import { buildReadingWordLookup } from '../data/readingVocabularyLoader.js'

export function useReadingVocabulary(article, customWords, scope) {
  const content = article?.content, path = article?.contentDeferred ? article.contentPath : ''
  const key = article ? JSON.stringify([scope, path, content]) : ''
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState(null)
  useEffect(() => {
    if (!key) return undefined
    let cancelled = false
    loadReadingVocabulary(path ? { contentDeferred: true, contentPath: path } : { content }).then(words => {
      if (!cancelled) setResult({ key, attempt, words })
    }).catch(error => {
      if (!cancelled) setResult({ key, attempt, error: error?.message || '阅读词汇加载失败，请重试。' })
    })
    return () => { cancelled = true }
  }, [key, path, content, attempt])
  const current = result?.key === key && result.attempt === attempt ? result : null
  const wordLookup = useMemo(() => buildReadingWordLookup(current?.words || [], customWords), [current?.words, customWords])
  const retry = useCallback(() => setAttempt(value => value + 1), [])
  return { wordLookup, loading: Boolean(key && !current), error: current?.error || '', retry }
}
