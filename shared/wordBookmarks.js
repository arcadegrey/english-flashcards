// Retain removals so an older device cannot revive a bookmark.
export const normalizeWordBookmarks = (value) => Object.fromEntries(
  Object.entries(value && typeof value === 'object' && !Array.isArray(value) ? value : {})
    .filter(([id, entry]) => id.length > 0 && id.length <= 128 &&
      !['__proto__', 'constructor', 'prototype'].includes(id) &&
      typeof entry?.saved === 'boolean' && typeof entry.updatedAt === 'string' &&
      Number.isFinite(Date.parse(entry.updatedAt)))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([id, entry]) => [id, { saved: entry.saved, updatedAt: new Date(entry.updatedAt).toISOString() }])
);

export const mergeWordBookmarks = (base, incoming) => {
  const result = normalizeWordBookmarks(base);
  for (const [id, entry] of Object.entries(normalizeWordBookmarks(incoming))) {
    const previous = Object.hasOwn(result, id) ? result[id] : undefined;
    if (!previous || entry.updatedAt > previous.updatedAt ||
      (entry.updatedAt === previous.updatedAt && !entry.saved)) result[id] = entry;
  }
  return normalizeWordBookmarks(result);
};

export const changeWordBookmark = (bookmarks, wordId, saved, now = Date.now()) => {
  const id = String(wordId ?? '');
  if (!id || id.length > 128 || ['__proto__', 'constructor', 'prototype'].includes(id)) {
    throw new Error('无法收藏这个单词。');
  }
  const current = normalizeWordBookmarks(bookmarks);
  return { ...current, [id]: {
    saved: Boolean(saved),
    updatedAt: new Date(Math.max(now, (Date.parse(current[id]?.updatedAt) || 0) + 1)).toISOString(),
  } };
};
