import { CORE_WORD_NOTES, CORE_SYNONYM_GROUPS, CORE_WORD_FORMATIONS, WORD_NOTE_SOURCES } from '../data/coreWordNotes.js';

const isSourceChecked = (section) => section?.review?.status === 'source-checked' &&
  /^\d{4}-\d{2}-\d{2}$/.test(section.review.checkedAt) &&
  Number.isFinite(Date.parse(section.review.checkedAt)) &&
  Array.isArray(section.sourceIds) && section.sourceIds.length > 0 &&
  section.sourceIds.every((id) => Object.hasOwn(WORD_NOTE_SOURCES, id));

const referencesFor = (section) => section.sourceIds.map((id) => ({ id, ...WORD_NOTE_SOURCES[id] }));

export const getCoreWordHints = (word = {}) => {
  const key = typeof word.word === 'string' ? word.word.trim().toLowerCase() : '';
  if (!Object.hasOwn(CORE_WORD_NOTES, key)) return [];
  const entry = CORE_WORD_NOTES[key];
  const synonyms = CORE_SYNONYM_GROUPS[entry.synonymGroup];
  const formation = CORE_WORD_FORMATIONS[entry.formation];
  const hints = [];
  if (isSourceChecked(synonyms) && synonyms.words.includes(key)) hints.push({
    label: synonyms.comparisonType === 'confusable' ? '易混词辨析' : '近义词辨析', scope: synonyms.sense,
    emphasis: synonyms.words.filter((item) => item !== key).join(' / '),
    text: `${synonyms.words.filter((item) => item !== key).join(' / ')}：${synonyms.note}`,
    examples: synonyms.examples, exampleWords: synonyms.words, sources: referencesFor(synonyms),
  });
  if (isSourceChecked(formation) && [formation.base, formation.derived].includes(key)) hints.push({
    label: '词根词缀',
    scope: formation.derived === key ? `本词构词 · ${formation.affixRole}` : `词族拓展 · ${formation.base} → ${formation.derived}`,
    emphasis: formation.expression,
    text: `${formation.expression}。${formation.note}`,
    sources: referencesFor(formation),
  });
  return hints;
};

// Clean import formatting for display without modifying the source entry.
export const formatWordDefinition = (meaning) => String(meaning || '')
  .replace(/\\r\\n|\\[nr]|\r?\n/g, '；')
  .replace(/；\s*；/g, '；')
  .trim();

export const getWordMeaningLine = (word = {}) => {
  const meaning = formatWordDefinition(word.meaning);
  if (!meaning) return '暂无释义';
  // Dictionary definitions often already include per-sense parts of speech.
  return /^(?:n|v|vt|vi|a|adj|ad|adv|prep|pron|conj|int|interj|aux|num|art|det)\./i.test(meaning)
    ? meaning : [word.pos, meaning].filter(Boolean).join(' ');
};

// Prefer source-checked editorial notes; otherwise use the current entry only.
export const getWordHints = (word = {}) => {
  const curated = getCoreWordHints(word);
  const practice = { label: '回忆练习', text: '暂时遮住释义，回想词义后再核对；需要提示时，可以选择“不认识”继续复习。' };
  if (curated.length) return [...curated, practice];
  return [
    { label: '词义回顾', text: formatWordDefinition(word.meaning) || '暂无释义，先跳过这个单词。' },
    { label: '例句练习', text: word.example
      ? `读一遍例句，试着说明 ${word.word || '这个词'} 在句中的含义，${word.exampleCn ? '再对照已有译文' : '再对照释义核对'}。`
      : '当前没有例句，可先朗读单词并回忆已有释义。' },
    practice,
  ];
};
