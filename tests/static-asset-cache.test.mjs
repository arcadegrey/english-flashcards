import test from 'node:test'
import assert from 'node:assert/strict'
import worker from '../worker/index.js'
import { serveStaticAsset } from '../worker/staticAssets.js'

test('successful static responses retain immutable headers, ETags and streaming bodies', async () => {
  const response = new Response('module', { headers: { 'cache-control': 'public, max-age=31536000, immutable', etag: '"version"' } })
  assert.strictEqual(await serveStaticAsset(new Request('https://app.test/assets/chunk-hash.js'), { fetch: async () => response }), response)
})

test('missing JS/data/image URLs remain uncached 404s even for document navigation', async () => {
  for (const pathname of ['/assets/old-hash.js', '/data/readings/old-hash.json', '/images/optimized/missing.webp', '/sw.js', '/api/unknown']) {
    let calls = 0
    const response = await serveStaticAsset(new Request(`https://app.test${pathname}`, { headers: { 'sec-fetch-mode': 'navigate', accept: 'text/html' } }), {
      fetch: async () => { calls++; return new Response('missing', { status: 404, headers: { 'cache-control': 'public, max-age=31536000, immutable' } }) },
    })
    assert.equal(calls, 1)
    assert.equal(response.status, 404)
    assert.equal(response.headers.get('cache-control'), 'no-store')
  }
})

test('GET/HEAD document deep links keep the real app shell and require revalidation', async () => {
  for (const method of ['GET', 'HEAD']) {
    const paths = []
    const response = await serveStaticAsset(new Request('https://app.test/study/deep-link?theme=dark', { method, headers: { accept: 'text/html' } }), {
      fetch: async request => {
        paths.push(new URL(request.url).pathname)
        assert.equal(request.method, method)
        return paths.length === 1 ? new Response(null, { status: 404 })
          : new Response(method === 'GET' ? '<main>real shell</main>' : null, { headers: { 'content-type': 'text/html' } })
      },
    })
    assert.deepEqual(paths, ['/study/deep-link', '/index.html'])
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('cache-control'), 'public, max-age=0, must-revalidate')
  }
})

test('non-navigation misses and writes never receive the shell; anonymous API stays private', async () => {
  for (const request of [new Request('https://app.test/unknown'), new Request('https://app.test/unknown', { method: 'POST', headers: { accept: 'text/html' } })]) {
    const response = await serveStaticAsset(request, { fetch: async () => new Response(null, { status: 404 }) })
    assert.equal(response.status, 404)
  }
  const response = await worker.fetch(new Request('https://app.test/api/progress'), {
    ASSETS: { fetch: () => assert.fail('Private API must not reach static asset handling') },
  })
  assert.equal(response.status, 401)
  assert.equal(response.headers.get('cache-control'), 'no-store')
  const failedAsset = await worker.fetch(new Request('https://app.test/missing'), {
    ASSETS: { fetch: async () => { throw new Error('isolated asset failure') } },
  })
  assert.equal(failedAsset.status, 500)
  assert.equal(failedAsset.headers.get('cache-control'), 'no-store')
})
