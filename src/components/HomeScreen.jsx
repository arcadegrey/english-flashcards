import { useState, useEffect, useMemo, useCallback } from 'react';
import categories from '../data/categories';
import AuthPanel from './AuthPanel';
import { wordBelongsToCategory } from '../utils/wordCategories';

const collectionCategories = [
  {
    id: 'learnedWords',
    name: '已学习单词',
    icon: '📖',
    color: 'from-sky-500 to-blue-600',
    type: 'collection',
  },
  {
    id: 'masteredWords',
    name: '已掌握单词',
    icon: '✅',
    color: 'from-emerald-500 to-teal-600',
    type: 'collection',
  },
  {
    id: 'todayReview',
    name: '今日复习',
    icon: '🔁',
    color: 'from-blue-500 to-indigo-600',
    type: 'collection',
  },
  {
    id: 'wrongWords',
    name: '错题本',
    icon: '🧯',
    color: 'from-rose-500 to-orange-500',
    type: 'collection',
  },
];

const matchesWordQuery = (word, query) =>
  word.word.toLowerCase().includes(query) ||
  word.meaning.toLowerCase().includes(query) ||
  (word.phonetic || '').toLowerCase().includes(query);

function HomeScreen({
  onCategorySelect,
  wordCounts,
  vocabularyData = [],
  learnedWordIds = [],
  masteredWordIds = [],
  todayReviewWordIds = [],
  wrongWordIds = [],
  onOpenLearnedWords,
  onOpenMasteredWords,
  onOpenTodayReview,
  onOpenWrongWords,
  onOpenToeflLevels,
  onBack,
  onHome,
  onSyncAccount,
  onSpeakIntro,
  authEnabled = false,
  authLoading = false,
  authUser = null,
  syncStatusText = '',
  syncError = '',
  onAuthLogin,
  onAuthRegister,
  onAuthLogout,
  onAuthSyncNow,
  showAuthPanel = true,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.toLowerCase().trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const learnedIdSet = useMemo(() => new Set(learnedWordIds.map(String)), [learnedWordIds]);
  const masteredIdSet = useMemo(() => new Set(masteredWordIds.map(String)), [masteredWordIds]);
  const todayReviewIdSet = useMemo(() => new Set(todayReviewWordIds.map(String)), [todayReviewWordIds]);
  const wrongIdSet = useMemo(() => new Set(wrongWordIds.map(String)), [wrongWordIds]);

  const getCollectionSet = useCallback((categoryId) => {
    if (categoryId === 'learnedWords') return learnedIdSet;
    if (categoryId === 'masteredWords') return masteredIdSet;
    if (categoryId === 'todayReview') return todayReviewIdSet;
    if (categoryId === 'wrongWords') return wrongIdSet;
    return new Set();
  }, [learnedIdSet, masteredIdSet, todayReviewIdSet, wrongIdSet]);

  const categoriesWithCollections = useMemo(() => {
    const ieltsIndex = categories.findIndex((category) => category.id === 'ielts');
    if (ieltsIndex === -1) {
      return [...categories, ...collectionCategories];
    }

    return [
      ...categories.slice(0, ieltsIndex + 1),
      ...collectionCategories,
      ...categories.slice(ieltsIndex + 1),
    ];
  }, []);

  const filteredCategories = useMemo(() => {
    if (!debouncedQuery) {
      return categoriesWithCollections;
    }

    return categoriesWithCollections.filter((category) => {
      if (category.name.toLowerCase().includes(debouncedQuery)) {
        return true;
      }

      if (category.id === 'all') {
        return vocabularyData.some((word) => matchesWordQuery(word, debouncedQuery));
      }

      if (category.type === 'collection') {
        const targetSet = getCollectionSet(category.id);
        return vocabularyData.some(
          (word) => targetSet.has(String(word.id)) && matchesWordQuery(word, debouncedQuery)
        );
      }

      return vocabularyData.some(
        (word) => wordBelongsToCategory(word, category.id) && matchesWordQuery(word, debouncedQuery)
      );
    });
  }, [categoriesWithCollections, debouncedQuery, getCollectionSet, vocabularyData]);

  const filteredWordCounts = useMemo(() => {
    const counts = {
      ...wordCounts,
      learnedWords: learnedWordIds.length,
      masteredWords: masteredWordIds.length,
      todayReview: todayReviewWordIds.length,
      wrongWords: wrongWordIds.length,
    };

    if (!debouncedQuery) {
      return counts;
    }

    filteredCategories.forEach((category) => {
      if (category.id === 'all') {
        counts.all = vocabularyData.filter((word) => matchesWordQuery(word, debouncedQuery)).length;
        return;
      }

      if (category.type === 'collection') {
        const targetSet = getCollectionSet(category.id);
        counts[category.id] = vocabularyData.filter(
          (word) => targetSet.has(String(word.id)) && matchesWordQuery(word, debouncedQuery)
        ).length;
        return;
      }

      counts[category.id] = vocabularyData.filter(
        (word) => wordBelongsToCategory(word, category.id) && matchesWordQuery(word, debouncedQuery)
      ).length;
    });

    return counts;
  }, [
    debouncedQuery,
    filteredCategories,
    getCollectionSet,
    learnedWordIds.length,
    masteredWordIds.length,
    todayReviewWordIds.length,
    wrongWordIds.length,
    vocabularyData,
    wordCounts,
  ]);

  const totalMatchedWords = useMemo(() => {
    if (!debouncedQuery) {
      return wordCounts.all || 0;
    }

    return vocabularyData.filter((word) => matchesWordQuery(word, debouncedQuery)).length;
  }, [debouncedQuery, vocabularyData, wordCounts.all]);

  const focusWordIdByCategory = useMemo(() => {
    if (!debouncedQuery) {
      return new Map();
    }

    const map = new Map();
    categoriesWithCollections.forEach((category) => {
      if (category.type === 'collection' || category.id === 'toefl') {
        return;
      }

      const matchedWord =
        category.id === 'all'
          ? vocabularyData.find((word) => matchesWordQuery(word, debouncedQuery))
          : vocabularyData.find(
              (word) => wordBelongsToCategory(word, category.id) && matchesWordQuery(word, debouncedQuery)
            );

      if (matchedWord) {
        map.set(category.id, matchedWord.id);
      }
    });

    return map;
  }, [categoriesWithCollections, debouncedQuery, vocabularyData]);

  const handleCategoryClick = (category) => {
    if (category.id === 'learnedWords') {
      onOpenLearnedWords?.();
      return;
    }

    if (category.id === 'masteredWords') {
      onOpenMasteredWords?.();
      return;
    }

    if (category.id === 'todayReview') {
      onOpenTodayReview?.();
      return;
    }

    if (category.id === 'wrongWords') {
      onOpenWrongWords?.();
      return;
    }

    if (category.id === 'toefl') {
      onOpenToeflLevels?.();
      return;
    }

    const focusWordId = focusWordIdByCategory.get(category.id) ?? null;
    onCategorySelect(category.id, { focusWordId });
  };

  return (
    <div className="learn-refresh-page word-home-page">
      <header className="learn-refresh-topbar">
        <div className="learn-refresh-topbar-inner">
          <div className="learn-refresh-left-actions">
            <button type="button" className="learn-refresh-back" onClick={onBack} aria-label="返回学习方式选择">
              <span aria-hidden="true">←</span>
              <span>返回</span>
            </button>
            <button type="button" className="learn-refresh-home-btn" onClick={onHome} aria-label="回到首页">
              <span aria-hidden="true">🏠</span>
            </button>
          </div>

          <div className="learn-refresh-progress">
            <p className="learn-refresh-progress-main">{categoriesWithCollections.length} 类</p>
            <p className="learn-refresh-progress-sub">单词分类</p>
          </div>

          <div className="learn-refresh-top-actions">
            <button
              type="button"
              className="learn-refresh-icon-btn"
              onClick={onSyncAccount}
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
              onClick={onSpeakIntro}
              aria-label="播放单词分类提示"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 9v6h4l5 4V5L7 9H3z" />
                <path d="M16.5 8.5a4.5 4.5 0 010 7" />
                <path d="M19.5 6a8 8 0 010 12" />
              </svg>
            </button>
            <span className="learn-refresh-topbar-spacer" aria-hidden="true" />
          </div>
        </div>
      </header>

      <main className="learn-refresh-main word-home-main">
        <section className="learn-refresh-card learn-refresh-card-enter reading-list-card">
          <header className="reading-list-header">
            <h1 className="reading-list-title">英语单词卡片</h1>
            <p className="reading-list-subtitle">
              四六级核心词汇 · 结构化学习路径 · 更轻松的词汇复习体验
            </p>
          </header>

          {showAuthPanel && (
            <AuthPanel
              enabled={authEnabled}
              loading={authLoading}
              user={authUser}
              syncStatusText={syncStatusText}
              syncError={syncError}
              onLogin={onAuthLogin}
              onRegister={onAuthRegister}
              onLogout={onAuthLogout}
              onSyncNow={onAuthSyncNow}
            />
          )}

          <section className="word-home-search">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索分类或单词..."
                className="w-full min-h-[44px] rounded-[10px] border border-[#e5e7eb] bg-white px-4 py-3 pr-11 text-center text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] transition hover:text-[#6b7280]"
                >
                  ✕
                </button>
              )}
            </div>

            {debouncedQuery && (
              <p className="mt-3 text-center text-sm text-[#6b7280]">
                找到 {filteredCategories.length} 个分类，共 <span className="font-semibold text-[#111827]">{totalMatchedWords}</span>{' '}
                个匹配单词
              </p>
            )}
          </section>

          <section className="reading-category-section" aria-label="单词分类">
            <div className="reading-category-head">
              <h2 className="reading-category-title">
                {debouncedQuery ? '搜索结果' : '选择学习分类'}
              </h2>
              <p className="reading-category-sub">
                {debouncedQuery
                  ? `共 ${filteredCategories.length} 个匹配分类`
                  : `共 ${categoriesWithCollections.length} 个分类`}
              </p>
            </div>

            {filteredCategories.length === 0 ? (
              <div className="word-home-empty">
                <p className="text-base text-[#6b7280]">未找到匹配的分类或单词</p>
                <p className="mt-1 text-sm text-[#9ca3af]">尝试其他搜索词</p>
              </div>
            ) : (
              <div className="reading-category-grid">
                {filteredCategories.map((category) => {
                  const count = filteredWordCounts[category.id] || 0;

                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category)}
                      className="reading-category-card"
                    >
                      <span className="reading-category-icon" aria-hidden="true">
                        {category.icon}
                      </span>
                      <span className="reading-category-name">{category.name}</span>
                      <span className="reading-category-count">{count} 词</span>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {!debouncedQuery && (
            <section className="word-home-stats">
              <article className="word-home-stat-card">
                <p className="text-2xl font-semibold text-[#111827]">{wordCounts.all || 0}</p>
                <p className="text-sm text-[#6b7280]">总词汇量</p>
              </article>
              <article className="word-home-stat-card">
                <p className="text-2xl font-semibold text-[#111827]">{categoriesWithCollections.length}</p>
                <p className="text-sm text-[#6b7280]">学习分类</p>
              </article>
              <article className="word-home-stat-card">
                <p className="text-2xl font-semibold text-[#111827]">持续更新</p>
                <p className="text-sm text-[#6b7280]">更多词库可导入</p>
              </article>
            </section>
          )}
        </section>
      </main>
    </div>
  );
}

export default HomeScreen;
