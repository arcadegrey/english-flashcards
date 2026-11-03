export async function checkCollectionAccounts(f, site) {
  const { open, login, check, side, start, answer, finish, draft, histories, modeCard } = f;
  await site.fixture.addUser(10, 'student'); await site.fixture.addUser(11, 'student');
  await site.fixture.api(10, '/progress', 'PUT', { progress: { wrongWords: [1, 2, 3, 4], learnedWords: [1, 2, 3, 4],
    preferences: { studyPlanCategory: 'toefl', updatedAt: new Date().toISOString() } } });
  await site.fixture.api(11, '/progress', 'PUT', { progress: { wrongWords: [8, 9], learnedWords: [8, 9] } });
  const page = await open(); await login(page, 10);
  await page.getByRole('button', { name: '通知', exact: true }).click(); await page.locator('.collection-page-flow').waitFor();
  await page.getByRole('button', { name: '定向练习', exact: true }).click(); await page.locator('[aria-label="定向练习模式"]').waitFor();
  await start(page, 'quiz'); await page.context().setOffline(true); await answer(page, 'quiz');
  const pendingDraft = await draft(page, '10', 'wrongWords', 'quiz'); await finish(page);
  check((await histories(page, '10')).pending.includes(pendingDraft.id), 'offline account grade remains queued in its own account');
  check((await site.fixture.api(10, '/exam-attempts')).body.attempts.length === 0, 'offline grade is not prematurely visible on the server');
  const day = await page.evaluate(() => JSON.parse(localStorage.getItem('flashcards_study_history')).at(-1));
  check(day.examQuestionsAnswered === 1 && !day.examByCategory?.toefl, 'mixed collection answers do not count as the unrelated TOEFL plan');
  await page.context().setOffline(false);
  await page.waitForFunction(id => !JSON.parse(localStorage.getItem('flashcards_exam_attempts:10')).pending.includes(id), pendingDraft.id);
  const cloud = (await site.fixture.api(10, '/exam-attempts')).body.attempts.find(item => item.id === pendingDraft.id);
  check(cloud?.focus.key === pendingDraft.focus.key && cloud.focus.source === 'wrongWords', 'reconnect uploads canonical grades with collection provenance');
  const independent = await open(); await login(independent, 10);
  await side(independent, '测试').click(); await independent.locator('[aria-label="我的测试成绩"]').waitFor();
  await independent.locator('summary').filter({ hasText: '错题本定向' }).waitFor();
  check(true, 'an independently authenticated client restores the labeled grade');
  check(await page.evaluate(async () => (await fetch('/api/auth/me')).status === 200), 'independent login preserves the original account session');
  await page.getByRole('button', { name: '打开模式菜单', exact: true }).click();
  await page.getByRole('menuitem', { name: '拼写', exact: true }).click();
  await page.locator('.spelling-refresh-card').waitFor(); await answer(page, 'spelling');
  const ownDraft = await draft(page, '10', 'wrongWords', 'spelling');
  await page.locator('.ds-user-chip').click(); await page.getByRole('button', { name: '退出当前设备', exact: true }).click();
  await page.getByRole('textbox', { name: '邮箱地址', exact: true }).waitFor();
  await page.getByRole('dialog').getByRole('button', { name: '关闭登录弹窗', exact: true }).click();
  await login(page, 11);
  await page.getByRole('button', { name: '通知', exact: true }).click(); await page.locator('.collection-page-flow').waitFor();
  await page.getByRole('button', { name: '定向练习', exact: true }).click(); await page.locator('[aria-label="定向练习模式"]').waitFor();
  check(!(await modeCard(page, 'spelling').innerText()).includes('继续草稿'), 'switching accounts does not display the former account draft');
  check((await draft(page, '10', 'wrongWords', 'spelling')).id === ownDraft.id, 'account switching preserves the former account draft on disk');
  check((await histories(page, '11')).attempts.length === 0, 'the new account does not inherit the former account grades');
  await page.evaluate(key => window.dispatchEvent(new PopStateEvent('popstate', { state: {
    __appNavigation: 'english_flashcards_navigation_v1', view: 'collectionAssessment', mode: 'spelling',
    collectionRoute: { owner: '10', source: 'wrongWords', key },
  } })), ownDraft.focus.key);
  await page.getByRole('alert').filter({ hasText: '账号已变化' }).waitFor();
  check(await page.locator('.test-session-header').count() === 0, 'restoring an old-account history entry cannot expose its questions or draft');
}
