import LoadingState from '../ui/LoadingState';
import { useEffect, useState } from 'react';
import { weekRange } from '../../../shared/weeklyReport.js';
import { StatCard } from '../ui/Cards';
import { PrimaryButton, SecondaryButton } from '../ui/Buttons';
import { loadWeeklyReport, publishReadingAssignment, publishWordAssignment } from '../../utils/classroomApi';

const shiftWeek = (week, days) => new Date(Date.parse(week) + days * 86400000).toISOString().slice(0, 10);
const tomorrow = () => {
  const date = new Date(Date.now() + 86400000); date.setHours(20, 0, 0, 0);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

export default function ClassWeeklyReport({ classId, userId, refreshKey, onSelectStudent, onPublished }) {
  const [week, setWeek] = useState(() => weekRange().start);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [recommendation, setRecommendation] = useState(null);
  const [dueAt, setDueAt] = useState(tomorrow);
  const [busy, setBusy] = useState(false);
  const [page, setPage] = useState(1);
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true); setError(''); setData(null);
      try {
        const report = await loadWeeklyReport(classId, week, controller.signal, userId);
        if (!controller.signal.aborted) setData(report);
      } catch (err) { if (!controller.signal.aborted) setError(err.message); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    };
    load(); return () => controller.abort();
  }, [classId, userId, week, refresh, refreshKey]);
  const chooseWeek = next => { setWeek(next); setPage(1); setRecommendation(null); setNotice(''); };
  const publish = async event => {
    event.preventDefault(); if (busy) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const deadline = new Date(dueAt).toISOString();
      if (recommendation.type === 'words') await publishWordAssignment(classId, { category: 'all', wordIds: data.suggestedWords.map(word => word.id), dueAt: deadline }, userId);
      else await publishReadingAssignment(classId, { articleId: recommendation.articleId, dueAt: deadline }, userId);
      setRecommendation(null); setNotice('巩固作业已发布，学生可在今日计划中接收。');
      onPublished(); setRefresh(value => value + 1);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };
  const totalPages = Math.max(1, Math.ceil((data?.students.length || 0) / 10));
  const currentPage = Math.min(page, totalPages);
  return <section className="classroom-weekly" aria-label="班级周报">
    <div className="classroom-heading"><div><span className="classroom-badge">每周学习概览</span><h3>班级周报</h3><p>{week} — {shiftWeek(week, 6)} · 按北京时间周一至周日统计；旧日汇总保留原日期</p></div>
      <div className="classroom-actions"><SecondaryButton disabled={busy} onClick={() => chooseWeek(shiftWeek(week, -7))}>上一周</SecondaryButton><SecondaryButton disabled={busy || week >= weekRange().start} onClick={() => chooseWeek(shiftWeek(week, 7))}>下一周</SecondaryButton><SecondaryButton disabled={loading || busy} onClick={() => setRefresh(value => value + 1)}>刷新周报</SecondaryButton></div>
    </div>
    {error && <p className="classroom-alert" role="alert">{error}</p>}{notice && <p className="classroom-notice" role="status">{notice}</p>}
    {loading ? <LoadingState title="正在汇总班级学习记录…" /> : data && <>
      <div className="classroom-stat-grid">
        <StatCard value={`${data.totals.activeStudents}/${data.totals.studentCount}`} label="本周活跃学生" iconSrc="/images/ui-assets/stat-star.png" />
        <StatCard value={data.totals.wordsStudied} label="练词次数" iconSrc="/images/ui-assets/training-card-vocabulary-blue-v1.png" />
        <StatCard value={data.totals.readingsCompleted} label="完成阅读篇次" iconSrc="/images/ui-assets/training-card-reading-blue-v1.png" />
        <StatCard value={data.totals.examAccuracy == null ? '—' : `${data.totals.examAccuracy}%`} label="自主测试正确率" iconSrc="/images/ui-assets/stat-target.png" />
      </div>
      <p className="classroom-helper">测试答题 {data.totals.examAnswered} 次 · 已保存测试 {data.totals.savedTests} 组 · 阅读正确率 {data.totals.readingAccuracy == null ? '—' : `${data.totals.readingAccuracy}%`}。本周到期作业 {data.assignments.total} 份，已提交 {data.assignments.submitted}/{data.assignments.expected} 人次，其中补交 {data.assignments.late} 人次，逾期未交 {data.assignments.overdue} 人次。</p>
      <p className="classroom-helper">仅统计当前成员已同步的数据。旧的逐题记录缺失时保留日汇总；自主测试与班级作业分别计分，未同步和未保存的测试不推算为零分。</p>
      <div className="classroom-weekly-columns">
        <section aria-label="班级常错词"><div className="classroom-reading-heading"><h3>本周常错词</h3>{data.suggestedWords.length >= 5 && <SecondaryButton disabled={busy} onClick={() => { setRecommendation({ type: 'words' }); setNotice(''); }}>准备词汇巩固</SecondaryButton>}</div>
          {data.commonWords.length ? <ul className="classroom-assignment-list">{data.commonWords.slice(0, 8).map(word => <li key={word.wordId}><div><strong>{word.word}</strong><p>{word.meaning}</p></div><span className="classroom-badge is-wrong">{word.students} 人 · {word.errors} 次</span></li>)}</ul> : <p className="classroom-helper">本周暂无已保存的测试／作业错词明细。</p>}
        </section>
        <section aria-label="班级阅读薄弱点"><div className="classroom-reading-heading"><h3>阅读薄弱点</h3></div><p className="classroom-helper">按学生同一原题在本周最近一次作答汇总。</p>
          {data.weakReadings.length ? <ul className="classroom-assignment-list">{data.weakReadings.map(item => <li key={item.key}><div><strong>{item.level} · {item.title}</strong><p>{item.question}</p><p>正确率 {item.accuracy}% · {item.answered} 人作答</p>{item.assignable && <SecondaryButton disabled={busy} onClick={() => setRecommendation({ type: 'reading', articleId: item.articleId, title: item.title })}>准备阅读巩固</SecondaryButton>}</div></li>)}</ul> : <p className="classroom-helper">本周暂无需要巩固的已保存阅读题；旧汇总数据不推算逐题薄弱点。</p>}
        </section>
      </div>
      {recommendation && <form className="classroom-recommendation" aria-label="周报巩固作业预览" onSubmit={publish}>
        <h4>{recommendation.type === 'words' ? '词汇巩固作业预览' : `阅读巩固：${recommendation.title}`}</h4>
        {recommendation.type === 'words' && <><p className="classroom-helper">共 {data.suggestedWords.length} 词，其中 {Math.min(data.commonWords.length, data.suggestedWords.length)} 个来自本周常错词；不足 5 词时补充其他词。发布后全班接收。</p><p className="classroom-recommended-words">{data.suggestedWords.map(word => word.word).join(' · ')}</p></>}
        <label className="classroom-field">截止时间<input className="classroom-input" type="datetime-local" required value={dueAt} disabled={busy} onChange={event => setDueAt(event.target.value)} /></label>
        <div className="classroom-actions"><PrimaryButton type="submit" loading={busy} disabled={busy}>{busy ? '发布中…' : '发布巩固作业'}</PrimaryButton><SecondaryButton disabled={busy} onClick={() => setRecommendation(null)}>取消</SecondaryButton></div>
      </form>}
      <h4>学生本周概览</h4>
      <ul className="classroom-assignment-list">{data.students.slice((currentPage - 1) * 10, currentPage * 10).map(student => <li key={student.id}><div><strong>{student.displayName}</strong><p>活跃 {student.activeDays} 天 · 练词 {student.wordsStudied} 次 · 阅读 {student.readingsCompleted} 篇次 · 测试 {student.examAnswered} 次答题</p><p>本周到期作业 {student.assignmentsSubmitted}/{student.assignmentsExpected} 已交 · 测试正确率 {student.examAccuracy == null ? '—' : `${student.examAccuracy}%`}</p></div><SecondaryButton onClick={() => onSelectStudent(student)}>查看学习记录</SecondaryButton></li>)}</ul>
      {!data.students.length && <p className="classroom-empty">学生加入并同步学习后，这里会出现班级周报。</p>}
      {totalPages > 1 && <div className="classroom-pagination"><SecondaryButton disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>上一页</SecondaryButton><span>{currentPage}/{totalPages}</span><SecondaryButton disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)}>下一页</SecondaryButton></div>}
    </>}
  </section>;
}
