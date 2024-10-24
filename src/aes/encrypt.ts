import crypto from 'crypto';

/**
 *
 * @param text Text to encrypt
 * @param password
 * @returns Encrypted text
 */
export default function encrypt(text: string, password: string): string {
 
  // random salt
  const salt = crypto.randomBytes(64);

  const key = Uint8Array.from(crypto.scryptSync(password, salt, 32));

  // random initialization vector
  const iv = crypto.randomBytes(16);

  // AES 256 GCM Mode
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  // encrypt the given text
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

  // extract the auth tag
  const tag = cipher.getAuthTag();

  // generate output
  return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
}
