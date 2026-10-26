// ID-bound editorial follow-up. Definitions and examples are original;
// dictionary references verify the senses, not copied prose.
import followup from './followupWordNotes.json' with { type: 'json' };
import senseReview from './senseReviewWordNotes.json' with { type: 'json' };
const rows = [
  [5873, 'sales', '名词与修饰用法 · 销售',
    '基础例句 boost sales 指提高销量或销售额；sales 也可表示销售业务，放在名词前可修饰 team、office 等。不要把这些用法与一次降价促销混为一谈。',
    'The new packaging helped increase sales of the juice.', '新包装帮助提高了这种果汁的销量。',
    'Our sales team visits the local shops every month.', '我们的销售团队每个月都会走访当地商店。', ['sale', 'sales']],
  [5941, 'states', '复数名词 · 州与美国的称呼',
    '基础例句 fifty states 指五十个州，states 是 state 的复数。the States 带定冠词且大写时可指美国；普通复数也可表示国家或状态，要按语境判断。',
    'The river crosses two states before reaching the sea.', '这条河流经两个州后入海。',
    'We visited three states during our summer trip.', '暑期旅行期间，我们游览了三个州。', ['state']],
  [5947, 'works', '短语用法 · 全套东西或配料',
    '基础例句 with the works 是非正式表达，指加上所有配料，不是带有作品。works 在其他语境也可指作品、工厂或机器的活动部件，不能把这些义项直接互换。',
    'For lunch, I ordered a sandwich with the works.', '午餐时，我点了一个加上全部配料的三明治。',
    'The mechanic offered a full service with the works.', '修理工提供了一整套全面保养服务。', ['the%20works']],
  [6258, 'online', '形容词与副词 · 在线',
    '修饰 course、meeting 等名词时是形容词；shop online、study online 中是副词，表示在网上进行。基础例句使用副词义，通常不需要另加介词。',
    'You can renew your library card online.', '你可以在网上续办借书证。',
    'The museum offers an online workshop for families.', '博物馆提供面向家庭的线上工作坊。', ['online']],
];
const reviewed = new Map(rows.map(([id, word, scope, text, en1, zh1, en2, zh2, refs]) => [String(id), {
  word, hint: { label: '用法提示', scope, text, exampleWords: [word],
    examples: [{ en: en1, zh: zh1 }, { en: en2, zh: zh2 }],
    sources: refs.map(ref => ({ id: `quality-2026-10-25-${ref}`, title: `韦氏词典 · ${decodeURIComponent(ref)}`,
      url: `https://www.merriam-webster.com/dictionary/${ref}`, checkedAt: '2026-10-25', use: 'factual-reference' })),
  },
}]));
export const getReviewedWordHints = word => {
  const id = String(word?.id);
  const entry = (Object.hasOwn(senseReview, id) ? senseReview[id] : undefined)
    || (Object.hasOwn(followup, id) ? followup[id] : undefined) || reviewed.get(id);
  return entry && entry.word === word?.word ? [entry.hint] : null;
};
