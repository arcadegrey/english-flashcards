import { useMemo } from 'react';

function SyncIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 6v5h-5" />
      <path d="M4 18v-5h5" />
      <path d="M6.2 9A7 7 0 0118.5 7.5L20 11" />
      <path d="M17.8 15A7 7 0 015.5 16.5L4 13" />
    </svg>
  );
}

function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 9v6h4l5 4V5L7 9H3z" />
      <path d="M16.5 8.5a4.5 4.5 0 010 7" />
      <path d="M19.5 6a8 8 0 010 12" />
    </svg>
  );
}

function ToeflSelectionView({
  mode = 'level',
  title,
  subtitle,
  items = [],
  totalCount = 0,
  onBack,
  onHome,
  onSelect,
  onSelectAll,
  onSyncAccount,
  onSpeakIntro,
  selectAllLabel = '学习全部',
}) {
  const emptyText = mode === 'level' ? '当前没有可用的托福分级数据。' : '这个 Level 暂时没有可用的 List。';

  const resolvedSubtitle = useMemo(() => {
    if (subtitle) {
      return subtitle;
    }
    return mode === 'level' ? '先选择 Level，再进入对应 List 学习。' : '选择具体 List 开始学习。';
  }, [mode, subtitle]);

  const progressLabel = mode === 'level' ? `${items.length} 个 Level` : `${items.length} 个 List`;
  const progressSub = mode === 'level' ? '托福词汇' : '托福 List';
  const gridClass = items.length === 1 ? 'reading-category-grid toefl-selection-grid--single' : 'reading-category-grid';

  return (
    <div className="learn-refresh-page toefl-selection-page">
      <header className="learn-refresh-topbar">
        <div className="learn-refresh-topbar-inner">
          <div className="learn-refresh-left-actions">
            <button type="button" className="learn-refresh-back" onClick={onBack} aria-label="返回上一页">
              <span aria-hidden="true">←</span>
              <span>返回</span>
            </button>
            <button type="button" className="learn-refresh-home-btn" onClick={onHome} aria-label="回到首页">
              <span aria-hidden="true">🏠</span>
            </button>
          </div>

          <div className="learn-refresh-progress">
            <p className="learn-refresh-progress-main">{progressLabel}</p>
            <p className="learn-refresh-progress-sub">{progressSub}</p>
          </div>

          <div className="learn-refresh-top-actions">
            <button
              type="button"
              className="learn-refresh-icon-btn"
              onClick={onSyncAccount}
              aria-label="同步账号"
            >
              <SyncIcon />
            </button>
            <button
              type="button"
              className="learn-refresh-icon-btn"
              onClick={onSpeakIntro}
              aria-label="播放托福分级提示"
            >
              <SpeakerIcon />
            </button>
            <span className="learn-refresh-topbar-spacer" aria-hidden="true" />
          </div>
        </div>
      </header>

      <main className="learn-refresh-main">
        <section className="learn-refresh-card learn-refresh-card-enter reading-list-card">
          <header className="reading-list-header">
            <h1 className="reading-list-title">{title}</h1>
            <p className="reading-list-subtitle">{resolvedSubtitle}</p>
            <p className="toefl-selection-total">共 {totalCount} 个单词</p>
          </header>

          <section className="reading-category-section" aria-label="托福分级选择">
            {items.length === 0 ? (
              <div className="word-home-empty">{emptyText}</div>
            ) : (
              <div className="space-y-3">
                {onSelectAll && (
                  <button type="button" onClick={onSelectAll} className="reading-category-card toefl-selection-all">
                    <span className="reading-category-name">{selectAllLabel}</span>
                    <span className="reading-category-count">{totalCount} 词</span>
                  </button>
                )}

                <div className={gridClass}>
                  {items.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => onSelect?.(item.key)}
                      className="reading-category-card toefl-selection-card"
                    >
                      <span className="reading-category-name">{item.label}</span>
                      <span className="reading-category-count">{item.count} 词</span>
                      {item.meta && <span className="toefl-selection-meta">{item.meta}</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}

export default ToeflSelectionView;
