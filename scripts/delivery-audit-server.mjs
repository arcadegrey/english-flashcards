// Local production-asset server for repeatable browser audits. No real accounts.
import http from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { gzipSync } from 'node:zlib'
import { createHash } from 'node:crypto'

const root = path.resolve(process.argv[2] || 'dist')
const port = Number(process.argv[3] || 5194)
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp' }
const rules = (await readFile(path.join(root, '_headers'), 'utf8')).split(/\n(?=\/)/).map(block => {
  const [pattern, ...lines] = block.trim().split('\n')
  return { pattern, cache: lines.find(line => /cache-control:/i.test(line))?.split(/:\s*/).slice(1).join(':') }
})
http.createServer(async (req, res) => {
  try {
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
      if (path.extname(relative)) { res.writeHead(404); return res.end() }
      relative = '/index.html'; file = path.join(root, 'index.html')
    }
    const body = await readFile(file)
    const etag = `"${createHash('sha256').update(body).digest('hex')}"`
    const matches = rules.filter(rule => rule.pattern.endsWith('*') ? pathname.startsWith(rule.pattern.slice(0, -1)) : [pathname, relative].includes(rule.pattern))
    res.setHeader('Cache-Control', matches.map(rule => rule.cache).filter(Boolean).join(', ') || 'public, max-age=0, must-revalidate')
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
}).listen(port, '127.0.0.1', () => console.log(`Delivery audit: http://127.0.0.1:${port}`))
