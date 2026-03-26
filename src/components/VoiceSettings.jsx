import { useState, useEffect } from 'react';
import {
  speak,
  setVoice as setGlobalVoice,
  getAvailableVoices,
  setTtsProvider as setGlobalProvider,
  getTtsProvider,
} from '../utils/speech';
import { storage } from '../utils/storage';

function VoiceSettings({ onClose }) {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoiceState] = useState('');
  const [isPlaying, setIsPlaying] = useState(null);
  const [ttsProvider, setTtsProviderState] = useState(getTtsProvider());
  const [kokoroEndpoint, setKokoroEndpointState] = useState(storage.getKokoroEndpoint());
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

  const handleKokoroPreview = async () => {
    if (!kokoroEndpoint.trim()) {
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

  const browserProviderClass =
    ttsProvider === 'browser'
      ? 'border-purple-500 bg-purple-50 text-purple-700'
      : 'border-gray-200 text-gray-600 hover:border-purple-300';
  const kokoroProviderClass =
    ttsProvider === 'kokoro'
      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
      : 'border-gray-200 text-gray-600 hover:border-indigo-300';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[82vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-500 to-indigo-500">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <span>🔊</span>
            <span>语音设置</span>
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors text-3xl font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleProviderChange('browser')}
              className={`rounded-2xl border-2 px-4 py-3 font-bold transition-all ${browserProviderClass}`}
            >
              浏览器 TTS
            </button>
            <button
              onClick={() => handleProviderChange('kokoro')}
              className={`rounded-2xl border-2 px-4 py-3 font-bold transition-all ${kokoroProviderClass}`}
            >
              Kokoro TTS
            </button>
          </div>

          {ttsProvider === 'browser' ? (
            <div>
              {voices.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">当前浏览器暂无可用英语语音</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {voices.map((voice) => {
                    const isSelected = selectedVoice === voice.name;
                    const isCurrentlyPlaying = isPlaying === voice.name;

                    return (
                      <div
                        key={voice.name}
                        className={`rounded-2xl border-2 transition-all duration-300 ${
                          isSelected
                            ? 'border-purple-500 bg-purple-50 shadow-lg'
                            : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="p-4 flex items-center gap-4">
                          <button
                            onClick={() => handleSelect(voice.name)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                              isSelected
                                ? 'border-purple-500 bg-purple-500'
                                : 'border-gray-300 hover:border-purple-400'
                            }`}
                          >
                            {isSelected && <span className="text-white text-sm">✓</span>}
                          </button>

                          <div className="flex-1 min-w-0">
                            <p
                              className={`font-bold text-lg truncate ${
                                isSelected ? 'text-purple-700' : 'text-gray-800'
                              }`}
                            >
                              {voice.name}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {voice.lang} {voice.default ? '• 默认' : ''}
                            </p>
                          </div>

                          <button
                            onClick={() => handlePreview(voice)}
                            disabled={isPlaying && !isCurrentlyPlaying}
                            className={`px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
                              isCurrentlyPlaying
                                ? 'bg-red-500 text-white'
                                : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            <span>{isCurrentlyPlaying ? '⏹' : '▶'}</span>
                            <span>{isCurrentlyPlaying ? '停止' : '试听'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
                <p className="text-indigo-700 text-sm leading-relaxed">
                  接入方式：请把本地或云端 Kokoro API 地址填在下面，例如
                  `http://127.0.0.1:8880/v1/audio/speech`。
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kokoro 接口地址</label>
                <input
                  value={kokoroEndpoint}
                  onChange={(e) => {
                    const value = e.target.value;
                    setKokoroEndpointState(value);
                    storage.setKokoroEndpoint(value);
                  }}
                  placeholder="http://127.0.0.1:8880/v1/audio/speech"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">音色 ID</label>
                  <input
                    value={kokoroVoice}
                    onChange={(e) => {
                      const value = e.target.value;
                      setKokoroVoiceState(value);
                      storage.setKokoroVoice(value);
                    }}
                    placeholder="af_bella"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    语速 ({kokoroSpeed.toFixed(2)})
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.05"
                    value={kokoroSpeed}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setKokoroSpeedState(value);
                      storage.setKokoroSpeed(value);
                    }}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>

              <button
                onClick={handleKokoroPreview}
                disabled={isPlaying === 'kokoro'}
                className="px-5 py-3 rounded-xl font-bold bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-600 hover:to-violet-600 transition-all disabled:opacity-50"
              >
                {isPlaying === 'kokoro' ? '试听中...' : '试听 Kokoro'}
              </button>

              {kokoroHint && (
                <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                  {kokoroHint}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <p className="text-gray-600">
            当前引擎：<span className="font-bold">{ttsProvider === 'kokoro' ? 'Kokoro TTS' : '浏览器 TTS'}</span>
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-indigo-600 transition-all"
          >
            保存并关闭
          </button>
        </div>
      </div>
    </div>
  );
}

export default VoiceSettings;
