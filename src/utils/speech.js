// 语音合成工具 - 解决跨设备语音不一致问题

// 获取最佳英语语音
const getBestEnglishVoice = () => {
  const voices = speechSynthesis.getVoices()
  
  // 优先级排序的语音列表（从高到低）
  const preferredVoices = [
    'Google US English',
    'Google UK English Female',
    'Google UK English Male',
    'Microsoft Zira',
    'Microsoft David',
    'Samantha',
    'Alex',
    'Daniel',
    'Karen',
    'Moira',
    'Tessa',
    'Veena',
    'Fiona'
  ]
  
  // 查找第一个可用的优先语音
  for (const preferred of preferredVoices) {
    const voice = voices.find(v => 
      v.name.includes(preferred) || 
      v.name === preferred
    )
    if (voice) return voice
  }
  
  // 如果没有找到优先语音，查找任何美国英语语音
  const usVoice = voices.find(v => 
    v.lang === 'en-US' || v.lang.startsWith('en-US')
  )
  if (usVoice) return usVoice
  
  // 查找任何英语语音
  const anyEnglish = voices.find(v => 
    v.lang.startsWith('en')
  )
  if (anyEnglish) return anyEnglish
  
  // 返回第一个可用语音
  return voices[0] || null
}

// 初始化语音（解决某些浏览器首次加载问题）
let voicesLoaded = false
let selectedVoice = null

const initVoices = () => {
  return new Promise((resolve) => {
    const voices = speechSynthesis.getVoices()
    
    if (voices.length > 0) {
      voicesLoaded = true
      selectedVoice = getBestEnglishVoice()
      resolve(selectedVoice)
      return
    }
    
    // 某些浏览器需要等待 voiceschanged 事件
    speechSynthesis.onvoiceschanged = () => {
      voicesLoaded = true
      selectedVoice = getBestEnglishVoice()
      resolve(selectedVoice)
    }
    
    // 超时处理
    setTimeout(() => {
      if (!voicesLoaded) {
        selectedVoice = getBestEnglishVoice()
        resolve(selectedVoice)
      }
    }, 1000)
  })
}

// 获取所有可用的英语语音
export const getAvailableVoices = () => {
  const voices = speechSynthesis.getVoices()
  return voices.filter(v => v.lang.startsWith('en'))
}

// 设置选中的语音
export const setVoice = (voice) => {
  selectedVoice = voice
  // 保存到 localStorage
  try {
    localStorage.setItem('selectedVoice', voice?.name || '')
  } catch (e) {
    // ignore
  }
}

// 获取当前选中的语音
export const getCurrentVoice = () => selectedVoice

// 语音合成主函数
export const speak = async (text, options = {}) => {
  const {
    rate = 0.8,
    pitch = 1,
    volume = 1
  } = options
  
  // 取消之前的语音
  speechSynthesis.cancel()
  
  // 确保语音已加载
  if (!voicesLoaded) {
    await initVoices()
  }
  
  // 尝试从 localStorage 恢复语音选择
  if (!selectedVoice) {
    try {
      const savedVoiceName = localStorage.getItem('selectedVoice')
      if (savedVoiceName) {
        const voices = speechSynthesis.getVoices()
        selectedVoice = voices.find(v => v.name === savedVoiceName)
      }
    } catch (e) {
      // ignore
    }
  }
  
  // 如果还是没有语音，初始化
  if (!selectedVoice) {
    selectedVoice = getBestEnglishVoice()
  }
  
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = rate
  utterance.pitch = pitch
  utterance.volume = volume
  
  if (selectedVoice) {
    utterance.voice = selectedVoice
  }
  
  speechSynthesis.speak(utterance)
  
  return new Promise((resolve) => {
    utterance.onend = resolve
    utterance.onerror = resolve
  })
}

// 停止语音
export const stopSpeak = () => {
  speechSynthesis.cancel()
}

// 初始化
initVoices()

export default {
  speak,
  stopSpeak,
  getAvailableVoices,
  setVoice,
  getCurrentVoice
}