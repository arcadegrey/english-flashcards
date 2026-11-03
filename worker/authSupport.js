export const COOKIE_NAME = 'ef_session';

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const nowIso = () => new Date().toISOString();

export const addSecondsIso = (seconds) => new Date(Date.now() + seconds * 1000).toISOString();

export const toInt = (value, fallback) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
};

export const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

export const parseCookie = (cookieHeader = '') => {
  const result = {};
  cookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .forEach((part) => {
      const index = part.indexOf('=');
      if (index <= 0) return;
      const key = part.slice(0, index).trim();
      const value = part.slice(index + 1).trim();
      result[key] = value;
    });
  return result;
};

export const randomDigits = (length = 6) => {
  const values = new Uint8Array(length);
  crypto.getRandomValues(values);
  return Array.from(values, (value) => String(value % 10)).join('');
};

export const randomToken = (bytes = 32) => {
  const values = new Uint8Array(bytes);
  crypto.getRandomValues(values);
  return Array.from(values, (value) => value.toString(16).padStart(2, '0')).join('');
};

export const sha256Hex = async (input) => {
  const data = new TextEncoder().encode(String(input || ''));
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
};

export const hashCode = async (email, mode, code, secret) =>
  sha256Hex(`${secret}:otp:${mode}:${normalizeEmail(email)}:${String(code || '')}`);

export const hashSessionToken = async (token, secret) => sha256Hex(`${secret}:session:${String(token || '')}`);
