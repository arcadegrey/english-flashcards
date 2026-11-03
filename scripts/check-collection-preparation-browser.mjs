export async function checkCollectionPreparation(f, site) {
  const { open, check, modeCard, start, answer, draft, login } = f;
  const page = await open({ flashcards_wrong_words: [1, 2], flashcards_learned_words: [1, 2], flashcards_progress_owner: 'guest' });
  await page.getByRole('button', { name: '通知', exact: true }).click();
  await page.getByRole('button', { name: '定向练习', exact: true }).click(); await page.locator('[aria-label="定向练习模式"]').waitFor();
  await start(page, 'spelling'); await answer(page, 'spelling');
  const before = await draft(page, 'guest', 'wrongWords', 'spelling');
  await page.locator('.test-session-back').click(); await page.locator('[aria-label="定向练习模式"]').waitFor();
  await page.evaluate(() => {
    window.collectionOriginalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      if (key === 'flashcards_collection_exam_draft:guest:wrongWords:spelling') throw new DOMException('Quota exceeded', 'QuotaExceededError');
      return window.collectionOriginalSetItem.call(this, key, value);
    };
  });
  await modeCard(page, 'spelling').locator('..').getByRole('button', { name: '按当前列表重新开始（替换草稿）', exact: true }).click();
  await page.getByRole('alert').filter({ hasText: '草稿保存失败' }).waitFor();
  check(JSON.stringify(await draft(page, 'guest', 'wrongWords', 'spelling')) === JSON.stringify(before), 'quota failure cannot overwrite the previous answered draft');
  check(await page.locator('.test-session-header').count() === 0, 'failed draft creation cannot enter an unsaved practice');
  await page.evaluate(() => { Storage.prototype.setItem = window.collectionOriginalSetItem; });
  await page.getByRole('button', { name: '重试', exact: true }).click(); await page.locator('.test-session-header').waitFor();
  const after = await draft(page, 'guest', 'wrongWords', 'spelling');
  check(after.id !== before.id && after.answers.length === 0, 'explicit retry creates the requested fresh draft after storage recovers');

  // Hold the real lazy page code; do not synthesize data or weaken preparation.
  for (const accountChange of [false, true]) {
    const p = await open({ flashcards_wrong_words: [1, 2], flashcards_learned_words: [1, 2], flashcards_progress_owner: 'guest' });
    await p.getByRole('button', { name: '通知', exact: true }).click();
    await p.getByRole('button', { name: '定向练习', exact: true }).click(); await p.locator('[aria-label="定向练习模式"]').waitFor();
    let release, seen;
    const held = new Promise(resolve => { release = resolve; });
    const requested = new Promise(resolve => { seen = resolve; });
    await p.route('**/assets/LearningView-*.js', async route => { seen(); await held; await route.continue().catch(() => {}); });
    try {
      await modeCard(p, 'spelling').click();
      let timeout;
      try {
        await Promise.race([requested, new Promise((_, reject) => {
          timeout = setTimeout(() => reject(new Error('Learning page request did not arrive')), 15000);
        })]);
      } finally { clearTimeout(timeout); }
      if (accountChange) {
        await site.fixture.addUser(99, 'student'); await login(p, 99);
      } else {
        await f.side(p, '今日计划').click(); await p.locator('.study-dashboard').waitFor();
      }
      release(); await p.unroute('**/assets/LearningView-*.js');
      await p.waitForLoadState('networkidle');
      const positions = await p.evaluate(async () => { for (let i = 0; i < 3; i++) await new Promise(r => requestAnimationFrame(r)); return document.querySelector('.test-session-header') === null; });
      check(positions, `${accountChange ? 'account change' : 'leaving the page'} invalidates a late preparation result`);
      check(await draft(p, 'guest', 'wrongWords', 'spelling') === null, 'cancelled preparation writes no guest draft');
      if (accountChange) check(await draft(p, '99', 'wrongWords', 'spelling') === null, 'late guest preparation writes no next-account draft');
    } finally { release(); }
  }
}
