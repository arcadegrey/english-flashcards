import { useEffect, useMemo, useRef, useState } from 'react';
import WordCard from './WordCard';
import Quiz from './Quiz';
import FillBlank from './FillBlank';
import SpellingTest from './SpellingTest';
import MatchingTest from './MatchingTest';
import QuickMenu from './QuickMenu';
import AppLayout from './layout/AppLayout';
import { QUICK_MENU_MODE_OPTIONS } from './quickMenuOptions';
import { gsap, prefersReducedMotion, useGSAP } from '../utils/gsapMotion';
import '../styles/word-learning-refresh.css';

function LearningView({
  mode,
  setMode,
  allVocabulary,
  currentWord,
  filteredVocabulary,
  currentIndex,
  onMarkLearned,
  onMarkMastered,
  masteredWords,
  examScope = 'learned',
  onAddMastered,
  onWrongAnswer,
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
  isDarkTheme = false,
  onUserClick,
  userLabel = '学习者',
}) {
  const [hintOpenForWordId, setHintOpenForWordId] = useState(null);
  const [toast, setToast] = useState('');
  const mainRef = useRef(null);

  const learnedWordSet = useMemo(() => new Set(learnedWords.map(String)), [learnedWords]);
  const masteredWordSet = useMemo(() => new Set(masteredWords.map(String)), [masteredWords]);
  const learnedVocabulary = useMemo(
    () => allVocabulary.filter((word) => learnedWordSet.has(String(word.id))),
    [allVocabulary, learnedWordSet]
  );
  const masteredVocabulary = useMemo(
    () => allVocabulary.filter((word) => masteredWordSet.has(String(word.id))),
    [allVocabulary, masteredWordSet]
  );
  const examVocabulary = useMemo(() => {
    if (examScope === 'mastered') return masteredVocabulary;
    if (examScope === 'all') return allVocabulary;
    return learnedVocabulary;
  }, [allVocabulary, examScope, learnedVocabulary, masteredVocabulary]);
  const examSourceLabel =
    examScope === 'mastered'
      ? '已掌握范围'
      : examScope === 'all'
        ? '全范围随机'
        : '已学习范围';

  const totalCount = filteredVocabulary.length;
  const progressCurrent = totalCount > 0 ? Math.min(currentIndex + 1, totalCount) : 0;
  const progressPercent = totalCount > 0 ? Math.max(1, Math.round((progressCurrent / totalCount) * 100)) : 0;
  const assessmentTotal = Math.min(Math.max(totalCount, 1), 20);
  const assessmentCurrent = Math.min(Math.max(progressCurrent, 1), assessmentTotal);
  const assessmentProgressPercent = Math.round((assessmentCurrent / assessmentTotal) * 100);
  const remainingCount = Math.max(totalCount - progressCurrent, 0);
  const learnedTotal = learnedWords.length;
  const masteredTotal = masteredWords.length;
  const currentModeMeta = QUICK_MENU_MODE_OPTIONS.find((item) => item.id === mode) || QUICK_MENU_MODE_OPTIONS[0];
  const currentWordId = currentWord?.id ?? null;
  const showHint = currentWordId != null && String(hintOpenForWordId) === String(currentWordId);

  useEffect(() => {
    if (!toast) {
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
    setToast('已标记为“认识”');
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

  const studyContent = (
    <div className="learn-refresh-study-layout">
      <section className="learn-refresh-study-workspace" aria-label="单词学习">
        <header className="learn-refresh-mobile-study-header">
          <button type="button" className="learn-refresh-mobile-back" onClick={onBack} aria-label="返回">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h1>背单词</h1>
          <div className="learn-refresh-mobile-progress-pill" aria-label={`当前进度 ${progressCurrent}/${totalCount}`}>
            <strong>{progressCurrent}</strong>
            <span>/ {totalCount}</span>
          </div>
        </header>

        <div className="learn-refresh-goal-strip">
          <span className="learn-refresh-goal-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8" />
              <circle cx="12" cy="12" r="3" />
              <path d="m15.5 8.5 3-3" />
              <path d="M17 5.5h3v3" />
            </svg>
          </span>
          <span className="learn-refresh-goal-label">今日目标</span>
          <strong>{totalCount}</strong>
          <div className="learn-refresh-goal-track" aria-hidden="true">
            <span style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="learn-refresh-goal-percent">{progressPercent}%</span>
        </div>

        <WordCard
          key={`${currentWord?.id || 'learn-empty'}-${currentIndex}`}
          word={currentWord}
          showHint={showHint}
        />

        <footer className="learn-refresh-bottombar">
          <div className="learn-refresh-bottombar-inner">
            <button
              type="button"
              className="learn-refresh-action learn-refresh-action-secondary"
              onClick={handleMarkUnknown}
            >
              <span className="learn-refresh-action-icon" aria-hidden="true">?</span>
              <span>不认识</span>
            </button>
            <button
              type="button"
              className="learn-refresh-action learn-refresh-action-ghost"
              onClick={handleToggleHint}
            >
              <span className="learn-refresh-action-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                  <path d="M8.5 14.5A6 6 0 1 1 15.5 14c-.9.7-1.5 1.7-1.5 3h-4c0-1.2-.5-2-1.5-2.5Z" />
                </svg>
              </span>
              <span>{showHint ? '收起提示' : '显示提示'}</span>
            </button>
            <button
              type="button"
              className="learn-refresh-action learn-refresh-action-primary"
              onClick={handleMarkKnown}
            >
              <span className="learn-refresh-action-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="m6 12 4 4 8-8" />
                </svg>
              </span>
              <span>认识了</span>
            </button>
          </div>
        </footer>
      </section>

      <aside className="learn-refresh-study-aside" aria-label="学习状态">
        <div className="learn-refresh-side-tools">
          <button type="button" className="learn-refresh-side-tool" onClick={handleSyncAccount}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 6v5h-5" />
              <path d="M4 18v-5h5" />
              <path d="M6.2 9A7 7 0 0118.5 7.5L20 11" />
              <path d="M17.8 15A7 7 0 015.5 16.5L4 13" />
            </svg>
            <span>同步进度</span>
          </button>
          <QuickMenu
            mode={mode}
            onOpenMode={setMode}
            onOpenReading={onOpenReading}
            onSlowSpeechChange={setToast}
          />
        </div>

        <div className="learn-refresh-side-summary">
          <div className="learn-refresh-side-row">
            <span className="learn-refresh-side-icon is-flame" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 22c4 0 7-2.8 7-6.9 0-2.7-1.4-4.9-4.1-6.7.1 1.8-.5 3.1-1.7 4-1-3.2-2.9-5.7-5.7-7.4.4 3-.1 5.1-1.7 6.9A6.4 6.4 0 0 0 5 15.1C5 19.2 8 22 12 22Z" />
              </svg>
            </span>
            <span>连续打卡</span>
            <strong>3 天</strong>
          </div>
          <div className="learn-refresh-side-row">
            <span className="learn-refresh-side-icon is-target" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" />
                <circle cx="12" cy="12" r="3" />
                <path d="m15.5 8.5 3-3" />
              </svg>
            </span>
            <span>今日目标</span>
            <strong>{totalCount} 词</strong>
          </div>
          <div className="learn-refresh-side-row">
            <span className="learn-refresh-side-icon is-star" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="m12 3 2.6 5.4 5.9.8-4.2 4.1 1 5.8L12 16.4 6.7 19.1l1-5.8-4.2-4.1 5.9-.8L12 3Z" />
              </svg>
            </span>
            <span>剩余词汇</span>
            <strong>{remainingCount} 词</strong>
          </div>
        </div>

        <div className="learn-refresh-side-card">
          <h2>学习进度</h2>
          <div className="learn-refresh-ring-row">
            <div className="learn-refresh-ring" style={{ '--study-progress': `${progressPercent}%` }}>
              <div>
                <strong>{progressPercent}%</strong>
                <span>今日进度</span>
              </div>
            </div>
            <dl className="learn-refresh-ring-stats">
              <div>
                <dt><span className="is-blue" />已学单词</dt>
                <dd>{learnedTotal}</dd>
              </div>
              <div>
                <dt><span className="is-purple" />今日目标</dt>
                <dd>{totalCount}</dd>
              </div>
              <div>
                <dt><span className="is-gray" />已掌握</dt>
                <dd>{masteredTotal}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="learn-refresh-side-card learn-refresh-week-card">
          <h2>坚持每天进步一点点</h2>
          <p>积累现在，收获未来</p>
          <div className="learn-refresh-week-row" aria-label="本周打卡">
            {['一', '二', '三', '四', '五', '六', '日'].map((day, index) => (
              <span key={day} className={index < 3 ? 'is-done' : ''}>
                <small>{day}</small>
                <b aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="m6 12 4 4 8-8" />
                  </svg>
                </b>
              </span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );

  if (mode === 'learn') {
    return (
      <AppLayout
        className="ds-app-layout--mobile-study"
        active="words"
        navItems={sidebarItems}
        title="背单词"
        subtitle={`今日目标 ${totalCount} · 当前进度 ${progressCurrent}/${totalCount}`}
        topbarProps={{
          onCalendar: onOpenStatistics,
          onThemeToggle,
          isDarkTheme,
          onNotify: onOpenWrongWords || onOpenTodayReview,
          onUserClick: onUserClick || onHome,
          userLabel,
        }}
      >
        <div ref={mainRef} className="learn-refresh-main learn-refresh-main--study">
          {studyContent}
        </div>
        {toast && (
          <div className="learn-refresh-toast" role="status" aria-live="polite">
            {toast}
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
      subtitle={`${examSourceLabel} · ${totalCount} 词`}
      topbarProps={{
        onCalendar: onOpenStatistics,
        onThemeToggle,
        isDarkTheme,
        onNotify: onOpenWrongWords || onOpenTodayReview,
        onUserClick: onUserClick || onHome,
        userLabel,
      }}
    >
      <main ref={mainRef} className="learn-refresh-main learn-refresh-main--assessment">
        <section className="assessment-study-shell" aria-label="测试进行中">
          <div className="assessment-control-card" aria-label="考试控制">
            <button type="button" className="assessment-back-button" onClick={onBack}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
              <span>返回</span>
            </button>

            <div className="assessment-question-count" aria-label={`第 ${assessmentCurrent} / ${assessmentTotal} 题`}>
              第 <strong>{assessmentCurrent}</strong> / {assessmentTotal} 题
            </div>

            <div className="assessment-control-actions">
              <QuickMenu
                mode={mode}
                onOpenMode={setMode}
                onOpenReading={onOpenReading}
                onSlowSpeechChange={setToast}
              />
            </div>
          </div>

          <div className="assessment-progress-row" aria-label={`测试进度 ${assessmentProgressPercent}%`}>
            <div className="assessment-progress-track" aria-hidden="true">
              <span style={{ width: `${assessmentProgressPercent}%` }} />
            </div>
            <strong>{assessmentProgressPercent}%</strong>
          </div>

          {mode === 'quiz' ? (
            <Quiz
              vocabulary={examVocabulary}
              optionVocabulary={allVocabulary}
              sourceLabel={examSourceLabel}
              masteredWords={masteredWords}
              onAddMastered={onAddMastered}
              onWrongAnswer={onWrongAnswer}
            />
          ) : mode === 'fillblank' ? (
            <FillBlank
              vocabulary={examVocabulary}
              sourceLabel={examSourceLabel}
              onWrongAnswer={onWrongAnswer}
              onCorrectAnswer={onAddMastered}
            />
          ) : mode === 'spelling' ? (
            <SpellingTest
              vocabulary={examVocabulary}
              sourceLabel={examSourceLabel}
              onWrongAnswer={onWrongAnswer}
              onCorrectAnswer={onAddMastered}
            />
          ) : mode === 'matching' ? (
            <MatchingTest
              vocabulary={examVocabulary}
              sourceLabel={examSourceLabel}
              onWrongAnswer={onWrongAnswer}
              onCorrectAnswer={onAddMastered}
            />
          ) : null}
        </section>
      </main>

      {toast && (
        <div className="learn-refresh-toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </AppLayout>
  );
}

export default LearningView;
