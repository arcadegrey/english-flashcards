import ScheduledAssetImage from '../ui/ScheduledAssetImage.jsx';
import { useContext, useLayoutEffect, useRef, useState } from 'react';
import { HomeArtworkContext } from '../../context/home-artwork-context.js';
import { PrimaryButton } from '../ui/Buttons';
import { LinearProgress } from '../ui/Progress';
import { carouselPosition, carouselDragStep } from '../../utils/studyDashboard.js';
import '../../styles/study-dashboard.css';

function Arrow({ back = false }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={back ? 'm14 5-7 7 7 7' : 'm10 5 7 7-7 7'} /></svg>;
}

export default function StudyCarousel({
  cards,
  initialId,
  onAction,
  className = '',
  label = '学习内容预览',
  previousLabel = '上一个学习内容',
  nextLabel = '下一个学习内容',
  selectionLabel = '选择学习内容',
  previewLabel = card => `预览${card.eyebrow}`,
}) {
  const [selectedId, setSelectedId] = useState(null);
  const stage = useRef(null);
  const gesture = useRef(null);
  const suppressClick = useRef(0);
  const activeIndex = Math.max(0, cards.findIndex(card => card.id === (selectedId || initialId)));
  const active = cards[activeIndex];
  const artwork = useContext(HomeArtworkContext);
  const scheduler = artwork?.scheduler;
  const primaryToken = active?.art ? `${active.id}|${active.art}` : null;
  useLayoutEffect(() => {
    if (!scheduler) return;
    scheduler.holdPrimary(primaryToken);
    const image = stage.current?.querySelector('.is-current .study-carousel-art');
    if (image?.getAttribute('src') && image.complete) scheduler.settlePrimary(primaryToken);
    return () => scheduler.settlePrimary(primaryToken);
  }, [scheduler, primaryToken]);
  const select = index => setSelectedId(cards[(index + cards.length) % cards.length].id);
  const resetDrag = () => {
    stage.current?.style.setProperty('--study-drag-x', '0px');
    if (stage.current) delete stage.current.dataset.dragging;
    gesture.current = null;
  };
  const down = event => {
    if (cards.length < 2 || event.button > 0 || event.target.closest('button, a, input')) return;
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, distance: 0, dragging: false };
  };
  const move = event => {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    const dx = event.clientX - current.x, dy = event.clientY - current.y;
    if (!current.dragging) {
      if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) { resetDrag(); return; }
      if (Math.abs(dx) < 8) return;
      current.dragging = true;
      stage.current.setPointerCapture(event.pointerId);
      stage.current.dataset.dragging = 'true';
    }
    current.distance = dx;
    const limit = stage.current.clientWidth * 0.45;
    stage.current.style.setProperty('--study-drag-x', `${Math.max(-limit, Math.min(limit, dx))}px`);
  };
  const up = event => {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    const step = current.dragging ? carouselDragStep(current.distance, stage.current.clientWidth) : 0;
    if (current.dragging) suppressClick.current = performance.now() + 250;
    if (stage.current.hasPointerCapture(event.pointerId)) stage.current.releasePointerCapture(event.pointerId);
    resetDrag();
    if (step) select(activeIndex + step);
  };
  const keyboard = event => {
    if (event.target !== event.currentTarget || cards.length < 2) return;
    const next = { ArrowLeft: activeIndex - 1, ArrowRight: activeIndex + 1, Home: 0, End: cards.length - 1 }[event.key];
    if (next == null) return;
    event.preventDefault(); select(next);
  };

  if (!active) return null;

  return <section className={`study-carousel ${className}`.trim()} role="region" aria-roledescription="轮播" aria-label={label} tabIndex={0} onKeyDown={keyboard}>
    <div className="study-carousel-stage" ref={stage} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={resetDrag}
      onClickCapture={event => { if (performance.now() < suppressClick.current) { event.preventDefault(); event.stopPropagation(); } }}>
      {cards.map((card, index) => {
        const position = carouselPosition(index, activeIndex, cards.length);
        const isActive = index === activeIndex;
        const state = isActive ? 'is-current' : position === -1 ? 'is-previous' : position === 1 ? 'is-next' : 'is-away';
        return <article key={card.id} className={`study-carousel-card is-${card.tone} ${card.levelCode ? 'has-level-code' : ''} ${state}`} data-picker-accent={card.accent} inert={!isActive} aria-hidden={!isActive}
          role="group" aria-roledescription="幻灯片" aria-label={`${card.title}，第 ${index + 1} 张，共 ${cards.length} 张`}>
          <div className="study-carousel-copy">
            <span className="study-carousel-eyebrow"><span aria-hidden="true" />{card.eyebrow}</span>
            <h2>{card.levelCode ? <><span className="study-carousel-level-code">{card.levelCode}</span><span className="study-carousel-level-title">{card.heading || card.title}</span></> : card.title}</h2><p className="study-carousel-meta">{card.meta}</p>
            <p className="study-carousel-description">{card.description}</p>
            <PrimaryButton className="study-carousel-start" disabled={!card.action} onClick={() => onAction(card.action)}>
              {card.actionLabel}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" /></svg>
            </PrimaryButton>
          </div>
          <div className="study-carousel-artwork" aria-hidden="true">
            {Math.abs(position) <= 1 && <ScheduledAssetImage className="study-carousel-art" src={card.art} alt="" draggable={false}
              critical={isActive} loading={scheduler || isActive ? 'eager' : 'lazy'} fetchPriority={isActive ? 'high' : 'low'}
              onLoad={() => { if (isActive) scheduler?.settlePrimary(primaryToken); }}
              onError={() => { if (isActive) scheduler?.settlePrimary(primaryToken); }} />}
          </div>
          {card.progress !== undefined && <div className="study-carousel-progress"><LinearProgress value={Math.round(card.progress)} /><span>{card.progressLabel}</span></div>}
        </article>;
      })}
    </div>
    {cards.length > 1 && <>
      <button type="button" className="study-carousel-arrow is-back" aria-label={previousLabel} onClick={() => select(activeIndex - 1)}><Arrow back /></button>
      <button type="button" className="study-carousel-arrow is-forward" aria-label={nextLabel} onClick={() => select(activeIndex + 1)}><Arrow /></button>
      <div className="study-carousel-dots" aria-label={selectionLabel}>{cards.map((card, index) => <button key={card.id} type="button" aria-label={previewLabel(card)} aria-pressed={index === activeIndex} onClick={() => select(index)} />)}</div>
    </>}
    <span className="study-dashboard-sr-only" aria-live="polite" aria-atomic="true">{active.title}，第 {activeIndex + 1} 张，共 {cards.length} 张</span>
  </section>;
}
