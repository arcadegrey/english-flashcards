import { useState, useEffect } from 'react';
import { speak, setVoice as setGlobalVoice } from '../utils/speech';
import { storage } from '../utils/storage';

function VoiceSettings({ onClose }) {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoiceState] = useState('');
  const [isPlaying, setIsPlaying] = useState(null);

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = speechSynthesis.getVoices();
      const englishVoices = allVoices.filter((v) => v.lang.startsWith('en'));
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

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handlePreview = (voice) => {
    if (isPlaying === voice.name) {
      speechSynthesis.cancel();
      setIsPlaying(null);
      return;
    }

    handleSelect(voice.name);

    setIsPlaying(voice.name);
    
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance('Hello, this is a voice preview.');
    utterance.voice = voice;
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    
    utterance.onend = () => setIsPlaying(null);
    utterance.onerror = () => setIsPlaying(null);
    
    speechSynthesis.speak(utterance);
  };

  const handleSelect = (voiceName) => {
    setSelectedVoiceState(voiceName);
    storage.setSelectedVoice(voiceName);
    
    const voice = voices.find((v) => v.name === voiceName);
    if (voice) {
      setGlobalVoice(voice);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
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

        <div className="p-6 overflow-y-auto flex-1">
          {voices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">正在加载语音...</p>
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
                        <p className={`font-bold text-lg truncate ${isSelected ? 'text-purple-700' : 'text-gray-800'}`}>
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

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              共 <span className="font-bold">{voices.length}</span> 个英语语音可用
            </p>
            {selectedVoice ? (
              <div className="flex items-center gap-3">
                <p className="text-purple-600 font-bold">
                  ✓ 已选择
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-indigo-600 transition-all"
                >
                  确认并关闭
                </button>
              </div>
            ) : (
              <button
                onClick={onClose}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
              >
                关闭
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceSettings;