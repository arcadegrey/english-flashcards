import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

// OWASP's 16 MiB scrypt profile. Native Workers crypto avoids bundling a JS KDF.
const options = { N: 16384, r: 8, p: 5, maxmem: 32 * 1024 * 1024 };
const derive = (password, salt) => new Promise((resolve, reject) => {
  scrypt(password, salt, 32, options, (error, key) => error ? reject(error) : resolve(key));
});
export const DUMMY_PASSWORD_HASH = `scrypt$16384$8$5$${'0'.repeat(32)}$${'0'.repeat(64)}`;
const recordPattern = /^scrypt\$16384\$8\$5\$([a-f0-9]{32})\$([a-f0-9]{64})$/;

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const key = await derive(password, salt);
  return `scrypt$16384$8$5$${salt}$${key.toString('hex')}`;
}

export async function verifyPassword(password, encoded) {
  const match = recordPattern.exec(encoded || '');
  const [, salt, expected] = match || recordPattern.exec(DUMMY_PASSWORD_HASH);
  const key = await derive(password, salt);
  const bytes = Uint8Array.from(expected.match(/../g), value => parseInt(value, 16));
  return timingSafeEqual(key, bytes) && Boolean(match);
}
