// Read-only screening: lists vocabulary examples short enough to be phrases.
// Writes the audit register and report only; never edits vocabulary, hints or audio.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { beforeShortExampleReview } from '../shared/vocabularyHistory.js';

const root = new URL('../', import.meta.url);
const sourcePath = new URL('public/data/vocabulary.json', root);
const raw = await readFile(sourcePath, 'utf8');
const currentVocabulary = JSON.parse(raw);
const vocabulary = beforeShortExampleReview(currentVocabulary);
const inputSha256 = createHash('sha256').update(JSON.stringify(vocabulary,null,2)+'\n').digest('hex');
const currentSourceSha256 = createHash('sha256').update(raw).digest('hex');
const repair = JSON.parse(await readFile(new URL('data/vocabulary-short-example-repair/reviews-2026-10-29.json',root),'utf8'));
assert.equal(inputSha256,repair.baselineSha256,'Do not overwrite the captured short-example baseline.');
const latestRepair = JSON.parse(await readFile(new URL('data/vocabulary-multi-sense-repair/reviews-2026-10-31.json',root),'utf8'));
assert.equal(currentSourceSha256,latestRepair.afterSha256,'Unknown current edits: review before reporting resolutions.');
const repairById = new Map(repair.reviews.map(review=>[review.id,review]));
const excludedById = new Map(repair.exclusions.map(review=>[review.id,review]));
const currentById = new Map(currentVocabulary.map(word=>[word.id,word]));

const tokens = value => String(value || '').replace(/[^A-Za-z'’ -]/g, ' ').trim().split(/\s+/).filter(Boolean);

const contractionVerbs = new Map(Object.entries({
  "i'm": 'am', "it's": 'is', "what's": 'is', "he's": 'is', "she's": 'is', "that's": 'is',
  "there's": 'is', "here's": 'is', "who's": 'is', "i've": 'have', "we've": 'have',
  "they've": 'have', "you've": 'have', "i'll": 'will', "we'll": 'will', "they'll": 'will',
  "he'll": 'will', "she'll": 'will', "it'll": 'will', "i'd": 'would', "you'd": 'would',
  "we're": 'are', "they're": 'are', "you're": 'are', "don't": 'do', "doesn't": 'does',
  "didn't": 'did', "isn't": 'is', "aren't": 'are', "wasn't": 'was', "weren't": 'were',
  "haven't": 'have', "hasn't": 'has', "hadn't": 'had', "can't": 'can', "won't": 'will',
  "wouldn't": 'would', "shouldn't": 'should', "couldn't": 'could', "mustn't": 'must',
}));

// Closed-class finite verbs plus frequent irregulars that short examples use.
const closedVerbs = `am is are was were be been being have has had do does did
can could will would shall should may might must ought
`.split(/\s+/).filter(Boolean);

// Headwords whose own POS field says verb/noun supply the rest of the lexicon.
const baseVerbs = new Set(closedVerbs);
for (const word of vocabulary) {
  if (/(^|[\s/;,])(v|vt|vi)\./.test(word.pos || '')) baseVerbs.add(word.word.toLowerCase());
}


// Frequent verbs that short examples use; the corpus' POS field alone misses
// function-heavy entries (nouns/adjectives) whose examples still need a verb.
const commonVerbs = `need needs needed help helps helped want wants wanted like likes liked
love loves loved hate hates hated know knows knew known think thinks thought see sees saw seen
say says said tell tells told ask asks asked answer answers answered look looks looked
find finds found give gives gave given take takes took taken make makes made get gets got
come comes came go goes went put puts keep keeps kept hold holds held bring brings brought
happen happens happened change changes changed move moves moved live lives lived play plays played
work works worked try tries tried start starts started stop stops stopped open opens opened
close closes closed call calls called use uses used show shows showed shown
sit sits sat stand stands stood stay stays stayed wait waits waited watch watches watched
listen listens listened hear hears heard smell smells smelled taste tastes tasted
carry carries carried send sends sent build builds built seem seems seemed become becomes became
remain remains remained turn turns turned grow grows grew grown lead leads led
result results resulted mean means meant matter matters mattered
include includes included contain contains contained provide provides provided offer offers offered
allow allows allowed permit permits permitted let cause causes caused
agree agrees agreed believe believes believed expect expects expected feel feels felt
follow follows followed cover covers covered reach reaches reached suggest suggests suggested
raise raises raised require requires required report reports reported decide decides decided
pull pulls pulled return returns returned explain explains explained hope hopes hoped
develop develops developed represent represents represented win wins won lose loses lost
meet meets met read reads wrote written speak speaks spoke spoken teach teaches taught
learn learns learned study studies studied spend spends spent pay pays paid cost costs
buy buys bought sell sells sold break breaks broke broken drive drives drove driven
fly flies flew flown wake wakes woke woken wear wears wore worn
throw throws threw thrown catch catches caught fight fights fought
sleep sleeps slept drink drinks drank drunk eat eats ate eaten
run runs ran walk walks walked talk talks talked sing sings sang sung
swim swims swam sit sits write writes
marry marries married worry worries worried hurry hurries hurried bury buries buried
study studies apply applies applied enjoy enjoys enjoyed
pass passes passed fail fails failed miss misses missed
own owns owned pull pulls pulled
poll polls polled rumble rumbles rumbled equal equals equaled
clear clears cleared please pleases pleased fast fasts fasted color colors colored colour colours coloured
lift lifts lifted paint paints painted count counts counted cross crosses crossed
push pushes pushed drop drops dropped pick picks picked add adds added
form forms formed base bases based name names named
note notes noted mark marks marked list lists listed
cost costs pay pays hire hires hired fire fires fired
call calls phone phones owed owe owes owe
stink stinks stank stunk smell smells
seem seems seemed look looks looks
`.split(/\s+/).filter(Boolean);
for (const verb of commonVerbs) baseVerbs.add(verb);

const isVerb = rawToken => {
  const lower = rawToken.toLowerCase().replace(/[’]/g, "'");
  if (contractionVerbs.has(lower)) return true;
  const word = lower.replace(/'s$/, '').replace(/[^a-z]/g, '');
  if (!word || word.length < 2) return false;
  if (baseVerbs.has(word)) return true;
  if (/ies$/.test(word) && baseVerbs.has(word.slice(0, -3) + 'y')) return true;
  if (/ied$/.test(word) && baseVerbs.has(word.slice(0, -3) + 'y')) return true;
  if (/es$/.test(word) && (baseVerbs.has(word.slice(0, -2)) || baseVerbs.has(word.slice(0, -1)))) return true;
  if (/s$/.test(word) && baseVerbs.has(word.slice(0, -1))) return true;
  if (/ed$/.test(word)) {
    const stem = word.slice(0, -2);
    if (baseVerbs.has(stem) || baseVerbs.has(stem + 'e') || baseVerbs.has(stem.replace(/(.)\1$/, '$1'))) return true;
  }
  if (/d$/.test(word) && baseVerbs.has(word.slice(0, -1))) return true;
  return false;
};

// Short but complete examples: imperative clauses, greetings and sign ellipses.
const exclusions = new Map([
  [6224, '祈使句：动词开头，成分完整'],
  [5978, '祈使句：french 作动词，成分完整'],
  [6035, '祈使句：thin 作动词，成分完整'],
  [7837, '祈使句：pat 作动词，成分完整'],
  [8917, '固定问候语'],
  [82, '告示类省略句，习惯用法'],
]);

const notes = new Map([
  [6331, '英文疑似损坏（a longer for money），无法解析'],
  [7124, 'polite society 为固定说法“上流社会”，译文按字面误译'],
  [7662, '政治口号引语，脱离语境不宜作默认例句'],
  [8024, '固定习语，无主谓结构，可读但无法示范用法'],
]);

const rows = vocabulary.map(word => {
  const parts = tokens(word.example);
  const verbAt = parts.findIndex(isVerb);
  return {
    id: word.id, word: word.word, phonetic: word.phonetic, pos: word.pos,
    meaning: word.meaning, categories: word.categories || [word.category],
    example: word.example, exampleCn: word.exampleCn, words: parts.length,
    hasFiniteVerb: verbAt >= 0,
  };
});

const candidates = rows
  .filter(row => row.words >= 1 && row.words <= 5 && !row.hasFiniteVerb)
  .map(row => {
    const exclusion = exclusions.get(row.id) || null;
    const severity = row.words <= 2 ? 'A' : row.words <= 3 ? 'B' : 'C';
    return { ...row, severity, exclusion, note: notes.get(row.id) || null };
  })
  .sort((left, right) => left.words - right.words || left.id - right.id);

// Second cue: determiner-initial short examples whose only verb-looking token is
// the final word. These are usually noun phrases ("A look of triumph."), but the
// shape alone cannot prove it, so three real subject+verb sentences are excluded
// after manual reading rather than silently dropped.
const auxiliary = new Set(['am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'can', 'could', 'shall', 'should', 'may', 'might', 'must', 'ought']);
const determiner = /^(a|an|the|my|his|her|their|our|your|this|that|these|those|some|no|every|another)$/i;
const reviewedSentences = new Map([
  [740, '主语+谓语：Our opinions coincide.'],
  [779, '主语+谓语：The country imports oil.'],
  [5648, '主语+谓语：The prisoner won\'t speak.'],
]);
const nounPhraseCandidates = rows
  .filter(row => row.hasFiniteVerb && row.words >= 2 && row.words <= 4
    && determiner.test(tokens(row.example)[0] || '')
    && !tokens(row.example).some(token => auxiliary.has(token.toLowerCase().replace(/'/g, '')))
    && !reviewedSentences.has(row.id)
    && isVerb(tokens(row.example).at(-1)))
  .filter(row => tokens(row.example).slice(0, -1).every(token => !isVerb(token)))
  .map(row => ({ ...row, rule: 'det-head-verb', severity: row.words <= 2 ? 'A' : row.words <= 3 ? 'B' : 'C',
    exclusion: null, note: '末词也可作动词，按短语处理' }));

const flagged = [...candidates.filter(row => !row.exclusion), ...nounPhraseCandidates]
  .sort((left, right) => left.words - right.words || left.id - right.id);
const byLength = {};
for (const row of flagged) byLength[row.words] = (byLength[row.words] || 0) + 1;
const bySeverity = {};
for (const row of flagged) bySeverity[row.severity] = (bySeverity[row.severity] || 0) + 1;
const byPos = {};
for (const row of flagged) {
  const head = /adj|\ba\b/.test(row.pos || '') ? '形容词' : /^(vt|vi|v)\b|\b(v|vt|vi)\./.test(row.pos || '') ? '动词' : /n\./.test(row.pos || '') ? '名词' : '副词／其他';
  byPos[head] = (byPos[head] || 0) + 1;
}
const uniqueWords = new Set(flagged.map(row => row.id)).size;

const report = {
  auditDate: '2026-10-29', input: 'public/data/vocabulary.json', inputSha256, currentSourceSha256,
  screeningAppliesTo: 'captured pre-short-repair snapshot; counts are historical candidates, not errors in the new examples',
  repairStatus: {batch:repair.batch,repairedCandidates:237,reviewedExclusions:1,extraUserRequests:1,openCandidates:0},
  additionalUserRequests: repair.reviews.filter(review=>review.id===7121),
  scope: `全部 ${vocabulary.length} 条活动词条的默认例句，按英文分词数 ≤5 且未检出有限动词／情态动词筛选`,
  method: '启发式词形匹配（动词词表来自词条自带词性 + 常见不规则形式 + 缩写展开），非词性标注器',
  totals: {
    screenedRecords: vocabulary.length, candidates: candidates.length,
    excluded: candidates.filter(row => row.exclusion).length,
    nounPhraseCandidates: nounPhraseCandidates.length,
    flagged: flagged.length,
    uniqueWords, byWordCount: byLength, bySeverity, byHeadwordPos: byPos,
  },
  exclusions: candidates.filter(row => row.exclusion).map(row => ({ id: row.id, word: row.word, example: row.example, reason: row.exclusion })),
  limitations: [
    '启发式动词识别只判断“句中是否出现有限动词”，不判断主谓一致、成分残缺或语义是否适配当前释义；命中项仍需逐条确认。',
    '长度阈值取 5 词：更长的无谓语片段（6 词 30 条、7 词 31 条、8 词 18 条）未纳入本清单。',
    '本清单只覆盖默认例句，不涉及提示例句、作业快照或历史记录。',
    '未逐词外查词典，仅以例句自身结构判断；未修改任何词库、音频或学习数据。',
  ],
  examples: flagged.map(({ id, word, phonetic, pos, meaning, categories, example, exampleCn, words, severity, note }) =>
    ({ id, word, phonetic, pos, meaning, categories, example, exampleCn, words, severity, note,
      current:currentById.get(id), resolution:repairById.has(id)?{status:'resolved_local_text',batch:repair.batch,reason:repairById.get(id).reason}
        :{status:'reviewed_exclusion',reason:excludedById.get(id)?.reason} })),
};

const table = (list) => [
  '| ID | 词条 | 原词性 | 原例句 | 原译文 | 筛查时备注 | 后续复核／修复 |',
  '| ---: | --- | --- | --- | --- | --- | --- |',
  ...list.map(row => `| ${row.id} | ${row.word} | ${row.pos || ''} | ${row.example} | ${row.exampleCn} | ${row.note || ''} | ${row.id===700?'误报，保留完整句':row.id===6331?'已修；少见名词义可解析，但与副词教学义错配':'已本地修复'} |`),
].join('\n');

const doc = `# 例句长度筛查：无谓语短语清单（2026-10-29）

用户反馈 \`unpaid\` 的默认例句 \`Unpaid wages.\` 只有两个词，看不出用法。本清单按同一标准对全库做程序筛查：**英文 ≤5 个词，且句中找不到充当谓语的有限动词（be/do/have、情态动词、第三人称单数、过去式等）**；另外补扫“限定词开头、只有末词可能是动词”的短名词短语（如 \`A look of triumph.\`）。这是候选清单，不是把每条都判定为错误。

## 后续修复状态

本页保留修复前的 238 条候选及其原文，不将旧筛查结果冒充对新句的分析。逐条复核后改写 237 条；700 · collide 的完整句属于误报，保留原文。另按用户要求改写 7121 · smoking；原句是完整句，属于教学表达改进。当前候选未处理 0 条。全部前后文、来源和音频验收见 [短例句修复交接](vocabulary-short-example-repair-2026-10-29.md)。

longer 的“渴望者”名词义确有词典记录，原备注“无法解析”过于绝对；实际问题是孤立短语与本条副词义错配。polite society 指上流或讲究体面的社交圈，原逐词翻译不当。本次改用待人有礼的常见情境。

## 修复前筛查结果

- 筛查 ${vocabulary.length} 条活动词条。
- **规则一**（句中找不到任何有限动词）命中 ${candidates.length} 条，人工排除 ${report.totals.excluded} 条有效短句，剩 ${candidates.length - report.totals.excluded} 条。
- **规则二**（以限定词开头、只有末词可能是动词）命中 ${report.totals.nounPhraseCandidates} 条；另逐条确认 3 条是主谓句（\`Our opinions coincide.\`／\`The country imports oil.\`／\`The prisoner won't speak.\`），已排除。
- 两条规则合计 **${flagged.length} 条待确认，涉及 ${uniqueWords} 个词条**。
- 按长度：2 词 ${byLength[2] || 0} 条、3 词 ${byLength[3] || 0} 条、4 词 ${byLength[4] || 0} 条、5 词 ${byLength[5] || 0} 条。
- 按词条词性：${Object.entries(byPos).map(([key, value]) => `${key} ${value}`).join('、')}。绝大多数是“形容词/名词 + 一个名词”的名词短语，或“形容词 + 介词短语”。
- 与 2026-10-29 已有审计清单（\`docs/vocabulary-teaching-quality-audit-2026-10-29.md\`，303 项）重叠仅 4 条，且属于词性对齐问题；本次这批基本是此前未登记的新线索。

## 已排除（有效短句）

| ID | 词条 | 例句 | 理由 |
| ---: | --- | --- | --- |
${candidates.filter(row => row.exclusion).map(row => `| ${row.id} | ${row.word} | ${row.example} | ${row.exclusion} |`).join('\n')}

## 2 词（最严重：完全看不出用法）

${table(flagged.filter(row => row.words === 2))}

## 3 词

${table(flagged.filter(row => row.words === 3))}

## 4–5 词

${table(flagged.filter(row => row.words >= 4))}

## 说明与限制

- 判定依赖动词词形启发式：词表来自词条自带词性、常见不规则形式与缩写展开。它只回答“句中是否出现有限动词”，不判断主谓一致、成分残缺或译文是否对应。
- 未逐词外查词典；命中项属于“不像例句”，不等于原表达在英语中不成立（例如 \`polite society\`、\`for better or for worse\` 本身是常见说法，只是作为默认例句缺少语境）。
- 只覆盖默认例句，不涉及单词提示、作业快照、历史记录；原筛查阶段没有修改词库；后续用户授权修复及音频发布另有登记，个人学习数据和同步逻辑不变。
- 长度阈值取 5 词。6 词及以上的无谓语片段未纳入：越长的句子越容易出现词典未收录的动词形态，启发式误判会明显上升，需要更可靠的句法解析。

## 建议处理方式

统一改成“有明确主语 + 谓语”的简单句，并使用当前释义的常见义项，例如：

- \`Unpaid wages.\` → \`He still has unpaid wages from last month.\`
- \`Polite society.\` → \`She behaves well in polite society.\`
- \`A strict vegetarian.\` → \`My aunt is a strict vegetarian.\`

用户已授权逐条修复；当前采用独立编写的新完整句，未机械扩长原短语。修复不等于原来的所有短语都不合法，也不代表完成了更长例句或全库其他线索的专家审校。
`;

await mkdir(new URL('data/vocabulary-short-example-audit/', root), { recursive: true });
await writeFile(new URL('data/vocabulary-short-example-audit/examples-2026-10-29.json', root), JSON.stringify(report, null, 2) + '\n');
await writeFile(new URL('docs/vocabulary-short-example-audit-2026-10-29.md', root), doc);

const csvEscape = value => `"${String(value ?? '').replaceAll('"', '""')}"`;
const csv = [
  ['id', 'word', 'pos', 'meaning', 'example', 'exampleCn', 'words', 'severity', 'note'].join(','),
  ...flagged.map(row => [row.id, row.word, row.pos, row.meaning, row.example, row.exampleCn, row.words, row.severity, row.note || '']
    .map(csvEscape).join(',')),
].join('\n');
await writeFile(new URL('data/vocabulary-short-example-audit/examples-2026-10-29.csv', root), '\uFEFF' + csv + '\n');

console.log(JSON.stringify(report.totals, null, 2));
