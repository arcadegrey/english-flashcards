import AssetImage from '../ui/AssetImage';
import { useId, useMemo, useState } from 'react';
import { useStudyDay } from '../../hooks/useStudyDay';
import { BaseCard } from '../ui/Cards';
import { PrimaryButton } from '../ui/Buttons';
import { buildWeeklyLearningView, formatStudyMonthDay } from '../../utils/weeklyLearning';
import { formatStudyMinutes } from '../../utils/studyDashboard';
import '../../styles/weekly-learning.css';

function Check() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 10 3 3 7-7" /></svg>;
}

export default function WeeklyLearningOverview({ history = [], ready = true, authUser, onAuthOpen }) {
  const today = useStudyDay();
  const [selectedDate, setSelectedDate] = useState(null);
  const gradientId = useId();
  const headingId = useId();
  const detailId = useId();
  const view = useMemo(() => buildWeeklyLearningView(history, new Date(`${today}T12:00:00+08:00`)), [history, today]);
  const selected = view.days.find(day => day.date === selectedDate && !day.future) || view.days.find(day => day.today);
  const record = selected.record;
  const metrics = [
    { id: 'words', label: '词汇训练', value: record.wordsLearned + record.wordsMastered, unit: '词次',
      helper: `学习 ${record.wordsLearned} · 认识 ${record.wordsMastered}`, art: 'training-card-vocabulary-blue-v1.png', tone: 'blue' },
    { id: 'reading', label: '阅读完成', value: record.readingsCompleted, unit: '篇',
      helper: `阅读答题 ${record.readingQuestionsAnswered} 题`, art: 'training-card-reading-blue-v1.png', tone: 'violet' },
    { id: 'exam', label: '巩固练习', value: record.examQuestionsAnswered, unit: '题',
      helper: record.examQuestionsAnswered ? `正确率 ${Math.round(record.examQuestionsCorrect / record.examQuestionsAnswered * 100)}%` : '暂无答题记录', art: 'training-card-test-blue-v1.png', tone: 'cyan' },
    { id: 'time', label: '记录时长', value: formatStudyMinutes(record.timeSpent),
      helper: '来自已保存的学习记录', tone: 'orange' },
  ];
  const percent = ready ? view.percent : 0;
  const circumference = 2 * Math.PI * 92;

  return <section className="weekly-learning" aria-labelledby={headingId} aria-busy={!ready}>
    <header className="weekly-learning-heading">
      <div><span className="weekly-learning-kicker">学习习惯</span><h2 id={headingId}>每周学习目标</h2></div>
      <span className="weekly-learning-range">{formatStudyMonthDay(view.range.start)} — {formatStudyMonthDay(view.range.last)}</span>
    </header>

    <div className="weekly-learning-grid">
      <BaseCard className="weekly-goal-card">
        <header className="weekly-panel-head"><h3><span className="weekly-heading-icon"><AssetImage src="/images/ui-assets/stat-target.png" alt="" aria-hidden="true" /></span>本周达成率</h3><span className="weekly-goal-target">目标 {view.targetDays} 天</span></header>
        <div className="weekly-goal-ring" role="img" aria-label={ready ? `本周已学习 ${view.activeDays} 天，目标 ${view.targetDays} 天，达成率 ${view.percent}%` : '正在恢复每周学习记录'}>
          <svg viewBox="0 0 220 220" aria-hidden="true">
            <defs><linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#7EA6FF" /><stop offset="1" stopColor="#2F6DFF" /></linearGradient></defs>
            <circle className="weekly-ring-track" cx="110" cy="110" r="92" />
            <circle className="weekly-ring-fill" cx="110" cy="110" r="92" stroke={`url(#${gradientId})`}
              strokeDasharray={circumference} strokeDashoffset={circumference * (1 - percent / 100)} style={{ opacity: percent > 0 ? 1 : 0 }} />
          </svg>
          <div><strong>{ready ? view.activeDays : '—'}<span>/ {view.targetDays}</span></strong><small>{ready ? '已完成学习天数' : '正在恢复学习记录'}</small></div>
        </div>
        <h3 className="weekly-goal-caption">{ready && view.activeDays >= view.targetDays ? '本周目标已达成' : '一周五天，稳步进步'}</h3>
        <p className="weekly-goal-helper">完成新词、复习、阅读或测试中的任一学习活动，即可点亮当天。</p>
        <div className="weekly-goal-footer"><span>本周学习进度</span><strong>{ready ? `${view.percent}%` : '—'}</strong></div>
        <AssetImage className="weekly-goal-star" src="/images/ui-assets/stat-star.png" alt="" aria-hidden="true" />
      </BaseCard>

      <div className="weekly-learning-records">
        <BaseCard className="weekly-calendar-card">
          <header className="weekly-panel-head"><h3>本周打卡</h3><span>选择日期查看记录</span></header>
          <div className="weekly-calendar" role="group" aria-label="本周日期">
            {view.days.map(day => <button key={day.date} type="button" className={`weekly-calendar-day ${ready && day.active ? 'is-active' : ''}`}
              aria-pressed={day.date === selected.date} aria-current={day.today ? 'date' : undefined} disabled={day.future || !ready}
              aria-label={`${day.date} 周${day.label}${day.today ? ' 今天' : ''}，${!ready ? '正在恢复记录' : day.future ? '尚未到来' : day.active ? '已学习' : '暂无学习记录'}`}
              aria-controls={detailId} onClick={() => setSelectedDate(day.date)}>
              <span className="weekly-calendar-weekday">{day.today ? '今天' : `周${day.label}`}</span><strong>{day.number}</strong>
              <span className="weekly-calendar-status" aria-hidden="true">{ready && day.active ? <Check /> : <i />}</span>
            </button>)}
          </div>
        </BaseCard>

        <BaseCard className="weekly-day-card" id={detailId} aria-label="所选日期学习概览">
          <header className="weekly-panel-head">
            <div><h3>{selected.today ? '今日学习概览' : `${formatStudyMonthDay(selected.date)}学习概览`}</h3><p>{!ready ? '正在恢复学习记录…' : selected.active ? '当天已记录的学习活动' : '当天暂无学习记录'}</p></div>
            <span className={`weekly-day-state ${ready && selected.active ? 'is-active' : ''}`}>{!ready ? '恢复中' : selected.active ? '已学习' : '暂无记录'}</span>
          </header>
          <div className="weekly-day-metrics" aria-live="polite" aria-atomic="true">
            {metrics.map(metric => <article key={metric.id} className={`weekly-day-metric is-${metric.tone}`} data-metric={metric.id}>
              <span className="weekly-metric-icon" aria-hidden="true">{metric.art ? <AssetImage src={`/images/ui-assets/${metric.art}`} alt="" /> : <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" /></svg>}</span>
              <span>{metric.label}</span><strong>{ready ? metric.value : '—'}{metric.unit && ready && <small>{metric.unit}</small>}</strong><p>{ready ? metric.helper : '正在恢复记录'}</p>
            </article>)}
          </div>
        </BaseCard>
      </div>
    </div>

    <div className="weekly-milestone-grid">
      <BaseCard className="weekly-milestone-card"><span className="weekly-milestone-icon is-flame"><AssetImage src="/images/ui-assets/stat-flame.png" alt="" aria-hidden="true" /></span><div><h3>连续学习</h3><strong>{ready ? view.streak : '—'} <small>天</small></strong><p>新词、复习、阅读与巩固均计入</p></div></BaseCard>
      <BaseCard className="weekly-milestone-card"><span className="weekly-milestone-icon is-star"><AssetImage src="/images/ui-assets/stat-star.png" alt="" aria-hidden="true" /></span><div><h3>{view.nextMilestone ? '下一阶段里程碑' : '连续学习里程碑'}</h3>
        <strong>{!ready ? '—' : view.nextMilestone ? `还差 ${view.nextMilestone - view.streak} 天` : `已达成 ${view.milestone} 天`}</strong><p>{!ready ? '正在恢复学习记录' : view.nextMilestone ? `连续学习 ${view.nextMilestone} 天，即可达成` : '继续保持你的学习节奏'}</p></div></BaseCard>
    </div>

    {ready && !authUser?.id && onAuthOpen && <div className="weekly-login-banner"><div><span className="weekly-login-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 17H6a4 4 0 0 1-1-7.87A7 7 0 0 1 18 8a4.5 4.5 0 0 1 0 9h-1M12 12v9m-3-3 3 3 3-3" /></svg></span><div><strong>登录保存学习记录</strong><p>在不同设备上继续查看你的进步。</p></div></div><PrimaryButton onClick={onAuthOpen}>登录 / 注册</PrimaryButton></div>}
  </section>;
}
