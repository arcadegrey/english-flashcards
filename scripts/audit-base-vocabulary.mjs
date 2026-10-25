import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { CORE_WORD_NOTES, CORE_SYNONYM_GROUPS, WORD_NOTE_SOURCES } from '../src/data/coreWordNotes.js';
import { RETIRED_VOCABULARY } from '../shared/retiredVocabulary.js';

// Read-only screening. Only report files are written; never import/split vocabulary.
const root = new URL('../', import.meta.url);
const raw = await readFile(new URL('public/data/vocabulary.json', root), 'utf8');
const vocabulary = JSON.parse(raw);
const reviewFile = JSON.parse(await readFile(new URL('data/vocabulary-audit-reviews.json', root), 'utf8'));
const normalize = value => String(value || '').trim().toLowerCase();
const referenceVocabulary = [...RETIRED_VOCABULARY, ...vocabulary];
const byWord = new Map(referenceVocabulary.map(entry => [normalize(entry.word), entry]));
const byId = new Map(referenceVocabulary.map(entry => [entry.id, entry]));
const hash = createHash('sha256').update(raw).digest('hex');
const kinds = {
  spelling: '词头拼写', sense_alignment: '释义／例句义项错配', definition_quality: '异常释义',
  proper_name: '专名混淆', factual_typo: '事实笔误', register: '使用语域缺失',
  truncated_example: '英文例句截断', translation: '中文译文错误',
};
const groupFor = word => CORE_SYNONYM_GROUPS[CORE_WORD_NOTES[normalize(word)]?.synonymGroup];
const reviewed = reviewFile.reviews.map(review => {
  const entry = review.id ? byId.get(review.id) : byWord.get(normalize(review.word));
  if (!entry) throw Error(`Reviewed entry missing: ${review.word}`);
  const group = groupFor(entry.word);
  const sources = [...(review.sources || []), ...(group?.sourceIds || []).map(id => WORD_NOTE_SOURCES[id])]
    .filter(Boolean).filter((source, index, all) => all.findIndex(item => item.url === source.url) === index)
    .map(({ title, url }) => ({ title, url }));
  const status = review.status === 'resolved' && JSON.stringify(entry) !== JSON.stringify(review.after)
    ? 'needs_review' : review.status;
  return { ...review, status, id: entry.id, current: { word: entry.word, pos: entry.pos, meaning: entry.meaning,
    example: entry.example, exampleCn: entry.exampleCn }, sources };
});
const reviewedWords = new Set(reviewed.map(item => normalize(item.current.word)));
const candidates = [];
const missingFields = Object.fromEntries(['word', 'meaning', 'pos', 'phonetic', 'example', 'exampleCn']
  .map(field => [field, vocabulary.filter(entry => !String(entry[field] || '').trim()).length]));
const seenIds = new Set(), seenWords = new Set();
const duplicates = [];
const preservedHeadwordPairs = reviewFile.reviews.filter(item => item.sameHeadwordId).map(item => [item.id, item.sameHeadwordId]);
const preservedHeadwordCollisions = [];
const firstIdByWord = new Map();
for (const entry of vocabulary) {
  const key = normalize(entry.word);
  if (seenIds.has(entry.id)) duplicates.push({ id: entry.id, word: entry.word, field: 'id' });
  if (seenWords.has(key)) {
    const firstId = firstIdByWord.get(key);
    const preserved = preservedHeadwordPairs.some(pair => pair.includes(firstId) && pair.includes(entry.id));
    (preserved ? preservedHeadwordCollisions : duplicates).push({ id: entry.id, word: entry.word, firstId, field: 'normalized_word' });
  } else firstIdByWord.set(key, entry.id);
  seenIds.add(entry.id); seenWords.add(key);
  for (const field of ['word', 'meaning', 'pos', 'phonetic', 'example', 'exampleCn']) {
    if (!String(entry[field] || '').trim()) candidates.push({ id: entry.id, word: entry.word,
      rule: `missing_${field}`, status: 'needs_review', finding: `缺少 ${field}；需人工补核，不自动生成。` });
  }
  if (reviewedWords.has(key)) continue;
  const en = String(entry.example || '').trim();
  // High-precision fragment clues; a hit is still a candidate, not a verdict.
  const fragment = /\b(?:of|than|a|an|the)[.!]$/i.test(en) ||
    /\b(?:a|an|the|her|his|their|several|few|six)\s+(?:\w+\s+){0,2}(?:long|short|old|large|beautiful|chilly)[.!]$/i.test(en) ||
    /\bwere once part[.!]$/i.test(en);
  const excluded = reviewFile.screeningExclusions.some(item => normalize(item.word) === key && item.rule === 'possible_truncation');
  if (fragment && !excluded) candidates.push({ id: entry.id, word: entry.word,
    rule: 'possible_truncation', status: 'needs_review', finding: en });
  const group = groupFor(entry.word);
  if (/人名|姓氏|名字|专有名词/.test(group?.sense || '')) {
    const labels = group.sense.split(/\s*·\s*/).slice(1).join(' · ').split(/[；;／/]/)
      .map(label => label.replace(/（.*?）|\(.*?\)/g, '').replace(/(?:地区|州|郡|市|山脉)$/, '').trim());
    const hasLabel = labels.some(label => label.length > 1 && String(entry.meaning).includes(label));
    const hasNameMarker = /人名|姓氏|（姓|\(姓|[男女]子?名|名字/.test(entry.meaning);
    const excludedSense = reviewFile.screeningExclusions.some(item => normalize(item.word) === key && item.rule === 'sense_alignment');
    if (!hasLabel && !hasNameMarker && !excludedSense) candidates.push({ id: entry.id, word: entry.word,
      rule: 'possible_sense_alignment', status: 'needs_review', finding: `原释义：${entry.meaning}；提示范围：${group.sense}。两者不同不自动代表错误。` });
  }
}
const report = {
  auditDate: reviewFile.auditDate, scope: reviewFile.scope, input: 'public/data/vocabulary.json', inputSha256: hash,
  summary: { recordsScreened: vocabulary.length, reviewedIssueRecords: reviewed.length,
    confirmedUniqueWords: reviewedWords.size,
    resolvedRecords: reviewed.filter(item => item.status === 'resolved').length,
    unresolvedRecords: reviewed.filter(item => item.status !== 'resolved').length, candidateRecords: candidates.length,
    candidateUniqueWords: new Set(candidates.map(item => normalize(item.word))).size,
    duplicateRecords: duplicates.length, preservedHeadwordCollisions: preservedHeadwordCollisions.length, missingFields,
    specialistDomainMarkers: vocabulary.filter(entry => /\[(?:医|计|电|法|经|化)\]/.test(entry.meaning)).length },
  reviewed, candidates, duplicates, preservedHeadwordCollisions, screeningExclusions: reviewFile.screeningExclusions,
};
const cell = value => String(value || '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
const lines = ['# 基础词库首轮质量审计', '', `审计批次：${report.auditDate}。`, '',
  '**范围：全库程序筛查 + 首轮高风险记录逐条复核，本轮由单一模型完成。没有完成全库逐词或独立语言专家审校，未命中规则不等于内容正确。**', '',
  `- 已筛查：${vocabulary.length} 个词条；已确认 ${reviewed.length} 条记录问题（${reviewedWords.size} 个不同词）；已修复 ${report.summary.resolvedRecords} 条，待处理 ${report.summary.unresolvedRecords} 条。`,
  `- 自动待复核：${candidates.length} 条线索（${report.summary.candidateUniqueWords} 个不同词），不能当作已确认错误，也不能与已复核问题数直接相加。`,
  `- 未登记重复 ID／词头：${duplicates.length}；为保留历史 ID 而登记的同形词对 ${preservedHeadwordCollisions.length}；缺音标 ${missingFields.phonetic} 条，缺词性 ${missingFields.pos} 条；词头、释义及双语例句缺失数见 JSON。`,
  `- 带旧专业领域标签的释义：${report.summary.specialistDomainMarkers} 条，仅作规模提示；标签本身不是错误。`,
  '- 首轮问题原文和 before 快照保留；下列 current 是当前词库。resolved 表示本地文本已修复，音频及部署验收见 `vocabulary-repair-2026-10-24.md`。审计脚本本身仍只写报告。', '',
  '## 已确认问题分布', '', '| 类别 | 记录数 |', '| --- | ---: |'];
for (const [kind, title] of Object.entries(kinds)) lines.push(`| ${title} | ${reviewed.filter(item => item.kind === kind).length} |`);
lines.push('', '## 已确认问题清单', '',
  '这里确认的是当前记录存在的拼写、语境、缺项或译文问题；不据此宣布所有旧义项不存在。修复状态以本地词库与 after 快照比对为准，不代表已部署上线。词条引用用于义项／拼写核对；截断和译文判断依据本地双语文本，不表示词典逐句审校了这些例句。', '');
for (const item of reviewed) {
  lines.push(`### ${item.id} · ${item.word} · ${item.priority} · ${kinds[item.kind]}`, '',
    `- 状态：${item.status}；当前词头：${item.current.word}`,
    `- 修复前释义：${cell(item.before?.meaning || item.current.meaning)}`,
    `- 当前释义：${cell(item.current.meaning)}`,
    `- 当前英文：${cell(item.current.example)}`,
    `- 当前中文：${cell(item.current.exampleCn)}`,
    `- 问题：${item.finding}`,
    `- 建议：${item.recommendation}`,
    item.sources.length ? `- 参考：${item.sources.map(source => `[${source.title}](${source.url})`).join('；')}` : '- 核对依据：当前双语文本的语法／语义对照；修复时仍需复核。', '');
}
lines.push('## 自动待复核线索', '',
  '这些是筛查候选。特别是多义词、姓名、地名和缩写，不能仅凭提示选用了不同义项就改写基础释义。', '',
  '| ID | 词条 | 规则 | 线索 |', '| ---: | --- | --- | --- |');
for (const item of candidates) lines.push(`| ${item.id} | ${cell(item.word)} | ${item.rule} | ${cell(item.finding)} |`);
lines.push('', '## 已识别的误报与保留项', '');
for (const item of reviewFile.screeningExclusions) lines.push(`- **${item.word}**：${item.reason}`);
lines.push('', '## 后续修复顺序与兼容要求', '',
  '1. 先处理两处错拼和明显义项错配，再修复截断例句、错误译文及语域标记。',
  '2. 保留原 ID 和既有学习记录；词头更正应定义旧拼写兼容，并核对所有词库分片、提示键和分配目录。',
  '3. 修改英文例句或词头后，核对静态音频 manifest／文本哈希，重新生成受影响音频并发布；不把文字修正当作音频已经更新。',
  '4. 首轮 33 条问题的修复与验收见 `vocabulary-repair-2026-10-24.md`；其余自动候选仍待独立复核。', '',
  '## 复现与验证', '',
  '- 运行：`node scripts/audit-base-vocabulary.mjs`。逐条复核登记在 `data/vocabulary-audit-reviews.json`。',
  '- 机器报告：`docs/base-vocabulary-audit.json`；候选与确认问题有不同状态字段。',
  `- 输入 SHA-256：\`${hash}\`。脚本只写两份审计报告，并在完成后校验源词库未变。`,
  '- 本脚本不修改词库或运行程序；修复代码、音频、测试与发布状态另见修复交接。', '');
await writeFile(new URL('docs/base-vocabulary-audit.json', root), `${JSON.stringify(report, null, 2)}\n`);
await writeFile(new URL('docs/base-vocabulary-audit.md', root), `${lines.join('\n').trimEnd()}\n`);
const after = await readFile(new URL('public/data/vocabulary.json', root), 'utf8');
if (createHash('sha256').update(after).digest('hex') !== hash) throw Error('Source vocabulary changed during audit');
console.log(JSON.stringify(report.summary, null, 2));
