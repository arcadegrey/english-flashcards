// Original teaching notes; per-ID sources verify meaning/register, not copied definitions.
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const mw = word => `https://www.merriam-webster.com/dictionary/${word}`;
const ox = word => `https://www.oxfordlearnersdictionaries.com/definition/english/${word}`;
const rows = [
  [3125, {}, '动词 · 严重损害；名词称人有冒犯性',
    '基础例句用作动词，表示交通系统受到严重损害；把 cripple 用作人的名词称呼已经过时且冒犯。理解引文时要识别语域，不要用它给他人贴标签。',
    'A power failure could cripple the entire network.', '停电可能使整个网络瘫痪。',
    'The editor marked cripple as offensive when it refers to a person.', '编辑标明，cripple 用来指人时具有冒犯性。', [mw('cripple')]],
  [3367, { meaning: '原住民（旧称）；用于澳大利亚原住民的 Aborigine 可具有冒犯性，现代称呼应尊重具体族群的自称',
    example: 'The editor explained why the old report used the term aborigine.', exampleCn: '编辑解释了为什么旧报告使用了 aborigine 这个词。' },
    '历史词语识读 · 原住民的旧称',
    'aborigine 是旧称，尤其指澳大利亚原住民时可能冒犯；本条只讨论旧文本中的用词。现代写作宜使用具体族群名称或其认可的表达，不把所有原住民群体混为一谈。',
    'The exhibition explains the use of aborigine in an old catalogue.', '展览解释了旧目录中 aborigine 这个用词。',
    'The language guide discusses why aborigine can cause offence.', '这份语言指南讨论了 aborigine 为什么可能冒犯他人。', [mw('aborigine')]],
  [3491, { meaning: '高加索地区的／居民；旧种族分类中指白人的称呼，现代语境宜避免把它当作精确种族分类',
    example: 'The article examines the historical use of the label Caucasian.', exampleCn: '这篇文章考察了 Caucasian 这一标签在历史上的用法。' },
    '地理形容词与历史分类 · 注意语境',
    'Caucasian 可与高加索地区有关，也用于旧种族分类。本条讨论标签的历史用法，不把它当作现代科学上精确的人群分类；涉及个人身份时应尊重其自我认同。',
    'The historian discusses the label Caucasian in nineteenth-century writing.', '历史学家讨论了十九世纪著作中的 Caucasian 这一标签。',
    'The glossary separates the geographic and historical senses of Caucasian.', '术语表区分了 Caucasian 的地理义和历史分类义。', [mw('Caucasian'), 'https://www.cudenver.edu/university-communications/resources/editorial-style-guide']],
  [3660, { pos: 'adj./n.', meaning: '东方的；旧时指亚洲的表达，常显陈旧；作为人的称呼通常具有冒犯性，仅按具体语境识读' },
    '语域辨析 · 东方的旧式表达',
    'oriental 在旧的艺术、商品名称中可见，但用于亚洲人的名词或形容词称呼通常冒犯；用于文化的概括也常显陈旧。基础例句展示旧式用法，现代描述宜更具体。',
    'The guide explains the word oriental in an old furniture catalogue.', '指南解释了旧家具目录中的 oriental 一词。',
    'The editor replaced oriental with a more specific description.', '编辑把 oriental 换成了更具体的描述。', [mw('oriental')]],
  [5392, {}, '形容词 · 一时说不出话；注意贬义和旧称',
    '基础例句 struck dumb 表示受惊而一时说不出话；dumb 也可贬指愚蠢，用于不能说话的人则已过时且冒犯。不要把这几个义项都当作中性称呼。',
    'The unexpected news left the audience dumb for a moment.', '这个意外消息让听众一时说不出话来。',
    'The guide warns against using dumb to label a person who cannot speak.', '指南提醒，不要用 dumb 称呼不能说话的人。', [mw('dumb')]],
  [5463, { phonetic: '/meɪ/', pos: 'modal v.', meaning: '可以（表示许可）；可能（表示可能性）；May 表示五月，是另一个专名用法' },
    '情态动词 · 许可与可能',
    '基础例句中的 may 表示允许借用，后接动词原形，不因主语变化加 s。表示五月的 May 首字母大写，是月份名称，不能用月份义解释本句。',
    'You may use the spare desk until the room is needed.', '在有人需要这个房间之前，你可以使用那张备用书桌。',
    'The delivery may arrive earlier than expected.', '快递可能比预计更早送到。', [ox('may_1')]],
  [5941, {}, '复数名词 · 州；the States 指美国',
    '基础例句中的 fifty states 指五十个州，states 是 state 的复数；the States 大写时可指美国。普通词 state 还可表示国家或状态，需按语境判断，不因含有地理语境而删掉这个普通词。',
    'These two states share a long border.', '这两个州有一条很长的共同边界。',
    'The experiment compares matter in different states.', '这项实验比较了物质的不同状态。', [mw('state')]],
  [5956, { phonetic: '/ɔːˈɡʌst/', pos: 'adj.', meaning: '庄严的；令人敬畏的（正式）；月份 August 另读 /ˈɔːɡəst/',
    example: 'The ceremony took place in an august hall.', exampleCn: '典礼在一座庄严的大厅里举行。' },
    '正式形容词 · 庄严的；与月份区别',
    '本条沿用原例句的形容词义 august，主重音在后。月份 August 首字母大写，主重音在前；不能因拼写相同就把两种义项或录音混用。',
    'The committee gathered in an august chamber.', '委员会成员聚集在一间庄严的会议厅里。',
    'The narrator used august to describe the grand building.', '叙述者用 august 形容这座宏伟的建筑。', [ox('august_1'), mw('august')]],
  [6127, {}, '公司缩写 · DEC，区别于月份 Dec.',
    '基础例句中的 DEC 是 Digital Equipment Corporation 的公司名称，保留计算机历史语境；不是 December 的月份缩写 Dec.，也不把公司名称解释成普通动词或日期。',
    'The museum keeps a collection of computers made by DEC.', '博物馆保存着一批 DEC 制造的计算机。',
    'The archive includes technical manuals from DEC.', '档案中包含 DEC 的技术手册。', ['https://www.computerhistory.org/brochures/d-f/digital-equipment-corporation-dec/']],
  [6344, { meaning: 'the Commons／House of Commons 指英国下议院；commons 另可指平民或公共食堂，本条例句为议会义' },
    '机构短语 · 下议院',
    '基础例句中的 House of Commons 是英国下议院，不是普通公共食堂；commons 的其他普通词义需要独立语境。机构名称注意大写，通常与 the 连用。',
    'The proposal will be discussed in the House of Commons tomorrow.', '这项提案明天将在英国下议院讨论。',
    'The reporter waited outside the House of Commons.', '记者在英国下议院外等候。', [mw('commons')]],
  [6356, { meaning: '青少年；青少年的（通常为十三至十九岁）；古义中的苦难或悲哀不作为本条学习目标',
    example: 'The library runs a reading group for teen readers.', exampleCn: '图书馆为青少年读者开设了一个阅读小组。' },
    '名词与形容词 · 青少年',
    'teen 在本条指青少年或修饰与青少年有关的事物，teen years 指十三至十九岁的时期；表示苦难的旧义另有历史来源，不应覆盖当代常用义。',
    'The community centre offers a writing class for teen students.', '社区中心为青少年学生开设写作课。',
    'The magazine has a page of book reviews by teen readers.', '这本杂志有一页由青少年读者撰写的书评。', [mw('teen')]],
  [6358, { phonetic: '/sepˈtembə(r)/', pos: 'abbr.', meaning: '九月的缩写（规范写作 Sept.，朗读时通常读完整的 September）；名词 sept 的氏族义不用于本例',
    example: 'The new term begins on 5 Sept.', exampleCn: '新学期于九月五日开始。' },
    '月份缩写 · 九月，朗读全称',
    '本条按原例句的月份义教授，规范写法是 Sept.，通常朗读为 September。普通名词 sept 可指氏族分支，不要用 /sept/ 的读法解释日期中的月份缩写。',
    'The notice gives the closing date as 20 Sept.', '通知把截止日期写为九月二十日。',
    'Our course calendar starts with the heading Sept.', '我们的课程日历以 Sept. 为首个标题。', [ox('september'), mw('sept')]],
  [6366, { example: 'The new entrance improves access for disabled visitors.', exampleCn: '新入口改善了残障访客的通行条件。' },
    '形容词 · 残障；设备禁用另按语境',
    'disabled 可以修饰有残障的人，并非这个词本身一概冒犯；描述具体个人时尊重其表达偏好。原来的集合性称呼改为完整的访客语境，设备被禁用则是另一种用法。',
    'The hotel provides accessible rooms for disabled guests.', '酒店为残障住客提供无障碍客房。',
    'The guide explains how to reopen a disabled feature.', '指南说明了如何重新启用被禁用的功能。', [mw('disabled')]],
  [6634, { exampleCn: '这项法律提案在英国上议院辩论了数小时，昨晚才获通过。' },
    '复数名词与机构短语 · 勋爵；上议院',
    'lords 是 lord 的复数，可指贵族或勋爵；基础例句中的 House of Lords 指英国上议院。要区分普通复数与带定冠词、使用大写的机构名称。',
    'The book describes the duties of local lords in the Middle Ages.', '这本书描述了中世纪地方领主的职责。',
    'The House of Lords reviewed the proposed changes.', '英国上议院审议了拟议的修改。', [mw('lords'), ox('the-house-of-lords')]],
  [7123, { meaning: '技术学院（英式非正式）；技术、科技或技术人员的非正式简称，需依语境判断' },
    '非正式用法 · 技术学院与科技',
    '基础例句中的 tech college 指技术学院，与英式非正式名词 a tech 有关；tech 在其他语境也常指科技或技术人员，不能把这些义项一律替换为学校。',
    'She studied electronics at the local tech.', '她在当地技术学院学过电子学。',
    'The library hired a tech to repair its computers.', '图书馆请了一名技术人员维修电脑。', ['https://www.collinsdictionary.com/dictionary/english/tech', mw('tech')]],
  [8123, { phonetic: '/leɪm/', pos: 'adj.', meaning: '（借口、解释等）站不住脚的；（尤指动物）跛的。用于贬低人时不礼貌；织物 lamé 是另一个词',
    example: 'He gave a lame excuse for missing the meeting.', exampleCn: '他为缺席会议找了一个站不住脚的借口。' },
    '形容词 · 站不住脚；区别于织物 lamé',
    'lame /leɪm/ 可形容借口或解释缺乏说服力。织物 lamé 读音不同，指含金银色丝线的布料，不能译成蹩脚的连衣裙；不要用 lame 贬低他人或给残障人士贴标签。',
    'The teacher did not accept the lame excuse about the missing homework.', '老师没有接受那个有关作业丢失的牵强借口。',
    'The customer rejected a lame explanation for the delay.', '顾客不接受那个有关延误的站不住脚的解释。', [ox('lame_1'), 'https://dictionary.cambridge.org/dictionary/english/lame']],
  [8164, {}, '仅历史语境识读 · 过时且常具冒犯性的旧称',
    '本条仅用于理解历史文本或讨论这个词，不用于称呼他人，也不进入新的自主出题或班级词汇作业。历史机构专名中的原文有其具体背景，不能据此把日常称人用法中性化。',
    'The glossary explains why Negro appears in the historical quotation.', '术语表解释了为什么历史引文中出现 Negro 一词。',
    'The teacher discussed the dated label Negro without using it to address anyone.', '老师讨论了 Negro 这个过时标签，没有用它称呼任何人。', [mw('Negro')]],
  [8175, {}, '拼写变体 · 运货马车',
    'waggon 是 wagon 的英式拼写变体；原例句中的 hay 和 horses 明确指运货马车。保留稳定 ID 及记录，不把同一变体当成一套新的词源或与 wagon 相反的词义。',
    'The farmer stored tools in a wooden waggon.', '农夫把工具放在一辆木制运货马车里。',
    'An empty waggon stood beside the barn.', '谷仓旁停着一辆空的运货马车。', [mw('waggon'), 'https://www.oxfordlearnersdictionaries.com/definition/english/wagon']],
  [8213, {}, '名词 · 布料；裤子通常用 jeans',
    'jean 可指结实的斜纹棉布；原例句中的 jeans 是裤子义的常见复数形式，不能把裤子写成 a jean。a pair of jeans 指一条牛仔裤，英语数量结构与中文不同。',
    'The label says these trousers are made from jean.', '标签上写着这条裤子是斜纹棉布做的。',
    'I packed a pair of jeans for the weekend trip.', '我为周末旅行装了一条牛仔裤。', [mw('jean')]],
];
const path = 'data/sense-review/reviews-2026-10-26.json';
let register;
try { register = JSON.parse(await read(path)); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const vocabulary = JSON.parse(await read('public/data/vocabulary.json'));
const baseline = register?.baselineSha256 || createHash('sha256').update(JSON.stringify(vocabulary, null, 2) + '\n').digest('hex');
const notes = {}, reviews = [];
for (const [id, patch, scope, text, en, zh, en2, zh2, refs] of rows) {
  const i = vocabulary.findIndex(word => word.id === id);
  assert(i >= 0, `Missing active ${id}`);
  const previous = register?.reviews.find(review => review.id === id);
  const before = previous?.before || vocabulary[i];
  const after = { ...before, ...patch };
  if (previous) assert.deepEqual(vocabulary[i], previous.after, `Unexpected edits ${id}`);
  const publishers = { 'www.merriam-webster.com': '韦氏词典', 'www.oxfordlearnersdictionaries.com': '牛津学习词典',
    'www.collinsdictionary.com': '柯林斯词典', 'dictionary.cambridge.org': '剑桥词典',
    'www.cudenver.edu': '科罗拉多大学 · 编辑指南', 'www.computerhistory.org': '计算机历史博物馆' };
  const sources = refs.map((url, index) => ({ id: `sense-2026-10-26-${id}-${index}`, title: `${publishers[new URL(url).hostname] || new URL(url).hostname} · ${before.word}`,
    url, checkedAt: '2026-10-26', use: 'factual-reference' }));
  notes[id] = { word: before.word, hint: { label: '用法提示', scope, text, exampleWords: [id === 8213 ? 'jeans' : before.word],
    examples: [{ en, zh }, { en: en2, zh: zh2 }], sources } };
  if (id === 8213) notes[id].hint.exampleWords = ['jean', 'jeans'];
  reviews.push({ id, word: before.word, before, after, changedFields: Object.keys(patch).filter(key => before[key] !== after[key]),
    status: 'resolved_source_review', checkedAt: '2026-10-26', sources,
    finding: scope, practicePolicy: id === 8164 ? 'context-only; excluded from new assessments and assignments' : 'teach stated sense; do not treat old or offensive senses as neutral',
    evidenceBoundary: '模型参考公开来源核对；释义、中文说明与例句由本项目编写，不代表独立语言专家审校。' });
  vocabulary[i] = after;
}
await mkdir(new URL('data/sense-review/', root), { recursive: true });
for (const [file, value] of [[path, { date: '2026-10-26', baselineSha256: baseline, reviews }], ['src/data/senseReviewWordNotes.json', notes], ['public/data/vocabulary.json', vocabulary]]) {
  await writeFile(new URL(file, root), JSON.stringify(value, null, 2) + '\n');
}
console.log(`Reviewed ${reviews.length} remaining active records; rewrote ${reviews.filter(review => review.changedFields.includes('example')).length} English examples.`);
