import { useMemo, useState } from 'react';
import { PrimaryButton, SecondaryButton } from '../ui/Buttons';
import AssetImage from '../ui/AssetImage';
import LoadingState from '../ui/LoadingState';
import useReadingAttempts from '../../hooks/useReadingAttempts';
import { collectReadingMistakes, wrongReadingQuestions } from '../../../shared/readingAttempts.js';
import { formatClassroomDate } from '../../utils/classroom';
import '../../styles/classroom.css';
import '../../styles/reading-review.css';

function ReviewIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 6C9 4 6 4 3 5v14c3-1 6-1 9 1M12 6c3-2 6-2 9-1v7M12 6v14" />
    <path d="M21 15v3h-3M21 18a4 4 0 1 0-1 3" />
  </svg>;
}

export default function ReadingReviewPanel({ userId, onRetry, onChooseArticle }) {
  const history=useReadingAttempts(userId);
  const [tab,setTab]=useState('history');
  const mistakes=useMemo(()=>collectReadingMistakes(history.attempts),[history.attempts]);
  const rows=tab==='history' ? history.attempts : [...new Map(mistakes.map(item=>[item.attempt.id,item.attempt])).values()];
  return <section className="reading-review-panel" aria-label="阅读历史与错题本">
    <div className="reading-review-heading">
      <span className="reading-review-heading-icon"><ReviewIcon /></span>
      <div className="reading-review-heading-copy"><h3>阅读复盘</h3><p>回看答案与解析，让每次练习都有收获。</p></div>
      <div className="reading-review-heading-actions">
        <span className="reading-review-limit">最近 100 次</span>
        {userId && <SecondaryButton loading={history.busy} disabled={history.busy} onClick={history.sync}>{history.busy?'同步中…':'同步历史'}</SecondaryButton>}
      </div>
    </div>
    <div className="reading-review-tabs" role="group" aria-label="阅读复盘分类">
      <button type="button" className={tab==='history'?'is-active':''} aria-pressed={tab==='history'} onClick={()=>setTab('history')}>练习历史 <span>{history.attempts.length}</span></button>
      <button type="button" className={tab==='wrong'?'is-active':''} aria-pressed={tab==='wrong'} onClick={()=>setTab('wrong')}>阅读错题 <span>{mistakes.length}</span></button>
    </div>
    {rows.length ? <div className="reading-review-records">{rows.map(attempt=>{
      const wrong=wrongReadingQuestions(attempt);
      const questions=tab==='wrong' ? mistakes.filter(item=>item.attempt.id===attempt.id).map(item=>item.question) : attempt.article.questions;
      return <details key={attempt.id} className="reading-review-detail"><summary>
        <span className="reading-review-level">{attempt.article.level || '阅读'}</span>
        <span className="reading-review-record-copy"><span className="reading-review-record-title">{attempt.article.title}</span><span className="reading-review-record-meta">{formatClassroomDate(attempt.completedAt)}{attempt.parentId?' · 错题重做':''}{attempt.assignmentId?' · 班级作业':''}</span></span>
        <span className="reading-review-score">{attempt.questionsCorrect}/{attempt.questionsAnswered} 题</span>
        <svg className="reading-review-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
      </summary>
        <div className="reading-review-answers">
        {questions.map(question=><article className="reading-question-card" key={question.id}><h4 className="reading-question-prompt">{question.prompt}</h4><p className="classroom-helper">我的答案：{attempt.answers[question.id]} · {question.options.find(option=>option.id===attempt.answers[question.id])?.label}</p><p className="reading-question-feedback">正确答案：{question.answer} · {question.options.find(option=>option.id.toLowerCase()===question.answer.toLowerCase())?.label}</p><p className="classroom-helper">{question.explanation || '请回到文章定位相关信息。'}</p></article>)}
        {wrong.length>0 && <SecondaryButton onClick={()=>onRetry?.(attempt)}>只重做错题（{wrong.length} 题）</SecondaryButton>}
        </div>
      </details>;
    })}</div> : history.busy ? <div className="reading-review-loading"><LoadingState title="正在同步阅读记录…" variant="inline" /></div> : <div className="reading-review-empty">
      <AssetImage className="reading-review-art" src="/images/ui-assets/reading-review-clay-v1.png" alt="" width="180" height="180" loading="lazy" />
      <div className="reading-review-empty-copy">
        <h4>{tab==='wrong'?'暂无待巩固的阅读错题':'从第一篇阅读开始'}</h4>
        <p>{tab==='wrong'?'完成阅读练习后，答错的题会显示在这里。':'完成带题文章后，答案与解析会自动收录在这里。'}</p>
        <p>{tab==='wrong'?'继续阅读，遇到薄弱题再回来看一看。':'随时回看，也可以只重做错题。'}</p>
      </div>
      <div className="reading-review-empty-actions">
        {onChooseArticle && <PrimaryButton onClick={onChooseArticle}>选择文章 <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" /></svg></PrimaryButton>}
        <p>重做错题不改变原成绩。</p>
      </div>
    </div>}
    <div className="reading-review-status">
      <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8m-4-4v4" /></svg>
      <p>{!userId?'访客记录保存在当前设备，登录后的记录独立保存。':history.pending?`${history.pending} 次练习待同步，本机记录已保留。`:'当前账号的练习历史'} {history.error && <span className="reading-review-error" role="alert">{history.error} 请点击同步历史重试。</span>}</p>
    </div>
  </section>;
}
