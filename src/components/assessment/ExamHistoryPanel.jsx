import { useState } from 'react';
import { EXAM_MODE_LABELS } from '../../../shared/examAttempts.js';
import { WORD_ASSIGNMENT_CATEGORIES } from '../../../shared/wordAssignments.js';
import { useExamHistory } from '../../context/exam-history-context';
import { SecondaryButton } from '../ui/Buttons';
import { formatClassroomDate } from '../../utils/classroom';
import '../../styles/classroom.css';

export function ExamAttemptList({ attempts = [] }) {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(attempts.length / 10));
  const currentPage = Math.min(page, pages);
  return <>
    {attempts.length ? attempts.slice((currentPage - 1) * 10, currentPage * 10).map(attempt => <details key={attempt.id} className="reading-review-detail">
      <summary>{EXAM_MODE_LABELS[attempt.mode]} · {WORD_ASSIGNMENT_CATEGORIES[attempt.category]} · {Math.round(attempt.questionsCorrect / attempt.questionsAnswered * 100)}%（{attempt.questionsCorrect}/{attempt.questionsAnswered} 次） · {formatClassroomDate(attempt.completedAt)}</summary>
      <p className="classroom-helper">范围：{({ all: '随机抽测', learned: '已学习', mastered: '标记认识' })[attempt.scope]} · {attempt.questionsAnswered < 20 ? '提前结束' : '完成一组'}</p>
      <ul className="classroom-assignment-list">{attempt.answers.map((answer, index) => <li key={index}>
        <div><strong>{answer.word}</strong><p>{answer.meaning}</p>{attempt.mode === 'spelling' && <p>输入：{answer.input}</p>}</div>
        <span className={`classroom-badge ${answer.correct ? 'is-mastered' : 'is-wrong'}`}>{answer.correct ? '正确' : '需巩固'}</span>
      </li>)}</ul>
    </details>) : <div className="classroom-empty"><h3>还没有测试记录</h3><p>完成一组练习或提前结束后，即可在这里查看成绩。</p></div>}
    {pages > 1 && <div className="classroom-pagination"><SecondaryButton disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>上一页</SecondaryButton><span>{currentPage} / {pages}</span><SecondaryButton disabled={currentPage >= pages} onClick={() => setPage(currentPage + 1)}>下一页</SecondaryButton></div>}
  </>;
}

export default function ExamHistoryPanel() {
  const history = useExamHistory();
  return <section className="exam-scope-card ds-card test-history-panel" aria-label="我的测试成绩">
    <div className="classroom-heading"><div><h3>我的测试成绩</h3><p>查看最近 100 次练习的成绩与答题记录。</p></div>{history.ownerId && <SecondaryButton loading={history.busy} disabled={history.busy} onClick={history.sync}>{history.busy ? '同步中…' : '同步成绩'}</SecondaryButton>}</div>
    <p className="classroom-helper">{!history.ownerId ? '访客成绩仅保存在当前设备，与登录账号分开。' : history.pending.length ? `${history.pending.length} 次成绩待同步，已保留本机记录。` : '已同步的成绩可由当前班级老师查看。'} 自主练习允许提示和重试，成绩用于学习反馈。</p>
    {history.error && <p role="alert" className="classroom-alert">{history.error} 请点击同步成绩重试。</p>}
    <ExamAttemptList attempts={history.attempts} />
  </section>;
}
