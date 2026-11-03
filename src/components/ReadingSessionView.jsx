import ReadingArticle from './reading/session/ReadingArticle';
import ReadingQuestions from './reading/session/ReadingQuestions';
import ReadingSessionSidebar from './reading/session/ReadingSessionSidebar';
import ReadingWordDialog from './reading/session/ReadingWordDialog';
import ReadingCompletionSummary from './reading/session/ReadingCompletionSummary';
import ReadingSessionActions from './reading/session/ReadingSessionActions';
import LoadingState, { LoadingAnimation } from './ui/LoadingState';
import useReadingAttempts from '../hooks/useReadingAttempts';
import { normalizeReadingQuestions } from '../../shared/readingQuestions.js';
import useReadingDraft from '../hooks/useReadingDraft';
import { useEffect, useMemo, useState } from 'react';
import AppLayout from './layout/AppLayout';
import { isEnglishWordToken, resolveVocabularyWord, tokenizeReadingText } from '../utils/readingText';
import { useSentencePlayback } from '../hooks/useSentencePlayback.js';
import { buildReadingSentences } from '../utils/readingSentences.js';
import '../styles/study-reading.css';
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
  const history = useReadingAttempts(userId);
  const draft = useReadingDraft(userId, retryAttempt ? `retry:${retryAttempt.id}` : assignment ? `assignment:${assignment.id}` : `reading:${article?.id}`);
  const [submissionBusy, setSubmissionBusy] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [completionSummary, setCompletionSummary] = useState(null);
  const [toast, setToast] = useState('');
  const paragraphs = useMemo(() => buildReadingSentences(article?.content), [article?.content]);
  const speechScope = JSON.stringify([userId || 'guest', article?.id, assignment?.id, retryAttempt?.id]);
  const sentencePlayback = useSentencePlayback(article?.content, speechScope);
  const { sentenceId: activeSentenceId, toggle: toggleSentence, stop: stopSentence } = sentencePlayback;
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
    if (activeSentenceId) stopSentence();
    else if (paragraphs[0]?.sentences[0]) void toggleSentence(paragraphs[0].sentences[0]);
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
              <ReadingArticle article={article} articleMinutes={articleMinutes} readingStats={readingStats}
                questionCount={readingQuestions.length} paragraphs={paragraphs} masteredWordSet={masteredWordSet}
                wordLookup={wordLookup} sentencePlayback={sentencePlayback} showTranslation={showTranslation}
                onToggleTranslation={() => setShowTranslation((prev) => !prev)} onSelectWord={setActiveWord} />

              {readingQuestions.length > 0 && (
                <ReadingQuestions questions={readingQuestions} questionAnswers={questionAnswers}
                  disabled={Boolean(assignment?.submittedAt) || submissionBusy} onSelectOption={handleSelectQuestionOption} />
              )}

              {effectiveSummary && (
                <ReadingCompletionSummary effectiveSummary={effectiveSummary} articleMinutes={articleMinutes} />
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
            <ReadingSessionActions article={article} onBack={onBack} showTranslation={showTranslation}
              onToggleTranslation={() => setShowTranslation((prev) => !prev)} onSpeakArticle={handleSpeakArticle}
              canSpeak={Boolean(paragraphs[0]?.sentences.length)} activeSentenceId={activeSentenceId}
              onCompleteReading={handleCompleteReading} assignment={assignment} retryAttempt={retryAttempt} submissionBusy={submissionBusy}
              draftLoading={draft.status === 'loading'} completionSummary={completionSummary}
              hasReadingQuestions={hasReadingQuestions} allQuestionsAnswered={answeredQuestionCount === readingQuestions.length} />
          </section>

          <ReadingSessionSidebar mode={mode} onOpenMode={onOpenMode} onBack={onBack}
            onSyncAccount={handleSyncAccount} onNotice={setToast} readingStats={readingStats}
            articleMinutes={articleMinutes} questionCount={readingQuestions.length} readingProgressPercent={readingProgressPercent} />
        </div>
      </div>

      <ReadingWordDialog activeWord={activeWord} onClose={() => setActiveWord(null)}
        onMarkUnknown={handleMarkUnknown} onMarkKnown={handleMarkKnown} />

      {toast && (
        <div className="learn-refresh-toast" role="status" aria-live="polite">
          {toast === '正在同步账号...' && <LoadingAnimation compact />}{toast}
        </div>
      )}
    </AppLayout>
  );
}

// Keep draft/history hooks unmounted until canonical content is complete. A
// metadata-only placeholder must never create a session or record completion.
export default function ReadingSessionPage(props) {
  const { article, loading, loadError, onRetryLoad, onBack, navItems, topbarProps } = props;
  if (!loading && !loadError) return <ReadingSessionView {...props} />;
  return <AppLayout active="reading" title="阅读训练" subtitle={article?.title || '选择文章后开始阅读'}
    navItems={navItems} topbarProps={topbarProps}>
    <div className="reading-session-study-main">
      <article className="learn-refresh-card reading-session-study-card">
        {loading ? <LoadingState title="正在加载阅读文章…" /> : <div role="alert">
          <p className="learn-refresh-empty">{loadError}</p>
          <button type="button" className="learn-refresh-example-audio" onClick={onRetryLoad}>重试加载文章</button>
        </div>}
        <button type="button" className="learn-refresh-example-audio" onClick={onBack}>返回列表</button>
      </article>
    </div>
  </AppLayout>;
}
