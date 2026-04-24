import { useMemo, useState } from 'react';

const dayNames = ['日', '一', '二', '三', '四', '五', '六'];

function Calendar({ studyHistory = [] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const historyMap = useMemo(() => {
    const map = new Map();
    (Array.isArray(studyHistory) ? studyHistory : []).forEach((item) => {
      if (item?.date) map.set(item.date, item);
    });
    return map;
  }, [studyHistory]);

  const calendarData = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 0; i < firstDay.getDay(); i += 1) {
      days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day += 1) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const data = historyMap.get(dateStr) || null;
      const activity = data ? Number(data.wordsLearned || 0) + Number(data.wordsMastered || 0) : 0;
      days.push({
        date: dateStr,
        day,
        activity,
        data,
        isToday: dateStr === new Date().toISOString().split('T')[0],
      });
    }

    return days;
  }, [currentMonth, historyMap]);

  const selectedDay = selectedDate ? calendarData.find((item) => item?.date === selectedDate) : null;

  const changeMonth = (offset) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
    setSelectedDate(null);
  };

  return (
    <section className="learn-refresh-card learn-refresh-card-enter">
      <header className="text-center">
        <p className="text-sm font-medium text-[#6e6e73]">Activity Calendar</p>
        <h1 className="mt-2 text-[40px] font-semibold leading-tight text-[#1d1d1f] md:text-[52px]">
          学习日历
        </h1>
      </header>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          className="learn-refresh-action learn-refresh-action-secondary min-w-[72px]"
        >
          ←
        </button>
        <p className="text-center text-xl font-semibold text-[#1d1d1f]">
          {currentMonth.getFullYear()}年 {currentMonth.getMonth() + 1}月
        </p>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          className="learn-refresh-action learn-refresh-action-secondary min-w-[72px]"
        >
          →
        </button>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-2">
        {dayNames.map((day) => (
          <p key={day} className="text-center text-sm font-medium text-[#6e6e73]">
            {day}
          </p>
        ))}
        {calendarData.map((day, index) =>
          day ? (
            <button
              key={day.date}
              type="button"
              onClick={() => setSelectedDate(day.date)}
              className={`aspect-square rounded-[14px] border text-center transition ${
                selectedDate === day.date
                  ? 'border-[#0071e3] bg-[#0071e3] text-white'
                  : day.activity > 0
                    ? 'border-[#b9dcff] bg-[#eef6ff] text-[#1d1d1f]'
                    : 'border-[#e8e8ed] bg-[#fbfbfd] text-[#6e6e73]'
              } ${day.isToday ? 'ring-2 ring-[#0071e3]/30' : ''}`}
            >
              <span className="block text-sm font-semibold">{day.day}</span>
              {day.activity > 0 && <span className="block text-xs opacity-75">{day.activity}</span>}
            </button>
          ) : (
            <div key={`empty-${index}`} />
          )
        )}
      </div>

      {selectedDay && (
        <section className="learn-refresh-example-block mt-6">
          <div className="learn-refresh-example-head">
            <span className="learn-refresh-example-label">{selectedDay.date}</span>
            <button
              type="button"
              onClick={() => setSelectedDate(null)}
              className="learn-refresh-example-audio"
            >
              关闭
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl font-semibold text-[#1d1d1f]">{selectedDay.data?.wordsLearned || 0}</p>
              <p className="text-sm text-[#6e6e73]">已学习</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#1d1d1f]">{selectedDay.data?.wordsMastered || 0}</p>
              <p className="text-sm text-[#6e6e73]">已掌握</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#1d1d1f]">{selectedDay.activity}</p>
              <p className="text-sm text-[#6e6e73]">总动作</p>
            </div>
          </div>
        </section>
      )}
    </section>
  );
}

export default Calendar;
