import { useCallback, useEffect, useRef, useState } from 'react';
import { ExamHistoryContext } from './exam-history-context';
import { createExamHistoryStore } from '../utils/examHistory';
import { requestApi } from '../utils/workerAuth';

// Mounted with an account key: an old request can never update the next account's cache.
export default function ExamHistoryProvider({ ownerId, children }) {
  const [data, setData] = useState(null);
  const [store] = useState(() => createExamHistoryStore(ownerId, requestApi, setData));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const controller = useRef(null);
  const sync = useCallback(async () => {
    if (!ownerId || !controller.current || controller.current.signal.aborted) return;
    const signal = controller.current.signal;
    setBusy(true); setError('');
    try { await store.sync(AbortSignal.any([signal, AbortSignal.timeout(30000)])); }
    catch (err) { if (!signal.aborted) setError(err.message || '成绩暂未同步，本机记录已保留。'); }
    finally { if (!signal.aborted) setBusy(false); }
  }, [ownerId, store]);
  useEffect(() => {
    controller.current = new AbortController();
    sync();
    const online = () => sync();
    const changed = event => {
      if (event.key === `flashcards_exam_attempts:${ownerId || 'guest'}`) { store.refresh(); sync(); }
    };
    window.addEventListener('online', online);
    window.addEventListener('storage', changed);
    return () => { controller.current.abort(); window.removeEventListener('online', online); window.removeEventListener('storage', changed); };
  }, [sync, ownerId, store]);
  const record = value => { store.record(value); sync(); };
  const snapshot = data || store.read();
  return <ExamHistoryContext.Provider value={{ ...snapshot, ownerId, busy, error, sync, record }}>{children}</ExamHistoryContext.Provider>;
}
