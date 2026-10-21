import { useMemo, useState } from 'react';
import { SecondaryButton } from '../ui/Buttons';
import useReadingAttempts from '../../hooks/useReadingAttempts';
import { collectReadingMistakes, wrongReadingQuestions } from '../../../shared/readingAttempts.js';
import { formatClassroomDate } from '../../utils/classroom';

export default function ReadingReviewPanel({ userId, onRetry }) {
  const history=useReadingAttempts(userId);
  const [tab,setTab]=useState('history');
  const mistakes=useMemo(()=>collectReadingMistakes(history.attempts),[history.attempts]);
  const rows=tab==='history' ? history.attempts : [...new Map(mistakes.map(item=>[item.attempt.id,item.attempt])).values()];
  return <section className="reading-review-panel" aria-label="阅读历史与错题本">
    <div className="classroom-heading"><div><h3>阅读复盘</h3><p>保留最近 100 次练习的答案与解析。重做错题不会改变原成绩。</p></div>{userId && <SecondaryButton disabled={history.busy} onClick={history.sync}>{history.busy?'同步中…':'同步历史'}</SecondaryButton>}</div>
    <div className="classroom-tabs" role="group" aria-label="阅读复盘分类"><button type="button" className={tab==='history'?'is-active':''} aria-pressed={tab==='history'} onClick={()=>setTab('history')}>练习历史 · {history.attempts.length}</button><button type="button" className={tab==='wrong'?'is-active':''} aria-pressed={tab==='wrong'} onClick={()=>setTab('wrong')}>阅读错题 · {mistakes.length}</button></div>
    <p className="classroom-helper">{!userId?'访客记录保存在当前设备，登录账号后的记录独立保存。':history.pending?`${history.pending} 次练习待同步，本机记录已保留。`:'当前账号的练习历史'} {history.error && <span role="alert">{history.error} 请点击同步历史重试。</span>}</p>
    {rows.length ? rows.map(attempt=>{
      const wrong=wrongReadingQuestions(attempt);
      const questions=tab==='wrong' ? mistakes.filter(item=>item.attempt.id===attempt.id).map(item=>item.question) : attempt.article.questions;
      return <details key={attempt.id} className="reading-review-detail"><summary>{attempt.article.level} · {attempt.article.title} · {attempt.questionsCorrect}/{attempt.questionsAnswered} 题 · {formatClassroomDate(attempt.completedAt)}{attempt.parentId?' · 错题重做':''}{attempt.assignmentId?' · 班级作业':''}</summary>
        {questions.map(question=><article className="reading-question-card" key={question.id}><h4 className="reading-question-prompt">{question.prompt}</h4><p className="classroom-helper">我的答案：{attempt.answers[question.id]} · {question.options.find(option=>option.id===attempt.answers[question.id])?.label}</p><p className="reading-question-feedback">正确答案：{question.answer} · {question.options.find(option=>option.id.toLowerCase()===question.answer.toLowerCase())?.label}</p><p className="classroom-helper">{question.explanation || '请回到文章定位相关信息。'}</p></article>)}
        {wrong.length>0 && <SecondaryButton onClick={()=>onRetry?.(attempt)}>只重做错题（{wrong.length} 题）</SecondaryButton>}
      </details>;
    }) : <div className="classroom-empty"><h3>{tab==='wrong'?'暂无待巩固的阅读错题':'还没有阅读练习历史'}</h3><p>{tab==='wrong'?'完成阅读练习后，答错的题会显示在这里。':'选择一篇带题文章，完成全部题目并保存练习。'}</p></div>}
  </section>;
}
