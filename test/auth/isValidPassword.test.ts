import { auth } from '../../src';

const { isValidPassword } = auth;

describe('isValidPassword tests', () => {
  it('should consider valid a password with lowercase, uppercase, numbers and a length between 8 and 128 characters', () => {
    expect(isValidPassword('Testtest4')).toBe(true);
    expect(isValidPassword('tESTtest4')).toBe(true);
    expect(isValidPassword('4..TestTest')).toBe(true);
    expect(isValidPassword('aVeryLongPasswordButNotTooLong44')).toBe(true);
  });

  it('should consider invalid a password with lowercase, uppercase, numbers and a length shorter than 8 characters', () => {
    expect(isValidPassword('Test4')).toBe(false);
  });

  it('should consider invalid a password with lowercase, uppercase, numbers and a length larger than 128 characters', () => {
    const base = 'Test4';

    let password = '';

    for (let i = 0; i < 26; i++) {
      password += base;
    }

    expect(isValidPassword(password)).toBe(false);
  });

  it('should consider invalid a password without uppercase', () => {
    expect(isValidPassword('test4')).toBe(false);
    expect(isValidPassword('test4testtest')).toBe(false);
    expect(isValidPassword('testtesttest')).toBe(false);
  });

  it('should consider invalid a password without lowercase', () => {
    expect(isValidPassword('TEST4')).toBe(false);
    expect(isValidPassword('TEST4TESTTEST')).toBe(false);
    expect(isValidPassword('TESTTESTTEST')).toBe(false);
  });

  it('should consider invalid a password without numbers', () => {
    expect(isValidPassword('Test')).toBe(false);
    expect(isValidPassword('TestTestTest')).toBe(false);
    expect(isValidPassword('tESTtEST')).toBe(false);
  });
});
