import '../../styles/loading-state.css';

// The same orbit used by the account transition, at every waiting-state size.
export function LoadingAnimation({ compact = false }) {
  return <span className={`auth-transition-orbit${compact ? ' loading-orbit--compact' : ''}`} aria-hidden="true">
    <span className="auth-transition-dot auth-transition-dot--blue" />
    <span className="auth-transition-dot auth-transition-dot--green" />
    <span className="auth-transition-dot auth-transition-dot--amber" />
    <span className="auth-transition-core" />
  </span>;
}

export default function LoadingState({ title = '正在加载…', detail, kicker, variant = 'panel', className = '' }) {
  if (variant === 'inline') {
    return <span className={`loading-inline ${className}`} role="status" aria-live="polite" aria-busy="true">
      <LoadingAnimation compact /><span className="loading-inline-copy">{title}</span>
    </span>;
  }

  return <div className={`loading-state loading-state--${variant} ${variant === 'overlay' ? 'auth-transition-overlay' : ''} ${className}`}
    role="status" aria-live="polite" aria-busy="true">
    <div className="auth-transition-panel">
      <LoadingAnimation />
      <div className="auth-transition-copy">
        {kicker && <p className="auth-transition-kicker">{kicker}</p>}
        <h2>{title}</h2>
        {detail && <p className="loading-state-detail">{detail}</p>}
      </div>
      <div className="auth-transition-steps" aria-hidden="true"><span /><span /><span /></div>
    </div>
  </div>;
}
