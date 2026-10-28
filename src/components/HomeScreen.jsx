import ReadingReviewPanel from './reading/ReadingReviewPanel';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import categories from '../data/categories';
import AppLayout from './layout/AppLayout';
import { ModuleCard, BaseCard } from './ui/Cards';
import { StatsRow } from './modules/LearningModules';
import { ReadingPickerContent } from './reading/ReadingPicker';
import { buildReadingLevelOptions } from './reading/readingPickerModel';
import { calculateStudyStreak } from '../utils/learningMetrics';
import RecommendedReadings from './reading/RecommendedReadings';
import StudyCarousel from './home/StudyCarousel';
import { WORD_PICKER_VISUALS } from './training/pickerVisuals';
import '../styles/training-center.css';

const UI_ASSETS = {
  vocabulary: '/images/ui-assets/dashboard-flashcards-frosted-v1.png',
  reading: '/images/ui-assets/dashboard-reading-frosted-v1.png',
  review: '/images/ui-assets/dashboard-review-frosted-v1.png',
  target: '/images/ui-assets/dashboard-exam-frosted-v1.png',
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
  dailyTarget = 15,
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
  onRetryReading,
  authLoading = false,
  authUser = null,
  syncError = '',
  isDarkTheme = false,
  onThemeToggle,
  onVoiceSettings,
  panelRequest,
}) {
  const [activeTrainingPanel, setActiveTrainingPanel] = useState('');
  const [selectedReadingLevel, setSelectedReadingLevel] = useState('');
  const scrollFrame = useRef(null);
  const scrollToPanel = useCallback(panelId => {
    window.cancelAnimationFrame(scrollFrame.current);
    scrollFrame.current = window.requestAnimationFrame(() => {
      document.getElementById(panelId)?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  }, []);

  useEffect(() => () => window.cancelAnimationFrame(scrollFrame.current), []);

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

  const wordCards = useMemo(() => categoriesWithCollections.map(category => ({
    id: category.id,
    title: category.name,
    eyebrow: WORD_PICKER_VISUALS[category.id]?.eyebrow || '词汇训练',
    meta: `${categoryWordCounts[category.id] || 0} 词`,
    description: category.description,
    tone: 'blue',
    art: WORD_PICKER_VISUALS[category.id]?.art || UI_ASSETS.vocabulary,
    accent: WORD_PICKER_VISUALS[category.id]?.accent || 'ice',
    action: category.id,
    actionLabel: category.id === 'toefl' || category.id === 'ielts' ? '选择学习范围' : '开始学习',
  })), [categoriesWithCollections, categoryWordCounts]);

  const activeReadingLevel = useMemo(
    () => (selectedReadingLevel && readingLevelOptions.some((item) => item.id === selectedReadingLevel) ? selectedReadingLevel : ''),
    [readingLevelOptions, selectedReadingLevel]
  );
  const streak = useMemo(() => calculateStudyStreak(studyHistory), [studyHistory]);

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
    scrollToPanel('word-category-panel');
  };

  const handleOpenReadingPicker = () => {
    setActiveTrainingPanel('reading');
    setSelectedReadingLevel('');
    scrollToPanel('reading-category-panel');
  };

  const handleSelectReadingLevel = (levelId) => {
    setSelectedReadingLevel(levelId);
    scrollToPanel('reading-article-panel');
  };

  const handleTrainingModuleClick = moduleId => {
    if (moduleId === 'all') handleOpenWordPicker();
    else if (moduleId === 'reading') handleOpenReadingPicker();
    else if (moduleId === 'review') onOpenTodayReview?.();
    else if (moduleId === 'test') onOpenExamPractice?.();
  };

  const wordPanelOpen = activeTrainingPanel === 'words';
  const readingPanelOpen = activeTrainingPanel === 'reading';

  useEffect(() => {
    if (!panelRequest?.panel) return;

    const frame = window.requestAnimationFrame(() => {
      if (panelRequest.panel === 'reading') {
        setActiveTrainingPanel('reading');
        setSelectedReadingLevel('');
        scrollToPanel('reading-category-panel');
        return;
      }

      if (panelRequest.panel === 'words') {
        setActiveTrainingPanel('words');
        scrollToPanel('word-category-panel');
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [panelRequest, scrollToPanel]);

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
      helper: '从常用词到考试词汇，逐步积累',
      meta: `${wordCounts.all || 0} 词可学`,
      artSrc: UI_ASSETS.vocabulary,
      panel: 'words',
      panelId: 'word-category-panel',
    },
    {
      id: 'reading',
      variant: 'reading',
      title: '做阅读',
      helper: '通过真实文章提升理解能力',
      meta: `${readingCount} 篇短文`,
      artSrc: UI_ASSETS.reading,
      panel: 'reading',
      panelId: 'reading-category-panel',
    },
    {
      id: 'review',
      variant: 'review',
      title: '今日复习',
      helper: '跟随记忆节奏，巩固已学词汇',
      meta: todayReviewWordIds.length ? `${todayReviewWordIds.length} 个到期词` : '今日暂无到期词汇',
      artSrc: UI_ASSETS.review,
    },
    {
      id: 'test',
      variant: 'test',
      title: '做测试',
      helper: '多种题型，检验你的学习成果',
      meta: '测验 · 填空 · 拼写 · 连线',
      artSrc: UI_ASSETS.target,
    },
  ];

  return (
    <AppLayout
      className="training-home-shell"
      active="training"
      navItems={navItems}
      title="训练中心"
      subtitle="想自由切换时，可以从这里进入任意模块。"
      topbarProps={{
        mobileBrand: true,
        onCalendar: onOpenStatistics,
        onNotify: onOpenWrongWords,
        notifyBadge: wrongWordIds.length ? String(Math.min(wrongWordIds.length, 9)) : undefined,
        onThemeToggle,
        isDarkTheme,
        onVoiceSettings,
        onUserClick: onAuthOpen,
        userLabel: authUser?.email ? '学习者' : authLoading ? '同步中' : '未登录',
        sidebarProps: { studyHistory },
      }}
    >
      <div className="ds-stack training-home-content">
        <section className="ds-module-grid training-main-modules" aria-label="训练模块">
          {mainModules.map((module) => (
            <ModuleCard
              key={module.id}
              id={`training-module-${module.id}`}
              variant={module.variant}
              title={module.title}
              artSrc={module.artSrc}
              onClick={() => handleTrainingModuleClick(module.id)}
              active={Boolean(module.panel && activeTrainingPanel === module.panel)}
              aria-expanded={module.panel ? activeTrainingPanel === module.panel : undefined}
              aria-controls={module.panelId}
              meta={<><span className="training-module-helper">{module.helper}</span><span className="training-module-meta">{module.meta}</span></>}
            />
          ))}
        </section>

        <BaseCard
          id="word-category-panel"
          aria-labelledby="training-module-all"
          className={`word-home-category-panel training-picker-panel ${wordPanelOpen ? 'is-open' : ''}`}
        >
          <div className="word-home-category-head">
            <h2>选择词库</h2>
            <p>共 {vocabularyCategoryCount} 个词库分类</p>
            {syncError && <p className="word-home-sync-error">{syncError}</p>}
          </div>

          <StudyCarousel
            cards={wordCards}
            initialId="all"
            className="training-picker-carousel"
            label="词库选择预览"
            previousLabel="上一个词库"
            nextLabel="下一个词库"
            selectionLabel="选择词库预览"
            previewLabel={card => `预览${card.title}词库`}
            onAction={categoryId => {
              const category = categoriesWithCollections.find(item => item.id === categoryId);
              if (category) handleCategoryClick(category);
            }}
          />
        </BaseCard>

        <BaseCard
          id="reading-category-panel"
          aria-labelledby="training-module-reading"
          className={`word-home-category-panel training-picker-panel reading-home-category-panel ${readingPanelOpen ? 'is-open' : ''}`}
        >
          <ReadingPickerContent
            readings={readings}
            studyHistory={studyHistory}
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
          <ReadingReviewPanel key={authUser?.id || 'guest'} userId={authUser?.id} onRetry={onRetryReading} onChooseArticle={() => handleSelectReadingLevel(activeReadingLevel || 'all')} />
        </BaseCard>

        <RecommendedReadings readings={readings} onOpenArticle={(article) => {
          if (typeof onOpenReadingSession === 'function') onOpenReadingSession(article.id);
          else handleOpenReadingPicker();
        }} />

        <StatsRow streak={streak} target={dailyTarget} remaining={wordCounts.all || 0} />
      </div>
    </AppLayout>
  );
}

export default HomeScreen;
