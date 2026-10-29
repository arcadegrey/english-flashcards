const idle = Object.freeze({ sentenceId: null, status: 'idle', error: '' });

// Private to one reading view. Its AbortController can stop only its own speech,
// so a late unmount cannot cancel a newer word/example started elsewhere.
export function createSentencePlayback(speak) {
  let active = null, snapshot = idle;
  const listeners = new Set();
  const publish = value => { snapshot = value; for (const listener of [...listeners]) listener(); };
  const stop = () => {
    const previous = active; active = null;
    previous?.controller.abort();
    if (snapshot !== idle) publish(idle);
  };
  const toggle = async sentence => {
    if (!String(sentence?.text || '').trim() || active?.id === sentence.id) { stop(); return; }
    const previous = active;
    const operation = { id: sentence.id, controller: new AbortController() };
    active = operation;
    previous?.controller.abort();
    publish({ sentenceId: sentence.id, status: 'preparing', error: '' });
    try {
      await speak(sentence.text, { rate: 1, signal: operation.controller.signal, onStart: () => {
        if (active === operation) publish({ sentenceId: sentence.id, status: 'playing', error: '' });
      } });
      if (active === operation) { active = null; publish(idle); }
    } catch (error) {
      if (active === operation) {
        active = null;
        const message = error?.message || '';
        publish({ sentenceId: null, status: 'error', error: message.includes('不支持') || message.includes('暂未启动') ? message
          : message === 'not-allowed' ? '浏览器暂时阻止了朗读，请再次点击重试。' : '这句暂时无法朗读，请重试。' });
      }
    }
  };
  return { toggle, stop, getSnapshot: () => snapshot,
    subscribe: listener => { listeners.add(listener); return () => listeners.delete(listener); } };
}
