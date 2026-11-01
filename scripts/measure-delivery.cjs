// Pass this function to playwright-cli run-code. Compares identical CDP conditions.
async page => {
  const results = [];
  for (const scenario of ['immediate', 'intent']) for (const run of [1, 2, 3]) {
    for (const port of [5194, 5195]) {
      const context = await page.context().browser().newContext({ serviceWorkers: 'block', reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
      const p = await context.newPage(), errors = [];
      p.on('pageerror', e => errors.push(e.message));
      const cdp = await context.newCDPSession(p);
      await cdp.send('Network.enable');
      await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
      await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 256000, uploadThroughput: 128000 });
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await p.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'domcontentloaded' });
      await p.locator('.study-dashboard').waitFor();
      const home = await p.evaluate(() => ({ at: performance.now(), resources: performance.getEntriesByType('resource').map(r => ({ path: new URL(r.name).pathname, bytes: r.encodedBodySize, start: r.startTime, end: r.responseEnd })) }));
      if (scenario === 'intent') {
        await p.locator('.study-dashboard-task button').filter({ hasText: '开始阅读' }).first().hover();
        await p.waitForTimeout(900);
      }
      const start = await p.evaluate(() => performance.now());
      await p.getByRole('button', { name: '开始阅读', exact: true }).first().click();
      await p.locator('.reading-session-title').waitFor();
      await p.locator('.reading-session-content').waitFor();
      results.push({ scenario, run, port, errors, home, reading: await p.evaluate(start => ({ elapsed: performance.now() - start, connection: navigator.connection?.effectiveType, resources: performance.getEntriesByType('resource').map(r => ({ path: new URL(r.name).pathname, bytes: r.encodedBodySize, start: r.startTime, end: r.responseEnd })) }), start) });
      await context.close();
    }
  }
  return results;
}
