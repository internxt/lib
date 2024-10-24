import crypto from 'crypto';

/**
 *
 * @param encdata Encrypted text
 * @param password
 * @returns Decrypted text
 */
export default function decrypt(encdata: string, password: string): string {
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
  const key = Uint8Array.from(crypto.scryptSync(password, salt, 32));

  // AES 256 GCM Mode
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  let str = decipher.update(text, undefined, 'utf8');
  decipher.setAuthTag(tag);
  str += decipher.final('utf8');

  return str;
}
