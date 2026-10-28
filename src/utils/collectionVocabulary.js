// Resolve historical collections only at their page boundary. Keep the recorded
// ID order and let current/custom entries override an archived entry as before.
export function resolveCollectionWords(words, ids, archivedWords) {
  if (!ids) return words
  const byId = new Map([...archivedWords, ...words].map(word => [String(word.id), word]))
  return ids.map(id => byId.get(String(id))).filter(Boolean)
}
