import { describe, expect, it } from 'vitest';
import { auth } from '../../src';

const { validateTokenAndCheckExpiration, TokenStatus } = auth;

describe('validateTokenAndCheckExpiration tests', () => {
  it('when the token is malformed, then INVALID is returned', () => {
    expect(validateTokenAndCheckExpiration('invalid.token')).to.be.equal(TokenStatus.INVALID);
  });

  it('when the token is structurally valid but has expired, then EXPIRED is returned', () => {
    const expiration = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
    const payload = btoa(JSON.stringify({ exp: expiration }));
    const token = `header.${payload}.signature`;

    expect(validateTokenAndCheckExpiration(token)).to.be.equal(TokenStatus.EXPIRED);
  });

  it('when the token is valid and expires within six hours, then REFRESH_REQUIRED is returned', () => {
    const expiration = Math.floor(Date.now() / 1000) + 6 * 60 * 60; // 6 hours from now
    const payload = btoa(JSON.stringify({ exp: expiration }));
    const token = `header.${payload}.signature`;

    expect(validateTokenAndCheckExpiration(token)).to.be.equal(TokenStatus.REFRESH_REQUIRED);
  });

  it('when the token is valid, has an issued-at claim, and is past 50% of its lifetime, then REFRESH_REQUIRED is returned', () => {
    const issuedAt = Math.floor(Date.now() / 1000) - 16 * 60 * 60; // issued 16h ago
    const expiration = issuedAt + 32 * 60 * 60; // total lifetime 32h, 16h (50%) remaining
    const payload = btoa(JSON.stringify({ exp: expiration, iat: issuedAt }));
    const token = `header.${payload}.signature`;

    expect(validateTokenAndCheckExpiration(token)).to.be.equal(TokenStatus.REFRESH_REQUIRED);
  });

  it('when the token is valid and expires in thirty days, then VALID is returned', () => {
    const expiration = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days from now
    const payload = btoa(JSON.stringify({ exp: expiration }));
    const token = `header.${payload}.signature`;

    expect(validateTokenAndCheckExpiration(token)).to.be.equal(TokenStatus.VALID);
  });
});
