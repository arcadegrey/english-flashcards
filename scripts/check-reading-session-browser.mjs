import { mkdir, writeFile } from 'node:fs/promises';
import { startAccountAuditServer } from './lib/account-audit-server.mjs';

// Real pages/Worker with disposable accounts. The speech platform is held open
// deterministically; this checks playback ownership, not pronunciation quality.
export async function checkReadingSession(browser, { artifacts = 'output/browser-ci' } = {}) {
  await mkdir(artifacts, { recursive: true });
  const site = await startAccountAuditServer(), contexts = [], results = [], errors = [];
  const check = (condition, name) => { if (!condition) throw new Error(name); results.push(name); };
  const open = async () => {
    const context = await browser.newContext({ serviceWorkers: 'block', reducedMotion: 'reduce', viewport: { width: 1440, height: 1000 } });
    contexts.push(context);
    await context.route('**/*', route => new URL(route.request().url()).origin === site.url ? route.continue() : route.abort());
    await context.addInitScript(() => {
      window.readingSpeech = [];
      window.SpeechSynthesisUtterance = class {
        constructor(text) { this.text = text; }
      };
      Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
        getVoices: () => [{ name: 'Audit English', lang: 'en-US' }],
        speak(utterance) { window.readingSpeech.push(utterance.text); queueMicrotask(() => utterance.onstart?.()); },
        cancel() {}, addEventListener() {}, removeEventListener() {},
      } });
    });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(site.url); await page.locator('.study-dashboard').waitFor();
    return page;
  };
  try {
    const guest = await open();
    await guest.locator('.study-dashboard-task button[data-prepare-reading]').first().click();
    await guest.locator('.reading-session-content').waitFor();
    const save = guest.getByRole('button', { name: '保存本次练习', exact: true });
    check(await save.isDisabled(), 'incomplete reading cannot be saved');
    await guest.getByRole('button', { name: '显示翻译', exact: true }).first().click();
    check(await guest.getByRole('button', { name: '收起翻译', exact: true }).count() === 2, 'article and footer share translation state');
    await guest.getByRole('button', { name: '收起翻译', exact: true }).last().click();
    check(await guest.locator('.reading-session-translation .learn-refresh-example-cn').count() === 0, 'footer hides the article translation');
    const play = guest.locator('.reading-sentence-play').first();
    await play.click();
    await guest.locator('.reading-sentence-play[aria-pressed="true"]').waitFor();
    await guest.waitForFunction(() => window.readingSpeech.length === 1);
    check(true, 'one sentence starts through the shared speech service');
    await play.click();
    check(await guest.locator('.reading-sentence-play[aria-pressed="true"]').count() === 0, 'clicking the active sentence stops playback');
    await play.click();
    await guest.locator('.reading-sentence-play[aria-pressed="true"]').waitFor();
    await guest.locator('.reading-token-highlight').first().click();
    const dialog = guest.getByRole('dialog', { name: '单词详情' });
    await dialog.waitFor();
    check(await guest.locator('.reading-sentence-play[aria-pressed="true"]').count() === 0, 'opening word details stops sentence playback');
    await dialog.getByRole('button', { name: '不认识', exact: true }).click();
    check((await guest.locator('.learn-refresh-toast').innerText()).includes('已加入已学习'), 'word dialog still updates learning state');
    await dialog.getByRole('button', { name: '关闭单词详情' }).click();
    const cards = guest.locator('.reading-question-card');
    await cards.first().locator('.reading-question-option').first().click();
    await guest.reload(); await guest.locator('.study-dashboard').waitFor();
    await guest.locator('.study-dashboard-task button[data-prepare-reading]').first().click();
    await guest.locator('.reading-session-content').waitFor();
    check(await guest.locator('.reading-question-option[aria-pressed="true"]').count() === 1, 'reading draft survives page reload');
    // Choose a wrong first answer using the feedback, so the retry path is exercised.
    const firstOptions = cards.first().locator('.reading-question-option');
    if (await firstOptions.first().evaluate(el => el.classList.contains('is-answer'))) await firstOptions.nth(1).click();
    const questionCount = await cards.count();
    for (let i = 1; i < questionCount; i++) await cards.nth(i).locator('.reading-question-option').first().click();
    check(await save.isEnabled(), 'all answers enable saving');
    await save.click();
    await guest.getByRole('button', { name: '练习已保存', exact: true }).waitFor();
    const original = await guest.evaluate(() => JSON.parse(localStorage.getItem('flashcards_reading_attempts:guest')).attempts[0]);
    check(original.questionsAnswered === questionCount, 'saved history contains all answered questions');
    check(await guest.getByRole('button', { name: '练习已保存', exact: true }).isDisabled(), 'saved practice cannot be submitted twice');
    await guest.getByRole('button', { name: '返回列表', exact: true }).click();
    await guest.locator('.reading-review-detail summary').first().click();
    await guest.getByRole('button', { name: /只重做错题/ }).first().click();
    await guest.getByRole('button', { name: '保存错题练习', exact: true }).waitFor();
    for (const card of await guest.locator('.reading-question-card').all()) await card.locator('.reading-question-option').first().click();
    await guest.getByRole('button', { name: '保存错题练习', exact: true }).click();
    await guest.getByRole('button', { name: '练习已保存', exact: true }).waitFor();
    const attempts = await guest.evaluate(() => JSON.parse(localStorage.getItem('flashcards_reading_attempts:guest')).attempts);
    check(attempts.some(item => item.parentId === original.id), 'retry saves a separate child attempt');
    check(JSON.stringify(attempts.find(item => item.id === original.id)) === JSON.stringify(original), 'retry preserves the original score and answers');
    for (const width of [320, 390, 1440]) {
      await guest.setViewportSize({ width, height: 900 });
      check(await guest.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `reading fits ${width}px`);
    }

    await site.fixture.addUser(1, 'teacher'); await site.fixture.addUser(2, 'student');
    const classroom = (await site.fixture.api(1, '/classes', 'POST', { name: 'Reading regression' })).body.classroom;
    await site.fixture.api(2, '/classes/join', 'POST', { inviteCode: classroom.inviteCode });
    const published = await site.fixture.api(1, `/classes/${classroom.id}/assignments`, 'POST', {
      articleId: 13, dueAt: new Date(Date.now() + 86400000).toISOString(),
    });
    check(published.status === 201, 'real Worker publishes a reading assignment');
    await site.seedCode('user2@example.test', 'login');
    const student = await open();
    await student.locator('.ds-user-chip').click();
    await student.getByRole('button', { name: '使用验证码登录', exact: true }).click();
    const form = student.getByRole('form', { name: '验证码登录', exact: true });
    await form.getByRole('textbox', { name: '邮箱地址' }).fill('user2@example.test');
    await form.getByRole('textbox', { name: '验证码', exact: true }).fill('123456');
    await form.getByRole('button', { name: '验证码登录', exact: true }).click();
    await student.getByRole('dialog').waitFor({ state: 'hidden' });
    await student.getByRole('button', { name: '进入作业', exact: true }).click();
    await student.locator('.reading-session-content').waitFor();
    await student.waitForFunction(() => !document.querySelector('.reading-save-status')?.textContent.includes('正在恢复'));
    const task = (await site.fixture.api(2, '/assignments')).body.assignments[0];
    const taskCards = student.locator('.reading-question-card');
    for (let i = 0; i < task.article.questions.length; i++) {
      const options = taskCards.nth(i).locator('.reading-question-option');
      await options.filter({ has: student.locator('.reading-question-option-key', { hasText: task.article.questions[i].answer }) }).click();
    }
    await student.getByRole('button', { name: '提交阅读作业', exact: true }).click();
    await student.getByRole('button', { name: '作业已提交', exact: true }).waitFor();
    const submitted = (await site.fixture.api(2, '/assignments')).body.assignments[0];
    check(submitted.questionsCorrect === task.article.questions.length, 'assignment submission retains server grading');
    check(await taskCards.locator('.reading-question-option:enabled').count() === 0, 'submitted assignment locks all answers');
    await student.getByRole('button', { name: '返回列表', exact: true }).click();
    await student.getByRole('button', { name: '查看作业结果', exact: true }).click();
    await student.getByRole('button', { name: '作业已提交', exact: true }).waitFor();
    check(await student.locator('.reading-question-option[aria-pressed="true"]').count() === task.article.questions.length, 'reopening restores the submitted answers');
    check(await student.getByRole('button', { name: '作业已提交', exact: true }).isDisabled(), 'reopened assignment preserves the first submission');
    check(errors.length === 0, 'reading flows have no browser page errors');
    const report = { passed: results.length, results };
    await writeFile(`${artifacts}/reading-session-results.json`, JSON.stringify(report, null, 2));
    return report;
  } finally {
    for (const [index, context] of contexts.entries()) {
      await context.pages()[0]?.screenshot({ path: `${artifacts}/reading-session-${index}.png`, fullPage: true }).catch(() => {});
      await context.close();
    }
    await site.close();
  }
}
