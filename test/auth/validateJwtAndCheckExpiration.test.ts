import { describe, expect, test } from 'vitest';
import validateJwtAndCheckExpiration from '../../src/auth/validateJwtAndCheckExpiration';

describe('validateJwtAndCheckExpiration tests', () => {
  test('when the token is an empty string, then null is returned', () => {
    expect(validateJwtAndCheckExpiration('')).to.be.equal(null);
  });

  test('when the token does not have the expected format, then null is returned', () => {
    expect(validateJwtAndCheckExpiration('invalid')).to.be.equal(null);
    expect(validateJwtAndCheckExpiration('invalid.token')).to.be.equal(null);
  });

  test('when the token payload is not valid base64 encoding, then null is returned', () => {
    const invalidToken = 'eyJhbGciOiJIUzI1NiJ9.!!!invalid_base64!!!.signature';
    expect(validateJwtAndCheckExpiration(invalidToken)).to.be.equal(null);
  });

  test('when the token header is not valid JSON, then null is returned', () => {
    const token = 'invalid-json.eyJzdWIiOiJ1c2VyMTIzIn0=.signature';
    expect(validateJwtAndCheckExpiration(token)).to.be.equal(null);
  });

  test('when the token header is missing the alg field, then null is returned', () => {
    const header = Buffer.from(JSON.stringify({ typ: 'JWT' })).toString('base64');
    const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64');
    const token = `${header}.${payload}.signature`;
    expect(validateJwtAndCheckExpiration(token)).to.be.equal(null);
  });

  test('when the token has a negative expiration value, then null is returned', () => {
    const payload = Buffer.from(JSON.stringify({ exp: -1 })).toString('base64');
    const token = `eyJhbGciOiJIUzI1NiJ9.${payload}.signature`;
    expect(validateJwtAndCheckExpiration(token)).to.be.equal(null);
  });

  test('when the token does not contain an expiration claim, then null is returned', () => {
    const payload = Buffer.from(JSON.stringify({ sub: 'user123' })).toString('base64');
    const token = `eyJhbGciOiJIUzI1NiJ9.${payload}.signature`;
    expect(validateJwtAndCheckExpiration(token)).to.be.equal(null);
  });

  test('when the token expiration value is not a number, then null is returned', () => {
    const payload = Buffer.from(JSON.stringify({ exp: 'not-a-number' })).toString('base64');
    const token = `eyJhbGciOiJIUzI1NiJ9.${payload}.signature`;
    expect(validateJwtAndCheckExpiration(token)).to.be.equal(null);
  });

  test('when the token has a valid structure with expiration, then the exp and iat claims are returned', () => {
    const expiration = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    const payload = Buffer.from(JSON.stringify({ exp: expiration, sub: 'user123' })).toString('base64');
    const token = `eyJhbGciOiJIUzI1NiJ9.${payload}.signature`;
    expect(validateJwtAndCheckExpiration(token)).to.deep.equal({
      exp: expiration,
      iat: null,
    });
  });

  test('when the token payload is base64url-encoded with characters outside the standard alphabet, then the claims are returned', () => {
    const issuedAt = 1577836800;
    const expiration = 4102444800;
    // Payload encodes to a segment containing both - and _ (base64url alphabet)
    const payload = Buffer.from(JSON.stringify({ exp: expiration, iat: issuedAt, sub: 'WO¥þ=(E' })).toString(
      'base64url',
    );
    expect(payload).to.match(/-/);
    expect(payload).to.match(/_/);
    const token = `eyJhbGciOiJIUzI1NiJ9.${payload}.signature`;
    expect(validateJwtAndCheckExpiration(token)).to.deep.equal({
      exp: expiration,
      iat: issuedAt,
    });
  });

  test('when the token has a valid structure with expiration and issued-at, then both claims are returned', () => {
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiration = issuedAt + 3600; // 1 hour from now
    const payload = Buffer.from(JSON.stringify({ exp: expiration, iat: issuedAt, sub: 'user123' })).toString('base64');
    const token = `eyJhbGciOiJIUzI1NiJ9.${payload}.signature`;
    expect(validateJwtAndCheckExpiration(token)).to.deep.equal({
      exp: expiration,
      iat: issuedAt,
    });
  });
});
