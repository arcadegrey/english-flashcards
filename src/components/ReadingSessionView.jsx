import LoadingState, { LoadingAnimation } from './ui/LoadingState';
import useReadingAttempts from '../hooks/useReadingAttempts';
import { normalizeReadingQuestions } from '../../shared/readingQuestions.js';
import useReadingDraft from '../hooks/useReadingDraft';
import { useEffect, useMemo, useRef, useState } from 'react';
import QuickMenu from './QuickMenu';
import AppLayout from './layout/AppLayout';
import { speak, speakWord } from '../utils/speech';
import { isEnglishWordToken, resolveVocabularyWord, tokenizeReadingText } from '../utils/readingText';
import { gsap, prefersReducedMotion, useGSAP } from '../utils/gsapMotion';
import { useWordDetails } from '../hooks/useWordDetails.js';
import '../styles/reading-question-options.css';

function ReadingSessionView({
  article,
  userId,
  assignment,
  retryAttempt,
  onSubmitAssignment,
  mode = 'learn',
  onBack,
  onOpenMode,
  navItems = [],
  topbarProps = {},
  masteredWords = [],
  wordLookup,
  onMarkAsLearned,
  onMarkAsMastered,
  onSyncAccount,
  onCompleteReading,
  isCompletedToday = false,
  completedResult,
}) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [activeWord, setActiveWord] = useState(null);
  const activeDetails = useWordDetails(activeWord);
  const history = useReadingAttempts(userId);
  const draft = useReadingDraft(userId, retryAttempt ? `retry:${retryAttempt.id}` : assignment ? `assignment:${assignment.id}` : `reading:${article?.id}`);
  const [submissionBusy, setSubmissionBusy] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [completionSummary, setCompletionSummary] = useState(null);
  const [toast, setToast] = useState('');
  const wordModalRef = useRef(null);
  const masteredWordSet = useMemo(
    () => new Set((masteredWords || []).map((item) => String(item))),
    [masteredWords]
  );
  const readingQuestions = useMemo(
    () => normalizeReadingQuestions(article?.questions),
    [article?.questions]
  );
  const selectedAnswers = assignment?.submittedAt ? assignment.answers : draft.session.answers;
  const questionAnswers = Object.fromEntries(readingQuestions.filter((question) =>
    question.options.some((option) => option.id === selectedAnswers?.[question.id]))
    .map((question) => [question.id, { selected: selectedAnswers[question.id],
      isCorrect: question.answer ? selectedAnswers[question.id].toLowerCase() === question.answer.toLowerCase() : null }]));

  useEffect(() => {
    if (!toast || toast === '正在同步账号...') return undefined;
    const timer = setTimeout(() => setToast(''), 1600);
    return () => clearTimeout(timer);
  }, [toast]);

  useGSAP(() => {
    if (!activeWord || prefersReducedMotion()) return;
    const layer = wordModalRef.current;
    if (!layer) return;

    const mask = layer.querySelector('.reading-word-modal-mask');
    const modal = layer.querySelector('.reading-word-modal');

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    tl.fromTo(mask, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.18 })
      .fromTo(
        modal,
        { y: 18, scale: 0.975, autoAlpha: 0 },
        { y: 0, scale: 1, autoAlpha: 1, duration: 0.32, clearProps: 'transform,opacity,visibility' },
        0.03
      );
  }, { dependencies: [activeWord?.id], scope: wordModalRef, revertOnUpdate: true });

  const readingStats = useMemo(() => {
    const tokens = tokenizeReadingText(article?.content || '');
    const uniqueWordIds = new Set();

    tokens.forEach((token) => {
      if (!isEnglishWordToken(token)) return;
      const matchedWord = resolveVocabularyWord(token, wordLookup);
      if (!matchedWord?.id) return;
      uniqueWordIds.add(String(matchedWord.id));
    });

    const totalTracked = uniqueWordIds.size;
    let masteredCount = 0;
    uniqueWordIds.forEach((id) => {
      if (masteredWordSet.has(id)) masteredCount += 1;
    });

    return {
      totalTracked,
      masteredCount,
      unmasteredCount: Math.max(totalTracked - masteredCount, 0),
    };
  }, [article?.content, masteredWordSet, wordLookup]);
  const readingProgressPercent =
    readingStats.totalTracked > 0
      ? Math.round((readingStats.masteredCount / readingStats.totalTracked) * 100)
      : 0;
  const answeredQuestionCount = Object.keys(questionAnswers).length;
  const correctQuestionCount = Object.values(questionAnswers).filter((item) => item?.isCorrect === true).length;
  const hasReadingQuestions = readingQuestions.length > 0;
  const readingAccuracy = answeredQuestionCount > 0 ? Math.round((correctQuestionCount / answeredQuestionCount) * 100) : 0;
  const effectiveSummary = completionSummary || (assignment?.submittedAt ? {
    accuracy: assignment.questionsAnswered ? Math.round(assignment.questionsCorrect / assignment.questionsAnswered * 100) : 0,
    answered: assignment.questionsAnswered, correct: assignment.questionsCorrect, hasQuestions: true,
    unmasteredCount: readingStats.unmasteredCount, nextStep: '作业成绩已保存，可返回查看老师的其他任务。',
  } : null) || (!assignment && !retryAttempt && isCompletedToday
    ? {
        accuracy: completedResult?.questionsAnswered ? Math.round(completedResult.questionsCorrect / completedResult.questionsAnswered * 100) : readingAccuracy,
        answered: completedResult?.questionsAnswered ?? answeredQuestionCount,
        correct: completedResult?.questionsCorrect ?? correctQuestionCount,
        hasQuestions: hasReadingQuestions,
        unmasteredCount: readingStats.unmasteredCount,
        nextStep:
          readingStats.unmasteredCount > 0
            ? '把未标记认识词加入复习，再做一组考试巩固。'
            : '难词状态不错，可以继续下一篇阅读。',
      }
    : null);
  const articleMinutes = article?.estimatedMinutes || 1;
  const layoutTitle = '阅读训练';
  const layoutSubtitle = article
    ? `${article.title} · 难词认识记录 ${readingStats.masteredCount}/${readingStats.totalTracked}`
    : '选择文章后开始阅读';

  const handleSpeakArticle = () => {
    if (!article?.content) return;
    speak(article.content, { rate: 1 });
  };

  const handleSyncAccount = async () => {
    if (typeof onSyncAccount !== 'function') {
      setToast('当前页面暂不可同步');
      return;
    }

    setToast('正在同步账号...');
    try {
      await draft.flush();
      const result = await onSyncAccount();
      setToast(result?.message || '同步请求已完成');
    } catch (error) {
      setToast(error?.message || '同步失败，请稍后重试');
    }
  };

  const handleSpeakActiveWord = () => {
    if (!activeWord?.word) return;
    speakWord(activeWord, { rate: 1 });
  };

  const handleMarkUnknown = () => {
    if (!activeWord?.id) return;
    onMarkAsLearned?.(activeWord.id);
    setToast(`已加入已学习：${activeWord.word}`);
  };

  const handleMarkKnown = () => {
    if (!activeWord?.id) return;
    onMarkAsMastered?.(activeWord.id);
    setToast(`已标记认识：${activeWord.word}`);
  };

  const handleSelectQuestionOption = (questionId, optionId) => {
    if (assignment?.submittedAt || submissionBusy) return;
    draft.answer(questionId, optionId);
  };

  const handleCompleteReading = async () => {
    if (assignment) {
      setSubmissionBusy(true); setSubmissionError('');
      try {
        await draft.flush();
        const saved = await onSubmitAssignment(draft.session.answers);
        try { history.record({ id: `assignment-${assignment.id}`, article, answers: saved.answers, assignmentId: assignment.id, completedAt: saved.submittedAt }); }
        catch (error) { setSubmissionError(`作业已提交，但本机复盘记录未保存：${error.message}`); }
        setCompletionSummary({ accuracy: Math.round(saved.questionsCorrect / saved.questionsAnswered * 100),
          answered: saved.questionsAnswered, correct: saved.questionsCorrect, hasQuestions: true,
          unmasteredCount: readingStats.unmasteredCount, nextStep: '作业已提交，老师可以查看本次成绩。' });
        setToast('阅读作业已提交');
      } catch (error) { setSubmissionError(error.message || '提交失败，答题已保留，请重试。'); }
      finally { setSubmissionBusy(false); }
      return;
    }
    if (!article?.id || typeof onCompleteReading !== 'function' || completionSummary) return;
    if (hasReadingQuestions && answeredQuestionCount !== readingQuestions.length) { setSubmissionError('请完成全部阅读题后保存练习。'); return; }
    if (hasReadingQuestions) {
      try { history.record({article, answers:selectedAnswers, parentId:retryAttempt?.id || ''}); }
      catch (error) { setSubmissionError(`练习未保存：${error.message}`); return; }
    }
    setSubmissionError('');
    const nextSummary = {
      accuracy: readingAccuracy,
      answered: answeredQuestionCount,
      correct: correctQuestionCount,
      hasQuestions: hasReadingQuestions,
      unmasteredCount: readingStats.unmasteredCount,
      nextStep:
        readingStats.unmasteredCount > 0
          ? '把未标记认识词加入复习，再做一组考试巩固。'
          : '难词状态不错，可以继续下一篇阅读。',
    };
    if (!retryAttempt) onCompleteReading({
      articleId: article.id,
      questionsAnswered: answeredQuestionCount,
      questionsCorrect: correctQuestionCount,
      timeSpent: articleMinutes,
    });
    setCompletionSummary(nextSummary);
    setToast(retryAttempt ? '错题练习已保存，原成绩保持不变' : '本次练习已保存，今日计划已更新');
  };

  const contentBlocks = useMemo(() => {
    const paragraphs = String(article?.content || '')
      .split(/\n{2,}/)
      .map((item) => item.trim())
      .filter(Boolean);

    return paragraphs.map((paragraph, paragraphIndex) => {
      const tokens = tokenizeReadingText(paragraph);
      return (
        <p key={`p-${paragraphIndex}`} className="reading-session-paragraph">
          {tokens.map((token, tokenIndex) => {
            if (!isEnglishWordToken(token)) {
              return (
                <span key={`t-${paragraphIndex}-${tokenIndex}`} className="reading-token-plain">
                  {token}
                </span>
              );
            }

            const matchedWord = resolveVocabularyWord(token, wordLookup);
            const isHighlight = Boolean(
              matchedWord?.id && !masteredWordSet.has(String(matchedWord.id))
            );

            if (!isHighlight) {
              return (
                <span key={`t-${paragraphIndex}-${tokenIndex}`} className="reading-token-plain">
                  {token}
                </span>
              );
            }

            return (
              <button
                key={`t-${paragraphIndex}-${tokenIndex}`}
                type="button"
                className="reading-token-highlight"
                onClick={() => setActiveWord(matchedWord)}
              >
                {token}
              </button>
            );
          })}
        </p>
      );
    });
  }, [article?.content, masteredWordSet, wordLookup]);

  if (!article) {
    return (
      <AppLayout
        active="reading"
        navItems={navItems}
        title={layoutTitle}
        subtitle={layoutSubtitle}
        topbarProps={topbarProps}
      >
        <div className="reading-session-study-main">
          <article className="learn-refresh-card reading-session-study-card learn-refresh-card-enter">
            <p className="learn-refresh-empty">未找到阅读文章，请返回阅读列表重试。</p>
          </article>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      active="reading"
      navItems={navItems}
      title={layoutTitle}
      subtitle={layoutSubtitle}
      topbarProps={topbarProps}
    >
      <div className="reading-session-study-main">
        <div className="learn-refresh-study-layout reading-session-study-layout">
          <section className="learn-refresh-study-workspace reading-session-workspace" aria-label="阅读训练">
            <div className="learn-refresh-goal-strip reading-session-goal-strip">
              <span className="learn-refresh-goal-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v16H7.5A2.5 2.5 0 0 0 5 21.5Z" />
                  <path d="M5 5.5v16" />
                  <path d="M9 7h7" />
                  <path d="M9 11h6" />
                </svg>
              </span>
              <span className="learn-refresh-goal-label">难词认识记录</span>
              <strong>{readingStats.masteredCount}/{readingStats.totalTracked}</strong>
              <div className="learn-refresh-goal-track" aria-hidden="true">
                <span style={{ width: `${readingProgressPercent}%` }} />
              </div>
              <span className="learn-refresh-goal-percent">{readingProgressPercent}%</span>
            </div>

            <article className="learn-refresh-card learn-refresh-card-enter reading-session-card reading-session-study-card">
              <header className="reading-session-header">
                <h1 className="reading-session-title">{article.title}</h1>
                <div className="reading-session-meta">
                  <span className="reading-session-chip">{article.level || 'B1'}</span>
                  <span className="reading-session-chip">{articleMinutes} 分钟</span>
                  <span className="reading-session-chip">{readingStats.unmasteredCount} 个未标记认识词</span>
                  {readingQuestions.length > 0 && (
                    <span className="reading-session-chip">{readingQuestions.length} 道阅读题</span>
                  )}
                </div>
              </header>

              <section className="reading-session-content">{contentBlocks}</section>

              {article.translation && (
                <section className="learn-refresh-example-block reading-session-translation">
                  <div className="learn-refresh-example-head">
                    <span className="learn-refresh-example-label">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z" />
                        <path d="M9 8h5" />
                        <path d="M9 12h6" />
                      </svg>
                      全文翻译
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowTranslation((prev) => !prev)}
                      className="learn-refresh-example-audio"
                    >
                      {showTranslation ? '收起翻译' : '显示翻译'}
                    </button>
                  </div>
                  {showTranslation && <p className="learn-refresh-example-cn">{article.translation}</p>}
                </section>
              )}

              {readingQuestions.length > 0 && (
                <section className="reading-question-section" aria-label="阅读题">
                  <div className="reading-question-head">
                    <h2 className="reading-question-title">阅读题</h2>
                    <p className="reading-question-sub">根据文章选择最合适的答案。</p>
                  </div>

                  <div className="reading-question-list">
                    {readingQuestions.map((question, questionIndex) => {
                      const answerState = questionAnswers[question.id];

                      return (
                        <article key={question.id} className="reading-question-card">
                          <p className="reading-question-prompt">
                            {questionIndex + 1}. {question.prompt}
                          </p>
                          <div className="reading-question-options">
                            {question.options.map((option) => {
                              const isSelected = answerState?.selected === option.id;
                              const isCorrectAnswer =
                                Boolean(question.answer) &&
                                option.id.toLowerCase() === question.answer.toLowerCase();

                              return (
                                <button
                                  key={option.id}
                                  type="button"
                                  aria-pressed={isSelected}
                                  disabled={Boolean(assignment?.submittedAt) || submissionBusy}
                                  className={[
                                    'reading-question-option',
                                    isSelected ? 'is-selected' : '',
                                    isSelected && answerState?.isCorrect === true ? 'is-correct' : '',
                                    isSelected && answerState?.isCorrect === false ? 'is-wrong' : '',
                                    answerState && isCorrectAnswer ? 'is-answer' : '',
                                  ]
                                    .filter(Boolean)
                                    .join(' ')}
                                  onClick={() =>
                                    handleSelectQuestionOption(question.id, option.id, question.answer)
                                  }
                                >
                                  <span className="reading-question-option-key">{option.id}</span>
                                  <span className="reading-question-option-label">{option.label}</span>
                                  <span className="reading-question-option-mark" aria-hidden="true">
                                    {isSelected && <svg viewBox="0 0 20 20"><path d={answerState?.isCorrect === false ? 'm6 6 8 8M14 6l-8 8' : 'm5 10 3 3 7-7'} /></svg>}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                          {answerState && question.answer && (
                            <p className="reading-question-feedback">
                              {answerState.isCorrect ? '回答正确' : `正确答案：${question.answer}`}
                              {question.explanation ? `。${question.explanation}` : ''}
                            </p>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </section>
              )}

              {effectiveSummary && (
                <section className="reading-completion-summary" aria-label="阅读完成总结">
                  <div className="reading-completion-head">
                    <span>完成总结</span>
                    <strong>{effectiveSummary.hasQuestions ? `${effectiveSummary.accuracy}%` : '已读完'}</strong>
                  </div>
                  <div className="reading-completion-grid">
                    <span>
                      <b>{effectiveSummary.hasQuestions ? `${effectiveSummary.correct}/${effectiveSummary.answered}` : '暂无'}</b>
                      {effectiveSummary.hasQuestions ? '阅读题' : '阅读题目'}
                    </span>
                    <span>
                      <b>{effectiveSummary.unmasteredCount}</b>
                      未标记认识词
                    </span>
                    <span>
                      <b>{articleMinutes} 分钟</b>
                      训练时长
                    </span>
                  </div>
                  <p>{effectiveSummary.nextStep}</p>
                </section>
              )}
            </article>

            <div className="reading-save-status" aria-live="polite">
              {assignment && <p>{assignment.submittedAt ? '本次作业已提交，成绩已保存。' : '班级阅读作业：完成全部题目后提交；首次提交计成绩，逾期可补交。'}</p>}
              <p>{(draft.status === 'loading' || draft.status === 'syncing') && <LoadingAnimation compact />} {draft.status === 'loading' ? '正在恢复答题记录…' : draft.status === 'synced' ? '答题记录已同步' : draft.status === 'syncing' ? '正在同步答题…' : Object.keys(draft.session.answers).length ? '答题已保留在本机' : '选择答案后将自动保存'}</p>
              {draft.error && <p role="status">{draft.error} <button type="button" className="classroom-text-button" onClick={() => draft.flush().catch(() => {})}>重试保存</button></p>}
              {history.pending > 0 && <p>有 {history.pending} 次练习待同步。<button type="button" className="classroom-text-button" onClick={history.sync}>同步历史</button></p>}
              {history.error && <p role="alert">{history.error}</p>}
              {retryAttempt && <p>正在重做错题，保存后可在训练中心查看本次成绩。</p>}
              {submissionError && <p role="alert" className="auth-error">{submissionError}</p>}
            </div>
            <footer className="learn-refresh-bottombar reading-session-actions">
              <div className="learn-refresh-bottombar-inner">
                <button
                  type="button"
                  className="learn-refresh-action learn-refresh-action-secondary"
                  onClick={onBack}
                >
                  <span className="learn-refresh-action-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </span>
                  <span>返回列表</span>
                </button>
                <button
                  type="button"
                  className="learn-refresh-action learn-refresh-action-ghost"
                  onClick={() => setShowTranslation((prev) => !prev)}
                  disabled={!article.translation}
                >
                  <span className="learn-refresh-action-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M4 5h9a3 3 0 0 1 3 3v11H7a3 3 0 0 1-3-3V5Z" />
                      <path d="M8 9h5" />
                      <path d="M8 13h4" />
                    </svg>
                  </span>
                  <span>{article.translation ? (showTranslation ? '收起翻译' : '显示翻译') : '暂无翻译'}</span>
                </button>
                <button
                  type="button"
                  className="learn-refresh-action learn-refresh-action-ghost"
                  onClick={handleSpeakArticle}
                >
                  <span className="learn-refresh-action-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 4V5L7 9H3z" />
                      <path d="M16.5 8.5a4.5 4.5 0 0 1 0 7" />
                      <path d="M19.5 6a8 8 0 0 1 0 12" />
                    </svg>
                  </span>
                  <span>朗读全文</span>
                </button>
                <button
                  type="button"
                  className="learn-refresh-action learn-refresh-action-primary"
                  onClick={handleCompleteReading}
                  disabled={assignment ? Boolean(assignment.submittedAt) || submissionBusy || draft.status === 'loading' : Boolean(completionSummary) || (hasReadingQuestions && answeredQuestionCount !== readingQuestions.length)}
                >
                  <span className="learn-refresh-action-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M5 12.5 10 17l9-10" />
                    </svg>
                  </span>
                  <span>{submissionBusy && <LoadingAnimation compact />} {assignment ? assignment.submittedAt ? '作业已提交' : submissionBusy ? '提交中…' : '提交阅读作业' : completionSummary ? '练习已保存' : retryAttempt ? '保存错题练习' : hasReadingQuestions ? '保存本次练习' : '完成阅读'}</span>
                </button>
              </div>
            </footer>
          </section>

          <aside className="learn-refresh-study-aside reading-session-aside" aria-label="阅读状态">
            <div className="learn-refresh-side-tools">
              <button type="button" className="learn-refresh-side-tool" onClick={handleSyncAccount}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 6v5h-5" />
                  <path d="M4 18v-5h5" />
                  <path d="M6.2 9A7 7 0 0 1 18.5 7.5L20 11" />
                  <path d="M17.8 15A7 7 0 0 1 5.5 16.5L4 13" />
                </svg>
                <span>同步进度</span>
              </button>
              <QuickMenu
                mode={mode}
                onOpenMode={onOpenMode}
                onOpenReading={onBack}
                onSlowSpeechChange={setToast}
              />
            </div>

            <div className="learn-refresh-side-summary">
              <div className="learn-refresh-side-row">
                <span className="learn-refresh-side-icon is-target" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="8" />
                    <circle cx="12" cy="12" r="3" />
                    <path d="m15.5 8.5 3-3" />
                  </svg>
                </span>
                <span>未标记认识词</span>
                <strong>{readingStats.unmasteredCount}</strong>
              </div>
              <div className="learn-refresh-side-row">
                <span className="learn-refresh-side-icon is-flame" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M5 4h14v16H5z" />
                    <path d="M8 8h8" />
                    <path d="M8 12h7" />
                  </svg>
                </span>
                <span>阅读时长</span>
                <strong>{articleMinutes} 分</strong>
              </div>
              <div className="learn-refresh-side-row">
                <span className="learn-refresh-side-icon is-star" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="m12 3 2.6 5.4 5.9.8-4.2 4.1 1 5.8L12 16.4 6.7 19.1l1-5.8-4.2-4.1 5.9-.8L12 3Z" />
                  </svg>
                </span>
                <span>阅读题</span>
                <strong>{readingQuestions.length}</strong>
              </div>
            </div>

            <div className="learn-refresh-side-card">
              <h2>阅读进度</h2>
              <div className="learn-refresh-ring-row">
                <div className="learn-refresh-ring" style={{ '--study-progress': `${readingProgressPercent}%` }}>
                  <div>
                    <strong>{readingProgressPercent}%</strong>
                    <span>难词认识记录</span>
                  </div>
                </div>
                <dl className="learn-refresh-ring-stats">
                  <div>
                    <dt><span className="is-blue" />标记认识</dt>
                    <dd>{readingStats.masteredCount}</dd>
                  </div>
                  <div>
                    <dt><span className="is-purple" />总词数</dt>
                    <dd>{readingStats.totalTracked}</dd>
                  </div>
                  <div>
                    <dt><span className="is-gray" />未标记认识</dt>
                    <dd>{readingStats.unmasteredCount}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {activeWord && (
        <div ref={wordModalRef} className="reading-word-modal-layer" role="dialog" aria-modal="true" aria-label="单词详情">
          <button
            type="button"
            className="reading-word-modal-mask"
            aria-label="关闭单词详情"
            onClick={() => setActiveWord(null)}
          />
          <section className="reading-word-modal learn-refresh-card learn-refresh-card-enter">
            <div className="reading-word-modal-head">
              <h2 className="learn-refresh-word">{activeWord.word}</h2>
              <button
                type="button"
                className="learn-refresh-inline-audio"
                onClick={handleSpeakActiveWord}
                aria-label="播放发音"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 9v6h4l5 4V5L7 9H3z" />
                  <path d="M16.5 8.5a4.5 4.5 0 010 7" />
                  <path d="M19.5 6a8 8 0 010 12" />
                </svg>
              </button>
            </div>
            <p className="learn-refresh-phonetic">{activeWord.phonetic || '暂无音标'}</p>
            <p className="learn-refresh-meaning">
              {[activeWord.pos, activeWord.meaning].filter(Boolean).join(' ')}
            </p>
            <section className="learn-refresh-example-block">
              <div className="learn-refresh-example-head">
                <span className="learn-refresh-example-label">例句</span>
              </div>
              {activeDetails.loading ? <LoadingState variant="inline" className="learn-refresh-hint-scope" title="正在加载例句…" />
                : activeDetails.error ? <><p className="learn-refresh-hint-scope" role="status">例句暂时无法加载。</p><button type="button" className="learn-refresh-example-audio" onClick={activeDetails.retry}>重试加载例句</button></>
                : <><p className="learn-refresh-example-en">{activeDetails.word.example || '暂无英文例句。'}</p><p className="learn-refresh-example-cn">{activeDetails.word.exampleCn || '暂无中文例句。'}</p></>}
            </section>
            <div className="reading-word-modal-actions">
              <button
                type="button"
                className="learn-refresh-action learn-refresh-action-secondary"
                onClick={handleMarkUnknown}
              >
                不认识
              </button>
              <button
                type="button"
                className="learn-refresh-action learn-refresh-action-primary"
                onClick={handleMarkKnown}
              >
                认识了
              </button>
            </div>
          </section>
        </div>
      )}

      {toast && (
        <div className="learn-refresh-toast" role="status" aria-live="polite">
          {toast === '正在同步账号...' && <LoadingAnimation compact />}{toast}
        </div>
      )}
    </AppLayout>
  );
}

export default ReadingSessionView;
