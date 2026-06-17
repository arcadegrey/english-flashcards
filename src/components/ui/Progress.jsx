export function CircularProgress({ value = 0, label = '核心进度' }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0))

  return (
    <div className="ds-circular-progress" style={{ '--progress': `${safeValue}%` }}>
      <div>
        <span>{safeValue}%</span>
        <small>{label}</small>
      </div>
    </div>
  )
}

export function LinearProgress({ value = 0 }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0))
  return (
    <div className="ds-linear-progress" aria-label={`进度 ${safeValue}%`}>
      <span style={{ '--progress': `${safeValue}%` }} />
    </div>
  )
}
