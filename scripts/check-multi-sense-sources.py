"""Read public dictionary definitions for the bounded multi-sense repair list."""
import concurrent.futures
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output/multi-sense-sources'
OUT.mkdir(parents=True, exist_ok=True)
source = json.loads((ROOT / 'data/vocabulary-multi-sense-repair/source-register-2026-10-31.json').read_text())
words = list(dict.fromkeys([row['word'] for row in source['entries']] + [row['word'] for row in source['gaps']]))

class Definitions(HTMLParser):
    def __init__(self):
        super().__init__(); self.depth = 0; self.captures = []; self.definitions = []; self.ipa = []
    def handle_starttag(self, tag, attrs):
        if tag in ('br', 'hr', 'img', 'input', 'meta', 'link', 'source', 'wbr'): return
        self.depth += 1
        classes = dict(attrs).get('class', '').split()
        if 'ddef_d' in classes or 'ipa' in classes:
            self.captures.append([self.depth, 'definition' if 'ddef_d' in classes else 'ipa', []])
    def handle_data(self, value):
        for capture in self.captures: capture[2].append(value)
    def handle_endtag(self, tag):
        if tag in ('br', 'hr', 'img', 'input', 'meta', 'link', 'source', 'wbr'): return
        for capture in self.captures[:]:
            if capture[0] == self.depth:
                text = ' '.join(''.join(capture[2]).split())
                (self.definitions if capture[1] == 'definition' else self.ipa).append(text)
                self.captures.remove(capture)
        self.depth = max(0, self.depth - 1)

def check(word):
    for variant in ['dictionary/english', 'us/dictionary/english', 'dictionary/learner-english']:
        url = 'https://dictionary.cambridge.org/' + variant + '/' + word
        file = OUT / (word + ('-us' if variant.startswith('us/') else '-learner' if 'learner' in variant else '') + '.html')
        try:
            if not file.exists():
                subprocess.run(['curl', '--fail', '--silent', '--show-error', '--location', '--connect-timeout', '5', '--max-time', '25', '--retry', '1', '-A', 'Mozilla/5.0', '-o', str(file), url], check=True, capture_output=True)
            raw = file.read_bytes(); parser = Definitions(); parser.feed(raw.decode('utf8'))
            if not parser.definitions: continue
            return dict(word=word, url=url, checkedAt='2026-10-31', sha256=hashlib.sha256(raw).hexdigest(), definitions=list(dict.fromkeys(parser.definitions)), ipa=list(dict.fromkeys(parser.ipa)))
        except Exception: pass
    return dict(word=word, error='Dictionary unavailable')

with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
    results=[]
    for row in pool.map(check, words):
        results.append(row)
        (OUT / 'checks.json').write_text(json.dumps(results, ensure_ascii=False, indent=2)+'\n')
        print(f"{len(results)}/{len(words)} {row['word']} {'OK' if row.get('definitions') else 'FAILED'}", flush=True)
