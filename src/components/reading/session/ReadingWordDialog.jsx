import { useRef } from 'react';
import LoadingState from '../../ui/LoadingState';
import { useWordDetails } from '../../../hooks/useWordDetails.js';
import { gsap, prefersReducedMotion, useGSAP } from '../../../utils/gsapMotion';
import { speakWord } from '../../../utils/speech';

export default function ReadingWordDialog({ activeWord, onClose, onMarkUnknown, onMarkKnown }) {
  const activeDetails = useWordDetails(activeWord);
  const wordModalRef = useRef(null);
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

  const handleSpeak = () => {
    if (!activeWord?.word) return;
    speakWord(activeWord, { rate: 1 });
  };
  if (!activeWord) return null;
  return (
    <div ref={wordModalRef} className="reading-word-modal-layer" role="dialog" aria-modal="true" aria-label="单词详情">
      <button
        type="button"
        className="reading-word-modal-mask"
        aria-label="关闭单词详情"
        onClick={() => onClose()}
      />
      <section className="reading-word-modal learn-refresh-card learn-refresh-card-enter">
        <div className="reading-word-modal-head">
          <h2 className="learn-refresh-word">{activeWord.word}</h2>
          <button
            type="button"
            className="learn-refresh-inline-audio"
            onClick={handleSpeak}
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
          {activeDetails.loading ? <LoadingState variant="inline" className="learn-refresh-hint-scope" title="正在加载例句…" />
            : activeDetails.error ? <><p className="learn-refresh-hint-scope" role="status">例句暂时无法加载。</p><button type="button" className="learn-refresh-example-audio" onClick={activeDetails.retry}>重试加载例句</button></>
            : <><p className="learn-refresh-example-en">{activeDetails.word.example || '暂无英文例句。'}</p><p className="learn-refresh-example-cn">{activeDetails.word.exampleCn || '暂无中文例句。'}</p></>}
        </section>
        <div className="reading-word-modal-actions">
          <button
            type="button"
            className="learn-refresh-action learn-refresh-action-secondary"
            onClick={onMarkUnknown}
          >
            不认识
          </button>
          <button
            type="button"
            className="learn-refresh-action learn-refresh-action-primary"
            onClick={onMarkKnown}
          >
            认识了
          </button>
        </div>
      </section>
    </div>
  );
}
