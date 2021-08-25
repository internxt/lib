import crypto from 'crypto';

interface AESInit {
  iv: string;
  salt: string;
}

/**
 *
 * @param text Text to encrypt
 * @param password
 * @param aesInit Object that contains IV + Salt. If its null, random bytes will be used.
 * @param hops
 * @returns Encrypted text
 */
export default function encrypt(text: string, password: string, aesInit: AESInit | null = null, hops = 2145): string {
  // random initialization vector
  const iv = aesInit ? Buffer.from(aesInit.iv || '', 'hex') : crypto.randomBytes(16);

  // random salt
  const salt = aesInit ? Buffer.from(aesInit.salt || '', 'hex') : crypto.randomBytes(64);

  // derive encryption key: 32 byte key length
  // in assumption the masterkey is a cryptographic and NOT a password there is no need for
  // a large number of iterations. It may can replaced by HKDF
  // the value of 2145 is randomly chosen!
  const key = crypto.pbkdf2Sync(password, salt, hops, 32, 'sha512');

  // AES 256 GCM Mode
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  // encrypt the given text
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

  // extract the auth tag
  const tag = cipher.getAuthTag();

  // generate output
  return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
}
