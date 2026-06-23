import { useEffect, useState, useMemo } from 'react';
import categories from '../data/categories';
import AppLayout from './layout/AppLayout';
import { HeroCard, ModuleCard, BaseCard } from './ui/Cards';
import { MotivationBand, StatsRow } from './modules/LearningModules';
import { ReadingPickerContent } from './reading/ReadingPicker';
import { buildReadingLevelOptions } from './reading/readingPickerModel';

const UI_ASSETS = {
  hero: '/images/ui-assets/training-hero-flashcards-blue-v1.png',
  vocabulary: '/images/ui-assets/training-card-vocabulary-blue-v1.png',
  reading: '/images/ui-assets/training-card-reading-blue-v1.png',
  review: '/images/ui-assets/training-card-review-blue-v1.png',
  target: '/images/ui-assets/training-card-test-blue-v1.png',
};

const CATEGORY_ART = {
  all: '/images/ui-assets/category-all-words-blue-v1.png',
  daily: '/images/ui-assets/category-daily-words-blue-v1.png',
  cet4: '/images/ui-assets/category-cet4-blue-v1.png',
  cet6: '/images/ui-assets/category-cet6-blue-v1.png',
  toefl: '/images/ui-assets/category-toefl-blue-v1.png',
  ielts: '/images/ui-assets/category-ielts-blue-v1.png',
};

function HomeScreen({
  onCategorySelect,
  wordCounts,
  readingCount = 0,
  readings = [],
  learnedWordIds = [],
  masteredWordIds = [],
  todayReviewWordIds = [],
  wrongWordIds = [],
  studyHistory = [],
  onOpenLearnedWords,
  onOpenMasteredWords,
  onOpenTodayReview,
  onOpenWrongWords,
  onOpenStatistics,
  onOpenExamPractice,
  onOpenToeflLevels,
  onOpenIeltsLists,
  onHome,
  onAuthOpen,
  onOpenReading,
  onOpenReadingSession,
  authLoading = false,
  authUser = null,
  syncError = '',
  isDarkTheme = false,
  onThemeToggle,
  panelRequest,
}) {
  const [activeTrainingPanel, setActiveTrainingPanel] = useState('');
  const [selectedReadingLevel, setSelectedReadingLevel] = useState('');

  const categoriesWithCollections = categories;
  const vocabularyCategoryCount = useMemo(
    () => categoriesWithCollections.filter((category) => category.id !== 'all' && category.type !== 'collection').length,
    [categoriesWithCollections]
  );

  const categoryWordCounts = useMemo(
    () => ({
      ...wordCounts,
      learnedWords: learnedWordIds.length,
      masteredWords: masteredWordIds.length,
      todayReview: todayReviewWordIds.length,
      wrongWords: wrongWordIds.length,
    }),
    [learnedWordIds.length, masteredWordIds.length, todayReviewWordIds.length, wordCounts, wrongWordIds.length]
  );

  const readingLevelOptions = useMemo(() => buildReadingLevelOptions(readings), [readings]);

  const activeReadingLevel = useMemo(
    () => (selectedReadingLevel && readingLevelOptions.some((item) => item.id === selectedReadingLevel) ? selectedReadingLevel : ''),
    [readingLevelOptions, selectedReadingLevel]
  );

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

    onCategorySelect(category.id, { focusWordId: null });
  };

  const handleOpenWordPicker = () => {
    setActiveTrainingPanel('words');
    window.requestAnimationFrame(() => {
      document.getElementById('word-category-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleOpenReadingPicker = () => {
    setActiveTrainingPanel('reading');
    setSelectedReadingLevel('');
    window.requestAnimationFrame(() => {
      document.getElementById('reading-category-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleSelectReadingLevel = (levelId) => {
    setSelectedReadingLevel(levelId);
    window.requestAnimationFrame(() => {
      document.getElementById('reading-article-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const wordPanelOpen = activeTrainingPanel === 'words';
  const readingPanelOpen = activeTrainingPanel === 'reading';

  useEffect(() => {
    if (!panelRequest?.panel) return;

    const frame = window.requestAnimationFrame(() => {
      if (panelRequest.panel === 'reading') {
        setActiveTrainingPanel('reading');
        setSelectedReadingLevel('');
        window.requestAnimationFrame(() => {
          document.getElementById('reading-category-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        return;
      }

      if (panelRequest.panel === 'words') {
        setActiveTrainingPanel('words');
        window.requestAnimationFrame(() => {
          document.getElementById('word-category-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [panelRequest]);

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
      label: '单词',
      icon: 'words',
      onClick: handleOpenWordPicker,
    },
    {
      id: 'reading',
      label: '阅读',
      icon: 'reading',
      onClick: handleOpenReadingPicker,
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
      onClick: onOpenExamPractice,
    },
    {
      id: 'stats',
      label: '统计',
      icon: 'stats',
      onClick: onOpenStatistics,
    },
  ];

  const mainModules = [
    {
      id: 'all',
      variant: 'vocabulary',
      title: '背单词',
      meta: `${wordCounts.all || 0} 词可学`,
      artSrc: UI_ASSETS.vocabulary,
      onClick: handleOpenWordPicker,
    },
    {
      id: 'reading',
      variant: 'reading',
      title: '做阅读',
      meta: `${readingCount} 篇短文`,
      artSrc: UI_ASSETS.reading,
      onClick: handleOpenReadingPicker,
    },
    {
      id: 'review',
      variant: 'review',
      title: '今日复习',
      meta: `${todayReviewWordIds.length} 个到期词`,
      artSrc: UI_ASSETS.review,
      onClick: onOpenTodayReview,
    },
    {
      id: 'test',
      variant: 'test',
      title: '做测试',
      meta: '挑战自我，检验学习成效',
      artSrc: UI_ASSETS.target,
      onClick: onOpenExamPractice,
    },
  ];

  return (
    <AppLayout
      active="training"
      navItems={navItems}
      title="训练中心"
      subtitle="想自由切换时，可以从这里进入任意模块。"
      topbarProps={{
        onCalendar: onOpenStatistics,
        onNotify: onOpenWrongWords,
        notifyBadge: wrongWordIds.length ? String(Math.min(wrongWordIds.length, 9)) : undefined,
        onThemeToggle,
        isDarkTheme,
        onUserClick: onAuthOpen,
        userLabel: authUser?.email ? '学习者' : authLoading ? '同步中' : '未登录',
        sidebarProps: { studyHistory },
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

        <BaseCard
          id="word-category-panel"
          className={`word-home-category-panel training-picker-panel ${wordPanelOpen ? 'is-open' : ''}`}
        >
          <div className="word-home-category-head">
            <h2>选择学习分类</h2>
            <p>共 {vocabularyCategoryCount} 个词库分类</p>
            {syncError && <p className="word-home-sync-error">{syncError}</p>}
          </div>

          <div className="ds-categories-grid">
            {categoriesWithCollections.map((category) => {
              const count = categoryWordCounts[category.id] || 0;

              return (
                <ModuleCard
                  key={category.id}
                  variant="category"
                  title={category.name}
                  meta={`${count} 词`}
                  artSrc={CATEGORY_ART[category.id] || UI_ASSETS.vocabulary}
                  onClick={() => handleCategoryClick(category)}
                />
              );
            })}
          </div>
        </BaseCard>

        <BaseCard
          id="reading-category-panel"
          className={`word-home-category-panel training-picker-panel reading-home-category-panel ${readingPanelOpen ? 'is-open' : ''}`}
        >
          <ReadingPickerContent
            readings={readings}
            activeLevel={activeReadingLevel}
            onSelectLevel={handleSelectReadingLevel}
            onBackToLevels={() => setSelectedReadingLevel('')}
            onOpenArticle={(article) => {
              if (typeof onOpenReadingSession === 'function') {
                onOpenReadingSession(article.id);
                return;
              }
              onOpenReading?.();
            }}
          />
        </BaseCard>

        <MotivationBand />

        <StatsRow streak="3" target="15" remaining={wordCounts.all || 0} />
      </div>
    </AppLayout>
  );
}

export default HomeScreen;
