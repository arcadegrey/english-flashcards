import { useMemo } from 'react';
import { LoadingAnimation } from '../../ui/LoadingState';
import { isEnglishWordToken, resolveVocabularyWord, tokenizeReadingText } from '../../../utils/readingText';

export default function ReadingArticle({
  article, articleMinutes, readingStats, questionCount, paragraphs, masteredWordSet, wordLookup,
  sentencePlayback, showTranslation, onToggleTranslation, onSelectWord,
}) {
  const { sentenceId: activeSentenceId, status: speechStatus, toggle: toggleSentence, stop: stopSentence } = sentencePlayback;
  const activeSentence = paragraphs.flatMap(paragraph => paragraph.sentences).find(sentence => sentence.id === activeSentenceId);
  const contentBlocks = useMemo(() => {
    return paragraphs.map((paragraph) => {
      return (
        <p key={paragraph.id} className="reading-session-paragraph">
          {paragraph.sentences.map(sentence => (
            <span key={sentence.id}
              className={`reading-session-sentence${activeSentenceId === sentence.id ? ' is-active' : ''}`}>
              <span className="reading-sentence-text">
                {tokenizeReadingText(sentence.text).map((token, tokenIndex) => {
                  if (!isEnglishWordToken(token)) {
                    return <span key={tokenIndex} className="reading-token-plain">{token}</span>;
                  }

                  const matchedWord = resolveVocabularyWord(token, wordLookup);
                  const isHighlight = Boolean(
                    matchedWord?.id && !masteredWordSet.has(String(matchedWord.id))
                  );
                  if (!isHighlight) {
                    return <span key={tokenIndex} className="reading-token-plain">{token}</span>;
                  }

                  return (
                    <button key={tokenIndex} type="button" className="reading-token-highlight"
                      onClick={() => { stopSentence(); onSelectWord(matchedWord); }}>
                      {token}
                    </button>
                  );
                })}
              </span>
              <button type="button" className="learn-refresh-example-audio reading-sentence-play"
                aria-label={`${activeSentenceId === sentence.id ? '停止朗读' : '朗读'}第 ${sentence.ordinal} 句`}
                title={`${activeSentenceId === sentence.id ? '停止朗读' : '朗读'}第 ${sentence.ordinal} 句`}
                aria-pressed={activeSentenceId === sentence.id}
                onClick={() => { void toggleSentence(sentence); }}
              >
                {activeSentenceId === sentence.id && speechStatus === 'preparing' ? <LoadingAnimation compact />
                  : activeSentenceId === sentence.id ? <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="2" /></svg>
                  : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 10 7-10 7Z" /></svg>}
              </button>
            </span>
          ))}
        </p>
      );
    });
  }, [paragraphs, masteredWordSet, wordLookup, activeSentenceId, speechStatus, toggleSentence, stopSentence, onSelectWord]);

  return (
    <>
      <header className="reading-session-header">
        <h1 className="reading-session-title">{article.title}</h1>
        <div className="reading-session-meta">
          <span className="reading-session-chip">{article.level || 'B1'}</span>
          <span className="reading-session-chip">{articleMinutes} 分钟</span>
          <span className="reading-session-chip">{readingStats.unmasteredCount} 个未标记认识词</span>
          {questionCount > 0 && (
            <span className="reading-session-chip">{questionCount} 道阅读题</span>
          )}
        </div>
      </header>

      <section className="reading-session-content">
        <p className="reading-speech-status" role={sentencePlayback.error ? 'alert' : 'status'} aria-live="polite">
          {sentencePlayback.error || (activeSentence ? `${speechStatus === 'preparing' ? '正在准备' : '正在朗读'}第 ${activeSentence.ordinal} 句，点击同一按钮可停止。`
            : '点击句末的朗读按钮，每次播放一句。')}
        </p>
        {contentBlocks}
      </section>

      {article.translation && (
        <section className="learn-refresh-example-block reading-session-translation">
          <div className="learn-refresh-example-head">
            <span className="learn-refresh-example-label">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z" />
                <path d="M9 8h5" />
                <path d="M9 12h6" />
              </svg>
              全文翻译
            </span>
            <button
              type="button"
              onClick={() => onToggleTranslation()}
              className="learn-refresh-example-audio"
            >
              {showTranslation ? '收起翻译' : '显示翻译'}
            </button>
          </div>
          {showTranslation && <p className="learn-refresh-example-cn">{article.translation}</p>}
        </section>
      )}
    </>
  );
}
