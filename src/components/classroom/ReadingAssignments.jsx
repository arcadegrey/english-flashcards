import { useEffect, useState } from 'react';
import { BaseCard } from '../ui/Cards';
import { PrimaryButton, SecondaryButton } from '../ui/Buttons';
import readings from '../../data/readings';
import { formatClassroomDate } from '../../utils/classroom';
import { loadReadingAssignments, publishReadingAssignment, loadAssignmentSubmissions, loadStudentAssignments } from '../../utils/classroomApi';

const statusLabels = { pending: '待完成', overdue: '已逾期，可补交', submitted: '已提交', submitted_late: '已补交' };
const score = (item) => item.questionsAnswered ? `${Math.round(item.questionsCorrect / item.questionsAnswered * 100)}%（${item.questionsCorrect}/${item.questionsAnswered} 题）` : '—';
const tomorrow = () => {
  const date = new Date(Date.now() + 86400000);
  date.setHours(20, 0, 0, 0);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

export function TeacherReadingAssignments({ classId }) {
  const options = readings.filter((article) => article.questions?.length);
  const [articleId, setArticleId] = useState(String(options[0]?.id || ''));
  const [dueAt, setDueAt] = useState(tomorrow);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [selectedId, setSelectedId] = useState('');
  const [detail, setDetail] = useState(null);
  const [detailError, setDetailError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true); setError('');
      try { const result = await loadReadingAssignments(classId, controller.signal); if (!controller.signal.aborted) setAssignments(result.assignments); }
      catch (err) { if (!controller.signal.aborted) setError(err.message); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    };
    load(); return () => controller.abort();
  }, [classId, refresh]);

  useEffect(() => {
    if (!selectedId) return undefined;
    const controller = new AbortController();
    const load = async () => {
      setDetail(null); setDetailError('');
      try { const result = await loadAssignmentSubmissions(selectedId, controller.signal); if (!controller.signal.aborted) setDetail(result); }
      catch (err) { if (!controller.signal.aborted) setDetailError(err.message); }
    };
    load(); return () => controller.abort();
  }, [selectedId, refresh]);

  const publish = async (event) => {
    event.preventDefault(); setBusy(true); setError(''); setNotice('');
    try {
      await publishReadingAssignment(classId, { articleId, dueAt: new Date(dueAt).toISOString() });
      setNotice('阅读作业已发布，学生可在今日计划和我的班级中查看。');
      setRefresh((value) => value + 1);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  return <section className="classroom-assignments" aria-label="班级阅读作业管理">
    <div className="classroom-heading"><div><h3>阅读作业</h3><p>指定一篇带题阅读，设置截止时间，跟进学生的提交和成绩。</p></div>
      <SecondaryButton disabled={loading} onClick={() => setRefresh((value) => value + 1)}>刷新作业</SecondaryButton></div>
    {error && <p className="classroom-alert" role="alert">{error}</p>}
    {notice && <p className="classroom-notice" role="status">{notice}</p>}
    <form className="classroom-assignment-form" onSubmit={publish}>
      <label className="classroom-field">阅读文章<select className="classroom-input" value={articleId} disabled={busy} onChange={(event) => setArticleId(event.target.value)} required>
        {options.map((article) => <option key={article.id} value={article.id}>{article.level} · {article.title} · {article.questions.length} 题</option>)}
      </select></label>
      <label className="classroom-field">截止时间<input aria-label="作业截止时间" className="classroom-input" type="datetime-local" value={dueAt} disabled={busy} required onChange={(event) => setDueAt(event.target.value)} /></label>
      <PrimaryButton type="submit" disabled={busy || !articleId || !dueAt}>{busy ? '发布中…' : '发布阅读作业'}</PrimaryButton>
    </form>
    <p className="classroom-helper">班级成员可见；逾期仍可补交。首次提交计入作业成绩，之后可查看结果。</p>
    {loading ? <p className="classroom-helper" role="status">正在加载作业…</p> : assignments.length ? <ul className="classroom-assignment-list">
      {assignments.map((item) => <li key={item.id}><div><h4>{item.article.title}</h4><p>截止 {formatClassroomDate(item.dueAt)} · {item.submittedCount}/{item.studentCount} 人已提交</p></div>
        <SecondaryButton aria-expanded={selectedId === item.id} onClick={() => setSelectedId((current) => current === item.id ? '' : item.id)}>查看提交情况</SecondaryButton></li>)}
    </ul> : <p className="classroom-empty">还没有阅读作业，从上方选择一篇文章开始。</p>}
    {selectedId && <section className="classroom-submissions" aria-label="作业提交情况">
      {detailError ? <p className="classroom-alert" role="alert">{detailError}</p> : !detail ? <p role="status">正在读取提交情况…</p> : <>
        <h4>{detail.assignment.article.title}</h4>
        <p className="classroom-helper">共 {detail.students.length} 位当前班级成员；成绩由服务端按发布时的题目计算。</p>
        {detail.students.length ? <ul className="classroom-assignment-list">{detail.students.map((student) => <li key={student.id}>
          <div><strong>{student.displayName}</strong><p>{student.email}</p></div>
          <div className="classroom-assignment-result"><span className="classroom-badge">{statusLabels[student.status]}</span><strong>{score(student)}</strong>
            {student.submittedAt && <small>{formatClassroomDate(student.submittedAt)}</small>}</div>
        </li>)}</ul> : <p className="classroom-empty">等待学生加入班级。</p>}
      </>}
    </section>}
  </section>;
}

export function StudentReadingAssignments({ userId, onStart }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true); setError('');
      try { const result = await loadStudentAssignments(controller.signal, userId); if (!controller.signal.aborted) setAssignments(result.assignments); }
      catch (err) { if (!controller.signal.aborted) setError(err.message); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    };
    load(); return () => controller.abort();
  }, [userId, refresh]);
  return <BaseCard className="classroom-panel classroom-student-assignments" aria-label="我的阅读作业">
    <div className="classroom-heading"><div><h2>班级阅读作业</h2><p>完成全部阅读题后提交，老师即可查看本次成绩。</p></div>
      <SecondaryButton disabled={loading} onClick={() => setRefresh((value) => value + 1)}>刷新作业</SecondaryButton></div>
    {error && <p className="classroom-alert" role="alert">{error}</p>}
    {loading ? <p className="classroom-helper" role="status">正在加载作业…</p> : assignments.length ? <ul className="classroom-assignment-list">
      {assignments.map((item) => <li key={item.id}><div><span className="classroom-badge">{statusLabels[item.status]}</span><h3>{item.article.title}</h3>
        <p>{item.className} · 截止 {formatClassroomDate(item.dueAt)}</p>{item.submittedAt && <p>本次成绩 {score(item)}</p>}</div>
        <PrimaryButton onClick={() => onStart(item)}>{item.submittedAt ? '查看作业结果' : '进入阅读作业'}</PrimaryButton>
      </li>)}
    </ul> : <div className="classroom-empty"><h3>暂无阅读作业</h3><p>老师发布后会显示在这里，你也可以继续完成自己的学习计划。</p></div>}
  </BaseCard>;
}
