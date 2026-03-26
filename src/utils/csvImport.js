const DEFAULT_HEADERS = ['word', 'phonetic', 'pos', 'meaning', 'example', 'exampleCn', 'category'];
const REQUIRED_FIELDS = ['word', 'meaning'];

const normalizeText = (value) => (value || '').trim();
const normalizeHeaderKey = (header) => {
  const normalized = (header || '').trim().toLowerCase().replace(/[\s_-]+/g, '');

  if (normalized === 'word') return 'word';
  if (normalized === 'phonetic' || normalized === 'pronunciation') return 'phonetic';
  if (normalized === 'pos' || normalized === 'partofspeech') return 'pos';
  if (normalized === 'meaning' || normalized === 'definition' || normalized === 'translation') return 'meaning';
  if (normalized === 'example' || normalized === 'sentence') return 'example';
  if (normalized === 'examplecn' || normalized === 'examplechinese') return 'exampleCn';
  if (normalized === 'category' || normalized === 'tag') return 'category';

  return normalized;
};

const parseCsvRows = (text) => {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(cell);
      cell = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i += 1;
      }
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }

    cell += char;
  }

  row.push(cell);
  rows.push(row);

  return rows
    .map((cells) => cells.map((item) => item.replace(/^\uFEFF/, '').trim()))
    .filter((cells) => cells.some((item) => item !== ''));
};

const buildHeaders = (firstRow) => {
  const normalized = firstRow.map((header) => normalizeHeaderKey(header));
  const hasHeader = normalized.includes('word') && normalized.includes('meaning');

  return {
    headers: hasHeader ? normalized : DEFAULT_HEADERS,
    hasHeader,
  };
};

export const parseVocabularyCsv = ({
  csvText,
  existingWords,
  validCategoryIds,
}) => {
  const text = (csvText || '').trim();
  if (!text) {
    throw new Error('CSV 内容为空');
  }

  const rows = parseCsvRows(text);
  if (rows.length === 0) {
    throw new Error('CSV 内容为空');
  }

  const { headers, hasHeader } = buildHeaders(rows[0]);
  const dataRows = hasHeader ? rows.slice(1) : rows;

  if (dataRows.length === 0) {
    throw new Error('CSV 没有可导入的数据行');
  }

  const existingWordSet = new Set(
    existingWords.map((item) => normalizeText(item.word).toLowerCase()).filter(Boolean)
  );
  const categorySet = new Set(validCategoryIds);

  let skippedInvalid = 0;
  let skippedDuplicate = 0;
  let importedCount = 0;

  let nextId = Math.max(0, ...existingWords.map((item) => Number(item.id) || 0)) + 1;
  const importedWords = [];

  dataRows.forEach((cells) => {
    const record = {};
    headers.forEach((field, index) => {
      record[field] = cells[index] ?? '';
    });

    const word = normalizeText(record.word);
    const meaning = normalizeText(record.meaning);

    if (!word || !meaning) {
      skippedInvalid += 1;
      return;
    }

    const duplicateKey = word.toLowerCase();
    if (existingWordSet.has(duplicateKey)) {
      skippedDuplicate += 1;
      return;
    }

    const normalizedCategory = normalizeText(record.category);
    const category = categorySet.has(normalizedCategory) ? normalizedCategory : 'daily';

    const normalizedWord = {
      id: nextId,
      word,
      phonetic: normalizeText(record.phonetic),
      pos: normalizeText(record.pos),
      meaning,
      example: normalizeText(record.example),
      exampleCn: normalizeText(record.exampleCn),
      category,
    };

    importedWords.push(normalizedWord);
    existingWordSet.add(duplicateKey);
    importedCount += 1;
    nextId += 1;
  });

  return {
    importedWords,
    summary: {
      importedCount,
      skippedInvalid,
      skippedDuplicate,
      totalRows: dataRows.length,
      missingFields: REQUIRED_FIELDS,
    },
  };
};

export const getVocabularyCsvTemplate = () =>
  'word,phonetic,pos,meaning,example,exampleCn,category\n' +
  'collaborate,/kəˈlæbəreɪt/,v.,合作，协作,We collaborate closely with clients.,我们与客户紧密合作。,business\n' +
  'itinerary,/aɪˈtɪnəˌreri/,n.,行程安排,Please send me your itinerary.,请把你的行程安排发给我。,travel\n';
