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
export const KOKORO_EXAMPLE_AUDIO_VOICES = ['af_bella', 'am_michael', 'bf_emma', 'bm_george'];

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

const clamp = value => Math.max(0.5, Math.min(1.5, value));
const number = value => Number.isFinite(Number(value)) ? Number(value) : 1;
const cancelled = () => new DOMException('Speech cancelled', 'AbortError');

// All backends share one cancellable operation and one effective playback rate.
export function createSpeechService({ storage, correctedAudioUrl = () => '', env = {}, runtime = globalThis }) {
  const synthesis = runtime.speechSynthesis;
  let provider = storage.getTtsProvider();
  let selectedVoice = null;
  let active = null;
  let voicesReady = null;

  const getVoices = () => synthesis?.getVoices() || [];
  const bestVoice = () => {
    const voices = getVoices();
    const saved = storage.getSelectedVoice();
    return voices.find(voice => voice.name === saved)
      || preferredVoices.map(name => voices.find(voice => voice.name.includes(name))).find(Boolean)
      || voices.find(voice => voice.lang.startsWith('en-US'))
      || voices.find(voice => voice.lang.startsWith('en')) || voices[0] || null;
  };
  const loadVoices = () => {
    if (!synthesis || getVoices().length) return Promise.resolve();
    if (!voicesReady) {
      voicesReady = new Promise(resolve => {
        const finish = () => {
          clearTimeout(timer);
          synthesis.removeEventListener('voiceschanged', finish);
          resolve();
        };
        const timer = setTimeout(finish, 1000);
        synthesis.addEventListener('voiceschanged', finish);
      }).finally(() => { voicesReady = null; });
    }
    return voicesReady;
  };
  const assertActive = session => {
    if (session.signal.aborted || active !== session) throw cancelled();
  };
  const stopSpeak = () => {
    active?.controller.abort();
    active = null;
    synthesis?.cancel();
  };
  const playSource = (src, session, rate, objectUrl = '') => {
    assertActive(session);
    return new Promise((resolve, reject) => {
      const audio = new runtime.Audio();
      let settled = false;
      const finish = error => {
        if (settled) return;
        settled = true;
        audio.onended = null;
        audio.onerror = null;
        session.signal.removeEventListener('abort', abort);
        audio.pause();
        audio.removeAttribute?.('src');
        audio.load?.();
        if (objectUrl) runtime.URL.revokeObjectURL(objectUrl);
        if (error) reject(error); else resolve();
      };
      const abort = () => finish(cancelled());
      session.signal.addEventListener('abort', abort, { once: true });
      audio.onended = () => finish();
      audio.onerror = () => finish(new Error(`音频文件不可播放: ${src}`));
      audio.src = src;
      // Resource loading can reset playbackRate to defaultPlaybackRate.
      audio.defaultPlaybackRate = rate;
      audio.playbackRate = rate;
      try { Promise.resolve(audio.play()).catch(finish); } catch (error) { finish(error); }
    });
  };
  const playBlob = (blob, session) => {
    assertActive(session);
    if (!(blob instanceof Blob)) throw new Error('Kokoro 返回的音频格式无效');
    const url = runtime.URL.createObjectURL(blob);
    // Dynamic audio already contains the requested speed.
    return playSource(url, session, 1, url);
  };
  const staticSpeech = async (word, field, session, rate) => {
    const id = String(word?.id ?? '').trim();
    if (!id) throw new Error('缺少单词音频 id');
    const voice = storage.getKokoroVoice();
    if (!KOKORO_WORD_AUDIO_VOICES.some(item => item.id === voice)) throw new Error(`未预生成音色: ${voice}`);
    const base = field === 'word' ? env.VITE_WORD_AUDIO_BASE_URL || '/audio/words' : env.VITE_EXAMPLE_AUDIO_BASE_URL || '/audio/examples';
    const url = correctedAudioUrl(word, field, voice)
      || `${base.trim().replace(/\/$/, '')}/${encodeURIComponent(voice)}/${encodeURIComponent(id)}.mp3`;
    await playSource(url, session, rate);
  };
  const dynamicSpeech = async (text, session, rate) => {
    const endpoint = storage.getKokoroEndpoint()?.trim() || env.VITE_KOKORO_TTS_URL?.trim() || DEFAULT_KOKORO_TTS_ENDPOINT;
    const signal = AbortSignal.any([session.signal, AbortSignal.timeout(20000)]);
    const response = await runtime.fetch(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal,
      body: JSON.stringify({ model: 'kokoro', input: text, text, voice: storage.getKokoroVoice(), speed: rate, format: 'mp3', response_format: 'mp3' }),
    });
    assertActive(session);
    if (!response.ok) throw new Error(`Kokoro 接口请求失败: ${response.status}`);
    if ((response.headers.get('content-type') || '').includes('audio/')) {
      await playBlob(await response.blob(), session);
      return;
    }
    const data = await response.json();
    assertActive(session);
    const blob = extractAudioBlobFromJson(data);
    if (blob) { await playBlob(blob, session); return; }
    const url = data?.url || data?.audio_url;
    if (typeof url === 'string' && url) {
      const file = await runtime.fetch(url, { signal });
      assertActive(session);
      if (!file.ok) throw new Error(`Kokoro 音频地址不可用: ${file.status}`);
      await playBlob(await file.blob(), session);
      return;
    }
    throw new Error('Kokoro 接口返回中未找到可播放音频');
  };
  const browserSpeech = async (text, session, options) => {
    if (!synthesis) throw new Error('当前环境不支持浏览器语音合成');
    await loadVoices();
    assertActive(session);
    selectedVoice ||= bestVoice();
    const utterance = new runtime.SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = options.rate;
    utterance.pitch = options.pitch ?? 1;
    utterance.volume = options.volume ?? 1;
    if (selectedVoice) utterance.voice = selectedVoice;
    return new Promise((resolve, reject) => {
      const finish = error => {
        session.signal.removeEventListener('abort', abort);
        utterance.onend = null;
        utterance.onerror = null;
        if (error) reject(error); else resolve();
      };
      const abort = () => finish(cancelled());
      session.signal.addEventListener('abort', abort, { once: true });
      utterance.onend = () => finish();
      utterance.onerror = event => finish(new Error(event.error || '浏览器语音播放失败'));
      try { synthesis.speak(utterance); } catch (error) { finish(error); }
    });
  };
  const run = async (text, options = {}, word, field, staticOnly = false) => {
    text = String(text || '').trim();
    if (!text && !staticOnly) return;
    stopSpeak();
    const controller = new AbortController();
    const session = { controller, signal: controller.signal };
    active = session;
    const rate = clamp(number(options.rate ?? 1) * number(storage.getSpeechRate()) * (provider === 'kokoro' || staticOnly ? number(storage.getKokoroSpeed()) : 1));
    let cancelListener;
    const cancellation = new Promise(resolve => {
      cancelListener = () => resolve({ cancelled: true });
      session.signal.addEventListener('abort', cancelListener, { once: true });
    });
    const operation = async () => {
      if ((provider === 'kokoro' || staticOnly) && word?.id != null) {
        try { await staticSpeech(word, field, session, rate); return; }
        catch (error) { assertActive(session); if (staticOnly) throw error; }
      }
      if (provider === 'kokoro') {
        try { await dynamicSpeech(text, session, rate); return; }
        catch (error) { assertActive(session); if (!synthesis) throw error; }
      }
      await browserSpeech(text, session, { ...options, rate });
    };
    try {
      return await Promise.race([operation(), cancellation]);
    } catch (error) {
      if (session.signal.aborted) return { cancelled: true };
      throw error;
    } finally {
      session.signal.removeEventListener('abort', cancelListener);
      if (active === session) active = null;
    }
  };
  return {
    speak: (text, options) => run(text, options),
    speakWord: (word, options) => run(typeof word === 'string' ? word : word?.word, options, word, 'word'),
    speakExample: (word, options) => run(typeof word === 'string' ? word : word?.example, options, word, 'example'),
    speakStaticKokoroWordAudio: (word, options) => run(word?.word, options, word, 'word', true),
    stopSpeak,
    getAvailableVoices: () => getVoices().filter(voice => voice.lang.startsWith('en')),
    setVoice: voice => { stopSpeak(); selectedVoice = voice; storage.setSelectedVoice(voice?.name || ''); },
    getCurrentVoice: () => selectedVoice,
    setTtsProvider: value => { stopSpeak(); provider = value === 'kokoro' ? 'kokoro' : 'browser'; storage.setTtsProvider(provider); },
    getTtsProvider: () => provider,
    getSpeechRate: () => clamp(number(storage.getSpeechRate())),
    setSpeechRate: value => { stopSpeak(); storage.setSpeechRate(value); },
  };
}
