import { describe, expect, it } from 'vitest';
import { aes } from '../../src';

describe('AES encrypt/decrypt tests', () => {
  it('should encrypt and decrypt correctly without aes init', () => {
    const baseText = 'This is a test';
    const password = 'test';

    const encryptedText = aes.encrypt(baseText, password);

    const decryptedText = aes.decrypt(encryptedText, password);

    expect(decryptedText).toBe(baseText);
  });
});
