import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { playSuccessChime } from '../utils/feedback';
import CorrectAnswerCelebration from './CorrectAnswerCelebration';

const ROUND_SIZE = 5;

const shuffle = (list = []) => [...list].sort(() => Math.random() - 0.5);

const createMatchingRound = (vocabulary = []) => {
  const candidates = Array.isArray(vocabulary)
    ? vocabulary.filter((item) => item?.id != null && item?.word && item?.meaning)
    : [];

  if (candidates.length < 2) {
    return {
      error: '当前范围至少需要 2 个带释义的单词，才能生成连线题。',
      words: [],
      meanings: [],
    };
  }

  const words = shuffle(candidates).slice(0, Math.min(ROUND_SIZE, candidates.length));
  return {
    error: '',
    words,
    meanings: shuffle(words),
  };
};

function MatchingTest({ vocabulary, sourceLabel = '', onWrongAnswer, onCorrectAnswer }) {
  const initialRound = createMatchingRound(vocabulary);
  const [words, setWords] = useState(() => initialRound.words);
  const [meanings, setMeanings] = useState(() => initialRound.meanings);
  const [roundError, setRoundError] = useState(() => initialRound.error);
  const [selectedWordId, setSelectedWordId] = useState(null);
  const [matchedIds, setMatchedIds] = useState([]);
  const [wrongPair, setWrongPair] = useState(null);
  const [score, setScore] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [celebrationTrigger, setCelebrationTrigger] = useState(0);
  const isFirstRenderRef = useRef(true);
  const wrongPairTimerRef = useRef(null);

  const matchedIdSet = useMemo(() => new Set(matchedIds.map(String)), [matchedIds]);

  const generateRound = useCallback(() => {
    const nextRound = createMatchingRound(vocabulary);
    setWords(nextRound.words);
    setMeanings(nextRound.meanings);
    setRoundError(nextRound.error);
    setSelectedWordId(null);
    setMatchedIds([]);
    setWrongPair(null);
  }, [vocabulary]);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return undefined;
    }

    const initTimer = setTimeout(() => {
      generateRound();
    }, 0);

    return () => clearTimeout(initTimer);
  }, [generateRound]);

  useEffect(
    () => () => {
      if (wrongPairTimerRef.current) {
        clearTimeout(wrongPairTimerRef.current);
      }
    },
    []
  );

  const handleSelectWord = (wordId) => {
    if (matchedIdSet.has(String(wordId))) return;
    setSelectedWordId((prev) => (String(prev) === String(wordId) ? null : wordId));
    setWrongPair(null);
  };

  const handleSelectMeaning = (meaningWord) => {
    if (!selectedWordId || matchedIdSet.has(String(meaningWord.id))) return;

    const correct = String(selectedWordId) === String(meaningWord.id);
    setAttemptCount((prev) => prev + 1);

    if (correct) {
      setMatchedIds((prev) => [...prev, meaningWord.id]);
      setSelectedWordId(null);
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      setCelebrationTrigger((prev) => prev + 1);
      playSuccessChime();
      onCorrectAnswer?.(meaningWord.id);
      return;
    }

    setStreak(0);
    setWrongPair({ wordId: selectedWordId, meaningId: meaningWord.id });
    onWrongAnswer?.(selectedWordId);

    if (wrongPairTimerRef.current) {
      clearTimeout(wrongPairTimerRef.current);
    }
    wrongPairTimerRef.current = setTimeout(() => {
      setWrongPair(null);
    }, 900);
  };

  if (roundError) {
    return (
      <div className="learn-refresh-empty-state learn-refresh-empty-state--error">
        {roundError}
      </div>
    );
  }

  const isRoundComplete = words.length > 0 && matchedIds.length === words.length;
  const accuracy = attemptCount > 0 ? Math.round((score / attemptCount) * 100) : 0;

  return (
    <div className="space-y-4 pb-[108px] md:space-y-5 md:pb-[124px]">
      <CorrectAnswerCelebration trigger={celebrationTrigger} />

      <section className="learn-refresh-card learn-refresh-card-enter matching-refresh-card">
        <header className="assessment-refresh-top">
          <p className="assessment-refresh-prompt">点击单词，再点击对应释义</p>
          {sourceLabel && (
            <div className="assessment-refresh-source">
              <span>{sourceLabel}</span>
            </div>
          )}
        </header>

        <div className="matching-refresh-board">
          <div className="matching-refresh-column" aria-label="单词列表">
            <p className="matching-refresh-column-title">单词</p>
            {words.map((word, index) => {
              const isSelected = String(selectedWordId) === String(word.id);
              const isMatched = matchedIdSet.has(String(word.id));
              const isWrong = String(wrongPair?.wordId) === String(word.id);

              return (
                <button
                  key={word.id}
                  type="button"
                  onClick={() => handleSelectWord(word.id)}
                  disabled={isMatched}
                  className={`matching-refresh-item matching-refresh-word ${
                    isMatched ? 'is-matched' : ''
                  } ${isWrong ? 'is-wrong' : ''} ${isSelected ? 'is-selected' : ''}`}
                >
                  <span className="matching-refresh-index">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="matching-refresh-word-main">{word.word}</span>
                  <span className="matching-refresh-word-sub">{word.phonetic || 'N/A'}</span>
                </button>
              );
            })}
          </div>

          <div className="matching-refresh-column" aria-label="释义列表">
            <p className="matching-refresh-column-title">释义</p>
            {meanings.map((word, index) => {
              const isMatched = matchedIdSet.has(String(word.id));
              const isWrong = String(wrongPair?.meaningId) === String(word.id);

              return (
                <button
                  key={word.id}
                  type="button"
                  onClick={() => handleSelectMeaning(word)}
                  disabled={!selectedWordId || isMatched}
                  className={`matching-refresh-item matching-refresh-meaning ${
                    isMatched ? 'is-matched' : ''
                  } ${isWrong ? 'is-wrong' : ''} ${selectedWordId ? 'is-ready' : ''}`}
                >
                  <span className="matching-refresh-index">
                    {index + 1}
                  </span>
                  <span className="matching-refresh-meaning-main">{word.meaning}</span>
                </button>
              );
            })}
          </div>
        </div>

        {isRoundComplete && (
          <div className="matching-refresh-complete">
            <p>本轮全部配对完成。</p>
            <button
              type="button"
              onClick={generateRound}
              className="spelling-refresh-primary"
            >
              下一组
            </button>
          </div>
        )}
      </section>

      <footer className="learn-refresh-assessment-dock">
        <div className="learn-refresh-assessment-dock-inner">
          <div className="learn-refresh-assessment-stat">
            <span className="learn-refresh-assessment-stat-label">配对</span>
            <span className="learn-refresh-assessment-stat-value">
              {matchedIds.length}/{words.length}
            </span>
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

export default MatchingTest;
