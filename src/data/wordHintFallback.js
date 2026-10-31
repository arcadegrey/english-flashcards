const attempts = new Map();

export async function loadWordHintFallback(path) {
  const attempt = attempts.get(path) || 0;
  const url = path.replace('/data/word-hints/', '/assets/word-hints/').replace(/\.json$/, '.js');
  try {
    return (await import(/* @vite-ignore */ `${url}${attempt ? `?retry=${attempt}` : ''}`)).default;
  } catch (error) {
    // Failed native imports can be memoized by the browser; explicit retry needs a fresh URL.
    attempts.set(path, attempt + 1);
    throw error;
  }
}
