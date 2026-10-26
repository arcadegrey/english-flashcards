import { getStudyDateKey, shiftStudyDate, studyWeekRange } from '../../shared/studyDate.js';
import { mergeStudyHistory } from '../../shared/studyHistory.js';

export const DASHBOARD_ART = {
  words: '/images/ui-assets/training-hero-flashcards-blue-v1.png',
  heroWords: '/images/ui-assets/dashboard-flashcards-frosted-v1.png',
  review: '/images/ui-assets/training-card-review-blue-v1.png',
  reading: '/images/ui-assets/training-card-reading-blue-v1.png',
  exam: '/images/ui-assets/training-card-test-blue-v1.png',
  complete: '/images/ui-assets/stat-star.png',
};

export function dashboardGreeting(user, now = new Date()) {
  const hour = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Shanghai', hour: '2-digit', hourCycle: 'h23' }).format(now));
  const greeting = hour < 6 ? '夜深了' : hour < 12 ? '上午好' : hour < 18 ? '下午好' : '晚上好';
  const name = String(user?.displayName || '').trim();
  const emailName = String(user?.email || '').trim().split('@')[0];
  return `${greeting}，${name || emailName || '学习者'}`;
}

export function formatStudyMinutes(value) {
  const minutes = Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0;
  return minutes >= 60 ? `${Number((minutes / 60).toFixed(1))} 小时` : `${Math.round(minutes)} 分钟`;
}

export function dashboardStudyTime(history, now = new Date()) {
  const today = getStudyDateKey(now), first = shiftStudyDate(today, -89);
  const week = studyWeekRange(now).start;
  return mergeStudyHistory([], history).filter(day => day.date >= first && day.date <= today)
    .reduce((result, day) => ({ minutes: result.minutes + day.timeSpent,
      weekMinutes: result.weekMinutes + (day.date >= week ? day.timeSpent : 0) }), { minutes: 0, weekMinutes: 0 });
}

// Presentation only: task eligibility and order still come from buildDailyPlan.
export function buildStudyDeck({ plan, categoryName = '全部单词', remaining = 0, wordCount = 0,
  suggestedReading, planError = '' }) {
  const { words, review, reading, exam } = plan.tasks;
  const ready = plan.priority !== 'preparing';
  const cards = [
    { id: 'words', eyebrow: '当前学习计划', title: categoryName, tone: 'blue', art: DASHBOARD_ART.heroWords,
      meta: `${wordCount} 个词汇 · 今日目标 ${words.goal} 个`,
      description: words.exhausted ? '当前词库已无剩余新词，可以调整计划或复习已学内容。' : `从当前计划继续积累，还有 ${remaining} 个词汇待学习。`,
      progress: words.goal > 0 ? Math.min(100, words.progress / words.goal * 100) : undefined,
      progressLabel: words.reduced && !words.exhausted ? `今日已练 ${words.progress} / ${words.goal} 个 · 剩余词数不足原目标 ${words.requested} 个` : `今日词汇进度 ${words.progress} / ${words.goal} 个`,
      action: !ready ? null : words.available && !words.exhausted ? 'words' : 'settings',
      actionLabel: !ready ? '正在准备词库' : !words.available || words.exhausted ? '调整计划' : words.progress > 0 ? '继续学习' : '开始学习',
      complete: words.complete, available: words.available },
    { id: 'review', eyebrow: '记忆巩固', title: '今日到期复习', tone: 'cyan', art: DASHBOARD_ART.review,
      meta: review.count > 0 ? `${review.count} 个词汇等待复习` : '当前没有到期词汇',
      description: review.count > 0 ? '先巩固到期的词汇，让每次学习留下更长久的记忆。' : '今天的到期复习已经清空，继续按计划积累新词。',
      action: ready ? 'review' : null, actionLabel: review.count > 0 ? '开始复习' : '查看复习', complete: review.complete, available: true },
    { id: 'reading', eyebrow: '推荐阅读', title: suggestedReading?.title || '读一篇英语短文', tone: 'lavender', art: DASHBOARD_ART.reading,
      meta: suggestedReading ? [suggestedReading.examType, suggestedReading.level, suggestedReading.estimatedMinutes ? `约 ${suggestedReading.estimatedMinutes} 分钟` : ''].filter(Boolean).join(' · ') : '从阅读分类中选择适合的文章',
      description: reading.available ? '把词汇放回真实语境，完成阅读与随文练习。' : '当前暂无可用文章，其他学习任务可以继续。',
      progress: reading.available ? reading.complete ? 100 : 0 : undefined,
      progressLabel: reading.available ? `今日已完成 ${reading.completed} 篇阅读` : '暂无阅读内容',
      action: ready && reading.available ? 'reading' : null, actionLabel: reading.complete ? '继续阅读' : '开始阅读', complete: reading.complete, available: reading.available },
    { id: 'exam', eyebrow: '词汇巩固', title: '做一组词汇练习', tone: 'peach', art: DASHBOARD_ART.exam,
      meta: `${categoryName} · 测验、填空、拼写与连线`,
      description: exam.available ? '选择练习范围与题型，检查记忆中还不牢固的部分。' : '当前暂无可测词汇，调整计划后可继续巩固。',
      progress: exam.available ? Math.min(100, exam.answered / exam.goal * 100) : undefined,
      progressLabel: `今日巩固 ${exam.answered} / ${exam.goal} 题${exam.accuracy == null ? '' : ` · 正确率 ${exam.accuracy}%`}`,
      action: ready && exam.available ? 'exam' : null, actionLabel: exam.complete ? '继续巩固' : '开始练习', complete: exam.complete, available: exam.available },
  ];
  if (plan.priority === 'preparing') return [{ id: 'preparing', eyebrow: '今日计划', title: planError ? '计划暂未准备好' : '正在准备今日计划',
    meta: '加载完成后显示当前学习进度', description: planError || '正在恢复词库与学习记录，请稍候。', art: DASHBOARD_ART.heroWords, tone: 'blue',
    action: planError ? 'retry' : null, actionLabel: planError ? '重试' : '正在准备' }];
  if (plan.complete) cards.unshift({ id: 'complete', eyebrow: '今日闭环完成', title: '今天的计划完成了', meta: '每一次练习，都在为明天积累',
    description: '查看今天的学习趋势，也可以继续探索新的词汇和阅读内容。', art: DASHBOARD_ART.complete, tone: 'blue', progress: 100,
    progressLabel: '今日可用任务已完成', action: 'statistics', actionLabel: '查看统计' });
  if (!plan.hasContent && ready) return [{ id: 'empty', eyebrow: '从这里开始', title: '开启今天的学习', meta: '选择适合你的学习内容',
    description: '当前没有可安排的词汇或阅读内容，可以前往训练中心查看。', art: DASHBOARD_ART.heroWords, tone: 'blue', action: 'training', actionLabel: '去训练中心' }];
  return cards;
}

export function carouselPosition(index, active, total) {
  if (total < 2) return 0;
  let distance = (index - active + total) % total;
  if (distance > total / 2) distance -= total;
  return distance;
}

export function carouselDragStep(distance, width) {
  return Math.abs(distance) >= Math.min(80, width * 0.14) ? distance < 0 ? 1 : -1 : 0;
}
