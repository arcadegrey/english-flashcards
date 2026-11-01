import http from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { gzipSync } from 'node:zlib'
import { createHash } from 'node:crypto'

// Only loopback. Root switching simulates a real deployment for browser CI.
export async function startDeliveryServer({ root = 'dist', port = 0 } = {}) {
  let currentRoot = path.resolve(root)
  const ruleCache = new Map()
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp' }
  const rulesFor = async root => {
    if (!ruleCache.has(root)) ruleCache.set(root, readFile(path.join(root, '_headers'), 'utf8').then(text => text.split(/\n(?=\/)/).map(block => {
      const [pattern, ...lines] = block.trim().split('\n')
      return { pattern, cache: lines.find(line => /cache-control:/i.test(line))?.split(/:\s*/).slice(1).join(':') }
    })))
    return ruleCache.get(root)
  }
  const server = http.createServer(async (req, res) => {
    try {
      const root = currentRoot, rules = await rulesFor(root)
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
      if (pathname.startsWith('/api/')) {
        res.writeHead(401, { 'content-type': 'application/json', 'cache-control': 'no-store' })
        return res.end('{"error":"Local guest audit"}')
      }
      let relative = pathname === '/' ? '/index.html' : pathname
      let file = path.resolve(root, `.${relative}`)
      if (!file.startsWith(`${root}${path.sep}`)) { res.writeHead(403); return res.end() }
      try { if (!(await stat(file)).isFile()) throw new Error() }
      catch {
        if (path.extname(relative) || /^\/(assets|data|images|icons)\//.test(relative)) {
          res.writeHead(404, { 'cache-control': 'no-store' }); return res.end()
        }
        relative = '/index.html'; file = path.join(root, 'index.html')
      }
      const body = await readFile(file)
      const etag = `"${createHash('sha256').update(body).digest('hex')}"`
      const matches = rules.filter(rule => rule.pattern.endsWith('*') ? pathname.startsWith(rule.pattern.slice(0, -1)) : rule.pattern === relative)
      res.setHeader('Cache-Control', [...new Set(matches.map(rule => rule.cache).filter(Boolean))].join(', ') || 'public, max-age=0, must-revalidate')
      res.setHeader('ETag', etag)
      res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream')
      if (req.headers['if-none-match'] === etag) { res.writeHead(304); return res.end() }
      const compress = /javascript|json|css|html|svg/.test(String(res.getHeader('Content-Type'))) && /gzip/.test(req.headers['accept-encoding'] || '')
      const bytes = compress ? gzipSync(body) : body
      if (compress) res.setHeader('Content-Encoding', 'gzip')
      res.setHeader('Vary', 'Accept-Encoding')
      res.setHeader('Content-Length', bytes.length)
      res.end(req.method === 'HEAD' ? undefined : bytes)
    } catch { res.writeHead(500); res.end() }
  })
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve) })
  return { url: `http://127.0.0.1:${server.address().port}`, setRoot: root => { currentRoot = path.resolve(root) },
    close: () => new Promise(resolve => { server.close(resolve); server.closeAllConnections() }) }
}
