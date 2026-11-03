import { chromium } from 'playwright'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import vm from 'node:vm'
import { spawn } from 'node:child_process'
import { startDeliveryServer } from './lib/delivery-server.mjs'
import { checkPwaUpgrade } from './check-pwa-upgrade.mjs'
import { checkPasswordAuth } from './check-password-auth-browser.mjs'
import { checkReadingSession } from './check-reading-session-browser.mjs'
import { checkLearningPages } from './check-learning-pages-browser.mjs'

await mkdir('output/browser-ci', { recursive: true })
const releaseB = path.resolve('output/browser-ci/release-b')
// The normal quality build is A. Build B has the same canonical data and real
// generator/cache rules, but a different client build ID and hashed JS graph.
await new Promise((resolve, reject) => {
  const child = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'build', '--outDir', releaseB], {
    env: { ...process.env, VITE_APP_BUILD_ID: 'ci-upgrade-b' }, stdio: 'inherit',
  })
  child.on('error', reject)
  child.on('exit', code => code === 0 ? resolve() : reject(new Error(`Second production build failed: ${code}`)))
})
const site = await startDeliveryServer({ root: 'dist' })
let browser
try {
  browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) })
  const context = await browser.newContext(), page = await context.newPage()
  await context.tracing.start({ screenshots: true, snapshots: true })
  await page.goto(site.url)
  const smoke = vm.runInThisContext(`(${await readFile('scripts/check-delivery-browser.cjs', 'utf8')})`)
  let delivery
  try { delivery = await smoke(page, { artifacts: 'output/browser-ci' }) }
  finally { await context.tracing.stop({ path: 'output/browser-ci/delivery-trace.zip' }); await context.close() }
  const upgrade = await checkPwaUpgrade(browser, site, releaseB)
  const password = await checkPasswordAuth(browser)
  const reading = await checkReadingSession(browser)
  const learning = await checkLearningPages(browser)
  const report = { browser: browser.version(), delivery, upgrade, password, reading, learning }
  await writeFile('output/browser-ci/results.json', JSON.stringify(report, null, 2))
  console.log(`Browser CI passed: ${delivery.passed} delivery + ${upgrade.passed} upgrade + ${password.passed} password + ${reading.passed} reading + ${learning.passed} learning assertions`)
} finally { await browser?.close(); await site.close() }
