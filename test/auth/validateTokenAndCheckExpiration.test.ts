import { describe, expect, test } from 'vitest';
import { auth } from '../../src';

const { validateTokenAndCheckExpiration, TokenStatus } = auth;

describe('validateTokenAndCheckExpiration tests', () => {
  test('when the token is malformed, then INVALID is returned', () => {
    expect(validateTokenAndCheckExpiration('invalid.token')).to.be.equal(TokenStatus.INVALID);
  });

  test('when the token is structurally valid but has expired, then EXPIRED is returned', () => {
    const expiration = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
    const payload = Buffer.from(JSON.stringify({ exp: expiration })).toString('base64');
    const token = `header.${payload}.signature`;

    expect(validateTokenAndCheckExpiration(token)).to.be.equal(TokenStatus.EXPIRED);
  });

  test('when the token is valid and expires within six hours, then REFRESH_REQUIRED is returned', () => {
    const expiration = Math.floor(Date.now() / 1000) + 6 * 60 * 60; // 6 hours from now
    const payload = Buffer.from(JSON.stringify({ exp: expiration })).toString('base64');
    const token = `header.${payload}.signature`;

    expect(validateTokenAndCheckExpiration(token)).to.be.equal(TokenStatus.REFRESH_REQUIRED);
  });

  test('when the token is valid, has an issued-at claim, and is past 50% of its lifetime, then REFRESH_REQUIRED is returned', () => {
    const issuedAt = Math.floor(Date.now() / 1000) - 16 * 60 * 60; // issued 16h ago
    const expiration = issuedAt + 32 * 60 * 60; // total lifetime 32h, 16h (50%) remaining
    const payload = Buffer.from(JSON.stringify({ exp: expiration, iat: issuedAt })).toString('base64');
    const token = `header.${payload}.signature`;

    expect(validateTokenAndCheckExpiration(token)).to.be.equal(TokenStatus.REFRESH_REQUIRED);
  });

  test('when the token is valid and expires in thirty days, then VALID is returned', () => {
    const expiration = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days from now
    const payload = Buffer.from(JSON.stringify({ exp: expiration })).toString('base64');
    const token = `header.${payload}.signature`;

    expect(validateTokenAndCheckExpiration(token)).to.be.equal(TokenStatus.VALID);
  });
});
