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
  const [dragLine, setDragLine] = useState(null);
  const boardRef = useRef(null);
  const wordNodeRefs = useRef(new Map());
  const isFirstRenderRef = useRef(true);
  const wrongPairTimerRef = useRef(null);
  const dragStateRef = useRef(null);
  const suppressWordClickRef = useRef(false);

  const matchedIdSet = useMemo(() => new Set(matchedIds.map(String)), [matchedIds]);

  const generateRound = useCallback(() => {
    const nextRound = createMatchingRound(vocabulary);
    setWords(nextRound.words);
    setMeanings(nextRound.meanings);
    setRoundError(nextRound.error);
    setSelectedWordId(null);
    setMatchedIds([]);
    setWrongPair(null);
    setDragLine(null);
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
    if (suppressWordClickRef.current) {
      suppressWordClickRef.current = false;
      return;
    }

    if (matchedIdSet.has(String(wordId))) return;
    setSelectedWordId((prev) => (String(prev) === String(wordId) ? null : wordId));
    setWrongPair(null);
  };

  const handleMatchAttempt = (wordId, meaningWord) => {
    if (!wordId || matchedIdSet.has(String(wordId)) || matchedIdSet.has(String(meaningWord.id))) return;

    const correct = String(wordId) === String(meaningWord.id);
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
    setWrongPair({ wordId, meaningId: meaningWord.id });
    onWrongAnswer?.(wordId);

    if (wrongPairTimerRef.current) {
      clearTimeout(wrongPairTimerRef.current);
    }
    wrongPairTimerRef.current = setTimeout(() => {
      setWrongPair(null);
    }, 900);
  };

  const handleSelectMeaning = (meaningWord) => {
    handleMatchAttempt(selectedWordId, meaningWord);
  };

  const getBoardPoint = (clientX, clientY) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const getElementCenter = (element) => {
    const elementRect = element?.getBoundingClientRect();
    const boardRect = boardRef.current?.getBoundingClientRect();
    if (!elementRect || !boardRect) return { x: 0, y: 0 };

    return {
      x: elementRect.left + elementRect.width / 2 - boardRect.left,
      y: elementRect.top + elementRect.height / 2 - boardRect.top,
    };
  };

  const handleWordPointerDown = (event, word) => {
    if (matchedIdSet.has(String(word.id))) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    const start = getElementCenter(event.currentTarget);
    const end = getBoardPoint(event.clientX, event.clientY);
    dragStateRef.current = {
      pointerId: event.pointerId,
      wordId: word.id,
      startClientX: event.clientX,
      startClientY: event.clientY,
      active: false,
      start,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDragLine({
      wordId: word.id,
      start,
      end,
      active: false,
    });
  };

  const handleWordPointerMove = (event) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    const distance = Math.hypot(
      event.clientX - dragState.startClientX,
      event.clientY - dragState.startClientY
    );
    const active = dragState.active || distance > 6;
    dragState.active = active;

    if (active) {
      event.preventDefault();
      setSelectedWordId(dragState.wordId);
      setWrongPair(null);
    }

    setDragLine({
      wordId: dragState.wordId,
      start: dragState.start,
      end: getBoardPoint(event.clientX, event.clientY),
      active,
    });
  };

  const handleWordPointerUp = (event) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    const wasActive = dragState.active;
    dragStateRef.current = null;
    setDragLine(null);
    event.currentTarget.releasePointerCapture?.(event.pointerId);

    if (!wasActive) return;

    event.preventDefault();
    suppressWordClickRef.current = true;
    setTimeout(() => {
      suppressWordClickRef.current = false;
    }, 250);
    const target = document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest('[data-matching-meaning-id]');
    const meaningId = target?.getAttribute('data-matching-meaning-id');
    const meaningWord = meanings.find((item) => String(item.id) === String(meaningId));

    if (meaningWord) {
      handleMatchAttempt(dragState.wordId, meaningWord);
    }
  };

  const handleWordPointerCancel = (event) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    dragStateRef.current = null;
    setDragLine(null);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
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

        <div className="matching-refresh-board" ref={boardRef}>
          {dragLine && (
            <svg
              className={`matching-refresh-lines ${dragLine.active ? 'is-active' : ''}`}
              aria-hidden="true"
            >
              <line
                x1={dragLine.start.x}
                y1={dragLine.start.y}
                x2={dragLine.end.x}
                y2={dragLine.end.y}
              />
            </svg>
          )}
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
                  ref={(node) => {
                    if (node) {
                      wordNodeRefs.current.set(String(word.id), node);
                    } else {
                      wordNodeRefs.current.delete(String(word.id));
                    }
                  }}
                  onClick={() => handleSelectWord(word.id)}
                  onPointerDown={(event) => handleWordPointerDown(event, word)}
                  onPointerMove={handleWordPointerMove}
                  onPointerUp={handleWordPointerUp}
                  onPointerCancel={handleWordPointerCancel}
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
                  data-matching-meaning-id={word.id}
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
