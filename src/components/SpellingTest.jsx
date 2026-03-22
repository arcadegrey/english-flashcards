import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { speak } from '../utils/speech';
import { playSuccessChime } from '../utils/feedback';
import CorrectAnswerCelebration from './CorrectAnswerCelebration';

function SpellingTest({ vocabulary }) {
  const [currentWord, setCurrentWord] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [celebrationTrigger, setCelebrationTrigger] = useState(0);
  const inputRef = useRef(null);

  const generateWord = useCallback(() => {
    if (vocabulary.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * vocabulary.length);
    setCurrentWord(vocabulary[randomIndex]);
    setUserInput('');
    setIsSubmitted(false);
    setIsCorrect(false);
    setShowHint(false);
  }, [vocabulary]);

  const accuracy = questionCount > 0 ? Math.round((score / questionCount) * 100) : 0;
  const metrics = useMemo(
    () => [
      {
        label: '得分',
        value: score,
        helper: `${questionCount} 题`,
      },
      {
        label: '连击',
        value: streak,
        helper: streak >= 5 ? '状态很好' : '继续保持',
      },
      {
        label: '正确率',
        value: `${accuracy}%`,
        helper: questionCount === 0 ? '开始答题' : accuracy >= 80 ? '表现优秀' : '继续练习',
      },
    ],
    [score, questionCount, streak, accuracy]
  );

  useEffect(() => {
    if (vocabulary.length > 0) {
      const initTimer = setTimeout(() => {
        generateWord();
      }, 0);

      return () => clearTimeout(initTimer);
    }

    return undefined;
  }, [vocabulary.length, generateWord]);

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
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      setCelebrationTrigger((prev) => prev + 1);
      playSuccessChime();
    } else {
      setStreak(0);
    }

    setQuestionCount((prev) => prev + 1);
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
  const middleLength = Math.max(currentWord.word.length - 2, 0);
  const hintPattern =
    middleLength > 0 ? `${firstLetter}${'•'.repeat(middleLength)}${lastLetter}` : currentWord.word;

  return (
    <div className="space-y-6">
      <CorrectAnswerCelebration trigger={celebrationTrigger} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-slate-200/80 bg-white/85 px-4 py-4 shadow-[0_8px_25px_rgba(15,23,42,0.06)] backdrop-blur-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{metric.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{metric.value}</p>
            <p className="mt-1 text-sm text-slate-500">{metric.helper}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-8 shadow-[0_16px_45px_rgba(15,23,42,0.08)] md:px-8">
        <div className="mb-8 flex items-center justify-between gap-3">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            听音拼写
          </span>
          <button
            onClick={handleSpeak}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 active:scale-[0.98]"
          >
            <span>🔊</span>
            <span>播放发音</span>
          </button>
        </div>

        <p className="mb-7 text-center text-sm tracking-[0.08em] text-slate-500 md:text-base">
          听发音并拼写出完整单词
        </p>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="输入你听到的单词..."
                className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5 text-center text-3xl font-semibold tracking-wide text-slate-900 placeholder:text-slate-400 transition-all focus:border-cyan-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-100"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </div>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowHint(true)}
                disabled={showHint}
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-base font-medium text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {showHint ? '已显示提示' : '显示提示'}
              </button>
              <button
                type="submit"
                disabled={!userInput.trim()}
                className="rounded-xl bg-slate-900 px-8 py-3 text-base font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                提交
              </button>
            </div>

            {showHint && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-600">提示</p>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                  <span className="font-mono text-2xl font-semibold tracking-[0.2em] text-slate-800">
                    {hintPattern}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 font-mono text-sm text-cyan-700">
                    {currentWord.phonetic || 'N/A'}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{currentWord.meaning}</p>
              </div>
            )}
          </form>
        ) : (
          <div className="space-y-5">
            <div
              className={`rounded-2xl border px-5 py-5 text-center ${
                isCorrect ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'
              }`}
            >
              <p className={`text-xl font-semibold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                {isCorrect ? '回答正确，发音和拼写都很稳。' : '拼写有误，再听一遍会更稳。'}
              </p>
              {!isCorrect && (
                <div className="mt-3 space-y-1">
                  <p className="text-sm text-slate-600">
                    你的输入：<span className="font-semibold text-slate-800">{userInput}</span>
                  </p>
                  <p className="text-sm text-slate-600">
                    正确答案：<span className="font-semibold text-emerald-700">{currentWord.word}</span>
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 text-center">
              <p className="text-4xl font-semibold tracking-tight text-slate-900">{currentWord.word}</p>
              <p className="mt-2 font-mono text-lg text-cyan-700">{currentWord.phonetic || 'N/A'}</p>
              <p className="mt-2 text-sm text-slate-600">{currentWord.meaning}</p>
            </div>

            <div className="flex justify-center pt-1">
              <button
                onClick={handleNext}
                className="rounded-xl bg-slate-900 px-8 py-3 text-base font-semibold text-white transition hover:bg-slate-700"
              >
                下一个单词
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SpellingTest;
