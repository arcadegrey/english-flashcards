function Progress({ total, learned, mastered, categoryName, onReset }) {
  const learnedPercent = Math.round((learned / total) * 100)
  const masteredPercent = Math.round((mastered / total) * 100)

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
      <h3 className="text-gray-800 font-bold text-2xl mb-6 flex items-center gap-3">
        <span>📊</span>
        <span>学习进度 {categoryName && <span className="text-purple-500">· {categoryName}</span>}</span>
      </h3>
      
      {/* 进度条 */}
      <div className="space-y-6">
        {/* 已学习进度 */}
        <div>
          <div className="flex justify-between items-end mb-3">
            <div>
              <span className="text-gray-500 text-sm uppercase tracking-wider">已学习</span>
              <p className="text-gray-700 text-sm mt-1">{learned} / {total} 单词</p>
            </div>
            <span className="text-3xl font-bold text-blue-600">{learnedPercent}%</span>
          </div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-700"
              style={{ width: `${learnedPercent}%` }}
            />
          </div>
        </div>

        {/* 已掌握进度 */}
        <div>
          <div className="flex justify-between items-end mb-3">
            <div>
              <span className="text-gray-500 text-sm uppercase tracking-wider">已掌握</span>
              <p className="text-gray-700 text-sm mt-1">{mastered} / {total} 单词</p>
            </div>
            <span className="text-3xl font-bold text-green-600">{masteredPercent}%</span>
          </div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-700"
              style={{ width: `${masteredPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 统计信息卡片 */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-200">
          <p className="text-4xl font-bold text-gray-800 mb-1">{total}</p>
          <p className="text-gray-500 text-xs uppercase tracking-wider">总词汇量</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 text-center border border-blue-200">
          <p className="text-4xl font-bold text-blue-600 mb-1">{learned}</p>
          <p className="text-blue-400 text-xs uppercase tracking-wider">已学习</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 text-center border border-green-200">
          <p className="text-4xl font-bold text-green-600 mb-1">{mastered}</p>
          <p className="text-green-400 text-xs uppercase tracking-wider">已掌握</p>
        </div>
      </div>

      {/* 重置按钮 */}
      <button
        onClick={onReset}
        className="w-full mt-8 py-5 min-h-[50px] bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl transition-all font-black text-3xl flex items-center justify-center gap-3 border-2 border-gray-300 shadow-lg"
      >
        <span class="text-4xl">🔄</span>
        <span>重置学习进度</span>
      </button>

      {/* 鼓励语 */}
      {masteredPercent >= 100 && (
        <div className="mt-6 text-center bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-300">
          <p className="text-yellow-600 font-bold text-2xl mb-2">🏆 恭喜！</p>
          <p className="text-gray-700">你已掌握全部 {total} 个单词！</p>
          <p className="text-gray-500 text-sm mt-2">继续复习，保持记忆！</p>
        </div>
      )}
      
      {masteredPercent >= 50 && masteredPercent < 100 && (
        <div className="mt-6 text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-300">
          <p className="text-green-600 font-bold text-xl mb-2">💪 进步显著！</p>
          <p className="text-gray-700">你已掌握超过一半的单词！</p>
          <p className="text-gray-500 text-sm mt-2">继续努力，胜利在望！</p>
        </div>
      )}
      
      {masteredPercent > 0 && masteredPercent < 50 && (
        <div className="mt-6 text-center bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-300">
          <p className="text-purple-600 font-bold text-xl mb-2">🌟 良好的开端！</p>
          <p className="text-gray-700">你的词汇量正在增长！</p>
          <p className="text-gray-500 text-sm mt-2">坚持就是胜利！</p>
        </div>
      )}
    </div>
  )
}

export default Progress
