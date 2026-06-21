import { useRef } from 'react';
import { gsap, prefersReducedMotion, useGSAP } from '../utils/gsapMotion';

const DAY_NAMES_CN = ['日', '一', '二', '三', '四', '五', '六'];

const normalizeHistory = (value) => (Array.isArray(value) ? value : []);

const getLast7Days = (studyHistory) => {
  const days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayData = studyHistory.find((item) => item.date === dateStr) || {};

    days.push({
      date: dateStr,
      dayName: DAY_NAMES_CN[date.getDay()],
      day: date.getDate(),
      wordsLearned: Number(dayData.wordsLearned || 0),
      wordsMastered: Number(dayData.wordsMastered || 0),
      timeSpent: Number(dayData.timeSpent || 0),
    });
  }

  return days;
};

const calculateStreak = (studyHistory) => {
  const activeDates = new Set(
    studyHistory
      .filter((item) => Number(item.wordsLearned || 0) + Number(item.wordsMastered || 0) > 0)
      .map((item) => item.date)
  );
  const today = new Date();
  let streak = 0;
  let cursor = new Date(today);

  while (true) {
    const dateStr = cursor.toISOString().split('T')[0];
    if (activeDates.has(dateStr)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }

    if (dateStr === today.toISOString().split('T')[0]) {
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }

    break;
  }

  return streak;
};

const getCountMeta = (value) => {
  if (typeof value === 'number') {
    return { number: value, suffix: '' };
  }

  const match = String(value).match(/^(\d+)(.*)$/);
  if (!match) {
    return { number: null, suffix: '' };
  }

  return { number: Number(match[1]), suffix: match[2] };
};

function Statistics({
  learnedWords = [],
  masteredWords = [],
  wrongWords = [],
  studyHistory = [],
  totalWords = 0,
  dueReviewCount = 0,
}) {
  const statsRef = useRef(null);
  const safeHistory = normalizeHistory(studyHistory);
  const last7Days = getLast7Days(safeHistory);
  const maxActivity = Math.max(
    ...last7Days.map((item) => Number(item.wordsLearned || 0) + Number(item.wordsMastered || 0)),
    1
  );
  const learnedCount = learnedWords.length;
  const masteredCount = masteredWords.length;
  const streak = calculateStreak(safeHistory);
  const totalActions = safeHistory.reduce(
    (sum, item) => sum + Number(item.wordsLearned || 0) + Number(item.wordsMastered || 0),
    0
  );
  const masteredPercent = totalWords > 0 ? Math.round((masteredCount / totalWords) * 100) : 0;

  const cards = [
    { label: '今日复习', value: dueReviewCount, sub: '到期单词', tone: 'blue' },
    { label: '连续学习', value: `${streak} 天`, sub: '当前 streak', tone: 'orange' },
    { label: '已学习', value: learnedCount, sub: '复习队列', tone: 'violet' },
    { label: '已掌握', value: masteredCount, sub: `${masteredPercent}% 完成`, tone: 'green' },
    { label: '错题本', value: wrongWords.length, sub: '待巩固', tone: 'orange' },
    { label: '近 90 天', value: totalActions, sub: '学习动作', tone: 'cyan' },
  ];

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const values = statsRef.current?.querySelectorAll('[data-stat-value]');
    if (!values?.length) return;

    values.forEach((node) => {
      const target = Number(node.dataset.statValue || 0);
      const suffix = node.dataset.statSuffix || '';
      const counter = { value: 0 };

      gsap.to(counter, {
        value: target,
        duration: 0.72,
        ease: 'power2.out',
        onUpdate: () => {
          node.textContent = `${Math.round(counter.value)}${suffix}`;
        },
        onComplete: () => {
          node.textContent = `${target}${suffix}`;
        },
      });
    });

    gsap.fromTo(
      statsRef.current.querySelectorAll('.statistics-refresh-bar'),
      { scaleY: 0, transformOrigin: 'bottom center' },
      {
        scaleY: 1,
        duration: 0.52,
        ease: 'power2.out',
        stagger: 0.045,
        clearProps: 'transform',
      }
    );
  }, {
    dependencies: [dueReviewCount, learnedCount, masteredCount, wrongWords.length, totalActions, streak],
    scope: statsRef,
    revertOnUpdate: true,
  });

  return (
    <section ref={statsRef} className="statistics-dashboard ds-card learn-refresh-card-enter">
      <header className="statistics-dashboard-head">
        <span className="statistics-dashboard-kicker">Learning Dashboard</span>
        <h1>学习统计</h1>
        <p>用真实学习记录追踪复习、错题和掌握进度。</p>
      </header>

      <div className="statistics-card-grid">
        {cards.map((card) => {
          const countMeta = getCountMeta(card.value);

          return (
            <article
              key={card.label}
              className={`statistics-metric-card is-${card.tone}`}
            >
              <p className="statistics-metric-label">{card.label}</p>
              <p
                className="statistics-metric-value"
                data-stat-value={countMeta.number ?? undefined}
                data-stat-suffix={countMeta.suffix}
              >
                {card.value}
              </p>
              <p className="statistics-metric-sub">{card.sub}</p>
            </article>
          );
        })}
      </div>

      <section className="statistics-chart-panel">
        <div className="statistics-chart-head">
          <div>
            <h2>近 7 天学习量</h2>
            <p>学习 + 掌握</p>
          </div>
          <span>7 days</span>
        </div>
        <div className="statistics-bar-chart">
          {last7Days.map((day) => {
            const activity = day.wordsLearned + day.wordsMastered;
            const height = Math.max((activity / maxActivity) * 100, activity > 0 ? 12 : 5);
            return (
              <div key={day.date} className="statistics-bar-item">
                <div className="statistics-bar-track">
                  <div
                    className="statistics-refresh-bar"
                    style={{ height: `${height}%`, opacity: activity > 0 ? 1 : 0.12 }}
                    title={`${day.date}: ${activity}`}
                  />
                </div>
                <p className="statistics-bar-day">周{day.dayName}</p>
                <p className="statistics-bar-value">{activity}</p>
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
}

export default Statistics;
