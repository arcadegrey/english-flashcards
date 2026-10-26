// Reconstruct earlier editorial stages for maintenance/audits, never user progress.
import replacements from '../data/name-place-replacement/replacement-manifest.json' with { type: 'json' };
import retired from '../data/name-place-replacement/retired-2026-10-26.json' with { type: 'json' };
import senseReview from '../data/sense-review/reviews-2026-10-26.json' with { type: 'json' };
const byId = new Map(retired.map(word => [word.id, word]));
const previous = new Map(replacements.replacements.map(item => [item.newId, byId.get(item.retiredId)]));
const beforeSense = new Map(senseReview.reviews.map(review => [review.id, review.before]));
export const beforeSenseReview = words => words.map(word => beforeSense.get(word?.id) || word);
export const beforeNamePlaceReplacement = words => [...new Map(words.map(word => {
  const restored = previous.get(word.id) || beforeSense.get(word.id) || word;
  return [restored.id, restored];
})).values()];
