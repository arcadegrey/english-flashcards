import { useState, useEffect, useCallback, useRef } from 'react';
import { speakExample } from '../utils/speech';
import { playSuccessChime } from '../utils/feedback';
import CorrectAnswerCelebration from './CorrectAnswerCelebration';
import { createFillBlankRound } from '../utils/assessmentRounds.js';

function FillBlank({ vocabulary, sourceLabel = '', onWrongAnswer, onCorrectAnswer, onAnswer }) {
  const [round, setRound] = useState(() => createFillBlankRound(vocabulary));
  const { question: currentQuestion, options, sentence, error: questionError } = round;
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [celebrationTrigger, setCelebrationTrigger] = useState(0);
  const isFirstRenderRef = useRef(true);
  const nextQuestionTimer = useRef(null);

  const generateQuestion = useCallback(() => {
    setRound(createFillBlankRound(vocabulary));
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, [vocabulary]);

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
      onCorrectAnswer?.(currentQuestion.id);
    } else {
      setStreak(0);
      onWrongAnswer?.(currentQuestion.id);
    }
    onAnswer?.(correct, { wordId: currentQuestion.id, word: currentQuestion.word, meaning: currentQuestion.meaning, selectedWordId: word.id });

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
      speakExample(currentQuestion, { rate: 1 });
    }
  };

  if (questionError) {
    return (
      <div className="rounded-[20px] border border-[#fecaca] bg-[#fef2f2] p-8 text-center text-[#b91c1c]">
        {questionError}
      </div>
    );
  }

  if (!currentQuestion || !sentence) {
    return (
      <div className="rounded-[20px] border border-[#e8e8ed] bg-white p-8 text-center text-[#6e6e73]">
        题目加载中...
      </div>
    );
  }

  const accuracy = questionCount > 0 ? Math.round((score / questionCount) * 100) : 0;

  return (
    <div className="space-y-4 pb-[108px] md:space-y-5 md:pb-[124px]">
      <CorrectAnswerCelebration trigger={celebrationTrigger} />

      <section className="learn-refresh-card learn-refresh-card-enter">
        <header className="assessment-refresh-top">
          <p className="assessment-refresh-prompt">听例句并完成填空</p>
          {sourceLabel && (
            <div className="assessment-refresh-source">
              <span>{sourceLabel}</span>
            </div>
          )}
        </header>

        <section className="learn-refresh-example-block mt-6" aria-label="填空例句">
          <div className="learn-refresh-example-head">
            <span className="learn-refresh-example-label">例句</span>
            <button
              type="button"
              onClick={handleSpeakSentence}
              className="learn-refresh-example-audio"
              aria-label="播放例句"
            >
              播放例句
            </button>
          </div>
          <p className="learn-refresh-example-en">“{sentence}”</p>
          <p className="learn-refresh-example-cn">{currentQuestion.meaning}</p>
        </section>

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
                  <div className="min-w-0">
                    <p className="learn-refresh-quiz-option-meaning break-all">{option.word}</p>
                    <p className="learn-refresh-quiz-option-sub">{option.phonetic || ''}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {selectedAnswer && (
          <div
            className={`fillblank-refresh-result ${
              isCorrect ? 'fillblank-refresh-result--correct' : 'fillblank-refresh-result--wrong'
            }`}
          >
            {isCorrect ? '回答正确。' : `回答错误，正确答案：${currentQuestion.word}`}
            <p>{currentQuestion.example}</p>
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

export default FillBlank;
