import { useState, useEffect, useRef, useCallback } from 'react';
import { speak } from '../utils/speech';
import { playSuccessChime } from '../utils/feedback';
import CorrectAnswerCelebration from './CorrectAnswerCelebration';

const pickRandomWord = (vocabulary = []) => {
  if (!Array.isArray(vocabulary) || vocabulary.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * vocabulary.length);
  return vocabulary[randomIndex] || null;
};

function SpellingTest({ vocabulary, onWrongAnswer, onCorrectAnswer }) {
  const [currentWord, setCurrentWord] = useState(() => pickRandomWord(vocabulary));
  const [userInput, setUserInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [celebrationTrigger, setCelebrationTrigger] = useState(0);
  const isFirstRenderRef = useRef(true);
  const inputRef = useRef(null);

  const generateWord = useCallback(() => {
    const nextWord = pickRandomWord(vocabulary);
    setCurrentWord(nextWord);
    setUserInput('');
    setIsSubmitted(false);
    setIsCorrect(false);
    setShowHint(false);
  }, [vocabulary]);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return undefined;
    }

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
      speak(currentWord.word, { rate: 1 });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSubmitted || !userInput.trim()) return;

    const correct = userInput.trim().toLowerCase() === currentWord.word.toLowerCase();
    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      setCelebrationTrigger((prev) => prev + 1);
      playSuccessChime();
      onCorrectAnswer?.(currentWord.id);
    } else {
      setStreak(0);
      onWrongAnswer?.(currentWord.id);
    }

    setQuestionCount((prev) => prev + 1);
  };

  const handleNext = () => {
    generateWord();
  };

  if (!currentWord) {
    return (
      <div className="rounded-[20px] border border-[#e8e8ed] bg-white p-8 text-center text-[#6e6e73]">
        题目加载中...
      </div>
    );
  }

  const firstLetter = currentWord.word.charAt(0);
  const lastLetter = currentWord.word.charAt(currentWord.word.length - 1);
  const middleLength = Math.max(currentWord.word.length - 2, 0);
  const hintPattern =
    middleLength > 0 ? `${firstLetter}${'_'.repeat(middleLength)}${lastLetter}` : currentWord.word;

  const accuracy = questionCount > 0 ? Math.round((score / questionCount) * 100) : 0;

  return (
    <div className="space-y-4 pb-[108px] md:space-y-5 md:pb-[124px]">
      <CorrectAnswerCelebration trigger={celebrationTrigger} />

      <section className="learn-refresh-card learn-refresh-card-enter">
        <p className="text-center text-sm font-medium text-[#6e6e73]">听发音并拼写完整单词</p>

        <div className="learn-refresh-word-block mt-6">
          <div className="learn-refresh-phonetic-row">
            <p className="learn-refresh-phonetic">点击播放后输入单词</p>
            <button
              type="button"
              className="learn-refresh-inline-audio"
              onClick={handleSpeak}
              aria-label="播放发音"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 9v6h4l5 4V5L7 9H3z" />
                <path d="M16.5 8.5a4.5 4.5 0 010 7" />
                <path d="M19.5 6a8 8 0 010 12" />
              </svg>
            </button>
          </div>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(event) => setUserInput(event.target.value)}
              placeholder="输入你听到的单词..."
              className="w-full rounded-[14px] border border-[#e8e8ed] bg-white px-5 py-4 text-center text-2xl text-[#1d1d1f] outline-none transition focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20 md:text-3xl"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />

            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowHint(true)}
                disabled={showHint}
                className="min-h-[46px] rounded-[10px] border border-[#e8e8ed] bg-[#f5f5f7] px-5 py-2 text-sm font-semibold text-[#1d1d1f] transition hover:bg-[#ececf0] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {showHint ? '已显示提示' : '显示提示'}
              </button>
              <button
                type="submit"
                disabled={!userInput.trim()}
                className="min-h-[46px] rounded-[10px] border border-[#0071e3] bg-[#0071e3] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0066ce] disabled:cursor-not-allowed disabled:opacity-60"
              >
                提交答案
              </button>
            </div>

            {showHint && (
              <div className="rounded-[12px] border border-[#e8e8ed] bg-[#fcfcfd] px-4 py-3 text-center">
                <p className="break-all text-xl font-semibold text-[#1d1d1f] md:text-2xl">{hintPattern}</p>
                <p className="mt-1 break-all text-sm text-[#6e6e73]">{currentWord.phonetic || 'N/A'}</p>
                <p className="mt-2 text-sm text-[#6e6e73]">{currentWord.meaning}</p>
              </div>
            )}
          </form>
        ) : (
          <div className="mt-6 space-y-4">
            <div
              className={`rounded-[14px] border px-4 py-4 text-sm ${
                isCorrect
                  ? 'border-[#b7ddc6] bg-[#f0fdf4] text-[#166534]'
                  : 'border-[#fecaca] bg-[#fef2f2] text-[#b91c1c]'
              }`}
            >
              {isCorrect ? '回答正确。' : `回答错误，正确答案：${currentWord.word}`}
            </div>

            <div className="rounded-[14px] border border-[#e8e8ed] bg-[#fcfcfd] px-4 py-4 text-center">
              <p className="break-all text-3xl font-semibold text-[#1d1d1f] md:text-4xl">{currentWord.word}</p>
              <p className="mt-2 break-all text-base text-[#6e6e73] md:text-lg">{currentWord.phonetic || 'N/A'}</p>
              <p className="mt-2 text-sm text-[#6e6e73] md:text-base">{currentWord.meaning}</p>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleNext}
                className="min-h-[46px] rounded-[10px] border border-[#0071e3] bg-[#0071e3] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0066ce]"
              >
                下一个单词
              </button>
            </div>
          </div>
        )}
      </section>

      <footer className="learn-refresh-assessment-dock">
        <div className="learn-refresh-assessment-dock-inner">
          <div className="learn-refresh-assessment-stat">
            <span className="learn-refresh-assessment-stat-label">得分</span>
            <span className="learn-refresh-assessment-stat-value">{score}</span>
          </div>
          <div className="learn-refresh-assessment-stat">
            <span className="learn-refresh-assessment-stat-label">连击</span>
            <span className="learn-refresh-assessment-stat-value">{streak}</span>
          </div>
          <div className="learn-refresh-assessment-stat">
            <span className="learn-refresh-assessment-stat-label">正确率</span>
            <span className="learn-refresh-assessment-stat-value">{accuracy}%</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default SpellingTest;
