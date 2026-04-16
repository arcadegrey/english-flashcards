import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { speak } from '../utils/speech';
import { playSuccessChime } from '../utils/feedback';
import CorrectAnswerCelebration from './CorrectAnswerCelebration';

const createQuizRound = (vocabulary = [], optionVocabulary = []) => {
  if (!Array.isArray(vocabulary) || vocabulary.length === 0) {
    return { question: null, options: [] };
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

  return {
    question: correctWord,
    options: [correctWord, ...wrongOptions].sort(() => Math.random() - 0.5),
  };
};

function Quiz({ vocabulary, optionVocabulary = [], sourceLabel = '题库测验', masteredWords, onAddMastered }) {
  const initialRound = createQuizRound(vocabulary, optionVocabulary);
  const [currentQuestion, setCurrentQuestion] = useState(() => initialRound.question);
  const [options, setOptions] = useState(() => initialRound.options);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [celebrationTrigger, setCelebrationTrigger] = useState(0);
  const isFirstRenderRef = useRef(true);
  const nextQuestionTimer = useRef(null);
  const masteredWordSet = useMemo(() => new Set(masteredWords), [masteredWords]);

  const masteredCount = useMemo(
    () => vocabulary.reduce((count, word) => count + (masteredWordSet.has(word.id) ? 1 : 0), 0),
    [vocabulary, masteredWordSet]
  );
  const masteredPercent = vocabulary.length > 0 ? Math.round((masteredCount / vocabulary.length) * 100) : 0;

  const generateQuestion = useCallback(() => {
    const nextRound = createQuizRound(vocabulary, optionVocabulary);
    setCurrentQuestion(nextRound.question);
    setOptions(nextRound.options);
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, [vocabulary, optionVocabulary]);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return () => {
        if (nextQuestionTimer.current) {
          clearTimeout(nextQuestionTimer.current);
        }
      };
    }

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
    <div className="space-y-4 pb-[108px] md:space-y-5 md:pb-[124px]">
      <CorrectAnswerCelebration trigger={celebrationTrigger} />

      <section className="learn-refresh-card learn-refresh-card-enter">
        <p className="text-center text-sm font-medium text-[#6e6e73]">请选择正确释义</p>

        <div className="learn-refresh-quiz-stats" aria-label="测验统计">
          <p className="learn-refresh-quiz-stat">
            <span className="learn-refresh-quiz-stat-label">得分</span>
            <span className="learn-refresh-quiz-stat-value">{score}</span>
          </p>
          <p className="learn-refresh-quiz-stat">
            <span className="learn-refresh-quiz-stat-label">连击</span>
            <span className="learn-refresh-quiz-stat-value">{streak}</span>
          </p>
          <p className="learn-refresh-quiz-stat">
            <span className="learn-refresh-quiz-stat-label">正确率</span>
            <span className="learn-refresh-quiz-stat-value">{accuracy}%</span>
          </p>
        </div>

        <div className="mt-3 flex justify-center">
          <span className="inline-flex rounded-full border border-[#e8e8ed] bg-[#f5f5f7] px-3 py-1 text-xs font-medium text-[#6e6e73]">
            {sourceLabel}
          </span>
        </div>

        <div className="learn-refresh-word-block mt-6">
          <h2 className="learn-refresh-word text-[52px] md:text-[72px]">{currentQuestion.word}</h2>
          <div className="learn-refresh-phonetic-row">
            <p className="learn-refresh-phonetic">{currentQuestion.phonetic || 'N/A'}</p>
            <button
              type="button"
              className="learn-refresh-inline-audio"
              onClick={() => speak(currentQuestion.word, { rate: 1 })}
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

        <div className="learn-refresh-quiz-options">
          {options.map((option, index) => {
            let stateClass = '';

            if (selectedAnswer) {
              if (option.id === currentQuestion.id) {
                stateClass = 'is-correct';
              } else if (option.id === selectedAnswer.id) {
                stateClass = 'is-wrong';
              } else {
                stateClass = 'is-muted';
              }
            }

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
                className={`learn-refresh-quiz-option ${stateClass}`}
              >
                <div className="flex items-start gap-3">
                  <span className="learn-refresh-quiz-option-index">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <p className="learn-refresh-quiz-option-meaning">{option.meaning}</p>
                </div>
              </button>
            );
          })}
        </div>

        {selectedAnswer && (
          <div
            className={`mt-4 rounded-[14px] border px-4 py-3 text-sm ${
              isCorrect
                ? 'border-[#b7ddc6] bg-[#f0fdf4] text-[#166534]'
                : 'border-[#fecaca] bg-[#fef2f2] text-[#b91c1c]'
            }`}
          >
            {isCorrect ? '回答正确。' : `回答错误，正确答案：${currentQuestion.meaning}`}
          </div>
        )}

      </section>

      <footer className="learn-refresh-quiz-progress-dock">
        <div className="learn-refresh-quiz-progress-dock-inner">
          <div className="learn-refresh-quiz-progress-row">
            <span>学习池掌握进度</span>
            <span className="font-medium text-[#1d1d1f]">
              {masteredCount} / {vocabulary.length}
            </span>
          </div>
          <div className="learn-refresh-quiz-progress-track">
            <div
              className="learn-refresh-quiz-progress-fill"
              style={{ width: `${masteredPercent}%` }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Quiz;
