import { useState } from 'react';

const normalizeError = (error) => {
  if (!error) return '操作失败，请重试。';
  const text = String(error);
  const lower = text.toLowerCase();

  if (lower.includes('too many requests') || lower.includes('频繁')) {
    return '操作过于频繁，请稍后再试。';
  }
  if (lower.includes('user not found') || text.includes('账号不存在')) {
    return '账号不存在，请先注册。';
  }
  if (lower.includes('email exists') || lower.includes('already') || text.includes('已注册')) {
    return '该邮箱已注册，请直接登录。';
  }
  if (lower.includes('code') || lower.includes('verification') || text.includes('验证码')) {
    return text;
  }
  if (lower.includes('network request error') || lower.includes('network error') || lower.includes('failed to fetch')) {
    return '网络连接失败，请稍后重试。';
  }
  if (lower.includes('session_secret') || lower.includes('resend') || lower.includes('d1')) {
    return `服务端配置不完整：${text}`;
  }

  return text;
};

function AuthPanel({
  enabled = false,
  loading = false,
  user = null,
  learnedCount = 0,
  masteredCount = 0,
  onClose,
  syncStatusText = '',
  syncError = '',
  onLogin,
  onRegister,
  onLogout,
  onSyncNow,
}) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const isLoggedIn = Boolean(user?.id);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setError('请填写邮箱地址。');
      return;
    }

    setBusy(true);
    setError('');
    setMessage('');

    try {
      const action = mode === 'register' ? onRegister : onLogin;
      const result = await action?.({
        email: email.trim(),
        verificationCode: verificationCode.trim(),
      });
      setMessage(result?.message || (mode === 'register' ? '注册成功。' : '登录成功。'));
      if (result?.sessionReady) {
        setVerificationCode('');
      }
    } catch (submitError) {
      setError(normalizeError(submitError?.message || submitError));
    } finally {
      setBusy(false);
    }
  };

  const handleSyncNow = async () => {
    if (!onSyncNow) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const result = await onSyncNow();
      setMessage(result?.message || '同步完成。');
    } catch (syncNowError) {
      setError(normalizeError(syncNowError?.message || syncNowError));
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    if (!onLogout) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await onLogout();
      setEmail('');
      setVerificationCode('');
      setMessage('已退出登录。');
    } catch (logoutError) {
      setError(normalizeError(logoutError?.message || logoutError));
    } finally {
      setBusy(false);
    }
  };

  if (!enabled) {
    return (
      <section className="auth-panel">
        <AuthHeader onClose={onClose} />
        <div className="auth-disabled-state">
          <h3>账号与云同步暂未启用</h3>
          <p>配置后可注册登录并在更新后保留学习进度。请检查 Worker 与 D1 部署，并确认前端可访问 `/api`。</p>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="auth-panel">
        <AuthHeader onClose={onClose} />
        <p className="auth-loading-text">正在恢复账号会话...</p>
      </section>
    );
  }

  return (
    <section className="auth-panel">
      <AuthHeader
        onClose={onClose}
        subtitle={isLoggedIn ? `已登录：${user.email}` : '登录后自动同步学习进度（跨更新保留）'}
      />

      <div className="auth-stat-grid">
        <AuthStatCard
          tone="blue"
          label="已学习单词"
          value={learnedCount}
          icon={
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 4h10a3 3 0 0 1 3 3v13H9a3 3 0 0 0-3 3V4Z" />
              <path d="M9 8h6" />
              <path d="M9 12h5" />
            </svg>
          }
        />
        <AuthStatCard
          tone="green"
          label="已掌握单词"
          value={masteredCount}
          icon={
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3 19 6v5c0 4.4-2.8 7.8-7 10-4.2-2.2-7-5.6-7-10V6l7-3Z" />
              <path d="m8.8 12.2 2.1 2.1 4.5-4.8" />
            </svg>
          }
        />
      </div>

        {isLoggedIn ? (
          <div className="auth-logged-in">
            <p>
              同步状态：<strong>{syncStatusText || '就绪'}</strong>
            </p>
            {syncError && <p className="auth-error">{syncError}</p>}
            <div className="auth-action-grid">
              <button
                type="button"
                disabled={busy}
                onClick={handleSyncNow}
                className="auth-secondary-button"
              >
                立即同步
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={handleLogout}
                className="auth-secondary-button"
              >
                退出登录
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-mode-toggle">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={mode === 'login' ? 'is-active' : ''}
              >
                登录
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={mode === 'register' ? 'is-active' : ''}
              >
                注册
              </button>
            </div>

            <label className="auth-input-field">
              <span aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M4 6h16v12H4z" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="请输入邮箱"
              />
            </label>

            <label className="auth-input-field">
              <span aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12 3 19 6v5c0 4.4-2.8 7.8-7 10-4.2-2.2-7-5.6-7-10V6l7-3Z" />
                  <path d="M9 12h6" />
                </svg>
              </span>
              <input
                type="text"
                value={verificationCode}
                onChange={(event) => setVerificationCode(event.target.value)}
                placeholder={mode === 'register' ? '请输入注册验证码（可留空先发送）' : '请输入登录验证码（可留空先发送）'}
              />
            </label>

            <button
              type="submit"
              disabled={busy}
              className="auth-primary-button"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m5 12 14-7-5 14-3-5-6-2Z" />
                <path d="m11 14 3-3" />
              </svg>
              {busy
                ? '处理中...'
                : verificationCode.trim()
                  ? mode === 'register'
                    ? '完成注册'
                    : '完成登录'
                  : mode === 'register'
                    ? '发送注册验证码'
                    : '发送登录验证码'}
            </button>

            <p className="auth-form-hint">
              <span aria-hidden="true">i</span>
              {mode === 'register'
                ? '先发送注册验证码，再输入验证码完成注册并自动登录'
                : '先发送登录验证码，再输入验证码完成登录'}
            </p>
          </form>
        )}

      {error && <p className="auth-error">{error}</p>}
      {message && <p className="auth-message">{message}</p>}
    </section>
  );
}

function AuthHeader({ onClose, subtitle = '登录后自动同步学习进度（跨更新保留）' }) {
  return (
    <header className="auth-panel-header">
      <div>
        <h2>登录信息</h2>
        <p>{subtitle}</p>
      </div>
      {onClose ? (
        <button type="button" className="auth-close-button" onClick={onClose} aria-label="关闭登录弹窗">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12" />
            <path d="M18 6 6 18" />
          </svg>
        </button>
      ) : null}
    </header>
  );
}

function AuthStatCard({ tone, icon, label, value }) {
  return (
    <article className={`auth-stat-card is-${tone}`}>
      <span className="auth-stat-icon" aria-hidden="true">{icon}</span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

export default AuthPanel;
