// Presentation only. Category IDs, reading levels and counts come from existing data.
const asset = name => `/images/ui-assets/${name}.png`;

export const WORD_PICKER_VISUALS = {
  all: { art: asset('dashboard-flashcards-frosted-v1'), accent: 'ice', eyebrow: '全部词库' },
  daily: { art: asset('training-vocabulary-daily-frosted-v2'), accent: 'mint', eyebrow: '日常场景' },
  cet4: { art: asset('training-vocabulary-cet4-frosted-v2'), accent: 'sky', eyebrow: 'CET-4' },
  cet6: { art: asset('training-vocabulary-cet6-frosted-v2'), accent: 'lavender', eyebrow: 'CET-6' },
  toefl: { art: asset('training-vocabulary-toefl-frosted-v2'), accent: 'cyan', eyebrow: 'TOEFL' },
  ielts: { art: asset('training-vocabulary-ielts-frosted-v2'), accent: 'slate-violet', eyebrow: 'IELTS' },
};

export const READING_PICKER_VISUALS = {
  all: { art: asset('training-reading-all-frosted-v2'), accent: 'ice', heading: '全部阅读' },
  a1: { art: asset('training-reading-a1-frosted-v2'), accent: 'mint', heading: '入门阅读' },
  a2: { art: asset('training-reading-a2-frosted-v2'), accent: 'cyan', heading: '基础阅读' },
  b1: { art: asset('dashboard-reading-frosted-v1'), accent: 'sky', heading: '进阶阅读' },
  b2: { art: asset('training-reading-b2-frosted-v2'), accent: 'periwinkle', heading: '中高级阅读' },
  c1: { art: asset('training-reading-c1-frosted-v2'), accent: 'lavender', heading: '高阶阅读' },
  c2: { art: asset('training-reading-c1-frosted-v2'), accent: 'slate-violet', heading: '精读挑战' },
  unknown: { art: asset('dashboard-reading-frosted-v1'), accent: 'ice', heading: '未标等级' },
};
