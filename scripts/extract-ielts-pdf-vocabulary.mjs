#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const DEFAULT_INPUT = '/Users/arcade/Desktop/list1-10.pdf';
const DEFAULT_OUTPUT = 'output/ielts_list1-10.csv';

const args = process.argv.slice(2);
const inputPath = path.resolve(args[0] || DEFAULT_INPUT);
const outputPath = path.resolve(args[1] || DEFAULT_OUTPUT);

if (!existsSync(inputPath)) {
  console.error(`PDF not found: ${inputPath}`);
  process.exit(1);
}

const swiftSource = `
import Foundation
import PDFKit

let pdfPath = CommandLine.arguments[1]
let url = URL(fileURLWithPath: pdfPath)
guard let document = PDFDocument(url: url) else {
  fputs("Unable to open PDF: \\(pdfPath)\\n", stderr)
  exit(1)
}

var pages: [[String: Any]] = []

for pageIndex in 0..<document.pageCount {
  guard let page = document.page(at: pageIndex) else { continue }
  let bounds = page.bounds(for: .mediaBox)
  guard let selection = page.selection(for: bounds) else { continue }
  let lines = selection.selectionsByLine().compactMap { line -> [String: Any]? in
    guard let rawText = line.string else { return nil }
    let text = rawText
      .replacingOccurrences(of: "\\n", with: " ")
      .replacingOccurrences(of: "\\r", with: " ")
      .trimmingCharacters(in: .whitespacesAndNewlines)
    if text.isEmpty { return nil }
    let rect = line.bounds(for: page)
    return [
      "text": text,
      "x": rect.origin.x,
      "y": rect.origin.y,
      "w": rect.size.width,
      "h": rect.size.height
    ]
  }
  pages.append(["page": pageIndex + 1, "lines": lines])
}

let data = try JSONSerialization.data(withJSONObject: pages, options: [])
FileHandle.standardOutput.write(data)
`;

const runSwiftExtraction = () => {
  try {
    return execFileSync(
      'swift',
      ['-module-cache-path', '/private/tmp/swift-module-cache', '-e', swiftSource, inputPath],
      { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 }
    );
  } catch (error) {
    const stderr = error.stderr?.toString?.() || '';
    throw new Error(`Swift/PDFKit extraction failed.${stderr ? `\n${stderr}` : ''}`);
  }
};

const columns = [
  { min: 1, max: 20, wordX: [25, 135], defX: [135, 270] },
  { min: 21, max: 40, wordX: [270, 390], defX: [390, 525] },
  { min: 41, max: 60, wordX: [520, 650], defX: [650, 820] },
];

const compactEnglishLetters = (text) =>
  text.replace(/\b(?:[A-Za-z]\s+){2,}[A-Za-z]\b/g, (match) => match.replace(/\s+/g, ''));

const normalizeText = (value) =>
  compactEnglishLetters(value || '')
    .replace(/[□]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,;:])/g, '$1')
    .trim();

const extractListNumber = (lines, fallback) => {
  const fullText = lines.map((line) => line.text).join(' ');
  const match = fullText.match(/\bList\s+(\d+)\b/i);
  return match ? match[1] : String(fallback);
};

const stripEntryNumber = (text, number) =>
  normalizeText(text).replace(new RegExp(`^${number}\\s*`), '').trim();

const isMostlyHeader = (text) => /^(序|单词|释\s*义|Date|Chapter|List|)/i.test(text);

const lineInRange = (line, [min, max]) => line.x >= min && line.x < max;

const findNumberRows = (lines, column) => {
  const rows = new Map();

  lines.forEach((line) => {
    if (!lineInRange(line, column.wordX)) return;
    const text = normalizeText(line.text);
    const match = text.match(/^(\d{1,2})(?=\s|$)/);
    if (!match) return;

    const number = Number(match[1]);
    if (number < column.min || number > column.max) return;

    const existing = rows.get(number);
    if (!existing || line.x < existing.x) {
      rows.set(number, { number, y: line.y, x: line.x });
    }
  });

  inferRowsFromWordPositions(lines, column).forEach((row) => {
    if (!rows.has(row.number)) {
      rows.set(row.number, row);
    }
  });

  return [...rows.values()].sort((a, b) => b.y - a.y);
};

const inferRowsFromWordPositions = (lines, column) => {
  const wordLines = lines
    .filter((line) => lineInRange(line, column.wordX))
    .map((line) => ({ ...line, text: normalizeText(line.text) }))
    .filter((line) => {
      if (isMostlyHeader(line.text)) return false;
      if (/^\d{1,2}$/.test(line.text)) return false;
      return /[A-Za-z]/.test(line.text);
    })
    .sort((a, b) => b.y - a.y);

  const groups = [];
  wordLines.forEach((line) => {
    const group = groups.find((item) => Math.abs(item.y - line.y) <= 14);
    if (group) {
      group.y = Math.max(group.y, line.y);
      group.lines.push(line);
    } else {
      groups.push({ y: line.y, lines: [line] });
    }
  });

  return groups.slice(0, column.max - column.min + 1).map((group, index) => ({
    number: column.min + index,
    y: group.y,
    x: Math.min(...group.lines.map((line) => line.x)),
  }));
};

const getVerticalBand = (rows, index) => {
  const current = rows[index];
  const previous = rows[index - 1];
  const next = rows[index + 1];
  const upper = previous ? (previous.y + current.y) / 2 : current.y + 14;
  const lower = next ? (current.y + next.y) / 2 : current.y - 14;
  return { lower, upper };
};

const collectBandText = ({ lines, xRange, lower, upper, number }) => {
  const yMargin = 2;
  const parts = lines
    .filter((line) => lineInRange(line, xRange) && line.y >= lower - yMargin && line.y <= upper + yMargin)
    .sort((a, b) => {
      if (Math.abs(b.y - a.y) > 2) return b.y - a.y;
      return a.x - b.x;
    })
    .map((line) => line.text)
    .filter((text) => !isMostlyHeader(normalizeText(text)));

  return stripEntryNumber(parts.join(' '), number);
};

const parseWordAndPos = (rawText) => {
  const text = normalizeEntryText(rawText);
  const posMatch = text.match(
    /^(.+?)\s*((?:n|v|adj|adv|prep|conj|pron|num|interj|det)(?:\s*\/\s*(?:n|v|adj|adv|prep|conj|pron|num|interj|det))*\.?)\s*$/i
  );

  if (posMatch) {
    return {
      word: normalizeWord(posMatch[1]),
      pos: normalizeText(posMatch[2]).replace(/\s*\/\s*/g, '/'),
    };
  }

  const gluedPosMatch = text.match(
    /^(.+?)(n|v|adj|adv|prep|conj|pron|num|interj|det)(?:\s*\/\s*(n|v|adj|adv|prep|conj|pron|num|interj|det))*\.?$/i
  );

  if (gluedPosMatch) {
    const word = normalizeWord(gluedPosMatch[1]);
    const pos = text.slice(gluedPosMatch[1].length).replace(/\s+/g, '').replace(/\.$/, '.');
    return { word, pos };
  }

  return { word: normalizeWord(text), pos: '' };
};

const splitInlineMeaning = (rawText) => {
  const text = normalizeEntryText(rawText);
  const match = text.match(
    /^([A-Za-z][A-Za-z\s-]*?)\s*((?:n|v|adj|adv|prep|conj|pron|num|interj|det)(?:\s*\/\s*(?:n|v|adj|adv|prep|conj|pron|num|interj|det))*\.?)\s*(.+)$/i
  );

  if (!match) {
    return { wordText: rawText, inlineMeaning: '' };
  }

  const candidateMeaning = normalizeText(match[3]);
  if (!/[\u3400-\u9fff]/.test(candidateMeaning)) {
    return { wordText: rawText, inlineMeaning: '' };
  }

  return {
    wordText: `${normalizeText(match[1])} ${normalizeText(match[2])}`,
    inlineMeaning: candidateMeaning,
  };
};

const normalizeEntryText = (value) =>
  normalizeText(value)
    .replace(/\*/g, '')
    .replace(/a\s*dj\b/gi, 'adj')
    .replace(/\bad\s*j\b/gi, 'adj')
    .replace(/\bn\s*\/\s*a\s*dj\b/gi, 'n/adj')
    .replace(/\bn\s*\/\s*v\b/gi, 'n/v')
    .replace(/\bn\s*\/\s*a\s*dj\b/gi, 'n/adj')
    .replace(/\bn\s*\/\s*v\s*\./gi, 'n/v.')
    .replace(/\badj\s*\/\s*n\b/gi, 'adj/n')
    .replace(/\s+/g, ' ')
    .trim();

const normalizeWord = (value) => {
  const word = normalizeSpacedWord(normalizeText(value)
    .replace(/\*/g, '')
    .replace(/[^A-Za-z -]/g, '')
    .replace(/\s*-\s*/g, '-')
    .trim())
    .toLowerCase();
  return word.replace(/(?:adj|adv)$/i, '');
};

const normalizeSpacedWord = (value) => {
  const parts = value.split(/\s+/).filter(Boolean);
  if (parts.length >= 3 && parts.some((part) => part.length <= 2)) {
    return parts.join('');
  }
  if (
    parts.length === 2 &&
    parts.some((part) => part.length <= 2) &&
    parts.every((part) => /^[a-z]+$/.test(part))
  ) {
    return parts.join('');
  }
  return value;
};

const stripPhonetic = (text) => text.replace(/\[[^\]]*]/g, ' ');

const parseInlineWord = (rawText) => {
  const text = stripPhonetic(normalizeEntryText(rawText)).replace(/\s+/g, ' ').trim();
  const spacedPosMatch = text.match(
    /^([A-Za-z][A-Za-z\s-]*?)\s+((?:n|v|adj|adv|prep|conj|pron|num|interj|det)(?:\s*\/\s*(?:n|v|adj|adv|prep|conj|pron|num|interj|det))*\.?)(?=[\s/.\u3400-\u9fff]|$)/i
  );

  if (spacedPosMatch) {
    return normalizeWord(spacedPosMatch[1]);
  }

  const gluedPosMatch = text.match(
    /^([A-Za-z][A-Za-z\s-]*?)(n|v|adj|adv|prep|conj|pron|num|interj|det)(?:\s*\/\s*(?:n|v|adj|adv|prep|conj|pron|num|interj|det))*\.?(?=[\s/.\u3400-\u9fff]|$)/i
  );

  if (gluedPosMatch) {
    return normalizeWord(gluedPosMatch[1]);
  }

  const wordMatch = text.match(/^[A-Za-z][A-Za-z -]*/);
  return normalizeWord(wordMatch ? wordMatch[0] : text);
};

const findInlineEntries = (lineText) => {
  const text = normalizeEntryText(lineText);
  const starts = [];
  const entryStartPattern = /(^|[^A-Za-z])([1-9]|[1-5]\d|60)\s+(?=[A-Za-z])/g;
  let match;

  while ((match = entryStartPattern.exec(text))) {
    starts.push({
      number: Number(match[2]),
      start: match.index + match[1].length,
      contentStart: match.index + match[0].length,
    });
  }

  return starts
    .map((entry, index) => {
      const next = starts[index + 1];
      const rawText = text.slice(entry.contentStart, next ? next.start : text.length).trim();
      return {
        number: entry.number,
        rawText,
        word: parseInlineWord(rawText),
      };
    })
    .filter((entry) => entry.word);
};

const parsePageInlineRecords = (page) => {
  const lines = page.lines || [];
  const list = extractListNumber(lines, page.page);
  const byNumber = new Map();

  lines.forEach((line) => {
    if (isMostlyHeader(normalizeText(line.text))) return;
    findInlineEntries(line.text).forEach((entry) => {
      if (!byNumber.has(entry.number)) {
        byNumber.set(entry.number, {
          word: entry.word,
          list,
        });
      }
    });
  });

  return [...byNumber.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, record]) => record);
};

const parsePageColumnRecords = (page, warnings) => {
  const records = [];
  const lines = page.lines || [];
  const list = extractListNumber(lines, page.page);

  columns.forEach((column) => {
    const rows = findNumberRows(lines, column);

    rows.forEach((row, index) => {
      const { lower, upper } = getVerticalBand(rows, index);
      const rawWordText = collectBandText({
        lines,
        xRange: column.wordX,
        lower,
        upper,
        number: row.number,
      });
      const { wordText } = splitInlineMeaning(rawWordText);
      const { word } = parseWordAndPos(wordText);

      if (!word) {
        warnings.push(`page ${page.page} list ${list} item ${row.number}: missing word from "${rawWordText}"`);
        return;
      }

      records.push({
        word,
        list,
      });
    });
  });

  return records;
};

const parsePages = (pages) => {
  const records = [];
  const warnings = [];

  pages.forEach((page) => {
    const inlineRecords = parsePageInlineRecords(page);
    const columnRecords = parsePageColumnRecords(page, warnings);
    const pageRecords = inlineRecords.length > columnRecords.length ? inlineRecords : columnRecords;
    records.push(...pageRecords);
  });

  return { records, warnings };
};

const csvEscape = (value) => {
  const text = String(value ?? '');
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

const writeCsv = (records) => {
  const headers = ['word', 'list'];
  const rows = [headers.join(',')];
  records.forEach((record) => {
    rows.push(headers.map((header) => csvEscape(record[header])).join(','));
  });
  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${rows.join('\n')}\n`, 'utf8');
};

const rawJson = runSwiftExtraction();
const pages = JSON.parse(rawJson);
const { records, warnings } = parsePages(pages);

writeCsv(records);

const uniqueWords = new Set(records.map((record) => record.word));
console.log(`Wrote ${records.length} rows (${uniqueWords.size} unique words) to ${outputPath}`);

if (warnings.length > 0) {
  console.warn(`Warnings: ${warnings.length}`);
  warnings.slice(0, 20).forEach((warning) => console.warn(`- ${warning}`));
  if (warnings.length > 20) {
    console.warn(`- ... ${warnings.length - 20} more`);
  }
}
