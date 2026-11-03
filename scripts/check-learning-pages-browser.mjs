import { mkdir, writeFile } from 'node:fs/promises';
import { startDeliveryServer } from './lib/delivery-server.mjs';

export async function checkLearningPages(browser, { artifacts = 'output/browser-ci' } = {}) {
  await mkdir(artifacts, { recursive: true });
  const site = await startDeliveryServer(), results = [], errors = [];
  const context = await browser.newContext({ serviceWorkers: 'block', reducedMotion: 'reduce', viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const check = (condition, name) => { if (!condition) throw new Error(name); results.push(name); };
  const snapshot = () => page.evaluate(() => Object.fromEntries(Object.entries(localStorage).filter(([key]) => /learned|mastered|bookmark|word_progress|study_history|wrong_words/.test(key))));
  const side = label => page.locator('.ds-sidebar').getByRole('button', { name: label, exact: true });
  await context.route('**/*', route => new URL(route.request().url()).origin === site.url ? route.continue() : route.abort());
  await context.addInitScript(() => {
    localStorage.setItem('flashcards_learned_words', '[1,2]');
    localStorage.setItem('flashcards_mastered_words', '[3]');
    localStorage.setItem('flashcards_wrong_words', '[2]');
    localStorage.setItem('flashcards_progress_owner', 'guest');
  });
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.goto(site.url); await page.locator('.study-dashboard').waitFor();
    await page.locator('.study-dashboard-task button[data-prepare-view="learn"]').first().click();
    await page.locator('.learn-refresh-word').waitFor();
    check(await page.getByRole('button', { name: '显示提示', exact: true }).isVisible(), 'new word starts with hints closed');
    await page.getByRole('button', { name: '显示提示', exact: true }).click();
    check(await page.locator('.learn-refresh-expandable').getAttribute('aria-hidden') === 'false', 'hint action opens the current word hints');
    const word = await page.locator('.learn-refresh-word').innerText();
    await page.getByRole('button', { name: '收藏单词', exact: true }).click();
    check(await page.getByRole('button', { name: '取消收藏单词', exact: true }).isVisible(), 'bookmark action updates through the shared provider');
    check(await page.locator('.learn-refresh-word').innerText() === word && await page.locator('.learn-refresh-expandable').getAttribute('aria-hidden') === 'false', 'bookmark rerender preserves the current word and hint state');
    await page.getByRole('button', { name: '不认识', exact: true }).click();
    await page.waitForFunction(() => JSON.parse(localStorage.getItem('flashcards_learned_words')).length === 3);
    check(await page.locator('.learn-refresh-expandable').getAttribute('aria-hidden') === 'true', 'advancing to the next word resets hints');
    check(await page.evaluate(() => JSON.parse(localStorage.getItem('flashcards_study_history')).at(-1).wordsLearned === 1), 'unknown action records one learning event');
    await page.getByRole('button', { name: '认识了', exact: true }).click();
    await page.waitForFunction(() => JSON.parse(localStorage.getItem('flashcards_mastered_words')).length === 2);
    check(await page.evaluate(() => JSON.parse(localStorage.getItem('flashcards_study_history')).at(-1).wordsMastered === 1), 'known action records one recognition event');
    check((await page.locator('.learn-refresh-mobile-progress-pill').innerText()).replace(/\s/g, '').startsWith('3/'), 'both actions advance the study position exactly once');
    for (const width of [320, 390, 430]) {
      await page.setViewportSize({ width, height: 932 });
      check(!await page.locator('.ds-mobile-topbar').isVisible() && !await page.locator('.ds-mobile-bottom-nav').isVisible(), `${width}px study uses dedicated mobile chrome`);
      check(!await page.locator('.learn-refresh-study-aside').isVisible(), `${width}px study hides desktop status`);
      const boxes = await page.locator('.learn-refresh-bottombar .learn-refresh-action').evaluateAll(buttons => buttons.map(button => {
        const r = button.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, right: r.right };
      }));
      check(boxes.length === 3 && boxes.every(b => b.width > 0 && b.x >= 0 && b.right <= width + 1 && Math.abs(b.y - boxes[0].y) < 1), `${width}px retains three horizontal study actions`);
      check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}px study has no horizontal overflow`);
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.getByRole('button', { name: '打开模式菜单', exact: true }).click();
    await page.getByRole('menuitem', { name: '测验', exact: true }).click();
    await page.locator('.test-session-header').waitFor();
    check(await page.getByRole('progressbar', { name: '本次答题进度' }).getAttribute('aria-valuenow') === '0', 'study mode menu starts a real assessment');
    await page.locator('.learn-refresh-quiz-option').first().click();
    await page.waitForFunction(() => document.querySelector('[aria-label="本次答题进度"]')?.getAttribute('aria-valuenow') === '1');
    const draft = await page.evaluate(() => Object.entries(localStorage).find(([key]) => key.startsWith('flashcards_exam_draft:guest:quiz:')));
    check(JSON.parse(draft[1]).answers.length === 1, 'assessment answer is durable in the original draft key');
    await page.getByRole('button', { name: '打开模式菜单', exact: true }).click();
    await page.getByRole('menuitem', { name: '拼写', exact: true }).click();
    await page.locator('.spelling-refresh-card').waitFor();
    await page.getByRole('button', { name: '打开模式菜单', exact: true }).click();
    await page.getByRole('menuitem', { name: '测验', exact: true }).click();
    await page.locator('.quiz-refresh-card').waitFor();
    check(await page.getByRole('progressbar', { name: '本次答题进度' }).getAttribute('aria-valuenow') === '1', 'switching modes and returning resumes the same draft');
    await page.getByRole('button', { name: '结束本次', exact: true }).click();
    await page.getByRole('heading', { name: '本次练习已完成', exact: true }).waitFor();
    check(await page.evaluate(() => JSON.parse(localStorage.getItem('flashcards_exam_attempts:guest')).attempts.at(-1).questionsAnswered === 1), 'finishing saves the original single-answer result');
    await side('训练中心').click(); await page.locator('.training-main-modules').waitFor();
    const beforeBrowsing = await snapshot();
    for (const label of ['托福', '雅思']) {
      await side('单词').click();
      await page.getByRole('button', { name: new RegExp(`预览.*${label}`) }).click();
      await page.getByRole('button', { name: '选择学习范围', exact: true }).click();
      await page.locator('.toefl-selection-page').waitFor();
      const title = await page.locator('.ds-topbar-title h1').innerText();
      await page.locator('.toefl-selection-card').first().click();
      await page.waitForFunction(previous => document.querySelector('.ds-topbar-title h1')?.textContent !== previous, title);
      await page.getByRole('button', { name: '返回上一级', exact: true }).click();
      await page.waitForFunction(previous => document.querySelector('.ds-topbar-title h1')?.textContent === previous, title);
      check(true, `${label} list back returns to its own directory`);
    }
    check(JSON.stringify(await snapshot()) === JSON.stringify(beforeBrowsing), 'browsing both vocabulary directories does not mutate learning data');
    await side('复习').click(); await page.locator('.collection-page-flow').waitFor();
    check(await page.getByRole('heading', { name: '今日复习', exact: true }).count() > 0, 'review route still uses the collection page');
    await page.locator('.collection-tool-button').filter({ hasText: '首页' }).click();
    await page.locator('.study-dashboard').waitFor();
    await page.setViewportSize({ width: 390, height: 932 });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.locator('.ds-mobile-bottom-nav').getByRole('button', { name: /训练/ }).click();
    await page.locator('.training-main-modules').waitFor();
    await page.waitForFunction(() => window.scrollY === 0);
    check(true, 'mobile navigation resets scroll to the top');
    check(errors.length === 0, 'learning and directory flows have no browser page errors');
    const report = { passed: results.length, results };
    await writeFile(`${artifacts}/learning-pages-results.json`, JSON.stringify(report, null, 2));
    return report;
  } finally {
    await page.screenshot({ path: `${artifacts}/learning-pages-final.png`, fullPage: true }).catch(() => {});
    await context.close(); await site.close();
  }
}
