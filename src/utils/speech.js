import { storage } from './storage';

export const DEFAULT_KOKORO_TTS_ENDPOINT =
  'http://127.0.0.1:8880/v1/audio/speech';
export const DEFAULT_SPEECH_RATE = 1;
export const SLOW_SPEECH_RATE = 0.5;
export const KOKORO_WORD_AUDIO_VOICES = [
  { id: 'af_bella', label: 'Bella · 美音女声' },
  { id: 'am_michael', label: 'Michael · 美音男声' },
  { id: 'bf_emma', label: 'Emma · 英音女声' },
  { id: 'bm_george', label: 'George · 英音男声' },
];
const KOKORO_STATIC_WORD_AUDIO_VOICES = ['af_bella', 'am_michael', 'bf_emma', 'bm_george'];
export const KOKORO_EXAMPLE_AUDIO_VOICES = ['af_bella', 'am_michael'];

const browserTtsAvailable =
  typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined';

const getSpeechSynthesis = () => (browserTtsAvailable ? window.speechSynthesis : null);

// 获取最佳英语语音
const getBestEnglishVoice = () => {
  if (!browserTtsAvailable) return null;

  const speech = getSpeechSynthesis();
  const voices = speech.getVoices();

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
    'Fiona',
  ];

  for (const preferred of preferredVoices) {
    const voice = voices.find((v) => v.name.includes(preferred) || v.name === preferred);
    if (voice) return voice;
  }

  const usVoice = voices.find((v) => v.lang === 'en-US' || v.lang.startsWith('en-US'));
  if (usVoice) return usVoice;

  const anyEnglish = voices.find((v) => v.lang.startsWith('en'));
  if (anyEnglish) return anyEnglish;

  return voices[0] || null;
};

let voicesLoaded = false;
let selectedVoice = null;
let currentAudio = null;
let currentAudioUrl = '';
let ttsProvider = storage.getTtsProvider();

const initVoices = () => {
  if (!browserTtsAvailable) {
    return Promise.resolve(null);
  }

  const speech = getSpeechSynthesis();

  return new Promise((resolve) => {
    const voices = speech.getVoices();

    if (voices.length > 0) {
      voicesLoaded = true;
      selectedVoice = getBestEnglishVoice();
      resolve(selectedVoice);
      return;
    }

    speech.onvoiceschanged = () => {
      voicesLoaded = true;
      selectedVoice = getBestEnglishVoice();
      resolve(selectedVoice);
    };

    setTimeout(() => {
      if (!voicesLoaded) {
        selectedVoice = getBestEnglishVoice();
        resolve(selectedVoice);
      }
    }, 1000);
  });
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const getSpeechRateMultiplier = () => {
  const rate = storage.getSpeechRate();
  return clamp(rate, 0.5, 1.5);
};

const getKokoroEndpoint = () => {
  const fromStorage = storage.getKokoroEndpoint();
  if (fromStorage) return fromStorage.trim();

  const fromEnv = (import.meta.env.VITE_KOKORO_TTS_URL || '').trim();
  if (fromEnv) return fromEnv;

  return DEFAULT_KOKORO_TTS_ENDPOINT;
};

const getWordAudioBaseUrl = () => {
  const fromEnv = (import.meta.env.VITE_WORD_AUDIO_BASE_URL || '').trim();
  return fromEnv || '/audio/words';
};

const getExampleAudioBaseUrl = () => {
  const fromEnv = (import.meta.env.VITE_EXAMPLE_AUDIO_BASE_URL || '').trim();
  return fromEnv || '/audio/examples';
};

const base64ToBlob = (base64, mimeType = 'audio/mpeg') => {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
};

const extractAudioBlobFromJson = (data) => {
  if (!data || typeof data !== 'object') return null;

  const directBase64 =
    data.audio || data.audio_base64 || data.b64_audio || data.base64 || data.output;
  if (typeof directBase64 === 'string' && directBase64.length > 0) {
    return base64ToBlob(directBase64);
  }

  const openAiStyle = data?.data?.[0]?.b64_json;
  if (typeof openAiStyle === 'string' && openAiStyle.length > 0) {
    return base64ToBlob(openAiStyle);
  }

  return null;
};

const playAudioBlob = async (blob) => {
  if (!(blob instanceof Blob)) {
    throw new Error('Kokoro 返回的音频格式无效');
  }

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  if (currentAudioUrl) {
    URL.revokeObjectURL(currentAudioUrl);
    currentAudioUrl = '';
  }

  const audio = new Audio();
  const objectUrl = URL.createObjectURL(blob);

  currentAudio = audio;
  currentAudioUrl = objectUrl;
  audio.src = objectUrl;

  return new Promise((resolve) => {
    audio.onended = () => {
      resolve();
    };
    audio.onerror = () => {
      resolve();
    };
    audio.play().catch(() => resolve());
  });
};

const playAudioSource = async (src) => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  if (currentAudioUrl) {
    URL.revokeObjectURL(currentAudioUrl);
    currentAudioUrl = '';
  }

  const audio = new Audio();
  currentAudio = audio;
  audio.src = src;

  return new Promise((resolve, reject) => {
    audio.onended = () => resolve();
    audio.onerror = () => reject(new Error(`音频文件不可播放: ${src}`));
    audio.play().catch(reject);
  });
};

const getGeneratedKokoroVoiceIds = () => new Set(KOKORO_STATIC_WORD_AUDIO_VOICES);
const getGeneratedKokoroExampleVoiceIds = () => new Set(KOKORO_EXAMPLE_AUDIO_VOICES);

const getExampleVoiceCandidates = () => {
  const currentVoice = storage.getKokoroVoice();
  const generatedVoices = getGeneratedKokoroExampleVoiceIds();

  if (generatedVoices.has(currentVoice)) {
    return [currentVoice];
  }

  return [];
};

const speakWithStaticKokoroWordAudio = async (word) => {
  const wordId = word?.id == null ? '' : String(word.id).trim();
  if (!wordId) {
    throw new Error('缺少单词音频 id');
  }

  const voice = storage.getKokoroVoice();
  if (!getGeneratedKokoroVoiceIds().has(voice)) {
    throw new Error(`未预生成音色: ${voice}`);
  }

  const baseUrl = getWordAudioBaseUrl().replace(/\/$/, '');
  await playAudioSource(`${baseUrl}/${encodeURIComponent(voice)}/${encodeURIComponent(wordId)}.mp3`);
};

const speakWithStaticKokoroExampleAudio = async (word) => {
  const wordId = word?.id == null ? '' : String(word.id).trim();
  if (!wordId) {
    throw new Error('缺少例句音频 id');
  }

  const baseUrl = getExampleAudioBaseUrl().replace(/\/$/, '');
  const failures = [];

  for (const voice of getExampleVoiceCandidates()) {
    try {
      await playAudioSource(`${baseUrl}/${encodeURIComponent(voice)}/${encodeURIComponent(wordId)}.mp3`);
      return;
    } catch (error) {
      failures.push(error);
    }
  }

  throw failures[0] || new Error('未找到可用例句静态音频');
};

export const speakStaticKokoroWordAudio = async (word) => {
  stopSpeak();
  await speakWithStaticKokoroWordAudio(word);
};

const speakWithKokoro = async (text, options = {}) => {
  const endpoint = getKokoroEndpoint();
  if (!endpoint) {
    throw new Error('未配置 Kokoro 接口地址');
  }

  const savedSpeed = storage.getKokoroSpeed();
  const rate = Number.isFinite(Number(options.rate)) ? Number(options.rate) : 1;
  const speed = clamp(savedSpeed * rate, 0.5, 1.5);

  const payload = {
    model: 'kokoro',
    input: text,
    text,
    voice: storage.getKokoroVoice(),
    speed,
    format: 'mp3',
    response_format: 'mp3',
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Kokoro 接口请求失败: ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('audio/')) {
    const blob = await response.blob();
    await playAudioBlob(blob);
    return;
  }

  const data = await response.json();
  const blob = extractAudioBlobFromJson(data);
  if (blob) {
    await playAudioBlob(blob);
    return;
  }

  const audioUrl = data?.url || data?.audio_url;
  if (typeof audioUrl === 'string' && audioUrl) {
    const fileRes = await fetch(audioUrl);
    if (!fileRes.ok) {
      throw new Error(`Kokoro 音频地址不可用: ${fileRes.status}`);
    }
    const audioBlob = await fileRes.blob();
    await playAudioBlob(audioBlob);
    return;
  }

  throw new Error('Kokoro 接口返回中未找到可播放音频');
};

const speakWithBrowser = async (text, options = {}) => {
  if (!browserTtsAvailable) {
    throw new Error('当前环境不支持浏览器语音合成');
  }

  const { rate = 1, pitch = 1, volume = 1 } = options;
  const speech = getSpeechSynthesis();

  speech.cancel();

  if (!voicesLoaded) {
    await initVoices();
  }

  if (!selectedVoice) {
    const savedVoiceName = storage.getSelectedVoice();
    if (savedVoiceName) {
      const voices = speech.getVoices();
      selectedVoice = voices.find((v) => v.name === savedVoiceName) || null;
    }
  }

  if (!selectedVoice) {
    selectedVoice = getBestEnglishVoice();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  speech.speak(utterance);

  return new Promise((resolve) => {
    utterance.onend = resolve;
    utterance.onerror = resolve;
  });
};

export const getAvailableVoices = () => {
  if (!browserTtsAvailable) return [];
  const speech = getSpeechSynthesis();
  return speech.getVoices().filter((v) => v.lang.startsWith('en'));
};

export const setVoice = (voice) => {
  selectedVoice = voice;
  storage.setSelectedVoice(voice?.name || '');
};

export const getCurrentVoice = () => selectedVoice;

export const setTtsProvider = (provider) => {
  const nextProvider = provider === 'kokoro' ? 'kokoro' : 'browser';
  ttsProvider = nextProvider;
  storage.setTtsProvider(nextProvider);
};

export const getTtsProvider = () => ttsProvider;

export const getSpeechRate = () => getSpeechRateMultiplier();

export const setSpeechRate = (rate) => {
  storage.setSpeechRate(rate);
};

export const speak = async (text, options = {}) => {
  const safeText = (text || '').trim();
  if (!safeText) return;

  stopSpeak();
  const baseRate = Number.isFinite(Number(options.rate)) ? Number(options.rate) : 1;
  const mergedOptions = {
    ...options,
    rate: clamp(baseRate * getSpeechRateMultiplier(), 0.5, 1.5),
  };

  if (ttsProvider === 'kokoro') {
    try {
      await speakWithKokoro(safeText, mergedOptions);
      return;
    } catch (error) {
      console.warn('[TTS] Kokoro failed, fallback to browser:', error);
      if (!browserTtsAvailable) {
        throw error;
      }
    }
  }

  await speakWithBrowser(safeText, mergedOptions);
};

export const speakWord = async (word, options = {}) => {
  const text = typeof word === 'string' ? word : word?.word;
  const safeText = (text || '').trim();
  if (!safeText) return;

  stopSpeak();
  const baseRate = Number.isFinite(Number(options.rate)) ? Number(options.rate) : 1;
  const mergedOptions = {
    ...options,
    rate: clamp(baseRate * getSpeechRateMultiplier(), 0.5, 1.5),
  };

  if (ttsProvider === 'kokoro' && typeof word === 'object' && word?.id != null) {
    try {
      await speakWithStaticKokoroWordAudio(word);
      return;
    } catch (error) {
      console.warn('[TTS] Static Kokoro word audio failed, fallback to generated speech:', error);
    }
  }

  await speak(safeText, mergedOptions);
};

export const speakExample = async (word, options = {}) => {
  const text = typeof word === 'string' ? word : word?.example;
  const safeText = (text || '').trim();
  if (!safeText) return;

  stopSpeak();
  const baseRate = Number.isFinite(Number(options.rate)) ? Number(options.rate) : 1;
  const mergedOptions = {
    ...options,
    rate: clamp(baseRate * getSpeechRateMultiplier(), 0.5, 1.5),
  };

  if (ttsProvider === 'kokoro' && typeof word === 'object' && word?.id != null) {
    try {
      await speakWithStaticKokoroExampleAudio(word);
      return;
    } catch (error) {
      console.warn('[TTS] Static Kokoro example audio failed, fallback to generated speech:', error);
    }
  }

  await speak(safeText, mergedOptions);
};

export const stopSpeak = () => {
  if (browserTtsAvailable) {
    const speech = getSpeechSynthesis();
    speech.cancel();
  }

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (currentAudioUrl) {
    URL.revokeObjectURL(currentAudioUrl);
    currentAudioUrl = '';
  }
};

if (browserTtsAvailable) {
  initVoices();
}

export default {
  speak,
  speakWord,
  speakExample,
  speakStaticKokoroWordAudio,
  stopSpeak,
  getAvailableVoices,
  setVoice,
  getCurrentVoice,
  setTtsProvider,
  getTtsProvider,
};
