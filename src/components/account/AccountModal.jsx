import { lazy, Suspense, useEffect, useRef } from 'react'
import PageLoadBoundary from '../PageLoadBoundary.jsx'
import LoadingState from '../ui/LoadingState.jsx'

const AuthPanel = lazy(() => import('../AuthPanel.jsx'))

export default function AccountModal({ open, onClose, ...panelProps }) {
  const modalRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    const modal = modalRef.current
    const getFocusable = () => [...(modal?.querySelectorAll('button:not(:disabled), input:not(:disabled)') || [])]
      .filter((element) => element.getClientRects().length > 0)

    document.body.style.overflow = 'hidden'
    const initialFocus = getFocusable()[0] || modal
    initialFocus?.focus()

    const handleModalKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
      if (event.key !== 'Tab') return
      const focusable = getFocusable()
      const first = focusable[0]
      const last = focusable.at(-1)
      if (!first) return
      if (!modal?.contains(document.activeElement) || (event.shiftKey && document.activeElement === first)) {
        event.preventDefault()
        const target = event.shiftKey ? last : first
        target.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleModalKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleModalKey)
      if (previousFocus?.isConnected) previousFocus.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="auth-modal-overlay fixed inset-0 z-[80] flex items-center justify-center">
      <button
        type="button"
        aria-label="关闭登录弹窗"
        className="auth-modal-backdrop absolute inset-0"
        onClick={onClose}
      />
      <div ref={modalRef} className="auth-modal-card" tabIndex={-1} role="dialog" aria-modal="true" aria-label="账号与云同步">
        <PageLoadBoundary>
          <Suspense fallback={<LoadingState title="正在准备账号面板…" />}>
            <AuthPanel {...panelProps} onClose={onClose} />
          </Suspense>
        </PageLoadBoundary>
      </div>
    </div>
  )
}
