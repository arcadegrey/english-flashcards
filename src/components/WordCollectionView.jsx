import { useEffect, useMemo, useState } from 'react';
import WordCard from './WordCard';
import QuickMenu from './QuickMenu';
import { speakWord } from '../utils/speech';

function WordCollectionView({
  title,
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
        icon: showSearch ? '🙈' : '🔎',
        label: showSearch ? '隐藏搜索栏' : '显示搜索栏',
        onClick: () => setShowSearch((prev) => !prev),
      },
    ],
    [showSearch]
  );

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

  return (
    <div className="learn-refresh-page">
      <header className="learn-refresh-topbar">
        <div className="learn-refresh-topbar-inner">
          <div className="learn-refresh-left-actions">
            <button type="button" className="learn-refresh-back" onClick={onBack} aria-label="返回">
              <span aria-hidden="true">←</span>
              <span>返回</span>
            </button>
            <button type="button" className="learn-refresh-home-btn" onClick={onHome} aria-label="回到首页">
              <span aria-hidden="true">🏠</span>
            </button>
          </div>

          <div className="learn-refresh-progress">
            <p className="learn-refresh-progress-main">
              {progressCurrent} / {filteredWords.length}
            </p>
            <p className="learn-refresh-progress-sub">{progressLabel || `今日目标 ${filteredWords.length}`}</p>
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
              onClick={handleSpeakCurrentWord}
              aria-label="播放发音"
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
              onOpenReading={onOpenReading}
              onSlowSpeechChange={setToast}
              extraItems={quickMenuExtraItems}
            />
          </div>
        </div>
      </header>

      <main className="learn-refresh-main">
        {showSearch && (
          <section className="mb-4 rounded-[16px] border border-[#e8e8ed] bg-white px-4 py-4">
            <input
              type="text"
              value={query}
              onChange={(event) => {
                setCurrentIndex(0);
                setQuery(event.target.value);
              }}
              placeholder={`搜索${title.replace(/^[^\u4e00-\u9fa5A-Za-z0-9]+/, '')}...`}
              className="w-full min-h-[46px] rounded-[12px] border border-[#e8e8ed] bg-white px-4 text-center text-base text-[#1d1d1f] placeholder:text-[#9ca3af] outline-none transition focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20"
            />
          </section>
        )}

        {words.length === 0 ? (
          <article className="learn-refresh-card learn-refresh-card-enter">
            <p className="learn-refresh-empty">{emptyHint}</p>
          </article>
        ) : filteredWords.length === 0 ? (
          <article className="learn-refresh-card learn-refresh-card-enter">
            <p className="learn-refresh-empty">没有匹配结果，试试别的关键词。</p>
          </article>
        ) : (
          <WordCard
            key={`${currentWord?.id || 'collection-empty'}-${safeCurrentIndex}`}
            word={currentWord}
            showHint={showHint}
          />
        )}
      </main>

      {filteredWords.length > 0 && (
        <footer className="learn-refresh-bottombar">
          <div className="learn-refresh-bottombar-inner">
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
          </div>
        </footer>
      )}

      {toast && (
        <div className="learn-refresh-toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}

    </div>
  );
}

export default WordCollectionView;
