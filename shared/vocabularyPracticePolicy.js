// Applies only to new exercises. Stored history and published assignments stay readable/gradable.
export const isContextOnlyVocabulary = word => String(word?.id) === '8164'
  && String(word?.word).toLowerCase() === 'negro';
export const practiceVocabulary = words => (Array.isArray(words) ? words : []).filter(word => !isContextOnlyVocabulary(word));
