// Run with playwright-cli run-code --filename=scripts/check-delivery-browser.cjs
// against the local production server. Uses fresh guest contexts, no accounts.
async (page, { artifacts } = {}) => {
  for (const context of page.context().browser().contexts()) if (context !== page.context()) await context.close();
  const origin = new URL(page.url()).origin, results = [], contexts = new Set();
  let trace = 0;
  const close = async context => {
    if (artifacts) await context.tracing.stop({ path: `${artifacts}/delivery-${++trace}.zip` });
    contexts.delete(context); await context.close();
  };
  const check = (condition, name) => { if (!condition) throw new Error(name); results.push(name); };
  const open = async (connection, serviceWorkers = 'block') => {
    const context = await page.context().browser().newContext({ serviceWorkers, reducedMotion: 'reduce', viewport: { width: 1440, height: 1000 } });
    contexts.add(context);
    if (artifacts) await context.tracing.start({ screenshots: true, snapshots: true });
    await context.route('**/*', route => new URL(route.request().url()).origin === origin
      ? route.continue() : route.abort('blockedbyclient'));
    if (connection) await context.addInitScript(value => Object.defineProperty(navigator, 'connection', { value, configurable: true }), connection);
    const p = await context.newPage(), requests = [], errors = [];
    p.on('request', r => requests.push(new URL(r.url()).pathname));
    p.on('pageerror', e => errors.push(e.message));
    await p.goto(origin); await p.locator('.study-dashboard').waitFor(); await p.waitForTimeout(300);
    return { context, p, requests, errors };
  };
  const protectedState = p => p.evaluate(() => Object.fromEntries(Object.entries(localStorage).filter(([key]) => /learned|mastered|bookmark|word_progress|study_history|wrong_words/.test(key))));
  try {
  {
    const { context, p, requests, errors } = await open({ effectiveType: '4g' });
    const before = await protectedState(p), button = p.locator('.study-dashboard-task button[data-prepare-reading]').first();
    const id = await button.getAttribute('data-prepare-reading');
    check(!requests.some(path => /^\/data\/readings\//.test(path)), 'startup does not download article prose');
    check(!requests.some(path => /ReadingSessionView.*\.js$/.test(path)), 'reading page stays lazy before intent');
    await button.hover();
    await p.waitForFunction(() => performance.getEntriesByType('resource').some(r => /\/data\/readings\//.test(r.name)));
    await p.waitForTimeout(250);
    check(requests.filter(path => path.startsWith(`/data/readings/${id}-`)).length === 1, 'dwell prepares exactly the selected article');
    check(requests.some(path => /ReadingSessionView.*\.js$/.test(path)), 'dwell prepares reading code');
    check(requests.filter(path => /\/data\/reading-vocabulary\//.test(path)).length === 1, 'intent prepares one fixed public reading lookup');
    check(!requests.some(path => /\/data\/vocabulary\/(?:catalog\/extended|details\/)/.test(path)), 'reading intent does not fetch the study pool or examples');
    check(JSON.stringify(before) === JSON.stringify(await protectedState(p)), 'intent does not change learning or bookmarks');
    await button.click(); await p.locator('.reading-session-content').waitFor();
    check(requests.filter(path => path.startsWith(`/data/readings/${id}-`)).length === 1, 'click reuses prepared canonical article');
    check(requests.filter(path => /ReadingSessionView.*\.js$/.test(path)).length === 1, 'render reuses prepared page module');
    check(requests.filter(path => /\/data\/reading-vocabulary\//.test(path)).length === 1, 'explicit click reuses the independent lookup');
    await p.getByRole('button', { name: '显示翻译', exact: true }).first().click();
    check(await p.getByRole('button', { name: '收起翻译', exact: true }).first().isVisible(), 'translation remains interactive');
    await p.setViewportSize({ width: 390, height: 844 });
    check(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'mobile reading has no horizontal overflow');
    await p.setViewportSize({ width: 1440, height: 1000 });
    const n = requests.length;
    await p.locator('.ds-sidebar button[data-prepare-view="statistics"]').hover(); await p.waitForTimeout(300);
    check(!requests.slice(n).some(path => /Statistics.*\.js$/.test(path)), 'active reading blocks unrelated speculative work');
    check(errors.length === 0, 'reading flow has no page errors');
    await close(context);
  }
  for (const connection of [{ effectiveType: '3g' }, { effectiveType: '4g', saveData: true }]) {
    const { context, p, requests } = await open(connection);
    await p.locator('.study-dashboard-task button[data-prepare-reading]').first().hover(); await p.waitForTimeout(350);
    check(!requests.some(path => /^\/data\/readings\//.test(path)), `no speculation on ${connection.saveData ? 'data saver' : '3g'}`);
    await p.locator('.study-dashboard-task button[data-prepare-reading]').first().click(); await p.locator('.reading-session-content').waitFor();
    check(true, 'explicit navigation still works when speculation is disabled');
    await close(context);
  }
  {
    const { context, p, requests, errors } = await open({ effectiveType: '4g' });
    const stats = p.locator('.ds-sidebar button[data-prepare-view="statistics"]');
    await stats.hover(); await p.mouse.move(800, 80); await p.waitForTimeout(250);
    check(!requests.some(path => /Statistics.*\.js$/.test(path)), 'passing hover cancels preparation');
    await stats.focus(); await p.waitForTimeout(350);
    check(requests.some(path => /Statistics.*\.js$/.test(path)), 'keyboard focus prepares destination');
    await p.locator('.ds-sidebar button[data-prepare-view="home"]').first().hover(); await p.waitForTimeout(350);
    check(requests.some(path => /HomeScreen.*\.js$/.test(path)), 'second destination is prepared');
    await p.locator('.ds-sidebar button[data-prepare-view="examPractice"]').hover(); await p.waitForTimeout(350);
    check(!requests.some(path => /ExamPracticeView.*\.js$/.test(path)), 'third speculative destination exceeds page budget');
    await p.locator('.ds-sidebar button[data-prepare-view="examPractice"]').click();
    await p.locator('.test-mode-grid').waitFor();
    check(requests.some(path => /ExamPracticeView.*\.js$/.test(path)), 'budget never blocks explicit navigation');
    for (const title of ['测验', '填空', '拼写', '连线', '句子听写']) {
      await p.locator('.test-mode-grid .ds-module-card').filter({ has: p.getByRole('heading', { name: title, exact: true }) }).click();
      await p.locator('.test-session-header').waitFor();
      check(await p.getByRole('progressbar', { name: '本次答题进度' }).getAttribute('aria-valuenow') === '0', `${title} renders with zero answers`);
      await p.locator('.test-session-back').click(); await p.locator('.test-mode-grid').waitFor();
    }
    await p.locator('.ds-sidebar').getByRole('button', { name: '今日计划', exact: true }).click();
    await p.locator('.study-dashboard-task button[data-prepare-view="learn"]').first().click();
    await p.locator('.learn-refresh-word').waitFor();
    check(true, 'word study still loads its real word card');
    await p.setViewportSize({ width: 390, height: 844 });
    check(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'mobile word study retains its dedicated layout without overflow');
    check(errors.length === 0, 'navigation flow has no page errors');
    await close(context);
  }
  {
    const { context, p, requests, errors } = await open({ effectiveType: '4g' }, 'allow');
    await p.evaluate(() => navigator.serviceWorker.ready.then(() => true));
    await p.reload(); await p.locator('.study-dashboard').waitFor();
    check(await p.evaluate(() => Boolean(navigator.serviceWorker.controller)), 'production service worker controls reload');
    const protectedBefore = await protectedState(p);
    await context.setOffline(true); await p.reload(); await p.locator('.study-dashboard').waitFor();
    check(true, 'cached homepage reloads offline');
    await p.locator('.study-dashboard-task button[data-prepare-reading]').first().click();
    await p.locator('.reading-session-content').waitFor();
    check(true, 'unopened article and lookup recover offline through existing fallbacks');
    check(JSON.stringify(protectedBefore) === JSON.stringify(await protectedState(p)), 'offline navigation preserves learning and bookmarks');
    await context.setOffline(false);
    check(!(await p.evaluate(() => performance.getEntriesByType('resource').some(r => /r2\.dev/.test(r.name)))), 'no legacy audio route in this guest flow');
    check(errors.length === 0, 'PWA offline flow has no page errors');
    await close(context);
  }
  return { passed: results.length, results };
  } finally {
    for (const context of contexts) {
      if (artifacts) await context.pages()[0]?.screenshot({ path: `${artifacts}/delivery-failure.png`, fullPage: true }).catch(() => {});
      await close(context);
    }
  }
}
