import { useRef, useState } from 'react';
import Quiz from '../Quiz';
import FillBlank from '../FillBlank';
import SpellingTest from '../SpellingTest';
import MatchingTest from '../MatchingTest';
import { PrimaryButton, SecondaryButton } from '../ui/Buttons';
import { EXAM_ROUND_SIZE, createExamAttempt } from '../../../shared/examAttempts.js';
import { useExamHistory } from '../../context/exam-history-context';
import { examDraftKey } from '../../utils/examHistory';

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

export default function AssessmentSession({ mode, category, scope, vocabulary, optionVocabulary, sourceLabel, onAddMastered, onWrongAnswer, onAnswer, onBack }) {
  const history = useExamHistory();
  const key = examDraftKey(history.ownerId, mode, category, scope);
  const [draft, setDraft] = useState(() => readDraft(key, { mode, category, scope }, history));
  const latest = useRef(draft);
  // Keep the scope stable as correct answers update learned/mastered membership.
  const [pool] = useState(vocabulary);
  const [options] = useState(optionVocabulary);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [storageFailed, setStorageFailed] = useState(false);
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
  return <>
    <div className="assessment-progress-row" aria-label={result ? `本次 ${count} 次答题已保存` : `本次已答 ${count} / ${EXAM_ROUND_SIZE} 次`}>
      <div className="assessment-progress-track" aria-hidden="true"><span style={{ width: `${result ? 100 : count / EXAM_ROUND_SIZE * 100}%` }} /></div><strong>{result ? `${count} 次已保存` : `${count} / ${EXAM_ROUND_SIZE}`}</strong>
    </div>
    <div className="assessment-history-status">
      <span>{result ? '本次成绩已保存' : storageFailed ? '答题暂存于内存，请先重试保存' : count ? `已记录 ${count} 次答题，可稍后回到相同模式续答` : '每组最多 20 次答题，也可提前结束'}{mode === 'matching' ? ' · 每次配对尝试计一次' : ''}</span>
      {!result && <SecondaryButton disabled={!count} onClick={() => finish()}>结束本次</SecondaryButton>}
    </div>
    {error && <div className="classroom-alert" role="alert">{error}<SecondaryButton onClick={count >= EXAM_ROUND_SIZE ? () => finish() : retry}>重试保存</SecondaryButton></div>}
    {history.error && <p className="classroom-helper" role="status">成绩已保留本机，云端暂未同步。可在测试页点击“同步成绩”重试。</p>}
    {result ? <section className="ds-card assessment-result" aria-label="本次测试结果">
      <span className="classroom-badge">自主练习完成</span><h2>{Math.round(savedResult.questionsCorrect / savedResult.questionsAnswered * 100)}%</h2><p>答对 {savedResult.questionsCorrect} / {savedResult.questionsAnswered} 次 · {savedResult.questionsAnswered - savedResult.questionsCorrect} 次需要巩固</p>
      <p className="classroom-helper">{history.ownerId ? history.pending.includes(result.id) ? '本机已保存，正在等待同步；同步后班级老师可查看。' : '成绩已同步，当前班级老师可查看。' : '访客成绩已保存到当前设备。'}</p>
      <div className="classroom-actions"><PrimaryButton onClick={nextRound}>再练一组</PrimaryButton><SecondaryButton onClick={onBack}>返回测试</SecondaryButton></div>
    </section> : canAnswer && <AssessmentQuestions key={draft.id} mode={mode} vocabulary={pool} optionVocabulary={options} sourceLabel={sourceLabel} onAddMastered={onAddMastered} onWrongAnswer={onWrongAnswer} onAnswer={answer} />}
    {!result && count >= EXAM_ROUND_SIZE && !error && <SecondaryButton onClick={() => finish()}>保存已完成测试</SecondaryButton>}
  </>;
}

function AssessmentQuestions({ mode, onAddMastered, ...props }) {
  if (mode === 'quiz') return <Quiz {...props} onAddMastered={onAddMastered} />;
  const Component = { fillblank: FillBlank, spelling: SpellingTest, matching: MatchingTest }[mode];
  return Component ? <Component {...props} onCorrectAnswer={onAddMastered} /> : null;
}
