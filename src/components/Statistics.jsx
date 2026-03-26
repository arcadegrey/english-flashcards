import { useMemo } from 'react';
import { storage } from '../utils/storage';

const DAY_NAMES_CN = ['日', '一', '二', '三', '四', '五', '六'];

function Statistics({ learnedWords, masteredWords, totalWords }) {
  const studyHistory = useMemo(() => storage.getStudyHistory(), []);

  const last7Days = useMemo(() => {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = DAY_NAMES_CN[date.getDay()];

      const dayData = studyHistory.find((h) => h.date === dateStr) || {
        wordsLearned: 0,
        wordsMastered: 0,
        timeSpent: 0,
      };

      days.push({
        date: dateStr,
        dayName,
        day: date.getDate(),
        ...dayData,
      });
    }

    return days;
  }, [studyHistory]);

  const maxWordsLearned = Math.max(...last7Days.map((d) => d.wordsLearned), 1);

  const learnedCount = learnedWords.length;
  const masteredCount = masteredWords.length;
  const remainingCount = totalWords - learnedCount;

  const learnedPercent = totalWords > 0 ? Math.round((learnedCount / totalWords) * 100) : 0;
  const masteredPercent = totalWords > 0 ? Math.round((masteredCount / totalWords) * 100) : 0;

  const totalTimeSpent = studyHistory.reduce((acc, h) => acc + h.timeSpent, 0);
  const hoursSpent = Math.floor(totalTimeSpent / 60);
  const minutesSpent = totalTimeSpent % 60;

  const totalLearned = studyHistory.reduce((acc, h) => acc + h.wordsLearned, 0);

  const pieCircumference = 2 * Math.PI * 45;
  const learnedArc = (learnedPercent / 100) * pieCircumference;
  const masteredArc = (masteredPercent / 100) * pieCircumference;
  const learnedRotation = 0;
  const masteredRotation = (learnedPercent / 100) * 360;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-200">
        <h2 className="text-gray-800 font-black text-3xl mb-8 flex items-center gap-3">
          <span>📊</span>
          <span>学习统计</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-center shadow-lg">
            <p className="text-5xl font-black text-white mb-2">{totalWords}</p>
            <p className="text-white/80 text-lg font-bold">总词汇量</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-center shadow-lg">
            <p className="text-5xl font-black text-white mb-2">{learnedCount}</p>
            <p className="text-white/80 text-lg font-bold">已学习</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-center shadow-lg">
            <p className="text-5xl font-black text-white mb-2">{masteredCount}</p>
            <p className="text-white/80 text-lg font-bold">已掌握</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-6 text-center shadow-lg">
            <p className="text-5xl font-black text-white mb-2">
              {hoursSpent > 0 ? `${hoursSpent}h` : ''}{minutesSpent}m
            </p>
            <p className="text-white/80 text-lg font-bold">学习时长</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-200">
            <h3 className="text-purple-800 font-bold text-2xl mb-6 flex items-center gap-2">
              <span>📈</span>
              <span>近 7 天学习量</span>
            </h3>
            <div className="flex items-end gap-3 h-48">
              {last7Days.map((day) => {
                const height = (day.wordsLearned / maxWordsLearned) * 100;
                const hasData = day.wordsLearned > 0;

                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col items-center justify-end h-36">
                      {hasData && (
                        <span className="text-purple-600 font-bold text-sm mb-1">{day.wordsLearned}</span>
                      )}
                      <div
                        className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 ${
                          hasData
                            ? 'bg-gradient-to-t from-purple-500 to-indigo-400'
                            : 'bg-gray-200'
                        }`}
                        style={{ height: `${Math.max(height, 6)}%` }}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-gray-700 font-bold text-base">周{day.dayName}</p>
                      <p className="text-gray-400 text-sm">{day.day}日</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex justify-between text-base">
              <span className="text-gray-500 font-medium">累计学习单词</span>
              <span className="text-purple-600 font-black text-lg">{totalLearned} 次</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
            <h3 className="text-green-800 font-bold text-2xl mb-6 flex items-center gap-2">
              <span>🎯</span>
              <span>学习进度</span>
            </h3>
            <div className="flex items-center gap-8">
              <div className="relative w-40 h-40 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                  />
                  {learnedPercent > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="10"
                      strokeDasharray={`${learnedArc} ${pieCircumference - learnedArc}`}
                      strokeLinecap="round"
                      style={{ transform: `rotate(${learnedRotation}deg)`, transformOrigin: '50px 50px' }}
                    />
                  )}
                  {masteredPercent > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="10"
                      strokeDasharray={`${masteredArc} ${pieCircumference - masteredArc}`}
                      strokeLinecap="round"
                      style={{ transform: `rotate(${masteredRotation}deg)`, transformOrigin: '50px 50px' }}
                    />
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-gray-800">{learnedPercent}%</span>
                  <span className="text-gray-400 text-sm font-medium">完成率</span>
                </div>
              </div>
              <div className="flex-1 space-y-5">
                <div>
                  <div className="flex items-center gap-4 mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500" />
                      <span className="text-gray-700 font-bold text-lg">已学习</span>
                    </div>
                    <span className="font-black text-blue-600 text-xl">{learnedCount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${learnedPercent}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-500" />
                      <span className="text-gray-700 font-bold text-lg">已掌握</span>
                    </div>
                    <span className="font-black text-green-600 text-xl">{masteredCount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${masteredPercent}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gray-300" />
                      <span className="text-gray-700 font-bold text-lg">未学习</span>
                    </div>
                    <span className="font-black text-gray-500 text-xl">{remainingCount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-gray-400 h-2.5 rounded-full" style={{ width: `${100 - learnedPercent}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
