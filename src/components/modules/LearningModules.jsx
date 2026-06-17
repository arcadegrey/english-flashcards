import { BaseCard, ModuleCard, StatCard, StatusCard } from '../ui/Cards'

const UI_ASSETS = {
  hero: '/images/ui-assets/hero-flashcards.png',
  review: '/images/ui-assets/review-complete.png',
  newWords: '/images/ui-assets/new-words.png',
  flame: '/images/ui-assets/stat-flame.png',
  target: '/images/ui-assets/stat-target.png',
  star: '/images/ui-assets/stat-star.png',
}

export function VocabularyModule(props) {
  return <ModuleCard iconSrc={UI_ASSETS.newWords} artSrc={UI_ASSETS.newWords} {...props} />
}

export function ReadingModule(props) {
  return <ModuleCard iconSrc={UI_ASSETS.hero} artSrc={UI_ASSETS.hero} {...props} />
}

export function ReviewModule(props) {
  return <ModuleCard iconSrc={UI_ASSETS.review} artSrc={UI_ASSETS.review} {...props} />
}

export function TestModule(props) {
  return <ModuleCard iconSrc={UI_ASSETS.target} artSrc={UI_ASSETS.target} {...props} />
}

export function StatsRow({ streak, target, remaining }) {
  return (
    <BaseCard className="ds-stat-row">
      <StatCard iconSrc={UI_ASSETS.flame} value={streak} label="连续打卡" />
      <StatCard iconSrc={UI_ASSETS.target} value={target} label="今日目标" />
      <StatCard iconSrc={UI_ASSETS.star} value={remaining} label="剩余词汇" />
    </BaseCard>
  )
}

export function MotivationBand() {
  return (
    <section className="ds-motivation-band">
      <span className="ds-stat-icon" aria-hidden="true">🎯</span>
      <div>
        <h3>坚持每天进步一点点</h3>
        <p>积累现在，收获未来</p>
      </div>
      <span className="ds-module-art" aria-hidden="true">📈</span>
    </section>
  )
}

export function PlanStatusCards({
  reviewComplete,
  reviewCount,
  newWordProgress,
  newWordTarget,
  wordCount,
  onReview,
  onWords,
}) {
  const progress = Math.round((Math.min(newWordProgress, newWordTarget) / newWordTarget) * 100)

  return (
    <div className="ds-status-grid">
      <StatusCard
        label="复习"
        title={reviewComplete ? '到期词已清空' : `${reviewCount} 个词到期`}
        meta={reviewComplete ? '保持节奏' : '优先完成'}
        icon="✅"
        illustrationSrc={UI_ASSETS.review}
        actionLabel={reviewComplete ? '已完成' : '开始复习'}
        onAction={onReview}
      />
      <StatusCard
        label="新词"
        title={`${newWordProgress} / ${newWordTarget} 个`}
        meta={`${wordCount} 词可学`}
        icon="✨"
        illustrationSrc={UI_ASSETS.newWords}
        progress={progress}
        actionLabel="调整计划"
        onAction={onWords}
      />
    </div>
  )
}
