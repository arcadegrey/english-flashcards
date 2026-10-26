// Convert the manually inspected source cache into compact, non-quoted evidence.
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const inspected = JSON.parse(await read('output/name-replacement/source-inspection.json'));
const rows = (await read('data/name-place-replacement/practical-2026-10-26.tsv')).trim().split('\n').map(row => row.split('\t'));
const editorial = {
  'power bank': 'ˈpaʊə bæŋk', groceries: 'ˈɡrəʊsəriz', leftovers: 'ˈleftəʊvəz', settings: 'ˈsetɪŋz',
  'log in': 'lɒɡ ˈɪn', 'log out': 'lɒɡ ˈaʊt', 'sign up': 'saɪn ˈʌp', 'fill in': 'fɪl ˈɪn',
  'look up': 'lʊk ˈʌp', 'look after': 'lʊk ˈɑːftə', 'look for': 'ˈlʊk fə', 'look forward to': 'lʊk ˈfɔːwəd tə',
  'put off': 'pʊt ˈɒf', 'pick up': 'pɪk ˈʌp', 'drop off': 'drɒp ˈɒf', 'turn on': 'tɜːn ˈɒn', 'turn off': 'tɜːn ˈɒf',
  'run out of': 'rʌn ˈaʊt əv', 'figure out': 'fɪɡər ˈaʊt', 'work out': 'wɜːk ˈaʊt', 'set up': 'set ˈʌp',
  'keep up with': 'kiːp ˈʌp wɪð', 'catch up': 'kætʃ ˈʌp', 'get along': 'ɡet əˈlɒŋ', 'put away': 'pʊt əˈweɪ',
  'try on': 'traɪ ˈɒn', 'take off': 'teɪk ˈɒf', 'put on': 'pʊt ˈɒn', 'hand in': 'hænd ˈɪn', 'sort out': 'sɔːt ˈaʊt',
  'pay back': 'peɪ ˈbæk', 'cut down on': 'kʌt ˈdaʊn ɒn', 'make up': 'meɪk ˈʌp', 'take part in': 'teɪk ˈpɑːt ɪn',
  'pay attention to': 'peɪ əˈtenʃn tə', 'deal with': 'ˈdiːl wɪð', 'depend on': 'dɪˈpend ɒn', 'apply for': 'əˈplaɪ fə',
  'ask for': 'ˈɑːsk fə', 'wait for': 'ˈweɪt fə', 'listen to': 'ˈlɪsn tə', 'be able to': 'bi ˈeɪbl tə',
  'be supposed to': 'bi səˈpəʊst tə', 'make an effort': 'meɪk ən ˈefət', 'take a break': 'teɪk ə ˈbreɪk',
  'make a decision': 'meɪk ə dɪˈsɪʒn', 'keep in mind': 'kiːp ɪn ˈmaɪnd', 'boarding pass': 'ˈbɔːdɪŋ pɑːs',
  'health insurance': 'ˈhelθ ɪnˌʃʊərəns', 'single ticket': 'ˌsɪŋɡl ˈtɪkɪt', 'exchange rate': 'ɪksˈtʃeɪndʒ reɪt',
  'interest rate': 'ˈɪntrəst reɪt', 'mobile data': 'ˌməʊbaɪl ˈdeɪtə', 'parking space': 'ˈpɑːkɪŋ speɪs',
  'email address': 'ˈiːmeɪl ədres', 'date of birth': 'ˌdeɪt əv ˈbɜːθ',
};
const webFacts = {
  'power bank': ['https://www.collinsdictionary.com/dictionary/english/power-bank', '柯林斯词典', '便携式储电装置，可给手机、相机等设备充电。'],
  'boarding pass': ['https://www.collinsdictionary.com/dictionary/english/boarding-pass', '柯林斯词典', '用于登机的电子代码或印刷卡片；可数名词。'],
  'health insurance': ['https://www.collinsdictionary.com/dictionary/english/health-insurance', '柯林斯词典', '承保医疗开支的保险。'],
  'exchange rate': ['https://www.collinsdictionary.com/dictionary/english/exchange-rate', '柯林斯词典', '以另一种货币数量表示的货币兑换比率；可数名词。'],
  'interest rate': ['https://www.collinsdictionary.com/dictionary/english/interest-rate', '柯林斯词典', '按借款或收益金额的百分比表达的利息比率；可数名词。'],
  'mobile data': ['https://www.samsung.com/uk/mobile-phone-buying-guide/what-is-mobile-data/', '三星官方 · 移动数据说明', '通过运营商移动网络连接互联网、按套餐计量的数据，与 Wi-Fi 区别。'],
};
const sources = [], phonetics = {};
for (const [word, pos, meaning, , , , , , slug] of rows) {
  const source = inspected.find(item => item.word === word);
  const web = webFacts[word];
  assert(web || source?.status === 'read', `Unread source: ${word}`);
  sources.push({ word, publisher: web?.[1] || '牛津学习词典', url: web?.[0] || source.url,
    checkedAt: '2026-10-26', status: 'source-checked',
    method: web ? 'web-tool-readable-entry' : 'readable-publisher-html',
    sha256: web ? createHash('sha256').update(web.join('|')).digest('hex') : source.sha256,
    hashOf: web ? 'review-fact-and-source-url (not webpage HTML)' : 'publisher-html',
    fact: web?.[2] || `${pos} ${meaning}；已核对该主词条、短语义项或明确搭配。`,
    ...(web ? {} : { headword: source.headwords[0], exactPhraseVisible: source.exactPhraseVisible }),
  });
  const ipa = editorial[word] ? `/${editorial[word]}/` : source?.phonetics?.[0];
  assert(ipa, `No reviewed IPA: ${word}`);
  phonetics[word] = { ipa, method: editorial[word] ? 'editor-transcribed-UK (phrase/inflection)' : 'dictionary-IPA',
    source: web?.[0] || source.url,
    note: editorial[word] ? '英式宽式编辑转写；弱读、重音随语境变化，不声称词典对整串文字直接提供此音标。' : '词典对应词条的首个英式 IPA。' };
}
await writeFile(new URL('data/name-place-replacement/sources-2026-10-26.json', root), JSON.stringify(sources, null, 2) + '\n');
await writeFile(new URL('data/name-place-replacement/phonetics-2026-10-26.json', root), JSON.stringify(phonetics, null, 2) + '\n');
console.log(`Saved ${sources.length} reviewed source facts and explicit IPA methods.`);
