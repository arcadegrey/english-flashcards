// A stale device must not replace a newer review schedule on reconnect.
// Legacy schedules without timestamps keep the established incoming-last rule.
export function mergeWordProgress(base = {}, incoming = {}) {
  const result = { ...base };
  for (const [id, next] of Object.entries(incoming || {})) {
    const current = result[id];
    const currentTime = Date.parse(current?.lastReviewed || '');
    const nextTime = Date.parse(next?.lastReviewed || '');
    if (Number.isFinite(currentTime) && (!Number.isFinite(nextTime) || currentTime > nextTime)) continue;
    result[id] = next;
  }
  return result;
}
