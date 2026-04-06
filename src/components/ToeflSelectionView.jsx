import { useMemo } from 'react';

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
  const emptyText = mode === 'level' ? '当前没有可用的托福分级数据。' : '这个 Level 暂时没有可用的 List。';

  const resolvedSubtitle = useMemo(() => {
    if (subtitle) {
      return subtitle;
    }
    return mode === 'level' ? '先选择 Level，再进入对应 List 学习。' : '选择具体 List 开始学习。';
  }, [mode, subtitle]);

  const cardClass =
    'rounded-[14px] border border-[#e5e7eb] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.08)]';
  const gridClass =
    items.length === 1 ? 'grid grid-cols-1 gap-2 md:gap-3' : 'grid grid-cols-2 gap-2 md:gap-3';

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-base leading-[1.6] text-[#111827]">
      <div className="w-full px-4 py-8 space-y-8" style={{ maxWidth: '960px', marginInline: 'auto' }}>
        <div className="flex justify-start">
          <button
            onClick={onBack}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] border border-[#d1d5db] bg-white px-4 py-2 text-base font-semibold text-[#111827] transition duration-200 hover:border-[#0071e3] hover:bg-[#0071e3] hover:text-white"
          >
            <span aria-hidden="true">←</span>
            <span>返回</span>
          </button>
        </div>

        <section className={`${cardClass} p-5 md:p-6`}>
          <header className="space-y-2 text-center">
            <h2 className="text-[32px] font-bold leading-tight text-[#111827]">{title}</h2>
            <p className="text-base leading-[1.6] text-[#6b7280]">{resolvedSubtitle}</p>
            <p className="text-[22px] font-semibold text-[#111827]">
              共 {totalCount} <span className="text-[#6b7280]">个单词</span>
            </p>
          </header>
        </section>

        <section className="rounded-[14px] border border-[#e5e7eb] bg-[#f5f5f7] p-5 shadow-[0_1px_3px_rgba(15,23,42,0.08)] md:p-6">
          {items.length === 0 ? (
            <div className="rounded-[14px] border border-dashed border-[#d1d5db] bg-white p-8 text-center text-[#6b7280]">
              {emptyText}
            </div>
          ) : (
            <div className="space-y-3">
              {onSelectAll && (
                <button
                  onClick={onSelectAll}
                  className="group w-full min-h-[44px] rounded-[14px] border border-[#e5e7eb] bg-white p-3 text-center shadow-[0_1px_3px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-[2px] hover:border-[#0071e3] hover:bg-[#0071e3] md:p-4"
                >
                  <p className="text-xl font-semibold text-[#111827] transition-colors duration-200 group-hover:text-white">
                    {selectAllLabel}
                  </p>
                  <p className="text-sm text-[#6b7280] transition-colors duration-200 group-hover:text-white/90">
                    {totalCount} 词
                  </p>
                </button>
              )}

              <div className={gridClass}>
                {items.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => onSelect?.(item.key)}
                    className="group min-h-[44px] rounded-[14px] border border-[#e5e7eb] bg-white p-3 text-center shadow-[0_1px_3px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-[2px] hover:border-[#0071e3] hover:bg-[#0071e3] md:p-4"
                  >
                    <p className="text-3xl font-semibold leading-tight text-[#111827] transition-colors duration-200 group-hover:text-white md:text-4xl">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-[#6b7280] transition-colors duration-200 group-hover:text-white/90">
                      {item.count} 词
                    </p>
                    {item.meta && (
                      <p className="text-sm text-[#9ca3af] transition-colors duration-200 group-hover:text-white/75">
                        {item.meta}
                      </p>
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
