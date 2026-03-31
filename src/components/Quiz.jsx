import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { speak } from '../utils/speech';
import { playSuccessChime } from '../utils/feedback';
import CorrectAnswerCelebration from './CorrectAnswerCelebration';

function Quiz({ vocabulary, optionVocabulary = [], sourceLabel = '题库测验', masteredWords, onAddMastered }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [celebrationTrigger, setCelebrationTrigger] = useState(0);
  const nextQuestionTimer = useRef(null);
  const masteredWordSet = useMemo(() => new Set(masteredWords), [masteredWords]);

  const masteredCount = useMemo(
    () => vocabulary.reduce((count, word) => count + (masteredWordSet.has(word.id) ? 1 : 0), 0),
    [vocabulary, masteredWordSet]
  );
  const masteredPercent = vocabulary.length > 0 ? Math.round((masteredCount / vocabulary.length) * 100) : 0;

  const generateQuestion = useCallback(() => {
    if (vocabulary.length === 0) {
      setCurrentQuestion(null);
      setOptions([]);
      setSelectedAnswer(null);
      setIsCorrect(null);
      return;
    }

    const shuffled = [...vocabulary].sort(() => Math.random() - 0.5);
    const correctWord = shuffled[0];

    const distractorBase =
      optionVocabulary.length > 0
        ? optionVocabulary.filter((word) => word.id !== correctWord.id)
        : vocabulary.filter((word) => word.id !== correctWord.id);
    const shuffledDistractors = [...distractorBase].sort(() => Math.random() - 0.5);
    const wrongOptions = shuffledDistractors.slice(0, 3);

    if (wrongOptions.length < 3) {
      const fallbackPool = vocabulary.filter(
        (word) => word.id !== correctWord.id && !wrongOptions.some((wrong) => wrong.id === word.id)
      );
      wrongOptions.push(...fallbackPool.slice(0, 3 - wrongOptions.length));
    }

    const allOptions = [correctWord, ...wrongOptions].sort(() => Math.random() - 0.5);

    setCurrentQuestion(correctWord);
    setOptions(allOptions);
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, [vocabulary, optionVocabulary]);

  useEffect(() => {
    const initTimer = setTimeout(() => {
      generateQuestion();
    }, 0);

    return () => {
      clearTimeout(initTimer);
      if (nextQuestionTimer.current) {
        clearTimeout(nextQuestionTimer.current);
      }
    };
  }, [generateQuestion]);

  const handleAnswer = (word) => {
    if (selectedAnswer || !currentQuestion) {
      return;
    }

    const correct = word.id === currentQuestion.id;

    setSelectedAnswer(word);
    setIsCorrect(correct);
    setQuestionCount((prev) => prev + 1);

    if (correct) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      setCelebrationTrigger((prev) => prev + 1);
      playSuccessChime();
      onAddMastered(currentQuestion.id);
    } else {
      setStreak(0);
    }

    if (nextQuestionTimer.current) {
      clearTimeout(nextQuestionTimer.current);
    }

    nextQuestionTimer.current = setTimeout(() => {
      generateQuestion();
    }, 1600);
  };

  if (!currentQuestion) {
    return (
      <div className="text-gray-500 text-center py-12">
        <p className="text-xl">词库加载中...</p>
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
        <p className="text-gray-500 text-center mb-5 text-3xl font-bold">请选择正确的释义</p>

        <div className="flex justify-center mb-4">
          <span className="inline-flex px-5 py-2 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-bold text-sm tracking-wide">
            {sourceLabel}
          </span>
        </div>

        <h2 className="text-6xl md:text-7xl font-bold text-gray-800 text-center mb-6 tracking-tight">
          {currentQuestion.word}
        </h2>
        <p className="text-2xl text-gray-500 text-center font-mono bg-gray-100 inline-block mx-auto px-8 py-3 rounded-full">
          {currentQuestion.phonetic || 'N/A'}
        </p>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => speak(currentQuestion.word, { rate: 0.8 })}
            className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full hover:from-purple-600 hover:to-indigo-600 transition-all shadow-xl hover:shadow-2xl font-bold text-2xl"
          >
            <span className="text-3xl">🔊</span>
            <span>听发音</span>
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
                <span
                  className={`inline-flex w-20 h-20 rounded-full font-black text-4xl items-center justify-center ${
                    selectedAnswer ? 'bg-white/20' : 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg'
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <p className="text-3xl leading-snug">{option.meaning}</p>
              </div>
            </button>
          );
        })}
      </div>

      {selectedAnswer && (
        <div className={`text-center p-6 rounded-2xl border ${isCorrect ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'}`}>
          <p className={`text-3xl font-bold mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? '🎉 回答正确！' : '❌ 回答错误'}
          </p>
          {!isCorrect && (
            <p className="text-gray-600 text-lg">
              <span className="opacity-70">正确答案：</span>
              <span className="font-bold"> {currentQuestion.meaning}</span>
            </p>
          )}
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-600 font-bold">📚 学习池掌握进度</span>
          <span className="text-gray-700 font-black text-lg">
            {masteredCount} / {vocabulary.length}
          </span>
        </div>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-emerald-400 transition-all duration-500"
            style={{ width: `${masteredPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default Quiz;
