import { useEffect, useMemo, useState } from 'react';
import manifest from '../data/wordHintsManifest.json';
import { createWordHintLoader } from '../data/wordHintCache.js';
import { getEntryWordHints } from '../utils/wordHintPresentation.js';
import { loadWordHintFallback } from '../data/wordHintFallback.js';

const load = createWordHintLoader({ manifest, loadFallback: loadWordHintFallback });
export function useWordHints(word, { enabled = true } = {}) {
  const [state, setState] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const id = word?.id, spelling = word?.word;
  const pos = word?.pos, meaning = word?.meaning, phonetic = word?.phonetic, example = word?.example, exampleCn = word?.exampleCn;
  const snapshot = useMemo(() => ({ id, word: spelling, pos, meaning, phonetic, example, exampleCn }), [id, spelling, pos, meaning, phonetic, example, exampleCn]);
  const key = JSON.stringify(snapshot);
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    load(snapshot).then(result => {
      if (!cancelled) setState({ key, result });
    }).catch(error => { if (!cancelled) setState({ key, error: error.message }); });
    return () => { cancelled = true; };
  }, [snapshot, key, attempt, enabled]);
  useEffect(() => {
    if (!enabled) return;
    const retry = () => setAttempt(value => value + 1);
    window.addEventListener('online', retry);
    return () => window.removeEventListener('online', retry);
  }, [enabled]);
  const current = state?.key === key ? state : null;
  return { hints: current?.result?.hints || getEntryWordHints(word || {}),
    status: !current ? enabled ? '正在准备学习提示…' : '' : current.error ? '详细提示尚未准备好；联网后可重试。'
      : '',
    loading: enabled && !current, error: current?.error, retry: () => { setState(null); setAttempt(value => value + 1); },
  };
}
