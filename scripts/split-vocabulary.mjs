import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import {
  getWordIeltsLists,
  wordHasExternalExamCategory,
  wordHasIeltsCategory,
  wordHasToeflCategory,
} from '../src/utils/wordCategories.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const vocabularyFilePath = path.resolve(projectRoot, 'public/data/vocabulary.json');
const splitRoot = path.resolve(projectRoot, 'public/data/vocabulary');
const toeflRoot = path.resolve(splitRoot, 'toefl');
const ieltsRoot = path.resolve(splitRoot, 'ielts');

const extractNumericTag = (value) => {
  const text = String(value ?? '').trim();
  if (!text) return '';

  const match = text.match(/\d+/);
  if (!match) return '';

  const parsed = Number(match[0]);
  if (!Number.isFinite(parsed) || parsed <= 0) return '';
  return String(parsed);
};

const sortNumericKeys = (left, right) => Number(left) - Number(right);

const getIeltsTopicMeta = (list) => {
  const numericList = Number(list);

  if (Number.isFinite(numericList)) {
    if (numericList >= 1 && numericList <= 4) {
      return { key: 'nature-geography', label: '自然地理' };
    }
    if (numericList >= 5 && numericList <= 6) {
      return { key: 'plant-research', label: '植物研究' };
    }
    if (numericList >= 7 && numericList <= 9) {
      return { key: 'animal-conservation', label: '动物保护' };
    }
    if (numericList === 10) {
      return { key: 'space-exploration', label: '太空探索' };
    }
    if (numericList >= 11 && numericList <= 17) {
      return { key: 'school-education', label: '学校教育' };
    }
    if (numericList >= 18 && numericList <= 19) {
      return { key: 'technology-invention', label: '科技发明' };
    }
    if (numericList === 20) {
      return { key: 'culture-history', label: '文化历史' };
    }
    if (numericList >= 21 && numericList <= 22) {
      return { key: 'language-evolution', label: '语言演化' };
    }
    if (numericList >= 23 && numericList <= 25) {
      return { key: 'entertainment-sports', label: '娱乐运动' };
    }
    if (numericList >= 26 && numericList <= 27) {
      return { key: 'objects-materials', label: '物品材料' };
    }
    if (numericList >= 28 && numericList <= 29) {
      return { key: 'fashion-trends', label: '时尚潮流' };
    }
    if (numericList >= 30 && numericList <= 32) {
      return { key: 'food-health', label: '饮食健康' };
    }
    if (numericList >= 33 && numericList <= 35) {
      return { key: 'architecture-places', label: '建筑场所' };
    }
    if (numericList >= 36 && numericList <= 37) {
      return { key: 'transport-travel', label: '交通旅游' };
    }
    if (numericList >= 38 && numericList <= 40) {
      return { key: 'nation-government', label: '国家政府' };
    }
    if (numericList >= 41 && numericList <= 43) {
      return { key: 'society-economy', label: '社会经济' };
    }
    if (numericList >= 44 && numericList <= 45) {
      return { key: 'law-regulation', label: '法律法规' };
    }
    if (numericList >= 46 && numericList <= 47) {
      return { key: 'warfare-battlefield', label: '征战沙场' };
    }
  }

  return { key: 'unknown', label: '未分主题' };
};

const writeJson = async (filePath, data) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
};

const splitVocabulary = async (vocabulary) => {
  const safeVocabulary = Array.isArray(vocabulary) ? vocabulary : [];
  const toeflBuckets = new Map();
  const ieltsBuckets = new Map();
  const coreVocabulary = [];

  safeVocabulary.forEach((word) => {
    if (!wordHasExternalExamCategory(word)) {
      coreVocabulary.push(word);
      return;
    }

    if (wordHasToeflCategory(word)) {
      const level = extractNumericTag(word.level) || 'unknown';
      const list = extractNumericTag(word.list) || 'unknown';
      const key = `${level}::${list}`;

      if (!toeflBuckets.has(key)) {
        toeflBuckets.set(key, { level, list, words: [] });
      }

      toeflBuckets.get(key).words.push(word);
    }

    if (wordHasIeltsCategory(word)) {
      const lists = getWordIeltsLists(word);
      const targetLists = lists.length > 0 ? lists : ['unknown'];

      targetLists.forEach((list) => {
        if (!ieltsBuckets.has(list)) {
          ieltsBuckets.set(list, { list, words: [] });
        }

        ieltsBuckets.get(list).words.push(word);
      });
    }
  });

  await fs.rm(toeflRoot, { recursive: true, force: true });
  await fs.rm(ieltsRoot, { recursive: true, force: true });
  await writeJson(path.resolve(splitRoot, 'core.json'), coreVocabulary);

  const levels = new Map();

  for (const bucket of Array.from(toeflBuckets.values()).sort((a, b) => {
    const levelSort = sortNumericKeys(a.level, b.level);
    return levelSort || sortNumericKeys(a.list, b.list);
  })) {
    const levelDirName = bucket.level === 'unknown' ? 'level-unknown' : `level-${bucket.level}`;
    const listFileName = bucket.list === 'unknown' ? 'list-unknown.json' : `list-${bucket.list}.json`;
    const relativePath = `/data/vocabulary/toefl/${levelDirName}/${listFileName}`;
    const filePath = path.resolve(toeflRoot, levelDirName, listFileName);

    await writeJson(filePath, bucket.words);

    if (!levels.has(bucket.level)) {
      levels.set(bucket.level, {
        key: bucket.level,
        label: bucket.level === 'unknown' ? '未分级' : `Level ${bucket.level}`,
        count: 0,
        lists: [],
      });
    }

    const levelEntry = levels.get(bucket.level);
    levelEntry.count += bucket.words.length;
    levelEntry.lists.push({
      key: bucket.list,
      label: bucket.list === 'unknown' ? '未分 List' : `List ${bucket.list}`,
      count: bucket.words.length,
      path: relativePath,
    });
  }

  const toeflManifest = {
    generatedAt: new Date().toISOString(),
    source: '/data/vocabulary.json',
    sourceTotal: safeVocabulary.length,
    core: {
      path: '/data/vocabulary/core.json',
      count: coreVocabulary.length,
    },
    toefl: {
      total: Array.from(levels.values()).reduce((sum, item) => sum + item.count, 0),
      levels: Array.from(levels.values()).map((level) => ({
        ...level,
        meta: `${level.lists.length} 个 List`,
        lists: level.lists.sort((a, b) => sortNumericKeys(a.key, b.key)),
      })),
    },
  };

  await writeJson(path.resolve(toeflRoot, 'manifest.json'), toeflManifest);

  const ieltsLists = [];
  const ieltsTopics = new Map();
  for (const bucket of Array.from(ieltsBuckets.values()).sort((a, b) => sortNumericKeys(a.list, b.list))) {
    const listFileName = bucket.list === 'unknown' ? 'list-unknown.json' : `list-${bucket.list}.json`;
    const relativePath = `/data/vocabulary/ielts/${listFileName}`;
    const filePath = path.resolve(ieltsRoot, listFileName);
    const topic = getIeltsTopicMeta(bucket.list);

    await writeJson(filePath, bucket.words);
    const listEntry = {
      key: bucket.list,
      label: bucket.list === 'unknown' ? '未分 List' : `List ${bucket.list}`,
      count: bucket.words.length,
      path: relativePath,
      topicKey: topic.key,
      topicLabel: topic.label,
    };

    ieltsLists.push(listEntry);

    if (!ieltsTopics.has(topic.key)) {
      ieltsTopics.set(topic.key, {
        key: topic.key,
        label: topic.label,
        count: 0,
        lists: [],
      });
    }

    const topicEntry = ieltsTopics.get(topic.key);
    topicEntry.count += bucket.words.length;
    topicEntry.lists.push(listEntry);
  }

  const ieltsTopicList = Array.from(ieltsTopics.values()).map((topic) => ({
    ...topic,
    meta: `${topic.lists.length} 个 List`,
    lists: topic.lists.sort((a, b) => sortNumericKeys(a.key, b.key)),
  }));

  const ieltsManifest = {
    generatedAt: new Date().toISOString(),
    source: '/data/vocabulary.json',
    sourceTotal: safeVocabulary.length,
    core: {
      path: '/data/vocabulary/core.json',
      count: coreVocabulary.length,
    },
    ielts: {
      total: ieltsLists.reduce((sum, item) => sum + item.count, 0),
      meta: `${ieltsTopicList.length} 个主题`,
      topics: ieltsTopicList,
      lists: ieltsLists,
    },
  };

  await writeJson(path.resolve(ieltsRoot, 'manifest.json'), ieltsManifest);
  return { core: toeflManifest.core, toefl: toeflManifest.toefl, ielts: ieltsManifest.ielts };
};

const main = async () => {
  const text = await fs.readFile(vocabularyFilePath, 'utf8');
  const vocabulary = JSON.parse(text);
  const manifest = await splitVocabulary(vocabulary);

  console.log(
    `Split vocabulary complete: core=${manifest.core.count}, toefl=${manifest.toefl.total}, toeflLevels=${manifest.toefl.levels.length}, ielts=${manifest.ielts.total}, ieltsTopics=${manifest.ielts.topics.length}, ieltsLists=${manifest.ielts.lists.length}.`
  );
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error('Split vocabulary failed:', error.message || error);
    process.exit(1);
  });
}

export { splitVocabulary };
