import { useState, useMemo } from 'react';
import { storage } from '../utils/storage';

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const studyHistory = useMemo(() => storage.getStudyHistory(), []);

  const dayNames = ['日', '一', '二', '三', '四', '五', '六'];

  const calendarData = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days = [];

    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayData = studyHistory.find((h) => h.date === dateStr);

      const activityLevel = dayData
        ? dayData.wordsLearned + dayData.wordsMastered
        : 0;

      days.push({
        day,
        date: dateStr,
        hasActivity: activityLevel > 0,
        activityLevel,
        data: dayData,
        isToday: dateStr === new Date().toISOString().split('T')[0],
      });
    }

    return days;
  }, [currentMonth, studyHistory]);

  const calculateStreak = () => {
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);

    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayData = studyHistory.find((h) => h.date === dateStr);

      if (dayData && (dayData.wordsLearned > 0 || dayData.wordsMastered > 0)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (dateStr === today.toISOString().split('T')[0]) {
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const streak = calculateStreak();

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const getActivityColor = (level) => {
    if (level === 0) return 'bg-gray-100';
    if (level <= 5) return 'bg-green-200';
    if (level <= 10) return 'bg-green-400';
    if (level <= 20) return 'bg-green-500';
    return 'bg-green-600';
  };

  const selectedDayData = selectedDate
    ? calendarData.find((d) => d?.date === selectedDate)
    : null;

  const formatChineseDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    const weekDay = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 周${weekDay}`;
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-800 font-black text-3xl flex items-center gap-3">
          <span>📅</span>
          <span>学习日历</span>
        </h2>
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-3 rounded-2xl font-bold text-lg flex items-center gap-2 shadow-lg">
            <span>🔥</span>
            <span>{streak} 天连续</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="p-3 hover:bg-gray-100 rounded-xl transition-colors text-2xl font-bold text-gray-600"
        >
          ←
        </button>
        <h3 className="text-2xl font-bold text-gray-800">
          {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
        </h3>
        <button
          onClick={nextMonth}
          className="p-3 hover:bg-gray-100 rounded-xl transition-colors text-2xl font-bold text-gray-600"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-gray-500 font-bold text-sm py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarData.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const isSelected = selectedDate === day.date;

          return (
            <button
              key={day.date}
              onClick={() => setSelectedDate(day.date)}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-300 relative ${
                isSelected
                  ? 'ring-4 ring-purple-500 ring-offset-2'
                  : 'hover:scale-105'
              } ${day.isToday ? 'ring-2 ring-blue-400 ring-offset-2' : ''} ${
                day.hasActivity ? getActivityColor(day.activityLevel) : 'bg-gray-100'
              }`}
            >
              <span
                className={`text-lg font-bold ${
                  day.hasActivity || isSelected ? 'text-white' : 'text-gray-600'
                }`}
              >
                {day.day}
              </span>
              {day.hasActivity && (
                <span className="text-xs text-white/80 mt-0.5">{day.activityLevel}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-100" />
          <span className="text-gray-600">无活动</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-200" />
          <span className="text-gray-600">1-5</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-400" />
          <span className="text-gray-600">6-10</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500" />
          <span className="text-gray-600">11-20</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-600" />
          <span className="text-gray-600">20+</span>
        </div>
      </div>

      {selectedDayData && (
        <div className="mt-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-purple-800">
              {formatChineseDate(selectedDayData.date)}
            </h4>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-purple-400 hover:text-purple-600 text-2xl font-bold"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-purple-600">
                {selectedDayData.data?.wordsLearned || 0}
              </p>
              <p className="text-gray-500 text-sm">已学习</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-green-600">
                {selectedDayData.data?.wordsMastered || 0}
              </p>
              <p className="text-gray-500 text-sm">已掌握</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-orange-600">
                {Math.floor((selectedDayData.data?.timeSpent || 0) / 60)}分钟
              </p>
              <p className="text-gray-500 text-sm">学习时长</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={goToToday}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-indigo-600 transition-all"
        >
          回到今天
        </button>
      </div>
    </div>
  );
}

export default Calendar;
