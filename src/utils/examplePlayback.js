const idle = Object.freeze({ status: 'idle', rate: null, error: '' });

// An exercise owns only its playback. Its cleanup must not stop newer audio
// started by a different page, account, or the shared voice settings.
export function createExamplePlayback(speakExample, timeoutMs = 15000) {
  let active = null, snapshot = idle;
  const listeners = new Set();
  const publish = state => { snapshot = state; for (const listener of [...listeners]) listener(); };
  const stop = () => {
    const previous = active;
    active = null;
    clearTimeout(previous?.timer);
    previous?.controller.abort();
    if (snapshot !== idle) publish(idle);
  };
  const toggle = async (word, rate = 1) => {
    if (active?.wordId === word?.id && active?.rate === rate) { stop(); return; }
    stop();
    if (!word?.example) return;
    const operation = { wordId: word.id, rate, controller: new AbortController() };
    active = operation;
    publish({ status: 'preparing', rate, error: '' });
    operation.timer = setTimeout(() => {
      if (active !== operation) return;
      active = null;
      operation.controller.abort();
      publish({ status: 'error', rate: null, error: '音频加载或播放超时，请检查网络后重试。' });
    }, timeoutMs);
    try {
      await speakExample(word, { rate, recordingOnly: true, signal: operation.controller.signal,
        onStart: () => {
          if (active === operation) {
            clearTimeout(operation.timer);
            publish({ status: 'playing', rate, error: '' });
          }
        } });
      if (active === operation) { active = null; publish(idle); }
    } catch {
      if (active === operation) {
        active = null;
        publish({ status: 'error', rate: null, error: '例句录音暂时无法播放，请检查网络后重试，或换一句。' });
      }
    } finally { clearTimeout(operation.timer); }
  };
  return { toggle, stop, getSnapshot: () => snapshot,
    subscribe: listener => { listeners.add(listener); return () => listeners.delete(listener); } };
}
