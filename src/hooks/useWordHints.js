import { useEffect, useState } from 'react';
import manifest from '../data/wordHintsManifest.json';
import { createWordHintLoader } from '../data/wordHintCache.js';
import { getEntryWordHints } from '../utils/wordHintPresentation.js';

const load = createWordHintLoader({ manifest });
export function useWordHints(word) {
  const [state, setState] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const id = word?.id, spelling = word?.word;
  useEffect(() => {
    let cancelled = false;
    load({ id, word: spelling }).then(result => {
      if (!cancelled) setState({ id, spelling, result });
    }).catch(error => { if (!cancelled) setState({ id, spelling, error: error.message }); });
    return () => { cancelled = true; };
  }, [id, spelling, attempt]);
  useEffect(() => {
    const retry = () => setAttempt(value => value + 1);
    window.addEventListener('online', retry);
    return () => window.removeEventListener('online', retry);
  }, []);
  const current = state?.id === id && state?.spelling === spelling ? state : null;
  return { hints: current?.result?.hints || getEntryWordHints(word || {}),
    status: !current ? '正在准备学习提示…' : current.error ? '详细提示尚未准备好；联网后可重试，当前词义和例句仍可学习。'
      : current.result?.cached ? '本组提示已保存，可离线查看（不含音频）。' : current.result ? '提示已加载；当前浏览器未能保存离线副本。' : '',
    error: current?.error, retry: () => { setState(null); setAttempt(value => value + 1); },
  };
}
