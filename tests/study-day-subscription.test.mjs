import test from 'node:test';
import assert from 'node:assert/strict';
import { subscribeStudyDay } from '../src/hooks/useStudyDay.js';
import { getStudyDateKey } from '../shared/studyDate.js';

test('open pages refresh at Beijing midnight and on resume, and stop notifications after cleanup', context => {
  const previousWindow = globalThis.window, previousDocument = globalThis.document;
  globalThis.window = new EventTarget(); globalThis.document = new EventTarget();
  context.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: Date.parse('2026-10-25T15:59:59Z') });
  let cleanup;
  try {
    const days = [];
    cleanup = subscribeStudyDay(() => days.push(getStudyDateKey()));
    assert.deepEqual(days, ['2026-10-25']);
    context.mock.timers.tick(1000);
    assert.deepEqual(days, ['2026-10-25', '2026-10-26']);
    window.dispatchEvent(new Event('focus'));
    document.dispatchEvent(new Event('visibilitychange'));
    assert.equal(days.length, 4);
    cleanup(); cleanup = null;
    context.mock.timers.tick(86400000);
    window.dispatchEvent(new Event('focus'));
    assert.equal(days.length, 4);
  } finally {
    cleanup?.(); context.mock.timers.reset();
    if (previousWindow === undefined) delete globalThis.window; else globalThis.window = previousWindow;
    if (previousDocument === undefined) delete globalThis.document; else globalThis.document = previousDocument;
  }
});
