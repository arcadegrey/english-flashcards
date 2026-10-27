import LoadingState from '../ui/LoadingState';
import { useEffect, useState } from 'react';
import { BaseCard } from '../ui/Cards';
import { PrimaryButton, SecondaryButton } from '../ui/Buttons';
import readings from '../../data/readings';
import { WORD_ASSIGNMENT_CATEGORIES } from '../../../shared/wordAssignments.js';
import { formatClassroomDate } from '../../utils/classroom';
import { loadReadingAssignments, publishReadingAssignment, loadAssignmentSubmissions, loadStudentAssignments,
  loadWordAssignments, publishWordAssignment, loadWordSubmissions, loadStudentWordAssignments } from '../../utils/classroomApi';

const statusLabels = { pending:'待完成', overdue:'已逾期，可补交', submitted:'已提交', submitted_late:'已补交' };
const title = (item) => item.type === 'words' ? item.title : item.article.title;
const score = (item) => item.questionsAnswered ? `${Math.round(item.questionsCorrect / item.questionsAnswered * 100)}%（${item.questionsCorrect}/${item.questionsAnswered} 题）` : '—';
const tomorrow = () => {
  const date = new Date(Date.now() + 86400000); date.setHours(20,0,0,0);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0,16);
};
const combine = (reading, words) => [...reading.assignments.map(item=>({...item,type:'reading'})),...words.assignments]
  .sort((a,b)=>Number(Boolean(a.submittedAt))-Number(Boolean(b.submittedAt)) || a.dueAt.localeCompare(b.dueAt));

export function TeacherReadingAssignments({ classId, userId }) {
  const options=readings.filter(article=>article.questions?.length);
  const [type,setType]=useState('reading');
  const [articleId,setArticleId]=useState(String(options[0]?.id || ''));
  const [category,setCategory]=useState('daily');
  const [start,setStart]=useState(1);
  const [count,setCount]=useState(15);
  const [dueAt,setDueAt]=useState(tomorrow);
  const [assignments,setAssignments]=useState([]);
  const [loading,setLoading]=useState(true);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');
  const [refresh,setRefresh]=useState(0);
  const [selected,setSelected]=useState(null);
  const [detail,setDetail]=useState(null);
  const [detailError,setDetailError]=useState('');
  useEffect(()=>{
    const controller=new AbortController();
    const load=async()=>{
      setLoading(true);setError('');
      try {
        const [reading,words]=await Promise.all([loadReadingAssignments(classId,controller.signal,userId),loadWordAssignments(classId,controller.signal,userId)]);
        if(!controller.signal.aborted)setAssignments(combine(reading,words));
      } catch(err){if(!controller.signal.aborted)setError(err.message);}
      finally{if(!controller.signal.aborted)setLoading(false);}
    };load();return()=>controller.abort();
  },[classId,userId,refresh]);
  useEffect(()=>{
    if(!selected)return;
    const controller=new AbortController();
    const load=async()=>{
      setDetail(null);setDetailError('');
      try{
        const result=await (selected.type==='words' ? loadWordSubmissions : loadAssignmentSubmissions)(selected.id,controller.signal,userId);
        if(!controller.signal.aborted)setDetail(result);
      }catch(err){if(!controller.signal.aborted)setDetailError(err.message);}
    };load();return()=>controller.abort();
  },[selected,userId,refresh]);
  const publish=async(event)=>{
    event.preventDefault();if(busy)return;setBusy(true);setError('');setNotice('');
    try{
      const deadline=new Date(dueAt).toISOString();
      if(type==='words')await publishWordAssignment(classId,{category,start:Number(start),count:Number(count),dueAt:deadline},userId);
      else await publishReadingAssignment(classId,{articleId,dueAt:deadline},userId);
      setNotice('作业已发布，学生可在今日计划和我的班级中查看。');setRefresh(value=>value+1);
    }catch(err){setError(err.message);}finally{setBusy(false);}
  };
  return <section className="classroom-assignments" aria-label="班级作业管理">
    <div className="classroom-heading"><div><h3>布置作业</h3><p>指定阅读文章或词库范围，设置截止时间，查看学生的首次成绩。</p></div><SecondaryButton disabled={loading} onClick={()=>setRefresh(value=>value+1)}>刷新作业</SecondaryButton></div>
    <div className="classroom-tabs" role="group" aria-label="作业类型">{[['reading','阅读作业'],['words','词汇作业']].map(([id,label])=><button key={id} type="button" disabled={busy} aria-pressed={type===id} className={type===id?'is-active':''} onClick={()=>setType(id)}>{label}</button>)}</div>
    {error && <p className="classroom-alert" role="alert">{error}</p>}{notice && <p className="classroom-notice" role="status">{notice}</p>}
    <form className="classroom-assignment-form" onSubmit={publish}>
      {type==='reading' ? <label className="classroom-field">阅读文章<select aria-label="阅读文章" className="classroom-input" value={articleId} disabled={busy} onChange={event=>setArticleId(event.target.value)} required>{options.map(article=><option key={article.id} value={article.id}>{article.level} · {article.title} · {article.questions.length} 题</option>)}</select></label>
        : <div className="word-assignment-range"><label className="classroom-field">词库<select aria-label="词库" className="classroom-input" disabled={busy} value={category} onChange={event=>setCategory(event.target.value)}>{Object.entries(WORD_ASSIGNMENT_CATEGORIES).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>
          <label className="classroom-field">起始序号<input className="classroom-input" type="number" min="1" step="1" value={start} disabled={busy} required onChange={event=>setStart(event.target.value)} /></label>
          <label className="classroom-field">词数<input className="classroom-input" type="number" min="5" max="50" step="1" value={count} disabled={busy} required onChange={event=>setCount(event.target.value)} /></label></div>}
      <label className="classroom-field">截止时间<input aria-label="作业截止时间" className="classroom-input" type="datetime-local" value={dueAt} disabled={busy} required onChange={event=>setDueAt(event.target.value)} /></label>
      <PrimaryButton type="submit" loading={busy} disabled={busy || !dueAt}>{busy?'发布中…':'发布作业'}</PrimaryButton>
    </form>
    <p className="classroom-helper">{type==='words'?'按当前词库顺序固定范围，每次 5–50 词，学生完成词义测验后提交。':'发布后保留文章、题目和解析。'} 逾期可补交，首次成绩固定。</p>
    {loading ? <LoadingState title="正在加载作业…" /> : assignments.length ? <ul className="classroom-assignment-list">{assignments.map(item=><li key={`${item.type}:${item.id}`}><div><span className="classroom-badge">{item.type==='words'?'词汇作业':'阅读作业'}</span><h4>{title(item)}</h4><p>截止 {formatClassroomDate(item.dueAt)} · {item.submittedCount}/{item.studentCount} 人已提交</p></div><SecondaryButton aria-expanded={selected?.id===item.id} onClick={()=>setSelected(current=>current?.id===item.id?null:item)}>查看提交情况</SecondaryButton></li>)}</ul> : <p className="classroom-empty">还没有作业，从上方选择内容开始。</p>}
    {selected && <section className="classroom-submissions" aria-label="作业提交情况">{detailError ? <p role="alert">{detailError}</p> : !detail ? <LoadingState title="正在读取提交情况…" /> : <><h4>{title({...detail.assignment,type:selected.type})}</h4><p className="classroom-helper">共 {detail.students.length} 位当前班级成员 · 成绩由服务端计算</p><ul className="classroom-assignment-list">{detail.students.map(student=><li key={student.id}><div><strong>{student.displayName}</strong><p>{student.email}</p></div><div className="classroom-assignment-result"><span className="classroom-badge">{statusLabels[student.status]}</span><strong>{score(student)}</strong>{student.submittedAt && <small>{formatClassroomDate(student.submittedAt)}</small>}</div></li>)}</ul>{!detail.students.length && <p className="classroom-empty">等待学生加入班级。</p>}</>}</section>}
  </section>;
}

export function StudentReadingAssignments({ userId, onStart }) {
  const [assignments,setAssignments]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[refresh,setRefresh]=useState(0);
  useEffect(()=>{
    const controller=new AbortController();
    const load=async()=>{
      setLoading(true);setError('');
      try{const [reading,words]=await Promise.all([loadStudentAssignments(controller.signal,userId),loadStudentWordAssignments(controller.signal,userId)]);if(!controller.signal.aborted)setAssignments(combine(reading,words));}
      catch(err){if(!controller.signal.aborted)setError(err.message);}finally{if(!controller.signal.aborted)setLoading(false);}
    };load();return()=>controller.abort();
  },[userId,refresh]);
  return <BaseCard className="classroom-panel classroom-student-assignments" aria-label="我的班级作业"><div className="classroom-heading"><div><h2>班级作业</h2><p>完成阅读或词汇测验后提交，老师即可查看成绩。</p></div><SecondaryButton disabled={loading} onClick={()=>setRefresh(value=>value+1)}>刷新作业</SecondaryButton></div>
    {error && <p className="classroom-alert" role="alert">{error}</p>}{loading ? <LoadingState title="正在加载作业…" /> : assignments.length ? <ul className="classroom-assignment-list">{assignments.map(item=><li key={`${item.type}:${item.id}`}><div><span className="classroom-badge">{item.type==='words'?'词汇':'阅读'} · {statusLabels[item.status]}</span><h3>{title(item)}</h3><p>{item.className} · 截止 {formatClassroomDate(item.dueAt)}</p>{item.submittedAt && <p>首次成绩 {score(item)}</p>}</div><PrimaryButton onClick={()=>onStart(item)}>{item.submittedAt?'查看作业结果':'进入作业'}</PrimaryButton></li>)}</ul> : <div className="classroom-empty"><h3>暂无班级作业</h3><p>老师发布后会显示在这里，也可以继续自己的学习计划。</p></div>}
  </BaseCard>;
}
