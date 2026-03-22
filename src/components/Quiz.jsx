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

  const accuracy = questionCount > 0 ? Math.round((score / questionCount) * 100) : 0;
  const masteredCount = useMemo(
    () => vocabulary.reduce((count, word) => count + (masteredWordSet.has(word.id) ? 1 : 0), 0),
    [vocabulary, masteredWordSet]
  );
  const masteredPercent = vocabulary.length > 0 ? (masteredCount / vocabulary.length) * 100 : 0;

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
    }, 1100);
  };

  if (!currentQuestion) {
    return (
      <div className="rounded-2xl bg-white/80 px-6 py-10 text-center text-slate-500 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
        词库加载中...
      </div>
    );
  }

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
        <div className="mb-7 flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              选择题
            </span>
            <span className="inline-flex items-center rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold tracking-[0.06em] text-cyan-700">
              {sourceLabel}
            </span>
          </div>
          <button
            onClick={() => speak(currentQuestion.word, { rate: 0.8 })}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 active:scale-[0.98]"
          >
            <span>🔊</span>
            <span>听发音</span>
          </button>
        </div>

        <p className="text-center text-sm tracking-[0.08em] text-slate-500 md:text-base">请选择正确的中文释义</p>
        <h2 className="mt-4 text-center text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
          {currentQuestion.word}
        </h2>
        <p className="mx-auto mt-4 w-fit rounded-full border border-cyan-100 bg-cyan-50 px-4 py-1.5 font-mono text-lg text-cyan-700">
          {currentQuestion.phonetic || 'N/A'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {options.map((option, index) => {
          const isSelected = selectedAnswer?.id === option.id;
          const isCurrentCorrect = option.id === currentQuestion.id;
          const optionPalette = [
            {
              option:
                'border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-sky-100/80 text-cyan-900 hover:border-cyan-300 hover:from-cyan-100 hover:to-sky-100',
              badge: 'bg-gradient-to-br from-cyan-500 to-sky-500 text-white',
            },
            {
              option:
                'border-violet-200 bg-gradient-to-br from-violet-50 via-white to-indigo-100/80 text-violet-900 hover:border-violet-300 hover:from-violet-100 hover:to-indigo-100',
              badge: 'bg-gradient-to-br from-violet-500 to-indigo-500 text-white',
            },
            {
              option:
                'border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-100/80 text-emerald-900 hover:border-emerald-300 hover:from-emerald-100 hover:to-teal-100',
              badge: 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white',
            },
            {
              option:
                'border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-100/80 text-amber-900 hover:border-amber-300 hover:from-amber-100 hover:to-orange-100',
              badge: 'bg-gradient-to-br from-amber-500 to-orange-500 text-white',
            },
          ][index % 4];

          let optionClass = `${optionPalette.option} hover:-translate-y-0.5`;
          let badgeClass = `${optionPalette.badge} group-hover:brightness-105`;

          if (selectedAnswer) {
            if (isCurrentCorrect) {
              optionClass =
                'border-emerald-300 bg-gradient-to-br from-emerald-100 to-green-50 text-emerald-900 shadow-[0_12px_30px_rgba(16,185,129,0.2)]';
              badgeClass = 'bg-emerald-500 text-white';
            } else if (isSelected) {
              optionClass =
                'border-rose-300 bg-gradient-to-br from-rose-100 to-red-50 text-rose-900 shadow-[0_12px_30px_rgba(244,63,94,0.18)]';
              badgeClass = 'bg-rose-500 text-white';
            } else {
              optionClass = 'border-slate-200 bg-slate-50 text-slate-400';
              badgeClass = 'bg-slate-300 text-slate-100';
            }
          }

          return (
            <button
              key={option.id}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`group w-full rounded-2xl border px-4 py-4 text-left transition-all duration-200 ${optionClass} ${
                selectedAnswer ? 'cursor-default' : 'shadow-[0_12px_30px_rgba(15,23,42,0.08)]'
              }`}
            >
              <div className="flex items-start gap-4">
                <span
                  className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-semibold transition ${badgeClass}`}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="pt-1 text-lg leading-relaxed">{option.meaning}</span>
              </div>
            </button>
          );
        })}
      </div>

      {selectedAnswer && (
        <div
          className={`rounded-2xl border px-5 py-4 text-center shadow-[0_10px_28px_rgba(15,23,42,0.06)] ${
            isCorrect ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'
          }`}
        >
          <p className={`text-lg font-semibold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
            {isCorrect ? '回答正确，继续保持。' : '答案不对，下一题继续。'}
          </p>
          {!isCorrect && <p className="mt-1 text-sm text-slate-600">正确答案：{currentQuestion.meaning}</p>}
        </div>
      )}

      <div className="rounded-2xl bg-slate-900 px-5 py-5 text-white shadow-[0_16px_36px_rgba(15,23,42,0.26)]">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-white/75">掌握进度</p>
          <p className="text-sm font-semibold">
            {masteredCount} / {vocabulary.length}
          </p>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 transition-all duration-500"
            style={{ width: `${masteredPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default Quiz;
