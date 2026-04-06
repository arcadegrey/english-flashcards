import { useState, useEffect, useMemo } from 'react';
import categories from '../data/categories';
import AuthPanel from './AuthPanel';

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
  onOpenLearnedWords,
  onOpenMasteredWords,
  onOpenToeflLevels,
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

  const learnedIdSet = useMemo(() => new Set(learnedWordIds), [learnedWordIds]);
  const masteredIdSet = useMemo(() => new Set(masteredWordIds), [masteredWordIds]);

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
        const targetSet = category.id === 'learnedWords' ? learnedIdSet : masteredIdSet;
        return vocabularyData.some((word) => targetSet.has(word.id) && matchesWordQuery(word, debouncedQuery));
      }

      return vocabularyData.some(
        (word) => word.category === category.id && matchesWordQuery(word, debouncedQuery)
      );
    });
  }, [categoriesWithCollections, debouncedQuery, learnedIdSet, masteredIdSet, vocabularyData]);

  const filteredWordCounts = useMemo(() => {
    const counts = {
      ...wordCounts,
      learnedWords: learnedWordIds.length,
      masteredWords: masteredWordIds.length,
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
        const targetSet = category.id === 'learnedWords' ? learnedIdSet : masteredIdSet;
        counts[category.id] = vocabularyData.filter(
          (word) => targetSet.has(word.id) && matchesWordQuery(word, debouncedQuery)
        ).length;
        return;
      }

      counts[category.id] = vocabularyData.filter(
        (word) => word.category === category.id && matchesWordQuery(word, debouncedQuery)
      ).length;
    });

    return counts;
  }, [
    debouncedQuery,
    filteredCategories,
    learnedIdSet,
    learnedWordIds.length,
    masteredIdSet,
    masteredWordIds.length,
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
              (word) => word.category === category.id && matchesWordQuery(word, debouncedQuery)
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

    if (category.id === 'toefl') {
      onOpenToeflLevels?.();
      return;
    }

    const focusWordId = focusWordIdByCategory.get(category.id) ?? null;
    onCategorySelect(category.id, { focusWordId });
  };

  const cardClass =
    'rounded-[14px] border border-[#e5e7eb] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.08)]';

  const iconStyleById = {
    learnedWords: 'bg-sky-100 text-sky-700',
    masteredWords: 'bg-emerald-100 text-emerald-700',
    all: 'bg-indigo-100 text-indigo-700',
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-base leading-[1.6] text-[#111827]">
      <div className="w-full px-4 py-8 space-y-14" style={{ maxWidth: '960px', marginInline: 'auto' }}>
        <header className="space-y-4">
          <div className={`${cardClass} p-5 md:p-6`}>
            <div className="text-center">
              <div>
                <h1 className="text-[32px] font-bold leading-tight text-[#111827]">英语单词卡片</h1>
                <p className="mt-2 text-base leading-[1.6] text-[#6b7280]">
                  四六级核心词汇 · 结构化学习路径 · 更轻松的词汇复习体验
                </p>
              </div>
            </div>
          </div>
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

        <section className="rounded-[14px] border border-[#e5e7eb] bg-[#f5f5f7] p-5 shadow-[0_1px_3px_rgba(15,23,42,0.08)] md:p-6">
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

        <section className={`${cardClass} p-5 md:p-6`}>
          <div className="mb-5 space-y-1 text-center">
            <h2 className="text-2xl font-semibold text-[#111827]">
              {debouncedQuery ? '搜索结果' : '选择学习分类'}
            </h2>
            <p className="text-sm text-[#6b7280]">
              {debouncedQuery
                ? `共 ${filteredCategories.length} 个匹配分类`
                : `共 ${categoriesWithCollections.length} 个分类`}
            </p>
          </div>

          {filteredCategories.length === 0 ? (
            <div className={`p-6 text-center ${cardClass}`}>
              <p className="text-base text-[#6b7280]">未找到匹配的分类或单词</p>
              <p className="mt-1 text-sm text-[#9ca3af]">尝试其他搜索词</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              {filteredCategories.map((category) => {
                const count = filteredWordCounts[category.id] || 0;
                const iconStyle = iconStyleById[category.id] || 'bg-slate-100 text-slate-600';

                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    className="group min-h-[44px] rounded-[14px] border border-[#e5e7eb] bg-white p-3 text-center shadow-[0_1px_3px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-[2px] hover:border-[#0071e3] hover:bg-[#0071e3] md:p-4"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-[10px] text-base transition-colors duration-200 ${iconStyle} group-hover:bg-white/20 group-hover:text-white sm:h-9 sm:w-9 sm:text-lg`}
                        aria-hidden="true"
                      >
                        {category.icon}
                      </span>
                      <div className="min-w-0 text-center">
                        <p className="text-sm font-semibold leading-tight text-[#111827] transition-colors duration-200 group-hover:text-white sm:text-base">
                          {category.name}
                        </p>
                        <p className="text-xs text-[#6b7280] transition-colors duration-200 group-hover:text-white/90 sm:text-sm">
                          {count} 词
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {!debouncedQuery && (
          <section className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <article className={`${cardClass} p-4 text-center`}>
              <p className="text-2xl font-semibold text-[#111827]">{wordCounts.all || 0}</p>
              <p className="text-sm text-[#6b7280]">总词汇量</p>
            </article>
            <article className={`${cardClass} p-4 text-center`}>
              <p className="text-2xl font-semibold text-[#111827]">{categoriesWithCollections.length}</p>
              <p className="text-sm text-[#6b7280]">学习分类</p>
            </article>
            <article className={`${cardClass} col-span-2 p-4 text-center md:col-span-1`}>
              <p className="text-2xl font-semibold text-[#111827]">持续更新</p>
              <p className="text-sm text-[#6b7280]">更多词库可导入</p>
            </article>
          </section>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
