import { COLLECTION_PRACTICE_SOURCES, MAX_COLLECTION_PRACTICE_WORDS, normalizeCollectionFocus } from '../../shared/collectionPractice.js';
import { EXAM_MODE_LABELS, createExamAttempt } from '../../shared/examAttempts.js';
import { isRetiredVocabularyId } from '../../shared/retiredVocabularyIds.js';
import { practiceVocabulary } from '../../shared/vocabularyPracticePolicy.js';
import { distinctVocabularyWords } from '../../shared/vocabularyAliases.js';
import { isDictationExample } from '../../shared/dictation.js';
import { buildHiddenSentence } from '../../shared/sentenceBlank.js';
import { readExamHistory } from './examHistory.js';

export function collectionPracticeWords(words) {
  const seen = new Set();
  return practiceVocabulary(words).filter(word => {
    const id = String(word?.id ?? '').trim();
    if (!id || id.length > 100 || seen.has(id) || isRetiredVocabularyId(id)
      || !String(word.word || '').trim() || !String(word.meaning || '').trim()) return false;
    seen.add(id); return true;
  });
}

export function normalizeCollectionSnapshot(value) {
  if (!value || !Array.isArray(value.wordIds) || !value.wordIds.length
    || value.wordIds.length > MAX_COLLECTION_PRACTICE_WORDS
    || value.wordIds.some(id => typeof id !== 'string' || !id.trim() || id.length > 100)
    || new Set(value.wordIds).size !== value.wordIds.length) throw new Error('定向练习词表无效。');
  const focus = normalizeCollectionFocus({ ...value, wordCount: value.wordIds.length });
  return { source: focus.source, key: focus.key, wordIds: [...value.wordIds].sort() };
}

export async function createCollectionSnapshot(source, ids) {
  if (!Object.hasOwn(COLLECTION_PRACTICE_SOURCES, source)) throw new Error('定向练习来源无效。');
  if (!Array.isArray(ids) || ids.some(id => id == null || !String(id).trim() || String(id).length > 100)) throw new Error('定向练习词表无效。');
  const wordIds = [...new Set(ids.map(String))].sort();
  if (wordIds.length > MAX_COLLECTION_PRACTICE_WORDS) throw new Error(`一次定向练习最多支持 ${MAX_COLLECTION_PRACTICE_WORDS} 词，请搜索缩小列表后重试。`);
  const bytes = new TextEncoder().encode(JSON.stringify([source, wordIds]));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const key = Array.from(new Uint8Array(digest), n => n.toString(16).padStart(2, '0')).join('');
  return normalizeCollectionSnapshot({ source, key, wordIds });
}

export const collectionFocus = snapshot => normalizeCollectionFocus({ ...snapshot, wordCount: snapshot.wordIds.length });

export function collectionDraftKey(ownerId, source, mode) {
  if (!Object.hasOwn(COLLECTION_PRACTICE_SOURCES, source) || !Object.hasOwn(EXAM_MODE_LABELS, mode)) throw new Error('定向练习草稿范围无效。');
  return `flashcards_collection_exam_draft:${encodeURIComponent(ownerId || 'guest')}:${source}:${mode}`;
}

export function readCollectionDraft(ownerId, source, mode) {
  try {
    const value = JSON.parse(localStorage.getItem(collectionDraftKey(ownerId, source, mode)));
    const snapshot = normalizeCollectionSnapshot(value?.collectionSnapshot);
    if (snapshot.source !== source || value.mode !== mode || value.category !== 'all' || value.scope !== 'all'
      || value.focus?.key !== snapshot.key || value.focus?.wordCount !== snapshot.wordIds.length
      || value.focus?.source !== source || typeof value.id !== 'string' || !/^[\w-]{1,80}$/.test(value.id)
      || !Number.isFinite(Date.parse(value.startedAt)) || !Array.isArray(value.answers) || value.answers.length > 20) return null;
    if (value.answers.some(answer => !snapshot.wordIds.includes(String(answer.wordId)))) return null;
    if (readExamHistory(ownerId).attempts.some(attempt => attempt.id === value.id)) return null;
    if (value.answers.length) createExamAttempt({ ...value, completedAt: new Date().toISOString() });
    return { ...value, collectionSnapshot: snapshot, focus: collectionFocus(snapshot) };
  } catch { return null; }
}

export const readCollectionDrafts = (ownerId, source) => Object.fromEntries(Object.keys(EXAM_MODE_LABELS)
  .map(mode => [mode, readCollectionDraft(ownerId, source, mode)]));

export function writeCollectionDraft(ownerId, mode, snapshot) {
  const normalized = normalizeCollectionSnapshot(snapshot);
  const draft = { id: crypto.randomUUID(), mode, category: 'all', scope: 'all', startedAt: new Date().toISOString(),
    answers: [], focus: collectionFocus(normalized), collectionSnapshot: normalized };
  try { localStorage.setItem(collectionDraftKey(ownerId, normalized.source, mode), JSON.stringify(draft)); }
  catch (error) { throw new Error('草稿保存失败，请检查浏览器存储空间或权限后重试。原有草稿已保留。', { cause: error }); }
  return draft;
}

export async function prepareCollectionVocabulary(snapshot, { loadWords, customWords = [], isBuiltIn }) {
  const normalized = normalizeCollectionSnapshot(snapshot);
  const checked = await createCollectionSnapshot(normalized.source, normalized.wordIds);
  if (checked.key !== normalized.key) throw new Error('草稿词表校验失败，原草稿已保留，请重新选择。');
  const loaded = await loadWords(normalized.wordIds);
  const byId = new Map([...customWords.filter(word => !isBuiltIn(word.id)), ...loaded].map(word => [String(word.id), word]));
  const words = collectionPracticeWords(normalized.wordIds.map(id => byId.get(id)).filter(Boolean));
  if (words.length !== normalized.wordIds.length) throw new Error('所选词表有词条暂不可用，草稿已保留。请重试或按当前列表重新开始。');
  return words;
}

export function collectionModeError(mode, words) {
  if (!Object.hasOwn(EXAM_MODE_LABELS, mode)) return '暂不支持这种练习方式。';
  if (!words.length) return '当前列表暂无可练习词。';
  if (['quiz', 'fillblank', 'matching'].includes(mode) && distinctVocabularyWords(words).length < 2) return '当前列表至少需要 2 个不同单词。';
  if (mode === 'fillblank' && !words.some(word => word.exampleDeferred && word.fillBlankAvailable !== false
    || buildHiddenSentence(word.example, word.word))) return '当前列表暂无可用于填空的例句。';
  if (mode === 'dictation' && !words.some(word => isDictationExample(word) || word.exampleDeferred && !word.example)) return '当前列表暂无可听写的例句。';
  return '';
}
