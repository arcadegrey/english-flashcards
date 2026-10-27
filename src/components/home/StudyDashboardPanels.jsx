import LoadingState from '../ui/LoadingState';
import AssetImage from '../ui/AssetImage';
import { resolveImageAsset } from '../../utils/imageAssets';
import { BaseCard } from '../ui/Cards';
import { LinearProgress } from '../ui/Progress';
import { dashboardStudyTime, formatStudyMinutes, DASHBOARD_ART } from '../../utils/studyDashboard.js';

function Chevron() {
  return <svg className="study-dashboard-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>;
}

// Canvas size and visible alpha bounds (>16), measured from the existing PNGs.
// A square viewport with 6% padding centers the subject, not its transparent canvas.
const ARTWORK_FRAMES = {
  '/images/ui-assets/training-card-vocabulary-blue-v1.png': [768, 512, 320, 91, 350, 371],
  '/images/ui-assets/training-card-reading-blue-v1.png': [768, 512, 78, 70, 338, 411],
  '/images/ui-assets/training-card-review-blue-v1.png': [768, 512, 283, 42, 380, 376],
  '/images/ui-assets/training-card-test-blue-v1.png': [768, 512, 87, 71, 383, 335],
  '/images/ui-assets/training-hero-flashcards-blue-v1.png': [1536, 1024, 246, 118, 1010, 745],
  '/images/ui-assets/category-all-words-blue-v1.png': [512, 512, 135, 109, 339, 350],
};

function DashboardArtwork({ src }) {
  const frame = ARTWORK_FRAMES[src];
  if (!frame) return <AssetImage className="study-dashboard-artwork" src={src} alt="" aria-hidden="true" />;
  const [canvasWidth, canvasHeight, x, y, width, height] = frame;
  const size = Math.max(width, height) * 1.12;
  const viewBox = `${x + (width - size) / 2} ${y + (height - size) / 2} ${size} ${size}`;
  return <svg className="study-dashboard-artwork" viewBox={viewBox} aria-hidden="true" focusable="false">
    <image href={resolveImageAsset(src)} width={canvasWidth} height={canvasHeight} />
  </svg>;
}

export function DashboardStats({ plan, streak, history, wordCount, categoryName, onAdjustPlan, onStatistics, onCatalog }) {
  const time = dashboardStudyTime(history);
  const progress = plan.tasks.words.goal ? Math.min(100, plan.tasks.words.progress / plan.tasks.words.goal * 100) : 0;
  const stats = [
    { key: 'plan', label: '今日词汇目标', value: `${plan.tasks.words.goal} 个`, meta: `已练 ${plan.tasks.words.progress} 个`,
      art: '/images/ui-assets/stat-target.png', tone: 'blue', action: onAdjustPlan, progress },
    { key: 'streak', label: '连续学习', value: `${streak} 天`, meta: streak ? '保持你的学习节奏' : '从今天开始积累',
      art: '/images/ui-assets/stat-flame.png', tone: 'peach', action: onStatistics },
    { key: 'time', label: '记录学习时长', value: formatStudyMinutes(time.minutes), meta: `近 90 天 · 本周 ${formatStudyMinutes(time.weekMinutes)}`,
      tone: 'lavender', action: onStatistics },
    { key: 'words', label: '当前词库', value: `${wordCount.toLocaleString('zh-CN')} 个`, meta: categoryName,
      art: '/images/ui-assets/category-all-words-blue-v1.png', tone: 'mint', action: onCatalog },
  ];
  return <div className="study-dashboard-stats" aria-label="学习概览">{stats.map(stat => <button key={stat.key} type="button" className={`study-dashboard-stat is-${stat.tone}`} onClick={stat.action}>
    <span className="study-dashboard-stat-icon" aria-hidden="true">{stat.art ? <AssetImage src={stat.art} alt="" /> : <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" /></svg>}</span>
    <span className="study-dashboard-stat-copy"><span>{stat.label}</span><strong>{plan.priority === 'preparing' ? '—' : stat.value}</strong><small>{plan.priority === 'preparing' ? '正在恢复学习记录' : stat.meta}</small>
      {stat.progress !== undefined && plan.priority !== 'preparing' && <LinearProgress value={Math.round(stat.progress)} />}
    </span><Chevron />
  </button>)}</div>;
}

export function DashboardTasks({ cards, priority, ready, plan, onAction, onAdjustPlan }) {
  const tasks = ['review', 'words', 'reading', 'exam'].map(id => cards.find(card => card.id === id))
    .filter(card => card && (card.id !== 'review' || plan.tasks.review.count > 0));
  return <BaseCard className="study-dashboard-tasks" aria-label="今日学习计划">
    <header className="study-dashboard-panel-head"><h2><span className="study-dashboard-panel-symbol" aria-hidden="true"><DashboardArtwork src="/images/ui-assets/training-card-vocabulary-blue-v1.png" /></span>今日学习计划</h2>
      <button type="button" onClick={onAdjustPlan}>调整计划<Chevron /></button>
    </header>
    {!ready && <LoadingState variant="inline" className="study-dashboard-preparing" title="正在准备今日学习任务…" />}
    {ready && !tasks.length && <p className="study-dashboard-preparing">当前暂无可安排的任务，从训练中心选择内容开始。</p>}
    <div className="study-dashboard-task-list">{tasks.map(task => <div key={task.id} className={`study-dashboard-task is-${task.tone} ${priority === task.id ? 'is-priority' : ''}`}>
      <span className="study-dashboard-task-icon"><DashboardArtwork src={DASHBOARD_ART[task.id]} /></span>
      <div className="study-dashboard-task-copy"><h3>{task.id === 'words' ? `词汇学习 · ${task.title}` : task.id === 'reading' ? `阅读 · ${task.title}` : task.id === 'exam' ? '快速练习 · 词汇巩固' : task.title}</h3>
        <p>{task.id === 'words' ? task.progressLabel : task.id === 'review' ? task.meta : task.id === 'reading' ? task.meta : task.progressLabel}</p>
      </div>
      <div className="study-dashboard-task-action">
        {task.complete && plan.priority !== 'preparing' && (task.available || task.id === 'review') && <span className="study-dashboard-task-status">已完成</span>}
        <button type="button" disabled={!task.action} onClick={() => onAction(task.action)}>{task.action ? task.actionLabel : '暂不可用'}<Chevron /></button>
      </div>
    </div>)}</div>
  </BaseCard>;
}

export function DashboardQuickStart({ reviewCount, wrongCount, onReview, onCatalog, onWrongWords, onExam }) {
  const entries = [
    { id: 'review', title: '到期复习', detail: reviewCount ? `${reviewCount} 个词待复习` : '暂无到期词汇', art: DASHBOARD_ART.review, tone: 'blue', action: onReview },
    { id: 'catalog', title: '词库分类', detail: '浏览全部学习词库', art: '/images/ui-assets/category-all-words-blue-v1.png', tone: 'lavender', action: onCatalog },
    { id: 'wrong', title: '错词巩固', detail: `${wrongCount} 个词待巩固`, art: DASHBOARD_ART.words, tone: 'peach', action: onWrongWords },
    { id: 'exam', title: '做测试', detail: '选择范围与题型', art: DASHBOARD_ART.exam, tone: 'mint', action: onExam },
  ];
  return <BaseCard className="study-dashboard-quick" aria-label="快速开始">
    <header className="study-dashboard-panel-head"><h2><span className="study-dashboard-panel-symbol" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m13 2-9 12h7l-1 8 10-13h-7z" /></svg></span>快速开始</h2></header>
    <div className="study-dashboard-quick-grid">{entries.map(entry => <button key={entry.id} type="button" className={`study-dashboard-shortcut is-${entry.tone}`} onClick={entry.action}>
      <span className="study-dashboard-shortcut-icon"><DashboardArtwork src={entry.art} /></span>
      <span><strong>{entry.title}</strong><small>{entry.detail}</small></span><Chevron />
    </button>)}</div>
  </BaseCard>;
}
