import AssetImage from '../ui/AssetImage';
import { BaseCard, ModuleCard, StatCard, StatusCard } from '../ui/Cards'

const UI_ASSETS = {
  hero: '/images/ui-assets/training-hero-flashcards-blue-v1.png',
  review: '/images/ui-assets/training-card-review-blue-v1.png',
  newWords: '/images/ui-assets/training-card-vocabulary-blue-v1.png',
  flame: '/images/ui-assets/stat-flame.png',
  target: '/images/ui-assets/training-card-test-blue-v1.png',
  star: '/images/ui-assets/stat-star.png',
}

export function VocabularyModule(props) {
  return <ModuleCard variant="vocabulary" iconSrc={UI_ASSETS.newWords} artSrc={UI_ASSETS.newWords} {...props} />
}

export function ReadingModule(props) {
  return <ModuleCard variant="reading" iconSrc={UI_ASSETS.hero} artSrc={UI_ASSETS.hero} {...props} />
}

export function ReviewModule(props) {
  return <ModuleCard variant="review" iconSrc={UI_ASSETS.review} artSrc={UI_ASSETS.review} {...props} />
}

export function TestModule(props) {
  return <ModuleCard variant="test" iconSrc={UI_ASSETS.target} artSrc={UI_ASSETS.target} {...props} />
}

export function StatsRow({ streak, target, remaining }) {
  return (
    <BaseCard className="ds-stat-row">
      <div className="ds-stat-row-head">
        <p>Daily Progress</p>
        <h3>今日进度</h3>
      </div>
      <div className="ds-stat-row-items">
        <StatCard iconSrc={UI_ASSETS.flame} value={streak} label="连续打卡" />
        <StatCard iconSrc={UI_ASSETS.target} value={target} label="今日目标" />
        <StatCard iconSrc={UI_ASSETS.star} value={remaining} label="剩余词汇" />
      </div>
    </BaseCard>
  )
}

export function MotivationBand() {
  return (
    <section className="ds-motivation-band">
      <span className="ds-stat-icon" aria-hidden="true">
        <AssetImage className="ds-stat-icon-img" src={UI_ASSETS.target} alt="" loading="lazy" />
      </span>
      <div>
        <h3>坚持每天进步一点点</h3>
        <p>积累现在，收获未来</p>
      </div>
      <AssetImage className="ds-motivation-art-image" src={UI_ASSETS.star} alt="" loading="lazy" aria-hidden="true" />
    </section>
  )
}

export function PlanStatusCards({
  plan,
  reviewComplete,
  reviewCount,
  newWordProgress,
  newWordTarget,
  readingsCompleted = 0,
  examQuestionsAnswered = 0,
  examQuestionsCorrect = 0,
  wordCount,
  categoryName = '全部单词',
  isPreparingWords = false,
  onReview,
  onWords,
  onAdjustPlan,
  onReading,
  onExam,
}) {
  const wordGoal = plan?.tasks.words.goal ?? newWordTarget
  const wordsAvailable = plan?.tasks.words.available ?? wordCount > 0
  const wordsExhausted = plan?.tasks.words.exhausted ?? false
  const progress = wordGoal > 0 ? Math.round((Math.min(newWordProgress, wordGoal) / wordGoal) * 100) : undefined
  const readingComplete = plan?.tasks.reading.complete ?? readingsCompleted > 0
  const readingAvailable = plan?.tasks.reading.available ?? true
  const examAvailable = plan?.tasks.exam.available ?? true
  const examTarget = plan?.tasks.exam.goal ?? 5
  const examProgress = Math.round((Math.min(examQuestionsAnswered, examTarget) / examTarget) * 100)
  const examAccuracy = examQuestionsAnswered > 0
    ? Math.round((examQuestionsCorrect / examQuestionsAnswered) * 100)
    : 0

  return (
    <div className="ds-status-grid">
      <StatusCard
        label="复习"
        title={reviewComplete ? '到期词已清空' : `${reviewCount} 个词到期`}
        meta={reviewComplete ? '保持节奏' : '优先完成'}
        tone={reviewComplete ? 'mint' : 'blue'}
        iconSrc={UI_ASSETS.review}
        illustrationSrc={UI_ASSETS.review}
        actionLabel={reviewComplete ? '已完成' : '开始复习'}
        onAction={onReview}
        onOpen={onReview}
        openLabel="进入今日复习"
      />
      <StatusCard
        label="新词"
        title={!wordsAvailable ? '暂无可学词汇' : wordGoal === 0 ? '当前词库已学完' : `${newWordProgress} / ${wordGoal} 个`}
        meta={isPreparingWords ? `${categoryName} · 正在准备词库` : !wordsAvailable ? `${categoryName} · 调整计划选择可学词库` : plan?.tasks.words.reduced ? `${categoryName} · 剩余新词不足 ${newWordTarget}，按可学数量完成` : `${categoryName} · ${wordCount} 词可学`}
        tone="blue"
        iconSrc={UI_ASSETS.newWords}
        illustrationSrc={UI_ASSETS.newWords}
        progress={progress}
        actionLabel="调整计划"
        onAction={onAdjustPlan}
        onOpen={wordsAvailable && !wordsExhausted ? onWords : undefined}
        openLabel={`开始学习${categoryName}`}
        busy={isPreparingWords}
      />
      <StatusCard
        label="阅读"
        title={readingComplete ? `已完成 ${readingsCompleted} 篇` : readingAvailable ? '完成 1 篇阅读' : '暂无阅读内容'}
        meta={readingComplete ? '今日阅读已打卡' : readingAvailable ? '推荐 3-5 分钟短阅读' : '其他学习任务可以继续'}
        tone="cyan"
        iconSrc={UI_ASSETS.hero}
        illustrationSrc={UI_ASSETS.hero}
        progress={readingComplete ? 100 : 0}
        actionLabel={readingAvailable ? readingComplete ? '继续阅读' : '开始阅读' : undefined}
        onAction={readingAvailable ? onReading : undefined}
        onOpen={readingAvailable ? onReading : undefined}
        openLabel="进入推荐阅读"
      />
      <StatusCard
        label="巩固"
        title={examAvailable ? `${examQuestionsAnswered} / ${examTarget} 题` : '暂无可测词汇'}
        meta={examQuestionsAnswered > 0 ? `${categoryName} · 正确率 ${examAccuracy}%` : examAvailable ? `${categoryName} · 完成 ${examTarget} 题日巩固任务` : '调整计划后可继续巩固'}
        tone="indigo"
        iconSrc={UI_ASSETS.target}
        illustrationSrc={UI_ASSETS.target}
        progress={examProgress}
        actionLabel={examAvailable ? examQuestionsAnswered >= examTarget ? '继续巩固' : '开始练习' : undefined}
        onAction={examAvailable ? onExam : undefined}
        onOpen={examAvailable ? onExam : undefined}
        openLabel={`进入${categoryName}测试`}
      />
    </div>
  )
}
