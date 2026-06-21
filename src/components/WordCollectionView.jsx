import { useEffect, useMemo, useState } from 'react';
import WordCard from './WordCard';
import QuickMenu from './QuickMenu';
import AppLayout from './layout/AppLayout';
import { speakWord } from '../utils/speech';

const SearchIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="11" cy="11" r="6" />
    <path d="m16 16 4 4" />
  </svg>
);

const HideSearchIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 7h16" />
    <path d="M7 12h10" />
    <path d="M10 17h4" />
  </svg>
);

function WordCollectionView({
  title,
  subtitle,
  words,
  onBack,
  mode = 'learn',
  onOpenMode,
  emptyHint,
  onMarkAsMastered,
  onMarkAsUnknown,
  masteredActionLabel = '认识了',
  unknownActionLabel = '不认识',
  progressLabel,
  onHome,
  onSyncAccount,
  onOpenReading,
  navItems,
  topbarProps,
  active = 'review',
  emptyArtSrc = '/images/ui-assets/training-card-review-blue-v1.png',
}) {
  const [query, setQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [hintOpenForWordId, setHintOpenForWordId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toast, setToast] = useState('');

  const filteredWords = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return words;

    return words.filter(
      (word) =>
        word.word.toLowerCase().includes(keyword) ||
        word.meaning.toLowerCase().includes(keyword) ||
        (word.phonetic || '').toLowerCase().includes(keyword)
    );
  }, [query, words]);

  const safeCurrentIndex =
    filteredWords.length > 0 ? Math.min(currentIndex, filteredWords.length - 1) : 0;
  const currentWord = filteredWords[safeCurrentIndex] || null;
  const progressCurrent = filteredWords.length > 0 ? safeCurrentIndex + 1 : 0;
  const currentWordId = currentWord?.id ?? null;
  const showHint = currentWordId != null && String(hintOpenForWordId) === String(currentWordId);
  const quickMenuExtraItems = useMemo(
    () => [
      {
        id: 'search',
        icon: showSearch ? HideSearchIcon : SearchIcon,
        label: showSearch ? '隐藏搜索栏' : '显示搜索栏',
        isActive: showSearch,
        onClick: () => setShowSearch((prev) => !prev),
      },
    ],
    [showSearch]
  );

  const progressPercent =
    filteredWords.length > 0 ? Math.max(1, Math.round((progressCurrent / filteredWords.length) * 100)) : 0;
  const displayTitle = title.replace(/^[^\u4e00-\u9fa5A-Za-z0-9]+/, '').trim() || title;
  const displaySubtitle = subtitle || '按学习记录生成的复习集合，答题逻辑和进度保持不变。';

  useEffect(() => {
    if (!toast) return undefined;

    const timer = setTimeout(() => setToast(''), 1600);
    return () => clearTimeout(timer);
  }, [toast]);

  const nextCard = () => {
    if (filteredWords.length <= 1) return;
    setCurrentIndex((prev) => {
      const normalized = Math.min(prev, filteredWords.length - 1);
      return (normalized + 1) % filteredWords.length;
    });
  };

  const handleSpeakCurrentWord = () => {
    if (!currentWord?.word) return;
    speakWord(currentWord, { rate: 1 });
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

  const handleMarkUnknown = () => {
    if (!currentWord) return;

    if (typeof onMarkAsUnknown === 'function') {
      onMarkAsUnknown(currentWord.id);
      setToast('已移回已学习');
      setHintOpenForWordId(null);
      nextCard();
      return;
    }

    setToast('已加入复习队列');
    setHintOpenForWordId(null);
    nextCard();
  };

  const handleMarkKnown = () => {
    if (!currentWord) return;

    if (typeof onMarkAsMastered === 'function') {
      onMarkAsMastered(currentWord.id);
      setToast('已标记为“认识”');
      setHintOpenForWordId(null);
      nextCard();
      return;
    }

    setToast('已保持为已掌握');
    setHintOpenForWordId(null);
    nextCard();
  };

  const handleToggleHint = () => {
    if (currentWordId == null) {
      return;
    }
    setHintOpenForWordId((prev) => (String(prev) === String(currentWordId) ? null : currentWordId));
  };

  const content = (
    <>
      <div className="collection-page-flow learn-refresh-card-enter">
        <section className="collection-hero" aria-label={`${progressLabel || displayTitle}进度`}>
        <div className="collection-goal-strip">
          <span className="collection-goal-label">{progressLabel || '集合进度'}</span>
          <div className="collection-goal-track" aria-hidden="true">
            <span style={{ width: `${progressPercent}%` }} />
          </div>
          <strong>{progressPercent}%</strong>
        </div>
        </section>

        <section className="collection-work-card" aria-label={`${displayTitle}练习区`}>
        <div className="collection-tool-row">
          <button type="button" className="collection-tool-button" onClick={onBack}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span>返回</span>
          </button>
          <button type="button" className="collection-tool-button" onClick={onHome}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 11.5 12 5l8 6.5" />
              <path d="M6.5 10.5V20h11v-9.5" />
              <path d="M10 20v-5h4v5" />
            </svg>
            <span>首页</span>
          </button>
          <button
            type="button"
            className={`collection-tool-button ${showSearch ? 'is-active' : ''}`}
            onClick={() => setShowSearch((prev) => !prev)}
          >
            {showSearch ? HideSearchIcon : SearchIcon}
            <span>{showSearch ? '隐藏搜索' : '搜索'}</span>
          </button>
          <button type="button" className="collection-tool-button" onClick={handleSyncAccount}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 6v5h-5" />
              <path d="M4 18v-5h5" />
              <path d="M6.2 9A7 7 0 0118.5 7.5L20 11" />
              <path d="M17.8 15A7 7 0 015.5 16.5L4 13" />
            </svg>
            <span>同步</span>
          </button>
          <button type="button" className="collection-tool-button" onClick={handleSpeakCurrentWord} disabled={!currentWord}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 9v6h4l5 4V5L7 9H3z" />
              <path d="M16.5 8.5a4.5 4.5 0 010 7" />
              <path d="M19.5 6a8 8 0 010 12" />
            </svg>
            <span>发音</span>
          </button>
          <QuickMenu
            mode={mode}
            onOpenMode={onOpenMode}
            onOpenReading={onOpenReading}
            onSlowSpeechChange={setToast}
            extraItems={quickMenuExtraItems}
          />
        </div>

        {showSearch && (
          <section className="collection-search-panel">
            <input
              type="text"
              value={query}
              onChange={(event) => {
                setCurrentIndex(0);
                setQuery(event.target.value);
              }}
              placeholder={`搜索${displayTitle}...`}
            />
          </section>
        )}

        {words.length === 0 ? (
          <article className="collection-empty-state">
            <img src={emptyArtSrc} alt="" aria-hidden="true" />
            <div>
              <h3>今天节奏很好</h3>
              <p>{emptyHint}</p>
            </div>
          </article>
        ) : filteredWords.length === 0 ? (
          <article className="collection-empty-state">
            <img src={emptyArtSrc} alt="" aria-hidden="true" />
            <div>
              <h3>没有匹配结果</h3>
              <p>试试别的关键词，或隐藏搜索继续当前集合。</p>
            </div>
          </article>
        ) : (
          <div className="collection-study-panel">
            <WordCard
              key={`${currentWord?.id || 'collection-empty'}-${safeCurrentIndex}`}
              word={currentWord}
              showHint={showHint}
            />
          </div>
        )}

        {filteredWords.length > 0 && (
          <footer className="collection-action-row">
            <button
              type="button"
              className="learn-refresh-action learn-refresh-action-secondary"
              onClick={handleMarkUnknown}
            >
              {unknownActionLabel}
            </button>
            <button
              type="button"
              className="learn-refresh-action learn-refresh-action-ghost"
              onClick={handleToggleHint}
            >
              {showHint ? '收起提示' : '显示提示'}
            </button>
            <button
              type="button"
              className="learn-refresh-action learn-refresh-action-primary"
              onClick={handleMarkKnown}
            >
              {masteredActionLabel}
            </button>
          </footer>
        )}
        </section>
      </div>

      {toast && (
        <div className="learn-refresh-toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </>
  );

  if (navItems?.length) {
    return (
      <AppLayout
        active={active}
        navItems={navItems}
        title={displayTitle}
        subtitle={displaySubtitle}
        topbarProps={topbarProps}
        className="collection-app-layout"
      >
        {content}
      </AppLayout>
    );
  }

  return <div className="learn-refresh-page collection-legacy-page">{content}</div>;
}

export default WordCollectionView;
