import { useMemo, useRef } from 'react';
import AppLayout from './layout/AppLayout';
import { gsap, prefersReducedMotion, useGSAP } from '../utils/gsapMotion';

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

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 14.7 8.9 21 9.6 16.2 13.9 17.5 20 12 16.8 6.5 20 7.8 13.9 3 9.6 9.3 8.9 12 3Z" />
    </svg>
  );
}

const getSelectionCardClassName = (item, selectionKind) =>
  [
    'toefl-selection-card',
    selectionKind === 'ielts-topic' ? 'toefl-selection-card--topic' : 'toefl-selection-card--standard',
    item?.key ? `selection-card--${item.key}` : '',
  ]
    .filter(Boolean)
    .join(' ');

function ToeflSelectionView({
  mode = 'level',
  title,
  subtitle,
  items = [],
  totalCount = 0,
  onBack,
  onSelect,
  onSelectAll,
  onSyncAccount,
  selectAllLabel = '学习全部',
  vocabularyLabel = '托福词汇',
  listLabel = '托福 List',
  navItems = [],
  topbarProps = {},
  active = 'words',
  selectionKind = 'toefl-level',
}) {
  const isTopicView = selectionKind === 'ielts-topic';
  const emptyText = mode === 'level' ? `当前没有可用的${vocabularyLabel}分级数据。` : '当前暂时没有可用的 List。';

  const resolvedSubtitle = useMemo(() => {
    if (subtitle) {
      return subtitle;
    }
    return mode === 'level' ? '先选择 Level，再进入对应 List 学习。' : '选择具体 List 开始学习。';
  }, [mode, subtitle]);

  const progressLabel = mode === 'level' ? (isTopicView ? `${items.length} 个主题` : `${items.length} 个 Level`) : `${items.length} 个 List`;
  const progressSub = mode === 'level' ? vocabularyLabel : listLabel;
  const gridClass = items.length === 1 ? 'toefl-selection-grid is-single' : 'toefl-selection-grid';
  const panelTitle = isTopicView ? '选择学习主题' : mode === 'level' ? title : `${progressSub} 选择`;
  const selectionRef = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const cards = selectionRef.current?.querySelectorAll('.toefl-selection-card');
    if (!cards?.length) return;

    gsap.fromTo(
      cards,
      { y: 18, autoAlpha: 0, scale: 0.985 },
      {
        y: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 0.42,
        ease: 'power2.out',
        stagger: { each: 0.045, from: 'start' },
        clearProps: 'transform,opacity,visibility',
      }
    );
  }, { dependencies: [mode, items.length, totalCount, selectionKind], scope: selectionRef, revertOnUpdate: true });

  return (
    <AppLayout
      active={active}
      navItems={navItems}
      title={title}
      subtitle={resolvedSubtitle}
      topbarProps={topbarProps}
    >
      <main className={`toefl-selection-page ${isTopicView ? 'is-topic-view' : 'is-standard-view'}`}>
        <section ref={selectionRef} className="toefl-selection-panel" aria-label={`${vocabularyLabel}选择`}>
          <div className="toefl-selection-panel-head">
            <div className="toefl-selection-panel-nav">
              {onBack && (
                <button type="button" className="toefl-selection-action is-back" onClick={onBack}>
                  <ArrowIcon />
                  <span>返回上一级</span>
                </button>
              )}
            </div>
            <div className="toefl-selection-panel-title">
              <h2>{panelTitle}</h2>
              <p>{progressLabel} · 共 {totalCount} 个单词</p>
            </div>
            <div className="toefl-selection-actions" aria-label="页面操作">
              {onSelectAll && (
                <button type="button" className="toefl-selection-action is-primary" onClick={onSelectAll}>
                  <SparkIcon />
                  <span>{selectAllLabel}</span>
                  <strong>{totalCount} 词</strong>
                </button>
              )}
              {onSyncAccount && (
                <button type="button" className="toefl-selection-action" onClick={onSyncAccount}>
                  <SyncIcon />
                  <span>同步进度</span>
                </button>
              )}
            </div>
          </div>

          {items.length === 0 ? (
            <div className="word-home-empty">{emptyText}</div>
          ) : (
            <div className={gridClass}>
              {items.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onSelect?.(item.key)}
                  className={getSelectionCardClassName(item, selectionKind)}
                >
                  <span className="toefl-selection-card-name">{item.label}</span>
                  <span className="toefl-selection-card-meta-row">
                    <span className="toefl-selection-card-count">{item.count} 词</span>
                    {item.meta && <span className="toefl-selection-meta">{item.meta}</span>}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>
    </AppLayout>
  );
}

export default ToeflSelectionView;
