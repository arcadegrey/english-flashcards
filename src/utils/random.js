// Partial Fisher-Yates: selecting a few items needs only that many random draws.
export function sample(list = [], count = list.length, random = Math.random) {
  const pool = [...list];
  const size = Math.max(0, Math.min(Math.floor(count), pool.length));
  for (let i = 0; i < size; i += 1) {
    const j = i + Math.floor(random() * (pool.length - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, size);
}

export const shuffle = (list = []) => sample(list);
