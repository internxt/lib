import { auth } from '../../src';

const { isValidEmail } = auth;

describe('isValidEmail tests', () => {
  it('should consider valid a well formed email', () => {
    expect(isValidEmail('test@internxt.com')).toBe(true);
  });

  it('should consider invalid an email with uppercase letters', () => {
    expect(isValidEmail('TEST@internxt.com')).toBe(false);
    expect(isValidEmail('test@INTERNXT.com')).toBe(false);
    expect(isValidEmail('test@internxt.COM')).toBe(false);
    expect(isValidEmail('TEST@INTERNXT.COM')).toBe(false);
  });

  it('should consider valid an email with allowed symbols', () => {
    expect(isValidEmail("test-symbols45!#$%&'*+-/=?^_`{|@internxt.com")).toBe(true);
  });

  it('should consider invalid an email without recipient', () => {
    expect(isValidEmail('@internxt.com')).toBe(false);
    expect(isValidEmail('internxt.com')).toBe(false);
  });

  it('should consider invalid an email without domain', () => {
    expect(isValidEmail('test@.com')).toBe(false);
  });

  it('should consider invalid an email without top-leveldomain', () => {
    expect(isValidEmail('test@internxt')).toBe(false);
  });

  it('should consider an email with more than one at sign', () => {
    expect(isValidEmail('test@@internxt.com')).toBe(false);
  });
});
