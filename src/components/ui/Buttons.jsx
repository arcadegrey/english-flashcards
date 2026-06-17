export function PrimaryButton({ children, className = '', ...props }) {
  return (
    <button type="button" className={`ds-button ds-button-primary ${className}`} {...props}>
      {children}
    </button>
  )
}

export function SecondaryButton({ children, className = '', ...props }) {
  return (
    <button type="button" className={`ds-button ds-button-secondary ${className}`} {...props}>
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
