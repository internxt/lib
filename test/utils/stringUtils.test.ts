import { describe, expect, it } from 'vitest';
import { stringUtils } from '../../src';

const { base64UrlSafetoUUID, fromBase64UrlSafe, generateRandomStringUrlSafe, toBase64UrlSafe, validateV4Uuid } =
  stringUtils;

describe('stringUtils', () => {
  describe('toBase64UrlSafe', () => {
    it('converts standard Base64 to URL-safe Base64', () => {
      const base64 = 'KHh+VVwlYjs/J3E=';
      const urlSafe = toBase64UrlSafe(base64);
      expect(urlSafe).toBe('KHh-VVwlYjs_J3E');
    });

    it('removes trailing "=" characters', () => {
      const base64 = 'KHh+VVwlYjs/J3FiYw==';
      const urlSafe = toBase64UrlSafe(base64);
      expect(urlSafe).toBe('KHh-VVwlYjs_J3FiYw');
    });

    it('does not modify already URL-safe Base64 strings', () => {
      const base64 = 'KHh-VVwlYjs_J3E';
      const urlSafe = toBase64UrlSafe(base64);
      expect(urlSafe).toBe(base64);
    });
  });

  describe('fromBase64UrlSafe', () => {
    it('converts URL-safe Base64 back to standard Base64', () => {
      const urlSafe = 'KHh-VVwlYjs_J3E';
      const base64 = fromBase64UrlSafe(urlSafe);
      expect(base64).toBe('KHh+VVwlYjs/J3E=');
    });

    it('does not modify already standard Base64 strings', () => {
      const urlSafe = 'KHh+VVwlYjs/J3FiYw==';
      const base64 = fromBase64UrlSafe(urlSafe);
      expect(base64).toBe(urlSafe);
    });
  });

  describe('generateRandomStringUrlSafe', () => {
    const getRandomNumber = (min: number, max: number) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    it('generates a string of the specified length', () => {
      const length = getRandomNumber(1, 1000);
      const randomString = generateRandomStringUrlSafe(length);
      expect(randomString).toHaveLength(length);
    });

    it('generates a URL-safe string', () => {
      const randomString = generateRandomStringUrlSafe(1000);
      expect(randomString).not.toMatch(/[+/=]/);
    });

    it('throws an error if size is not positive', () => {
      expect(() => generateRandomStringUrlSafe(0)).toThrow('Size must be a positive integer');
      expect(() => generateRandomStringUrlSafe(-5)).toThrow('Size must be a positive integer');
    });
  });

  describe('base64UrlSafetoUUID', () => {
    it('converts a Base64 URL-safe string to a UUID v4 format', () => {
      const base64UrlSafe = '8yqR2seZThOqF4xNngMjyQ';
      const uuid = base64UrlSafetoUUID(base64UrlSafe);
      expect(uuid).toBe('f32a91da-c799-4e13-aa17-8c4d9e0323c9');
    });
  });

  describe('validateV4Uuid', () => {
    it('should return true for a valid UUIDv4', () => {
      expect(validateV4Uuid('f32a91da-c799-4e13-aa17-8c4d9e0323c9')).toBe(true);
    });

    it('should return false for an invalid UUIDv4', () => {
      expect(validateV4Uuid('invalid-uuid')).toBe(false);
      expect(validateV4Uuid('f32a91da-c799-4e13-aa17-8c4d9e0323c99')).toBe(false);
      expect(validateV4Uuid('00000000-0000-0000-0000-000000000000')).toBe(false);
      expect(validateV4Uuid('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')).toBe(false);
    });

    it('should return false for an empty string', () => {
      expect(validateV4Uuid('')).toBe(false);
    });

    it('should return false for a string with incorrect length', () => {
      expect(validateV4Uuid('12345678-1234-1234-1234-123456789012')).toBe(false);
    });
  });
});
