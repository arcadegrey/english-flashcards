// Read-only inventory: writes audit reports, never vocabulary, shards, hints or audio.
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { getCoreWordHints } from '../src/utils/wordHints.js';
import { beforeTeachingP1Review, beforeTeachingP2Review, beforeShortExampleReview } from '../shared/vocabularyHistory.js';

const root = new URL('../', import.meta.url);
const read = async path => JSON.parse(await readFile(new URL(path, root), 'utf8'));
const hash = value => createHash('sha256').update(value).digest('hex');
const sourcePath = new URL('public/data/vocabulary.json', root);
const raw = await readFile(sourcePath, 'utf8');
const currentVocabulary = JSON.parse(raw), currentSourceHash = hash(raw);
// Preserve the captured screening baseline; later repairs have their own
// before/after register and explicit issue links, not guessed reclassification.
const vocabulary = beforeTeachingP1Review(currentVocabulary);
const sourceHash = hash(JSON.stringify(vocabulary, null, 2) + '\n');
const register = await read('data/vocabulary-teaching-audit/reviews-2026-10-29.json');
const syntax = await read('data/vocabulary-teaching-audit/syntax-screen-2026-10-29.json');
const p1Repair = await read('data/vocabulary-p1-repair/reviews-2026-10-29.json');
const p2Repair = await read('data/vocabulary-p2-repair/reviews-2026-10-29.json');
const shortRepair = await read('data/vocabulary-short-example-repair/reviews-2026-10-29.json');
assert.equal(shortRepair.afterSha256, currentSourceHash, 'Unregistered latest vocabulary edits.');
assert.equal(p2Repair.afterSha256, hash(JSON.stringify(beforeShortExampleReview(currentVocabulary),null,2)+'\n'), 'Unregistered vocabulary changes: do not claim current repair status.');
assert.equal(p1Repair.afterSha256, hash(JSON.stringify(beforeTeachingP2Review(currentVocabulary),null,2)+'\n'));
assert.equal(register.inputSha256, sourceHash, 'Vocabulary changed: review a new snapshot instead of overwriting this historical audit.');
assert.equal(syntax.inputSha256, sourceHash, 'Syntax cues are stale.');
assert.equal(syntax.records.length, vocabulary.length);
assert.equal(new Set(syntax.records.map(row => row.id)).size, vocabulary.length);
const byId = new Map(vocabulary.map(word => [word.id, word]));
const currentById = new Map(currentVocabulary.map(word => [word.id, word]));
const resolutions = new Map([
  ...p1Repair.reviews.flatMap(review => [...review.issueIds, ...review.alsoResolvedIssueIds]
    .map(issueId => [issueId, {reviewId:review.id,batch:'2026-10-29-p1'}])),
  ...p2Repair.reviews.flatMap(review => review.issueIds.map(issueId => [issueId,{reviewId:review.id,batch:'2026-10-29-p2'}])),
]);
const cues = new Map(syntax.records.map(row => [row.id, row]));
const repaired = new Set([6508, 6718, 6919, 7580]);
const normalizeTag = value => ({ a: 'adj', ad: 'adv', vt: 'v', vi: 'v', int: 'interj', art: 'det', article: 'det', modal: 'aux' }[value] || value);
const posTags = value => new Set((String(value).match(/adj|adv|aux|abbr|article|interj|conj|prep|pron|modal|det|num|vt|vi|\bn\b|\bv\b|\ba\b|\bad\b/g) || []).map(normalizeTag));
const glossTags = value => new Set([...String(value).replaceAll('\\n', '\n')
  .matchAll(/(?:^|[^a-z])(adj|adv|vt|vi|v|n|a|ad|prep|pron|conj|interj|int|num|art|aux)\./g)].map(match => normalizeTag(match[1])));
const ruleLabels = {
  pos_gloss_disjoint: '词性字段与释义内标签无交集',
  adjective_label_missing: '释义含形容词义但 pos 未列形容词',
  possible_fragment: '句法模型未找到限定动词或原形动词主句',
  suspicious_ending: '句尾限定词／修饰语或依存片段需复核',
  long_example: '英文分词数达到16，需检查教学负担（不是错误判定）',
};
const coverage = {
  pos_gloss_disjoint: ['pos_alignment'], adjective_label_missing: ['pos_alignment'],
  possible_fragment: ['example_fragment', 'example_cutoff', 'example_grammar'],
  suspicious_ending: ['example_cutoff', 'example_grammar', 'translation_excess'],
  long_example: ['example_generality', 'example_cutoff', 'example_grammar', 'translation_excess'],
};
const issues = register.issues.map((issue, index) => {
  assert(!repaired.has(issue.id), 'Do not reopen the four repaired records as new issues.');
  assert.deepEqual(issue.current, byId.get(issue.id), `${issue.id}: review snapshot mismatch`);
  assert(issue.finding && issue.recommendation);
  assert(issue.sources.every(id => register.sources.some(source => source.id === id)));
  const hints = getCoreWordHints(byId.get(issue.id));
  const issueId = `TQ-${String(index + 1).padStart(3, '0')}`, repair = resolutions.get(issueId);
  return { issueId, ...issue, auditSnapshot: issue.current, current: currentById.get(issue.id),
    resolution: repair ? { status:'resolved_local_text', ...repair }
      : { status:'open' },
    hintScopes: hints.map(hint => hint.scope).filter(Boolean) };
});
assert.equal(new Set(issues.map(issue => `${issue.id}:${issue.kind}`)).size, issues.length);
const exclusions = new Map(register.exclusions.map(item => {
  assert.deepEqual(item.current, byId.get(item.id));
  return [item.id, item];
}));
const candidates = [];
for (const word of vocabulary) {
  const cue = cues.get(word.id), left = posTags(word.pos), right = glossTags(word.meaning), rules = [];
  assert(cue, `${word.id}: missing syntax cues`);
  if (repaired.has(word.id)) continue;
  if (left.size && right.size && ![...left].some(tag => right.has(tag))) rules.push('pos_gloss_disjoint');
  if (right.has('adj') && !left.has('adj')) rules.push('adjective_label_missing');
  if (!cue.finite && !cue.bareVerbRoot) rules.push('possible_fragment');
  const last = cue.tail.at(-1);
  if (cue.wordCount >= 12 && (['DET', 'CCONJ', 'SCONJ'].includes(last?.pos)
    || last?.pos === 'ADJ' || /\b(?:my|your|his|their|our|a|an|the|pure|bring)\.?$/i.test(word.example))) rules.push('suspicious_ending');
  if (cue.wordCount >= 16) rules.push('long_example');
  if (!rules.length) continue;
  const linked = issues.filter(issue => issue.id === word.id);
  const ruledOut = exclusions.get(word.id);
  // A valid imperative or noun use clears only that reviewed cue, never every
  // other possible problem on the same word.
  const pendingRules = rules.filter(rule => !ruledOut?.clearedRules.includes(rule)
    && !linked.some(issue => coverage[rule].includes(issue.kind)));
  candidates.push({ id: word.id, word: word.word, rules, pendingRules,
    disposition: pendingRules.length ? linked.length || ruledOut ? 'partly_reviewed' : 'needs_review'
      : ruledOut ? 'reviewed_no_confirmed_error' : 'reviewed_linked',
    issueIds: linked.map(issue => issue.issueId), exclusionReason: ruledOut?.reason,
    auditSnapshot: word, current: currentById.get(word.id), syntaxCue: cue });
}
const countBy = (items, key) => items.reduce((result, item) => {
  result[item[key]] = (result[item[key]] || 0) + 1; return result;
}, {});
const unique = items => new Set(items.map(item => item.id)).size;
const summary = {
  recordsScreened: vocabulary.length, excludedPreviouslyRepairedIds: [...repaired],
  screeningHitRecords: candidates.length,
  ruleHits: Object.fromEntries(Object.keys(ruleLabels).map(rule => [rule, candidates.filter(item => item.rules.includes(rule)).length])),
  registeredItems: issues.length, registeredDistinctRecords: unique(issues),
  registeredItemsByKind: countBy(issues, 'kind'), registeredItemsByStatus: countBy(issues, 'status'),
  priorityOneDistinctRecords: unique(issues.filter(issue => issue.priority === 'P1')),
  priorityTwoOnlyDistinctRecords: unique(issues.filter(issue => issue.priority === 'P2' && !issues.some(other => other.id === issue.id && other.priority === 'P1'))),
  reviewedExclusions: exclusions.size,
  recordsWithPendingScreeningRules: candidates.filter(item => item.pendingRules.length).length,
  recordsWithNoReviewYet: candidates.filter(item => item.disposition === 'needs_review').length,
  locallyResolvedItems: issues.filter(issue => issue.resolution.status === 'resolved_local_text').length,
  openP1Items: issues.filter(issue => issue.priority === 'P1' && issue.resolution.status === 'open').length,
  openP2Items: issues.filter(issue => issue.priority === 'P2' && issue.resolution.status === 'open').length,
};
const report = { auditDate: register.date, input: 'public/data/vocabulary.json', inputSha256: sourceHash,
  currentSourceSha256: currentSourceHash, screeningAppliesTo:'captured pre-P1/P2 audit snapshot, not the repaired canonical examples',
  scope: register.scope, reviewer: register.reviewer,
  limitations: [
    'All 8699 records received mechanical screening; only listed items and exclusions received this single-model review. No exhaustive word-by-word expert certification.',
    'Parser outputs, word counts, old domain tags and POS-label differences are clues, not independent error verdicts. Literal \\n gloss separators are normalized before tag matching.',
    'Registered items include confirmed record inconsistencies, product-level fragment improvements, editorial suggestions and a source-review item. Do not add them up as confirmed lexical mistranslations.',
    'Some words have several items; status and counts are item-level unless explicitly labelled distinct records. Pending cues may overlap a reviewed issue of another kind.',
    'Only base English example fields were parsed across the full library; hint scopes were compared for reviewed items. No exhaustive hint-example, translation, pronunciation or audio listening audit.',
    'This generator only writes reports. Screening statistics describe the pre-P1/P2 snapshot; issue resolutions retain their P1/P2 batch; current records use the registered latest short-example after-state. Audio release and application checks are documented separately.',
  ], summary, ruleLabels, syntaxMethod: syntax.method, sources: register.sources, issues,
  reviewedExclusions: [...exclusions.values()], candidates, trace: register.trace };
const cell = value => String(value ?? '').replaceAll('\\n', ' / ').replace(/\r?\n/g, ' / ').replaceAll('|', '\\|');
const kindNames = {
  pos_alignment: '词性／当前教学用法未对齐', meaning_sense: '释义／义项／译文错配',
  example_grammar: '例句语法或文字错误', example_cutoff: '例句成分残缺／疑似截断',
  example_fragment: '孤立短语，需改为完整例句', translation_excess: '中文增加英文未表达的信息',
  example_generality: '默认例句不够简单通用', meaning_scope: '释义覆盖范围改进', meaning_needs_source: '可疑释义待核源',
};
const statusNames = { confirmed_record_issue: '已复核记录问题', confirmed_example_fragment: '已复核短语／默认例句不足',
  confirmed_translation_gap: '已复核译文增补差异', editorial_improvement: '教学改进建议', needs_source_review: '待核源，尚非确认错误' };
const sourceLinks = ids => ids.map(id => { const source = register.sources.find(item => item.id === id); return `[${source.title}](${source.url})`; }).join('；');
const lines = [
  '# 词库释义、词性与例句质量：首批问题清单（2026-10-29）', '',
  '**本页保留修复前的审计原文与线索统计，并单列后续修复状态。报告生成器只写文档；全库程序筛查不等于全库逐词审校，独立语言专家复核尚未完成。**', '',
  `**后续修复状态：P1 批次修复 125 项 P1 及 2 项关联 P2，P2 批次修复其余 176 项。当前清单 P1 未修复 ${summary.openP1Items} 项，P2 未修复 ${summary.openP2Items} 项。此结论限本清单，不代表全部未复核线索均无问题。音频及应用验收见 [P1 交接](vocabulary-teaching-p1-repair-2026-10-29.md)和 [P2 交接](vocabulary-teaching-p2-repair-2026-10-29.md)。**`, '',
  `- 筛查 ${summary.recordsScreened} 条活动词条；上轮已修的 gifted／teenage／ulcer／kingdom 四条不作为新问题重复登记。`,
  `- 首批登记 **${summary.registeredItems} 项待办，涉及 ${summary.registeredDistinctRecords} 个不同词条**；同词可同时有词性、短语和释义问题，不能把事项数当单词数。`,
  `- P1 涉及 ${summary.priorityOneDistinctRecords} 个不同词条；仅 P2 涉及 ${summary.priorityTwoOnlyDistinctRecords} 个。P1 是字段／语法／含义对齐优先，P2 包括有效短语的完整例句改写和教学改进，并非所有原表达都不合法。`,
  `- 程序共有 ${summary.screeningHitRecords} 条记录命中至少一条线索；其中 ${summary.recordsWithNoReviewYet} 条尚无本轮逐条结论，另有已复核记录的其他线索仍待核。完整原文和规则见同名 JSON，不能把全部命中都说成错误。`,
  '- 报告中“已复核”指本轮单模型对照原文与注明来源，不是独立语言专家签字。词典链接只支持相应事实，不表示出版社审核过本项目例句。', '',
  '## 优先线索：此前“溃疡、两词例句”', '',
  `**gastric（6602）** 审计时的原句为 \`Gastric ulcer.\`／“胃溃疡。”，已由 P2 批次改成完整句 \`${currentById.get(6602).example}\`。它仍只是与用户原反馈接近的来源候选，不能确认当时展示的具体卡片；ulcer（6919）的既有修复保持不变。`, '',
  '## 分类数量（按事项计，类别之间可能涉及同一个词）', '',
  '| 类型 | 事项数 |', '| --- | ---: |',
  ...Object.entries(summary.registeredItemsByKind).map(([kind, count]) => `| ${kindNames[kind]} | ${count} |`), '',
  '## 结论状态分布（按事项计）', '', '| 状态 | 事项数 |', '| --- | ---: |',
  ...Object.entries(summary.registeredItemsByStatus).map(([status, count]) => `| ${statusNames[status]} | ${count} |`), '',
];
for (const kind of ['meaning_sense', 'example_grammar', 'example_cutoff', 'pos_alignment', 'example_fragment', 'translation_excess', 'example_generality', 'meaning_scope', 'meaning_needs_source']) {
  const entries = issues.filter(issue => issue.kind === kind);
  lines.push(`## ${kindNames[kind]}`, '');
  if (kind === 'pos_alignment') lines.push('**这里确认的是记录字段与本条例句不一致，不是宣布词头没有其他词性。** 例如 lovely 也有名词义，ooh 甚至有三种词性；修复时先选教学义，再补齐标签，不能整批覆盖为一种词性。', '');
  if (kind === 'example_fragment') lines.push('下列搭配多数本身合法。作为当前没有上下文的“例句”，需改成完整、自然的句子；这是产品教学要求，不是说这些词组都是错误英语。', '');
  lines.push('| 项号 | ID／词条 | 优先级／结论／修复状态 | 审计时词性／释义 | 审计时英文与中文 | 问题 | 处理方向／依据 |', '| --- | --- | --- | --- | --- | --- | --- |');
  for (const issue of entries) lines.push(`| ${issue.issueId} | ${issue.id} · ${cell(issue.word)} | ${issue.priority} · ${statusNames[issue.status]} · ${issue.resolution.status === 'resolved_local_text' ? '已本地修复' : '待处理'} | ${cell(issue.auditSnapshot.pos)} · ${cell(issue.auditSnapshot.meaning)} | ${cell(issue.auditSnapshot.example)}<br>${cell(issue.auditSnapshot.exampleCn)} | ${cell(issue.finding)} | ${cell(issue.recommendation)}${issue.sources.length ? '<br>' + sourceLinks(issue.sources) : '<br>依据：审计原文对照；未声称已外查该词的全部义项。'} |`);
  lines.push('');
}
lines.push('## 自动筛查规则与待复核范围', '', '| 线索 | 命中记录数 |', '| --- | ---: |',
  ...Object.entries(summary.ruleHits).map(([rule, count]) => `| ${ruleLabels[rule]} | ${count} |`), '',
  '这些规则计数及 `candidates[].pendingRules` 属于修复前快照，不是对修复后例句重新解析所得。JSON 的 `auditSnapshot` 与 `current` 分别保留审计原文和登记修复后的内容；以 `issues[].resolution` 判断本批是否处理。规则可重叠；16个英文分词阈值仅用于排队，缩写可能拆开、纯数字不计，不是句长质量标准。完整长句、专业词、合理省略、介词后置、形容词名词化都可能命中。', '',
  '## 已识别误报／暂不认定错误', '',
  '每条排除只针对注明的句法／词性线索，JSON 的 `clearedRules` 记录边界；不代表该词其他释义、标签、例句难度或译文全部通过。', '',
  '| ID／词条 | 当前英文 | 判断 |', '| --- | --- | --- |',
  ...register.exclusions.map(item => `| ${item.id} · ${cell(item.word)} | ${cell(item.current.example)} | ${cell(item.reason)} |`), '',
  '## 形成这些问题的流程线索（只读检查）', '',
  '- `scripts/build-daily-cet-expansion.py::normalize_pos` 对识别到的第一个标签立即返回；翻译回退识别 `adj.` 却没有同等识别常见的 `a.`，并依固定顺序挑一个词性。这能解释部分漏标模式，但代码现状不是每条历史记录的执行证据。',
  '- 同脚本 `wordnet_example` 按词头匹配选择 WordNet 中的首个例文并补句号，没有保证是完整句、没有把目标义与选定词性绑定。词典中的合法短语被迁入本产品例句栏，需另做教学审校。',
  '- 部分长例句的英文成分缺失而中文仍保留更多细节，需回查导入／重写上游。当前只定位到文本不一致，**没有证据证明某一个固定截断长度或某条脚本就是全部问题的唯一原因**。', '',
  '## 后续处理顺序与边界', '',
  '1. 先处理 P1：明确教学义，统一 pos／基础释义／例句／提示，修复明确语法残缺和错译。保留合理多义，不把小众义机械宣布为错误。',
  '2. 再处理 P2：把默认例句从搭配、文学抽象、冷门专业场景改为简单具体的完整句；教学判断仍需复核，不能只按词数机械增删。',
  '3. 其余候选分批核源；特别是数词、形容词名词化、过去式／分词、身份与语域词，避免批量替换。',
  '4. 真正修复时保留 ID、分类与学习进度；同步分片／目录／详情／作业目录。英文变化需按原版本化流程生成并发布对应音频；当前清单没有执行这些改动。',
  '5. 本次不做发音准确性推断或全库听音，也不因本次新清单而重置历史审查批次的已关闭状态。', '',
  '## 复现与完整性验证', '',
  '- 登记源：`data/vocabulary-teaching-audit/reviews-2026-10-29.json`；结构线索快照：同目录 `syntax-screen-2026-10-29.json`。',
  '- 执行 `node scripts/audit-vocabulary-teaching.mjs` 只重建本 Markdown 与同名 JSON，依次撤销登记的 P2／P1 before 快照重建原筛查输入，同时严格核对当前库等于登记的最新 after 状态；不接受未登记的新修改，也不把旧句法线索当成修复后结论。',
  '- spaCy 3.8.18／en_core_web_sm 3.8.0 的句法解析仅作用于基础英文例句；完整解析日志在忽略目录 `output/vocabulary-quality-audit/`。',
  `- 输入 SHA-256：\`${sourceHash}\`。`,
  `- 修复后当前词库 SHA-256：\`${currentSourceHash}\`。本生成器不改业务数据；实际应用回归及音频发布以 P1／P2 交接为准。`, '',
  '## 核对来源', '',
  ...register.sources.map(source => `- [${source.title}](${source.url})：${source.fact}（2026-10-29，${source.access === 'page' ? '读取词典正文' : '核对检索返回正文片段；直开可能受限'}）`), '',
);
await writeFile(new URL('docs/vocabulary-teaching-quality-audit-2026-10-29.json', root), JSON.stringify(report, null, 2) + '\n');
await writeFile(new URL('docs/vocabulary-teaching-quality-audit-2026-10-29.md', root), lines.join('\n'));
assert.equal(hash(await readFile(sourcePath)), currentSourceHash, 'Vocabulary was modified during the audit.');
console.log(JSON.stringify(summary, null, 2));
