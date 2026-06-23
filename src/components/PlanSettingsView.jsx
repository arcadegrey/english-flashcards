import AppLayout from './layout/AppLayout';

const TARGET_OPTIONS = [
  {
    value: 10,
    title: '轻量保持',
    helper: '适合忙碌日子，先维持连续学习。',
    tone: 'green',
  },
  {
    value: 15,
    title: '标准节奏',
    helper: '默认计划，适合稳定积累新词。',
    tone: 'blue',
  },
  {
    value: 25,
    title: '冲刺提升',
    helper: '适合备考阶段，扩大每日输入。',
    tone: 'violet',
  },
  {
    value: 40,
    title: '高强度挑战',
    helper: '适合短期集中刷词，需要更多复习时间。',
    tone: 'orange',
  },
];

function TargetIcon({ value }) {
  return (
    <>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21a9 9 0 1 0-9-9 9 9 0 0 0 9 9Z" />
        <path d="M12 17a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z" />
        <path d="M12 13.5a1.5 1.5 0 1 0-1.5-1.5 1.5 1.5 0 0 0 1.5 1.5Z" />
      </svg>
      <b>{value}</b>
    </>
  );
}

function PlanSettingsView({
  navItems = [],
  topbarProps = {},
  dailyTarget = 15,
  todayWordsLearned = 0,
  wordCount = 0,
  onSelectDailyTarget,
  onBack,
  onStartLearning,
}) {
  const progress = Math.min(100, Math.round((Math.min(todayWordsLearned, dailyTarget) / dailyTarget) * 100));

  return (
    <AppLayout
      active="plan"
      navItems={navItems}
      title="调整计划"
      subtitle="设置今天的新词节奏，让计划真的跟着你走。"
      topbarProps={topbarProps}
    >
      <div className="plan-settings-page ds-stack">
        <section className="plan-settings-card ds-card" aria-label="今日学习计划设置">
          <div className="exam-section-head">
            <div>
              <h3>每日新词目标</h3>
              <p>目标会影响今日计划卡、训练中心 Daily Progress 和学习优先级提示。</p>
            </div>
            <div className="exam-section-tools">
              <span className="exam-section-pill">当前目标 · {dailyTarget} 个</span>
              <div className="exam-section-actions" aria-label="计划操作">
                <button type="button" className="exam-back-button" onClick={onBack}>
                  返回今日计划
                </button>
                <button type="button" className="exam-sync-button" onClick={onStartLearning}>
                  去背单词
                </button>
              </div>
            </div>
          </div>

          <div className="plan-settings-summary" aria-label="今日目标进度">
            <div>
              <span>今日已学</span>
              <strong>{Math.min(todayWordsLearned, dailyTarget)} / {dailyTarget} 个</strong>
              <small>{wordCount} 词可学</small>
            </div>
            <div className="plan-settings-progress" aria-hidden="true">
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="plan-target-grid">
            {TARGET_OPTIONS.map((option) => {
              const isActive = option.value === dailyTarget;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`plan-target-option is-${option.tone} ${isActive ? 'is-active' : ''}`}
                  onClick={() => onSelectDailyTarget?.(option.value)}
                >
                  <span className="plan-target-icon" aria-hidden="true">
                    <TargetIcon value={option.value} />
                  </span>
                  <span className="plan-target-copy">
                    <span>{option.title}</span>
                    <strong>{option.value} 个 / 天</strong>
                    <small>{option.helper}</small>
                  </span>
                  <span className="plan-target-check" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="m6 12 4 4 8-8" />
                    </svg>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

export default PlanSettingsView;
