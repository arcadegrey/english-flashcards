import { useTheme } from '../context/ThemeContext';

function Progress({ total, learned, mastered, categoryName, onReset }) {
  const { isDark } = useTheme();
  const safeTotal = Math.max(total, 1);
  const learnedPercent = Math.round((learned / safeTotal) * 100);
  const masteredPercent = Math.round((mastered / safeTotal) * 100);

  const shellClass = isDark
    ? 'border-slate-800 bg-slate-900/86 text-slate-100 shadow-[0_18px_50px_rgba(2,6,23,0.45)]'
    : 'border-slate-300 bg-white text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.11)]';
  const barTrackClass = isDark ? 'bg-slate-800' : 'bg-slate-200/85';
  const statCardClass = isDark
    ? 'border-slate-800 bg-slate-950/70 text-slate-200'
    : 'border-slate-300 bg-slate-50 text-slate-800';
  const subtleTextClass = isDark ? 'text-slate-400' : 'text-slate-600';
  const resetButtonClass = isDark
    ? 'border-slate-700 bg-slate-800 text-slate-200 hover:border-slate-600 hover:bg-slate-700'
    : 'border-slate-300 bg-slate-100 text-slate-800 hover:border-slate-400 hover:bg-slate-200';

  return (
    <section className={`rounded-[30px] border px-5 py-6 md:px-7 md:py-7 text-center ${shellClass}`}>
      <div className="flex flex-col items-center gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-600">Progress</p>
          <h3 className="mt-1 text-2xl font-semibold tracking-tight">学习进度 · {categoryName}</h3>
        </div>
        <div className={`text-sm ${subtleTextClass}`}>
          已学习 {learned}/{total}，已掌握 {mastered}/{total}
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <div className="mb-2 flex items-center justify-center gap-3">
            <p className={`text-sm font-medium ${subtleTextClass}`}>已学习</p>
            <p className="text-sm font-semibold">{learnedPercent}%</p>
          </div>
          <div className={`h-3 overflow-hidden rounded-full ${barTrackClass}`}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 transition-all duration-500"
              style={{ width: `${learnedPercent}%` }}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-center gap-3">
            <p className={`text-sm font-medium ${subtleTextClass}`}>已掌握</p>
            <p className="text-sm font-semibold">{masteredPercent}%</p>
          </div>
          <div className={`h-3 overflow-hidden rounded-full ${barTrackClass}`}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-500"
              style={{ width: `${masteredPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className={`rounded-2xl border px-4 py-3 text-center ${statCardClass}`}>
          <p className="text-3xl font-semibold tracking-tight">{total}</p>
          <p className={`mt-1 text-xs uppercase tracking-[0.14em] ${subtleTextClass}`}>总词汇量</p>
        </div>
        <div className={`rounded-2xl border px-4 py-3 text-center ${statCardClass}`}>
          <p className="text-3xl font-semibold tracking-tight">{learned}</p>
          <p className={`mt-1 text-xs uppercase tracking-[0.14em] ${subtleTextClass}`}>已学习</p>
        </div>
        <div className={`rounded-2xl border px-4 py-3 text-center ${statCardClass}`}>
          <p className="text-3xl font-semibold tracking-tight">{mastered}</p>
          <p className={`mt-1 text-xs uppercase tracking-[0.14em] ${subtleTextClass}`}>已掌握</p>
        </div>
      </div>

      <button
        onClick={onReset}
        className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${resetButtonClass}`}
      >
        <span>↻</span>
        <span>重置学习进度</span>
      </button>
    </section>
  );
}

export default Progress;
