// Anonymous browser timings only. Launch with scripts/playwright-direct.json.
// This records the host's route; the tester must separately record location/ISP.
async page => {
  const origin = new URL(page.url()).origin;
  const context = await page.context().browser().newContext({ serviceWorkers: 'allow', viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const p = await context.newPage(), errors = [], results = [];
  p.on('pageerror', error => errors.push(error.message));
  const measure = async (name, action, ready) => {
    const start = Date.now();
    try { await action(); await ready(); results.push({ name, elapsedMs: Date.now() - start, status: 'ready' }); }
    catch (error) { results.push({ name, elapsedMs: Date.now() - start, error: error.message.slice(0, 400) }); }
  };
  try {
    await measure('first visit', () => p.goto(origin, { waitUntil: 'domcontentloaded', timeout: 25000 }), () => p.locator('.study-dashboard').waitFor({ timeout: 25000 }));
    if (results[0].status === 'ready') {
      await measure('revisit same browser context', () => p.reload({ waitUntil: 'domcontentloaded', timeout: 25000 }), () => p.locator('.study-dashboard').waitFor({ timeout: 25000 }));
    } else results.push({ name: 'revisit same browser context', status: 'not measured', reason: 'First visit did not become ready; no valid warm baseline' });
    if (await p.locator('.study-dashboard').isVisible()) {
      await measure('open training', () => p.locator('.ds-sidebar').getByRole('button', { name: '训练中心', exact: true }).click(), () => p.locator('.ds-module-card').first().waitFor({ timeout: 25000 }));
      await p.locator('.ds-sidebar').getByRole('button', { name: '今日计划', exact: true }).click();
      await p.locator('.study-dashboard').waitFor({ timeout: 25000 });
      await measure('open suggested article', () => p.getByRole('button', { name: '开始阅读', exact: true }).first().click(), () => p.locator('.reading-session-content').waitFor({ timeout: 25000 }));
    }
    return { origin, at: new Date().toISOString(), locationAndISP: 'Must be recorded by tester; not inferred', results, errors,
      resources: await p.evaluate(() => performance.getEntriesByType('resource').map(r => ({ url: r.name, transferBytes: r.transferSize, bodyBytes: r.encodedBodySize, durationMs: r.duration }))) };
  } finally { await context.close(); }
}
