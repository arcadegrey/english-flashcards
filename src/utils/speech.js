import { storage } from './storage';

export const DEFAULT_KOKORO_TTS_ENDPOINT =
  'https://kokoro-api-production-9ea1.up.railway.app/v1/audio/speech';

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

const getKokoroEndpoint = () => {
  const fromStorage = storage.getKokoroEndpoint();
  if (fromStorage) return fromStorage.trim();

  const fromEnv = (import.meta.env.VITE_KOKORO_TTS_URL || '').trim();
  if (fromEnv) return fromEnv;

  return DEFAULT_KOKORO_TTS_ENDPOINT;
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

  const { rate = 0.8, pitch = 1, volume = 1 } = options;
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

export const speak = async (text, options = {}) => {
  const safeText = (text || '').trim();
  if (!safeText) return;

  stopSpeak();

  if (ttsProvider === 'kokoro') {
    try {
      await speakWithKokoro(safeText, options);
      return;
    } catch (error) {
      console.warn('[TTS] Kokoro failed, fallback to browser:', error);
      if (!browserTtsAvailable) {
        throw error;
      }
    }
  }

  await speakWithBrowser(safeText, options);
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
  stopSpeak,
  getAvailableVoices,
  setVoice,
  getCurrentVoice,
  setTtsProvider,
  getTtsProvider,
};
