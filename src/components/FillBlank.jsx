import { useState, useEffect, useCallback, useRef } from 'react';
import { speak } from '../utils/speech';
import { playSuccessChime } from '../utils/feedback';
import CorrectAnswerCelebration from './CorrectAnswerCelebration';

const BLANK_TOKEN = '______';

const escapeRegExp = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildHiddenSentence = (example = '', answerWord = '') => {
  const safeExample = String(example || '').trim();
  const safeWord = String(answerWord || '').trim();
  if (!safeExample || !safeWord) return '';

  const escapedWord = escapeRegExp(safeWord);
  const exactRegex = new RegExp(`\\b${escapedWord}\\b`, 'i');
  if (exactRegex.test(safeExample)) {
    return safeExample.replace(exactRegex, BLANK_TOKEN);
  }

  // Fallback for simple inflections: word + s/es/ed/ing.
  const inflectionRegex = new RegExp(`\\b${escapedWord}(s|es|ed|ing)?\\b`, 'i');
  if (inflectionRegex.test(safeExample)) {
    return safeExample.replace(inflectionRegex, BLANK_TOKEN);
  }

  return '';
};

function FillBlank({ vocabulary, sourceLabel = '' }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [sentence, setSentence] = useState('');
  const [questionError, setQuestionError] = useState('');
  const [celebrationTrigger, setCelebrationTrigger] = useState(0);
  const nextQuestionTimer = useRef(null);

  const generateQuestion = useCallback(() => {
    if (!Array.isArray(vocabulary) || vocabulary.length === 0) {
      setQuestionError('当前词库为空，暂时无法生成填空题。');
      setCurrentQuestion(null);
      setOptions([]);
      setSentence('');
      return;
    }

    const candidates = vocabulary.filter((item) => item?.word && item?.example);
    if (candidates.length === 0) {
      setQuestionError('当前词库缺少可用例句，暂时无法生成填空题。');
      setCurrentQuestion(null);
      setOptions([]);
      setSentence('');
      return;
    }

    const shuffledCandidates = [...candidates].sort(() => Math.random() - 0.5);

    let selectedWord = null;
    let hiddenSentence = '';

    for (const item of shuffledCandidates) {
      const nextHiddenSentence = buildHiddenSentence(item.example, item.word);
      if (nextHiddenSentence && nextHiddenSentence !== item.example) {
        selectedWord = item;
        hiddenSentence = nextHiddenSentence;
        break;
      }
    }

    if (!selectedWord) {
      setQuestionError('当前例句中无法自动挖空目标词，请切换词库后重试。');
      setCurrentQuestion(null);
      setOptions([]);
      setSentence('');
      return;
    }

    const distractorPool = vocabulary.filter((item) => item.id !== selectedWord.id);
    const wrongOptions = [...distractorPool]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(3, distractorPool.length));

    const allOptions = [selectedWord, ...wrongOptions].sort(() => Math.random() - 0.5);

    setQuestionError('');
    setCurrentQuestion(selectedWord);
    setOptions(allOptions);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setSentence(hiddenSentence);
  }, [vocabulary]);

  useEffect(() => {
    const initTimer = setTimeout(() => {
      if (vocabulary.length > 0) {
        generateQuestion();
      }
    }, 0);

    return () => {
      clearTimeout(initTimer);
      if (nextQuestionTimer.current) {
        clearTimeout(nextQuestionTimer.current);
      }
    };
  }, [generateQuestion, vocabulary.length]);

  const handleAnswer = (word) => {
    if (selectedAnswer || !currentQuestion) {
      return;
    }

    setSelectedAnswer(word);
    const correct = word.id === currentQuestion.id;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      setCelebrationTrigger((prev) => prev + 1);
      playSuccessChime();
    } else {
      setStreak(0);
    }

    setQuestionCount((prev) => prev + 1);

    if (nextQuestionTimer.current) {
      clearTimeout(nextQuestionTimer.current);
    }

    nextQuestionTimer.current = setTimeout(() => {
      generateQuestion();
    }, 1800);
  };

  const handleSpeakSentence = () => {
    if (currentQuestion) {
      speak(currentQuestion.example, { rate: 0.9 });
    }
  };

  if (questionError) {
    return (
      <div className="text-center py-12">
        <p className="text-2xl font-bold text-rose-500">{questionError}</p>
      </div>
    );
  }

  if (!currentQuestion || !sentence) {
    return (
      <div className="text-gray-500 text-center py-12">
        <p className="text-xl">加载中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <CorrectAnswerCelebration trigger={celebrationTrigger} />

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border-2 border-blue-300 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📊</span>
            <span className="text-gray-700 font-bold text-lg">得分</span>
          </div>
          <p className="text-4xl font-black text-blue-600">{score}</p>
          <p className="text-gray-600 font-bold text-xs mt-1">/ {questionCount} 题</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-5 border-2 border-orange-300 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🔥</span>
            <span className="text-gray-700 font-bold text-lg">连击</span>
          </div>
          <p className={`text-4xl font-black ${streak >= 5 ? 'text-yellow-600' : 'text-orange-600'}`}>
            {streak} 连对
          </p>
          <p className="text-gray-600 font-bold text-xs mt-1">
            {streak >= 10 ? '🔥🔥🔥 太厉害了！' : streak >= 5 ? '🔥 继续加油！' : '再接再厉！'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border-2 border-green-300 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🎯</span>
            <span className="text-gray-700 font-bold text-lg">正确率</span>
          </div>
          <p className="text-4xl font-black text-green-600">
            {questionCount > 0 ? Math.round((score / questionCount) * 100) : 0}%
          </p>
          <p className="text-gray-600 font-bold text-xs mt-1">
            {questionCount > 0 ? (score / questionCount >= 0.8 ? '太棒了！' : '继续练习！') : '开始答题吧！'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-200">
        <p className="text-gray-500 text-center mb-6 text-3xl font-bold">
          用正确的单词填空
        </p>
        {sourceLabel && (
          <p className="text-center mb-6 text-sm font-semibold text-cyan-600">
            题目来源：{sourceLabel}
          </p>
        )}
        
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-10 border-2 border-purple-200 mb-8">
          <p className="text-4xl md:text-5xl font-bold text-gray-800 leading-relaxed text-center">
            "{sentence}"
          </p>
          <p className="text-gray-500 text-center mt-4 text-2xl">
            {currentQuestion.meaning}
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSpeakSentence}
            className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-12 py-6 text-2xl font-bold text-white shadow-xl transition-all hover:from-purple-600 hover:to-indigo-600 hover:shadow-2xl"
          >
            <span className="text-3xl">🔊</span>
            <span>听例句</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {options.map((option, index) => {
          let buttonClass = 'bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 hover:border-purple-300';

          if (selectedAnswer) {
            if (option.id === currentQuestion.id) {
              buttonClass = 'bg-green-500 text-white border-green-400 shadow-xl';
            } else if (option.id === selectedAnswer.id) {
              buttonClass = 'bg-red-500 text-white border-red-400 shadow-xl';
            } else {
              buttonClass = 'bg-gray-100 text-gray-400';
            }
          }

          return (
            <button
              key={option.id}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`px-8 py-10 rounded-2xl font-bold text-2xl transition-colors duration-200 text-center shadow-xl ${buttonClass} ${
                !selectedAnswer ? 'hover:-translate-y-1 active:translate-y-0' : ''
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                <span className={`inline-flex w-20 h-20 rounded-full font-black text-4xl items-center justify-center ${
                  selectedAnswer ? 'bg-white/20' : 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg'
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <div>
                  <p className="text-3xl leading-snug">{option.word}</p>
                  <p className="text-gray-500 text-lg mt-2">{option.phonetic || ''}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedAnswer && (
        <div className={`text-center p-6 rounded-2xl border ${
          isCorrect ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'
        }`}>
          <p className={`text-3xl font-bold mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? '🎉 回答正确！' : '❌ 回答错误'}
          </p>
          {!isCorrect && (
            <p className="text-gray-600 text-lg">
              <span className="opacity-70">正确答案：</span>{' '}
              <span className="font-bold">{currentQuestion.word}</span>
            </p>
          )}
          <p className="text-gray-500 text-sm mt-2">{currentQuestion.example}</p>
        </div>
      )}
    </div>
  );
}

export default FillBlank;
