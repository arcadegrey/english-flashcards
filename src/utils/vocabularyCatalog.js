import { getWordIeltsLists, wordBelongsToCategory, wordHasIeltsCategory, wordHasToeflCategory } from './wordCategories.js'
import categories from '../data/categories.js'

// Directory projections only; loading, selection state and study progress stay with their owners.
export const TOEFL_UNKNOWN_LEVEL = 'unknown'
export const TOEFL_UNKNOWN_LIST = 'unknown'
const IELTS_UNKNOWN_TOPIC = 'unknown'

const extractNumericTag = (value) => {
  const text = String(value ?? '').trim()
  if (!text) return null

  const match = text.match(/\d+/)
  if (!match) return null

  const parsed = Number(match[0])
  if (!Number.isFinite(parsed) || parsed <= 0) return null
  return parsed
}

const getToeflMeta = (word) => {
  if (!word || !wordHasToeflCategory(word)) {
    return { level: null, list: null }
  }

  const wordId = Number(word.id)
  let level = extractNumericTag(word.level)
  let list = extractNumericTag(word.list)

  // Backward compatibility for the previously imported 300 TOEFL words (id 501-800).
  if (!level && Number.isInteger(wordId) && wordId >= 501 && wordId <= 800) {
    level = 3
  }
  if (!list && level === 3 && Number.isInteger(wordId) && wordId >= 501 && wordId <= 800) {
    list = Math.ceil((wordId - 500) / 30)
  }

  return { level, list }
}

const matchesToeflLevel = (word, selectedLevel) => {
  const { level } = getToeflMeta(word)
  if (selectedLevel === TOEFL_UNKNOWN_LEVEL) {
    return level == null
  }
  return String(level) === String(selectedLevel)
}

const matchesToeflList = (word, selectedList) => {
  const { list } = getToeflMeta(word)
  if (selectedList === TOEFL_UNKNOWN_LIST) {
    return list == null
  }
  return String(list) === String(selectedList)
}

const getIeltsMeta = (word) => {
  if (!word || !wordHasIeltsCategory(word)) {
    return { lists: [] }
  }

  return { lists: getWordIeltsLists(word) }
}

const matchesIeltsList = (word, selectedList) => {
  const { lists } = getIeltsMeta(word)
  if (selectedList === TOEFL_UNKNOWN_LIST) {
    return lists.length === 0
  }
  return lists.some((list) => String(list) === String(selectedList))
}

export const getIeltsTopicKey = (list) => {
  const numericList = Number(list)

  if (Number.isFinite(numericList)) {
    if (numericList >= 1 && numericList <= 4) return 'nature-geography'
    if (numericList >= 5 && numericList <= 6) return 'plant-research'
    if (numericList >= 7 && numericList <= 9) return 'animal-conservation'
    if (numericList === 10) return 'space-exploration'
    if (numericList >= 11 && numericList <= 17) return 'school-education'
    if (numericList >= 18 && numericList <= 19) return 'technology-invention'
    if (numericList === 20) return 'culture-history'
    if (numericList >= 21 && numericList <= 22) return 'language-evolution'
    if (numericList >= 23 && numericList <= 25) return 'entertainment-sports'
    if (numericList >= 26 && numericList <= 27) return 'objects-materials'
    if (numericList >= 28 && numericList <= 29) return 'fashion-trends'
    if (numericList >= 30 && numericList <= 32) return 'food-health'
    if (numericList >= 33 && numericList <= 35) return 'architecture-places'
    if (numericList >= 36 && numericList <= 37) return 'transport-travel'
    if (numericList >= 38 && numericList <= 40) return 'nation-government'
    if (numericList >= 41 && numericList <= 43) return 'society-economy'
    if (numericList >= 44 && numericList <= 45) return 'law-regulation'
    if (numericList >= 46 && numericList <= 47) return 'warfare-battlefield'
    if (numericList >= 48 && numericList <= 49) return 'warfare-battlefield'
    if (numericList === 50) return 'social-relationships'
    if (numericList >= 51 && numericList <= 56) return 'actions-behaviors'
  }

  return IELTS_UNKNOWN_TOPIC
}

const getIeltsTopicLabel = (topicKey) => {
  const labels = {
    'nature-geography': '自然地理',
    'plant-research': '植物研究',
    'animal-conservation': '动物保护',
    'space-exploration': '太空探索',
    'school-education': '学校教育',
    'technology-invention': '科技发明',
    'culture-history': '文化历史',
    'language-evolution': '语言演化',
    'entertainment-sports': '娱乐运动',
    'objects-materials': '物品材料',
    'fashion-trends': '时尚潮流',
    'food-health': '饮食健康',
    'architecture-places': '建筑场所',
    'transport-travel': '交通旅游',
    'nation-government': '国家政府',
    'society-economy': '社会经济',
    'law-regulation': '法律法规',
    'warfare-battlefield': '征战沙场',
    'social-relationships': '社会关系',
    'actions-behaviors': '行为动作',
    [IELTS_UNKNOWN_TOPIC]: '未分主题',
  }
  return labels[topicKey] || '未分主题'
}

const matchesIeltsTopic = (word, selectedTopic) => {
  const { lists } = getIeltsMeta(word)
  if (lists.length === 0) {
    return String(selectedTopic || IELTS_UNKNOWN_TOPIC) === IELTS_UNKNOWN_TOPIC
  }
  return lists.some((list) => getIeltsTopicKey(list) === String(selectedTopic || IELTS_UNKNOWN_TOPIC))
}

const sortNumericKeyWithUnknownLast = (a, b, unknownKey) => {
  if (a === unknownKey && b !== unknownKey) return 1
  if (b === unknownKey && a !== unknownKey) return -1

  const aNum = Number(a)
  const bNum = Number(b)
  if (Number.isFinite(aNum) && Number.isFinite(bNum)) {
    return aNum - bNum
  }
  return String(a).localeCompare(String(b))
}

export function buildToeflGrouping(allVocabulary, toeflManifest) {
  if (toeflManifest?.toefl?.levels?.length) {
    const levels = toeflManifest.toefl.levels
      .map((entry) => ({
        key: String(entry.key),
        label: entry.label || (String(entry.key) === TOEFL_UNKNOWN_LEVEL ? '未分级' : `Level ${entry.key}`),
        count: Number(entry.count) || 0,
        meta: entry.meta || `${entry.lists?.length || 0} 个 List`,
      }))
      .sort((a, b) => sortNumericKeyWithUnknownLast(a.key, b.key, TOEFL_UNKNOWN_LEVEL))

    const listsByLevel = {}
    toeflManifest.toefl.levels.forEach((entry) => {
      listsByLevel[String(entry.key)] = (entry.lists || [])
        .map((item) => ({
          key: String(item.key),
          label: item.label || (String(item.key) === TOEFL_UNKNOWN_LIST ? '未分 List' : `List ${item.key}`),
          count: Number(item.count) || 0,
          path: item.path,
        }))
        .sort((a, b) => sortNumericKeyWithUnknownLast(a.key, b.key, TOEFL_UNKNOWN_LIST))
    })

    return {
      total: Number(toeflManifest.toefl.total) || levels.reduce((sum, item) => sum + item.count, 0),
      levels,
      listsByLevel,
    }
  }

  const levelBuckets = new Map()

  allVocabulary.forEach((word) => {
    if (!wordHasToeflCategory(word)) return

    const { level, list } = getToeflMeta(word)
    const levelKey = level ? String(level) : TOEFL_UNKNOWN_LEVEL
    const listKey = list ? String(list) : TOEFL_UNKNOWN_LIST

    if (!levelBuckets.has(levelKey)) {
      levelBuckets.set(levelKey, {
        key: levelKey,
        count: 0,
        lists: new Map(),
      })
    }

    const levelEntry = levelBuckets.get(levelKey)
    levelEntry.count += 1
    levelEntry.lists.set(listKey, (levelEntry.lists.get(listKey) || 0) + 1)
  })

  const levels = Array.from(levelBuckets.values())
    .map((entry) => ({
      key: entry.key,
      label: entry.key === TOEFL_UNKNOWN_LEVEL ? '未分级' : `Level ${entry.key}`,
      count: entry.count,
      meta: `${entry.lists.size} 个 List`,
    }))
    .sort((a, b) => sortNumericKeyWithUnknownLast(a.key, b.key, TOEFL_UNKNOWN_LEVEL))

  const listsByLevel = {}
  levelBuckets.forEach((entry, levelKey) => {
    listsByLevel[levelKey] = Array.from(entry.lists.entries())
      .map(([listKey, count]) => ({
        key: listKey,
        label: listKey === TOEFL_UNKNOWN_LIST ? '未分 List' : `List ${listKey}`,
        count,
      }))
      .sort((a, b) => sortNumericKeyWithUnknownLast(a.key, b.key, TOEFL_UNKNOWN_LIST))
  })

  return {
    total: levels.reduce((sum, item) => sum + item.count, 0),
    levels,
    listsByLevel,
  }
}

export function buildIeltsGrouping(allVocabulary, ieltsManifest) {
  if (ieltsManifest?.ielts?.lists?.length) {
    const manifestTopics = Array.isArray(ieltsManifest.ielts.topics) ? ieltsManifest.ielts.topics : []
    const lists = ieltsManifest.ielts.lists
      .map((item) => ({
        key: String(item.key),
        label: item.label || (String(item.key) === TOEFL_UNKNOWN_LIST ? '未分 List' : `List ${item.key}`),
        count: Number(item.count) || 0,
        path: item.path,
        topicKey: String(item.topicKey || getIeltsTopicKey(item.key)),
        topicLabel: item.topicLabel,
      }))
      .sort((a, b) => sortNumericKeyWithUnknownLast(a.key, b.key, TOEFL_UNKNOWN_LIST))

    const listsByTopic = {}
    const topics =
      manifestTopics.length > 0
        ? manifestTopics
            .map((topic) => ({
              key: String(topic.key),
              label: topic.label || (String(topic.key) === IELTS_UNKNOWN_TOPIC ? '未分主题' : String(topic.key)),
              count: Number(topic.count) || 0,
              meta: topic.meta || `${topic.lists?.length || 0} 个 List`,
            }))
        : []

    if (manifestTopics.length > 0) {
      manifestTopics.forEach((topic) => {
        listsByTopic[String(topic.key)] = (topic.lists || [])
          .map((item) => ({
            key: String(item.key),
            label: item.label || (String(item.key) === TOEFL_UNKNOWN_LIST ? '未分 List' : `List ${item.key}`),
            count: Number(item.count) || 0,
            path: item.path,
            topicKey: String(topic.key),
          }))
          .sort((a, b) => sortNumericKeyWithUnknownLast(a.key, b.key, TOEFL_UNKNOWN_LIST))
      })
    } else {
      lists.forEach((item) => {
        const topicKey = item.topicKey
        if (!listsByTopic[topicKey]) listsByTopic[topicKey] = []
        listsByTopic[topicKey].push(item)
      })
      Object.entries(listsByTopic).forEach(([topicKey, topicLists]) => {
        topics.push({
          key: topicKey,
          label: topicKey === IELTS_UNKNOWN_TOPIC ? '未分主题' : topicLists[0]?.topicLabel || getIeltsTopicLabel(topicKey),
          count: topicLists.reduce((sum, item) => sum + item.count, 0),
          meta: `${topicLists.length} 个 List`,
        })
      })
    }

    return {
      total: Number(ieltsManifest.ielts.total) || lists.reduce((sum, item) => sum + item.count, 0),
      topics,
      listsByTopic,
      lists,
    }
  }

  const listBuckets = new Map()
  allVocabulary.forEach((word) => {
    if (!wordHasIeltsCategory(word)) return
    const { lists } = getIeltsMeta(word)
    for (const listKey of lists.length ? lists : [TOEFL_UNKNOWN_LIST]) {
      listBuckets.set(listKey, (listBuckets.get(listKey) || 0) + 1)
    }
  })

  const lists = Array.from(listBuckets.entries())
    .map(([listKey, count]) => ({
      key: listKey,
      label: listKey === TOEFL_UNKNOWN_LIST ? '未分 List' : `List ${listKey}`,
      count,
    }))
    .sort((a, b) => sortNumericKeyWithUnknownLast(a.key, b.key, TOEFL_UNKNOWN_LIST))

  const topicBuckets = new Map()
  lists.forEach((item) => {
    const topicKey = getIeltsTopicKey(item.key)
    if (!topicBuckets.has(topicKey)) {
      topicBuckets.set(topicKey, {
        key: topicKey,
        label: getIeltsTopicLabel(topicKey),
        count: 0,
        lists: [],
      })
    }
    const topic = topicBuckets.get(topicKey)
    topic.count += item.count
    topic.lists.push(item)
  })

  const topics = Array.from(topicBuckets.values()).map((topic) => ({
    key: topic.key,
    label: topic.label,
    count: topic.count,
    meta: `${topic.lists.length} 个 List`,
  }))
  const listsByTopic = {}
  topicBuckets.forEach((topic) => {
    listsByTopic[topic.key] = topic.lists
  })

  return {
    total: lists.reduce((sum, item) => sum + item.count, 0),
    topics,
    listsByTopic,
    lists,
  }
}

export function filterVocabularySelection(allVocabulary, { selectedCategory, selectedIeltsList, selectedIeltsTopic, selectedToeflLevel, selectedToeflList }) {
  if (selectedCategory === 'all') {
    return allVocabulary
  }

  let filtered = allVocabulary.filter((word) => wordBelongsToCategory(word, selectedCategory))
  if (selectedCategory === 'ielts') {
    if (selectedIeltsTopic) {
      filtered = filtered.filter((word) => matchesIeltsTopic(word, selectedIeltsTopic))
    }
    if (selectedIeltsList) {
      filtered = filtered.filter((word) => matchesIeltsList(word, selectedIeltsList))
    }
    return filtered
  }

  if (selectedCategory !== 'toefl') {
    return filtered
  }

  if (selectedToeflLevel) {
    filtered = filtered.filter((word) => matchesToeflLevel(word, selectedToeflLevel))
  }

  if (selectedToeflList) {
    filtered = filtered.filter((word) => matchesToeflList(word, selectedToeflList))
  }

  return filtered
}

export function getVocabularySelectionLabel({ selectedCategory, selectedToeflLevel, selectedToeflList, selectedIeltsTopic, selectedIeltsList }, ieltsGrouping) {
  if (selectedCategory === 'toefl') {
    const levelLabel =
      selectedToeflLevel === TOEFL_UNKNOWN_LEVEL
        ? '未分级'
        : selectedToeflLevel
          ? `Level ${selectedToeflLevel}`
          : ''
    const listLabel =
      selectedToeflList === TOEFL_UNKNOWN_LIST
        ? '未分 List'
        : selectedToeflList
          ? `List ${selectedToeflList}`
          : ''

    return ['托福词汇', levelLabel, listLabel].filter(Boolean).join(' · ')
  }

  if (selectedCategory === 'ielts') {
    const topicLabel = selectedIeltsTopic
      ? ieltsGrouping.topics.find((item) => item.key === selectedIeltsTopic)?.label || '未分主题'
      : ''
    const listLabel =
      selectedIeltsList === TOEFL_UNKNOWN_LIST
        ? '未分 List'
        : selectedIeltsList
          ? `List ${selectedIeltsList}`
          : ''

    return ['雅思词汇', topicLabel, listLabel].filter(Boolean).join(' · ')
  }

  const cat = categories.find((c) => c.id === selectedCategory)
  return cat ? cat.name : '全部单词'
}
