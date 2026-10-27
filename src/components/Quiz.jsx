import LoadingState from './ui/LoadingState';
import { useState, useEffect, useCallback, useRef } from 'react';
import { speakWord } from '../utils/speech';
import { playSuccessChime } from '../utils/feedback';
import CorrectAnswerCelebration from './CorrectAnswerCelebration';
import { createQuizRound } from '../utils/assessmentRounds.js';

const EMPTY_OPTIONS = [];

function Quiz({
  vocabulary,
  optionVocabulary = EMPTY_OPTIONS,
  sourceLabel = '题库测验',
  onAddMastered,
  onWrongAnswer,
  onAnswer,
}) {
  const [round, setRound] = useState(() => createQuizRound(vocabulary, optionVocabulary));
  const { question: currentQuestion, options } = round;
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [celebrationTrigger, setCelebrationTrigger] = useState(0);
  const isFirstRenderRef = useRef(true);
  const nextQuestionTimer = useRef(null);

  const generateQuestion = useCallback(() => {
    setRound(createQuizRound(vocabulary, optionVocabulary));
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
      onWrongAnswer?.(currentQuestion.id);
    }
    onAnswer?.(correct, { wordId: currentQuestion.id, word: currentQuestion.word, meaning: currentQuestion.meaning, selectedWordId: word.id });

    if (nextQuestionTimer.current) {
      clearTimeout(nextQuestionTimer.current);
    }

    nextQuestionTimer.current = setTimeout(() => {
      generateQuestion();
    }, 1600);
  };

  if (!currentQuestion) {
    return (
      <LoadingState title="正在加载词库…" />
    );
  }

  const accuracy = questionCount > 0 ? Math.round((score / questionCount) * 100) : 0;

  return (
    <div className="test-question-stage">
      <CorrectAnswerCelebration trigger={celebrationTrigger} />

      <section className="learn-refresh-card learn-refresh-card-enter quiz-refresh-card">
        <header className="assessment-refresh-top">
          <p className="assessment-refresh-prompt">请选择正确释义</p>
          {sourceLabel && <div className="assessment-refresh-source">
            <span>{sourceLabel}</span>
          </div>}
        </header>

        <section className="quiz-refresh-question" aria-label="当前题目">
          <h2 className="quiz-refresh-word" style={{ '--quiz-word-length': Math.max(8, currentQuestion.word.length) }}>{currentQuestion.word}</h2>
          <div className="learn-refresh-phonetic-row">
            <p className="learn-refresh-phonetic">{currentQuestion.phonetic || 'N/A'}</p>
            <button
              type="button"
              className="learn-refresh-inline-audio"
              onClick={() => speakWord(currentQuestion, { rate: 1 })}
              aria-label="播放发音"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 9v6h4l5 4V5L7 9H3z" />
                <path d="M16.5 8.5a4.5 4.5 0 010 7" />
                <path d="M19.5 6a8 8 0 010 12" />
              </svg>
            </button>
          </div>
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
                  <p className="learn-refresh-quiz-option-meaning">{option.meaning}</p>
                </div>
              </button>
            );
          })}
        </div>

        {selectedAnswer && (
          <div
            className={`quiz-refresh-result ${
              isCorrect ? 'quiz-refresh-result--correct' : 'quiz-refresh-result--wrong'
            }`}
          >
            {isCorrect ? '回答正确。' : `回答错误，正确答案：${currentQuestion.meaning}`}
          </div>
        )}
      </section>

      <footer className="learn-refresh-assessment-dock">
        <div className="learn-refresh-assessment-dock-inner">
          <div className="learn-refresh-assessment-stat">
            <span className="learn-refresh-assessment-stat-label">本轮答对</span>
            <span className="learn-refresh-assessment-stat-value">{score}</span>
          </div>
          <div className="learn-refresh-assessment-stat">
            <span className="learn-refresh-assessment-stat-label">本轮连击</span>
            <span className="learn-refresh-assessment-stat-value">{streak}</span>
          </div>
          <div className="learn-refresh-assessment-stat">
            <span className="learn-refresh-assessment-stat-label">本轮正确率</span>
            <span className="learn-refresh-assessment-stat-value">{accuracy}%</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Quiz;
