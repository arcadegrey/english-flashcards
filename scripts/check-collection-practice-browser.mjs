import { mkdir, writeFile } from 'node:fs/promises';
import { startAccountAuditServer } from './lib/account-audit-server.mjs';
import { collectionBrowserFixture, collectionWords } from './lib/collection-practice-browser.mjs';
import { getStudyDateKey } from '../shared/studyDate.js';
import { checkCollectionAccounts } from './check-collection-account-browser.mjs';
import { checkCollectionPreparation } from './check-collection-preparation-browser.mjs';

export async function checkCollectionPractice(browser, { artifacts = 'output/browser-ci' } = {}) {
  await mkdir(artifacts, { recursive: true });
  const site = await startAccountAuditServer(), f = collectionBrowserFixture(browser, site, artifacts);
  const { check, open, side, modeCard, draft, histories, start, answer, finish } = f;
  try {
    const now = Date.now(), ids = Array.from({ length: 13 }, (_, i) => i + 1);
    const progress = Object.fromEntries(ids.map(id => [id, { interval: 6, reps: 2, easeFactor: 2.5,
      lastReviewed: new Date(now - 86400000 * 2).toISOString(), nextReview: new Date(now + (id >= 10 && id <= 12 ? -1 : 30) * 86400000).toISOString() }]));
    const legacy = JSON.stringify({ id: 'ordinary-kept', mode: 'quiz', category: 'all', scope: 'all', startedAt: new Date(now - 1000).toISOString(),
      answers: [{ wordId: '1', word: collectionWords([1])[0].word, meaning: collectionWords([1])[0].meaning, selectedWordId: '1' }] });
    const page = await open({ flashcards_wrong_words: [1, 2, 3, 4, 5, 6], flashcards_learned_words: ids.slice(0, 12),
      flashcards_mastered_words: [13], flashcards_word_progress: progress, flashcards_progress_owner: 'guest',
      flashcards_word_bookmarks: Object.fromEntries([7, 8, 9, 2735].map(id => [id, { saved: true, updatedAt: new Date(now).toISOString() }])),
      'flashcards_exam_draft:guest:quiz:all:all': legacy });
    await page.getByRole('button', { name: '通知', exact: true }).click();
    await page.locator('.collection-page-flow').waitFor();
    await page.getByRole('button', { name: '定向练习', exact: true }).click();
    await page.locator('[aria-label="定向练习模式"]').waitFor();
    check((await page.locator('[aria-label="定向练习词表"]').innerText()).includes('6 词'), 'wrong-word picker captures the current six-word list');
    await start(page, 'quiz'); await answer(page, 'quiz', true);
    const original = await draft(page, 'guest', 'wrongWords', 'quiz');
    check(original.collectionSnapshot.wordIds.join(',') === '1,2,3,4,5,6', 'quiz uses only the captured wrong-word IDs');
    check(original.answers.every(item => original.collectionSnapshot.wordIds.includes(String(item.wordId)) && original.collectionSnapshot.wordIds.includes(String(item.selectedWordId))), 'question and answer-option IDs stay within the collection');
    check(await page.evaluate(() => JSON.parse(localStorage.getItem('flashcards_wrong_words')).length === 5), 'correct answer updates live wrong words without replacing the active scope');
    await page.getByRole('button', { name: '通知', exact: true }).click(); await page.locator('.collection-page-flow').waitFor();
    await page.getByRole('button', { name: '定向练习', exact: true }).click(); await page.locator('[aria-label="定向练习模式"]').waitFor();
    check((await modeCard(page, 'quiz').innerText()).includes('6 词'), 'changed live membership offers the old fixed-scope draft explicitly');
    await start(page, 'quiz');
    check(await page.getByRole('progressbar', { name: '本次答题进度' }).getAttribute('aria-valuenow') === '1', 'continuing resumes the same answered count');
    check((await draft(page, 'guest', 'wrongWords', 'quiz')).id === original.id, 'continuing retains the original practice ID');
    await page.waitForFunction(() => history.state?.view === 'collectionAssessment');
    await page.goBack(); await page.locator('[aria-label="定向练习模式"]').waitFor();
    await page.goForward(); await page.locator('.test-session-header').waitFor();
    check((await draft(page, 'guest', 'wrongWords', 'quiz')).id === original.id
      && await page.getByRole('progressbar', { name: '本次答题进度' }).getAttribute('aria-valuenow') === '1', 'browser back/forward preserves the captured range and draft');
    await page.reload(); await page.locator('.study-dashboard').waitFor();
    await page.getByRole('button', { name: '通知', exact: true }).click();
    await page.getByRole('button', { name: '定向练习', exact: true }).click(); await page.locator('[aria-label="定向练习模式"]').waitFor();
    await start(page, 'quiz');
    check((await draft(page, 'guest', 'wrongWords', 'quiz')).id === original.id, 'reload and normal re-entry restore the collection draft');
    await finish(page);
    check((await histories(page)).attempts.find(item => item.id === original.id).focus.wordCount === 6, 'completed grade retains its original collection scope');
    check(await draft(page, 'guest', 'wrongWords', 'quiz') === null, 'finishing removes only the collection draft');
    await page.getByRole('button', { name: '再练一组', exact: true }).click(); await answer(page, 'quiz', true);
    const second = await draft(page, 'guest', 'wrongWords', 'quiz');
    check(second.id !== original.id && second.focus.key === original.focus.key, 'another round has an independent ID and the same fixed range');
    await page.getByRole('button', { name: '通知', exact: true }).click(); await page.locator('.collection-page-flow').waitFor();
    const currentCount = await page.evaluate(() => JSON.parse(localStorage.getItem('flashcards_wrong_words')).length);
    await page.getByRole('button', { name: '定向练习', exact: true }).click(); await page.locator('[aria-label="定向练习模式"]').waitFor();
    await modeCard(page, 'quiz').locator('..').getByRole('button', { name: '按当前列表重新开始（替换草稿）', exact: true }).click();
    await page.locator('.test-session-header').waitFor();
    const fresh = await draft(page, 'guest', 'wrongWords', 'quiz');
    check(fresh.id !== second.id && fresh.answers.length === 0 && fresh.focus.wordCount === currentCount, 'explicit fresh intent replaces that mode with the newly selected list');
    await answer(page, 'quiz'); await finish(page);
    for (const mode of ['fillblank', 'spelling', 'matching', 'dictation']) {
      await page.locator('.test-session-back').click(); await page.locator('[aria-label="定向练习模式"]').waitFor();
      await start(page, mode); await answer(page, mode);
      const entry = await draft(page, 'guest', 'wrongWords', mode);
      check(entry.answers.every(item => entry.collectionSnapshot.wordIds.includes(String(item.wordId))), `${mode} questions remain inside its captured list`);
      if (mode !== 'spelling' && mode !== 'dictation') check(entry.answers.every(item => entry.collectionSnapshot.wordIds.includes(String(item.selectedWordId))), `${mode} options remain inside the same list`);
      await finish(page);
      check((await histories(page)).attempts.some(item => item.id === entry.id && item.focus.source === 'wrongWords'), `${mode} saves an independently labeled grade`);
    }
    await side(page, '复习').click(); await page.locator('.collection-page-flow').waitFor();
    await page.getByRole('button', { name: '我的收藏', exact: true }).click(); await page.locator('.collection-page-flow').waitFor();
    check((await page.getByRole('button', { name: '定向练习', exact: true }).innerText()).includes('3 词'), 'retired bookmarks remain visible but are excluded from new practice');
    await page.getByRole('button', { name: '搜索', exact: true }).click();
    await page.locator('.collection-search-panel input').fill(collectionWords([7])[0].word);
    await page.getByRole('button', { name: '定向练习', exact: true }).click(); await page.locator('[aria-label="定向练习模式"]').waitFor();
    check(await modeCard(page, 'quiz').isDisabled() && await modeCard(page, 'matching').isDisabled(), 'a one-word filtered list cannot silently borrow quiz or matching options');
    check(await modeCard(page, 'spelling').isEnabled(), 'one-word spelling is still available');
    await start(page, 'spelling'); await answer(page, 'spelling');
    const saved = await draft(page, 'guest', 'savedWords', 'spelling');
    check(saved.collectionSnapshot.wordIds.join(',') === '7', 'search-filtered bookmark practice uses precisely that one ID');
    await finish(page);
    await side(page, '复习').click(); await page.locator('.collection-page-flow').waitFor();
    const reviewState = await page.evaluate(() => ({
      progress: JSON.parse(localStorage.getItem('flashcards_word_progress')),
      ids: [...JSON.parse(localStorage.getItem('flashcards_learned_words')), ...JSON.parse(localStorage.getItem('flashcards_mastered_words'))],
    }));
    const expectedReviewIds = [...new Set(reviewState.ids.map(String))]
      .filter(id => getStudyDateKey(reviewState.progress[id]?.nextReview || '') <= getStudyDateKey()).sort();
    await page.getByRole('button', { name: '定向练习', exact: true }).click(); await page.locator('[aria-label="定向练习模式"]').waitFor();
    await start(page, 'matching'); await answer(page, 'matching');
    const review = await draft(page, 'guest', 'todayReview', 'matching');
    check(review.collectionSnapshot.wordIds.join(',') === expectedReviewIds.join(','), 'today-review practice is restricted to the current due-word snapshot');
    await finish(page);
    check(await page.evaluate(() => localStorage.getItem('flashcards_exam_draft:guest:quiz:all:all')) === legacy, 'all focused modes leave the ordinary draft bytes unchanged');
    await side(page, '测试').click(); await page.locator('.test-mode-grid').waitFor(); await start(page, 'quiz');
    check(await page.getByRole('progressbar', { name: '本次答题进度' }).getAttribute('aria-valuenow') === '1', 'ordinary test still resumes its own existing draft');
    check(!(await page.locator('.test-session-identity').innerText()).includes('定向'), 'ordinary tests do not inherit collection provenance');
    const single = await open({ flashcards_wrong_words: [1], flashcards_learned_words: [1], flashcards_progress_owner: 'guest' });
    await single.getByRole('button', { name: '通知', exact: true }).click();
    await single.getByRole('button', { name: '定向练习', exact: true }).click(); await single.locator('[aria-label="定向练习模式"]').waitFor();
    await start(single, 'spelling');
    await single.locator('.spelling-refresh-input').fill(collectionWords([1])[0].word);
    await single.getByRole('button', { name: '提交答案', exact: true }).click();
    await single.waitForFunction(() => document.querySelector('[aria-label="本次答题进度"]')?.getAttribute('aria-valuenow') === '1');
    await single.getByRole('button', { name: '通知', exact: true }).click(); await single.locator('.collection-empty-state').waitFor();
    check(await single.getByRole('button', { name: '定向练习', exact: true }).isEnabled(), 'an emptied wrong-word list still exposes its unfinished draft');
    await single.getByRole('button', { name: '定向练习', exact: true }).click(); await single.locator('[aria-label="定向练习模式"]').waitFor();
    await start(single, 'spelling');
    check(await single.getByRole('progressbar', { name: '本次答题进度' }).getAttribute('aria-valuenow') === '1', 'empty live membership does not prevent continuing a captured draft');
    const conflict = await open({ flashcards_wrong_words: [1, 2, 3, 4], flashcards_learned_words: [1, 2, 3, 4], flashcards_progress_owner: 'guest' });
    await conflict.getByRole('button', { name: '通知', exact: true }).click();
    await conflict.getByRole('button', { name: '定向练习', exact: true }).click(); await conflict.locator('[aria-label="定向练习模式"]').waitFor();
    await start(conflict, 'spelling'); await answer(conflict, 'spelling');
    const retained = await draft(conflict, 'guest', 'wrongWords', 'spelling');
    await conflict.getByRole('button', { name: '通知', exact: true }).click(); await conflict.locator('.collection-page-flow').waitFor();
    await conflict.getByRole('button', { name: '认识了', exact: true }).click();
    await conflict.getByRole('button', { name: '定向练习', exact: true }).click(); await conflict.locator('[aria-label="定向练习模式"]').waitFor();
    await start(conflict, 'quiz');
    await conflict.getByRole('button', { name: '打开模式菜单', exact: true }).click();
    await conflict.getByRole('menuitem', { name: '拼写', exact: true }).click();
    await conflict.locator('[aria-label="定向练习模式"]').waitFor();
    check((await conflict.getByRole('status').filter({ hasText: '另一份词表草稿' }).count()) === 1, 'changing mode presents an explicit choice for a different pending scope');
    check((await draft(conflict, 'guest', 'wrongWords', 'spelling')).id === retained.id, 'a mode change cannot overwrite another captured draft');
    await start(conflict, 'spelling');
    check(await conflict.getByRole('progressbar', { name: '本次答题进度' }).getAttribute('aria-valuenow') === '1', 'the explicitly chosen older mode draft resumes intact');
    await checkCollectionAccounts(f, site);
    await checkCollectionPreparation(f, site);
    check(f.errors.length === 0, 'focused and ordinary guest flows have no page errors');
    const report = { passed: f.results.length, results: f.results };
    await writeFile(`${artifacts}/collection-practice-results.json`, JSON.stringify(report, null, 2));
    return report;
  } finally { await f.close(); await site.close(); }
}
