"""Read public dictionary entries; cache HTML locally and save factual evidence only."""
import concurrent.futures
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / 'output/name-replacement/sources'
OUTPUT = ROOT / 'data/name-place-replacement/sources-2026-10-26.json'


class Node:
    def __init__(self, tag='', attrs=()):
        self.tag, self.attrs, self.children = tag, dict(attrs), []

    def text(self):
        return ''.join(c.text() if isinstance(c, Node) else c for c in self.children)

    def walk(self):
        yield self
        for child in self.children:
            if isinstance(child, Node):
                yield from child.walk()


class Tree(HTMLParser):
    def __init__(self):
        super().__init__()
        self.root = Node()
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}:
            self.stack.append(node)

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                break

    def handle_data(self, text):
        self.stack[-1].children.append(text)


def check(row):
    word, *_, slug = row
    url = slug if slug.startswith('https://') else 'https://www.oxfordlearnersdictionaries.com/definition/english/' + slug
    path = CACHE / ((hashlib.sha256(url.encode()).hexdigest() if slug.startswith('https://') else slug) + '.html')
    try:
        if path.exists():
            data = path.read_bytes()
        else:
            request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(request, timeout=35) as response:
                data = response.read()
            path.write_bytes(data)
        tree = Tree()
        tree.feed(data.decode('utf-8'))
        nodes = list(tree.root.walk())
        has_class = lambda node, name: name in node.attrs.get('class', '').split()
        definitions = [n.text().strip() for n in nodes if has_class(n, 'def')]
        phonetics = list(dict.fromkeys(n.text().strip() for n in nodes if has_class(n, 'phon')))
        headwords = list(dict.fromkeys(n.text().strip() for n in nodes if has_class(n, 'headword') or has_class(n, 'pv') or has_class(n, 'idm') or has_class(n, 'h') ))
        text = re.sub(r'\s+', ' ', tree.root.text())
        assert definitions, 'No dictionary definitions; not valid source evidence'
        return dict(word=word, url=url, checkedAt='2026-10-26', status='read', sha256=hashlib.sha256(data).hexdigest(),
                    phonetics=phonetics, headwords=headwords[:50], definitions=definitions,
                    exactPhraseVisible=word.lower() in text.lower())
    except (AssertionError, OSError, urllib.error.URLError) as error:
        return dict(word=word, url=url, checkedAt='2026-10-26', status='unavailable', error=str(error))


def main():
    CACHE.mkdir(parents=True, exist_ok=True)
    rows = [line.split('\t') for line in (ROOT / 'data/name-place-replacement/practical-2026-10-26.tsv').read_text().splitlines()]
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
        results = list(pool.map(check, rows))
    # The full extracts are local inspection material, not redistributed dictionary text.
    (CACHE.parent / 'source-inspection.json').write_text(json.dumps(results, ensure_ascii=False, indent=2) + '\n')
    for result in results:
        print(json.dumps(result, ensure_ascii=False), flush=True)


if __name__ == '__main__':
    main()
