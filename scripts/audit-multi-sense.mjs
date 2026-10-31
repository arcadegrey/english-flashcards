// Rebuild the bounded audit report without rewriting the captured DeepSeek input.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import assert from 'node:assert/strict';
const root = new URL('../', import.meta.url), dir = 'data/vocabulary-multi-sense-repair';
const read = async path => JSON.parse(await readFile(new URL(path, root), 'utf8'));
const original = await read(`${dir}/source-register-2026-10-31.json`);
const repair = await read(`${dir}/reviews-2026-10-31.json`);
const bytes = await readFile(new URL('public/data/vocabulary.json', root));
const currentSha256 = createHash('sha256').update(bytes).digest('hex');
assert.equal(currentSha256, repair.afterSha256, 'Review unexpected changes before reporting completion');
assert.equal(repair.baselineSha256, original.inputSha256);
const words = JSON.parse(bytes), byId = new Map(words.map(word => [word.id, word]));
const byReview = new Map(repair.reviews.map(review => [review.id, review]));
const current = id => {
  const word = byId.get(id), review = byReview.get(id);
  assert(review && isDeepStrictEqual(word, review.after), `Unregistered ${id}`);
  return { pos: word.pos, meaning: word.meaning, phonetic: word.phonetic,
    example: word.example, exampleCn: word.exampleCn, examples: word.examples };
};
const entries = original.entries.map(entry => ({ ...entry, current: current(entry.id),
  resolution: { status: 'resolved', batch: repair.batch, examples: byId.get(entry.id).examples.length } }));
const gaps = original.gaps.map(gap => ({ ...gap, current: current(gap.id),
  resolution: { status: 'resolved', note: gap.word === 'club' ? '社团属于已有组织义；补充棍棒与高尔夫球杆，未另造社团义。'
    : gap.word === 'trip' ? '补充动词绊倒；不把任何失误泛化为 trip 的一般义。' : '按词典补充常用义项、词性与短例句。' } }));
const register = { ...original, scope: '用户提供的 DeepSeek 候选清单及逐词修复状态；原始统计是历史快照，不是当前词性分类。',
  method: ['保留原始 118 条候选和 16 项缺义项线索；mine 重合，实际修复 133 个稳定 ID。',
    '逐词读取主来源词典，独立编写常用义项的双语短句；不是独立人工专家签字。',
    '只在完整当前词库与修复登记一致时报告完成；当前内容与原始候选分列。'],
  currentSourceSha256: currentSha256, repairBatch: repair.batch,
  repairTotals: { ...repair.counts, repairedGapCandidates: gaps.length, expectedAudioFiles: (repair.counts.examples + repair.counts.wordAudioReplacements) * 4 },
  entries, gaps, limitations: ['原始“同词性”分类有误：不少记录只是原词性字段漏标，不能照搬为语言学结论。',
    '例句覆盖所选常用义项，不是词典所有罕见或专业义的穷尽枚举。',
    '来源核对范围见修复登记；保留的旧专业释义不因此获得全量重新核验。'] };
const esc = value => String(value).replaceAll('|', '／').replace(/\\n|\n/g, ' ／ ');
const all = repair.reviews.map(review => `| ${review.id} | ${review.word} | ${review.after.examples.length} | ${esc(review.after.examples.map(example => example.sense).join('；'))} |`).join('\n');
const doc = `# 多义词逐词修复记录（2026-10-31）

这份清单由用户提供，作为 DeepSeek 的候选筛查使用。原始 118 条多义词和 16 个缺义项候选合并去重后，实际为 **133 个词条**（mine 重合）。原始记录保存在 \`data/vocabulary-multi-sense-repair/source-register-2026-10-31.json\`，没有把原始筛查冒充独立人工语言审定。

本批按词典逐项核对，补充 **424 条分义项双语例句**、词性和必要的常用义。每条 2–6 个例句，复用现有词卡；第一项继续供原有练习模式使用。ID、词头、分类与个人学习数据保持。

## 原清单需要纠正的地方

- “同一词性”不完全正确：例如 watch、plant 等词条的原词性标签漏了名词，不能据旧标签下结论。
- club 的“社团”已包含在原组织义中；补的是棍棒、高尔夫球杆，不另造社团义。
- trip 增补“绊倒”，不把泛泛的任何“失误”都当作 trip 的一般义。
- bit 是 bite 的过去式，学习中使用 bite–bit–bitten；不把 bit 一概当作标准过去分词。
- set 的默认残片已改为完整句，并用动词示范日落；sound 的截断释义已清理。

## 常用义补充

| 词条 | ID | 处理 |
| --- | ---: | --- |
${gaps.map(gap => `| ${gap.word} | ${gap.id} | ${esc(gap.resolution.note)} 新例句：${esc(gap.current.examples.map(example => example.sense).join('；'))} |`).join('\n')}

## 本批逐词例句覆盖

| ID | 词条 | 例句数 | 义项标签 |
| ---: | --- | ---: | --- |
${all}

## 异读词与用法

bow、wound、object、row、record、present、wind、tear、lead、close 按义项标出读音或重音，例句录音逐项指定读音；词头按钮使用当前第一项的读音。尤其 wound 的伤口义与 wind 的过去式、lead 的金属义与带领义、close 的 /z/ 与 /s/，不能混用。详见修复登记的逐词来源链接及读音方案。

## 维护与验证入口

- 完整 before／after、来源与范围：\`data/vocabulary-multi-sense-repair/reviews-2026-10-31.json\`。
- 全部原创新例句与用法说明：\`data/vocabulary-multi-sense-repair/examples-2026-10-31.txt\`。
- 音频矩阵：424 条例句及 10 个异读词头 × 四音色，共 **1736 个版本录音**；状态以最终音频清单、发布回执和验证结果为准。
- 可重新执行 \`node scripts/apply-vocabulary-multi-sense.mjs\` 与交付构建，未知修改会被拒绝；旧维护脚本不会回滚本批。
- 历史作业／测验快照、原录音和学习 ID 保留。不是对全词库 8749 词做了穷尽义项修复。
`;
await mkdir(new URL('data/vocabulary-multi-sense-audit/', root), { recursive: true });
await writeFile(new URL('data/vocabulary-multi-sense-audit/register-2026-10-31.json', root), JSON.stringify(register, null, 2) + '\n');
await writeFile(new URL('docs/vocabulary-multi-sense-audit-2026-10-31.md', root), doc);
const csv = value => `"${String(value ?? '').replaceAll('"', '""')}"`;
await writeFile(new URL('data/vocabulary-multi-sense-audit/words-2026-10-31.csv', root), '\uFEFF' + [
  ['id', 'word', 'originalPos', 'currentPos', 'examples', 'status'].join(','),
  ...entries.map(entry => [entry.id, entry.word, entry.pos, entry.current.pos, JSON.stringify(entry.current.examples), entry.resolution.status].map(csv).join(',')),
].join('\n') + '\n');
console.log(JSON.stringify(register.repairTotals));
