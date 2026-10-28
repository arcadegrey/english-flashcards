// Canonical integer IDs only: preserve the old exact string-key membership
// without shipping every word's List/detail location in the startup bundle.
export function createVocabularyMembership(ranges) {
  return id => {
    const key = String(id), value = Number(key)
    if (!Number.isSafeInteger(value) || String(value) !== key) return false
    let low = 0, high = ranges.length - 1
    while (low <= high) {
      const middle = (low + high) >>> 1
      const [start, end] = ranges[middle]
      if (value < start) high = middle - 1
      else if (value > end) low = middle + 1
      else return true
    }
    return false
  }
}
