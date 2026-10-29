"""Read public reference PDFs into ignored audit input; never edit application data.

Requires pypdf and pdfplumber. Keep publisher PDFs and complete extracted lists in
output/, not in the application or a newly published dictionary.
"""
from pathlib import Path
import argparse, hashlib, json, re, unicodedata
from collections import Counter
from urllib.request import Request, urlopen
from pypdf import PdfReader
import pdfplumber


def clean(value):
    # Remove the publisher's trademark annotation BEFORE NFKC turns it into 'TM'.
    return unicodedata.normalize('NFKC', value.replace('™', '').replace('®', '').replace('Ｇ', '-').replace('\U001001b3', "'")).strip()


def oxford(path):
    rows, level = [], None
    for page_number, page in enumerate(PdfReader(path).pages, 1):
        for raw in page.extract_text().splitlines():
            line = clean(raw)
            if re.fullmatch(r'[ABC][12]', line):
                level = line
                continue
            match = re.match(r'^(.+?)\s+((?:(?:n|noun|v|adj|adv|det|pron|prep|conj|exclam)\.|modal |auxiliary |indefinite article|definite article|infinitive marker|number).*)$', line)
            if match:
                assert level
                rows.append(dict(label=match[1].strip(), pos=match[2].strip(), level=level, page=page_number))
            elif line in ('adj.', 'number'):
                assert rows and rows[-1]['page'] == page_number
                rows[-1]['pos'] += ' ' + line
            elif line and not line.startswith(('©', 'The Oxford', '3000, it')):
                raise ValueError(f'{path.name} page {page_number}: unparsed {line!r}')
    return rows


def cet(path):
    rows, page_counts = [], {}
    with pdfplumber.open(path) as pdf:
        assert len(pdf.pages) == 215
        for page_index in range(20, 149):
            page = pdf.pages[page_index]
            chars = [c for c in page.chars if 70 < c['top'] < 682 and not re.search(r'[\u4e00-\u9fff]', c['text'])]
            baselines = sorted({round(c['matrix'][5], 2) for c in chars
                                if 80 < c['x0'] < 84 and re.match(r'[A-Za-z]', c['text'])}, reverse=True)
            page_counts[page_index + 1] = len(baselines)
            for y in baselines:
                # 'g', slash and optional spelling parentheses use shifted glyph
                # baselines. Star font metrics also differ, so use text matrices.
                row = sorted([c for c in chars if abs(c['matrix'][5] - y) < 3], key=lambda c: c['x0'])
                starred = any(c['text'] == '★' for c in row)
                letters = [c for c in row if c['x0'] >= 80 and c['text'] != '★']
                groups, chunk, previous = [], [], None
                for char in letters:
                    gap = char['x0'] - previous['x1'] if previous else 0
                    # The first derivative column starts around x=169; a long
                    # main headword may reach into it if the cell to its right is empty.
                    if previous and (gap > 8 or gap > 1 and 167 < char['x0'] < 171):
                        groups.append(chunk)
                        chunk = []
                    chunk.append(char)
                    previous = char
                if chunk:
                    groups.append(chunk)
                def text(group):
                    result, previous_char = '', None
                    for char in group:
                        if previous_char and char['x0'] - previous_char['x1'] > 1.5:
                            result += ' '
                        result += char['text']
                        previous_char = char
                    return clean(result)
                assert groups
                rows.append(dict(label=text(groups[0]), starred=starred,
                                 derived=[text(group) for group in groups[1:]], page=page_index + 1))
    # Source-count differences are retained explicitly. Do not fabricate 41 rows
    # to force the printed nominal count of 5418 to equal physical table groups.
    assert len(rows) == 5377
    assert all(count == (1 if page == 149 else 42) for page, count in page_counts.items())
    assert rows[0]['label'] == 'a/an' and rows[-1]['label'] == 'zoom'
    return rows, page_counts


def awl(path):
    rows = []
    for page_number, page in enumerate(PdfReader(path).pages, 1):
        for line in page.extract_text().splitlines():
            match = re.fullmatch(r'\s*([a-z-]+)\s+(10|[1-9])\s*', line)
            if match:
                rows.append(dict(label=match[1], sublist=int(match[2]), page=page_number))
    assert len(rows) == len({row['label'] for row in rows}) == 570
    assert all(sum(row['sublist'] == level for row in rows) == (30 if level == 10 else 60) for level in range(1, 11))
    return rows


def phrases(path):
    chunks = []
    for page_number, page in enumerate(PdfReader(path).pages, 1):
        def visit(text, cm, tm, font, size):
            if text.strip():
                chunks.append((clean(text), str(font.get('/BaseFont')) if font else '', page_number))
        page.extract_text(visitor_text=visit)
    fonts = Counter()
    for text, font, _ in chunks:
        if 'MyriadPro-Regular' in font:
            fonts[font] += len(text)
    primary_font = fonts.most_common(1)[0][0]
    rows, level = [], None
    for text, font, page_number in chunks:
        if 'UtopiaStd-Bold' in font and re.fullmatch('[ABC][12]', text):
            level = text
        if font == primary_font:
            assert level and '\n' not in text
            rows.append(dict(label=text, level=level, page=page_number))
    # Light type contains printed examples/variants, not additional main entries.
    # A fallback Regular font supplies two glyph runs inside a Light example;
    # selecting the dominant heading font excludes those spurious 'r'/'next' rows.
    assert len(rows) == 750
    assert Counter(row['level'] for row in rows) == dict(A1=200, A2=175, B1=175, B2=125, C1=75)
    return rows, dict(unit='main heading pattern only; light-type printed examples excluded', primaryFont=primary_font)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--reference-dir', default='output/vocabulary-coverage-2026-10-29/references')
    parser.add_argument('--download', action='store_true', help='Download the five public PDFs, requiring the registered SHA-256 snapshots.')
    parser.add_argument('--output', default='output/vocabulary-coverage-2026-10-29/reference-rows.json')
    args = parser.parse_args()
    directory = Path(args.reference_dir)
    registry = json.loads(Path('data/vocabulary-coverage-2026-10-29/reference-sources.json').read_text())
    receipts = registry['sources']
    directory.mkdir(parents=True, exist_ok=True)
    if args.download:
        for source in receipts:
            request = Request(source['url'], headers={'User-Agent': 'Mozilla/5.0'})
            with urlopen(request, timeout=45) as response:
                content = response.read()
            assert content.startswith(b'%PDF') and hashlib.sha256(content).hexdigest() == source['sha256'], f"Changed source: {source['id']}"
            (directory/(source['id']+'.pdf')).write_bytes(content)
    result = dict(extractorVersion=1, sources=[])
    for receipt in receipts:
        key = receipt['id']
        path = directory/(key+'.pdf')
        assert hashlib.sha256(path.read_bytes()).hexdigest() == receipt['sha256']
        page_count = len(PdfReader(path).pages)
        if key == 'cet2016':
            rows, counts = cet(path)
            details = dict(printedMainCount=5418, printedDerivedCount=2551, physicalMainGroups=len(rows),
                           physicalDerivedCells=sum(len(row['derived']) for row in rows), pageGroupCounts=counts,
                           countReconciliation='Printed nominal counts and spatial group counts differ; reason not certified. CET results describe extracted table groups, not certified coverage of all 5418 advertised entries.')
        elif key == 'oxford-phrases':
            rows, details = phrases(path)
        elif key == 'awl-headwords':
            rows, details = awl(path), dict(unit='representative headword, not every member of a word family')
        else:
            rows, details = oxford(path), dict(unit='headword/POS/CEFR row; repeated headwords will be merged by the comparator')
        assert len(rows) == receipt['expectedParsedRows'] and page_count == receipt['pages']
        result['sources'].append(dict(**{key: value for key, value in receipt.items() if key != 'pages'}, pages=page_count, rows=rows, extraction=details))
        print(key, 'pages', page_count, 'rows', len(rows))
    target = Path(args.output)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n')


if __name__ == '__main__':
    main()
