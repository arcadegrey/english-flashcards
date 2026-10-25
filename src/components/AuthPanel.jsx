import { useState } from 'react';
import AccountRoleChoice from './AccountRoleChoice';
import { getAccountRoleLabel } from '../utils/classroom';
import { IconButton, PrimaryButton, SecondaryButton } from './ui/Buttons';

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
  onOpenClassroom,
  onOpenSavedWords,
}) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [syncRequestError, setSyncRequestError] = useState('');
  const [role, setRole] = useState('student');
  const [displayName, setDisplayName] = useState('');

  const isLoggedIn = Boolean(user?.id);
  const accountName = user?.displayName || user?.email?.split('@')[0] || '学习者';
  const classroomTitle = user?.profileConfigured
    ? user.role === 'teacher' ? '教学班级' : '我的班级'
    : '设置师生身份';
  const visibleSyncError = (syncStatusText === '同步中' ? syncRequestError : '') || syncError;
  const isSynced = !visibleSyncError && syncStatusText.startsWith('已同步');
  const isSyncing = syncStatusText === '同步中' && !visibleSyncError;
  const hasSyncFailure = syncStatusText === '同步失败' || (visibleSyncError && syncStatusText !== '待同步');
  const syncTone = hasSyncFailure
    ? 'error' : isSynced ? 'success' : 'pending';

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
        role,
        displayName: displayName.trim(),
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
    setSyncRequestError('');
    setMessage('');
    try {
      const result = await onSyncNow();
      setMessage(result?.message || '同步完成。');
    } catch (syncNowError) {
      setSyncRequestError(normalizeError(syncNowError?.message || syncNowError));
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async (allDevices = false) => {
    if (busy) return;
    if (!onLogout) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await onLogout({ allDevices });
      setEmail('');
      setVerificationCode('');
      setMessage(allDevices ? '已退出全部设备。' : '已退出当前设备。');
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
        title={isLoggedIn ? '我的账号' : '欢迎回来'}
        subtitle={isLoggedIn ? '管理个人资料与学习进度' : '登录或注册，在不同设备间继续学习'}
      />

      {isLoggedIn && (
        <div className="auth-identity">
          <span className="auth-avatar" aria-hidden="true">Aa</span>
          <div className="auth-identity-details">
            <div className="auth-identity-heading">
              <h3>{accountName}</h3>
              <span className="auth-role-badge">{getAccountRoleLabel(user)}</span>
              <span className="auth-session-status">已登录</span>
            </div>
            <p className="auth-account-email">{user.email}</p>
          </div>
        </div>
      )}

      {onOpenSavedWords && <SecondaryButton className="auth-secondary-button" onClick={onOpenSavedWords}>我的收藏</SecondaryButton>}
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
          label="标记认识单词"
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
          <div className="auth-account-content">
            <div className="auth-classroom-entry">
              <div className="auth-classroom-copy">
                <h3>{classroomTitle}</h3>
                <p>{user.profileConfigured ? user.role === 'teacher' ? '创建班级，查看学生的学习记录。' : '使用老师的邀请码加入班级。' : '先设置师生身份，开始使用班级功能。'}</p>
                <PrimaryButton className="auth-primary-button auth-classroom-button" onClick={onOpenClassroom}>
                  {user.profileConfigured ? `进入${classroomTitle}` : classroomTitle}
                  <AuthIcon name="arrow" />
                </PrimaryButton>
              </div>
              <img className="auth-classroom-art" src="/images/ui-assets/category-all-words-blue-v1.png" alt="" width="512" height="512" />
            </div>
            <div className={`auth-sync-section is-${syncTone}`}>
              <div className="auth-sync-row">
                <span className="auth-sync-icon" aria-hidden="true"><AuthIcon name="cloud" /></span>
                <div className="auth-sync-copy" role="status" aria-live="polite">
                  <h3>{hasSyncFailure ? '学习进度同步失败' : isSynced ? '学习进度已同步' : `学习进度${syncStatusText || '已连接'}`}</h3>
                  <p>{isSynced ? `最近同步：${syncStatusText.slice(3).trim()}` : isSyncing ? '正在同步，请稍候' : '同步学习记录，在不同设备间继续学习'}</p>
                </div>
                <SecondaryButton
                  disabled={busy || isSyncing}
                  onClick={handleSyncNow}
                  className="auth-secondary-button"
                >
                  {isSyncing ? '同步中…' : '立即同步'}
                </SecondaryButton>
              </div>
              {visibleSyncError && <p className={hasSyncFailure ? 'auth-error' : 'auth-sync-notice'} role={hasSyncFailure ? 'alert' : 'status'}>{visibleSyncError}</p>}
            </div>
            <div className="auth-account-footer">
              <button
                type="button"
                disabled={busy}
                onClick={() => handleLogout(false)}
                className="auth-logout-button"
              >
                <AuthIcon name="logout" />
                退出当前设备
              </button>
              <button type="button" disabled={busy} onClick={() => handleLogout(true)} className="auth-logout-button">退出全部设备</button>
              <span className="auth-storage-note"><AuthIcon name="shield" />{isSynced ? '学习记录已保存至云端' : '学习记录保留在当前设备'}</span>
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

            {mode === 'register' && (
              <>
                <AccountRoleChoice value={role} onChange={setRole} disabled={busy} />
                <label className="auth-input-field">
                  <input aria-label="姓名或昵称" type="text" maxLength={40} value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)} placeholder="姓名 / 昵称（可选，方便师生辨认）" />
                </label>
              </>
            )}

            <label className="auth-input-field">
              <span aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M4 6h16v12H4z" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
              </span>
              <input
                type="email"
                aria-label="邮箱地址"
                autoComplete="email"
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
                aria-label="验证码"
                autoComplete="one-time-code"
                value={verificationCode}
                onChange={(event) => setVerificationCode(event.target.value)}
                placeholder="请输入验证码（首次可留空）"
              />
            </label>

            <PrimaryButton
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
            </PrimaryButton>

            <p className="auth-form-hint">
              <span aria-hidden="true">i</span>
              {mode === 'register'
                ? '先发送注册验证码，再输入验证码完成注册并自动登录'
                : '先发送登录验证码，再输入验证码完成登录'}
            </p>
          </form>
        )}

      {error && <p className="auth-error" role="alert">{error}</p>}
      {message && !isLoggedIn && <p className="auth-message" role="status">{message}</p>}
    </section>
  );
}

function AuthHeader({ onClose, title = '账号与云同步', subtitle = '登录后自动同步学习进度（跨更新保留）' }) {
  return (
    <header className="auth-panel-header">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {onClose ? (
        <IconButton className="auth-close-button" onClick={onClose} label="关闭登录弹窗">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12" />
            <path d="M18 6 6 18" />
          </svg>
        </IconButton>
      ) : null}
    </header>
  );
}

function AuthIcon({ name }) {
  const paths = {
    arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
    cloud: <><path d="M6 18a4.5 4.5 0 0 1-1-8.9 7 7 0 0 1 13.5-1.4A5.2 5.2 0 0 1 18 18H6Z" /><path d="m9 12 2 2 4-4" /></>,
    shield: <><path d="m12 3 7 3v5c0 4.4-2.8 7.8-7 10-4.2-2.2-7-5.6-7-10V6l7-3Z" /><path d="m9 12 2 2 4-4" /></>,
    logout: <><path d="M9 4H5v16h4M10 12h10m-4-4 4 4-4 4" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
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
