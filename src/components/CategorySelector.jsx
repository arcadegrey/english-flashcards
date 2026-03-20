import categories from '../data/categories'

function CategorySelector({ selectedCategory, onCategoryChange, wordCounts }) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 mb-8">
      <h3 className="text-gray-800 font-bold text-2xl mb-6 flex items-center gap-3">
        <span>🏷️</span>
        <span>选择分类</span>
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {categories.map((category) => {
          const count = wordCounts[category.id] || 0
          const isSelected = selectedCategory === category.id
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`relative p-4 rounded-2xl transition-all duration-300 text-left ${
                isSelected
                  ? `bg-gradient-to-r ${category.color} text-white shadow-xl scale-105`
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <span className="text-3xl mb-2">{category.icon}</span>
                <span className={`font-bold text-sm mb-1 ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                  {category.name}
                </span>
                <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                  {count} 词
                </span>
              </div>
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-green-500 text-sm">✓</span>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CategorySelector