import { useEffect, useMemo, useState } from 'react';
import { StatCard } from '../ui/Cards';
import { SecondaryButton } from '../ui/Buttons';
import { LinearProgress } from '../ui/Progress';
import { loadStudentProgress } from '../../utils/classroomApi';
import { buildStudentWordRows, formatClassroomDate } from '../../utils/classroom';
import { loadFullVocabulary } from '../../data/vocabulary';
import { RETIRED_VOCABULARY } from '../../../shared/retiredVocabulary.js';
import StudentReadingProgress from './StudentReadingProgress';
import { ExamAttemptList } from '../assessment/ExamHistoryPanel';

const FILTERS = [{ id: 'all', label: '全部记录' }, { id: 'learned', label: '已学习' }, { id: 'mastered', label: '标记认识' }, { id: 'wrong', label: '错词' }, { id: 'due', label: '待复习' }];

export default function StudentProgressPanel({ classId, student, onBack, initialVocabulary }) {
  const [data, setData] = useState(null);
  const [vocabulary, setVocabulary] = useState(initialVocabulary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [wordError, setWordError] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [recordType, setRecordType] = useState('words');
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true); setError(''); setWordError(''); setData(null);
      try {
        const [result, words] = await Promise.all([
          loadStudentProgress(classId, student.id, controller.signal),
          loadFullVocabulary().then((items) => ({ items })).catch((err) => ({ error: err.message })),
        ]);
        if (controller.signal.aborted) return;
        setData(result);
        if (words.items) setVocabulary(words.items);
        else setWordError('部分词条内容未能加载，仍可查看进度；请刷新重试。');
      } catch (err) { if (!controller.signal.aborted) setError(err.message); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    };
    load();
    return () => controller.abort();
  }, [classId, student.id, refresh]);
  const rows = useMemo(() => buildStudentWordRows(data?.progress, [...RETIRED_VOCABULARY, ...vocabulary]), [data, vocabulary]);
  const filteredRows = useMemo(() => rows.filter((row) => {
    const matchesFilter = filter === 'all' || (filter === 'wrong' ? row.wrong : filter === 'due' ? row.due : row.status === filter);
    return matchesFilter && `${row.word} ${row.meaning}`.toLowerCase().includes(search.trim().toLowerCase());
  }), [rows, filter, search]);
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / 20));
  const currentPage = Math.min(page, pageCount);
  const currentRows = filteredRows.slice((currentPage - 1) * 20, currentPage * 20);
  const masteredCount = rows.filter((row) => row.status === 'mastered').length;
  const mastery = rows.length ? Math.round((masteredCount / rows.length) * 100) : 0;
  return (
    <section aria-label="学生学习记录" className="classroom-student-detail">
      <div className="classroom-heading"><div><h2>{student.displayName}的学习记录</h2><p>{student.email} · 只读查看</p></div><div className="classroom-actions"><SecondaryButton onClick={onBack}>返回学生列表</SecondaryButton><SecondaryButton disabled={loading} onClick={() => setRefresh((value) => value + 1)}>刷新记录</SecondaryButton></div></div>
      {loading ? <p role="status" className="classroom-empty">正在读取学习记录…</p> : error ? <div role="alert" className="classroom-alert">{error}<SecondaryButton onClick={() => setRefresh((value) => value + 1)}>重试</SecondaryButton></div> : data && (
        <>
          <p className="classroom-helper">最近同步：{formatClassroomDate(data.updatedAt)}。学生尚未同步的本机学习不会显示。</p>
          <div className="classroom-tabs classroom-record-tabs" role="group" aria-label="学习记录类型">
            <button type="button" className={recordType === 'words' ? 'is-active' : ''} aria-pressed={recordType === 'words'} onClick={() => setRecordType('words')}>单词学习</button>
            <button type="button" className={recordType === 'reading' ? 'is-active' : ''} aria-pressed={recordType === 'reading'} onClick={() => setRecordType('reading')}>阅读练习</button>
            <button type="button" className={recordType === 'exam' ? 'is-active' : ''} aria-pressed={recordType === 'exam'} onClick={() => setRecordType('exam')}>测试成绩</button>
          </div>
          {recordType === 'exam' ? <section aria-label="学生测试成绩"><p className="classroom-helper">最近 100 次已同步自主测试，允许提示与重试，用于学习反馈；班级作业的首次成绩请在作业提交情况中查看。</p><ExamAttemptList attempts={data.examAttempts || []} /></section> : recordType === 'reading' ? <StudentReadingProgress history={data.progress.studyHistory} /> : <>
          <div className="classroom-stat-grid">
            <StatCard value={data.student.learnedCount} label="已学习单词" iconSrc="/images/ui-assets/training-card-vocabulary-blue-v1.png" />
            <StatCard value={data.student.masteredCount} label="标记认识单词" iconSrc="/images/ui-assets/stat-star.png" />
            <StatCard value={rows.filter((row) => row.due).length} label="待复习单词" iconSrc="/images/ui-assets/training-card-review-blue-v1.png" />
            <StatCard value={data.student.todayStudied} label="今日练词次数" iconSrc="/images/ui-assets/training-card-test-blue-v1.png" />
          </div>
          <div className="classroom-mastery"><span>已记录词汇的认识标记比例</span><strong>{mastery}%</strong><LinearProgress value={mastery} /></div>
          {wordError && <p role="status" className="classroom-helper">{wordError}</p>}
          <div className="classroom-word-tools"><div className="classroom-tabs" aria-label="单词状态筛选">{FILTERS.map((item) => <button type="button" key={item.id} className={filter === item.id ? 'is-active' : ''} aria-pressed={filter === item.id} onClick={() => { setFilter(item.id); setPage(1); }}>{item.label}</button>)}</div>
            <input type="search" className="classroom-input" aria-label="搜索学生单词" placeholder="搜索单词或释义" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} />
          </div>
          <p className="classroom-helper">共 {filteredRows.length} 个单词</p>
          {currentRows.length ? <ul className="classroom-word-list">{currentRows.map((row) => <li key={row.id}>
            <div><strong>{row.word}</strong>{row.phonetic && <small>{row.phonetic}</small>}<p>{row.meaning}</p></div>
            <div className="classroom-word-status"><span className={`classroom-badge is-${row.status}`}>{row.status === 'mastered' ? '标记认识' : row.status === 'learned' ? '已学习' : '待巩固'}</span>{row.wrong && <span className="classroom-badge is-wrong">错词</span>}{row.due && <span className="classroom-badge">待复习</span>}</div>
            <div className="classroom-word-dates"><span>最近学习：{row.lastReviewed ? formatClassroomDate(row.lastReviewed) : '暂无记录'}</span><span>下次复习：{row.nextReview ? formatClassroomDate(row.nextReview) : '待安排'}</span></div>
          </li>)}</ul> : <div className="classroom-empty"><h3>{rows.length ? '没有符合条件的单词' : '暂无已同步的单词'}</h3><p>{rows.length ? '试试其他状态或关键词。' : '学生完成学习并同步后，记录会显示在这里。'}</p></div>}
          {pageCount > 1 && <div className="classroom-pagination"><SecondaryButton disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>上一页</SecondaryButton><span>第 {currentPage} / {pageCount} 页</span><SecondaryButton disabled={currentPage >= pageCount} onClick={() => setPage(currentPage + 1)}>下一页</SecondaryButton></div>}
          </>}
        </>
      )}
    </section>
  );
}
