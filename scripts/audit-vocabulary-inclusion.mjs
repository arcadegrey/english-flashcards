// Read-only curriculum audit. Recommendations are never imported by the app.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { getCoreWordHints } from '../src/utils/wordHints.js';
import { parseVocabularyCsv } from '../src/utils/csvImport.js';
import { RETIRED_VOCABULARY } from '../shared/retiredVocabulary.js';

const root = new URL('../', import.meta.url);
const sourcePath = new URL('public/data/vocabulary.json', root);
const activeInput = await readFile(sourcePath);
// This register is the pre-replacement decision snapshot. Reconstruct that
// snapshot from unchanged original IDs plus reference-only archived records.
const vocabulary = [...JSON.parse(activeInput).filter(word => word.id <= 8699), ...RETIRED_VOCABULARY].sort((a, b) => a.id - b.id);
const input = Buffer.from(JSON.stringify(vocabulary, null, 2) + '\n');
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const normalize = value => value.toLocaleLowerCase('en');
const decisions = new Map();
const expansionInput = await readFile(new URL('data/daily_cet_expansion.csv', root), 'utf8');
const expansion = parseVocabularyCsv({ csvText: expansionInput, existingWords: [], validCategoryIds: ['daily', 'cet4', 'cet6', 'toefl', 'ielts'] });
assert.equal(expansion.importedWords.length, 3300);
const importedByWord = new Map(expansion.importedWords.map(word => [normalize(word.word), word]));
const sources = [
  { id: 'oxford-selection', url: 'https://teachingenglishwithoxford.oup.com/2019/11/11/oxford-3000%EF%B8%8F-eltoc/', evidence: '核对全文：核心词筛选结合语料频率与学习者相关性，不能只按新闻/通用语料排名。' },
  { id: 'oxford-lists', url: 'https://www.oxfordlearnersdictionaries.com/about/wordlists/index.html', evidence: '核对全文：核心词、进阶词、学术词有不同学习用途；本报告没有下载或逐词比对 Oxford 全表。' },
  { id: 'ceo', url: 'https://www.oxfordlearnersdictionaries.com/definition/english/ceo', evidence: '核对词条正文：chief executive officer 的缩写，具通用商务意义。' },
  { id: 'dna', url: 'https://www.oxfordlearnersdictionaries.com/definition/english/dna', evidence: '核对词条正文：遗传信息相关化学物质的缩写，具通用科学阅读意义。' },
  { id: 'frank', url: 'https://www.oxfordlearnersdictionaries.com/definition/english/frank_1', evidence: '核对词条正文：坦率、直言的形容词，不能按同拼人名排除。' },
  { id: 'ruth', url: 'https://www.merriam-webster.com/dictionary/ruth', evidence: '核对词条正文：普通名词有怜悯/悔恨义，也另列 Ruth 专名；不是纯人名误收。' },
  { id: 'surrey', url: 'https://www.merriam-webster.com/dictionary/surrey', evidence: '核对词条正文：确有四轮双座马车义，不能据提示中的地名反改基础义项。' },
  { id: 'ulster', url: 'https://www.merriam-webster.com/dictionary/ulster', evidence: '核对词条正文：确有厚长外套义，也另列地理名称。' },
  { id: 'lewis', url: 'https://www.getty.edu/vow/AATFullDisplay?find=&logic=AND&note=work&subjectid=300023060', evidence: '本轮搜索索引可见 Getty AAT 石材作业工具分类；未核对完整页面。仅佐证存在该工具义。' },
  { id: 'henry', url: 'https://goldbook.iupac.org/terms/view/H02782', evidence: '本轮搜索索引可见 IUPAC 的电感 SI 单位说明；未核对完整页面。' },
  { id: 'thou', url: 'https://www.oxfordlearnersdictionaries.com/definition/english/thou', evidence: '本轮词典搜索索引标注 old use or dialect；未核对完整页面。' },
  { id: 'teen', url: 'https://www.merriam-webster.com/dictionary/teen', evidence: '核对词条正文：青少年为当代义，misery/affliction 另列 archaic。' },
  { id: 'mick', url: 'https://www.merriam-webster.com/dictionary/mick', evidence: '核对词条正文：族群称呼义标注 often disparaging + offensive；不能把人名例句用于中性化该释义。' },
  { id: 'negro', url: 'https://www.merriam-webster.com/dictionary/Negro', evidence: '核对词条正文：dated, often offensive；历史机构名称等语境需要区别处理。' },
  { id: 'maxwell', url: 'https://www.merriam-webster.com/dictionary/maxwell', evidence: '核对词条正文：确有磁通量单位义，也另列人物 Maxwell。' },
  { id: 'charlotte', url: 'https://www.merriam-webster.com/dictionary/charlotte', evidence: '核对词条正文：确有甜点义，不能只按姓名判断。' },
];

function group(words, type, decision, reason, refs = ['oxford-selection']) {
  for (const word of words.trim().split(/\s+/)) {
    const key = normalize(word);
    assert(!decisions.has(key), `Duplicate review: ${word}`);
    assert(vocabulary.some(item => normalize(item.word) === key), `Missing word: ${word}`);
    decisions.set(key, { type, decision, reason, refs });
  }
}

group(`david paul george james richard michael charles william robert mary edward thomas
ian alan stephen andrew brian chris anne steve jim simon jane philip wilson margaret
taylor elizabeth luke adam sarah tim nigel williams johnson scott sam neil patrick joseph
arthur keith anna andy helen howard dave lucy maggie matthew alexander francis colin laura
anthony nicholas douglas gary kate christopher oliver lloyd kevin diana stuart albert lawrence
owen rachel fred louis bernard maria hugh stewart clarke susan davies ann derek emily joan
walter barry moore evans ross eliot roy malcolm allen marie geoffrey barbara bruce clark hughes
liz benjamin harriet catherine robinson donald kenneth marshall johnny campbell karen
corbett daniel dennis duncan roberts emma louise julia kinnock stanley davis spencer thompson
alison julie samuel les ron harvey joyce craig pete barnes edwards ali kim willie lisa
sophie sara gabriel isabel harold herbert watson alfred trevor phillips tommy dorothy`,
'personal-name', 'exclude_default',
'当前以人名/姓氏为主要教学内容，或只有冷僻同形义；不建议占用通用每日新词或默认随机测验名额。可在姓名听辨/拼写专题中选学；保留原 ID 和历史。');

group(`york yorkshire gloucester kent durham essex nottingham sheffield swindon sussex
leicester lancashire cleveland norwich brighton norfolk aberdeen sunderland cornwall devon
somerset preston lancaster bradford hampshire suffolk southampton canterbury coventry
birmingham newcastle bristol leeds manchester liverpool glasgow belfast cardiff oxfordshire`,
'local-place', 'topic_only',
'具体地方、郡或地区名：适合旅行/留学/地名听辨专题，不作为全体用户默认日常词或未经核验的四级核心词。此建议不声称这些地点不重要。');

group(`freud marx shakespeare milton churchill kennedy gorbachev russell clinton hitler`,
'historical-cultural-name', 'topic_only',
'历史人物/作者姓名具有特定阅读背景价值；按文章/学科选学，比混入通用背词队列合适。姓名出现在新闻语料中不构成四级核心词依据。');

group(`oxford cambridge edinburgh westminster thames chelsea hollywood washington hamilton
anderson jackson harris virginia california brussels vienna zealand`,
'contextual-place-or-name', 'topic_only',
'城市/地区/文化机构或姓名存在语境价值；当前不应把专名识别等同于通用词汇掌握。选学保留，涉及人名/地名多义的条目须对齐具体例句。');

group(`microsoft guinness wimbledon oscar`, 'brand-event', 'topic_only',
'品牌、赛事或奖项宜随文化/技术/体育阅读理解，不宜强制进入每个人的基础背词计划。');

group(`ussr yugoslavia eec`, 'historical-entity', 'topic_only',
'历史国家/组织名称保留阅读解释价值，建议历史专题选学；不把历史实体当作当代日常核心词。');

group(`nhs raf nato gop ira des unix cos gen iii`, 'specialist-abbreviation-or-symbol', 'topic_only',
'机构、历史/地区制度、专业缩写或数字符号：应按使用场景选学。不同义项分别核验，不因缩写形式直接删除，也不默认作为通用四级核心。');

group(`inc corp usa ceo dna hiv aids jan oct nov feb aug max ref`, 'useful-abbreviation', 'keep',
'保留实用商务/科学/生活识读价值；缩写本身不是排除理由。未来编辑应整理大小写和主次义项，并核对相应读音。', ['oxford-selection', 'ceo', 'dna']);

group(`january november saturday tuesday april june july october september december february
friday monday wednesday thursday christmas mrs mister`, 'calendar-or-address', 'keep',
'月份、星期、节日或常见称谓具有直接生活用途；不能因首字母大写或与姓名同形而排除。');

group(`london england europe scotland america ireland wales japan paris italy spain russia
africa rome israel iraq asia moscow canada berlin dublin egypt poland iran korea
vietnam pakistan greece sweden brazil holland mexico kuwait switzerland norway hungary
jordan belgium netherlands denmark austria india australia france germany britain`,
'general-geography', 'keep',
'国家、洲、主要地理名称保留生活/新闻/考试阅读的识读价值；不声称其均属官方四级大纲，具体课程可按学习目标排序。');
// Multiword headwords are registered explicitly rather than split into words.
decisions.set('new zealand', { type: 'general-geography', decision: 'keep', reason: '新西兰国家名有旅行/留学/阅读识读价值；不因专名形式排除。', refs: ['oxford-selection'] });
decisions.set('el niño', { type: 'academic-geography', decision: 'keep', reason: '气候现象名称符合现有 IELTS 科学阅读场景，不能按人名或品牌排除。', refs: ['oxford-selection'] });

group(`scandinavia antarctica himalayas oceania antarctic roman mediterranean celsius cambrian
muslim christian anglo-saxon pleistocene jurassic arctic atlantic pacific african european
latin jewish arabian portuguese russian spanish swiss greek italian indian mars`,
'academic-geography-language', 'keep',
'地理、国籍/语言、宗教、科学术语符合当前学术/考试阅读范围。专名或大写形式不构成低价值证据；不同级别仍应按课程目标选取。');

group(`guilder harken thou lea thatcher carter cooper morris isle ben hong`, 'narrow-or-literary-sense', 'topic_only',
'当前义项偏历史货币、工艺职业、地域文化/行业或文学表达，宜进专题/进阶阅读识别，不作为初学者通用日常必背词。这里没有声称已测得其语料频率。');

group(`john peter jimmy sally`, 'name-homograph', 'topic_only',
'当前教学内容是普通词/短语义，不是单纯姓名。保留真实词义；建议按口语/短语/进阶阅读场景选学，不能按同拼姓名批量删除。');

group(`mark frank bill will hope grace rose jack`, 'useful-name-homograph', 'keep',
'现有释义包含有用的普通词义，须保留；禁止通过姓名黑名单或首字母规则整体排除。', ['oxford-selection', 'frank']);

group(`lewis ruth surrey ulster`, 'rare-sense-and-hint-conflict', 'sense_review',
'基础释义与原例句是实际普通词义，提示却转成人名/地名。建议按当前冷僻/专业义转专题选学，并先对齐提示，不能直接改成人名或删词。', ['lewis', 'ruth', 'surrey', 'ulster']);

group(`dec sept`, 'abbreviation-sense-conflict', 'sense_review',
'当前基础释义/例句与月份缩写提示不同。先确定要教授的义项，再核验大小写、释义、例句和音频；不能在旧 ID 下静默换义。');

group(`henry morgan charlotte kong`, 'name-or-specialist-sense-conflict', 'sense_review',
'姓名/专名例句与单位、马种、甜点或采锡专业义提示不一致。先按 ID 确定教学义项；专名义建议选学，专业义也不能直接当作日常核心。', ['oxford-selection', 'henry']);

group(`teen`, 'useful-word-with-obsolete-sense', 'sense_review',
'值得保留青少年/青少年时期义，但当前基础释义为“愤怒、悲哀”，与例句和提示不同；须修正主教学义而非剔除这个常用词。', ['teen']);

group(`may august states commons lords`, 'useful-word-needs-scope', 'sense_review',
'保留学习价值，但词条兼有普通词、月份或专有短语义。先按具体义项/短语对齐教学目标，不把某个人名/机构义覆盖整个拼写。');

group(`joe jones charlie kelly caroline betty jonathan ralph clare victoria`, 'name-slang-homograph', 'sense_review',
'基础词条或例句以姓名为主，提示转向口语/俚语、食品或地名等其他义项。姓名义不建议默认必背；其他义需独立核对语域和例句后再决定课程。');

group(`maxwell`, 'name-or-specialist-sense', 'topic_only',
'磁通量单位义与人物/姓氏义均有特定使用场景，建议物理或历史专题选学；不是仅因像姓名而排除。', ['maxwell']);

group(`jean waggon tech`, 'useful-variant-or-scope', 'sense_review',
'保留实际使用价值，但须按复数 jeans、wagon 拼写变体或 tech 的具体义项组织教学。不能因表面像人名/冷僻形式就删除整条，也不宜重复计算学习负担。');

group(`mick negro`, 'offensive-group-label', 'restricted_context',
'仅在历史引文/词语辨析中解释，不建议默认产出练习或要求学习者用其称呼他人。Mick 还可为人名，需与族群贬称分开。原 ID、记录和历史音频仍保留。', ['mick']);

group(`oriental caucasian aborigine cripple dumb lame disabled`, 'register-and-sense-review', 'sense_review',
'不整词删除：需逐义区分历史族群称呼、残障指称与当代普通形容词/动词用法，并核对中文语域。当前数据不宜把所有义项当作可互换的中性表达。');

group(`jesus christ santa olympics commonwealth gospel`, 'cultural-or-institutional-word', 'keep',
'文化、节日、体育或社会制度阅读有识读价值；保留原课程范围，按具体语境学习，不据此声称普遍属于初级或四级核心。');

// Broad screening deliberately catches these ordinary words. Explicitly dismiss
// them so matching Chinese words such as “城市/公司/外套” never means exclusion.
group(`airline angel brand capital city coat presidential urban corporation philosopher civic
urbanization physicist presidency composer abbreviate metropolitan wagon contraction chariot
pope abbreviation overcoat jacket urbanise urbanisation carriage politician president statesman
company firm surname town cab outsider philosophical county poet musician seaport corporate
subsidiary sheriff fiction literary astronomy astronomer offense offence`,
'screening-false-positive', 'keep',
'筛查关键词命中了普通名词/形容词或其释义，并非专名/无价值条目；本轮不建议因此降级或删除。');

// Specific dictionary evidence supports its own headword, not every member of
// an editorial group. Other entries retain the general curriculum rationale.
const directRefs = {
  ceo: ['ceo'], dna: ['dna'], frank: ['frank'],
  lewis: ['lewis'], ruth: ['ruth'], surrey: ['surrey'], ulster: ['ulster'],
  henry: ['henry'], charlotte: ['charlotte'], mick: ['mick'], negro: ['negro'],
};
for (const [word, review] of decisions) {
  review.refs = ['oxford-selection', ...(directRefs[word] || review.refs.filter(ref => !['ceo', 'dna', 'frank', 'lewis', 'ruth', 'surrey', 'ulster', 'henry', 'mick'].includes(ref)))];
  review.refs = [...new Set(review.refs)];
}

const meaningPattern = /人名|男子名|女子名|男人名|女人名|男名|女名|姓氏|姓\)|姓）|地名|城市|一郡|一州|一县|一市|首都|品牌|公司|缩写|缩略|abbr\.|古语|旧时|废语|罕用|冷僻|吊楔|马车|外套|郡|教皇|总统|政治家|哲学家|作曲家|物理学家|诗人|天使|福音/;
const scopePattern = /专有|缩写|缩略|称谓|古语|文学|冒犯|旧称/;
const records = [];
for (const word of vocabulary) {
  const hints = getCoreWordHints(word);
  const signals = [];
  if (meaningPattern.test(word.meaning)) signals.push('meaning-keyword');
  if (/[A-Z]/.test(word.word)) signals.push('uppercase-headword');
  if (hints.some(hint => scopePattern.test(hint.scope || ''))) signals.push('hint-scope');
  const review = decisions.get(normalize(word.word));
  const imported = importedByWord.get(normalize(word.word));
  if (review) signals.push('explicit-review');
  if (!signals.length) continue;
  records.push({
    id: word.id, word: word.word, categories: word.categories || [word.category],
    meaning: word.meaning, example: word.example,
    scopes: hints.map(hint => hint.scope), signals,
    ...(review || { type: 'unresolved', decision: 'needs_review', reason: '仅为机器候选，尚无收录价值结论。', refs: [] }),
    expansionImport: imported ? {
      source: 'data/daily_cet_expansion.csv', word: imported.word,
      meaning: imported.meaning, categories: imported.categories,
      originalRankAndTagAvailable: false,
    } : null,
    existingNoteSources: [...new Map(hints.flatMap(hint => hint.sources || []).map(source => [source.url, source])).values()],
  });
}
for (const key of decisions.keys()) assert(records.some(record => normalize(record.word) === key), key);
const counts = values => Object.fromEntries([...new Set(values)].sort().map(value => [value, values.filter(item => item === value).length]));
const labels = {
  exclude_default: '建议退出默认必背（保留选学/历史）',
  topic_only: '建议专题选学',
  keep: '保留当前学习价值',
  sense_review: '先核对义项/提示/语域',
  restricted_context: '仅限定语境识读',
  needs_review: '机器候选待核',
};
const report = {
  date: '2026-10-25', inputSha256: sha256(input), expansionSha256: sha256(expansionInput), totalRecords: vocabulary.length,
  scope: '全库程序筛查；对报告列出的特殊词条作单模型产品/语言审阅，不是全库逐词专家审校或考试大纲认证。',
  status: 'historical_recommendations', runtimeChanges: false,
  applied: { retiredCount: 247, details: 'docs/practical-vocabulary-replacement-2026-10-25.md' },
  evidenceBoundary: '收录建议是课程判断。参考来源核对方式逐项标注；existingNoteSources 为既有提示登记，本轮没有重新打开每个链接。不将词典收录、搜索命中、总词频、当前分类视为必背证明。',
  summary: {
    screened: records.length,
    matchedExpansionImport: records.filter(record => record.expansionImport).length,
    decisions: counts(records.map(record => record.decision)),
    types: counts(records.map(record => record.type)),
    categories: Object.fromEntries(['daily', 'cet4', 'cet6', 'toefl', 'ielts'].map(category => [category, counts(records.filter(record => record.categories.includes(category)).map(record => record.decision))])),
  },
  sources: sources.map(source => ({ ...source, checkedAt: '2026-10-25' })), records,
};
const escapeCell = value => String(value).replaceAll('|', '／').replaceAll('\n', ' ').replaceAll('\\n', ' ');
const lines = [
  '# 词库收录价值审查（2026-10-25）', '',
  '此表保留替换前的审查快照。用户随后授权移除148条姓名词与99条专题候选，实际替换及兼容措施见 `practical-vocabulary-replacement-2026-10-25.md`。审查脚本自身只生成报告。', '',
  `对全部 **${vocabulary.length} 条学习记录**进行程序筛查，报告列出 **${records.length} 条**；逐项结论为单模型产品/语言审阅，不代表独立语言专家审校或官方考试词表认证。未触发规则的词条不等于已经通过完整课程审查。`, '',
  '## 结论', '',
  '| 建议 | 记录数 |', '| --- | ---: |',
  ...Object.entries(report.summary.decisions).map(([decision, count]) => `| ${labels[decision]} | ${count} |`), '',
  '人名和英国地方名不宜普遍占用通用每日新词及默认随机测验名额；可保留查询、姓名听辨、地名/留学/历史等专题用途。这里建议调整今后的课程入口，不建议物理删除已有记录。', '',
  '月份、星期、国家名、国籍/语言、科学主题名、CEO/DNA 等有迁移价值的缩写应保留。Mark、Frank、Rose、May、Bill、Will 等同拼形式不能按人名名单批量处理。', '',
  '## 收录与分类问题的来源', '',
  '- `scripts/build-daily-cet-expansion.py` 将词头转成小写，按通用频率、Oxford/Collins 标记等排序，没有人名/地方名专门筛选。',
  '- `daily_only` 用高频候选补 750 条；`daily_cet4` 用 `cet4_only + high_frequency` 补 1050 条，并统一赋 `daily|cet4`。因此 `cet4` 现有标签不证明每条来自四级标记，更不等于经官方大纲核验。',
  '- `data/daily_cet_expansion.csv` 可追溯到现有问题词，但没有保留逐词原始 rank/tag/入选路径；当前本机也没有原始 ECDICT 压缩包。本轮无法倒推出每条当年的原始频率或原始考试标记。',
  '- 后来的原创例句/提示扩充有时选了不同义项。修正一个人名义项的文本正确性，不等于已经证明它适合核心背词课程。', '',
  '## 值得优先处理的义项问题', '',
  '| ID | 词条 | 当前问题与建议 |', '| ---: | --- | --- |',
  '| 6356 | teen | 基础释义“愤怒、悲哀”是旧义，例句/提示指青少年；保留词条价值，先修正教学义。 |',
  '| 6914 | mick | 基础释义中性写“爱尔兰人”，提示说明贬称，例句却是姓名；需区分 Mick 姓名与冒犯性的族群称呼。 |',
  '| 6409 | kong | 基础释义/提示为采锡术语，例句却是 King Kong；需先确定专业词或专名，不宜默认日常必背。 |',
  '| 5967 / 6724 / 6831 | henry / morgan / charlotte | 姓名例句与单位、马种、甜点义提示不一致；不能只因存在普通词义就认定当前教学已经一致。 |',
  '| 6281 / 6379 / 6500 / 6820 | lewis / ruth / ulster / surrey | 基础释义及例句有真实普通词义，提示却是专名；先对齐提示，再按专业/文学价值选学。 |',
  '| 6127 / 6358 | dec / sept | 当前公司/氏族义与月份缩写提示不同，不能静默把旧记录换成月份课程。 |', '',
  '这些是本轮发现/重新登记的课程或义项问题，与旧审计的 111 条待核线索有交集，但并非已完成那 111 条复核，也不能简单相加作为去重后的错误总数。', '',
  '## 判断依据和边界', '',
  '核心课程同时考虑可迁移用途、学习目标、具体义项与学习负担。参考 Oxford 的频率与学习者相关性原则；本报告没有执行完整 Oxford/CET/IELTS/TOEFL 名单比对，也没有给词条编造频率或 CEFR 等级。词典能查到，只能证明某义项存在，不能单独证明值得每个人必背。', '',
  ...report.sources.map(source => `- [${source.id}](${source.url})：${source.evidence}`), '',
  '表内结论依据当前基础词条、例句、提示及原始导入记录。机器 JSON 额外保留既有提示来源（`existingNoteSources`），这些是历史登记，不代表本轮已重新访问全部来源。', '',
  '## 后续落地要求', '',
  '1. 先对 `sense_review` 和限定语境项逐条定稿，修改英文文本/读音时同步重合成受影响音频。',
  '2. 未来以稳定 ID 增加课程收录状态；不删除 ID、不重编号、不修改已发布作业快照。不要仅按小写词头建立姓名黑名单。',
  '3. 默认新词、练习、干扰项与新作业使用一致收录策略；明确区分完整资料库与核心课程范围，核对前后端目录和范围序号兼容。',
  '4. 既有收藏、学习记录、到期复习、离线草稿、历史成绩继续可读。核心课程目标变化应解释分母变化，不能把调整范围当成用户学完。',
  '5. 导入端保存来源词表、原始 tag/rank、入选路径和编辑审查状态；取消为了凑数量而自动赋“核心”标签的做法。', '',
  '148条姓名词和99条专题候选现已按后续授权退出活动词库并替换；具体已实现的兼容措施见本批替换交接。其余义项与语域待核项仍需后续审查。', '',
  '## 逐条登记', '',
];
for (const decision of Object.keys(labels)) {
  const selected = records.filter(record => record.decision === decision);
  if (!selected.length) continue;
  lines.push(`### ${labels[decision]}（${selected.length}）`, '', '| ID | 词条 | 当前分类 | 当前释义 | 审阅结论 |', '| ---: | --- | --- | --- | --- |');
  for (const record of selected) lines.push(`| ${record.id} | ${escapeCell(record.word)} | ${record.categories.join(' / ')} | ${escapeCell(record.meaning)} | ${escapeCell(record.reason)} |`);
  lines.push('');
}
lines.push('## 复现与验证', '',
  '- 运行：`node scripts/audit-vocabulary-inclusion.mjs`。仅写本报告及同名 JSON，运行结束会核对源词库哈希不变。',
  `- 当前源词库 SHA-256：\`${report.inputSha256}\`。`,
  '- 建议按稳定 ID 登记在报告中；脚本内显式名单可审阅，程序筛查信号不会自行生成排除结论。',
  '- 未修改应用运行文件，无需本轮部署或 D1 迁移。', '');

assert.equal(sha256(await readFile(sourcePath)), sha256(activeInput), 'Vocabulary changed during audit');
assert.equal(new Set(records.map(record => record.id)).size, records.length);
await writeFile(new URL('docs/vocabulary-inclusion-audit.json', root), JSON.stringify(report, null, 2) + '\n');
await writeFile(new URL('docs/vocabulary-inclusion-audit.md', root), lines.join('\n'));
console.log(JSON.stringify(report.summary, null, 2));
const pending = records.filter(record => record.decision === 'needs_review');
if (pending.length) console.log('Pending:', pending.map(record => `${record.id}:${record.word}`).join(', '));
