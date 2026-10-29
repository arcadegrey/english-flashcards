import AssetImage from '../ui/AssetImage';
import { useMemo, useState } from 'react';
import { StatCard } from '../ui/Cards';
import { SecondaryButton } from '../ui/Buttons';
import { readingMetadata as readings } from '../../data/readingMetadata.js';
import { buildStudentReadingOverview, formatClassroomDate } from '../../utils/classroom';

export default function StudentReadingProgress({ history = [] }) {
  const overview = useMemo(() => buildStudentReadingOverview(history, readings), [history]);
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(overview.rows.length / 20));
  const currentPage = Math.min(page, pageCount);
  const rows = overview.rows.slice((currentPage - 1) * 20, currentPage * 20);

  return (
    <div className="classroom-reading-progress" role="region" aria-label="学生阅读记录">
      <div className="classroom-stat-grid">
        <StatCard value={overview.totals.readingsCompleted} label="完成阅读（篇次）" iconSrc="/images/ui-assets/training-card-reading-blue-v1.png" />
        <StatCard value={overview.totals.readingQuestionsAnswered} label="阅读答题数" iconSrc="/images/ui-assets/training-card-test-blue-v1.png" />
        <StatCard value={overview.accuracy == null ? '—' : `${overview.accuracy}%`} label="阅读正确率" iconSrc="/images/ui-assets/stat-target.png" />
        <StatCard value={overview.today.readingsCompleted} label="今日阅读（篇）" iconSrc="/images/ui-assets/stat-star.png" />
      </div>
      <div className="classroom-reading-heading">
        <h3>阅读完成记录</h3>
        <span className="classroom-helper">最近 90 个学习日 · 共 {overview.totals.readingsCompleted} 篇次</span>
      </div>
      <p className="classroom-helper">学生点击“完成阅读”并同步后显示；正确率按已答题数计算，同一文章在不同日期完成会分别记录。</p>
      {rows.length ? (
        <ul className="classroom-reading-list">
          {rows.map((row) => (
            <li key={row.id}>
              <div className="classroom-reading-article">
                <strong>{row.title}</strong>
                <div className="classroom-reading-tags">
                  {row.level && <span className="classroom-badge">{row.level}</span>}
                  {row.examType && <span className="classroom-badge">{row.examType}</span>}
                  <time dateTime={row.completedAt}>{/^\d{4}-\d{2}-\d{2}$/.test(row.completedAt) ? row.completedAt : formatClassroomDate(row.completedAt)}</time>
                </div>
              </div>
              <div className="classroom-reading-score">
                {row.accuracy == null ? (
                  <><strong>已完成阅读</strong><span>{row.hasResult ? '未记录答题' : '暂无答题明细'}</span></>
                ) : (
                  <><strong>{row.accuracy}%</strong><span>答对 {row.questionsCorrect} / 已答 {row.questionsAnswered} 题</span></>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="classroom-empty">
          <AssetImage src="/images/ui-assets/training-card-reading-blue-v1.png" alt="" />
          <h3>{overview.totals.readingsCompleted ? '暂无逐篇阅读明细' : '暂无已同步的阅读记录'}</h3>
          <p>{overview.totals.readingsCompleted ? '已有记录只包含汇总数据，后续完成阅读会显示文章与成绩。' : '学生完成一篇阅读并同步后，可以在这里查看文章与答题成绩。'}</p>
        </div>
      )}
      {pageCount > 1 && (
        <div className="classroom-pagination">
          <SecondaryButton disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>上一页</SecondaryButton>
          <span>第 {currentPage} / {pageCount} 页</span>
          <SecondaryButton disabled={currentPage >= pageCount} onClick={() => setPage(currentPage + 1)}>下一页</SecondaryButton>
        </div>
      )}
    </div>
  );
}
