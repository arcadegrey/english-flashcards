// One write at a time; queued writes read the latest state when they actually run.
// Invalidation also discards late responses from a previous account session.
export function createProgressSyncQueue() {
  let generation = 0;
  let tail = Promise.resolve();
  return {
    enqueue(operation) {
      const requestedGeneration = generation;
      const isCurrent = () => requestedGeneration === generation;
      const result = tail.catch(() => {}).then(() => isCurrent() ? operation(isCurrent) : '');
      tail = result;
      return result;
    },
    invalidate() {
      generation += 1;
      tail = Promise.resolve();
    },
  };
}
