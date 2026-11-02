import { useEffect, useState } from 'react';
import AccountRoleChoice from '../AccountRoleChoice';
import { PrimaryButton, SecondaryButton } from '../ui/Buttons';
import { PASSWORD_HINT, passwordError } from '../../../shared/passwordPolicy.js';

const messageFor = error => /fetch|network|timeout|timed out/i.test(error?.message || '')
  ? '网络暂不可用，请检查连接后重试。' : error?.message || '操作失败，请重试。';

export default function AuthCredentialsForm({ user, onLogin, onRegister, onRequestPasswordCode, onSavePassword, onResetPassword, onDone }) {
  const [mode, setMode] = useState(user ? 'set' : 'login');
  const [method, setMethod] = useState('password');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [visible, setVisible] = useState(false);
  const [code, setCode] = useState('');
  const [role, setRole] = useState('student');
  const [displayName, setDisplayName] = useState('');
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const newPassword = mode !== 'login';
  const needsCode = newPassword || method === 'code';

  useEffect(() => {
    if (!cooldown) return undefined;
    const timer = setTimeout(() => setCooldown(value => Math.max(0, value - 1)), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const choose = (nextMode, nextMethod = 'password') => {
    setMode(nextMode); setMethod(nextMethod); setPassword(''); setConfirmation('');
    setCode(''); setVisible(false); setError(''); setMessage('');
  };
  const validateEmail = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || email.trim().length > 254) throw new Error('请输入有效邮箱地址。');
  };
  const sendCode = async () => {
    if (busy || cooldown) return;
    setError(''); setMessage('');
    try {
      validateEmail(); setBusy(true);
      const result = mode === 'register' ? await onRegister({ email, role, displayName })
        : mode === 'login' ? await onLogin({ email, method: 'code' })
          : await onRequestPasswordCode({ purpose: mode === 'set' ? 'set' : 'reset', email });
      setMessage(result?.message || '验证码已发送，请查收邮箱。');
      setCooldown(60);
    } catch (err) { setError(messageFor(err)); }
    finally { setBusy(false); }
  };
  const submit = async event => {
    event.preventDefault();
    if (busy) return;
    setError(''); setMessage('');
    try {
      validateEmail();
      if (newPassword) {
        const invalid = passwordError(password, email);
        if (invalid) throw new Error(invalid);
        if (password !== confirmation) throw new Error('两次输入的密码不一致。');
      }
      if (needsCode && !/^\d{6}$/.test(code.trim())) throw new Error('请输入 6 位数字验证码。');
      setBusy(true);
      const values = { email: email.trim(), password, verificationCode: code.trim(), role, displayName: displayName.trim() };
      const result = mode === 'set' ? await onSavePassword(values)
        : mode === 'reset' ? await onResetPassword(values)
          : mode === 'register' ? await onRegister(values)
            : await onLogin(method === 'password' ? { email, password, method } : { email, verificationCode: code, method });
      setPassword(''); setConfirmation(''); setCode(''); setVisible(false);
      if (mode === 'reset') choose('login');
      setMessage(result?.message || '操作成功。');
      if (mode === 'set') onDone?.(result?.message || '密码已保存。');
    } catch (err) { setError(messageFor(err)); }
    finally { setBusy(false); }
  };
  const action = mode === 'set' ? '保存密码' : mode === 'reset' ? '重置密码'
    : mode === 'register' ? '验证邮箱并注册' : method === 'code' ? '验证码登录' : '密码登录';

  return <form className="auth-form" onSubmit={submit} aria-label={action}>
    {['login', 'register'].includes(mode) ? <div className="auth-mode-toggle">
      <button type="button" disabled={busy} className={mode === 'login' ? 'is-active' : ''} onClick={() => choose('login')}>登录</button>
      <button type="button" disabled={busy} className={mode === 'register' ? 'is-active' : ''} onClick={() => choose('register')}>注册</button>
    </div> : <div className="auth-password-heading">
      <h3>{mode === 'reset' ? '找回密码' : user?.hasPassword ? '修改登录密码' : '设置登录密码'}</h3>
      <p>{mode === 'reset' ? '验证注册邮箱后设置新密码。' : '验证当前邮箱，保存后其他设备需重新登录。'}</p>
    </div>}

    {mode === 'register' && <>
      <AccountRoleChoice value={role} onChange={setRole} disabled={busy} />
      <label className="auth-input-field"><input type="text" aria-label="姓名或昵称" maxLength={40} value={displayName}
        disabled={busy} onChange={e => setDisplayName(e.target.value)} placeholder="姓名 / 昵称（可选）" /></label>
    </>}

    <label className="auth-input-field">
      <span aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 6h16v12H4zM4 7l8 6 8-6" /></svg></span>
      <input type="email" aria-label="邮箱地址" autoComplete="username" value={email} required readOnly={Boolean(user)} disabled={busy}
        onChange={e => setEmail(e.target.value)} placeholder="邮箱地址" maxLength={254} />
    </label>

    {(newPassword || method === 'password') && <>
      <label className="auth-input-field">
        <span aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></svg></span>
        <input type={visible ? 'text' : 'password'} aria-label={newPassword ? '新密码' : '密码'}
          autoComplete={newPassword ? 'new-password' : 'current-password'} value={password} required maxLength={256} disabled={busy}
          onChange={e => setPassword(e.target.value)} placeholder={newPassword ? '设置新密码' : '输入密码'} />
        <button type="button" className="auth-password-reveal" disabled={busy} aria-label={visible ? '隐藏密码' : '显示密码'} aria-pressed={visible} onClick={() => setVisible(value => !value)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />{visible && <path d="m3 3 18 18" />}</svg>
        </button>
      </label>
      {newPassword && <>
        <label className="auth-input-field"><input type={visible ? 'text' : 'password'} aria-label="确认新密码" autoComplete="new-password"
          value={confirmation} required maxLength={256} disabled={busy} onChange={e => setConfirmation(e.target.value)} placeholder="再次输入新密码" /></label>
        <p className="auth-form-hint">{PASSWORD_HINT}</p>
      </>}
    </>}

    {needsCode && <div className="auth-code-row">
      <label className="auth-input-field"><input type="text" aria-label="验证码" autoComplete="one-time-code" inputMode="numeric" value={code} maxLength={6}
        disabled={busy} onChange={e => setCode(e.target.value)} placeholder="6 位验证码" /></label>
      <SecondaryButton type="button" disabled={busy || cooldown > 0} onClick={sendCode}>{cooldown ? `${cooldown} 秒后重发` : '发送验证码'}</SecondaryButton>
    </div>}

    <PrimaryButton type="submit" className="auth-primary-button" disabled={busy} loading={busy}>{busy ? '处理中…' : action}</PrimaryButton>
    {mode === 'login' ? <div className="auth-form-links">
      <button type="button" disabled={busy} className="auth-text-button" onClick={() => choose('login', method === 'password' ? 'code' : 'password')}>{method === 'password' ? '使用验证码登录' : '使用密码登录'}</button>
      <button type="button" disabled={busy} className="auth-text-button" onClick={() => choose('reset')}>忘记密码？</button>
    </div> : mode === 'reset' ? <button type="button" disabled={busy} className="auth-text-button" onClick={() => choose('login')}>返回登录</button>
      : mode === 'set' && <button type="button" disabled={busy} className="auth-text-button" onClick={() => onDone?.()}>取消</button>}
    {mode === 'login' && method === 'password' && <p className="auth-form-hint">还没有设置密码？先用验证码登录，再到账号中设置。</p>}
    {mode === 'register' && <p className="auth-form-hint">首次注册需要验证邮箱，以后可使用密码登录。</p>}
    {error && <p className="auth-error" role="alert">{error}</p>}
    {message && <p className="auth-message" role="status">{message}</p>}
  </form>;
}
