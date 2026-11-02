import { mkdir, writeFile } from 'node:fs/promises';
import { startAccountAuditServer } from './lib/account-audit-server.mjs';

export async function checkPasswordAuth(browser, { artifacts = 'output/browser-ci' } = {}) {
  await mkdir(artifacts, { recursive: true });
  const site = await startAccountAuditServer(), contexts = [], results = [], errors = [];
  const password = 'An original study passphrase', updated = 'Study8Ok';
  const check = (condition, name) => { if (!condition) throw new Error(name); results.push(name); };
  const request = (page, route, body) => page.evaluate(async ({ route, body }) => {
    const response = await fetch(`/api${route}`, { method: body ? 'POST' : 'GET',
      headers: body ? { 'content-type': 'application/json' } : {}, body: body && JSON.stringify(body) });
    return { status: response.status, body: await response.json() };
  }, { route, body });
  const open = async () => {
    const context = await browser.newContext({ serviceWorkers: 'block', reducedMotion: 'reduce', viewport: { width: 1440, height: 1000 } });
    contexts.push(context);
    await context.tracing.start({ screenshots: true, snapshots: true });
    await context.route('**/*', route => new URL(route.request().url()).origin === site.url ? route.continue() : route.abort());
    const page = await context.newPage(); page.on('pageerror', error => errors.push(error.message));
    await page.goto(site.url); await page.locator('.study-dashboard').waitFor();
    await page.locator('.ds-user-chip').click();
    await page.getByRole('form', { name: '密码登录', exact: true }).waitFor();
    return page;
  };
  const submitLogin = async (page, email, value) => {
    const form = page.getByRole('form', { name: '密码登录', exact: true });
    await form.getByRole('textbox', { name: '邮箱地址' }).fill(email);
    await form.getByLabel('密码', { exact: true }).fill(value);
    const response = page.waitForResponse(r => r.url().endsWith('/api/auth/password/login'));
    await form.getByRole('button', { name: '密码登录', exact: true }).click();
    return response;
  };
  const waitSignedIn = async page => {
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    await page.waitForFunction(() => Boolean(JSON.parse(localStorage.getItem('flashcards_auth_session') || 'null')?.user?.id));
  };
  try {
    const a = await open();
    check(await a.getByLabel('密码', { exact: true }).getAttribute('type') === 'password', 'password login is the default and starts masked');
    await a.getByRole('textbox', { name: '邮箱地址' }).fill('fresh@example.test');
    await a.getByLabel('密码', { exact: true }).fill(password);
    await a.getByRole('button', { name: '显示密码', exact: true }).click();
    check(await a.getByLabel('密码', { exact: true }).getAttribute('type') === 'text', 'show password is a real accessible control');
    await a.getByRole('button', { name: '隐藏密码', exact: true }).click();
    const failed = await submitLogin(a, 'fresh@example.test', 'wrong');
    check(failed.status() === 401, 'unknown password account gets generic login failure');
    await a.getByRole('button', { name: '注册', exact: true }).click();
    const register = a.getByRole('form', { name: '验证邮箱并注册' });
    await register.getByRole('textbox', { name: '邮箱地址' }).fill('fresh@example.test');
    await register.getByLabel('新密码', { exact: true }).fill(password);
    await register.getByLabel('确认新密码', { exact: true }).fill(password + ' wrong');
    await register.getByRole('textbox', { name: '验证码', exact: true }).fill('123456');
    await register.getByRole('button', { name: '验证邮箱并注册' }).click();
    check((await register.getByRole('alert').innerText()).includes('不一致'), 'password confirmation rejects a typo before submission');
    await register.getByLabel('确认新密码', { exact: true }).fill(password);
    await register.getByRole('button', { name: '发送验证码', exact: true }).click();
    await register.getByRole('status').waitFor();
    check(site.latestCode('fresh@example.test')?.length === 6, 'registration requests a real purpose-bound Worker email code');
    await register.getByRole('textbox', { name: '验证码', exact: true }).fill(site.latestCode('fresh@example.test'));
    await register.getByRole('button', { name: '验证邮箱并注册' }).click(); await waitSignedIn(a);
    const user = (await request(a, '/auth/me')).body.user;
    check(user.hasPassword === true, 'verified registration creates password credentials and an HTTP-only session');
    check(await a.evaluate(value => !Object.values(localStorage).some(v => v.includes(value)), password), 'plaintext password is absent from localStorage');

    const b = await open(); check((await submitLogin(b, 'fresh@example.test', password)).status() === 200, 'second independent client logs in with password');
    await waitSignedIn(b); check((await request(a, '/auth/me')).status === 200, 'password login preserves another device session');

    // Setting a password on an existing account retains its ID, plan and words.
    await site.fixture.addUser(10, 'student');
    await site.fixture.api(10, '/progress', 'PUT', { progress: { learnedWords: [17], preferences: { dailyNewWordTarget: 40, studyPlanCategory: 'daily', updatedAt: new Date().toISOString() } } });
    const legacy = await open(); await legacy.getByRole('button', { name: '使用验证码登录', exact: true }).click();
    const codeForm = legacy.getByRole('form', { name: '验证码登录', exact: true });
    await site.seedCode('user10@example.test', 'login');
    await codeForm.getByRole('textbox', { name: '邮箱地址' }).fill('user10@example.test');
    await codeForm.getByRole('textbox', { name: '验证码', exact: true }).fill('123456');
    await codeForm.getByRole('button', { name: '验证码登录', exact: true }).click(); await waitSignedIn(legacy);
    await legacy.locator('.ds-user-chip').click(); await legacy.getByRole('button', { name: '设置密码', exact: true }).click();
    const setForm = legacy.getByRole('form', { name: '保存密码', exact: true });
    check(await setForm.getByRole('textbox', { name: '邮箱地址' }).getAttribute('readonly') !== null, 'password setup fixes the email to the authenticated account');
    await setForm.getByRole('button', { name: '发送验证码', exact: true }).click(); await setForm.getByRole('status').waitFor();
    await setForm.getByLabel('新密码', { exact: true }).fill(password);
    await setForm.getByLabel('确认新密码', { exact: true }).fill(password);
    await setForm.getByRole('textbox', { name: '验证码', exact: true }).fill(site.latestCode('user10@example.test'));
    await setForm.getByRole('button', { name: '保存密码', exact: true }).click();
    await legacy.getByRole('button', { name: '修改密码', exact: true }).waitFor();
    const progress = (await request(legacy, '/progress')).body.progress;
    check(progress.learnedWords.includes(17) && progress.preferences.dailyNewWordTarget === 40, 'legacy password setup keeps account data and preferences');
    check((await request(legacy, '/auth/me')).body.user.id === '10', 'password setup preserves the original account ID');
    const profile = await request(legacy, '/classroom/profile', { role: 'student', displayName: 'Updated learner' });
    check(profile.body.user.hasPassword === true, 'profile updates retain password status metadata');

    const recovery = await open(); await recovery.getByRole('button', { name: '忘记密码？', exact: true }).click();
    const resetForm = recovery.getByRole('form', { name: '重置密码', exact: true });
    for (const width of [1440, 390, 320]) {
      await recovery.setViewportSize({ width, height: 900 });
      check(await recovery.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `reset form fits ${width}px`);
      await recovery.screenshot({ path: `${artifacts}/password-reset-${width}.png` });
    }
    await resetForm.getByRole('textbox', { name: '邮箱地址' }).fill('fresh@example.test');
    await resetForm.getByLabel('新密码', { exact: true }).fill(updated);
    await resetForm.getByLabel('确认新密码', { exact: true }).fill(updated);
    await resetForm.getByRole('button', { name: '发送验证码', exact: true }).click(); await resetForm.getByRole('status').waitFor();
    await resetForm.getByRole('textbox', { name: '验证码', exact: true }).fill(site.latestCode('fresh@example.test'));
    await resetForm.getByRole('button', { name: '重置密码', exact: true }).click();
    await recovery.getByRole('form', { name: '密码登录', exact: true }).waitFor();
    check((await request(recovery, '/auth/me')).status === 401, 'reset returns to login without automatic session creation');
    check((await request(a, '/auth/me')).status === 401 && (await request(b, '/auth/me')).status === 401, 'reset revokes both old device sessions');
    check((await request(legacy, '/auth/me')).status === 200, 'reset leaves other accounts authenticated');
    check((await submitLogin(recovery, 'fresh@example.test', password)).status() === 401, 'old password stops working after reset');
    check((await submitLogin(recovery, 'fresh@example.test', updated)).status() === 200, 'new password logs in normally'); await waitSignedIn(recovery);
    check(site.messages.some(message => message.subject.includes('密码已更新') && !message.text.includes(updated)), 'credential changes send a password-free security notification');
    await recovery.setViewportSize({ width: 390, height: 844 });
    await recovery.getByRole('button', { name: '切换到深色模式', exact: true }).click();
    await recovery.getByRole('button', { name: '账号', exact: true }).click();
    check(await recovery.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'dark mobile account surface has no horizontal overflow');
    await recovery.screenshot({ path: `${artifacts}/password-account-dark-mobile.png` });
    check(errors.length === 0, 'password flows have no browser page errors');
    const report = { passed: results.length, results };
    await writeFile(`${artifacts}/password-auth-results.json`, JSON.stringify(report, null, 2));
    return report;
  } finally {
    for (let i = 0; i < contexts.length; i++) {
      await contexts[i].pages()[0]?.screenshot({ path: `${artifacts}/password-auth-context-${i}.png` }).catch(() => {});
      await contexts[i].tracing.stop({ path: `${artifacts}/password-auth-${i}.zip` }).catch(() => {});
      await contexts[i].close();
    }
    await site.close();
  }
}
