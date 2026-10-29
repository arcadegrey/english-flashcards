import { useLayoutEffect, useState, useSyncExternalStore } from 'react';
import { createSentencePlayback } from '../utils/sentencePlayback.js';
import { speak } from '../utils/speech.js';

export function useSentencePlayback(content, scopeKey) {
  const [player] = useState(() => createSentencePlayback(speak));
  const state = useSyncExternalStore(player.subscribe, player.getSnapshot, player.getSnapshot);
  useLayoutEffect(() => () => player.stop(), [content, scopeKey, player]);
  return { ...state, toggle: player.toggle, stop: player.stop };
}
