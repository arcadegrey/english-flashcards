import { mergeWordProgress } from '../../shared/wordProgress.js';
import { normalizePreferences, mergePreferences } from '../../shared/planPreferences.js';
import { normalizeStudyHistory, mergeStudyHistory } from '../../shared/studyHistory.js';
import { pickRicherWord } from './vocabularyMerge.js';

export const dedupeIdList = (list) => {
  const safeList = Array.isArray(list) ? list : []
  const seen = new Set()
  const result = []

  safeList.forEach((item) => {
    if (item === null || item === undefined) return
    const key = String(item)
    if (seen.has(key)) return
    seen.add(key)
    result.push(item)
  })

  return result
}


const mergeCustomWordList = (baseList, extraList) => {
  const map = new Map()
  const applyList = (list) => {
    const safeList = Array.isArray(list) ? list : []
    safeList.forEach((word) => {
      const key = String(word?.word || '').trim().toLowerCase()
      if (!key) return
      map.set(key, pickRicherWord(map.get(key), word))
    })
  }

  applyList(baseList)
  applyList(extraList)
  return Array.from(map.values())
}


const normalizeRecord = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {})

export const normalizeProgressState = (progress) => {
  const masteredWords = dedupeIdList(progress?.masteredWords || [])
  const masteredSet = new Set(masteredWords.map((item) => String(item)))
  const learnedWords = dedupeIdList(progress?.learnedWords || []).filter(
    (item) => !masteredSet.has(String(item))
  )
  const wrongWords = dedupeIdList(progress?.wrongWords || []).filter(
    (item) => !masteredSet.has(String(item))
  )

  return {
    learnedWords,
    masteredWords,
    customWords: mergeCustomWordList([], progress?.customWords || []),
    wordProgress: normalizeRecord(progress?.wordProgress),
    wrongWords,
    studyHistory: normalizeStudyHistory(progress?.studyHistory),
    preferences: normalizePreferences(progress?.preferences),
  }
}

export const mergeProgress = (localProgress, cloudProgress) => {
  return normalizeProgressState({
    learnedWords: [...(cloudProgress.learnedWords || []), ...(localProgress.learnedWords || [])],
    masteredWords: [...(cloudProgress.masteredWords || []), ...(localProgress.masteredWords || [])],
    customWords: mergeCustomWordList(cloudProgress.customWords || [], localProgress.customWords || []),
    wordProgress: mergeWordProgress(cloudProgress.wordProgress, localProgress.wordProgress),
    wrongWords: [...(cloudProgress.wrongWords || []), ...(localProgress.wrongWords || [])],
    studyHistory: mergeStudyHistory(cloudProgress.studyHistory || [], localProgress.studyHistory || []),
    preferences: mergePreferences(cloudProgress?.preferences, localProgress?.preferences),
  })
}

export const areProgressStatesEqual = (left, right) => {
  const l = normalizeProgressState(left)
  const r = normalizeProgressState(right)
  return (
    JSON.stringify(l.learnedWords) === JSON.stringify(r.learnedWords) &&
    JSON.stringify(l.masteredWords) === JSON.stringify(r.masteredWords) &&
    JSON.stringify(l.customWords) === JSON.stringify(r.customWords) &&
    JSON.stringify(l.wordProgress) === JSON.stringify(r.wordProgress) &&
    JSON.stringify(l.wrongWords) === JSON.stringify(r.wrongWords) &&
    JSON.stringify(l.studyHistory) === JSON.stringify(r.studyHistory) &&
    JSON.stringify(l.preferences) === JSON.stringify(r.preferences)
  )
}

export const serializeProgressState = (progress) => JSON.stringify(normalizeProgressState(progress))

const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const keyed = (list, key) => Object.fromEntries(list.map(item => [key(item), item]));

// Replay only changes made after the request started. A union alone would
// resurrect removed recognition/wrong-word marks or an explicit progress reset.
export function rebaseProgress(sent, current, remote, { resetLearning = false } = {}) {
  const before = normalizeProgressState(sent);
  const latest = normalizeProgressState(current);
  const result = normalizeProgressState(remote);
  const rebaseRecord = (base, local, server, merge = (a, b) => ({ ...a, ...b })) => {
    const next = { ...server };
    for (const key of Object.keys(base)) if (!Object.hasOwn(local, key)) delete next[key];
    return merge(next, Object.fromEntries(Object.entries(local).filter(([key, value]) => !same(value, base[key]))));
  };
  for (const field of ['learnedWords', 'masteredWords', 'wrongWords']) {
    const oldIds = new Set(before[field].map(String));
    const newIds = new Set(latest[field].map(String));
    result[field] = dedupeIdList([
      ...result[field].filter(id => !oldIds.has(String(id)) || newIds.has(String(id))),
      ...latest[field].filter(id => !oldIds.has(String(id))),
    ]);
  }
  // A local change of recognition status overrides the old remote membership.
  for (const field of ['learnedWords', 'masteredWords']) {
    const other = field === 'learnedWords' ? 'masteredWords' : 'learnedWords';
    const previous = new Set(before[field].map(String));
    const added = new Set(latest[field].filter(id => !previous.has(String(id))).map(String));
    result[other] = result[other].filter(id => !added.has(String(id)));
  }
  result.wordProgress = rebaseRecord(before.wordProgress, latest.wordProgress, result.wordProgress, mergeWordProgress);
  const wordKey = word => String(word.word).trim().toLowerCase();
  result.customWords = Object.values(rebaseRecord(keyed(before.customWords, wordKey), keyed(latest.customWords, wordKey), keyed(result.customWords, wordKey)));
  const history = rebaseRecord(keyed(before.studyHistory, day => day.date), keyed(latest.studyHistory, day => day.date), keyed(result.studyHistory, day => day.date),
    (base, changed) => keyed(mergeStudyHistory(Object.values(base), Object.values(changed)), day => day.date));
  result.studyHistory = Object.values(history);
  if (!same(before.preferences, latest.preferences)) result.preferences = mergePreferences(result.preferences, latest.preferences);
  if (resetLearning) {
    for (const field of ['learnedWords', 'masteredWords', 'wrongWords', 'wordProgress', 'studyHistory']) result[field] = latest[field];
  }
  return normalizeProgressState(result);
}
