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

function Statistics({
  learnedWords = [],
  masteredWords = [],
  wrongWords = [],
  studyHistory = [],
  totalWords = 0,
  dueReviewCount = 0,
}) {
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
    { label: '连续学习', value: `${streak} 天`, sub: '当前 streak', tone: 'plain' },
    { label: '已学习', value: learnedCount, sub: '复习队列', tone: 'plain' },
    { label: '已掌握', value: masteredCount, sub: `${masteredPercent}% 完成`, tone: 'blue' },
    { label: '错题本', value: wrongWords.length, sub: '待巩固', tone: 'plain' },
    { label: '近 90 天', value: totalActions, sub: '学习动作', tone: 'plain' },
  ];

  return (
    <section className="learn-refresh-card learn-refresh-card-enter">
      <header className="text-center">
        <p className="text-sm font-medium text-[#6e6e73]">Learning Dashboard</p>
        <h1 className="mt-2 text-[40px] font-semibold leading-tight text-[#1d1d1f] md:text-[52px]">
          学习统计
        </h1>
        <p className="mt-3 text-base text-[#6e6e73]">用真实学习记录追踪复习、错题和掌握进度。</p>
      </header>

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.label}
            className={`rounded-[16px] border p-4 text-center ${
              card.tone === 'blue'
                ? 'border-[#0071e3] bg-[#0071e3] text-white'
                : 'border-[#e8e8ed] bg-[#fbfbfd] text-[#1d1d1f]'
            }`}
          >
            <p className={`text-sm ${card.tone === 'blue' ? 'text-white/80' : 'text-[#6e6e73]'}`}>
              {card.label}
            </p>
            <p className="mt-2 text-3xl font-semibold leading-none">{card.value}</p>
            <p className={`mt-2 text-xs ${card.tone === 'blue' ? 'text-white/75' : 'text-[#86868b]'}`}>
              {card.sub}
            </p>
          </article>
        ))}
      </div>

      <section className="learn-refresh-example-block mt-8">
        <div className="learn-refresh-example-head">
          <span className="learn-refresh-example-label">近 7 天学习量</span>
          <span className="text-sm text-[#6e6e73]">学习 + 掌握</span>
        </div>
        <div className="mt-4 flex h-44 items-end justify-between gap-2">
          {last7Days.map((day) => {
            const activity = day.wordsLearned + day.wordsMastered;
            const height = Math.max((activity / maxActivity) * 100, activity > 0 ? 12 : 5);
            return (
              <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-32 w-full items-end justify-center">
                  <div
                    className="w-full max-w-[42px] rounded-t-[10px] bg-[#0071e3] transition-all"
                    style={{ height: `${height}%`, opacity: activity > 0 ? 1 : 0.12 }}
                    title={`${day.date}: ${activity}`}
                  />
                </div>
                <p className="text-xs font-medium text-[#6e6e73]">周{day.dayName}</p>
                <p className="text-xs text-[#86868b]">{activity}</p>
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
}

export default Statistics;
