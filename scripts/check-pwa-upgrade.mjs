import assert from 'node:assert/strict'

// Real Service Workers, two separately hashed production builds and one origin.
// Never connects to real accounts. setRoot simulates a static deployment switch.
export async function checkPwaUpgrade(browser, site, releaseB) {
  const results = [], check = (value, name) => { assert(value, name); results.push(name) }
  const context = await browser.newContext({ serviceWorkers: 'allow', reducedMotion: 'reduce', viewport: { width: 1440, height: 1000 } })
  await context.route('**/*', route => new URL(route.request().url()).origin === site.url
    ? route.continue() : route.abort('blockedbyclient'))
  await context.tracing.start({ screenshots: true, snapshots: true })
  const p = await context.newPage(), errors = [], writes = []
  context.on('page', page => {
    page.on('pageerror', error => errors.push(error.message))
  })
  context.on('request', request => { if (request.method() !== 'GET' && request.method() !== 'HEAD') writes.push(request.url()) })
  p.on('pageerror', error => errors.push(error.message))
  const home = page => page.locator('.study-dashboard').waitFor()
  const goHome = async page => { await page.locator('.ds-sidebar').getByRole('button', { name: '今日计划', exact: true }).click(); await home(page) }
  const waitForWorker = page => page.evaluate(() => navigator.serviceWorker.ready.then(() => true))
  const update = page => page.evaluate(async () => { await (await navigator.serviceWorker.ready).update() })
  const waiting = async page => {
    const deadline = Date.now() + 30000
    while (!await page.evaluate(async () => Boolean((await navigator.serviceWorker.getRegistration())?.waiting))) {
      if (Date.now() > deadline) throw new Error('New production worker did not enter waiting')
      await new Promise(resolve => setTimeout(resolve, 50))
    }
  }
  const build = page => page.locator('[data-app-build]').getAttribute('data-app-build')
  const saved = page => page.evaluate(() => Object.fromEntries(Object.entries(localStorage)
    .filter(([key]) => /learned|mastered|bookmark|word_progress|study_history|wrong_words|exam_draft/.test(key))))
  try {
    await p.goto(site.url); await home(p); await waitForWorker(p)
    await p.reload(); await home(p)
    const initialBuild = await build(p)
    check(initialBuild !== 'ci-upgrade-b', 'starts with release A')
    check(await p.evaluate(() => Boolean(navigator.serviceWorker.controller)), 'release A controls the page')
    // Write through real study actions before upgrading, never a production API.
    await p.locator('.study-dashboard-task button[data-prepare-view="learn"]').first().click()
    await p.locator('.learn-refresh-word').waitFor()
    const oldWord = await p.locator('.learn-refresh-word').textContent()
    await p.getByRole('button', { name: '认识了', exact: true }).click()
    const before = await saved(p)
    // Deployment B removes old HTTP asset URLs, while A remains controlled/cached.
    site.setRoot(releaseB)
    await update(p); await waiting(p)
    await p.evaluate(async () => (await navigator.serviceWorker.getRegistration()).waiting.postMessage({ type: 'SKIP_WAITING' }))
    await p.waitForTimeout(200)
    check(await p.evaluate(async () => Boolean((await navigator.serviceWorker.getRegistration()).waiting)), 'legacy immediate-activation message cannot bypass the guard')
    check(await build(p) === initialBuild, 'new deployment does not refresh active word study')
    check(await p.locator('.learn-refresh-word').isVisible(), 'word card remains interactive while update waits')
    check(!await p.getByRole('status', { name: '应用更新' }).isVisible(), 'update notice stays out of the active study workspace')
    await p.getByRole('button', { name: '显示提示', exact: true }).click()
    check(await p.locator('.learn-refresh-word').textContent() !== oldWord, 'the user study action, rather than deployment, advanced the word')
    await goHome(p)
    await p.getByRole('status', { name: '应用更新' }).waitFor()
    await p.screenshot({ path: 'output/browser-ci/update-desktop.png', animations: 'disabled' })
    await p.setViewportSize({ width: 390, height: 844 })
    check(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'mobile update notice has no horizontal overflow')
    await p.screenshot({ path: 'output/browser-ci/update-mobile.png', animations: 'disabled' })
    await p.getByRole('button', { name: '切换到深色模式', exact: true }).click()
    await p.screenshot({ path: 'output/browser-ci/update-mobile-dark.png', animations: 'disabled' })
    const colors = await p.locator('.ds-update-actions .ds-button-secondary').evaluate(element => ({
      text: getComputedStyle(element).color, background: getComputedStyle(element).backgroundColor,
    }))
    const luminance = color => color.match(/[\d.]+/g).slice(0, 3).map(value => Number(value) / 255)
      .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
      .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0)
    const contrast = (Math.max(luminance(colors.text), luminance(colors.background)) + 0.05)
      / (Math.min(luminance(colors.text), luminance(colors.background)) + 0.05)
    check(contrast >= 4.5, 'dark update secondary action has readable text contrast')
    await p.getByRole('button', { name: '切换到浅色模式', exact: true }).click()
    await p.setViewportSize({ width: 320, height: 844 })
    check(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'compact mobile update actions remain within the viewport')
    await p.screenshot({ path: 'output/browser-ci/update-mobile-compact.png', animations: 'disabled' })
    await p.setViewportSize({ width: 1440, height: 1000 })
    // Another controlled tab holds an actual dictation draft during the request.
    const study = await context.newPage()
    await study.goto(site.url); await home(study)
    check(await build(study) === initialBuild, 'new tab uses the still-active release A')
    await study.locator('.ds-sidebar').getByRole('button', { name: '测试', exact: true }).click()
    await study.locator('.test-mode-grid .ds-module-card').filter({ has: study.getByRole('heading', { name: '句子听写', exact: true }) }).click()
    await study.locator('#dictation-answer').fill('A draft retained across an update.')
    const draftBefore = await saved(study)
    await p.getByRole('button', { name: '更新并刷新', exact: true }).click()
    await p.getByText('请先结束其他页面的操作，或关闭不再使用的旧页面后重试。', { exact: true }).waitFor()
    check(await build(p) === initialBuild && await build(study) === initialBuild, 'busy second tab blocks activation for every page')
    check(await study.locator('#dictation-answer').inputValue() === 'A draft retained across an update.', 'blocked upgrade retains typed dictation text')
    assert.deepEqual(await saved(study), draftBefore); results.push('blocked upgrade preserves saved learning and drafts')
    await goHome(study)
    // Older pages without the new handshake must block, without clearing storage.
    const legacy = await context.newPage()
    await legacy.goto(`${site.url}/favicon.svg`)
    await p.getByRole('button', { name: '更新并刷新', exact: true }).click()
    await p.getByText('请先结束其他页面的操作，或关闭不再使用的旧页面后重试。', { exact: true }).waitFor()
    check(await build(p) === initialBuild, 'unresponsive legacy page also blocks activation')
    await legacy.close()
    await study.close()
    // A full page reload must occur only after this explicit all-idle confirmation.
    const navigation = p.waitForEvent('domcontentloaded')
    await p.getByRole('button', { name: '更新并刷新', exact: true }).click()
    await navigation; await home(p)
    check(await build(p) === 'ci-upgrade-b', 'explicit confirmation loads release B')
    const after = await saved(p)
    for (const [key, value] of Object.entries(before)) assert.equal(after[key], value, key)
    results.push('release B retains existing word learning')
    for (const [key, value] of Object.entries(draftBefore)) assert.equal(after[key], value, key)
    results.push('release B retains account-scoped local drafts')
    await p.locator('.ds-sidebar').getByRole('button', { name: '测试', exact: true }).click()
    await p.locator('.test-mode-grid .ds-module-card').filter({ has: p.getByRole('heading', { name: '句子听写', exact: true }) }).click()
    check(await p.locator('#dictation-answer').inputValue() === 'A draft retained across an update.', 'release B restores real dictation draft through the normal entry')
    check(await p.getByRole('progressbar', { name: '本次答题进度' }).getAttribute('aria-valuenow') === '0', 'upgrading adds no dictation answer or grade')
    await goHome(p); await waitForWorker(p)
    await context.setOffline(true); await p.reload(); await home(p)
    check(await build(p) === 'ci-upgrade-b', 'updated app reloads offline')
    await p.locator('.study-dashboard-task button[data-prepare-reading]').first().click()
    await p.locator('.reading-session-content').waitFor()
    check(true, 'updated offline app can open an unvisited article')
    check(errors.length === 0, `no runtime errors: ${errors.join('; ')}`)
    check(writes.length === 0, 'upgrade flow does not write production-style APIs')
    return { passed: results.length, results }
  } catch (error) {
    await p.screenshot({ path: 'output/browser-ci/pwa-upgrade-failure.png', fullPage: true }).catch(() => {})
    throw error
  } finally {
    await context.tracing.stop({ path: 'output/browser-ci/pwa-upgrade-trace.zip' })
    await context.close()
  }
}
