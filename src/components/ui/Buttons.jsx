import { LoadingAnimation } from './LoadingState';

export function PrimaryButton({ children, className = '', loading = false, disabled, ...props }) {
  return (
    <button type="button" className={`ds-button ds-button-primary ${className}`} {...props} disabled={disabled || loading} aria-busy={loading || undefined}>
      {loading && <LoadingAnimation compact />}
      {children}
    </button>
  )
}

export function SecondaryButton({ children, className = '', loading = false, disabled, ...props }) {
  return (
    <button type="button" className={`ds-button ds-button-secondary ${className}`} {...props} disabled={disabled || loading} aria-busy={loading || undefined}>
      {loading && <LoadingAnimation compact />}
      {children}
    </button>
  )
}

export function IconButton({ children, label, badge, className = '', ...props }) {
  return (
    <button type="button" className={`ds-icon-button ${className}`} aria-label={label} {...props}>
      {children}
      {badge && <span className="ds-badge-dot">{badge}</span>}
    </button>
  )
}
