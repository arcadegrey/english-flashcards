import { normalizePreferences, mergePreferences } from '../shared/planPreferences.js';
import { mergeWordProgress, mergeWordRecognition } from '../shared/wordProgress.js';
import { normalizeStudyHistory, mergeStudyHistory } from '../shared/studyHistory.js';

export const EMPTY_PROGRESS = {
  learnedWords: [],
  masteredWords: [],
  customWords: [],
  wordProgress: {},
  wrongWords: [],
  studyHistory: [],
  preferences: {},
};

const normalizeIdArray = (value) => {
  const list = Array.isArray(value) ? value : [];
  const seen = new Set();
  const output = [];
  for (const item of list) {
    if (item == null) continue;
    const key = String(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    output.push(item);
  }
  return output;
};

const normalizeCustomWords = (value) => {
  const list = Array.isArray(value) ? value : [];
  return list.filter((item) => item && typeof item === 'object' && String(item.word || '').trim());
};

const normalizeRecord = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {});

const countFilledFields = (word) => {
  if (!word || typeof word !== 'object') return 0;
  const keys = ['phonetic', 'pos', 'meaning', 'example', 'exampleCn', 'category', 'level', 'list'];
  return keys.reduce((count, key) => {
    const value = String(word[key] ?? '').trim();
    return value ? count + 1 : count;
  }, 0);
};

const pickRicherWord = (currentWord, incomingWord) => {
  if (!currentWord) return incomingWord;
  if (!incomingWord) return currentWord;
  return countFilledFields(incomingWord) >= countFilledFields(currentWord) ? incomingWord : currentWord;
};

const mergeCustomWordList = (baseList, extraList) => {
  const map = new Map();
  const applyList = (list) => {
    const safeList = Array.isArray(list) ? list : [];
    safeList.forEach((word) => {
      const key = String(word?.word || '').trim().toLowerCase();
      if (!key) return;
      map.set(key, pickRicherWord(map.get(key), word));
    });
  };

  applyList(baseList);
  applyList(extraList);
  return Array.from(map.values());
};

export const normalizeProgress = (progress) => ({
  learnedWords: normalizeIdArray(progress?.learnedWords),
  masteredWords: normalizeIdArray(progress?.masteredWords),
  customWords: normalizeCustomWords(progress?.customWords),
  wordProgress: normalizeRecord(progress?.wordProgress),
  wrongWords: normalizeIdArray(progress?.wrongWords),
  studyHistory: normalizeStudyHistory(progress?.studyHistory),
  preferences: normalizePreferences(progress?.preferences),
});

export const mergeProgress = (baseProgress, incomingProgress) => {
  const base = normalizeProgress(baseProgress);
  const incoming = normalizeProgress(incomingProgress);

  const { masteredWords, learnedWords } = mergeWordRecognition(base, incoming);
  const masteredSet = new Set(masteredWords.map((item) => String(item)));
  const customWords = mergeCustomWordList(base.customWords || [], incoming.customWords || []);
  const wordProgress = mergeWordProgress(base.wordProgress, incoming.wordProgress);
  const wrongWords = normalizeIdArray([...(base.wrongWords || []), ...(incoming.wrongWords || [])]).filter(
    (item) => !masteredSet.has(String(item))
  );
  const studyHistory = mergeStudyHistory(base.studyHistory || [], incoming.studyHistory || []);

  return {
    learnedWords,
    masteredWords,
    customWords,
    wordProgress,
    wrongWords,
    studyHistory,
    preferences: mergePreferences(base.preferences, incoming.preferences),
  };
};

export const parseProgressText = (value) => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const parseProgressObjectText = (value) => {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
};
