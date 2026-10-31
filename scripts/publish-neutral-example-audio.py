"""Publish only the registered immutable batch, then verify every public byte.

Uses the existing Wrangler login. Proxy settings, when needed, come from the
caller's environment. Never prints or exports an authentication credential.
"""
import argparse
import concurrent.futures
import hashlib
import http.client
import json
import os
from pathlib import Path
import signal
import ssl
import subprocess
import tempfile
import threading
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
BATCH = '2026-10-31-neutral-examples'
DIRECTORY = ROOT / 'public/audio-updates' / BATCH
BASE = 'https://audio.englishflashcards.cn'
WRANGLER = ['node', 'node_modules/wrangler/bin/wrangler.js']
ENV = {**os.environ, 'WRANGLER_SEND_METRICS': 'false'}
REPORT = ROOT / 'output/neutral-example-audio-public.json'
manifest_bytes = (DIRECTORY / 'manifest.json').read_bytes()
manifest = json.loads(manifest_bytes)
assert manifest['ready'] and manifest['expectedFiles'] == len(manifest['files']) == 1652
assert len({file['path'] for file in manifest['files']}) == 1652


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


clients = threading.local()


def download(path):
    # Reuse one verified TLS connection per worker instead of repeating CONNECT
    # and TLS handshakes for every small recording. Certificate checks stay on.
    last_error = None
    for _ in range(3):
        try:
            connection = getattr(clients, 'connection', None)
            if connection is None:
                target = urlparse(BASE)
                proxy_url = ENV.get('HTTPS_PROXY') or ENV.get('https_proxy')
                proxy = urlparse(proxy_url) if proxy_url else None
                connection = http.client.HTTPSConnection(proxy.hostname if proxy else target.hostname,
                    (proxy.port or 80) if proxy else 443, timeout=20, context=ssl.create_default_context())
                if proxy:
                    assert proxy.scheme == 'http', 'This maintenance reader supports standard HTTP CONNECT proxies.'
                    connection.set_tunnel(target.hostname, 443)
                clients.connection = connection
            connection.request('GET', path, headers={'User-Agent': 'curl/8.7.1', 'Accept-Encoding': 'identity'})
            response = connection.getresponse()
            data = response.read()
            assert response.status == 200, f'{path}: HTTP {response.status}'
            return data, response.getheader('content-type', '').strip()
        except Exception as error:
            last_error = error
            connection = getattr(clients, 'connection', None)
            if connection:
                connection.close()
            clients.connection = None
    raise last_error


def publish(only_id=None, missing_only=False, only_ids=None):
    entries = []
    previous = json.loads(REPORT.read_text()) if missing_only and REPORT.exists() else {}
    checked = {file['path']: file for file in previous.get('files', [])} if previous.get('baseUrl') == BASE else {}
    for file in manifest['files']:
        if only_id is not None and file['id'] != only_id:
            continue
        if only_ids and file['id'] not in only_ids:
            continue
        if checked.get(file['path'], {}).get('sha256') == file['sha256']:
            continue
        path = ROOT / 'public' / file['path'].lstrip('/')
        assert path.is_file() and hashlib.sha256(path.read_bytes()).hexdigest() == file['sha256']
        entries.append({'key': file['path'].lstrip('/'), 'file': str(path)})
    assert entries, 'No registered recordings selected'
    with tempfile.TemporaryDirectory(prefix='neutral-example-upload-') as directory:
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
        REPORT.write_text(json.dumps(dict(batch=BATCH, baseUrl=BASE, expectedFiles=1652,
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
                checkpoint(); print(f'PUBLIC {len(verified)}/1652 failures={len(failures)}', flush=True)
    checkpoint()
    assert not failures and len(verified) == 1652, f'Public files still need repair: {len(failures)}'
    data, content_type = download('/audio-updates/' + BATCH + '/manifest.json')
    assert data == manifest_bytes and content_type.startswith('application/json'), 'Public manifest differs'
    result = json.loads(REPORT.read_text()); result['manifestMatched'] = True
    REPORT.write_text(json.dumps(result, indent=2)+'\n')
    print('PUBLIC READY 1652/1652; manifest matched.', flush=True)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--verify-only', action='store_true')
    parser.add_argument('--only-id', type=int, help='Publish one registered word update, then verify the complete manifest.')
    parser.add_argument('--only-ids', type=int, nargs='+', help='Publish the named registered word updates, then verify the complete manifest.')
    parser.add_argument('--missing-only', action='store_true', help='Skip only recordings already verified by public hash in this batch.')
    args = parser.parse_args()
    if not args.verify_only:
        publish(args.only_id, args.missing_only, args.only_ids)
    verify()
