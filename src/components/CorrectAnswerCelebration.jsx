import { useRef } from 'react';
import { gsap, prefersReducedMotion, useGSAP } from '../utils/gsapMotion';

const PARTICLES = [
  { dx: -120, dy: -120, delay: 0, color: '#f59e0b' },
  { dx: -95, dy: -60, delay: 20, color: '#fb7185' },
  { dx: -60, dy: -130, delay: 30, color: '#38bdf8' },
  { dx: -20, dy: -90, delay: 45, color: '#34d399' },
  { dx: 20, dy: -140, delay: 0, color: '#60a5fa' },
  { dx: 60, dy: -95, delay: 30, color: '#a78bfa' },
  { dx: 95, dy: -55, delay: 15, color: '#f472b6' },
  { dx: 120, dy: -120, delay: 25, color: '#22d3ee' },
  { dx: -110, dy: 10, delay: 35, color: '#facc15' },
  { dx: -45, dy: 40, delay: 50, color: '#2dd4bf' },
  { dx: 45, dy: 30, delay: 40, color: '#4ade80' },
  { dx: 110, dy: 5, delay: 35, color: '#fb7185' },
];

function CorrectAnswerCelebration({ trigger }) {
  const containerRef = useRef(null);

  useGSAP(() => {
    if (!trigger || prefersReducedMotion()) return;

    const root = containerRef.current;
    if (!root) return;

    const particles = root.querySelectorAll('.success-fireworks-particle');
    const glow = root.querySelector('.success-fireworks-glow');

    gsap.set(particles, { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 0.2, autoAlpha: 0 });
    gsap.set(glow, { xPercent: -50, yPercent: -50, scale: 0.3, autoAlpha: 0 });

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    tl.to(glow, { scale: 1.2, autoAlpha: 1, duration: 0.18 })
      .to(glow, { scale: 1.8, autoAlpha: 0, duration: 0.42, ease: 'power3.out' })
      .to(
        particles,
        {
          x: (index, target) => Number(target.dataset.dx || 0),
          y: (index, target) => Number(target.dataset.dy || 0),
          scale: 1,
          autoAlpha: 1,
          duration: 0.16,
          stagger: 0.012,
        },
        0.02
      )
      .to(
        particles,
        {
          autoAlpha: 0,
          duration: 0.48,
          ease: 'power3.out',
          stagger: 0.01,
        },
        0.18
      );
  }, { dependencies: [trigger], scope: containerRef, revertOnUpdate: true });

  if (!trigger) {
    return null;
  }

  return (
    <div key={trigger} ref={containerRef} className="success-fireworks" aria-hidden="true">
      <span className="success-fireworks-glow" />
      {PARTICLES.map((particle, index) => (
        <span
          key={`${trigger}-${index}`}
          className="success-fireworks-particle"
          data-dx={particle.dx}
          data-dy={particle.dy}
          style={{
            '--dx': `${particle.dx}px`,
            '--dy': `${particle.dy}px`,
            '--delay': `${particle.delay}ms`,
            '--particle-color': particle.color,
          }}
        />
      ))}
    </div>
  );
}

export default CorrectAnswerCelebration;
