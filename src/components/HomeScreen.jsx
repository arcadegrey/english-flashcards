import { useState, useEffect, useMemo, useCallback } from 'react';
import categories from '../data/categories';
import { wordBelongsToCategory } from '../utils/wordCategories';
import AppLayout from './layout/AppLayout';
import { HeroCard, ModuleCard, BaseCard } from './ui/Cards';
import { MotivationBand, StatsRow } from './modules/LearningModules';

const UI_ASSETS = {
  hero: '/images/ui-assets/hero-flashcards.png',
  review: '/images/ui-assets/review-complete.png',
  newWords: '/images/ui-assets/new-words.png',
  target: '/images/ui-assets/stat-target.png',
};

const matchesWordQuery = (word, query) =>
  word.word.toLowerCase().includes(query) ||
  word.meaning.toLowerCase().includes(query) ||
  (word.phonetic || '').toLowerCase().includes(query);

function HomeScreen({
  onCategorySelect,
  wordCounts,
  readingCount = 0,
  vocabularyData = [],
  learnedWordIds = [],
  masteredWordIds = [],
  todayReviewWordIds = [],
  wrongWordIds = [],
  onOpenLearnedWords,
  onOpenMasteredWords,
  onOpenTodayReview,
  onOpenWrongWords,
  onOpenStatistics,
  onOpenToeflLevels,
  onOpenIeltsLists,
  onBack,
  onHome,
  onOpenMode,
  onOpenReading,
  authLoading = false,
  authUser = null,
  syncStatusText = '',
  syncError = '',
  isDarkTheme = false,
  onThemeToggle,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

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

  const categoriesWithCollections = useMemo(() => categories, []);
  const vocabularyCategoryCount = useMemo(
    () => categoriesWithCollections.filter((category) => category.id !== 'all' && category.type !== 'collection').length,
    [categoriesWithCollections]
  );

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
      if (category.type === 'collection' || category.id === 'toefl' || category.id === 'ielts') {
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

    if (category.id === 'ielts') {
      onOpenIeltsLists?.();
      return;
    }

    const focusWordId = focusWordIdByCategory.get(category.id) ?? null;
    onCategorySelect(category.id, { focusWordId });
  };

  const handleOpenWordPicker = () => {
    setShowCategoryPicker(true);
    window.requestAnimationFrame(() => {
      document.getElementById('word-category-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const navItems = [
    {
      id: 'plan',
      label: '今日计划',
      icon: 'plan',
      onClick: onHome,
    },
    {
      id: 'training',
      label: '训练中心',
      icon: 'training',
      onClick: undefined,
    },
    {
      id: 'words',
      label: '背单词',
      icon: 'words',
      onClick: handleOpenWordPicker,
    },
    {
      id: 'reading',
      label: '阅读',
      icon: 'reading',
      onClick: onOpenReading,
    },
    {
      id: 'stats',
      label: '统计',
      icon: 'stats',
      onClick: onOpenStatistics,
    },
    {
      id: 'review',
      label: '复习',
      icon: 'review',
      onClick: onOpenTodayReview,
    },
    {
      id: 'test',
      label: '测试',
      icon: 'test',
      onClick: () => onOpenMode?.('quiz'),
    },
  ];

  const mainModules = [
    {
      id: 'all',
      title: '背单词',
      meta: `${wordCounts.all || 0} 词可学`,
      iconSrc: UI_ASSETS.newWords,
      artSrc: UI_ASSETS.newWords,
      onClick: handleOpenWordPicker,
    },
    {
      id: 'reading',
      title: '做阅读',
      meta: `${readingCount} 篇短文`,
      iconSrc: UI_ASSETS.hero,
      artSrc: UI_ASSETS.hero,
      onClick: onOpenReading,
    },
    {
      id: 'review',
      title: '今日复习',
      meta: `${todayReviewWordIds.length} 个到期词`,
      iconSrc: UI_ASSETS.review,
      artSrc: UI_ASSETS.review,
      onClick: onOpenTodayReview,
    },
    {
      id: 'test',
      title: '做测试',
      meta: '挑战自我，检验学习成效',
      iconSrc: UI_ASSETS.target,
      artSrc: UI_ASSETS.target,
      onClick: () => onOpenMode?.('quiz'),
    },
  ];

  return (
    <AppLayout
      active="training"
      navItems={navItems}
      title="训练中心"
      subtitle="想自由切换时，可以从这里进入任意模块。"
      topbarProps={{
        searchValue: searchQuery,
        searchPlaceholder: '搜索单词、短文或功能...',
        onSearchChange: setSearchQuery,
        onCalendar: onOpenStatistics,
        onNotify: onOpenWrongWords,
        notifyBadge: wrongWordIds.length ? String(Math.min(wrongWordIds.length, 9)) : undefined,
        onThemeToggle,
        isDarkTheme,
        onUserClick: onBack,
        userLabel: authUser?.email ? '小明同学' : authLoading ? '同步中' : syncStatusText || '小明同学',
      }}
    >
      <div className="ds-stack">
        <HeroCard
          soft
          label="English Flashcards"
          title="全部训练入口"
          subtitle="想自由切换时，可以从这里进入任意模块。"
          illustrationSrc={UI_ASSETS.hero}
        />

        <section className="ds-module-grid" aria-label="训练模块">
          {mainModules.map((module) => (
            <ModuleCard key={module.id} {...module} />
          ))}
        </section>

        <MotivationBand />

        {debouncedQuery && (
          <BaseCard className="word-home-search-result">
            找到 {filteredCategories.length} 个分类，共 <strong>{totalMatchedWords}</strong> 个匹配单词
          </BaseCard>
        )}

        <BaseCard
          id="word-category-panel"
          className={`word-home-category-panel ${showCategoryPicker ? 'is-open' : ''}`}
        >
          <div className="word-home-category-head">
            <h2>{debouncedQuery ? '搜索结果' : '选择学习分类'}</h2>
            <p>
              {debouncedQuery
                ? `共 ${filteredCategories.length} 个匹配分类`
                : `共 ${vocabularyCategoryCount} 个词库分类`}
            </p>
            {syncError && <p className="word-home-sync-error">{syncError}</p>}
          </div>

          {filteredCategories.length === 0 ? (
            <div className="word-home-empty">
              <p>未找到匹配的分类或单词</p>
              <p>尝试其他搜索词</p>
            </div>
          ) : (
            <div className="ds-categories-grid">
              {filteredCategories.map((category) => {
                const count = filteredWordCounts[category.id] || 0;

                return (
                  <ModuleCard
                    key={category.id}
                    title={category.name}
                    meta={`${count} 词`}
                    onClick={() => handleCategoryClick(category)}
                  />
                );
              })}
            </div>
          )}
        </BaseCard>

        <StatsRow streak="3" target="15" remaining={wordCounts.all || 0} />
      </div>
    </AppLayout>
  );
}

export default HomeScreen;
