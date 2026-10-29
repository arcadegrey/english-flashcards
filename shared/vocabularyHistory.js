// Reconstruct earlier editorial stages for maintenance/audits, never user progress.
import replacements from '../data/name-place-replacement/replacement-manifest.json' with { type: 'json' };
import retired from '../data/name-place-replacement/retired-2026-10-26.json' with { type: 'json' };
import senseReview from '../data/sense-review/reviews-2026-10-26.json' with { type: 'json' };
import userFeedback from '../data/vocabulary-feedback/reviews-2026-10-29.json' with { type: 'json' };
import teachingP1 from '../data/vocabulary-p1-repair/reviews-2026-10-29.json' with { type: 'json' };
import teachingP2 from '../data/vocabulary-p2-repair/reviews-2026-10-29.json' with { type: 'json' };
import shortExamples from '../data/vocabulary-short-example-repair/reviews-2026-10-29.json' with { type: 'json' };
const byId = new Map(retired.map(word => [word.id, word]));
const previous = new Map(replacements.replacements.map(item => [item.newId, byId.get(item.retiredId)]));
const beforeSense = new Map(senseReview.reviews.map(review => [review.id, review.before]));
const beforeFeedback = new Map(userFeedback.reviews.map(review => [review.id, review.before]));
const beforeP1 = new Map(teachingP1.reviews.map(review => [review.id, review.before]));
const beforeP2 = new Map(teachingP2.reviews.map(review => [review.id, review.before]));
const beforeShort = new Map(shortExamples.reviews.map(review => [review.id, review.before]));
export const beforeShortExampleReview = words => words.map(word => beforeShort.get(word?.id) || word);
export const beforeTeachingP2Review = words => beforeShortExampleReview(words).map(word => beforeP2.get(word?.id) || word);
export const beforeTeachingP1Review = words => beforeTeachingP2Review(words).map(word => beforeP1.get(word?.id) || word);
export const beforeUserFeedbackReview = words => beforeTeachingP1Review(words).map(word => beforeFeedback.get(word?.id) || word);
export const beforeSenseReview = words => beforeUserFeedbackReview(words).map(word => beforeSense.get(word?.id) || word);
export const beforeNamePlaceReplacement = words => [...new Map(beforeUserFeedbackReview(words).map(word => {
  const restored = previous.get(word.id) || beforeSense.get(word.id) || word;
  return [restored.id, restored];
})).values()];
