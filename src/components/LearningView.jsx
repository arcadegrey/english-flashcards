import { LoadingAnimation } from './ui/LoadingState';
import WordStudyWorkspace from './learning/WordStudyWorkspace';
import WordStudySidebar from './learning/WordStudySidebar';
import { lazy, useEffect, useMemo, useRef, useState } from 'react';
import { loadAssessmentSession } from '../utils/learningViewLoader.js';
import QuickMenu from './QuickMenu';
import AppLayout from './layout/AppLayout';
import { QUICK_MENU_MODE_OPTIONS } from './quickMenuOptions';
import { gsap, prefersReducedMotion, useGSAP } from '../utils/gsapMotion';
import { calculateStudyStreak, getWeekStudyDays } from '../utils/learningMetrics';
import { getExamVocabulary, getPlanVocabulary } from '../utils/studyPlan';
import { getCategoryById } from '../data/categories';
import { COLLECTION_PRACTICE_SOURCES } from '../../shared/collectionPractice.js';
import '../styles/study-word.css';

const AssessmentSession = lazy(loadAssessmentSession);

function LearningView({
  mode,
  setMode,
  allVocabulary,
  vocabularyLoading = false,
  currentWord,
  nextWord,
  filteredVocabulary,
  currentIndex,
  onMarkLearned,
  onMarkMastered,
  masteredWords,
  examScope = 'learned',
  examCategory = 'all',
  categoryName = '全部单词',
  dailyTarget,
  todayWordsStudied = 0,
  onAddMastered,
  onWrongAnswer,
  onAssessmentAnswer,
  learnedWords,
  onBack,
  onHome,
  onSyncAccount,
  onOpenReading,
  onOpenStudyHub,
  onOpenWordStudy,
  onOpenTodayReview,
  onOpenExamPractice,
  onOpenStatistics,
  onOpenWrongWords,
  onThemeToggle,
  onVoiceSettings,
  isDarkTheme = false,
  onUserClick,
  userLabel = '学习者',
  studyHistory = [],
  focusedPractice,
}) {
  const [hintOpenForWordId, setHintOpenForWordId] = useState(null);
  const [toast, setToast] = useState('');
  const mainRef = useRef(null);

  const examOptionVocabulary = useMemo(() => focusedPractice?.words || getPlanVocabulary(allVocabulary, examCategory), [allVocabulary, examCategory, focusedPractice?.words]);
  const examVocabulary = useMemo(() => {
    if (focusedPractice) return focusedPractice.words;
    // Recording an answer must not replace the full-category pool and reset the round.
    if (examScope === 'all') return examOptionVocabulary;
    return getExamVocabulary(examOptionVocabulary, { scope: examScope, learnedWords, masteredWords });
  }, [examOptionVocabulary, examScope, learnedWords, masteredWords, focusedPractice]);
  const examCategoryName = getCategoryById(examCategory).name;
  const examSourceLabel =
    examScope === 'mastered'
      ? '标记认识范围'
      : examScope === 'all'
        ? examCategory === 'all' ? '全范围随机' : `${examCategoryName}随机`
        : '已学习范围';
  const examSourceTitle = focusedPractice
    ? `${COLLECTION_PRACTICE_SOURCES[focusedPractice.snapshot.source]} · 定向练习`
    : examCategory === 'all' || examScope === 'all' ? examSourceLabel : `${examCategoryName} · ${examSourceLabel}`;

  const totalCount = mode === 'learn' ? filteredVocabulary.length : examVocabulary.length;
  const progressCurrent = totalCount > 0 ? Math.min(currentIndex + 1, totalCount) : 0;
  const progressPercent = totalCount > 0 ? Math.max(1, Math.round((progressCurrent / totalCount) * 100)) : 0;
  const hasDailyGoal = Number.isFinite(dailyTarget) && dailyTarget > 0;
  const studyGoalTarget = hasDailyGoal ? dailyTarget : totalCount;
  const studyGoalCurrent = hasDailyGoal ? Math.min(todayWordsStudied, dailyTarget) : progressCurrent;
  const studyGoalPercent = hasDailyGoal ? Math.round((studyGoalCurrent / dailyTarget) * 100) : progressPercent;
  const remainingCount = Math.max(totalCount - progressCurrent, 0);
  const learnedTotal = useMemo(() => getExamVocabulary(filteredVocabulary, { scope: 'learned', learnedWords }).length,
    [filteredVocabulary, learnedWords]);
  const masteredTotal = useMemo(() => getExamVocabulary(filteredVocabulary, { scope: 'mastered', masteredWords }).length,
    [filteredVocabulary, masteredWords]);
  const currentModeMeta = QUICK_MENU_MODE_OPTIONS.find((item) => item.id === mode) || QUICK_MENU_MODE_OPTIONS[0];
  const currentWordId = currentWord?.id ?? null;
  const showHint = currentWordId != null && String(hintOpenForWordId) === String(currentWordId);
  const streak = useMemo(() => calculateStudyStreak(studyHistory), [studyHistory]);
  const weekDays = useMemo(() => getWeekStudyDays(studyHistory), [studyHistory]);

  useEffect(() => {
    if (!toast || toast === '正在同步账号...') {
      return undefined;
    }

    const timer = setTimeout(() => {
      setToast('');
    }, 1600);

    return () => clearTimeout(timer);
  }, [toast]);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const main = mainRef.current;
    const card = main?.querySelector('.learn-refresh-card');
    if (!card) return;

    gsap.fromTo(
      card,
      { y: 14, autoAlpha: 0.86, scale: 0.992 },
      { y: 0, autoAlpha: 1, scale: 1, duration: 0.34, ease: 'power2.out', clearProps: 'transform,opacity,visibility' }
    );
  }, { dependencies: [mode], scope: mainRef, revertOnUpdate: true });

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
    onMarkLearned();
    setToast('已加入复习队列');
    setHintOpenForWordId(null);
  };

  const handleMarkKnown = () => {
    onMarkMastered();
    setToast('已标记认识，仍按计划复习');
    setHintOpenForWordId(null);
  };

  const handleToggleHint = () => {
    if (currentWordId == null) {
      return;
    }
    setHintOpenForWordId((prev) => (String(prev) === String(currentWordId) ? null : currentWordId));
  };

  const sidebarItems = [
    { id: 'plan', label: '今日计划', icon: 'plan', onClick: onHome },
    { id: 'training', label: '训练中心', icon: 'training', onClick: onOpenStudyHub || onBack },
    { id: 'words', label: '背单词', icon: 'words', onClick: onOpenWordStudy || onBack },
    { id: 'reading', label: '阅读', icon: 'reading', onClick: onOpenReading },
    { id: 'review', label: '复习', icon: 'review', onClick: onOpenTodayReview },
    { id: 'test', label: '测试', icon: 'test', onClick: onOpenExamPractice || (() => setMode('quiz')) },
    { id: 'stats', label: '统计', icon: 'stats', onClick: onOpenStatistics },
  ].filter((item) => typeof item.onClick === 'function');

  if (mode === 'learn') {
    return (
      <AppLayout
        className="ds-app-layout--mobile-study"
        active="words"
        navItems={sidebarItems}
        title="背单词"
        subtitle={`${categoryName} · 今日目标 ${studyGoalTarget} · 当前进度 ${progressCurrent}/${totalCount}`}
        topbarProps={{
          onCalendar: onOpenStatistics,
          onThemeToggle,
          isDarkTheme,
          onVoiceSettings,
          onNotify: onOpenWrongWords || onOpenTodayReview,
          onUserClick: onUserClick || onHome,
          userLabel,
          sidebarProps: { studyHistory },
        }}
      >
        <div ref={mainRef} className="learn-refresh-main learn-refresh-main--study">
          <div className="learn-refresh-study-layout">
            <WordStudyWorkspace onBack={onBack} onVoiceSettings={onVoiceSettings}
              progressCurrent={progressCurrent} totalCount={totalCount} hasDailyGoal={hasDailyGoal}
              studyGoalCurrent={studyGoalCurrent} studyGoalTarget={studyGoalTarget} studyGoalPercent={studyGoalPercent}
              vocabularyLoading={vocabularyLoading} currentWord={currentWord} currentIndex={currentIndex}
              nextWord={nextWord} showHint={showHint} onMarkUnknown={handleMarkUnknown}
              onToggleHint={handleToggleHint} onMarkKnown={handleMarkKnown} />
            <WordStudySidebar mode={mode} onOpenMode={setMode} onOpenReading={onOpenReading}
              onNotice={setToast} onSyncAccount={handleSyncAccount} streak={streak}
              studyGoalTarget={studyGoalTarget} remainingCount={remainingCount} studyGoalPercent={studyGoalPercent}
              learnedTotal={learnedTotal} masteredTotal={masteredTotal} weekDays={weekDays} />
          </div>
        </div>
        {toast && (
          <div className="learn-refresh-toast" role="status" aria-live="polite">
            {toast === '正在同步账号...' && <LoadingAnimation compact />}{toast}
          </div>
        )}
      </AppLayout>
    );
  }

  return (
    <AppLayout
      active="test"
      navItems={sidebarItems}
      title={currentModeMeta.label}
      subtitle={`${examSourceTitle} · ${totalCount} 词`}
      topbarProps={{
        onCalendar: onOpenStatistics,
        onThemeToggle,
        isDarkTheme,
        onVoiceSettings,
        onNotify: onOpenWrongWords || onOpenTodayReview,
        onUserClick: onUserClick || onHome,
        userLabel,
        sidebarProps: { studyHistory },
      }}
    >
      <main ref={mainRef} className="learn-refresh-main learn-refresh-main--assessment">
        <section className={`assessment-study-shell test-workspace is-${mode}`} aria-label="测试进行中">
          <AssessmentSession
            key={`${mode}:${examCategory}:${examScope}${focusedPractice ? `:${focusedPractice.snapshot.key}` : ''}`}
            mode={mode}
            category={examCategory}
            scope={examScope}
            vocabulary={examVocabulary}
            optionVocabulary={examOptionVocabulary}
            sourceLabel={examSourceTitle}
            tools={<QuickMenu mode={mode} onOpenMode={setMode} onOpenReading={onOpenReading} onSlowSpeechChange={setToast} />}
            onAddMastered={onAddMastered}
            onWrongAnswer={onWrongAnswer}
            onAnswer={onAssessmentAnswer}
            onBack={onBack}
            collectionSnapshot={focusedPractice?.snapshot}
          />
        </section>
      </main>

      {toast && (
        <div className="learn-refresh-toast" role="status" aria-live="polite">
          {toast === '正在同步账号...' && <LoadingAnimation compact />}{toast}
        </div>
      )}
    </AppLayout>
  );
}

export default LearningView;
