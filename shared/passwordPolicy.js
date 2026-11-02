export const PASSWORD_MIN_LENGTH = 15;
export const PASSWORD_MAX_LENGTH = 128;
export const PASSWORD_HINT = '15–128 个字符，可使用空格和长句，不必凑大小写或符号。';

const commonPasswords = new Set([
  '123456789012345', '1234567890123456', '12345678901234567890',
  'passwordpassword', 'passwordpasswordpassword', 'qwertyuiopasdfgh',
  'letmeinletmeinletmein', 'iloveyouiloveyou',
]);

export function passwordError(password, email = '') {
  if (typeof password !== 'string' || Array.from(password).length < PASSWORD_MIN_LENGTH
    || Array.from(password).length > PASSWORD_MAX_LENGTH) return '密码需为 15–128 个字符。';
  const lower = password.toLowerCase();
  if (!password.trim() || /^(.)\1+$/su.test(password) || commonPasswords.has(lower)
    || lower === String(email).trim().toLowerCase()) return '这个密码太容易被猜到，请换一个较长的短语。';
  return '';
}
