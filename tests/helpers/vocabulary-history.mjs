import { readFile } from 'node:fs/promises';
const review = JSON.parse(await readFile(new URL('../../data/vocabulary-quality-2026-10-25.json', import.meta.url), 'utf8'));
const followup = JSON.parse(await readFile(new URL('../../data/vocabulary-followup/reviews-2026-10-25.json', import.meta.url), 'utf8'));
const before = new Map(review.reviews.map(item => [item.id, item.before]));
const beforeFollowup = new Map(followup.reviews.map(item => [item.id, item.before]));
export const beforeFollowupReview = words => words.map(word => beforeFollowup.get(word.id) || word);
export const beforeQualityReview = words => beforeFollowupReview(words).map(word => before.get(word.id) || word);
