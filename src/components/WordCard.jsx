import LoadingState from './ui/LoadingState';
import { useEffect, useState } from 'react';
import { useWordBookmarks } from '../context/word-bookmarks-context';
import { getWordMeaningLine } from '../utils/wordHintPresentation.js';
import { useWordHints } from '../hooks/useWordHints.js';
import { useWordDetails } from '../hooks/useWordDetails.js';
import { loadWordDetails } from '../data/vocabulary.js';
import { speakExample, speakWord } from '../utils/speech';
import '../styles/study-word.css';

function WordCard({ word: entry, nextWord, showHint = false }) {
  const { word, loading: exampleLoading, error: exampleError, retry: retryExample } = useWordDetails(entry);
  const bookmarks = useWordBookmarks();
  const [notice, setNotice] = useState(null);
  const isSaved = Boolean(bookmarks?.entries?.[String(word?.id)]?.saved);
  const { hints, status: hintStatus, loading: hintLoading, error: hintError, retry: retryHints } = useWordHints(word, { enabled: showHint });
  useEffect(() => {
    if (word && !exampleLoading && !exampleError && nextWord) void loadWordDetails(nextWord).catch(() => {});
  }, [word, nextWord, exampleLoading, exampleError]);
  const toggleSaved = () => {
    try {
      bookmarks.toggle(word.id, !isSaved);
      setNotice({ wordId: word.id, error: false, text: isSaved ? '已取消收藏。' : bookmarks.ownerId === 'guest' ? '已收藏到当前设备。' : '已收藏到本机，云同步状态可在账号面板查看。' });
    } catch {
      setNotice({ wordId: word.id, error: true, text: '收藏未保存，请检查浏览器存储权限或账号状态后重试。' });
    }
  };

  if (!word) {
    return (
      <article className="learn-refresh-card learn-refresh-card-enter">
        <p className="learn-refresh-empty">当前没有可学习的单词，请先选择词库。</p>
      </article>
    );
  }

  const meaningLine = getWordMeaningLine(word);
  const wordFitLength = Math.max(String(word.word || '').trim().length, 1);

  return (
    <article className="learn-refresh-card learn-refresh-word-card learn-refresh-card-enter" aria-live="polite">
      <button
        type="button"
        className={`learn-refresh-save-word ${isSaved ? 'is-saved' : ''}`}
        aria-label={isSaved ? '取消收藏单词' : '收藏单词'}
        aria-pressed={isSaved}
        disabled={!bookmarks?.toggle || bookmarks.disabled}
        onClick={toggleSaved}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8L12 4Z" />
        </svg>
      </button>

      {bookmarks?.onOpen && <button type="button" className="learn-refresh-bookmarks-link" onClick={bookmarks.onOpen}>我的收藏</button>}
      {notice?.wordId === word.id && <p className="learn-refresh-bookmark-notice" role={notice.error ? 'alert' : 'status'}>{notice.text}</p>}

      <header className="learn-refresh-word-block">
        <h1 className="learn-refresh-word" style={{ '--word-fit-length': wordFitLength }}>{word.word}</h1>
        <div className="learn-refresh-phonetic-row">
          <p className="learn-refresh-phonetic">{word.phonetic || '暂无音标'}</p>
          <button
            type="button"
            className="learn-refresh-inline-audio"
            aria-label="播放发音"
            onClick={() => speakWord(word, { rate: 1 })}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 9v6h4l5 4V5L7 9H3z" />
              <path d="M16.5 8.5a4.5 4.5 0 010 7" />
              <path d="M19.5 6a8 8 0 010 12" />
            </svg>
          </button>
        </div>
      </header>

      <p className="learn-refresh-meaning">{meaningLine || '暂无释义'}</p>

      <section className="learn-refresh-example-block" aria-label="例句">
        <div className="learn-refresh-example-head">
          <span className="learn-refresh-example-label">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 4h11a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
              <path d="M8 8h7" />
              <path d="M8 12h5" />
            </svg>
            例句
          </span>
          <button
            type="button"
            className="learn-refresh-example-audio"
            onClick={() => speakExample(word, { rate: 1 })}
            disabled={!word.example}
            aria-label="播放例句"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 9v6h4l5 4V5L7 9H3z" />
              <path d="M16.5 8.5a4.5 4.5 0 0 1 0 7" />
            </svg>
            <span>播放例句</span>
          </button>
        </div>
        {exampleLoading ? <LoadingState variant="inline" className="learn-refresh-hint-scope" title="正在加载例句…" />
          : exampleError ? <><p className="learn-refresh-hint-scope" role="status">例句暂时无法加载，当前词义仍可学习。</p><button type="button" className="learn-refresh-example-audio" onClick={retryExample}>重试加载例句</button></>
          : <><p className="learn-refresh-example-en">{word.example || '暂无英文例句。'}</p><p className="learn-refresh-example-cn">{word.exampleCn || '暂无中文例句。'}</p></>}
      </section>

      <section className={`learn-refresh-expandable ${showHint ? 'is-open' : ''}`} aria-hidden={!showHint} inert={!showHint}>
        <div className="learn-refresh-expandable-inner">
          <h2 className="learn-refresh-expandable-title">学习提示</h2>
          {hintLoading ? <LoadingState variant="inline" className="learn-refresh-hint-scope" title={hintStatus} /> : hintStatus && <p className="learn-refresh-hint-scope" role="status">{hintStatus}</p>}
          {hintError && <button type="button" className="learn-refresh-example-audio" onClick={retryHints}>重试加载提示</button>}
          {hints.map((hint, index) => (
            <div key={hint.label} className="learn-refresh-hint-item" style={{ '--hint-index': index }}>
              <span className="learn-refresh-hint-label">{hint.label}</span>
              {hint.scope && <p className="learn-refresh-hint-scope">适用：{hint.scope}</p>}
              <p className="learn-refresh-hint-text">
                {hint.emphasis
                  ? <><strong>{hint.emphasis}</strong>{hint.text.slice(hint.emphasis.length)}</>
                  : hint.text}
              </p>
              {hint.examples?.map((example) => (
                <p className="learn-refresh-hint-example" key={example.en}>
                  <span lang="en">{(example.parts || [{ text: example.en, highlighted: false }]).map((part, partIndex) =>
                    part.highlighted ? <strong key={partIndex}>{part.text}</strong> : part.text
                  )}</span><br />
                  <span>{example.zh}</span>
                </p>
              ))}
              {hint.sources?.length > 0 && <div className="learn-refresh-hint-sources" aria-label={`${hint.label}参考来源`}>
                <span>参考</span>
                {hint.sources.map((source) => <a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>)}
              </div>}
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}

export default WordCard;
