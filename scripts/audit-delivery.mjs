import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { gzipSync } from 'node:zlib'

const root = path.resolve(process.argv[2] || 'dist')
const manifest = JSON.parse(await readFile(path.join(root, '.vite/manifest.json'), 'utf8'))
const closure = key => {
  const found = new Set()
  const visit = id => { if (found.has(id) || !manifest[id]) return; found.add(id); (manifest[id].imports || []).forEach(visit) }
  visit(key)
  return [...found]
}
const summary = async keys => {
  const files = [...new Set(keys.flatMap(key => [manifest[key].file, ...(manifest[key].css || [])]))]
  const sizes = await Promise.all(files.map(async file => ({ file, gzip: gzipSync(await readFile(path.join(root, file))).length })))
  return { requests: sizes.length, gzipBytes: sizes.reduce((sum, entry) => sum + entry.gzip, 0),
    tinyJs: sizes.filter(entry => entry.file.endsWith('.js') && entry.gzip < 2048), files }
}
const entry = Object.keys(manifest).find(key => manifest[key].isEntry)
const main = Object.keys(manifest).find(key => key === 'src/main.jsx')
if (!entry || !main) throw new Error('Missing startup entries in the production manifest')
const startup = [...new Set([...closure(entry), ...closure(main)])]
const pages = Object.fromEntries(await Promise.all(['LearningView', 'ReadingSessionView', 'HomeScreen', 'AssessmentSession'].map(async name => {
  const key = Object.keys(manifest).find(key => key.endsWith(`/${name}.jsx`))
  return [name, await summary(closure(key).filter(id => !startup.includes(id)))]
})))
const headers = await readFile(path.join(root, '_headers'), 'utf8')
const rules = headers.trim().split(/\n(?=\/)/).map(block => {
  const [pattern, line] = block.split('\n')
  return { pattern, cache: line.trim().slice('Cache-Control: '.length) }
})
const failures = []
const allFiles = await readdir(root, { recursive: true })
let immutableFiles = 0
for (const rule of rules.filter(rule => rule.cache.includes('immutable'))) {
  for (const file of allFiles.filter(file => `/${file}`.startsWith(rule.pattern.slice(0, -1)))) {
    if (!path.extname(file)) continue
    immutableFiles++
    // Immutable URLs must carry a filename content version, not just a query.
    const versioned = file.startsWith('data/') || file.startsWith('images/') || file.startsWith('assets/word-hints/')
      ? /[-/][a-f0-9]{16}\.(json|webp|js)$/.test(file)
      : /-[\w-]{8}\.(js|css)$/.test(file)
    if (!versioned) failures.push(`Unversioned immutable file: ${file}`)
    if (rules.filter(other => other.pattern.endsWith('*') ? `/${file}`.startsWith(other.pattern.slice(0, -1)) : other.pattern === `/${file}`).length !== 1) failures.push(`Overlapping headers: ${file}`)
  }
}
for (const url of ['/', '/index.html', '/sw.js', '/registerSW.js', '/manifest.webmanifest']) {
  if (rules.find(rule => rule.pattern === url)?.cache !== 'public, max-age=0, must-revalidate') failures.push(`Missing revalidation: ${url}`)
}
if (rules.some(rule => rule.pattern.startsWith('/api'))) failures.push('Static headers must not override private API responses')
const startupReport = await summary(startup)
const startupJs = startupReport.files.filter(file => file.endsWith('.js'))
const jsGzip = (await Promise.all(startupJs.map(async file => gzipSync(await readFile(path.join(root, file))).length))).reduce((a, b) => a + b, 0)
if (startupJs.length > 24 || jsGzip > 170000) failures.push('Startup JS exceeds the measured 24-request / 170000-byte gzip budget')
if (['src/data/coreVocabularyCatalog.json', 'src/data/readingVocabulary.json', 'src/data/readings.js', 'shared/vocabularyAudio.js']
  .some(key => startup.includes(key))) failures.push('A lazy full catalog or audio mapping entered startup')
const readingConfig = JSON.parse(await readFile(new URL('../src/data/readingCatalog.json', import.meta.url)))
const lookupBytes = gzipSync(await readFile(path.join(root, readingConfig.vocabularyCatalog.path.slice(1)))).length
const articleBytes = await Promise.all(readingConfig.entries.map(async entry => gzipSync(await readFile(path.join(root, entry.article.contentPath.slice(1)))).length))
const speculativeReadingDataBytes = lookupBytes + 2 * Math.max(...articleBytes)
if (speculativeReadingDataBytes > 64 * 1024) failures.push('Two article intents plus the shared lookup exceed the 64 KiB gzip data budget')
const report = { startup: { ...startupReport, jsRequests: startupJs.length, jsGzipBytes: jsGzip }, pages,
  speculativeReadingDataBytes, cache: { rules: rules.length, immutableFiles, failures } }
console.log(JSON.stringify(report, null, 2))
if (failures.length) process.exitCode = 1
