import { useRef, useState } from 'react';
import { formatReadingLevelLabel } from './readingPickerModel';

const COVERS = [
  { match: /wetland|green|nature|environment|water|climate|bird|garden/i, image: 'ielts-nature-geography-bg.webp' },
  { match: /space|planet|astronom/i, image: 'ielts-space-exploration-bg.webp' },
  { match: /food|cook|dinner|coffee|meal/i, image: 'ielts-food-health-bg.webp' },
  { match: /technology|innovation|digital|phone/i, image: 'ielts-technology-invention-bg.webp' },
  { match: /health|sleep|sport/i, image: 'ielts-food-health-bg.webp' },
  { match: /habit|friend|community|team/i, image: 'ielts-social-relationships-bg.webp' },
];

function coverFor(article) {
  const topic = [article.title, article.category, ...(article.tags || [])].join(' ');
  return `/images/${COVERS.find(cover => cover.match.test(topic))?.image || 'ielts-school-education-bg.webp'}`;
}

// Rotate the supplied library only; article identity and reading entry stay unchanged.
export default function RecommendedReadings({ readings = [], onOpenArticle }) {
  const [offset, setOffset] = useState(0);
  const rail = useRef(null);
  if (!readings.length) return null;
  const start = offset % readings.length;
  const articles = Array.from({ length: Math.min(3, readings.length) }, (_, index) => readings[(start + index) % readings.length]);

  return <section className="training-recommendations" aria-label="推荐阅读">
    <header className="training-recommendations-head">
      <h2>推荐内容</h2>
      {readings.length > 3 && <button type="button" onClick={() => {
        setOffset(current => (current + 3) % readings.length);
        rail.current?.scrollTo({ left: 0, behavior: 'auto' });
      }}>换一批<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 5v6h-6M4 19v-6h6M5.5 8a7 7 0 0 1 11.7-2L20 11M4 13l2.8 5A7 7 0 0 0 18.5 16" /></svg></button>}
    </header>
    <div className="training-recommendations-rail" ref={rail}>
      {articles.map(article => <button type="button" key={article.id} className="training-reading-card" onClick={() => onOpenArticle(article)}>
        <img src={coverFor(article)} alt="" loading="lazy" aria-hidden="true" />
        <span className="training-reading-tag">{article.examType || '阅读'}</span>
        <strong>{article.title}</strong>
        <span className="training-reading-meta">{article.estimatedMinutes ? `${article.estimatedMinutes} 分钟 · ` : ''}{formatReadingLevelLabel(article.level)}</span>
      </button>)}
    </div>
  </section>;
}
