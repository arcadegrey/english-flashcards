import { storage } from './storage.js';
import { correctedVocabularyAudioUrl } from '../../shared/vocabularyAudio.js';
import { createSpeechService } from './speechEngine.js';

export {
  DEFAULT_KOKORO_TTS_ENDPOINT, DEFAULT_SPEECH_RATE, SLOW_SPEECH_RATE,
  KOKORO_WORD_AUDIO_VOICES, KOKORO_EXAMPLE_AUDIO_VOICES,
} from './speechEngine.js';

const speech = createSpeechService({ storage, correctedAudioUrl: correctedVocabularyAudioUrl, env: import.meta.env || {} });
export const {
  speak, speakWord, speakExample, speakStaticKokoroWordAudio, stopSpeak,
  getAvailableVoices, setVoice, getCurrentVoice, setTtsProvider, getTtsProvider,
  getSpeechRate, setSpeechRate,
} = speech;
export default speech;
