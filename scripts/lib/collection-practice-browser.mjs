import catalog from '../../worker/data/assignment-vocabulary.json' with { type: 'json' };
import { EXAM_MODES } from '../../src/components/assessment/examModeOptions.js';
import { collectionDraftKey } from '../../src/utils/collectionPractice.js';

export const collectionWords = ids => ids.map(id => catalog.find(word => String(word.id) === String(id)));
export function collectionBrowserFixture(browser, site, artifacts) {
  const contexts = [], results = [], errors = [];
  const check = (ok, name) => { if (!ok) throw new Error(name); results.push(name); };
  const open = async (seed = {}) => {
    const context = await browser.newContext({ serviceWorkers: 'block', reducedMotion: 'reduce', viewport: { width: 1440, height: 1000 } });
    contexts.push(context); await context.tracing.start({ screenshots: true, snapshots: true });
    await context.route('**/*', route => new URL(route.request().url()).origin === site.url ? route.continue() : route.abort());
    await context.addInitScript(seed => {
      if (localStorage.getItem('collection_browser_fixture')) return;
      Object.entries(seed).forEach(([key, value]) => localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value)));
      localStorage.setItem('collection_browser_fixture', '1');
    }, seed);
    const page = await context.newPage(); page.on('pageerror', error => errors.push(error.message));
    await page.goto(site.url); await page.locator('.study-dashboard').waitFor();
    return page;
  };
  const modeCard = (page, mode) => page.locator('.test-mode-grid .ds-module-card')
    .filter({ has: page.getByRole('heading', { name: EXAM_MODES.find(item => item.id === mode).title, exact: true }) });
  const side = (page, label) => page.locator('.ds-sidebar').getByRole('button', { name: label, exact: true });
  const draft = (page, owner, source, mode) => page.evaluate(key => JSON.parse(localStorage.getItem(key)), collectionDraftKey(owner, source, mode));
  const histories = (page, owner = 'guest') => page.evaluate(owner => JSON.parse(localStorage.getItem(`flashcards_exam_attempts:${owner}`) || '{"attempts":[],"pending":[]}'), owner);
  const start = async (page, mode) => { await modeCard(page, mode).click(); await page.locator('.test-session-header').waitFor(); };
  const answer = async (page, mode, correct = false) => {
    const count = Number(await page.getByRole('progressbar', { name: '本次答题进度' }).getAttribute('aria-valuenow'));
    if (mode === 'quiz') {
      const spelling = await page.locator('.quiz-refresh-word').innerText();
      const word = catalog.find(word => word.word === spelling);
      const options = page.locator('.learn-refresh-quiz-option');
      const index = await options.evaluateAll((buttons, meaning) => buttons.findIndex(button =>
        button.querySelector('.learn-refresh-quiz-option-meaning')?.textContent === meaning), word.meaning);
      if (index < 0) throw new Error(`No canonical option for ${spelling}`);
      await options.nth(correct ? index : index === 0 ? 1 : 0).click();
    } else if (mode === 'fillblank') await page.locator('.learn-refresh-quiz-option').first().click();
    else if (mode === 'spelling') {
      await page.locator('.spelling-refresh-input').fill('wrong-answer');
      await page.getByRole('button', { name: '提交答案', exact: true }).click();
    } else if (mode === 'matching') {
      await page.locator('.matching-refresh-word').first().click();
      await page.locator('.matching-refresh-meaning').first().click();
    } else {
      await page.locator('#dictation-answer').fill('An incorrect answer.');
      await page.getByRole('button', { name: '核对答案', exact: true }).click();
    }
    await page.waitForFunction(expected => document.querySelector('[aria-label="本次答题进度"]')?.getAttribute('aria-valuenow') === String(expected), count + 1);
  };
  const finish = async page => { await page.getByRole('button', { name: '结束本次', exact: true }).click(); await page.getByRole('heading', { name: '本次练习已完成', exact: true }).waitFor(); };
  const login = async (page, id) => {
    await site.seedCode(`user${id}@example.test`, 'login');
    await page.locator('.ds-user-chip').click();
    await page.getByRole('textbox', { name: '邮箱地址', exact: true }).waitFor();
    const toggle = page.getByRole('button', { name: '使用验证码登录', exact: true });
    if (await toggle.count()) await toggle.click();
    const form = page.getByRole('form', { name: '验证码登录', exact: true });
    await form.getByRole('textbox', { name: '邮箱地址' }).fill(`user${id}@example.test`);
    await form.getByRole('textbox', { name: '验证码', exact: true }).fill('123456');
    await form.getByRole('button', { name: '验证码登录', exact: true }).click();
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    await page.waitForFunction(id => localStorage.getItem('flashcards_progress_owner') === String(id), id);
  };
  return { open, check, modeCard, side, draft, histories, start, answer, finish, login, results, errors,
    async close() {
      for (const [i, context] of contexts.entries()) {
        await context.pages()[0]?.screenshot({ path: `${artifacts}/collection-context-${i}.png`, fullPage: true }).catch(() => {});
        await context.tracing.stop({ path: `${artifacts}/collection-context-${i}.zip` }).catch(() => {});
        await context.close();
      }
    } };
}
