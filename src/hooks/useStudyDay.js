import { useSyncExternalStore } from 'react';
import { getStudyDateKey, shiftStudyDate, studyDayStart } from '../../shared/studyDate.js';

export const subscribeStudyDay = notify => {
  let timer;
  const refresh = () => {
    clearTimeout(timer);
    notify();
    const tomorrow = studyDayStart(shiftStudyDate(getStudyDateKey(), 1));
    timer = setTimeout(refresh, Math.max(1, Date.parse(tomorrow) - Date.now()));
  };
  refresh();
  window.addEventListener('focus', refresh);
  document.addEventListener('visibilitychange', refresh);
  return () => {
    clearTimeout(timer);
    window.removeEventListener('focus', refresh);
    document.removeEventListener('visibilitychange', refresh);
  };
};
export const useStudyDay = () => useSyncExternalStore(subscribeStudyDay, getStudyDateKey, getStudyDateKey);
