const API_BASE = String(import.meta.env.VITE_API_BASE || '/api').trim().replace(/\/$/, '');
const FALLBACK_SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

const EMPTY_PROGRESS = {
  learnedWords: [],
  masteredWords: [],
  customWords: [],
};

const normalizeIds = (value) => {
  const list = Array.isArray(value) ? value : [];
  const seen = new Set();
  const output = [];
  list.forEach((item) => {
    if (item == null) return;
    const key = String(item);
    if (!key || seen.has(key)) return;
    seen.add(key);
    output.push(item);
  });
  return output;
};

const normalizeCustomWords = (value) => {
  const list = Array.isArray(value) ? value : [];
  return list.filter((item) => item && typeof item === 'object' && String(item.word || '').trim());
};

const normalizeProgress = (value) => ({
  learnedWords: normalizeIds(value?.learnedWords),
  masteredWords: normalizeIds(value?.masteredWords),
  customWords: normalizeCustomWords(value?.customWords),
});

const getErrorMessage = (payload, status) => {
  if (!payload) return `请求失败（${status}）`;
  if (typeof payload === 'string') return payload;
  return payload.error || payload.message || `请求失败（${status}）`;
};

const buildSessionFromUser = (user, expiresAt) => ({
  access_token: 'cookie-session',
  refresh_token: '',
  expires_at:
    Number.isFinite(Number(expiresAt)) && Number(expiresAt) > 0
      ? Number(expiresAt)
      : Math.floor(Date.now() / 1000) + FALLBACK_SESSION_TTL_SECONDS,
  user,
});

const requestApi = async (path, { method = 'GET', body, allowUnauthorized = false } = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: 'include',
    headers: body ? { 'content-type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json().catch(() => null) : await response.text();

  if (!response.ok) {
    if (allowUnauthorized && response.status === 401) {
      return { unauthorized: true, payload };
    }
    throw new Error(getErrorMessage(payload, response.status));
  }

  return payload;
};

export const isWorkerAuthConfigured = () => Boolean(API_BASE);
export const isCloudAuthConfigured = isWorkerAuthConfigured;

export const signUpWithEmail = async ({ email, verificationCode = '' }) => {
  const safeEmail = String(email || '').trim().toLowerCase();
  const safeCode = String(verificationCode || '').trim();

  if (!safeEmail) {
    throw new Error('请先填写邮箱地址。');
  }

  if (!safeCode) {
    const payload = await requestApi('/auth/send-code', {
      method: 'POST',
      body: {
        email: safeEmail,
        mode: 'register',
      },
    });

    return {
      session: null,
      user: null,
      emailConfirmationRequired: true,
      pendingVerification: true,
      message: payload?.message || '验证码已发送，请输入验证码完成注册。',
    };
  }

  const payload = await requestApi('/auth/verify-code', {
    method: 'POST',
    body: {
      email: safeEmail,
      code: safeCode,
      mode: 'register',
    },
  });

  const user = payload?.user || null;
  const session = payload?.session || (user ? buildSessionFromUser(user) : null);

  if (!user?.id || !session) {
    throw new Error('注册成功但会话创建失败，请重试。');
  }

  return {
    session,
    user,
    emailConfirmationRequired: false,
    pendingVerification: false,
    message: payload?.message || '注册并登录成功。',
  };
};

export const signInWithEmail = async ({ email, verificationCode = '', password = '' }) => {
  const safeEmail = String(email || '').trim().toLowerCase();
  const safeCode = String(verificationCode || password || '').trim();

  if (!safeEmail) {
    throw new Error('请先填写邮箱地址。');
  }

  if (!safeCode) {
    const payload = await requestApi('/auth/send-code', {
      method: 'POST',
      body: {
        email: safeEmail,
        mode: 'login',
      },
    });

    return {
      session: null,
      user: null,
      emailConfirmationRequired: true,
      pendingVerification: true,
      message: payload?.message || '登录验证码已发送，请输入验证码完成登录。',
    };
  }

  const payload = await requestApi('/auth/verify-code', {
    method: 'POST',
    body: {
      email: safeEmail,
      code: safeCode,
      mode: 'login',
    },
  });

  const user = payload?.user || null;
  const session = payload?.session || (user ? buildSessionFromUser(user) : null);

  if (!user?.id || !session) {
    throw new Error('登录成功但会话创建失败，请重试。');
  }

  return { session, user };
};

export const signOut = async () => {
  await requestApi('/auth/logout', { method: 'POST', allowUnauthorized: true });
};

export const refreshSession = async () => {
  const payload = await requestApi('/auth/me', { allowUnauthorized: true });

  if (payload?.unauthorized) {
    throw new Error('登录已过期，请重新登录。');
  }

  const user = payload?.user;
  if (!user?.id) {
    throw new Error('无法恢复登录状态，请重新登录。');
  }

  return {
    user,
    session: payload?.session || buildSessionFromUser(user),
  };
};

export const fetchCurrentUser = async () => {
  const payload = await requestApi('/auth/me', { allowUnauthorized: true });
  if (payload?.unauthorized) {
    throw new Error('登录已过期，请重新登录。');
  }

  const user = payload?.user;
  if (!user?.id) {
    throw new Error('无法获取当前登录用户。');
  }
  return user;
};

export const loadCloudProgress = async () => {
  const payload = await requestApi('/progress');
  return normalizeProgress(payload?.progress || EMPTY_PROGRESS);
};

export const upsertCloudProgress = async ({ progress }) => {
  const payload = await requestApi('/progress', {
    method: 'PUT',
    body: {
      progress: normalizeProgress(progress),
    },
  });

  return payload?.updatedAt || new Date().toISOString();
};
