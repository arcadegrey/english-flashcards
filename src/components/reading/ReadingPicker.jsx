import { useMemo } from 'react';
import { READING_LEVEL_META, buildReadingLevelOptions, filterReadingsByLevel } from './readingPickerModel';

function ReadingPanelIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.5 5.5h5.25c1.24 0 2.25 1 2.25 2.25v10.75c0-1.2-1.04-2.25-2.25-2.25H4.5V5.5Z" />
      <path d="M19.5 5.5h-5.25c-1.24 0-2.25 1-2.25 2.25v10.75c0-1.2 1.04-2.25 2.25-2.25h5.25V5.5Z" />
    </svg>
  );
}

function ReadingLevelIcon({ levelId, label }) {
  if (levelId === 'all') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect x="5" y="5" width="9" height="9" rx="2.2" />
        <rect x="18" y="5" width="9" height="9" rx="2.2" />
        <rect x="5" y="18" width="9" height="9" rx="2.2" />
        <rect x="18" y="18" width="9" height="9" rx="2.2" />
      </svg>
    );
  }

  return <span>{String(label || '').split(' ')[0] || levelId.toUpperCase()}</span>;
}

function ReadingLevelArt({ levelId }) {
  if (levelId === 'all') {
    return <span className="reading-level-art-grid" aria-hidden="true" />;
  }

  if (levelId === 'b1' || levelId === 'a1' || levelId === 'a2') {
    return (
      <span className="reading-level-art-sprout" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    );
  }

  if (levelId === 'b2') {
    return (
      <span className="reading-level-art-mountain" aria-hidden="true">
        <span />
      </span>
    );
  }

  return (
    <span className="reading-level-art-crown" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

export function ReadingLevelCard({ level, onClick }) {
  const meta = READING_LEVEL_META[level.id] || READING_LEVEL_META.unknown;
  const count = Number(level.count || 0);

  return (
    <button
      type="button"
      className={`reading-level-card is-${meta.tone || 'slate'} is-${level.id}`}
      onClick={onClick}
    >
      <span className="reading-level-badge" aria-hidden="true">
        <ReadingLevelIcon levelId={level.id} label={level.title} />
      </span>
      <ReadingLevelArt levelId={level.id} />
      <span className="reading-level-title">{level.title}</span>
      <span className="reading-level-count">{count} 篇文章</span>
      <span className="reading-level-helper">
        <span />
        {meta.helper}
      </span>
      <span className="reading-level-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </span>
    </button>
  );
}

function ReadingArticleIcon({ index = 0 }) {
  const variant = index % 5;

  if (variant === 0) {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M14 23c0-5.5 4.5-10 10-10s10 4.5 10 10" />
        <path d="M18 23h12v10a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V23Z" />
        <path d="M18 23c-3.5 0-6-2.5-6-6 3.8-.4 6.8 1.3 8 5" />
        <path d="M30 23c3.5 0 6-2.5 6-6-3.8-.4-6.8 1.3-8 5" />
      </svg>
    );
  }

  if (variant === 1) {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M15 33c0-7 4.2-12 9-12s9 5 9 12" />
        <path d="M12 25c1.5-6.5 6-10 12-10s10.5 3.5 12 10" />
        <path d="M18 19c-.2-4.5 2-7 6-7s6.2 2.5 6 7" />
      </svg>
    );
  }

  if (variant === 2) {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M31 13a14 14 0 1 0 4 22 11 11 0 0 1-4-22Z" />
        <path d="M34 18l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4Z" />
      </svg>
    );
  }

  if (variant === 3) {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="18" cy="18" r="6" />
        <path d="M8 36c1.5-6 5-9 10-9s8.5 3 10 9" />
        <path d="M27 14h12v12H27z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M10 36h28" />
      <path d="M14 36 24 14l10 22" />
      <path d="M24 14v-5h10l-3 3 3 3H24Z" />
    </svg>
  );
}

export function ReadingArticleRow({ article, index, onClick }) {
  return (
    <button type="button" className={`reading-article-row is-tone-${index % 5}`} onClick={onClick}>
      <span className="reading-article-thumb" aria-hidden="true">
        <ReadingArticleIcon index={index} />
      </span>
      <span className="reading-article-copy">
        <span className="reading-article-title">{article.title}</span>
        <span className="reading-article-meta">
          {article.examType || article.source || 'english-flashcards'} · {article.estimatedMinutes || 4} 分钟
        </span>
      </span>
      <span className="reading-article-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </span>
    </button>
  );
}

export function ReadingPickerContent({
  readings = [],
  activeLevel = '',
  onSelectLevel,
  onBackToLevels,
  onOpenArticle,
}) {
  const levelOptions = useMemo(() => buildReadingLevelOptions(readings), [readings]);
  const resolvedLevel = levelOptions.some((item) => item.id === activeLevel) ? activeLevel : '';
  const filteredReadings = useMemo(
    () => filterReadingsByLevel(readings, resolvedLevel),
    [readings, resolvedLevel]
  );
  const activeLevelLabel = levelOptions.find((item) => item.id === resolvedLevel)?.title || READING_LEVEL_META.all.label;

  return (
    <>
      <div className="word-home-category-head reading-home-category-head">
        {!resolvedLevel && (
          <span className="reading-home-head-icon" aria-hidden="true">
            <ReadingPanelIcon />
          </span>
        )}
        <h2>{resolvedLevel ? activeLevelLabel : '选择阅读等级'}</h2>
        <p>{resolvedLevel ? `${filteredReadings.length} 篇文章` : `共 ${Math.max(levelOptions.length - 1, 0)} 个等级`}</p>
      </div>

      {!resolvedLevel ? (
        <>
          <div className="reading-level-grid">
            {levelOptions.map((level) => (
              <ReadingLevelCard
                key={level.id}
                level={level}
                onClick={() => onSelectLevel?.(level.id)}
              />
            ))}
          </div>
          {readings.length === 0 && <p className="word-home-empty">暂无阅读文章，请先导入 CSV。</p>}
        </>
      ) : (
        <div id="reading-article-panel" className="reading-home-article-panel">
          <button type="button" className="reading-home-back-btn" onClick={() => onBackToLevels?.()}>
            返回阅读分类
          </button>
          {filteredReadings.length === 0 ? (
            <p className="word-home-empty">当前等级暂无文章。</p>
          ) : (
            <div className="reading-home-article-list">
              {filteredReadings.map((article, index) => (
                <ReadingArticleRow
                  key={article.id}
                  article={article}
                  index={index}
                  onClick={() => onOpenArticle?.(article)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
