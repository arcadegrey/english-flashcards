import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  speak,
  setVoice as setGlobalVoice,
  getAvailableVoices,
  setTtsProvider as setGlobalProvider,
  getTtsProvider,
  DEFAULT_KOKORO_TTS_ENDPOINT,
  KOKORO_WORD_AUDIO_VOICES,
} from '../utils/speech';
import { storage } from '../utils/storage';

const GLOBAL_KOKORO_ENDPOINT = (
  import.meta.env.VITE_KOKORO_TTS_URL || DEFAULT_KOKORO_TTS_ENDPOINT
).trim();

const KOKORO_VOICE_DETAILS = {
  af_bella: '美音女声，清晰自然，适合默认单词发音',
  am_michael: '美音男声，语调稳定，适合对照复习',
  bf_emma: '英音女声，发音圆润，适合英式口音练习',
};

function VoiceSettings({ onClose }) {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoiceState] = useState('');
  const [isPlaying, setIsPlaying] = useState(null);
  const [ttsProvider, setTtsProviderState] = useState(getTtsProvider());
  const [kokoroEndpoint, setKokoroEndpointState] = useState(
    storage.getKokoroEndpoint() || GLOBAL_KOKORO_ENDPOINT
  );
  const [kokoroVoice, setKokoroVoiceState] = useState(storage.getKokoroVoice());
  const [kokoroSpeed, setKokoroSpeedState] = useState(storage.getKokoroSpeed());
  const [kokoroHint, setKokoroHint] = useState('');

  useEffect(() => {
    const loadVoices = () => {
      const englishVoices = getAvailableVoices();
      setVoices(englishVoices);

      const saved = storage.getSelectedVoice();
      if (saved) {
        setSelectedVoiceState(saved);
        const voice = englishVoices.find((v) => v.name === saved);
        if (voice) {
          setGlobalVoice(voice);
        }
      }
    };

    loadVoices();

    if (typeof window !== 'undefined' && window.speechSynthesis?.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleProviderChange = (provider) => {
    setTtsProviderState(provider);
    storage.setTtsProvider(provider);
    setGlobalProvider(provider);
    setKokoroHint('');
  };

  const handlePreview = (voice) => {
    if (!window.speechSynthesis) return;

    if (isPlaying === voice.name) {
      window.speechSynthesis.cancel();
      setIsPlaying(null);
      return;
    }

    handleSelect(voice.name);
    setIsPlaying(voice.name);

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance('Hello, this is a browser voice preview.');
    utterance.voice = voice;
    utterance.lang = 'en-US';
    utterance.rate = 0.9;

    utterance.onend = () => setIsPlaying(null);
    utterance.onerror = () => setIsPlaying(null);

    window.speechSynthesis.speak(utterance);
  };

  const handleSelect = (voiceName) => {
    setSelectedVoiceState(voiceName);
    storage.setSelectedVoice(voiceName);

    const voice = voices.find((v) => v.name === voiceName);
    if (voice) {
      setGlobalVoice(voice);
    }
  };

  const handleKokoroVoiceChange = (voiceId) => {
    setKokoroVoiceState(voiceId);
    storage.setKokoroVoice(voiceId);
  };

  const handleKokoroPreview = async () => {
    const resolvedEndpoint = kokoroEndpoint.trim() || GLOBAL_KOKORO_ENDPOINT;
    if (!resolvedEndpoint) {
      setKokoroHint('请先填写 Kokoro 接口地址');
      return;
    }

    setIsPlaying('kokoro');
    setKokoroHint('');
    handleProviderChange('kokoro');

    try {
      await speak('Hello, this is a Kokoro voice preview.', { rate: 1 });
    } catch (error) {
      setKokoroHint(`Kokoro 试听失败：${error?.message || '请检查接口地址'}`);
    } finally {
      setIsPlaying(null);
    }
  };

  const selectedKokoroVoice =
    KOKORO_WORD_AUDIO_VOICES.find((voice) => voice.id === kokoroVoice) ||
    KOKORO_WORD_AUDIO_VOICES[0];

  const dialog = (
    <div className="voice-settings-layer" onClick={onClose}>
      <section
        className="voice-settings-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="voice-settings-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="voice-settings-head">
          <div>
            <p className="voice-settings-kicker">Audio</p>
            <h2 id="voice-settings-title" className="voice-settings-title">语音设置</h2>
          </div>
          <button type="button" className="voice-settings-close" onClick={onClose} aria-label="关闭语音设置">
            ✕
          </button>
        </header>

        <div className="voice-settings-body">
          <div className="voice-settings-engine-switch" aria-label="语音引擎">
            <button
              type="button"
              onClick={() => handleProviderChange('browser')}
              className={`voice-settings-engine ${ttsProvider === 'browser' ? 'is-active' : ''}`}
            >
              <span className="voice-settings-engine-name">浏览器 TTS</span>
              <span className="voice-settings-engine-note">使用系统内置英语语音</span>
            </button>
            <button
              type="button"
              onClick={() => handleProviderChange('kokoro')}
              className={`voice-settings-engine ${ttsProvider === 'kokoro' ? 'is-active' : ''}`}
            >
              <span className="voice-settings-engine-name">Kokoro TTS</span>
              <span className="voice-settings-engine-note">使用已生成 MP3 和 Kokoro 接口</span>
            </button>
          </div>

          {ttsProvider === 'browser' ? (
            <div className="voice-settings-section">
              {voices.length === 0 ? (
                <div className="voice-settings-empty">
                  <p>当前浏览器暂无可用英语语音</p>
                </div>
              ) : (
                <div className="voice-settings-list">
                  {voices.map((voice) => {
                    const isSelected = selectedVoice === voice.name;
                    const isCurrentlyPlaying = isPlaying === voice.name;

                    return (
                      <article
                        key={voice.name}
                        className={`voice-settings-browser-row ${isSelected ? 'is-selected' : ''}`}
                      >
                        <button
                          type="button"
                          onClick={() => handleSelect(voice.name)}
                          className="voice-settings-radio"
                          aria-label={`选择 ${voice.name}`}
                          aria-pressed={isSelected}
                        >
                          {isSelected && <span>✓</span>}
                        </button>

                        <div className="voice-settings-browser-meta">
                          <p className="voice-settings-browser-name">{voice.name}</p>
                          <p className="voice-settings-browser-lang">
                            {voice.lang} {voice.default ? '· 默认' : ''}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handlePreview(voice)}
                          disabled={isPlaying && !isCurrentlyPlaying}
                          className={`voice-settings-preview ${isCurrentlyPlaying ? 'is-playing' : ''}`}
                        >
                          {isCurrentlyPlaying ? '停止' : '试听'}
                        </button>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="voice-settings-section">
              <div className="voice-settings-info">
                <p>
                  单词发音会优先使用已上传到 R2 的静态 MP3；长句或静态文件缺失时，再使用下面的 Kokoro 接口。
                </p>
                {GLOBAL_KOKORO_ENDPOINT && (
                  <p className="voice-settings-global-endpoint">
                    当前全站默认地址：{GLOBAL_KOKORO_ENDPOINT}
                  </p>
                )}
              </div>

              <label className="voice-settings-field">
                <span>Kokoro 接口地址</span>
                <input
                  value={kokoroEndpoint}
                  onChange={(event) => {
                    const value = event.target.value;
                    setKokoroEndpointState(value);
                    storage.setKokoroEndpoint(value);
                  }}
                  placeholder="http://127.0.0.1:8880/v1/audio/speech"
                  className="voice-settings-input"
                />
              </label>

              <div className="voice-settings-grid">
                <label className="voice-settings-field">
                  <span>音色</span>
                  <select
                    value={kokoroVoice}
                    onChange={(event) => handleKokoroVoiceChange(event.target.value)}
                    className="voice-settings-select"
                  >
                    {KOKORO_WORD_AUDIO_VOICES.map((voice) => (
                      <option key={voice.id} value={voice.id}>
                        {voice.label} · {voice.id}
                      </option>
                    ))}
                  </select>
                  <p className="voice-settings-field-note">
                    {selectedKokoroVoice.id} · {KOKORO_VOICE_DETAILS[selectedKokoroVoice.id]}
                  </p>
                </label>

                <label className="voice-settings-field">
                  <span>语速 {kokoroSpeed.toFixed(2)}x</span>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.05"
                    value={kokoroSpeed}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      setKokoroSpeedState(value);
                      storage.setKokoroSpeed(value);
                    }}
                    className="voice-settings-range"
                  />
                </label>
              </div>

              <div className="voice-settings-voice-cards">
                {KOKORO_WORD_AUDIO_VOICES.map((voice) => (
                  <button
                    key={voice.id}
                    type="button"
                    className={`voice-settings-voice-card ${kokoroVoice === voice.id ? 'is-selected' : ''}`}
                    onClick={() => handleKokoroVoiceChange(voice.id)}
                  >
                    <span className="voice-settings-voice-label">{voice.label}</span>
                    <span className="voice-settings-voice-id">{voice.id}</span>
                  </button>
                ))}
              </div>

              {kokoroHint && <p className="voice-settings-error">{kokoroHint}</p>}

              <button
                type="button"
                onClick={handleKokoroPreview}
                disabled={isPlaying === 'kokoro'}
                className="voice-settings-primary"
              >
                {isPlaying === 'kokoro' ? '试听中...' : '试听 Kokoro'}
              </button>
            </div>
          )}
        </div>

        <footer className="voice-settings-footer">
          <p>
            当前引擎：<strong>{ttsProvider === 'kokoro' ? 'Kokoro TTS' : '浏览器 TTS'}</strong>
          </p>
          <button type="button" onClick={onClose} className="voice-settings-done">
            保存并关闭
          </button>
        </footer>
      </section>
    </div>
  );

  if (typeof document === 'undefined') {
    return dialog;
  }

  return createPortal(dialog, document.body);
}

export default VoiceSettings;
