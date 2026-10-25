import { vocabularyNoteKey } from '../shared/vocabularyAliases.js';
import { RETIRED_VOCABULARY } from '../shared/retiredVocabulary.js';
import { PRACTICAL_WORD_NOTES } from '../src/data/practicalWordNotes.js';
import { readFile } from 'node:fs/promises';
import { CORE_WORD_NOTES, CORE_SYNONYM_GROUPS, CORE_WORD_FORMATIONS, WORD_NOTE_SOURCES } from '../src/data/coreWordNotes.js';
import { EVERYDAY_WORD_NOTES } from '../src/data/everydayWordNotes.js';
import { USAGE_WORD_NOTES } from '../src/data/usageWordNotes.js';
import { EXPANSION_ONE_WORD_NOTES } from '../src/data/expansionOneWordNotes.js';
import { EXPANSION_TWO_WORD_NOTES } from '../src/data/expansionTwoWordNotes.js';
import { EXPANSION_THREE_WORD_NOTES } from '../src/data/expansionThreeWordNotes.js';
import { EXPANSION_FOUR_WORD_NOTES } from '../src/data/expansionFourWordNotes.js';
import { EXPANSION_FIVE_WORD_NOTES } from '../src/data/expansionFiveWordNotes.js';
import { EXPANSION_SIX_WORD_NOTES } from '../src/data/expansionSixWordNotes.js';
import { EXPANSION_SEVEN_WORD_NOTES } from '../src/data/expansionSevenWordNotes.js';
import { EXPANSION_EIGHT_WORD_NOTES } from '../src/data/expansionEightWordNotes.js';
import { EXPANSION_NINE_WORD_NOTES } from '../src/data/expansionNineWordNotes.js';
import { getCoreWordHints } from '../src/utils/wordHints.js';
import { getReviewedWordHints } from '../src/data/reviewedWordNotes.js';

const vocabulary = JSON.parse(await readFile(new URL('../public/data/vocabulary.json', import.meta.url), 'utf8'));
const words = new Set(Object.keys(CORE_WORD_NOTES));
const groups = Object.values(CORE_SYNONYM_GROUPS);
const exampleForms = groups.flatMap(group => group.examples.flatMap(example => example.forms || []));
const sections = [...groups, ...Object.values(CORE_WORD_FORMATIONS), ...exampleForms];
const pending = sections.filter(section => section.review?.status !== 'source-checked');
const missingSources = sections.filter(section => !section.sourceIds?.length || section.sourceIds.some(id => !Object.hasOwn(WORD_NOTE_SOURCES, id)));
const orphaned = [...words].filter(word => ![...vocabulary, ...RETIRED_VOCABULARY].some(entry => vocabularyNoteKey(entry) === word));
const displayed = [...words].filter(word => getCoreWordHints({ word }).length);
const withFormation = Object.values(CORE_WORD_NOTES).filter(entry => entry.formation).length;
const synonymCount = groups.filter(group => !group.comparisonType || group.comparisonType === 'synonym').length;
const confusableCount = groups.filter(group => group.comparisonType === 'confusable').length;
const usageCount = groups.filter(group => group.comparisonType === 'usage').length;
const corrections = groups.filter(group => group.correction?.canonical);
const reviewedEntries = vocabulary.map(entry => ({ entry, hints: getReviewedWordHints(entry) })).filter(item => item.hints);
const lines = [
  '# 核心词提示覆盖率与新增批次来源', '',
  '汇总日期：2026-10-25（逐条核对日期保留在来源与内容中）。运行 `node scripts/report-word-notes.mjs > docs/word-notes-coverage.md` 可重新生成。', '',
  '## 覆盖口径', '',
  `- 活动词库记录（稳定 ID）：${vocabulary.length}；历史兼容记录：${RETIRED_VOCABULARY.length}；已登记提示（含历史）：${words.size}；可展示提示（含历史）：${displayed.length}。`,
  `- 内容：${groups.length} 组（近义 ${synonymCount}；易混 ${confusableCount}；单词用法 ${usageCount}），共 ${groups.reduce((sum, group) => sum + group.examples.length, 0)} 条双语例句。`,
  `- 当前另有 ${reviewedEntries.length} 条按稳定 ID 复核的提示覆盖原组内容，不增加覆盖词数；下方旧组数据保留为编辑来源，实际显示内容见“按 ID 复核的教学义项”。`,
  `- 构词／词族说明：${withFormation} 词，${Object.keys(CORE_WORD_FORMATIONS).length} 组。此次保留原有构词，不为凑覆盖率增加推断。`,
  `- 显式例句词形：${exampleForms.length} 处，逐例登记词头、实际词形、来源和核对状态；不自动推断未标注词形。`,
  `- 显式规范拼写／表达映射：${corrections.length} 组；保留原词条键和用户记录，提示说明规范拼写或推荐表达，例句使用已核验目标。`,
  `- 待核验条目：${pending.length}；缺失来源的条目：${missingSources.length}；无法匹配原词库的提示：${orphaned.length}。`,
  '- 上行仅检查提示来源登记和映射状态，不表示词库音标、义项或独立语言审校已经完成；剩余问题见 `vocabulary-quality-followup.json`。',
  '- 未覆盖的词继续使用词条基础提示；无构词内容不代表该词没有构词关系。',
  '- source-checked 表示已参考公开词条／语法资料核对。本项目综合这些事实编写中文辨析与原创例句，未导入词典原文；独立语言专家审校仍待进行。',
  '- 分类别统计按 categories（缺失时按 category）计算，一个词可属于多个类别，不能将行数相加作为独立词数。', '',
  '| 词库类别 | 原有词条 | 已覆盖提示 | 覆盖比例 | 构词／词族覆盖 |',
  '| --- | ---: | ---: | ---: | ---: |',
];
for (const category of ['daily', 'cet4', 'cet6', 'toefl', 'ielts']) {
  const entries = vocabulary.filter(entry => (entry.categories || [entry.category]).includes(category));
  const covered = entries.filter(entry => words.has(vocabularyNoteKey(entry)));
  lines.push(`| ${category} | ${entries.length} | ${covered.length} | ${(covered.length / entries.length * 100).toFixed(2)}% | ${covered.filter(entry => CORE_WORD_NOTES[vocabularyNoteKey(entry)].formation).length} |`);
}
lines.push('', '## 按 ID 复核的教学义项', '',
  '| ID | 词条 | 当前教学范围 | 当前来源 |', '| ---: | --- | --- | --- |');
for (const { entry, hints } of reviewedEntries) {
  for (const hint of hints) lines.push(`| ${entry.id} | ${entry.word} | ${hint.scope} | ${hint.sources.map(source => `[${source.title}](${source.url})`).join('、')} |`);
}
lines.push('', '## 规范拼写与表达映射', '',
  '| 原词条 | 例句目标 | 核对说明 | 来源 |', '| --- | --- | --- | --- |');
for (const group of corrections) {
  const references = group.sourceIds.map(id => `[${WORD_NOTE_SOURCES[id].title}](${WORD_NOTE_SOURCES[id].url})`).join('、');
  lines.push(`| ${group.words.join(' / ')} | ${group.correction.canonical} | ${group.correction.reason} | ${references} |`);
}
lines.push('', '## 显式例句词形', '',
  '| 词头 → 词形 | 所在例句 | 核对日期与来源 |', '| --- | --- | --- |');
for (const group of groups) {
  for (const example of group.examples) {
    for (const form of example.forms || []) {
      const references = form.sourceIds.map(id => `[${WORD_NOTE_SOURCES[id].title}](${WORD_NOTE_SOURCES[id].url})`).join('、');
      lines.push(`| ${form.word} → ${form.form} | ${example.en} | ${form.review.checkedAt} · ${references} |`);
    }
  }
}
lines.push('', '## 新增批次与逐组来源', '',
  '300 词基线后先通过三个各 900 词的独立词池扩至 3000 词，再新增三个各 1000 词的独立词池扩至 6000 词；最后通过 900／900／899 词三批补齐剩余 2699 个词条。每组两条原创双语例句，明确词性及适用词义；真实易混关系标为易混，无合适比较时使用单词用法笔记，不强配近义词或词根。该提示扩充阶段未变更词 ID、分类或学习进度。后续基础词库的 33 条修复及版本音频见 `vocabulary-repair-2026-10-24.md`；两个更正后的同形词按 ID 保留原提示键。', '',
  '核对过程中部分剑桥词典直连返回 403，词条事实使用可读取的韦氏词典；关键语法另用剑桥 English Grammar Today；部分词形或义项补用牛津、柯林斯词典。参考链接保留在学习提示中。新增的第四至第六批次逐词读取剑桥／牛津词条，必要时补查韦氏词条或明确的词形变体，并按具体词性和义项核对；不把请求成功自动视为独立语言审校。', '');
for (const [title, notes] of [
  ['批次 A：生活、学校与出行', EVERYDAY_WORD_NOTES],
  ['批次 B：常见性质、数量与时间空间', USAGE_WORD_NOTES],
  ['扩充一：日常与核心词汇', EXPANSION_ONE_WORD_NOTES],
  ['扩充二：日常与核心词汇', EXPANSION_TWO_WORD_NOTES],
  ['扩充三：日常与核心词汇', EXPANSION_THREE_WORD_NOTES],
  ['扩充四：常用与备考词汇', EXPANSION_FOUR_WORD_NOTES],
  ['扩充五：常用与备考词汇', EXPANSION_FIVE_WORD_NOTES],
  ['扩充六：常用与备考词汇', EXPANSION_SIX_WORD_NOTES],
  ['扩充七：剩余词库第一批', EXPANSION_SEVEN_WORD_NOTES],
  ['扩充八：剩余词库第二批', EXPANSION_EIGHT_WORD_NOTES],
  ['扩充九：剩余词库第三批', EXPANSION_NINE_WORD_NOTES],
  ['实用替换批次：2026-10-25（247条；历史条目保留原提示）', PRACTICAL_WORD_NOTES],
]) {
  lines.push(`### ${title}`, '', `词条数：${Object.keys(notes).length}。`, '', '| 词组 | 类型与适用范围 | 核对来源 |', '| --- | --- | --- |');
  for (const id of new Set(Object.values(notes).map(entry => entry.synonymGroup))) {
    const group = CORE_SYNONYM_GROUPS[id];
    const references = group.sourceIds.map(sourceId => {
      const source = WORD_NOTE_SOURCES[sourceId];
      return `[${source.title}](${source.url})`;
    }).join('、');
    const type = group.comparisonType === 'usage' ? '用法' : group.comparisonType === 'confusable' ? '易混' : '近义';
    lines.push(`| ${group.words.join(' / ')} | ${type} · ${group.sense} | ${references} |`);
  }
  lines.push('');
}
console.log(lines.join('\n'));
