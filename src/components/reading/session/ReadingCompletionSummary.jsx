export default function ReadingCompletionSummary({ effectiveSummary, articleMinutes }) {
  return (
    <section className="reading-completion-summary" aria-label="阅读完成总结">
      <div className="reading-completion-head">
        <span>完成总结</span>
        <strong>{effectiveSummary.hasQuestions ? `${effectiveSummary.accuracy}%` : '已读完'}</strong>
      </div>
      <div className="reading-completion-grid">
        <span>
          <b>{effectiveSummary.hasQuestions ? `${effectiveSummary.correct}/${effectiveSummary.answered}` : '暂无'}</b>
          {effectiveSummary.hasQuestions ? '阅读题' : '阅读题目'}
        </span>
        <span>
          <b>{effectiveSummary.unmasteredCount}</b>
          未标记认识词
        </span>
        <span>
          <b>{articleMinutes} 分钟</b>
          训练时长
        </span>
      </div>
      <p>{effectiveSummary.nextStep}</p>
    </section>
  );
}
