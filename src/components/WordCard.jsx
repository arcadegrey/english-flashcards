import { useMemo, useState } from 'react';
import { speakExample, speakWord } from '../utils/speech';

function WordCard({ word, showHint = false }) {
  const [isSaved, setIsSaved] = useState(false);
  const hints = useMemo(() => {
    if (!word) {
      return {
        synonymHint: '暂无近义词数据',
        rootHint: '暂无词根词缀数据',
        extraExampleHint: '暂无更多例句数据',
      };
    }

    const meaningParts = String(word.meaning || '')
      .split(/[；;，,、]/)
      .map((item) => item.trim())
      .filter(Boolean);

    const synonymHint = meaningParts.length > 1 ? meaningParts.slice(0, 2).join(' / ') : '暂无近义词数据';

    const cleanWord = String(word.word || '').replace(/[^a-zA-Z]/g, '');
    const rootHint =
      cleanWord.length >= 6
        ? `可拆分记忆：${cleanWord.slice(0, 3)} + ${cleanWord.slice(3)}`
        : '暂无词根词缀数据';

    const extraExampleHint = word.example
      ? '尝试改写例句主语（I / We / They）并朗读一遍。'
      : '暂无更多例句数据';

    return { synonymHint, rootHint, extraExampleHint };
  }, [word]);

  if (!word) {
    return (
      <article className="learn-refresh-card learn-refresh-card-enter">
        <p className="learn-refresh-empty">当前没有可学习的单词，请先选择词库。</p>
      </article>
    );
  }

  const meaningLine = word.pos ? `${word.pos} ${word.meaning}` : word.meaning;

  return (
    <article className="learn-refresh-card learn-refresh-word-card learn-refresh-card-enter" aria-live="polite">
      <button
        type="button"
        className={`learn-refresh-save-word ${isSaved ? 'is-saved' : ''}`}
        aria-label={isSaved ? '取消收藏单词' : '收藏单词'}
        aria-pressed={isSaved}
        onClick={() => setIsSaved((value) => !value)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8L12 4Z" />
        </svg>
      </button>

      <header className="learn-refresh-word-block">
        <h1 className="learn-refresh-word">{word.word}</h1>
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
        <p className="learn-refresh-example-en">{word.example || '暂无英文例句。'}</p>
        <p className="learn-refresh-example-cn">{word.exampleCn || '暂无中文例句。'}</p>
      </section>

      <section className={`learn-refresh-expandable ${showHint ? 'is-open' : ''}`}>
        <div className="learn-refresh-expandable-inner">
          <h2 className="learn-refresh-expandable-title">学习提示</h2>
          <div className="learn-refresh-hint-item" style={{ '--hint-index': 0 }}>
            <span className="learn-refresh-hint-label">近义提示</span>
            <p className="learn-refresh-hint-text">{hints.synonymHint}</p>
          </div>
          <div className="learn-refresh-hint-item" style={{ '--hint-index': 1 }}>
            <span className="learn-refresh-hint-label">词根词缀</span>
            <p className="learn-refresh-hint-text">{hints.rootHint}</p>
          </div>
          <div className="learn-refresh-hint-item" style={{ '--hint-index': 2 }}>
            <span className="learn-refresh-hint-label">更多练习</span>
            <p className="learn-refresh-hint-text">{hints.extraExampleHint}</p>
          </div>
        </div>
      </section>
    </article>
  );
}

export default WordCard;
