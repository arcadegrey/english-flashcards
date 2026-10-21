import { useCallback, useEffect, useRef, useState } from 'react';
import { requestApi } from '../utils/workerAuth';
import { readReadingDraft, writeReadingDraft } from '../utils/readingDrafts';

export default function useReadingDraft(ownerId, sessionKey, endpoint) {
  const [session, setSession] = useState(() => readReadingDraft(ownerId, sessionKey));
  const [loaded, setLoaded] = useState(!ownerId);
  const [status, setStatus] = useState(ownerId ? 'loading' : 'local');
  const [error, setError] = useState('');
  const latest = useRef(session);
  const savedVersion = useRef('');
  const queue = useRef(Promise.resolve());
  const path = endpoint || `/reading-sessions/${encodeURIComponent(sessionKey)}`;

  const keepLocal = useCallback((value) => {
    latest.current = value;
    setSession(value);
    try { writeReadingDraft(ownerId, sessionKey, value); }
    catch { setError('本机存储空间不足，请保持页面打开并同步答题。'); }
  }, [ownerId, sessionKey]);

  const flush = useCallback(() => {
    const snapshot = latest.current;
    if (!ownerId || !snapshot.updatedAt) return Promise.resolve();
    const operation = queue.current.catch(() => {}).then(async () => {
      if (savedVersion.current === snapshot.updatedAt) return;
      setStatus('syncing'); setError('');
      try {
        const result = await requestApi(path, { method: 'PUT', body: snapshot, expectedUserId: ownerId, signal: AbortSignal.timeout(15000) });
        savedVersion.current = result.session.updatedAt;
        if (latest.current.updatedAt === snapshot.updatedAt) {
          keepLocal(result.session);
          setStatus('synced');
        }
      } catch (err) {
        setStatus('error'); setError(err.message || '答题暂未同步，已保留本机记录。');
        throw err;
      }
    });
    queue.current = operation;
    return operation;
  }, [keepLocal, ownerId, path]);

  useEffect(() => {
    if (!ownerId) return undefined;
    const controller = new AbortController();
    const load = async () => {
      try {
        const result = await requestApi(path, { expectedUserId: ownerId, signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]) });
        if (controller.signal.aborted) return;
        if (result.session?.updatedAt >= latest.current.updatedAt) {
          keepLocal(result.session); savedVersion.current = result.session.updatedAt;
          setStatus('synced');
        } else setStatus(latest.current.updatedAt ? 'pending' : 'local');
      } catch (err) {
        if (!controller.signal.aborted) { setError(err.message); setStatus('error'); }
      } finally { if (!controller.signal.aborted) setLoaded(true); }
    };
    load();
    return () => controller.abort();
  }, [keepLocal, ownerId, path]);

  useEffect(() => {
    if (!loaded || !ownerId || !session.updatedAt || session.updatedAt === savedVersion.current) return undefined;
    const timer = setTimeout(() => { flush().catch(() => {}); }, 700);
    return () => clearTimeout(timer);
  }, [flush, loaded, ownerId, session]);

  useEffect(() => {
    const retry = () => { flush().catch(() => {}); };
    window.addEventListener('online', retry);
    return () => window.removeEventListener('online', retry);
  }, [flush]);

  const answer = (questionId, optionId) => {
    const updatedAt = new Date(Math.max(Date.now(), (Date.parse(latest.current.updatedAt) || 0) + 1)).toISOString();
    setError('');
    keepLocal({ answers: { ...latest.current.answers, [questionId]: optionId }, updatedAt });
    setStatus(ownerId ? 'pending' : 'local');
  };
  return { session, answer, flush, status, error };
}
