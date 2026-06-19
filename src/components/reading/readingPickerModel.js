export const READING_LEVEL_META = {
  all: { label: '全部等级', order: 0, tone: 'slate', helper: '覆盖 B1-C1' },
  a1: { label: 'A1 入门', order: 1, tone: 'green', helper: '适合入门阅读' },
  a2: { label: 'A2 初级', order: 2, tone: 'green', helper: '适合基础巩固' },
  b1: { label: 'B1 中级', order: 3, tone: 'green', helper: '适合基础提升' },
  b2: { label: 'B2 中高级', order: 4, tone: 'blue', helper: '适合进阶阅读' },
  c1: { label: 'C1 高级', order: 5, tone: 'violet', helper: '适合高阶表达' },
  c2: { label: 'C2 精通', order: 6, tone: 'violet', helper: '适合精读挑战' },
  unknown: { label: '未标等级', order: 99, tone: 'slate', helper: '待整理等级' },
};

export const normalizeReadingLevel = (level) => String(level || '').trim().toLowerCase() || 'unknown';

export const formatReadingLevelLabel = (level) => {
  const key = normalizeReadingLevel(level);
  return READING_LEVEL_META[key]?.label || String(level || '').trim().toUpperCase() || READING_LEVEL_META.unknown.label;
};

export const buildReadingLevelOptions = (readings = []) => {
  const map = new Map();
  readings.forEach((article) => {
    const levelKey = normalizeReadingLevel(article?.level);
    map.set(levelKey, (map.get(levelKey) || 0) + 1);
  });

  const levels = Array.from(map.entries())
    .map(([id, count]) => ({
      id,
      title: formatReadingLevelLabel(id),
      count,
      order: READING_LEVEL_META[id]?.order ?? 50,
    }))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'zh-CN'));

  return [
    {
      id: 'all',
      title: READING_LEVEL_META.all.label,
      count: readings.length,
      order: READING_LEVEL_META.all.order,
    },
    ...levels,
  ];
};

export const filterReadingsByLevel = (readings = [], activeLevel = '') => {
  if (!activeLevel || activeLevel === 'all') return readings;
  return readings.filter((article) => normalizeReadingLevel(article?.level) === activeLevel);
};
