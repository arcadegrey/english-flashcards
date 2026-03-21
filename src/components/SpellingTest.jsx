import { useState, useEffect, useRef } from 'react';
import { speak } from '../utils/speech';

function SpellingTest({ vocabulary }) {
  const [currentWord, setCurrentWord] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef(null);

  const generateWord = () => {
    const randomIndex = Math.floor(Math.random() * vocabulary.length);
    setCurrentWord(vocabulary[randomIndex]);
    setUserInput('');
    setIsSubmitted(false);
    setIsCorrect(false);
    setShowHint(false);
  };

  useEffect(() => {
    if (vocabulary.length > 0) {
      generateWord();
    }
  }, []);

  useEffect(() => {
    if (currentWord && !isSubmitted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentWord, isSubmitted]);

  const handleSpeak = () => {
    if (currentWord) {
      speak(currentWord.word, { rate: 0.7 });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitted || !userInput.trim()) return;

    const correct = userInput.trim().toLowerCase() === currentWord.word.toLowerCase();
    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      setScore(score + 1);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }

    setQuestionCount(questionCount + 1);
  };

  const handleNext = () => {
    generateWord();
  };

  if (!currentWord) {
    return (
      <div className="text-gray-500 text-center py-12">
        <p className="text-xl">加载中...</p>
      </div>
    );
  }

  const firstLetter = currentWord.word.charAt(0);
  const lastLetter = currentWord.word.charAt(currentWord.word.length - 1);
  const middleLength = currentWord.word.length - 2;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border-2 border-blue-300 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📊</span>
            <span className="text-gray-700 font-bold text-lg">得分</span>
          </div>
          <p className="text-4xl font-black text-blue-600">{score}</p>
          <p className="text-gray-600 font-bold text-xs mt-1">/ {questionCount} 词</p>
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
        <p className="text-gray-500 text-center mb-8 text-3xl font-bold">
          听发音，拼写出正确的单词
        </p>

        <div className="flex justify-center mb-10">
          <button
            onClick={handleSpeak}
            className="px-12 py-7 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full hover:from-purple-600 hover:to-indigo-600 transition-all shadow-xl hover:shadow-2xl font-bold text-2xl flex items-center gap-4"
          >
            <span className="text-4xl">🔊</span>
            <span>播放发音</span>
          </button>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-center">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="输入你听到的单词..."
                className="w-full max-w-2xl px-10 py-8 text-4xl text-center border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </div>

            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => setShowHint(true)}
                disabled={showHint}
                className="px-10 py-6 bg-gray-100 text-gray-600 rounded-xl font-bold text-2xl hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {showHint ? '✓ 已显示提示' : '💡 显示提示'}
              </button>
              <button
                type="submit"
                disabled={!userInput.trim()}
                className="px-12 py-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-bold text-2xl hover:from-purple-600 hover:to-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                提交
              </button>
            </div>

            {showHint && (
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-3">提示：</p>
                <div className="inline-flex items-center gap-2 bg-yellow-50 px-8 py-4 rounded-xl border border-yellow-200">
                  <span className="text-3xl font-bold text-gray-800">{firstLetter}</span>
                  <span className="text-3xl text-gray-400">
                    {'_'.repeat(middleLength)}
                  </span>
                  <span className="text-3xl font-bold text-gray-800">{lastLetter}</span>
                  <span className="ml-4 text-xl text-gray-500">{currentWord.phonetic}</span>
                </div>
                <p className="text-gray-500 text-base mt-4">{currentWord.meaning}</p>
              </div>
            )}
          </form>
        ) : (
          <div className="space-y-8">
            <div className={`text-center p-10 rounded-2xl ${
              isCorrect ? 'bg-green-100 border-2 border-green-300' : 'bg-red-100 border-2 border-red-300'
            }`}>
              <p className={`text-4xl font-black mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? '🎉 回答正确！' : '❌ 回答错误'}
              </p>
              {!isCorrect && (
                <div>
                  <p className="text-gray-600 text-xl mb-2">
                    你输入了：<span className="font-bold">{userInput}</span>
                  </p>
                  <p className="text-gray-600 text-xl">
                    正确答案：<span className="font-black text-green-600 text-3xl">{currentWord.word}</span>
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <p className="text-4xl font-bold text-gray-800 mb-3">{currentWord.word}</p>
              <p className="text-gray-500 text-2xl mb-3">{currentWord.phonetic}</p>
              <p className="text-gray-600 text-xl">{currentWord.meaning}</p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleNext}
                className="px-12 py-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl hover:from-purple-600 hover:to-indigo-600 transition-all shadow-xl font-bold text-2xl"
              >
                下一个单词 →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SpellingTest;