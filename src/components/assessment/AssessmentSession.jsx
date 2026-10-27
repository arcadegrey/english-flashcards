import { useEffect, useRef, useState } from 'react';
import Quiz from '../Quiz';
import FillBlank from '../FillBlank';
import SpellingTest from '../SpellingTest';
import MatchingTest from '../MatchingTest';
import { PrimaryButton, SecondaryButton } from '../ui/Buttons';
import { BaseCard } from '../ui/Cards';
import { CircularProgress } from '../ui/Progress';
import { EXAM_ROUND_SIZE, EXAM_MODE_LABELS, createExamAttempt } from '../../../shared/examAttempts.js';
import { useExamHistory } from '../../context/exam-history-context';
import { examDraftKey } from '../../utils/examHistory';
import { practiceVocabulary } from '../../../shared/vocabularyPracticePolicy.js';

function readDraft(key, meta, history) {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && saved.mode === meta.mode && saved.category === meta.category && saved.scope === meta.scope && !history.attempts.some(item => item.id === saved.id)) {
      createExamAttempt({ ...saved, completedAt: new Date().toISOString() });
      return saved;
    }
  } catch { /* Start fresh when no valid draft exists. */ }
  return { ...meta, id: crypto.randomUUID(), startedAt: new Date().toISOString(), answers: [] };
}

export default function AssessmentSession({ mode, category, scope, vocabulary, optionVocabulary, sourceLabel, onAddMastered, onWrongAnswer, onAnswer, onBack, tools }) {
  const history = useExamHistory();
  const key = examDraftKey(history.ownerId, mode, category, scope);
  const [draft, setDraft] = useState(() => readDraft(key, { mode, category, scope }, history));
  const latest = useRef(draft);
  // Keep the scope stable as correct answers update learned/mastered membership.
  const [pool] = useState(() => practiceVocabulary(vocabulary));
  const [options] = useState(() => practiceVocabulary(optionVocabulary));
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [storageFailed, setStorageFailed] = useState(false);
  const resultHeadingRef = useRef(null);
  useEffect(() => {
    if (result) resultHeadingRef.current?.focus({ preventScroll: true });
  }, [result]);
  const finish = (value = latest.current) => {
    if (!value.answers.length) return;
    try {
      const attempt = createExamAttempt({ ...value, completedAt: value.completedAt || new Date().toISOString() });
      history.record(attempt);
      setResult(attempt); setError(''); setStorageFailed(false);
      localStorage.removeItem(key);
    } catch (err) { setError(err.message || '本机存储失败，请保持页面打开并重试。'); }
  };
  const answer = (correct, detail) => {
    if (latest.current.answers.length >= EXAM_ROUND_SIZE || result) return;
    const next = { ...latest.current, answers: [...latest.current.answers, detail] };
    latest.current = next; setDraft(next);
    try { localStorage.setItem(key, JSON.stringify(next)); setError(''); }
    catch { setStorageFailed(true); setError('本机存储空间不足，请保持页面打开，重试保存。'); }
    onAnswer?.(correct);
    if (next.answers.length >= EXAM_ROUND_SIZE) finish(next);
  };
  const retry = () => {
    try { localStorage.setItem(key, JSON.stringify(latest.current)); setStorageFailed(false); setError(''); }
    catch { setError('本机存储仍不可用，请释放空间后重试。'); return; }
    if (latest.current.answers.length >= EXAM_ROUND_SIZE) finish();
  };
  const nextRound = () => {
    const next = { mode, category, scope, id: crypto.randomUUID(), startedAt: new Date().toISOString(), answers: [] };
    latest.current = next; setDraft(next); setResult(null);
  };
  const count = draft.answers.length;
  const savedResult = result && (history.attempts.find(item => item.id === result.id) || result);
  const canAnswer = !result && !storageFailed && count < EXAM_ROUND_SIZE;
  const wrongAnswers = savedResult?.answers.filter(item => !item.correct) || [];
  return <>
    <BaseCard className="test-session-header" aria-label="练习进度与操作">
      <div className="test-session-toolbar">
        <SecondaryButton className="test-session-back" aria-label="返回" onClick={onBack}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M16 10H4m5-5-5 5 5 5" /></svg><span>返回</span></SecondaryButton>
        <div className="test-session-identity"><h2>{EXAM_MODE_LABELS[mode]}</h2><p>{sourceLabel}</p></div>
        <div className="test-session-tools">
          {!result && <SecondaryButton disabled={!count} onClick={() => finish()}>结束本次</SecondaryButton>}
          {tools}
        </div>
      </div>
      <div className="assessment-progress-row" role="progressbar" aria-label="本次答题进度" aria-valuemin={0} aria-valuemax={EXAM_ROUND_SIZE} aria-valuenow={count}
        aria-valuetext={result ? `本次 ${count} 次答题已保存` : `已答 ${count} / ${EXAM_ROUND_SIZE} 次`}>
        <div className="assessment-progress-track" aria-hidden="true"><span style={{ width: `${count / EXAM_ROUND_SIZE * 100}%` }} /></div>
        <strong>{result ? `${count} 次已保存` : `已答 ${count} / ${EXAM_ROUND_SIZE} 次`}</strong>
      </div>
      <p className="test-session-note">{result ? '本次练习已结束，成绩已保留。' : storageFailed ? '答题暂存于内存，请先重试保存。' : count ? `已记录 ${count} 次答题，可回到相同模式续答。` : '每组最多 20 次答题，也可提前结束。'}{mode === 'matching' ? ' 每次配对尝试计一次。' : ''}{pool.length < vocabulary.length ? ' 历史语境识读词不参与出题。' : ''}</p>
    </BaseCard>
    {error && <div className="classroom-alert" role="alert">{error}<SecondaryButton onClick={count >= EXAM_ROUND_SIZE ? () => finish() : retry}>重试保存</SecondaryButton></div>}
    {history.error && <p className="classroom-helper" role="status">成绩已保留本机，云端暂未同步。可在测试页点击“同步成绩”重试。</p>}
    {result ? <BaseCard className="assessment-result test-result" aria-label="本次测试结果">
      <div className="test-result-summary">
        <CircularProgress value={Math.round(savedResult.questionsCorrect / savedResult.questionsAnswered * 100)} label="正确率" />
        <div className="test-result-copy"><span className="test-eyebrow">{EXAM_MODE_LABELS[mode]} · 自主练习</span><h2 ref={resultHeadingRef} tabIndex={-1}>本次练习已完成</h2><p>{sourceLabel}</p>
          <dl className="test-result-counts">
            <div><dt>已答</dt><dd>{savedResult.questionsAnswered}<span>次</span></dd></div>
            <div><dt>答对</dt><dd>{savedResult.questionsCorrect}<span>次</span></dd></div>
            <div><dt>待巩固</dt><dd>{wrongAnswers.length}<span>次</span></dd></div>
          </dl>
        </div>
      </div>
      <p className="test-result-save" role="status">{history.ownerId ? history.pending.includes(result.id) ? '本机已保存，等待同步后班级老师可查看。' : '成绩已同步，当前班级老师可查看。' : '访客成绩已保存到当前设备。'}</p>
      {wrongAnswers.length ? <details className="test-result-review">
        <summary>查看本组错题<span>{wrongAnswers.length} 次答题需要巩固</span></summary>
        <ol>{wrongAnswers.map((item, index) => <li key={index}><span className="test-review-index">{index + 1}</span><div><strong lang="en">{item.word}</strong><p>{item.meaning}</p>{mode === 'spelling' && <small>你的拼写：<span lang="en">{item.input}</span></small>}</div></li>)}</ol>
      </details> : <p className="test-result-perfect"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 10 3 3 7-7" /></svg>本组全部答对，继续保持。</p>}
      <div className="test-result-actions"><PrimaryButton onClick={nextRound}>再练一组</PrimaryButton><SecondaryButton onClick={onBack}>返回测试</SecondaryButton></div>
    </BaseCard> : canAnswer && <AssessmentQuestions key={draft.id} mode={mode} vocabulary={pool} optionVocabulary={options} sourceLabel="" onAddMastered={onAddMastered} onWrongAnswer={onWrongAnswer} onAnswer={answer} />}
    {!result && count >= EXAM_ROUND_SIZE && !error && <SecondaryButton onClick={() => finish()}>保存已完成测试</SecondaryButton>}
  </>;
}

function AssessmentQuestions({ mode, onAddMastered, ...props }) {
  if (mode === 'quiz') return <Quiz {...props} onAddMastered={onAddMastered} />;
  const Component = { fillblank: FillBlank, spelling: SpellingTest, matching: MatchingTest }[mode];
  return Component ? <Component {...props} onCorrectAnswer={onAddMastered} /> : null;
}
