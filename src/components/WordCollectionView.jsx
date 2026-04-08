import { useMemo, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { speak } from '../utils/speech';

function WordCollectionView({
  title,
  subtitle,
  words,
  onBack,
  emptyHint,
  onMarkAsMastered,
  masteredActionLabel = '认识了',
}) {
  const { isDark } = useTheme();
  const [query, setQuery] = useState('');

  const filteredWords = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) {
      return words;
    }

    return words.filter(
      (word) =>
        word.word.toLowerCase().includes(keyword) ||
        word.meaning.toLowerCase().includes(keyword) ||
        (word.phonetic || '').toLowerCase().includes(keyword)
    );
  }, [query, words]);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="w-full" style={{ maxWidth: '960px', marginInline: 'auto' }}>
        <button
          onClick={onBack}
          className={`mx-auto mb-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl transition-all border font-bold ${
            isDark
              ? 'bg-white/10 backdrop-blur-md hover:bg-white/20 border-white/20 hover:border-white/40 text-white'
              : 'bg-white/90 hover:bg-white border-slate-200 text-slate-800 shadow-sm'
          }`}
        >
          <span>←</span>
          <span>返回首页</span>
        </button>

        <section
          className={`rounded-3xl p-6 md:p-8 shadow-2xl border ${
            isDark
              ? 'border-white/25 bg-white/12 backdrop-blur-md'
              : 'border-slate-200 bg-white/95'
          }`}
        >
          <div className="mb-6 text-center">
            <h2
              className={`text-3xl md:text-4xl font-black tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {title}
            </h2>
            <p className={`mt-2 ${isDark ? 'text-white/70' : 'text-slate-600'}`}>{subtitle}</p>
            <p className={`mt-2 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
              共 <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{words.length}</span>{' '}
              个单词
            </p>
          </div>

          <div className="mb-6">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索单词、释义或音标..."
              className={`w-full rounded-2xl border px-5 py-4 text-center focus:outline-none focus:ring-2 ${
                isDark
                  ? 'border-white/30 bg-white/15 text-white placeholder:text-white/50 focus:ring-white/40'
                  : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-sky-300'
              }`}
            />
          </div>

          {words.length === 0 ? (
            <div
              className={`rounded-2xl border border-dashed p-8 text-center ${
                isDark ? 'border-white/30 bg-white/5' : 'border-slate-300 bg-slate-50'
              }`}
            >
              <p className={`text-lg ${isDark ? 'text-white/70' : 'text-slate-600'}`}>{emptyHint}</p>
            </div>
          ) : filteredWords.length === 0 ? (
            <div
              className={`rounded-2xl border border-dashed p-8 text-center ${
                isDark ? 'border-white/30 bg-white/5' : 'border-slate-300 bg-slate-50'
              }`}
            >
              <p className={`text-lg ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                没有匹配结果，试试别的关键词
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredWords.map((word) => (
                <article
                  key={word.id}
                  className={`rounded-2xl border px-4 py-4 text-center md:px-5 md:py-5 shadow-lg ${
                    isDark ? 'border-slate-700 bg-slate-900/75' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        <h3
                          className={`text-2xl md:text-3xl font-black tracking-tight break-all ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {word.word}
                        </h3>
                        <span className={`${isDark ? 'text-sky-300' : 'text-cyan-700'} font-mono text-sm md:text-base break-all`}>
                          {word.phonetic || 'N/A'}
                        </span>
                        <span className={`${isDark ? 'text-slate-300' : 'text-slate-500'} text-sm`}>{word.pos}</span>
                      </div>
                      <p className={`text-base md:text-lg mt-2 break-words ${isDark ? 'text-slate-100' : 'text-slate-700'}`}>
                        {word.meaning}
                      </p>
                      {word.example && (
                        <p className={`text-sm md:text-base mt-2 break-words ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                          例句：{word.example}
                        </p>
                      )}
                      {word.exampleCn && (
                        <p className={`text-sm md:text-base mt-1 break-words ${isDark ? 'text-cyan-200/90' : 'text-cyan-800'}`}>
                          中文：{word.exampleCn}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={() => speak(word.word, { rate: 0.8 })}
                        className={`shrink-0 inline-flex min-w-[100px] items-center justify-center rounded-2xl border px-5 py-2.5 text-base font-semibold transition-colors ${
                          isDark
                            ? 'border-slate-600 bg-slate-800 text-slate-100 hover:border-slate-500 hover:bg-slate-700'
                            : 'border-[#d2d5dc] bg-[#f7f7fa] text-[#5f6470] hover:border-[#bcc6d8] hover:bg-[#f0f2f7]'
                        }`}
                      >
                        发音
                      </button>
                      {typeof onMarkAsMastered === 'function' && (
                        <button
                          onClick={() => onMarkAsMastered(word.id)}
                          className="shrink-0 inline-flex min-w-[132px] items-center justify-center rounded-2xl border border-[#0071e3] bg-[#0071e3] px-7 py-3 text-base font-semibold text-white transition-colors hover:border-[#0065cc] hover:bg-[#0065cc]"
                        >
                          {masteredActionLabel}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default WordCollectionView;
