import { mergeVocabularyList } from './vocabularyMerge.js'
import { buildIeltsGrouping, filterVocabularySelection } from './vocabularyCatalog.js'

// Fetch into a private batch. Callers adopt it only after the complete scope is ready.
export async function loadVocabularyRange(selection, sources) {
  const { category, level = '', list = '', topic = '' } = selection
  const isCurrent = sources.isCurrent || (() => true)
  let tasks
  if (category === 'toefl') {
    const manifest = sources.toeflManifest || await sources.loadToeflManifest()
    const levels = manifest?.toefl?.levels || []
    tasks = levels.filter(entry => !level || String(entry.key) === String(level))
      .flatMap(entry => (entry.lists || []).filter(item => !list || String(item.key) === String(list))
        .map(item => ({ key: `${entry.key}:${item.key}`, count: item.count,
          load: () => sources.loadToeflList(manifest, entry.key, item.key) })))
  } else if (category === 'ielts') {
    const manifest = sources.ieltsManifest || await sources.loadIeltsManifest()
    const grouping = buildIeltsGrouping([], manifest)
    const lists = topic ? grouping.listsByTopic[topic] || [] : grouping.lists
    tasks = lists.filter(item => !list || String(item.key) === String(list))
      .map(item => ({ key: String(item.key), count: item.count,
        load: () => sources.loadIeltsList(manifest, item.key) }))
  } else {
    throw new Error('不支持的词库范围')
  }

  tasks = [...new Map(tasks.map(task => [task.key, task])).values()]
  if (!tasks.length) throw new Error('所选范围暂无可用词表，请返回重新选择')
  const batches = new Array(tasks.length)
  let next = 0
  let failed = false
  await Promise.all(Array.from({ length: Math.min(4, tasks.length) }, async () => {
    while (!failed && isCurrent() && next < tasks.length) {
      const index = next++
      const task = tasks[index]
      try {
        const words = await task.load()
        if (!Array.isArray(words) || new Set(words.map(word => String(word?.id))).size !== words.length
          || words.some(word => word?.id == null) || (Number.isFinite(Number(task.count)) && words.length !== Number(task.count))) {
          throw new Error('所选词库数据不完整，请重试')
        }
        batches[index] = words
      } catch (error) {
        failed = true
        throw error
      }
    }
  }))
  if (!isCurrent()) return null
  const words = mergeVocabularyList([], batches.flat())
  const scoped = filterVocabularySelection(words, {
    selectedCategory: category, selectedToeflLevel: level, selectedToeflList: category === 'toefl' ? list : '',
    selectedIeltsTopic: topic, selectedIeltsList: category === 'ielts' ? list : '',
  })
  if (!scoped.length) throw new Error('所选范围暂无可学习单词，请返回重新选择')
  return words
}
