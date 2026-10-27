import LoadingState from './ui/LoadingState';
import AppLayout from './layout/AppLayout';
import { ModuleCard } from './ui/Cards';
import categories from '../data/categories';

const CATEGORY_ART = {
  all: '/images/ui-assets/category-all-words-blue-v1.png',
  daily: '/images/ui-assets/category-daily-words-blue-v1.png',
  cet4: '/images/ui-assets/category-cet4-blue-v1.png',
  cet6: '/images/ui-assets/category-cet6-blue-v1.png',
  toefl: '/images/ui-assets/category-toefl-blue-v1.png',
  ielts: '/images/ui-assets/category-ielts-blue-v1.png',
};

const TARGET_OPTIONS = [
  {
    value: 10,
    title: '轻量保持',
    tone: 'green',
  },
  {
    value: 15,
    title: '标准节奏',
    tone: 'blue',
  },
  {
    value: 25,
    title: '冲刺提升',
    tone: 'violet',
  },
  {
    value: 40,
    title: '高强度挑战',
    tone: 'orange',
  },
  {
    value: 70,
    title: '集中备考',
    tone: 'slate',
  },
  {
    value: 100,
    title: '百词冲刺',
    tone: 'amber',
  },
];

function TargetArtwork({ value }) {
  const shapes = {
    10: <><path d="M33 7a25 25 0 1 1-24 18" /><circle cx="14" cy="15" r="4" fill="currentColor" stroke="none" /></>,
    15: <><path d="M57 32A25 25 0 1 0 32 57" /><path d="M45 19a18 18 0 1 0 0 26" /><path d="M39 25a10 10 0 1 0 0 14" /></>,
    25: <><path d="m9 30 23-23 23 23" /><path d="m9 53 23-23 23 23" /></>,
    40: <path d="M38 5 12 35h18l-5 24 27-33H34Z" />,
    70: <><path d="M10 59V40h9v19M28 59V27h9v32M46 59V13h9v46" /><path d="m47 1 5 5-5 5-5-5Z" /></>,
    100: <><path d="M34 4c3 14-17 19-15 33-5-3-6-7-6-7-11 17-3 30 17 31 22 1 30-18 19-32-1 6-5 9-7 10C46 23 42 13 34 4Z" /><path className="plan-target-flame-inner" d="M32 32c1 10-10 13-9 21 0 6 4 9 9 9s11-5 10-11c-1-7-7-9-10-19Z" /></>,
  };

  return (
    <svg className="plan-target-artwork" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      {shapes[value]}
    </svg>
  );
}

function PlanSettingsView({
  navItems = [],
  topbarProps = {},
  dailyTarget = 15,
  todayWordsLearned = 0,
  wordCount = 0,
  selectedCategory = 'all',
  onSelectCategory,
  isPreparing = false,
  preparationError = '',
  onSelectDailyTarget,
  onBack,
  onStartLearning,
}) {
  const progress = Math.min(100, Math.round((Math.min(todayWordsLearned, dailyTarget) / dailyTarget) * 100));
  const categoryName = categories.find((item) => item.id === selectedCategory)?.name || '全部单词';

  return (
    <AppLayout
      active="plan"
      navItems={navItems}
      title="调整计划"
      subtitle="选择学习词库和每日词数，新词学习与测试都跟随计划。"
      topbarProps={topbarProps}
    >
      <div className="plan-settings-page ds-stack">
        <section className="plan-settings-card ds-card" aria-label="计划词库设置">
          <div className="exam-section-head">
            <div>
              <h3>学习词库</h3>
              <p>选择后自动保存，新词学习和测试只使用这个类别的单词。</p>
            </div>
            <span className="exam-section-pill">当前词库 · {categoryName}</span>
          </div>
          <div className="plan-category-grid" role="group" aria-label="选择计划词库">
            {categories.map((category) => (
              <ModuleCard
                key={category.id}
                title={category.name}
                artSrc={CATEGORY_ART[category.id]}
                variant="category"
                active={category.id === selectedCategory}
                aria-pressed={category.id === selectedCategory}
                onClick={() => onSelectCategory?.(category.id)}
              />
            ))}
          </div>
          {preparationError && (
            <div className="exam-section-actions exam-preparation-feedback" role="alert">
              <span className="exam-empty-note">{preparationError}</span>
              <button type="button" className="exam-back-button" onClick={onStartLearning}>重试</button>
            </div>
          )}
        </section>
        <section className="plan-settings-card plan-settings-card--targets ds-card" aria-label="今日学习计划设置">
          <div className="exam-section-head">
            <div>
              <h3>每日新词目标</h3>
              <p>选择适合自己的学习节奏，选择后自动保存。</p>
            </div>
            <div className="exam-section-tools">
              <span className="exam-section-pill">当前目标 · {dailyTarget} 个</span>
              <div className="exam-section-actions" aria-label="计划操作">
                <button type="button" className="exam-back-button" onClick={onBack}>
                  返回今日计划
                </button>
                <button type="button" className="exam-sync-button" onClick={onStartLearning} disabled={isPreparing}>
                  {isPreparing ? <LoadingState variant="inline" title="正在准备词库" /> : '去背单词'}
                </button>
              </div>
            </div>
          </div>

          <div className="plan-settings-summary" aria-label="今日目标进度">
            <div>
              <span>今日已学</span>
              <strong>{Math.min(todayWordsLearned, dailyTarget)} / {dailyTarget} 个</strong>
              <small>{categoryName} · {isPreparing ? '正在准备词库' : `${wordCount} 词可学`}</small>
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
                  aria-pressed={isActive}
                  onClick={() => onSelectDailyTarget?.(option.value)}
                >
                  <TargetArtwork value={option.value} />
                  <span className="plan-target-copy">
                    <span>{option.title}</span>
                    <strong>{option.value} 个 / 天</strong>
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
