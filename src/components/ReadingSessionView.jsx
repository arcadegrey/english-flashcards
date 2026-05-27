import { useEffect, useMemo, useRef, useState } from 'react';
import QuickMenu from './QuickMenu';
import { speak, speakWord } from '../utils/speech';
import { isEnglishWordToken, resolveVocabularyWord, tokenizeReadingText } from '../utils/readingText';
import { gsap, prefersReducedMotion, useGSAP } from '../utils/gsapMotion';

const normalizeQuestionOption = (option, index) => {
  if (typeof option === 'string') {
    return {
      id: String.fromCharCode(65 + index),
      label: option,
    };
  }

  return {
    id: String(option?.id || option?.key || option?.value || String.fromCharCode(65 + index)),
    label: String(option?.label || option?.text || option?.value || ''),
  };
};

const normalizeReadingQuestions = (questions) => {
  if (!Array.isArray(questions)) return [];

  return questions
    .map((question, index) => {
      const options = Array.isArray(question?.options)
        ? question.options.map((option, optionIndex) => normalizeQuestionOption(option, optionIndex))
        : [];

      return {
        id: String(question?.id || `q-${index + 1}`),
        prompt: String(question?.prompt || question?.question || '').trim(),
        options: options.filter((option) => option.label),
        answer: String(question?.answer || question?.correctAnswer || '').trim(),
        explanation: String(question?.explanation || '').trim(),
      };
    })
    .filter((question) => question.prompt && question.options.length > 0);
};

function ReadingSessionView({
  article,
  mode = 'learn',
  onBack,
  onHome,
  onOpenMode,
  masteredWords = [],
  wordLookup,
  onMarkAsLearned,
  onMarkAsMastered,
  onSyncAccount,
}) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [activeWord, setActiveWord] = useState(null);
  const [questionAnswersByArticle, setQuestionAnswersByArticle] = useState({});
  const [toast, setToast] = useState('');
  const wordModalRef = useRef(null);
  const masteredWordSet = useMemo(
    () => new Set((masteredWords || []).map((item) => String(item))),
    [masteredWords]
  );
  const readingQuestions = useMemo(
    () => normalizeReadingQuestions(article?.questions),
    [article?.questions]
  );
  const questionAnswerKey = String(article?.id || 'unknown');
  const questionAnswers = questionAnswersByArticle[questionAnswerKey] || {};

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 1600);
    return () => clearTimeout(timer);
  }, [toast]);

  useGSAP(() => {
    if (!activeWord || prefersReducedMotion()) return;
    const layer = wordModalRef.current;
    if (!layer) return;

    const mask = layer.querySelector('.reading-word-modal-mask');
    const modal = layer.querySelector('.reading-word-modal');

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    tl.fromTo(mask, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.18 })
      .fromTo(
        modal,
        { y: 18, scale: 0.975, autoAlpha: 0 },
        { y: 0, scale: 1, autoAlpha: 1, duration: 0.32, clearProps: 'transform,opacity,visibility' },
        0.03
      );
  }, { dependencies: [activeWord?.id], scope: wordModalRef, revertOnUpdate: true });

  const readingStats = useMemo(() => {
    const tokens = tokenizeReadingText(article?.content || '');
    const uniqueWordIds = new Set();

    tokens.forEach((token) => {
      if (!isEnglishWordToken(token)) return;
      const matchedWord = resolveVocabularyWord(token, wordLookup);
      if (!matchedWord?.id) return;
      uniqueWordIds.add(String(matchedWord.id));
    });

    const totalTracked = uniqueWordIds.size;
    let masteredCount = 0;
    uniqueWordIds.forEach((id) => {
      if (masteredWordSet.has(id)) masteredCount += 1;
    });

    return {
      totalTracked,
      masteredCount,
      unmasteredCount: Math.max(totalTracked - masteredCount, 0),
    };
  }, [article?.content, masteredWordSet, wordLookup]);

  const handleSpeakArticle = () => {
    if (!article?.content) return;
    speak(article.content, { rate: 1 });
  };

  const handleSyncAccount = async () => {
    if (typeof onSyncAccount !== 'function') {
      setToast('当前页面暂不可同步');
      return;
    }

    setToast('正在同步账号...');
    try {
      const result = await onSyncAccount();
      setToast(result?.message || '同步请求已完成');
    } catch (error) {
      setToast(error?.message || '同步失败，请稍后重试');
    }
  };

  const handleSpeakActiveWord = () => {
    if (!activeWord?.word) return;
    speakWord(activeWord, { rate: 1 });
  };

  const handleMarkUnknown = () => {
    if (!activeWord?.id) return;
    onMarkAsLearned?.(activeWord.id);
    setToast(`已加入已学习：${activeWord.word}`);
  };

  const handleMarkKnown = () => {
    if (!activeWord?.id) return;
    onMarkAsMastered?.(activeWord.id);
    setToast(`已标记掌握：${activeWord.word}`);
  };

  const handleSelectQuestionOption = (questionId, optionId, answer) => {
    setQuestionAnswersByArticle((prev) => ({
      ...prev,
      [questionAnswerKey]: {
        ...(prev[questionAnswerKey] || {}),
        [questionId]: {
          selected: optionId,
          isCorrect: answer ? optionId.toLowerCase() === answer.toLowerCase() : null,
        },
      },
    }));
  };

  const contentBlocks = useMemo(() => {
    const paragraphs = String(article?.content || '')
      .split(/\n{2,}/)
      .map((item) => item.trim())
      .filter(Boolean);

    return paragraphs.map((paragraph, paragraphIndex) => {
      const tokens = tokenizeReadingText(paragraph);
      return (
        <p key={`p-${paragraphIndex}`} className="reading-session-paragraph">
          {tokens.map((token, tokenIndex) => {
            if (!isEnglishWordToken(token)) {
              return (
                <span key={`t-${paragraphIndex}-${tokenIndex}`} className="reading-token-plain">
                  {token}
                </span>
              );
            }

            const matchedWord = resolveVocabularyWord(token, wordLookup);
            const isHighlight = Boolean(
              matchedWord?.id && !masteredWordSet.has(String(matchedWord.id))
            );

            if (!isHighlight) {
              return (
                <span key={`t-${paragraphIndex}-${tokenIndex}`} className="reading-token-plain">
                  {token}
                </span>
              );
            }

            return (
              <button
                key={`t-${paragraphIndex}-${tokenIndex}`}
                type="button"
                className="reading-token-highlight"
                onClick={() => setActiveWord(matchedWord)}
              >
                {token}
              </button>
            );
          })}
        </p>
      );
    });
  }, [article?.content, masteredWordSet, wordLookup]);

  if (!article) {
    return (
      <div className="learn-refresh-page">
        <main className="learn-refresh-main">
          <article className="learn-refresh-card learn-refresh-card-enter">
            <p className="learn-refresh-empty">未找到阅读文章，请返回阅读列表重试。</p>
          </article>
        </main>
      </div>
    );
  }

  return (
    <div className="learn-refresh-page">
      <header className="learn-refresh-topbar">
        <div className="learn-refresh-topbar-inner">
          <div className="learn-refresh-left-actions">
            <button type="button" className="learn-refresh-back" onClick={onBack} aria-label="返回阅读列表">
              <span aria-hidden="true">←</span>
              <span>返回</span>
            </button>
            <button type="button" className="learn-refresh-home-btn" onClick={onHome} aria-label="回到首页">
              <span aria-hidden="true">🏠</span>
            </button>
          </div>

          <div className="learn-refresh-progress">
            <p className="learn-refresh-progress-main">
              {readingStats.masteredCount} / {readingStats.totalTracked}
            </p>
            <p className="learn-refresh-progress-sub">难词掌握</p>
          </div>

          <div className="learn-refresh-top-actions">
            <button
              type="button"
              className="learn-refresh-icon-btn"
              onClick={handleSyncAccount}
              aria-label="同步账号"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 6v5h-5" />
                <path d="M4 18v-5h5" />
                <path d="M6.2 9A7 7 0 0118.5 7.5L20 11" />
                <path d="M17.8 15A7 7 0 015.5 16.5L4 13" />
              </svg>
            </button>
            <button
              type="button"
              className="learn-refresh-icon-btn"
              onClick={handleSpeakArticle}
              aria-label="朗读全文"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 9v6h4l5 4V5L7 9H3z" />
                <path d="M16.5 8.5a4.5 4.5 0 010 7" />
                <path d="M19.5 6a8 8 0 010 12" />
              </svg>
            </button>

            <QuickMenu
              mode={mode}
              onOpenMode={onOpenMode}
              onOpenReading={onBack}
              onSlowSpeechChange={setToast}
            />
          </div>
        </div>
      </header>

      <main className="learn-refresh-main reading-session-main">
        <section className="learn-refresh-card learn-refresh-card-enter reading-session-card">
          <header className="reading-session-header">
            <h1 className="reading-session-title">{article.title}</h1>
            <div className="reading-session-meta">
              <span className="reading-session-chip">{article.level || 'B1'}</span>
              <span className="reading-session-chip">{article.estimatedMinutes || 1} 分钟</span>
              <span className="reading-session-chip">{readingStats.unmasteredCount} 个未掌握词</span>
              {readingQuestions.length > 0 && (
                <span className="reading-session-chip">{readingQuestions.length} 道阅读题</span>
              )}
            </div>
          </header>

          <section className="reading-session-content">{contentBlocks}</section>

          {article.translation && (
            <section className="learn-refresh-example-block reading-session-translation">
              <div className="learn-refresh-example-head">
                <span className="learn-refresh-example-label">全文翻译</span>
                <button
                  type="button"
                  onClick={() => setShowTranslation((prev) => !prev)}
                  className="learn-refresh-example-audio"
                >
                  {showTranslation ? '收起翻译' : '显示翻译'}
                </button>
              </div>
              {showTranslation && <p className="learn-refresh-example-cn">{article.translation}</p>}
            </section>
          )}

          {readingQuestions.length > 0 && (
            <section className="reading-question-section" aria-label="阅读题">
              <div className="reading-question-head">
                <h2 className="reading-question-title">阅读题</h2>
                <p className="reading-question-sub">根据文章选择最合适的答案。</p>
              </div>

              <div className="reading-question-list">
                {readingQuestions.map((question, questionIndex) => {
                  const answerState = questionAnswers[question.id];

                  return (
                    <article key={question.id} className="reading-question-card">
                      <p className="reading-question-prompt">
                        {questionIndex + 1}. {question.prompt}
                      </p>
                      <div className="reading-question-options">
                        {question.options.map((option) => {
                          const isSelected = answerState?.selected === option.id;
                          const isCorrectAnswer =
                            Boolean(question.answer) &&
                            option.id.toLowerCase() === question.answer.toLowerCase();

                          return (
                            <button
                              key={option.id}
                              type="button"
                              className={[
                                'reading-question-option',
                                isSelected ? 'is-selected' : '',
                                isSelected && answerState?.isCorrect === true ? 'is-correct' : '',
                                isSelected && answerState?.isCorrect === false ? 'is-wrong' : '',
                                answerState && isCorrectAnswer ? 'is-answer' : '',
                              ]
                                .filter(Boolean)
                                .join(' ')}
                              onClick={() =>
                                handleSelectQuestionOption(question.id, option.id, question.answer)
                              }
                            >
                              <span className="reading-question-option-key">{option.id}</span>
                              <span>{option.label}</span>
                            </button>
                          );
                        })}
                      </div>
                      {answerState && question.answer && (
                        <p className="reading-question-feedback">
                          {answerState.isCorrect ? '回答正确' : `正确答案：${question.answer}`}
                          {question.explanation ? `。${question.explanation}` : ''}
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          )}
        </section>
      </main>

      {activeWord && (
        <div ref={wordModalRef} className="reading-word-modal-layer" role="dialog" aria-modal="true" aria-label="单词详情">
          <button
            type="button"
            className="reading-word-modal-mask"
            aria-label="关闭单词详情"
            onClick={() => setActiveWord(null)}
          />
          <section className="reading-word-modal learn-refresh-card learn-refresh-card-enter">
            <div className="reading-word-modal-head">
              <h2 className="learn-refresh-word">{activeWord.word}</h2>
              <button
                type="button"
                className="learn-refresh-inline-audio"
                onClick={handleSpeakActiveWord}
                aria-label="播放发音"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 9v6h4l5 4V5L7 9H3z" />
                  <path d="M16.5 8.5a4.5 4.5 0 010 7" />
                  <path d="M19.5 6a8 8 0 010 12" />
                </svg>
              </button>
            </div>
            <p className="learn-refresh-phonetic">{activeWord.phonetic || '暂无音标'}</p>
            <p className="learn-refresh-meaning">
              {[activeWord.pos, activeWord.meaning].filter(Boolean).join(' ')}
            </p>
            <section className="learn-refresh-example-block">
              <div className="learn-refresh-example-head">
                <span className="learn-refresh-example-label">例句</span>
              </div>
              <p className="learn-refresh-example-en">{activeWord.example || '暂无英文例句。'}</p>
              <p className="learn-refresh-example-cn">{activeWord.exampleCn || '暂无中文例句。'}</p>
            </section>
            <div className="reading-word-modal-actions">
              <button
                type="button"
                className="learn-refresh-action learn-refresh-action-secondary"
                onClick={handleMarkUnknown}
              >
                不认识
              </button>
              <button
                type="button"
                className="learn-refresh-action learn-refresh-action-primary"
                onClick={handleMarkKnown}
              >
                认识了
              </button>
            </div>
          </section>
        </div>
      )}

      {toast && (
        <div className="learn-refresh-toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}

    </div>
  );
}

export default ReadingSessionView;
