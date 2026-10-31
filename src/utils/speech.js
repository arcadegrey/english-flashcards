import { storage } from './storage.js';
import { createSpeechService } from './speechEngine.js';

export {
  DEFAULT_KOKORO_TTS_ENDPOINT, DEFAULT_SPEECH_RATE, SLOW_SPEECH_RATE,
  KOKORO_WORD_AUDIO_VOICES, KOKORO_EXAMPLE_AUDIO_VOICES,
} from './speechEngine.js';

let audioMapping, audioMappingRequest;
const correctedAudioUrl = (...args) => {
  if (audioMapping) return audioMapping.correctedVocabularyAudioUrl(...args);
  audioMappingRequest ??= import('../../shared/vocabularyAudio.js').then(module => {
    audioMapping = module;
    return module;
  }).catch(error => { audioMappingRequest = null; throw error; });
  return audioMappingRequest.then(module => module.correctedVocabularyAudioUrl(...args));
};

const speech = createSpeechService({ storage, correctedAudioUrl, env: {
  VITE_WORD_AUDIO_BASE_URL: import.meta.env?.VITE_WORD_AUDIO_BASE_URL,
  VITE_EXAMPLE_AUDIO_BASE_URL: import.meta.env?.VITE_EXAMPLE_AUDIO_BASE_URL,
} });
export const {
  speak, speakWord, speakExample, speakStaticKokoroWordAudio, prepareWordAudio, stopSpeak,
  getAvailableVoices, setVoice, getCurrentVoice, setTtsProvider, getTtsProvider,
  getSpeechRate, setSpeechRate,
} = speech;
export default speech;
