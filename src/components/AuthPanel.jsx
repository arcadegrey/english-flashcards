import { useState } from 'react';

const normalizeError = (error) => {
  if (!error) return '操作失败，请重试。';
  const text = String(error);
  const lower = text.toLowerCase();

  if (text.includes('Invalid login credentials') || lower.includes('invalid credentials')) {
    return '邮箱或密码错误。';
  }
  if (text.includes('User already registered') || lower.includes('already') || lower.includes('exists')) {
    return '该邮箱已注册，请直接登录。';
  }
  if (
    lower.includes('email not confirmed') ||
    lower.includes('otp') ||
    lower.includes('verification') ||
    lower.includes('验证码')
  ) {
    return '验证码无效或已过期，请重新发送后再试。';
  }
  if (
    lower.includes('provider email not found from endpoint') ||
    (lower.includes('provider') && lower.includes('email') && lower.includes('not found'))
  ) {
    return 'CloudBase 未开启邮箱认证，请到控制台「身份认证/登录方式」启用邮箱相关登录。';
  }
  if (lower.includes('network request error') || lower.includes('network error')) {
    return `云同步请求失败：${text}`;
  }
  if (lower.includes('access key') || lower.includes('cloudbase') || lower.includes('env_id')) {
    return 'CloudBase 配置不完整，请检查环境变量。';
  }
  return text;
};

function AuthPanel({
  enabled = false,
  loading = false,
  user = null,
  syncStatusText = '',
  syncError = '',
  onLogin,
  onRegister,
  onLogout,
  onSyncNow,
}) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const isLoggedIn = Boolean(user?.id);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('请填写邮箱和密码。');
      return;
    }

    setBusy(true);
    setError('');
    setMessage('');

    try {
      const action = mode === 'register' ? onRegister : onLogin;
      const result = await action?.({
        email: email.trim(),
        password: password.trim(),
        verificationCode: mode === 'register' ? verificationCode.trim() : '',
      });
      setMessage(result?.message || (mode === 'register' ? '注册成功。' : '登录成功。'));
      if (result?.sessionReady) {
        setPassword('');
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
      setPassword('');
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
      <section className="rounded-[14px] border border-[#e5e7eb] bg-[#f5f5f7] p-5 shadow-[0_1px_3px_rgba(15,23,42,0.08)] md:p-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-[#111827]">账号与云同步</h3>
          <p className="mt-2 text-sm text-[#6b7280]">
            还未配置云端账号服务。配置后可注册登录并在网站更新后保留学习进度。
          </p>
          <p className="mt-1 text-xs text-[#9ca3af]">
            需要设置 `VITE_CLOUDBASE_ENV_ID`（可选 `VITE_CLOUDBASE_PUBLISHABLE_KEY`）。
          </p>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="rounded-[14px] border border-[#e5e7eb] bg-[#f5f5f7] p-5 shadow-[0_1px_3px_rgba(15,23,42,0.08)] md:p-6">
        <p className="text-center text-sm text-[#6b7280]">正在恢复账号会话...</p>
      </section>
    );
  }

  return (
    <section className="rounded-[14px] border border-[#e5e7eb] bg-[#f5f5f7] p-5 shadow-[0_1px_3px_rgba(15,23,42,0.08)] md:p-6">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-[#111827]">账号与云同步</h3>
          {isLoggedIn ? (
            <p className="mt-1 text-sm text-[#6b7280]">已登录：{user.email}</p>
          ) : (
            <p className="mt-1 text-sm text-[#6b7280]">登录后自动同步学习进度（跨更新保留）</p>
          )}
        </div>

        {isLoggedIn ? (
          <div className="space-y-3">
            <p className="text-center text-sm text-[#6b7280]">
              同步状态：<span className="font-semibold text-[#111827]">{syncStatusText || '就绪'}</span>
            </p>
            {syncError && <p className="text-center text-sm text-[#dc2626]">{syncError}</p>}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                disabled={busy}
                onClick={handleSyncNow}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] border border-[#d1d5db] bg-white px-4 py-2 text-base font-semibold text-[#111827] transition duration-200 hover:border-[#0071e3] hover:bg-[#0071e3] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                立即同步
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={handleLogout}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] border border-[#d1d5db] bg-white px-4 py-2 text-base font-semibold text-[#111827] transition duration-200 hover:border-[#0071e3] hover:bg-[#0071e3] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                退出登录
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`min-h-[40px] rounded-[10px] border px-3 py-2 text-sm font-semibold transition ${
                  mode === 'login'
                    ? 'border-[#0071e3] bg-[#0071e3] text-white'
                    : 'border-[#d1d5db] bg-white text-[#111827] hover:border-[#0071e3] hover:text-[#0071e3]'
                }`}
              >
                登录
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`min-h-[40px] rounded-[10px] border px-3 py-2 text-sm font-semibold transition ${
                  mode === 'register'
                    ? 'border-[#0071e3] bg-[#0071e3] text-white'
                    : 'border-[#d1d5db] bg-white text-[#111827] hover:border-[#0071e3] hover:text-[#0071e3]'
                }`}
              >
                注册
              </button>
            </div>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="邮箱"
              className="w-full min-h-[44px] rounded-[10px] border border-[#e5e7eb] bg-white px-4 py-2 text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]"
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="密码（至少 6 位）"
              className="w-full min-h-[44px] rounded-[10px] border border-[#e5e7eb] bg-white px-4 py-2 text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]"
            />
            {mode === 'register' && (
              <input
                type="text"
                value={verificationCode}
                onChange={(event) => setVerificationCode(event.target.value)}
                placeholder="邮箱验证码（先点击一次“注册账号”发送）"
                className="w-full min-h-[44px] rounded-[10px] border border-[#e5e7eb] bg-white px-4 py-2 text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]"
              />
            )}
            <button
              type="submit"
              disabled={busy}
              className="inline-flex w-full min-h-[44px] items-center justify-center rounded-[10px] border border-[#4f46e5] bg-[#4f46e5] px-4 py-2 text-base font-semibold text-white transition duration-200 hover:bg-[#4338ca] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy
                ? '处理中...'
                : mode === 'register'
                  ? verificationCode.trim()
                    ? '完成注册'
                    : '注册账号'
                  : '登录账号'}
            </button>
            {mode === 'register' && (
              <p className="text-center text-xs text-[#6b7280]">
                注册流程：先提交邮箱和密码发送验证码，再输入验证码点“完成注册”
              </p>
            )}
          </form>
        )}

        {error && <p className="text-center text-sm text-[#dc2626]">{error}</p>}
        {message && <p className="text-center text-sm text-[#059669]">{message}</p>}
      </div>
    </section>
  );
}

export default AuthPanel;
