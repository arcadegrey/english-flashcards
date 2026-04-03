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

function FillBlank({ vocabulary, sourceLabel = '' }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [sentence, setSentence] = useState('');
  const [questionError, setQuestionError] = useState('');
  const [celebrationTrigger, setCelebrationTrigger] = useState(0);
  const nextQuestionTimer = useRef(null);

  const generateQuestion = useCallback(() => {
    if (!Array.isArray(vocabulary) || vocabulary.length === 0) {
      setQuestionError('当前词库为空，暂时无法生成填空题。');
      setCurrentQuestion(null);
      setOptions([]);
      setSentence('');
      return;
    }

    const candidates = vocabulary.filter((item) => item?.word && item?.example);
    if (candidates.length === 0) {
      setQuestionError('当前词库缺少可用例句，暂时无法生成填空题。');
      setCurrentQuestion(null);
      setOptions([]);
      setSentence('');
      return;
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
      setQuestionError('当前例句中无法自动挖空目标词，请切换词库后重试。');
      setCurrentQuestion(null);
      setOptions([]);
      setSentence('');
      return;
    }

    const distractorPool = vocabulary.filter((item) => item.id !== selectedWord.id);
    const wrongOptions = [...distractorPool]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(3, distractorPool.length));

    const allOptions = [selectedWord, ...wrongOptions].sort(() => Math.random() - 0.5);

    setQuestionError('');
    setCurrentQuestion(selectedWord);
    setOptions(allOptions);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setSentence(hiddenSentence);
  }, [vocabulary]);

  useEffect(() => {
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
    } else {
      setStreak(0);
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
      speak(currentQuestion.example, { rate: 0.9 });
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
        <p className="text-center text-sm font-medium text-[#6e6e73]">听例句并完成填空</p>

        {sourceLabel && (
          <div className="mt-3 flex justify-center">
            <span className="inline-flex rounded-full border border-[#e8e8ed] bg-[#f5f5f7] px-3 py-1 text-xs font-medium text-[#6e6e73]">
              {sourceLabel}
            </span>
          </div>
        )}

        <blockquote className="mt-5 rounded-[16px] border border-[#e8e8ed] bg-[#fcfcfd] px-5 py-5 text-center text-2xl leading-[1.6] text-[#1d1d1f] md:text-3xl">
          “{sentence}”
        </blockquote>

        <p className="mt-3 text-center text-base text-[#6e6e73] md:text-lg">{currentQuestion.meaning}</p>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleSpeakSentence}
            className="inline-flex min-h-[46px] items-center gap-2 rounded-[10px] border border-[#0071e3] bg-[#0071e3] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0066ce]"
          >
            <span>🔊</span>
            <span>播放例句</span>
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
                <div>
                  <p className="break-all text-base leading-[1.5] md:text-2xl">{option.word}</p>
                  <p className="mt-1 break-all text-sm text-[#6e6e73] md:text-lg">{option.phonetic || ''}</p>
                </div>
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
          {isCorrect ? '回答正确。' : `回答错误，正确答案：${currentQuestion.word}`}
          <p className="mt-1 text-xs opacity-80">{currentQuestion.example}</p>
        </div>
      )}
    </div>
  );
}

export default FillBlank;
