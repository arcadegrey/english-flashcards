"""Validate all registered local MP3s, including full decode and non-silence."""
import array
import concurrent.futures
import hashlib
import json
import math
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT / 'public/audio-updates/2026-10-31-neutral-examples/manifest.json').read_text())
assert manifest['ready'] and len(manifest['files']) == manifest['expectedFiles'] == 1652

def check(file):
    path = ROOT / 'public' / file['path'].lstrip('/')
    raw = path.read_bytes()
    assert len(raw) == file['bytes'] and hashlib.sha256(raw).hexdigest() == file['sha256'], file['path']
    assert hashlib.sha256(file['text'].encode()).hexdigest() == file['textSha256']
    probe = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_streams', '-of', 'json', str(path)]))['streams'][0]
    assert probe['codec_name'] == 'mp3' and probe['sample_rate'] == '24000' and probe['channels'] == 1
    decoded = subprocess.check_output(['ffmpeg', '-threads', '1', '-v', 'error', '-i', str(path), '-f', 'f32le', '-ac', '1', '-ar', '24000', 'pipe:1'], stderr=subprocess.PIPE)
    samples = array.array('f'); samples.frombytes(decoded)
    assert len(samples) > 4800 and all(math.isfinite(value) for value in samples), file['path']
    rms = math.sqrt(sum(value * value for value in samples) / len(samples))
    assert rms > 0.00001, file['path']
    return dict(path=file['path'], sha256=file['sha256'], samples=len(samples), rms=round(rms, 7))

results = []
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    for result in pool.map(check, manifest['files']):
        results.append(result)
        if len(results) % 128 == 0: print(f'LOCAL {len(results)}/1652', flush=True)
(ROOT / 'output/neutral-example-audio-local.json').write_text(json.dumps(dict(validated=len(results), files=results), indent=2)+'\n')
print('LOCAL READY 1652/1652: hashes, format, full finite decode and non-silence.', flush=True)
