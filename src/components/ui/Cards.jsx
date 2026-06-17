import { PrimaryButton, SecondaryButton } from './Buttons'
import { CircularProgress, LinearProgress } from './Progress'
import { forwardRef } from 'react'

export const BaseCard = forwardRef(function BaseCard({ children, className = '', ...props }, ref) {
  return (
    <section ref={ref} className={`ds-card ${className}`} {...props}>
      {children}
    </section>
  )
})

export function HeroCard({
  label,
  title,
  subtitle,
  meta,
  progress,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  illustrationSrc,
  soft = false,
}) {
  return (
    <section className={`ds-hero-card ${soft ? 'is-soft' : ''}`}>
      <div className="ds-hero-content">
        <div className="ds-hero-copy">
          {label && <div className="ds-hero-label">{label}</div>}
          <h2 className="ds-hero-title">{title}</h2>
          {subtitle && <p className="ds-hero-subtitle">{subtitle}</p>}
          {meta && <div className="ds-hero-meta">{meta}</div>}
        </div>

        {progress !== undefined && (
          <div className="ds-hero-control">
            <CircularProgress value={progress} />
            <div className="ds-hero-control-actions">
              <PrimaryButton onClick={onPrimary}>{primaryLabel}</PrimaryButton>
              <SecondaryButton onClick={onSecondary}>{secondaryLabel}</SecondaryButton>
            </div>
          </div>
        )}

        <div className="ds-hero-visual" aria-hidden="true">
          {illustrationSrc ? (
            <img className="ds-hero-asset" src={illustrationSrc} alt="" loading="eager" />
          ) : (
            <div className="ds-aa-orbit">
              <span className="ds-sparkle one">✦</span>
              <span className="ds-sparkle two">✦</span>
              <span className="ds-sparkle three">✦</span>
              <div className="ds-aa-ring" />
              <div className="ds-aa-card">Aa</div>
              <div className="ds-aa-base" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export function ModuleCard({ title, meta, icon, iconSrc, art, artSrc, active = false, onClick }) {
  const hasIcon = Boolean(iconSrc || icon)

  return (
    <button
      type="button"
      className={`ds-module-card ${hasIcon ? 'has-icon' : ''} ${active ? 'is-active' : ''}`}
      onClick={onClick}
    >
      {(iconSrc || icon) && (
        <span className="ds-module-icon" aria-hidden="true">
          {iconSrc ? <img className="ds-module-icon-img" src={iconSrc} alt="" loading="lazy" /> : icon}
        </span>
      )}
      <h3>{title}</h3>
      <p>{meta}</p>
      {artSrc ? (
        <img className="ds-module-art-image" src={artSrc} alt="" loading="lazy" aria-hidden="true" />
      ) : art ? (
        <span className="ds-module-art" aria-hidden="true">{art}</span>
      ) : null}
      <span className="ds-module-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </span>
    </button>
  )
}

export function StatCard({ icon, iconSrc, value, label }) {
  return (
    <article className="ds-stat-card">
      <span className="ds-stat-icon" aria-hidden="true">
        {iconSrc ? <img className="ds-stat-icon-img" src={iconSrc} alt="" loading="lazy" /> : icon}
      </span>
      <div>
        <p className="ds-stat-value">{value}</p>
        <p className="ds-stat-label">{label}</p>
      </div>
    </article>
  )
}

export function StatusCard({ label, title, meta, icon, art, illustrationSrc, progress, actionLabel, onAction }) {
  return (
    <article className="ds-status-card">
      <span className="ds-status-icon" aria-hidden="true">{icon}</span>
      <div>
        <span className="ds-status-label">{label}</span>
        <h3>{title}</h3>
        <p>{meta}</p>
        {progress !== undefined && <LinearProgress value={progress} />}
      </div>
      <div className="ds-status-side">
        {illustrationSrc ? (
          <img className="ds-status-art-image" src={illustrationSrc} alt="" loading="lazy" aria-hidden="true" />
        ) : art ? (
          <span className="ds-module-art" aria-hidden="true">{art}</span>
        ) : null}
        {actionLabel ? <SecondaryButton onClick={onAction}>{actionLabel}</SecondaryButton> : null}
      </div>
    </article>
  )
}
