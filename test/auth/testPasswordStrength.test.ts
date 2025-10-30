import { describe, expect, it } from 'vitest';
import { auth } from '../../src';

const { testPasswordStrength } = auth;

describe('testPasswordStrength tests', () => {
  it('should consider invalid a password with less than 8 characters', () => {
    const result = testPasswordStrength('abcd', 'whatever');
    expect(result.valid).toBe(false);

    if (result.valid === false) {
      expect(result.reason).toBe('NOT_LONG_ENOUGH');
    }
  });

  it('should consider invalid a password with 8 characters but not complex enough', () => {
    const result = testPasswordStrength('abcdefgh', 'whatever');
    expect(result.valid).toBe(false);

    if (result.valid === false) {
      expect(result.reason).toBe('NOT_COMPLEX_ENOUGH');
    }
  });

  it('should consider invalid a password with lowercase and uppercase but that looks like his name', () => {
    const result = testPasswordStrength('PassWord', 'expert_word_user');
    expect(result.valid).toBe(false);

    if (result.valid === false) {
      expect(result.reason).toBe('NOT_COMPLEX_ENOUGH');
    }
  });

  it('should consider invalid a password with lowercase, uppercase and digits that looks like his name', () => {
    const result = testPasswordStrength('PassWord4', 'expert_word_user');
    expect(result.valid).toBe(true);

    if (result.valid) {
      expect(result.strength).toBe('medium');
    }
  });

  it('should consider invalid a password with lowercase, uppercase and symbols that looks like his name', () => {
    const result = testPasswordStrength('PassWord#', 'expert_word_user');
    expect(result.valid).toBe(true);

    if (result.valid) {
      expect(result.strength).toBe('medium');
    }
  });

  it('should consider invalid a password with lowercase, uppercase, digits and symbols strong', () => {
    const result = testPasswordStrength('PassWord#4', 'expert_word_user');
    expect(result.valid).toBe(true);

    if (result.valid) {
      expect(result.strength).toBe('hard');
    }
  });
});
