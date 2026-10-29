// Legacy tooling export only; runtime playback never requests a TTS endpoint.
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
  const playSource = (src, session, rate) => {
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
  const staticSpeech = async (word, field, session, rate) => {
    const id = String(word?.id ?? '').trim();
    if (!id) throw new Error('缺少单词音频 id');
    const voice = storage.getKokoroVoice();
    if (!KOKORO_WORD_AUDIO_VOICES.some(item => item.id === voice)) throw new Error(`未预生成音色: ${voice}`);
    const base = field === 'word' ? env.VITE_WORD_AUDIO_BASE_URL || '/audio/words' : env.VITE_EXAMPLE_AUDIO_BASE_URL || '/audio/examples';
    const correction = correctedAudioUrl(word, field, voice);
    const mappedUrl = correction && typeof correction.then === 'function' ? await correction : correction;
    assertActive(session);
    const url = mappedUrl
      || `${base.trim().replace(/\/$/, '')}/${encodeURIComponent(voice)}/${encodeURIComponent(id)}.mp3`;
    await playSource(url, session, rate);
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
      let settled = false;
      let startTimer;
      const finish = error => {
        if (settled) return;
        settled = true;
        clearTimeout(startTimer);
        session.signal.removeEventListener('abort', abort);
        utterance.onstart = null;
        utterance.onend = null;
        utterance.onerror = null;
        if (error) reject(error); else resolve();
      };
      const abort = () => finish(cancelled());
      session.signal.addEventListener('abort', abort, { once: true });
      utterance.onstart = () => {
        if (!settled && !session.signal.aborted && active === session) {
          clearTimeout(startTimer);
          options.onStart?.();
        }
      };
      utterance.onend = () => finish();
      utterance.onerror = event => finish(new Error(event.error || '浏览器语音播放失败'));
      startTimer = setTimeout(() => {
        if (settled) return;
        const current = active === session;
        finish(new Error('浏览器语音暂未启动，请重试。'));
        if (current) synthesis.cancel();
      }, 5000);
      try { synthesis.speak(utterance); } catch (error) { finish(error); }
    });
  };
  const run = async (text, options = {}, word, field, staticOnly = false) => {
    text = String(text || '').trim();
    if (!text && !staticOnly) return;
    if (options.signal?.aborted) return { cancelled: true };
    stopSpeak();
    const controller = new AbortController();
    const session = { controller, signal: controller.signal };
    active = session;
    const staticPreferred = staticOnly || provider === 'kokoro' && word?.id != null;
    const rate = clamp(number(options.rate ?? 1) * number(storage.getSpeechRate()) * (staticPreferred ? number(storage.getKokoroSpeed()) : 1));
    const abortOwned = () => {
      if (active === session) stopSpeak();
      else controller.abort();
    };
    options.signal?.addEventListener('abort', abortOwned, { once: true });
    let cancelListener;
    const cancellation = new Promise(resolve => {
      cancelListener = () => resolve({ cancelled: true });
      session.signal.addEventListener('abort', cancelListener, { once: true });
    });
    const operation = async () => {
      if (staticPreferred && word?.id != null) {
        try { await staticSpeech(word, field, session, rate); return; }
        catch (error) { assertActive(session); if (staticOnly) throw error; }
      }
      // Plain text and unavailable static recordings use browser speech directly.
      // Old saved endpoints / build-time Railway URLs are intentionally ignored.
      await browserSpeech(text, session, { ...options, rate });
    };
    try {
      return await Promise.race([operation(), cancellation]);
    } catch (error) {
      if (session.signal.aborted) return { cancelled: true };
      throw error;
    } finally {
      options.signal?.removeEventListener('abort', abortOwned);
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
