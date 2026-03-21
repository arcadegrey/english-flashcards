import { useState, useEffect, useMemo } from 'react';
import categories from '../data/categories';
import vocabulary from '../data/vocabulary';

function HomeScreen({ onCategorySelect, wordCounts }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.toLowerCase().trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredCategories = useMemo(() => {
    if (!debouncedQuery) {
      return categories;
    }

    return categories.filter((category) => {
      if (category.name.toLowerCase().includes(debouncedQuery)) {
        return true;
      }

      if (category.id !== 'all') {
        const categoryWords = vocabulary.filter(
          (word) =>
            word.category === category.id &&
            (word.word.toLowerCase().includes(debouncedQuery) ||
              word.meaning.toLowerCase().includes(debouncedQuery))
        );
        return categoryWords.length > 0;
      }

      return false;
    });
  }, [debouncedQuery]);

  const filteredWordCounts = useMemo(() => {
    if (!debouncedQuery) {
      return wordCounts;
    }

    const counts = {};
    filteredCategories.forEach((category) => {
      if (category.id === 'all') {
        counts.all = vocabulary.filter(
          (word) =>
            word.word.toLowerCase().includes(debouncedQuery) ||
            word.meaning.toLowerCase().includes(debouncedQuery)
        ).length;
      } else {
        counts[category.id] = vocabulary.filter(
          (word) =>
            word.category === category.id &&
            (word.word.toLowerCase().includes(debouncedQuery) ||
              word.meaning.toLowerCase().includes(debouncedQuery))
        ).length;
      }
    });

    return counts;
  }, [debouncedQuery, filteredCategories]);

  return (
    <div className="min-h-screen">
      <header className="text-center py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
            📚 英语单词卡片
          </h1>
          <p className="text-white/80 text-xl md:text-2xl font-light max-w-2xl mx-auto leading-relaxed">
            四六级核心词汇 · 高效记忆 · 成就流利英语
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索分类或单词..."
              className="w-full px-6 py-5 pl-14 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-lg transition-all"
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl">
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            )}
          </div>
          {debouncedQuery && (
            <p className="text-center text-white/60 mt-3">
              找到 {filteredCategories.length} 个分类，共{' '}
              <span className="font-bold text-white">{filteredWordCounts.all || 0}</span> 个匹配单词
            </p>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {debouncedQuery ? '搜索结果' : '选择你的学习分类'}
            </h2>
            <p className="text-white/60 text-lg">
              {debouncedQuery
                ? `共 ${filteredCategories.length} 个匹配分类`
                : `共 ${categories.length} 个分类，开始你的词汇之旅`}
            </p>
          </div>

          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60 text-xl">未找到匹配的分类或单词</p>
              <p className="text-white/40 text-sm mt-2">尝试其他搜索词</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
              {filteredCategories.map((category) => {
                const count = filteredWordCounts[category.id] || 0;

                return (
                  <button
                    key={category.id}
                    onClick={() => onCategorySelect(category.id)}
                    className={`group relative p-6 md:p-7 rounded-3xl transition-all duration-500 text-center overflow-hidden ${
                      category.id === 'all'
                        ? 'bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-600'
                        : 'bg-white/80 hover:bg-white backdrop-blur-sm'
                    } shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0`}
                  >
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${category.color}`}
                    />

                    <div
                      className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 ${
                        category.id === 'all'
                          ? 'bg-gradient-to-r from-purple-300 to-indigo-300'
                          : `bg-gradient-to-br ${category.color}`
                      }`}
                      style={{ filter: 'blur(20px)' }}
                    />

                    <div className="relative z-10">
                      <div className="text-5xl md:text-6xl mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                        {category.icon}
                      </div>

                      <h3
                        className={`font-bold text-sm md:text-base mb-2 leading-tight ${
                          category.id === 'all' ? 'text-white' : 'text-gray-800'
                        }`}
                      >
                        {category.name}
                      </h3>

                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                          category.id === 'all'
                            ? 'bg-white/20 text-white'
                            : `bg-gradient-to-r ${category.color} text-white shadow-lg`
                        }`}
                      >
                        <span>📖</span>
                        <span>{count} 词</span>
                      </div>
                    </div>

                    <div
                      className={`absolute -bottom-2 -right-2 w-16 h-16 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500 bg-gradient-to-br ${category.color}`}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {!debouncedQuery && (
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20">
              <p className="text-3xl md:text-4xl font-black text-white mb-1">
                {wordCounts.all || 0}
              </p>
              <p className="text-white/60 text-sm">总词汇量</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20">
              <p className="text-3xl md:text-4xl font-black text-white mb-1">
                {categories.length}
              </p>
              <p className="text-white/60 text-sm">学习分类</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20">
              <p className="text-3xl md:text-4xl font-black text-white mb-1">∞</p>
              <p className="text-white/60 text-sm">学习可能</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
