"""Publish only the registered immutable batch, then verify every public byte.

Uses the existing Wrangler login. Proxy settings, when needed, come from the
caller's environment. Never prints or exports an authentication credential.
"""
import argparse
import concurrent.futures
import hashlib
import json
import os
from pathlib import Path
import signal
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
BATCH = '2026-10-31-multi-sense'
DIRECTORY = ROOT / 'public/audio-updates' / BATCH
BASE = 'https://audio.englishflashcards.cn'
WRANGLER = ['node', 'node_modules/wrangler/bin/wrangler.js']
ENV = {**os.environ, 'WRANGLER_SEND_METRICS': 'false'}
REPORT = ROOT / 'output/multi-sense-audio-public.json'
manifest_bytes = (DIRECTORY / 'manifest.json').read_bytes()
manifest = json.loads(manifest_bytes)
assert manifest['ready'] and manifest['expectedFiles'] == len(manifest['files']) == 1736
assert len({file['path'] for file in manifest['files']}) == 1736


def run_writer(args, marker):
    # Wrangler 4.92 may leave its helper running after reporting completion.
    # End only this subprocess group; success still requires public hash checks.
    process = subprocess.Popen(WRANGLER + args, cwd=ROOT, env=ENV,
                               stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                               text=True, start_new_session=True)
    complete = False
    for line in process.stdout:
        print(line, end='', flush=True)
        if marker in line:
            complete = True
            break
    if complete:
        try:
            process.wait(timeout=4)
        except subprocess.TimeoutExpired:
            os.killpg(process.pid, signal.SIGTERM)
            process.wait(timeout=10)
    else:
        assert process.wait() == 0, 'Wrangler did not report completion'
    assert complete, 'Missing upload completion marker; verify the upload before continuing'


def download(path):
    with tempfile.TemporaryDirectory(prefix='multi-sense-public-') as directory:
        destination = Path(directory) / 'body'
        command = ['curl', '--fail', '--silent', '--show-error', '--location',
                   '--connect-timeout', '5', '--max-time', '30', '--retry', '2',
                   '--retry-all-errors', '--output', str(destination), '--write-out',
                   '%{http_code} %{content_type}', BASE + path]
        metadata = subprocess.check_output(command, env=ENV, stderr=subprocess.PIPE).decode()
        assert metadata.startswith('200 '), metadata
        return destination.read_bytes(), metadata.split(' ', 1)[1].strip()


def publish():
    entries = []
    for file in manifest['files']:
        path = ROOT / 'public' / file['path'].lstrip('/')
        assert path.is_file() and hashlib.sha256(path.read_bytes()).hexdigest() == file['sha256']
        entries.append({'key': file['path'].lstrip('/'), 'file': str(path)})
    with tempfile.TemporaryDirectory(prefix='multi-sense-upload-') as directory:
        file = Path(directory) / 'objects.json'; file.write_text(json.dumps(entries))
        run_writer(['r2', 'bulk', 'put', 'english-flashcards-audio', '--filename', str(file),
                    '--content-type', 'audio/mpeg', '--cache-control', 'public, max-age=31536000, immutable',
                    '--concurrency', '4', '--remote', '--force'], 'Uploaded 100%')
    run_writer(['r2', 'object', 'put', 'english-flashcards-audio/audio-updates/' + BATCH + '/manifest.json',
                '--file', str(DIRECTORY / 'manifest.json'), '--content-type', 'application/json',
                '--cache-control', 'public, max-age=300', '--remote', '--force'], 'Upload complete.')


def verify():
    previous = json.loads(REPORT.read_text()) if REPORT.exists() else {}
    verified = {file['path']: file for file in previous.get('files', [])} if previous.get('baseUrl') == BASE else {}
    expected = {file['path']: file for file in manifest['files']}
    verified = {path: file for path, file in verified.items() if expected.get(path, {}).get('sha256') == file.get('sha256')}
    failures = []
    def check(file):
        if file['path'] in verified:
            return verified[file['path']]
        data, content_type = download(file['path'])
        assert content_type.split(';')[0] == 'audio/mpeg', (file['path'], content_type)
        assert len(data) == file['bytes'] and hashlib.sha256(data).hexdigest() == file['sha256'], file['path']
        return dict(path=file['path'], sha256=file['sha256'], bytes=len(data), contentType=content_type)
    def checkpoint():
        REPORT.parent.mkdir(exist_ok=True)
        REPORT.write_text(json.dumps(dict(batch=BATCH, baseUrl=BASE, expectedFiles=1736,
            verifiedFiles=len(verified), failures=failures, files=list(verified.values())), indent=2)+'\n')
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        future_files = {pool.submit(check, file): file for file in manifest['files']}
        for number, future in enumerate(concurrent.futures.as_completed(future_files), 1):
            file = future_files[future]
            try:
                result = future.result(); verified[file['path']] = result
            except Exception as error:
                failures.append(dict(path=file['path'], error=str(error)))
            if number % 32 == 0:
                checkpoint(); print(f'PUBLIC {len(verified)}/1736 failures={len(failures)}', flush=True)
    checkpoint()
    assert not failures and len(verified) == 1736, f'Public files still need repair: {len(failures)}'
    data, content_type = download('/audio-updates/' + BATCH + '/manifest.json')
    assert data == manifest_bytes and content_type.startswith('application/json'), 'Public manifest differs'
    result = json.loads(REPORT.read_text()); result['manifestMatched'] = True
    REPORT.write_text(json.dumps(result, indent=2)+'\n')
    print('PUBLIC READY 1736/1736; manifest matched.', flush=True)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--verify-only', action='store_true')
    args = parser.parse_args()
    if not args.verify_only:
        publish()
    verify()
