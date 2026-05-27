import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  speakWord,
  setTtsProvider as setGlobalProvider,
  KOKORO_WORD_AUDIO_VOICES,
} from '../utils/speech';
import { storage } from '../utils/storage';

const KOKORO_VOICE_DETAILS = {
  af_bella: '美音女声，清晰自然，适合默认单词发音',
  am_michael: '美音男声，语调稳定，适合对照复习',
  bf_emma: '英音女声，发音圆润，适合英式口音练习',
  bm_george: '英音男声，清晰稳重，适合例句跟读',
};

const getVoiceLabelParts = (label = '') => {
  const [name, description] = String(label).split(' · ');
  return {
    name: name || label,
    description: description || '',
  };
};

function VoiceSettings({ onClose }) {
  const [isPlaying, setIsPlaying] = useState(null);
  const [kokoroVoice, setKokoroVoiceState] = useState(storage.getKokoroVoice());
  const [kokoroSpeed, setKokoroSpeedState] = useState(storage.getKokoroSpeed());
  const [kokoroHint, setKokoroHint] = useState('');

  useEffect(() => {
    storage.setTtsProvider('kokoro');
    setGlobalProvider('kokoro');
  }, []);

  const handleKokoroVoiceChange = (voiceId) => {
    setKokoroVoiceState(voiceId);
    storage.setKokoroVoice(voiceId);
  };

  const handleKokoroPreview = async () => {
    setIsPlaying('kokoro');
    setKokoroHint('');
    storage.setTtsProvider('kokoro');
    setGlobalProvider('kokoro');

    try {
      await speakWord({ id: 1, word: 'abandon' });
    } catch (error) {
      setKokoroHint(`Kokoro 试听失败：${error?.message || '静态音频暂不可用'}`);
    } finally {
      setIsPlaying(null);
    }
  };

  const selectedKokoroVoice =
    KOKORO_WORD_AUDIO_VOICES.find((voice) => voice.id === kokoroVoice) ||
    KOKORO_WORD_AUDIO_VOICES[0];
  const selectedKokoroDetail = useMemo(
    () => KOKORO_VOICE_DETAILS[selectedKokoroVoice.id] || '',
    [selectedKokoroVoice.id]
  );

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
          <div className="voice-settings-section voice-settings-section--simple">
            <label className="voice-settings-field voice-settings-speed-field">
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

            <div className="voice-settings-field">
              <span>音色</span>
              <p className="voice-settings-field-note">
                当前：{selectedKokoroVoice.label} · {selectedKokoroDetail}
              </p>
            </div>

            <div className="voice-settings-voice-cards">
              {KOKORO_WORD_AUDIO_VOICES.map((voice) => {
                const labelParts = getVoiceLabelParts(voice.label);

                return (
                  <button
                    key={voice.id}
                    type="button"
                    className={`voice-settings-voice-card ${kokoroVoice === voice.id ? 'is-selected' : ''}`}
                    onClick={() => handleKokoroVoiceChange(voice.id)}
                  >
                    <span className="voice-settings-voice-name">{labelParts.name}</span>
                    <span className="voice-settings-voice-desc">{labelParts.description}</span>
                  </button>
                );
              })}
            </div>

            {kokoroHint && <p className="voice-settings-error">{kokoroHint}</p>}

            <button
              type="button"
              onClick={handleKokoroPreview}
              disabled={isPlaying === 'kokoro'}
              className="voice-settings-primary"
            >
              {isPlaying === 'kokoro' ? '试听中...' : '试听发音'}
            </button>
          </div>
        </div>

        <footer className="voice-settings-footer">
          <p>设置会自动保存到本机</p>
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
