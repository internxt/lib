import { describe, expect, it } from 'vitest';
import validateJwtAndCheckExpiration from '../../src/auth/validateJwtAndCheckExpiration';

describe('validateJwtAndCheckExpiration tests', () => {
  it('when the token is an empty string, then null is returned', () => {
    expect(validateJwtAndCheckExpiration('')).to.be.equal(null);
  });

  it('when the token does not have the expected format, then null is returned', () => {
    expect(validateJwtAndCheckExpiration('invalid')).to.be.equal(null);
    expect(validateJwtAndCheckExpiration('invalid.token')).to.be.equal(null);
  });

  it('when the token payload is not valid base64 encoding, then null is returned', () => {
    const invalidToken = 'header.!!!invalid_base64!!!.signature';
    expect(validateJwtAndCheckExpiration(invalidToken)).to.be.equal(null);
  });

  it('when the token does not contain an expiration claim, then null is returned', () => {
    const payload = btoa(JSON.stringify({ sub: 'user123' }));
    const token = `header.${payload}.signature`;
    expect(validateJwtAndCheckExpiration(token)).to.be.equal(null);
  });

  it('when the token expiration value is not a number, then null is returned', () => {
    const payload = btoa(JSON.stringify({ exp: 'not-a-number' }));
    const token = `header.${payload}.signature`;
    expect(validateJwtAndCheckExpiration(token)).to.be.equal(null);
  });

  it('when the token has a valid structure with expiration, then the exp and iat claims are returned', () => {
    const expiration = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    const payload = btoa(JSON.stringify({ exp: expiration, sub: 'user123' }));
    const token = `header.${payload}.signature`;
    expect(validateJwtAndCheckExpiration(token)).to.deep.equal({
      exp: expiration,
      iat: null,
    });
  });

  it('when the token has a valid structure with expiration and issued-at, then both claims are returned', () => {
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiration = issuedAt + 3600; // 1 hour from now
    const payload = btoa(JSON.stringify({ exp: expiration, iat: issuedAt, sub: 'user123' }));
    const token = `header.${payload}.signature`;
    expect(validateJwtAndCheckExpiration(token)).to.deep.equal({
      exp: expiration,
      iat: issuedAt,
    });
  });
});
