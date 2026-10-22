import { boundExamCache, createExamAttempt } from '../../shared/examAttempts.js';

const historyKey = ownerId => `flashcards_exam_attempts:${ownerId || 'guest'}`;
export const examDraftKey = (ownerId, mode, category, scope) => `flashcards_exam_draft:${ownerId || 'guest'}:${mode}:${category}:${scope}`;

export function readExamHistory(ownerId) {
  try {
    const data = JSON.parse(localStorage.getItem(historyKey(ownerId)) || '{}');
    return boundExamCache(Array.isArray(data.attempts) ? data.attempts : [], Array.isArray(data.pending) ? data.pending : []);
  } catch { return { attempts: [], pending: [] }; }
}

// Pure store keeps writes durable before notifying React; pending entries cannot be evicted.
export function createExamHistoryStore(ownerId, request, onChange = () => {}) {
  let current = readExamHistory(ownerId);
  let queue = Promise.resolve();
  const save = (value, acknowledged = []) => {
    const disk = readExamHistory(ownerId);
    const bounded = boundExamCache([...disk.attempts, ...value.attempts],
      [...new Set([...disk.pending, ...value.pending])].filter(id => !acknowledged.includes(id)));
    localStorage.setItem(historyKey(ownerId), JSON.stringify(bounded));
    current = bounded;
    onChange(current);
  };
  return {
    read: () => current,
    refresh() { current = readExamHistory(ownerId); onChange(current); },
    record(value) {
      const attempt = createExamAttempt(value);
      if (current.attempts.some(item => item.id === attempt.id)) return;
      save({ attempts: [...current.attempts, attempt], pending: ownerId ? [...current.pending, attempt.id] : [] });
    },
    sync(signal) {
      if (!ownerId) return Promise.resolve();
      queue = queue.catch(() => {}).then(async () => {
        for (const id of [...current.pending]) {
          if (signal.aborted) return;
          const attempt = current.attempts.find(item => item.id === id);
          const result = await request('/exam-attempts', { method: 'POST', body: attempt, expectedUserId: ownerId, signal });
          if (signal.aborted) return;
          save({ attempts: [...current.attempts.filter(item => item.id !== id), result.attempt], pending: current.pending.filter(key => key !== id) }, [id]);
        }
        const result = await request('/exam-attempts', { expectedUserId: ownerId, signal });
        if (!signal.aborted) save({ ...current, attempts: [...current.attempts, ...result.attempts] });
      });
      return queue;
    },
  };
}
