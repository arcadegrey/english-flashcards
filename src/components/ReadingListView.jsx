import { useEffect, useMemo, useState } from 'react';
import QuickMenu from './QuickMenu';
import { speak } from '../utils/speech';

const LEVEL_META = {
  all: { label: '全部等级', icon: '📚', order: 0 },
  a1: { label: 'A1 入门', icon: 'A1', order: 1 },
  a2: { label: 'A2 初级', icon: 'A2', order: 2 },
  b1: { label: 'B1 中级', icon: 'B1', order: 3 },
  b2: { label: 'B2 中高级', icon: 'B2', order: 4 },
  c1: { label: 'C1 高级', icon: 'C1', order: 5 },
  c2: { label: 'C2 精通', icon: 'C2', order: 6 },
  unknown: { label: '未标等级', icon: '—', order: 99 },
};

const TOPIC_META = {
  'study-skills': '学习方法',
  'self-improvement': '自我提升',
  'health-learning': '健康学习',
  culture: '文化历史',
  environment: '环境城市',
  thinking: '思维创新',
  lifestyle: '生活方式',
  economics: '经济决策',
  education: '教育科技',
  mindset: '心态成长',
  productivity: '效率专注',
};

const formatCategoryLabel = (category) => {
  const key = String(category || '').trim().toLowerCase();
  if (!key) return '未分类';
  if (TOPIC_META[key]) return TOPIC_META[key];
  return key
    .split(/[-_]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
};

const normalizeLevelKey = (level) => String(level || '').trim().toLowerCase() || 'unknown';

const formatLevelLabel = (level) => {
  const key = normalizeLevelKey(level);
  if (LEVEL_META[key]) return LEVEL_META[key].label;
  return String(level || '').trim().toUpperCase() || LEVEL_META.unknown.label;
};

const getLevelIcon = (level) => {
  const key = normalizeLevelKey(level);
  return LEVEL_META[key]?.icon || String(level || '').trim().toUpperCase() || LEVEL_META.unknown.icon;
};

const getLevelOrder = (level) => {
  const key = normalizeLevelKey(level);
  return LEVEL_META[key]?.order ?? 50;
};

const formatSourceLabel = (article) => {
  const explicitType = String(article?.examType || article?.testType || '').trim();
  if (explicitType) return explicitType.toUpperCase();

  const tags = Array.isArray(article?.tags) ? article.tags : [];
  const sourceText = [article?.source, article?.category, ...tags]
    .map((item) => String(item || '').trim().toLowerCase())
    .join(' ');

  if (sourceText.includes('toefl')) return 'TOEFL';
  if (sourceText.includes('ielts')) return 'IELTS';
  return article?.source ? String(article.source) : '常规阅读';
};

function ReadingListView({
  readings = [],
  mode = 'learn',
  onBack,
  onHome,
  onOpenReading,
  onOpenMode,
  onSyncAccount,
}) {
  const [selectedLevel, setSelectedLevel] = useState('');
  const [toast, setToast] = useState('');
  const levelOptions = useMemo(() => {
    const map = new Map();
    readings.forEach((article) => {
      const levelKey = normalizeLevelKey(article?.level);
      map.set(levelKey, (map.get(levelKey) || 0) + 1);
    });

    const items = Array.from(map.entries())
      .map(([key, count]) => ({
        id: key,
        label: formatLevelLabel(key),
        icon: getLevelIcon(key),
        count,
        order: getLevelOrder(key),
      }))
      .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label, 'zh-CN'));

    return [
      {
        id: 'all',
        label: LEVEL_META.all.label,
        icon: LEVEL_META.all.icon,
        count: readings.length,
        order: LEVEL_META.all.order,
      },
      ...items,
    ];
  }, [readings]);

  const activeLevel = useMemo(
    () => (selectedLevel && levelOptions.some((item) => item.id === selectedLevel) ? selectedLevel : ''),
    [levelOptions, selectedLevel]
  );

  const filteredReadings = useMemo(() => {
    if (!activeLevel || activeLevel === 'all') return readings;
    return readings.filter((article) => normalizeLevelKey(article?.level) === activeLevel);
  }, [readings, activeLevel]);

  const selectedLevelLabel = useMemo(
    () => levelOptions.find((item) => item.id === activeLevel)?.label || LEVEL_META.all.label,
    [levelOptions, activeLevel]
  );

  const isLevelStage = !activeLevel;

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 1600);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleSpeakIntro = () => {
    speak('Reading mode. Choose one article to start.', { rate: 1 });
  };

  const handleSyncAccount = async () => {
    if (typeof onSyncAccount !== 'function') {
      setToast('当前页面暂不可同步');
      return;
    }

    setToast('正在同步账号...');
    try {
      const result = await onSyncAccount();
      setToast(result?.message || '同步请求已完成');
    } catch (error) {
      setToast(error?.message || '同步失败，请稍后重试');
    }
  };

  return (
    <div className="learn-refresh-page">
      <header className="learn-refresh-topbar">
        <div className="learn-refresh-topbar-inner">
          <div className="learn-refresh-left-actions">
            <button type="button" className="learn-refresh-back" onClick={onBack} aria-label="返回入口页">
              <span aria-hidden="true">←</span>
              <span>返回</span>
            </button>
            <button type="button" className="learn-refresh-home-btn" onClick={onHome} aria-label="回到首页">
              <span aria-hidden="true">🏠</span>
            </button>
          </div>

          <div className="learn-refresh-progress">
            {isLevelStage ? (
              <>
                <p className="learn-refresh-progress-main">{Math.max(levelOptions.length - 1, 0)} 级</p>
                <p className="learn-refresh-progress-sub">阅读等级</p>
              </>
            ) : (
              <>
                <p className="learn-refresh-progress-main">{filteredReadings.length} 篇</p>
                <p className="learn-refresh-progress-sub">{selectedLevelLabel}</p>
              </>
            )}
          </div>

          <div className="learn-refresh-top-actions">
            <button
              type="button"
              className="learn-refresh-icon-btn"
              onClick={handleSyncAccount}
              aria-label="同步账号"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 6v5h-5" />
                <path d="M4 18v-5h5" />
                <path d="M6.2 9A7 7 0 0118.5 7.5L20 11" />
                <path d="M17.8 15A7 7 0 015.5 16.5L4 13" />
              </svg>
            </button>
            <button
              type="button"
              className="learn-refresh-icon-btn"
              onClick={handleSpeakIntro}
              aria-label="播放阅读模式提示"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 9v6h4l5 4V5L7 9H3z" />
                <path d="M16.5 8.5a4.5 4.5 0 010 7" />
                <path d="M19.5 6a8 8 0 010 12" />
              </svg>
            </button>

            <QuickMenu
              mode={mode}
              onOpenMode={onOpenMode}
              onOpenReading={() => setSelectedLevel('')}
              onSlowSpeechChange={setToast}
            />
          </div>
        </div>
      </header>

      <main className="learn-refresh-main">
        {isLevelStage ? (
          <section key="category-stage" className="learn-refresh-card learn-refresh-card-enter reading-list-card">
            <header className="reading-list-header">
              <h1 className="reading-list-title">阅读训练</h1>
              <p className="reading-list-subtitle">先按等级选择文章，再开始阅读。考试来源和主题会保留在文章卡片里。</p>
            </header>

            <section className="reading-category-section" aria-label="阅读等级">
              <div className="reading-category-head">
                <h2 className="reading-category-title">选择阅读等级</h2>
                <p className="reading-category-sub">共 {Math.max(levelOptions.length - 1, 0)} 个等级</p>
              </div>
              <div className="reading-category-grid">
                {levelOptions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="reading-category-card"
                    onClick={() => setSelectedLevel(item.id)}
                  >
                    <span className="reading-category-icon reading-level-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="reading-category-name">{item.label}</span>
                    <span className="reading-category-count">{item.count} 篇</span>
                  </button>
                ))}
              </div>
            </section>

            {readings.length === 0 && <p className="learn-refresh-empty">暂无阅读文章，请先导入 CSV。</p>}
          </section>
        ) : (
          <section key="list-stage" className="learn-refresh-card learn-refresh-card-enter reading-list-card">
            <header className="reading-list-header">
              <h1 className="reading-list-title">{selectedLevelLabel}</h1>
              <p className="reading-list-subtitle">点击文章开始阅读。</p>
            </header>

            <div className="reading-list-back-row">
              <button type="button" className="reading-list-back-btn" onClick={() => setSelectedLevel('')}>
                ← 返回等级
              </button>
            </div>

            <div className="reading-list-block-head">
              <p className="reading-list-block-sub">{filteredReadings.length} 篇文章</p>
            </div>

            <div className="reading-list-grid">
              {filteredReadings.map((article) => (
                <button
                  key={article.id}
                  type="button"
                  className="reading-list-item"
                  onClick={() => onOpenReading?.(article.id)}
                >
                  <p className="reading-list-item-title">{article.title}</p>
                  <div className="reading-list-item-meta">
                    <span>{article.level || 'B1'}</span>
                    <span>{formatSourceLabel(article)}</span>
                    {article.category && <span>{formatCategoryLabel(article.category)}</span>}
                    {Array.isArray(article.questions) && article.questions.length > 0 && (
                      <span>{article.questions.length} 题</span>
                    )}
                    <span>{article.estimatedMinutes || 1} 分钟</span>
                    <span>{article.unmasteredCount || 0} 个难词</span>
                  </div>
                </button>
              ))}
            </div>

            {filteredReadings.length === 0 && <p className="learn-refresh-empty">当前等级暂无文章。</p>}
          </section>
        )}
      </main>

      {toast && (
        <div className="learn-refresh-toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}

    </div>
  );
}

export default ReadingListView;
