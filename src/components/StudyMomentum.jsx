import LoadingState from './ui/LoadingState';
import ScheduledAssetImage from './ui/ScheduledAssetImage.jsx';
import { useStudyDay } from '../hooks/useStudyDay.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BaseCard } from './ui/Cards';
import DeferredCelebration from './DeferredCelebration';
import { availableStudyRewards, studyRewardProgress } from '../../shared/studyRewards.js';
import '../styles/study-momentum.css';

export default function StudyMomentum({ ownerId, history, wordsDone, readingDone, examDone, allDone, ready = true, onOpenDetails }) {
  const [notice, setNotice] = useState('');
  const [trigger, setTrigger] = useState(0);
  const today = useStudyDay();
  const progress = useMemo(() => studyRewardProgress(history, new Date(`${today}T12:00:00+08:00`)), [history, today]);
  const seenInMemory = useRef(new Set());
  useEffect(() => {
    if (!ready) return;
    const key = `flashcards_reward_seen:${ownerId || 'guest'}`;
    let stored = [];
    try { stored = JSON.parse(localStorage.getItem(key) || '[]'); } catch { /* In-memory deduplication still works. */ }
    const seen = new Set([...(Array.isArray(stored) ? stored : []), ...seenInMemory.current]);
    const rewards = availableStudyRewards({ progress, today, wordsDone, readingDone, examDone, allDone });
    const fresh = rewards.filter(reward => !seen.has(reward.key));
    if (!fresh.length) return;
    const timer = setTimeout(() => {
      fresh.forEach(reward => seen.add(reward.key));
      seenInMemory.current = seen;
      try { localStorage.setItem(key, JSON.stringify([...seen].slice(-400))); } catch { /* Rewards never block learning. */ }
      setNotice(fresh.at(-1).text); setTrigger(value => value + 1);
    }, 0);
    return () => clearTimeout(timer);
  }, [ownerId, ready, progress, today, wordsDone, readingDone, examDone, allDone]);
  return <BaseCard className="study-momentum" aria-label="每周学习目标" aria-busy={!ready}>
    <DeferredCelebration trigger={trigger} />
    {!ready && <LoadingState variant="inline" title="正在恢复每周学习记录…" />}
    <div className="study-momentum-summary">
      <div className="study-momentum-head">
        <span className="study-momentum-icon"><ScheduledAssetImage src="/images/ui-assets/stat-target.png" variant="small" fetchPriority="low" alt="" aria-hidden="true" /></span>
        <h2>每周小目标</h2>
        <p>本周 <strong>{ready ? progress.activeDays : '—'}<span> / {progress.targetDays}</span></strong> 天</p>
      </div>
      <div className="study-momentum-body">
        <ol className="study-momentum-days" aria-label="本周学习日">{progress.days.map((day, index) => <li key={day.date} className={ready && day.active ? 'is-active' : ''} aria-current={day.today ? 'date' : undefined}
          aria-label={`${day.date} 周${['一', '二', '三', '四', '五', '六', '日'][index]}${day.today ? '，今天' : ''}，${!ready ? '正在恢复记录' : day.active ? '已学习' : day.date > today ? '尚未到来' : '暂无学习记录'}`}>
          <span aria-hidden="true">{ready && day.active ? <svg viewBox="0 0 16 16"><path d="m4 8 2.5 2.5L12 5" /></svg> : ['一', '二', '三', '四', '五', '六', '日'][index]}</span>
        </li>)}</ol>
        {onOpenDetails && <button type="button" className="study-momentum-details" onClick={onOpenDetails}>查看详情<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m8 5 5 5-5 5" /></svg></button>}
      </div>
    </div>
    {notice && <div className="study-momentum-notice" role="status"><span>{notice}</span><button type="button" aria-label="关闭完成提醒" onClick={() => setNotice('')}>关闭</button></div>}
  </BaseCard>;
}
