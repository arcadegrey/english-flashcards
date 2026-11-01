// Anonymous public HTTP probe. Explicitly bypasses environment proxies; this
// does not certify that the host itself is on a mainland network.
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { readFile } from 'node:fs/promises'
const run = promisify(execFile)
const origin = new URL(process.argv[2] || 'https://www.englishflashcards.cn').origin
const probe = async (pathname, headersOnly = true, etag) => {
  try {
    const { stdout } = await run('curl', ['--noproxy', '*', '--connect-timeout', '5', '--max-time', '15',
      '-sS', '-D', '-', ...(headersOnly ? ['-I'] : []), ...(etag ? ['-H', `If-None-Match: ${etag}`] : []),
      '-w', '\n__TIMING__{"status":%{http_code},"dns":%{time_namelookup},"tls":%{time_appconnect},"ttfb":%{time_starttransfer},"total":%{time_total}}',
      new URL(pathname, origin).href], { maxBuffer: 2 * 1024 * 1024 })
    const [response, timing] = stdout.split('__TIMING__')
    const blocks = response.trim().split(/\r?\n\r?\n/)
    const header = blocks.find(block => /^HTTP\/[^\n]+\s200/.test(block)) || blocks[0]
    const get = name => header.match(new RegExp(`^${name}:\\s*(.*)$`, 'im'))?.[1].trim()
    return { pathname, ...JSON.parse(timing), cacheControl: get('cache-control'), etag: get('etag'),
      edge: get('cf-cache-status'), ray: get('cf-ray'), body: headersOnly ? undefined : blocks.slice(1).join('\n\n') }
  } catch (error) { return { pathname, error: error.stderr?.trim() || error.message } }
}
const home = await probe('/', false)
const script = home.body?.match(/src="(\/assets\/[^\"]+\.js)"/)?.[1]
delete home.body
const startup = JSON.parse(await readFile(new URL('../src/data/vocabularyStartup.json', import.meta.url)))
const readings = JSON.parse(await readFile(new URL('../src/data/readingCatalog.json', import.meta.url)))
const results = [home]
for (const pathname of ['/sw.js', ...(script ? [script] : []), startup.coreCatalog.path,
  readings.entries[0].article.contentPath, '/api/progress']) {
  const result = await probe(pathname, !pathname.startsWith('/api/'))
  delete result.body
  results.push(result)
  if (result.etag && result.status === 200) results.push(await probe(pathname, true, result.etag))
}
console.log(JSON.stringify({ origin, proxy: 'curl --noproxy *',
  location: 'Not inferred; must be recorded by the tester', at: new Date().toISOString(), results }, null, 2))
if (results.some(result => result.error || (result.status >= 400 && result.pathname !== '/api/progress'))) process.exitCode = 1
