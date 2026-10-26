import { readFile, writeFile } from 'node:fs/promises';
import { isDeepStrictEqual } from 'node:util';
import { beforeSenseReview } from '../shared/vocabularyHistory.js';
const read = async path => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'));
const [vocabulary, audit, inclusion, quality, followup, senseReview] = await Promise.all([
  read('public/data/vocabulary.json'), read('docs/base-vocabulary-audit.json'),
  read('docs/vocabulary-inclusion-audit.json'), read('data/vocabulary-quality-2026-10-25.json'),
  read('data/vocabulary-followup/reviews-2026-10-25.json'),
  read('data/sense-review/reviews-2026-10-26.json'),
]);
const active = new Map(vocabulary.map(word => [word.id, word]));
const corrected = new Map();
for (const review of [...quality.reviews, ...followup.reviews, ...senseReview.reviews]) {
  const previous = corrected.get(review.id);
  corrected.set(review.id, { ...review, changedFields: [...new Set([...(previous?.changedFields || []), ...review.changedFields])] });
}
const sourceReviewed = new Map(followup.reviews.filter(review => review.status === 'resolved').map(review => [review.id, review]));
// Keep the original 111-candidate queue reproducible even if the general
// screening report is regenerated against repaired content later.
const base = (followup.baselineCandidates || audit.candidates).map(candidate => {
  const word = active.get(candidate.id);
  const fixed = candidate.rule.startsWith('missing_') && Boolean(String(word?.[candidate.rule.slice(8)] || '').trim());
  const reviewed = sourceReviewed.get(candidate.id);
  const matches = reviewed && isDeepStrictEqual(beforeSenseReview([word])[0], reviewed.after);
  return { ...candidate, status: !word ? 'retired_reference_only' : matches ? 'resolved_source_review' : fixed && !reviewed ? 'resolved_field' : 'needs_source_review',
    ...(matches ? { reviewRegister: 'data/vocabulary-followup/reviews-2026-10-25.json', checkedAt: reviewed.checkedAt } : {}),
    ...(word ? { current: word } : {}), correctedFields: corrected.get(candidate.id)?.changedFields || [] };
});
const sense = inclusion.records.filter(record => ['sense_review', 'restricted_context'].includes(record.decision)).map(record => ({
  id: record.id, word: record.word, decision: record.decision, finding: record.reason,
  status: !active.has(record.id) ? 'retired_reference_only'
    : senseReview.reviews.some(review => review.id === record.id && isDeepStrictEqual(active.get(record.id), review.after)) ? 'resolved_source_review'
    : corrected.has(record.id) ? 'partially_corrected_followup_required' : 'needs_source_review',
  correctedFields: corrected.get(record.id)?.changedFields || [],
  // Do not close a sense/register curriculum review just because one field was repaired.
  nextAction: !active.has(record.id) ? '已按用户要求退出活动词库；保留历史 ID、文本与音频，不把旧进度转给新词。'
    : senseReview.reviews.some(review => review.id === record.id && isDeepStrictEqual(active.get(record.id), review.after)) ? '本轮来源复核完成；独立语言审校与生产验收仍需另行执行。'
    : record.id === 8123 ? '区分 lame 与织物名 lamé；需明确教学义项、重写基础例句并重制例句录音，再发布。'
    : record.id === 6409 ? '核实基础释义、King Kong 专名例句与专业义提示冲突；不可静默换义或迁移成绩。'
    : record.decision === 'restricted_context' ? '核实限定语境的展示与出题策略；历史记录与已发布快照保留。'
    : '逐条核实当前教学义项、提示、语域和英文例句；文本或读音变化须同步版本音频。',
}));
const count = records => Object.fromEntries([...new Set(records.map(record => record.status))].map(status => [status, records.filter(record => record.status === status).length]));
const report = { date: '2026-10-26', scope: '历史待核项去重分流与本轮字段修复跟踪；不是全量语言审校完成证明。',
  summary: { baseCandidates: count(base), inclusionCandidates: count(sense), correctedRecords: corrected.size }, base, sense };
await writeFile(new URL('../docs/vocabulary-quality-followup.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report.summary));
