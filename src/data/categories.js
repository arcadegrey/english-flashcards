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
    description: '日常生活中最常用的单词',
    color: 'from-green-500 to-emerald-500'
  },
  { 
    id: 'academic', 
    name: '学术词汇', 
    icon: '🎓', 
    description: '学术论文、研究报告常用词',
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    id: 'business', 
    name: '商务英语', 
    icon: '💼', 
    description: '职场、商务场景常用词',
    color: 'from-orange-500 to-amber-500'
  },
  { 
    id: 'travel', 
    name: '旅游出行', 
    icon: '✈️', 
    description: '旅行、交通相关词汇',
    color: 'from-sky-500 to-blue-500'
  },
  { 
    id: 'food', 
    name: '饮食文化', 
    icon: '🍽️', 
    description: '食物、饮料、餐饮词汇',
    color: 'from-red-500 to-pink-500'
  },
  { 
    id: 'emotion', 
    name: '情感表达', 
    icon: '💬', 
    description: '表达情感、态度的词汇',
    color: 'from-pink-500 to-rose-500'
  },
  { 
    id: 'technology', 
    name: '科技前沿', 
    icon: '💻', 
    description: '科技、互联网相关词汇',
    color: 'from-violet-500 to-purple-500'
  },
  { 
    id: 'medical', 
    name: '医疗健康', 
    icon: '🏥', 
    description: '医疗、健康相关词汇',
    color: 'from-teal-500 to-green-500'
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