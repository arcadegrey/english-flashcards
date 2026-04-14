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
      onAddMastered?.(currentQuestion.id);
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
      <div className="rounded-[20px] border border-[#e8e8ed] bg-white p-8 text-center text-[#6e6e73]">
        词库加载中...
      </div>
    );
  }

  const accuracy = questionCount > 0 ? Math.round((score / questionCount) * 100) : 0;

  return (
    <div className="space-y-5 md:space-y-6">
      <CorrectAnswerCelebration trigger={celebrationTrigger} />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <article className="rounded-[16px] border border-[#e8e8ed] bg-white p-4 text-center shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-medium text-[#6e6e73]">得分</p>
          <p className="mt-1 text-3xl font-semibold text-[#1d1d1f]">{score}</p>
          <p className="mt-1 text-xs text-[#6e6e73]">共 {questionCount} 题</p>
        </article>
        <article className="rounded-[16px] border border-[#e8e8ed] bg-white p-4 text-center shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-medium text-[#6e6e73]">连击</p>
          <p className="mt-1 text-3xl font-semibold text-[#1d1d1f]">{streak}</p>
          <p className="mt-1 text-xs text-[#6e6e73]">连续答对题数</p>
        </article>
        <article className="rounded-[16px] border border-[#e8e8ed] bg-white p-4 text-center shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-medium text-[#6e6e73]">正确率</p>
          <p className="mt-1 text-3xl font-semibold text-[#1d1d1f]">{accuracy}%</p>
          <p className="mt-1 text-xs text-[#6e6e73]">当前答题表现</p>
        </article>
      </div>

      <section className="rounded-[20px] border border-[#e8e8ed] bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.06)] md:p-8">
        <p className="text-center text-sm font-medium text-[#6e6e73]">请选择正确释义</p>

        <div className="mt-3 flex justify-center">
          <span className="inline-flex rounded-full border border-[#e8e8ed] bg-[#f5f5f7] px-3 py-1 text-xs font-medium text-[#6e6e73]">
            {sourceLabel}
          </span>
        </div>

        <h2 className="mt-6 break-all text-center text-4xl font-semibold leading-[1.15] text-[#1d1d1f] md:text-6xl">
          {currentQuestion.word}
        </h2>
        <p className="mt-3 break-all text-center font-mono text-lg text-[#6e6e73] md:text-xl">
          {currentQuestion.phonetic || 'N/A'}
        </p>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => speak(currentQuestion.word, { rate: 1 })}
            className="inline-flex min-h-[46px] items-center gap-2 rounded-[10px] border border-[#0071e3] bg-[#0071e3] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0066ce]"
          >
            <span>🔊</span>
            <span>播放发音</span>
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-3">
        {options.map((option, index) => {
          let stateClass =
            'border-[#e8e8ed] bg-white text-[#1d1d1f] hover:border-[#0071e3] hover:bg-[#eef5ff] hover:text-[#005bb6]';

          if (selectedAnswer) {
            if (option.id === currentQuestion.id) {
              stateClass = 'border-[#0071e3] bg-[#eef5ff] text-[#005bb6]';
            } else if (option.id === selectedAnswer.id) {
              stateClass = 'border-[#ef4444] bg-[#fff1f2] text-[#b91c1c]';
            } else {
              stateClass = 'border-[#e8e8ed] bg-[#f7f7f8] text-[#9ca3af]';
            }
          }

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`rounded-[14px] border px-5 py-5 text-left transition duration-200 md:px-7 md:py-10 ${stateClass}`}
            >
              <div className="flex items-start gap-3">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d7d9df] text-sm font-semibold text-[#6e6e73] md:h-10 md:w-10 md:text-base">
                  {String.fromCharCode(65 + index)}
                </span>
                <p className="text-base leading-[1.6] md:text-2xl">{option.meaning}</p>
              </div>
            </button>
          );
        })}
      </div>

      {selectedAnswer && (
        <div
          className={`rounded-[14px] border px-4 py-3 text-sm ${
            isCorrect
              ? 'border-[#b7ddc6] bg-[#f0fdf4] text-[#166534]'
              : 'border-[#fecaca] bg-[#fef2f2] text-[#b91c1c]'
          }`}
        >
          {isCorrect ? '回答正确。' : `回答错误，正确答案：${currentQuestion.meaning}`}
        </div>
      )}

      <section className="rounded-[16px] border border-[#e8e8ed] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <div className="mb-2 flex items-center justify-between text-sm text-[#6e6e73]">
          <span>学习池掌握进度</span>
          <span className="font-medium text-[#1d1d1f]">
            {masteredCount} / {vocabulary.length}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#eceef3]">
          <div
            className="h-full rounded-full bg-[#0071e3] transition-all duration-300"
            style={{ width: `${masteredPercent}%` }}
          />
        </div>
      </section>
    </div>
  );
}

export default Quiz;
