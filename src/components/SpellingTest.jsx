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

      <section className="learn-refresh-card learn-refresh-card-enter spelling-refresh-card">
        <header className="spelling-refresh-header">
          <p className="spelling-refresh-kicker">SPELLING PRACTICE</p>
          <h1 className="spelling-refresh-title">听音拼写</h1>
          <p className="spelling-refresh-subtitle">播放发音后输入你听到的英文单词。</p>
        </header>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="spelling-refresh-panel">
            <div className="spelling-refresh-panel-head">
              <span>点击播放后输入单词</span>
              <button
                type="button"
                className="learn-refresh-example-audio"
                onClick={handleSpeak}
                aria-label="播放发音"
              >
                播放发音
              </button>
            </div>

            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(event) => setUserInput(event.target.value)}
              placeholder="输入你听到的单词..."
              className="spelling-refresh-input"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />

            <div className="spelling-refresh-actions">
              <button
                type="button"
                onClick={() => setShowHint(true)}
                disabled={showHint}
                className="spelling-refresh-secondary"
              >
                {showHint ? '已显示提示' : '显示提示'}
              </button>
              <button
                type="submit"
                disabled={!userInput.trim()}
                className="spelling-refresh-primary"
              >
                提交答案
              </button>
            </div>

            {showHint && (
              <div className="spelling-refresh-hint">
                <p className="spelling-refresh-hint-pattern">{hintPattern}</p>
                <p className="spelling-refresh-hint-meta">{currentWord.phonetic || 'N/A'}</p>
                <p className="spelling-refresh-hint-meaning">{currentWord.meaning}</p>
              </div>
            )}
          </form>
        ) : (
          <div className="spelling-refresh-panel">
            <div
              className={`spelling-refresh-result ${
                isCorrect
                  ? 'spelling-refresh-result--correct'
                  : 'spelling-refresh-result--wrong'
              }`}
            >
              {isCorrect ? '回答正确。' : `回答错误，正确答案：${currentWord.word}`}
            </div>

            <div className="spelling-refresh-answer">
              <p className="spelling-refresh-answer-word">{currentWord.word}</p>
              <p className="spelling-refresh-answer-phonetic">{currentWord.phonetic || 'N/A'}</p>
              <p className="spelling-refresh-answer-meaning">{currentWord.meaning}</p>
            </div>

            <div className="spelling-refresh-actions spelling-refresh-actions--center">
              <button
                type="button"
                onClick={handleNext}
                className="spelling-refresh-primary"
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
