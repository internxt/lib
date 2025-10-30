import { describe, expect, it } from 'vitest';
import { items } from '../../src';

const { isInvalidFilename } = items;

describe('isInvalidFilename tests', () => {
  it('should return true if a name is empty', () => {
    expect(isInvalidFilename('')).toBe(true);
  });

  it('should return true if a name consists only of spaces', () => {
    expect(isInvalidFilename(' ')).toBe(true);
    expect(isInvalidFilename('  ')).toBe(true);
  });

  it('should return true if a name contains "/" or "\\"', () => {
    expect(isInvalidFilename('slash/')).toBe(true);
    expect(isInvalidFilename('slash\\')).toBe(true);
    expect(isInvalidFilename('/slash\\')).toBe(true);
    expect(isInvalidFilename('/')).toBe(true);
    expect(isInvalidFilename('\\')).toBe(true);
    expect(isInvalidFilename(' /')).toBe(true);
    expect(isInvalidFilename(' \\')).toBe(true);
  });

  it('should return true if a name consists only of spaces', () => {
    expect(isInvalidFilename(' ')).toBe(true);
    expect(isInvalidFilename('  ')).toBe(true);
  });

  it('should return true if a name ends with a space', () => {
    expect(isInvalidFilename('test ')).toBe(true);
  });

  it('should return true if a name its hidden', () => {
    expect(isInvalidFilename('.test')).toBe(true);
    expect(isInvalidFilename('.test.test')).toBe(true);
    expect(isInvalidFilename('.test.test.test')).toBe(true);
  });

  it('should return false if a name its just a word', () => {
    expect(isInvalidFilename('test')).toBe(false);
  });

  it('should return false if a name its formed by two words or more words separated by spaces', () => {
    expect(isInvalidFilename('test test')).toBe(false);
    expect(isInvalidFilename('test test test')).toBe(false);
  });

  it('should return false if a name its formed by two words or more words separated by dots', () => {
    expect(isInvalidFilename('test.test')).toBe(false);
    expect(isInvalidFilename('test.test.test')).toBe(false);
  });
});
