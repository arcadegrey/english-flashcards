export const categories = [
  { 
    id: 'all', 
    name: '全部单词', 
    icon: '📚', 
    description: '所有单词集合',
    color: 'from-purple-500 to-indigo-500'
  },
  { 
    id: 'daily', 
    name: '日常常用', 
    icon: '🏠', 
    description: '日常、学术、商务、旅行、饮食、情感、科技和健康等基础场景词汇',
    color: 'from-green-500 to-emerald-500'
  },
  { 
    id: 'cet4', 
    name: '四级核心', 
    icon: '📝', 
    description: '大学英语四级核心词汇',
    color: 'from-indigo-500 to-blue-500'
  },
  { 
    id: 'cet6', 
    name: '六级核心', 
    icon: '📖', 
    description: '大学英语六级核心词汇',
    color: 'from-purple-600 to-indigo-600'
  },
  { 
    id: 'toefl', 
    name: '托福词汇', 
    icon: '🌍', 
    description: '托福考试高频词汇',
    color: 'from-cyan-500 to-teal-500'
  },
  { 
    id: 'ielts', 
    name: '雅思词汇', 
    icon: '🇬🇧', 
    description: '雅思考试高频词汇',
    color: 'from-red-600 to-rose-600'
  }
]

export const getCategoryById = (id) => {
  return categories.find(cat => cat.id === id) || categories[0]
}

export default categories
