import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

function ToeflSelectionView({
  mode = 'level',
  title,
  subtitle,
  items = [],
  totalCount = 0,
  onBack,
  onSelect,
  onSelectAll,
  selectAllLabel = '学习全部',
}) {
  const { isDark } = useTheme();

  const emptyText = mode === 'level' ? '当前没有可用的托福分级数据。' : '这个 Level 暂时没有可用的 List。';

  const resolvedSubtitle = useMemo(() => {
    if (subtitle) {
      return subtitle;
    }
    return mode === 'level' ? '先选择 Level，再进入对应 List 学习。' : '选择具体 List 开始学习。';
  }, [mode, subtitle]);

  const shellClass = isDark
    ? 'border-slate-800 bg-slate-900/80 text-slate-100'
    : 'border-slate-200 bg-white/90 text-slate-700';
  const cardClass = isDark
    ? 'border-slate-700 bg-slate-900/75 hover:border-cyan-400 hover:bg-slate-800'
    : 'border-slate-200 bg-white hover:border-cyan-400 hover:bg-slate-50';

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className={`mb-6 inline-flex items-center gap-2 rounded-2xl border px-5 py-3 font-bold transition ${shellClass}`}
        >
          <span>←</span>
          <span>返回</span>
        </button>

        <section className={`rounded-3xl border p-6 md:p-8 shadow-xl ${shellClass}`}>
          <header className="mb-6 text-center md:mb-8">
            <h2 className={`text-3xl md:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {title}
            </h2>
            <p className={`mt-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{resolvedSubtitle}</p>
            <p className={`mt-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
              共 <span className={`font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalCount}</span> 个单词
            </p>
          </header>

          {items.length === 0 ? (
            <div
              className={`rounded-2xl border border-dashed p-10 text-center ${
                isDark ? 'border-slate-700 bg-slate-950/40 text-slate-400' : 'border-slate-300 bg-slate-50 text-slate-500'
              }`}
            >
              {emptyText}
            </div>
          ) : (
            <div className="space-y-4">
              {onSelectAll && (
                <button
                  onClick={onSelectAll}
                  className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 text-center text-white shadow-lg transition hover:from-cyan-600 hover:to-blue-700"
                >
                  <p className="text-lg font-black">{selectAllLabel}</p>
                  <p className="text-sm text-white/90">{totalCount} 词</p>
                </button>
              )}

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => onSelect?.(item.key)}
                    className={`rounded-2xl border p-4 text-center transition ${cardClass}`}
                  >
                    <p className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.label}</p>
                    <p className={`mt-1 text-sm font-semibold ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                      {item.count} 词
                    </p>
                    {item.meta && (
                      <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.meta}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ToeflSelectionView;
