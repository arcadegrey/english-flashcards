import { useStudyDay } from '../hooks/useStudyDay.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BaseCard } from './ui/Cards';
import { LinearProgress } from './ui/Progress';
import CorrectAnswerCelebration from './CorrectAnswerCelebration';
import { availableStudyRewards, studyRewardProgress } from '../../shared/studyRewards.js';
import '../styles/study-momentum.css';

export default function StudyMomentum({ ownerId, history, wordsDone, readingDone, examDone, allDone, ready = true }) {
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
  return <BaseCard className="study-momentum" aria-label="每周目标与连续学习里程碑">
    <CorrectAnswerCelebration trigger={trigger} />
    <div className="study-momentum-head"><div><span className="study-momentum-label">每周小目标</span><h2>本周学习 {progress.activeDays} / {progress.targetDays} 天</h2><p>新词、复习、阅读或测试，完成任一学习活动就算一天。</p></div><img src="/images/ui-assets/stat-star.png" alt="" /></div>
    <LinearProgress value={Math.min(100, progress.activeDays / progress.targetDays * 100)} />
    <ol className="study-momentum-days" aria-label="本周学习日">{progress.days.map((day, index) => <li key={day.date} className={day.active ? 'is-active' : ''} aria-current={day.today ? 'date' : undefined}><span>{['一', '二', '三', '四', '五', '六', '日'][index]}</span><strong aria-label={`${day.date} ${day.active ? '已学习' : '暂无学习记录'}`}>{day.active ? '✓' : '·'}</strong></li>)}</ol>
    <p className="study-momentum-milestone">连续学习 <strong>{progress.streak} 天</strong>{progress.milestone ? ` · 已达成 ${progress.milestone} 天里程碑` : ''}{progress.nextMilestone ? ` · 距 ${progress.nextMilestone} 天里程碑还有 ${progress.nextMilestone - progress.streak} 天` : ' · 保持你的学习节奏'}</p>
    {notice && <div className="study-momentum-notice" role="status"><span>{notice}</span><button type="button" aria-label="关闭完成提醒" onClick={() => setNotice('')}>关闭</button></div>}
  </BaseCard>;
}
