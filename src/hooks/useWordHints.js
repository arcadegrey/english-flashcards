import { useEffect, useState } from 'react';
import manifest from '../data/wordHintsManifest.json';
import { createWordHintLoader } from '../data/wordHintCache.js';
import { getEntryWordHints } from '../utils/wordHintPresentation.js';
import { loadWordHintFallback } from '../data/wordHintFallback.js';

const load = createWordHintLoader({ manifest, loadFallback: loadWordHintFallback });
export function useWordHints(word, { enabled = true } = {}) {
  const [state, setState] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const id = word?.id, spelling = word?.word;
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    load({ id, word: spelling }).then(result => {
      if (!cancelled) setState({ id, spelling, result });
    }).catch(error => { if (!cancelled) setState({ id, spelling, error: error.message }); });
    return () => { cancelled = true; };
  }, [id, spelling, attempt, enabled]);
  useEffect(() => {
    if (!enabled) return;
    const retry = () => setAttempt(value => value + 1);
    window.addEventListener('online', retry);
    return () => window.removeEventListener('online', retry);
  }, [enabled]);
  const current = state?.id === id && state?.spelling === spelling ? state : null;
  return { hints: current?.result?.hints || getEntryWordHints(word || {}),
    status: !current ? enabled ? '正在准备学习提示…' : '' : current.error ? '详细提示尚未准备好；联网后可重试。'
      : '',
    loading: enabled && !current, error: current?.error, retry: () => { setState(null); setAttempt(value => value + 1); },
  };
}
