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
  if (!trigger) {
    return null;
  }

  return (
    <div key={trigger} className="success-fireworks" aria-hidden="true">
      <span className="success-fireworks-glow" />
      {PARTICLES.map((particle, index) => (
        <span
          key={`${trigger}-${index}`}
          className="success-fireworks-particle"
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
