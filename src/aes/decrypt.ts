import crypto from 'crypto';

/**
 *
 * @param encdata Encrypted text
 * @param password
 * @param iterations
 * @returns Decrypted text
 */
export default function decrypt(encdata: string, password: string, iterations = 2145): string {
  // base64 decoding
  const bData = Buffer.from(encdata, 'base64');

  // convert data to buffers
  const salt = bData.slice(0, 64);
  const iv = bData.slice(64, 80);
  const tag = bData.slice(80, 96);
  const text = bData.slice(96);

  if (salt.length === 0 || iv.length === 0 || tag.length === 0 || text.length === 0) {
    throw Error('Length 0, cannot decrypt');
  }

  // derive key using; 32 byte key length
  const key = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha512');

  // AES 256 GCM Mode
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);

  decipher.setAuthTag(tag);

  // encrypt the given text
  const decrypted = decipher.update(text, undefined, 'utf8') + decipher.final('utf8');

  return decrypted;
}
