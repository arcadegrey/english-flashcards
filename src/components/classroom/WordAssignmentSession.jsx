import { useState } from 'react';
import AppLayout from '../layout/AppLayout';
import { BaseCard } from '../ui/Cards';
import { PrimaryButton, SecondaryButton } from '../ui/Buttons';
import { LinearProgress } from '../ui/Progress';
import useReadingDraft from '../../hooks/useReadingDraft';
import { submitWordAssignment } from '../../utils/classroomApi';
import { formatClassroomDate } from '../../utils/classroom';

export default function WordAssignmentSession({ assignment, userId, navItems, topbarProps, onBack, onSubmitted }) {
  const [result,setResult]=useState(assignment);
  const [busy,setBusy]=useState(false),[error,setError]=useState('');
  const draft=useReadingDraft(userId,`word-assignment:${assignment.id}`,`/word-assignments/${encodeURIComponent(assignment.id)}/session`);
  const answers=result.submittedAt ? result.answers : draft.session.answers;
  const answered=result.words.filter(word=>word.options.some(option=>option.id===answers[word.id])).length;
  const submit=async()=>{
    if(busy)return;setBusy(true);setError('');
    try{
      await draft.flush();
      const saved=await submitWordAssignment(assignment.id,draft.session.answers,userId);
      setResult(saved.assignment);onSubmitted?.(saved.assignment);
    }catch(err){setError(err.message);}finally{setBusy(false);}
  };
  return <AppLayout active="profile" title="词汇作业" subtitle={result.title} navItems={navItems} topbarProps={topbarProps}>
    <div className="ds-stack classroom-page"><BaseCard className="classroom-panel"><div className="classroom-heading"><div><span className="classroom-badge">{result.submittedAt?'已提交':'班级词汇测验'}</span><h2>{result.title}</h2><p>截止 {formatClassroomDate(result.dueAt)} · 共 {result.words.length} 词 · 首次成绩固定，逾期可补交</p></div><SecondaryButton onClick={onBack}>返回任务列表</SecondaryButton></div>
      <LinearProgress value={answered/result.words.length*100} /><p className="classroom-helper">已答 {answered}/{result.words.length} 题</p>
      {result.submittedAt && <div className="classroom-notice" role="status">作业已提交 · 首次成绩 {Math.round(result.questionsCorrect/result.questionsAnswered*100)}%（{result.questionsCorrect}/{result.questionsAnswered} 题）</div>}
      <div className="reading-question-list">{result.words.map((word,index)=><article key={word.id} className="reading-question-card"><h3 className="reading-question-prompt">{index+1}. {word.word}</h3><div className="reading-question-options">{word.options.map(option=><button key={option.id} type="button" disabled={Boolean(result.submittedAt)||busy||draft.status==='loading'} className={`reading-question-option ${answers[word.id]===option.id?'is-selected':''} ${result.submittedAt && option.id===word.answer?'is-answer':''}`} onClick={()=>draft.answer(word.id,option.id)}><span className="reading-question-option-key">{option.id}</span><span>{option.label}</span></button>)}</div>{result.submittedAt && <p className="reading-question-feedback">{answers[word.id]===word.answer?'回答正确':'需要巩固'} · 正确答案 {word.answer}：{word.meaning}</p>}</article>)}</div>
      {!result.submittedAt && <div className="reading-save-status"><p>{draft.status==='loading'?'正在恢复答案…':draft.status==='synced'?'答案已同步':draft.status==='syncing'?'正在同步…':'答案自动保存到本机'}</p>{draft.error && <p role="alert">{draft.error}<button className="classroom-text-button" type="button" onClick={()=>draft.flush().catch(()=>{})}>重试保存</button></p>}</div>}
      {error && <p className="classroom-alert" role="alert">{error}</p>}
      <div className="classroom-actions"><SecondaryButton onClick={onBack}>返回任务列表</SecondaryButton><PrimaryButton disabled={busy||Boolean(result.submittedAt)||answered!==result.words.length||draft.status==='loading'} onClick={submit}>{result.submittedAt?'成绩已保存':busy?'提交中…':'提交词汇作业'}</PrimaryButton></div>
    </BaseCard></div>
  </AppLayout>;
}
