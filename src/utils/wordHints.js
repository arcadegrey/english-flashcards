import commonSenses from '../../data/vocabulary-common-senses-repair/hints-2026-10-29.json' with { type: 'json' };
import { formatWordDefinition } from './wordHintPresentation.js';
import { getReviewedWordHints } from '../data/reviewedWordNotes.js';
import { CORE_WORD_NOTES, CORE_SYNONYM_GROUPS, CORE_WORD_FORMATIONS, WORD_NOTE_SOURCES } from '../data/coreWordNotes.js';
import { vocabularyNoteKey } from '../../shared/vocabularyAliases.js';

const isSourceChecked = (section) => section?.review?.status === 'source-checked' &&
  /^\d{4}-\d{2}-\d{2}$/.test(section.review.checkedAt) &&
  Number.isFinite(Date.parse(section.review.checkedAt)) &&
  Array.isArray(section.sourceIds) && section.sourceIds.length > 0 &&
  section.sourceIds.every((id) => Object.hasOwn(WORD_NOTE_SOURCES, id));

const referencesFor = (section) => section.sourceIds.map((id) => ({ id, ...WORD_NOTE_SOURCES[id] }));

// Treat compounds and contractions as complete tokens, never guessed stems.
const splitExampleText = (text) => text.split(/([\p{L}\p{M}\p{N}_]+(?:[-'’][\p{L}\p{M}\p{N}_]+)*)/u).filter(Boolean);

const checkedExampleForms = (example, words) => {
  const tokens = new Set(splitExampleText(example.en || '').map(part => part.toLowerCase()));
  return (Array.isArray(example.forms) ? example.forms : []).filter(form =>
    isSourceChecked(form) && words.includes(form.word) &&
    typeof form.form === 'string' && /^[a-z]+(?:[-'’ ][a-z]+)*$/i.test(form.form) &&
    (form.form.includes(' ')
      ? form.word.includes(' ') && new RegExp(`(?<![\\p{L}\\p{M}\\p{N}_-])(?<![\\p{L}\\p{M}\\p{N}_]['’])${form.form.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\p{M}\\p{N}_-])(?!['’][\\p{L}\\p{M}\\p{N}_])`, 'iu').test(example.en || '')
      : tokens.has(form.form.toLowerCase()))
  );
};

export const getHintExampleParts = (example, words = []) => {
  const terms = [...new Set([...words, ...checkedExampleForms(example, words).map(item => item.form)]
    .map(term => term.toLowerCase()))].sort((a, b) => b.length - a.length);
  const text = example.en || '';
  if (!terms.length) return text ? [{ text, highlighted: false }] : [];
  const escapedTerms = terms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const boundary = '[\\p{L}\\p{M}\\p{N}_]';
  const pattern = new RegExp(`(?<![\\p{L}\\p{M}\\p{N}_-])(?<!${boundary}['’])(?:${escapedTerms.join('|')})(?![\\p{L}\\p{M}\\p{N}_-])(?!['’]${boundary})`, 'giu');
  const parts = [];
  let offset = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index > offset) parts.push({ text: text.slice(offset, match.index), highlighted: false });
    parts.push({ text: match[0], highlighted: true });
    offset = match.index + match[0].length;
  }
  if (offset < text.length) parts.push({ text: text.slice(offset), highlighted: false });
  return parts;
};

const getExistingCoreWordHints = (word = {}) => {
  const reviewed = getReviewedWordHints(word);
  if (reviewed) return reviewed;
  const key = vocabularyNoteKey(word);
  if (!Object.hasOwn(CORE_WORD_NOTES, key)) return [];
  const entry = CORE_WORD_NOTES[key];
  const synonyms = CORE_SYNONYM_GROUPS[entry.synonymGroup];
  const formation = CORE_WORD_FORMATIONS[entry.formation];
  const hints = [];
  if (isSourceChecked(synonyms) && synonyms.words.includes(key)) {
    const isUsage = synonyms.comparisonType === 'usage';
    const exampleWords = synonyms.correction?.canonical ? [synonyms.correction.canonical] : synonyms.words;
    const comparison = synonyms.words.filter((item) => item !== key).join(' / ');
    const sourceIds = [...new Set([...synonyms.sourceIds, ...synonyms.examples.flatMap(example =>
      checkedExampleForms(example, exampleWords).flatMap(form => form.sourceIds)
    )])];
    hints.push({
      label: isUsage ? '用法提示' : synonyms.comparisonType === 'confusable' ? '易混词辨析' : '近义词辨析',
      scope: synonyms.sense,
      emphasis: isUsage ? undefined : comparison,
      text: isUsage ? synonyms.note : `${comparison}：${synonyms.note}`,
      examples: synonyms.examples, exampleWords, sources: referencesFor({ sourceIds }),
    });
  }
  if (isSourceChecked(formation) && [formation.base, formation.derived].includes(key)) hints.push({
    label: '词根词缀',
    scope: formation.derived === key ? `本词构词 · ${formation.affixRole}` : `词族拓展 · ${formation.base} → ${formation.derived}`,
    emphasis: formation.expression,
    text: `${formation.expression}。${formation.note}`,
    sources: referencesFor(formation),
  });
  return hints;
};

export { formatWordDefinition, getWordMeaningLine } from './wordHintPresentation.js';

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

// Supplement existing comparisons and word families only for the reviewed record.
// Historical snapshots and custom IDs retain their original hints.
export const getCoreWordHints = (word = {}) => {
  const hints = getExistingCoreWordHints(word);
  const review = Object.hasOwn(commonSenses, String(word.id)) ? commonSenses[word.id] : null;
  return review && review.word === word.word && Object.entries(review.guards).every(([key, value]) => word[key] === value)
    ? [...hints, review.hint] : hints;
};
