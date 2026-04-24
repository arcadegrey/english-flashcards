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

  const inflectionRegex = new RegExp(`\\b${escapedWord}(s|es|ed|ing)?\\b`, 'i');
  if (inflectionRegex.test(safeExample)) {
    return safeExample.replace(inflectionRegex, BLANK_TOKEN);
  }

  return '';
};

const createFillBlankRound = (vocabulary = []) => {
  if (!Array.isArray(vocabulary) || vocabulary.length === 0) {
    return {
      error: '当前词库为空，暂时无法生成填空题。',
      question: null,
      options: [],
      sentence: '',
    };
  }

  const candidates = vocabulary.filter((item) => item?.word && item?.example);
  if (candidates.length === 0) {
    return {
      error: '当前词库缺少可用例句，暂时无法生成填空题。',
      question: null,
      options: [],
      sentence: '',
    };
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
    return {
      error: '当前例句中无法自动挖空目标词，请切换词库后重试。',
      question: null,
      options: [],
      sentence: '',
    };
  }

  const distractorPool = vocabulary.filter((item) => item.id !== selectedWord.id);
  const wrongOptions = [...distractorPool]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(3, distractorPool.length));

  return {
    error: '',
    question: selectedWord,
    options: [selectedWord, ...wrongOptions].sort(() => Math.random() - 0.5),
    sentence: hiddenSentence,
  };
};

function FillBlank({ vocabulary, sourceLabel = '', onWrongAnswer, onCorrectAnswer }) {
  const initialRound = createFillBlankRound(vocabulary);
  const [currentQuestion, setCurrentQuestion] = useState(() => initialRound.question);
  const [options, setOptions] = useState(() => initialRound.options);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [sentence, setSentence] = useState(() => initialRound.sentence);
  const [questionError, setQuestionError] = useState(() => initialRound.error);
  const [celebrationTrigger, setCelebrationTrigger] = useState(0);
  const isFirstRenderRef = useRef(true);
  const nextQuestionTimer = useRef(null);

  const generateQuestion = useCallback(() => {
    const nextRound = createFillBlankRound(vocabulary);
    setQuestionError(nextRound.error);
    setCurrentQuestion(nextRound.question);
    setOptions(nextRound.options);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setSentence(nextRound.sentence);
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
      onCorrectAnswer?.(currentQuestion.id);
    } else {
      setStreak(0);
      onWrongAnswer?.(currentQuestion.id);
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
      speak(currentQuestion.example, { rate: 1 });
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
        <p className="text-center text-sm font-medium text-[#6e6e73]">听例句并完成填空</p>

        {sourceLabel && (
          <div className="mt-3 flex justify-center">
            <span className="inline-flex rounded-full border border-[#e8e8ed] bg-[#f5f5f7] px-3 py-1 text-xs font-medium text-[#6e6e73]">
              {sourceLabel}
            </span>
          </div>
        )}

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
            className={`mt-4 rounded-[14px] border px-4 py-3 text-sm ${
              isCorrect
                ? 'border-[#b7ddc6] bg-[#f0fdf4] text-[#166534]'
                : 'border-[#fecaca] bg-[#fef2f2] text-[#b91c1c]'
            }`}
          >
            {isCorrect ? '回答正确。' : `回答错误，正确答案：${currentQuestion.word}`}
            <p className="mt-1 text-xs opacity-80">{currentQuestion.example}</p>
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
