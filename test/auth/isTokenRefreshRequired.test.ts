import { describe, expect, test } from 'vitest';
import { isTokenRefreshRequired } from '../../src/auth/checkTokenExpiration';

describe('isTokenRefreshRequired tests', () => {
  test('when the token has already expired, then refresh is not reported as required', () => {
    const oneSecondAgo = Math.floor(Date.now() / 1000) - 1;
    expect(isTokenRefreshRequired(oneSecondAgo)).to.be.equal(false);
  });

  describe('without an issued-at claim (falls back to a fixed 6-hour margin)', () => {
    test('when the token expires in three hours, then refresh is required', () => {
      const threeHoursFromNow = Math.floor(Date.now() / 1000) + 3 * 60 * 60;
      expect(isTokenRefreshRequired(threeHoursFromNow)).to.be.equal(true);
    });

    test('when the token expires in exactly six hours, then refresh is required', () => {
      const sixHoursFromNow = Math.floor(Date.now() / 1000) + 6 * 60 * 60;
      expect(isTokenRefreshRequired(sixHoursFromNow)).to.be.equal(true);
    });

    test('when the token expires in more than six hours, then refresh is not required', () => {
      const sixHoursPlusOneSecond = Math.floor(Date.now() / 1000) + 6 * 60 * 60 + 1;
      expect(isTokenRefreshRequired(sixHoursPlusOneSecond)).to.be.equal(false);
    });

    test('when the token expires in thirty days, then refresh is not required', () => {
      const thirtyDaysFromNow = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
      expect(isTokenRefreshRequired(thirtyDaysFromNow)).to.be.equal(false);
    });
  });

  describe('with an issued-at claim (50% of total lifetime)', () => {
    test('when less than 50% of the lifetime remains, then refresh is required', () => {
      const now = Math.floor(Date.now() / 1000);
      const issuedAt = now - 16 * 60 * 60; // issued 16h ago
      const expiration = now + 15 * 60 * 60; // expires in 15h (total lifetime 31h, 48% remaining)
      expect(isTokenRefreshRequired(expiration, issuedAt)).to.be.equal(true);
    });

    test('when exactly 50% of the lifetime remains, then refresh is required', () => {
      const issuedAt = Math.floor(Date.now() / 1000) - 16 * 60 * 60; // issued 16h ago
      const expiration = issuedAt + 32 * 60 * 60; // total lifetime 32h, 16h (50%) remaining
      expect(isTokenRefreshRequired(expiration, issuedAt)).to.be.equal(true);
    });

    test('when more than 50% of the lifetime remains, then refresh is not required', () => {
      const issuedAt = Math.floor(Date.now() / 1000) - 8 * 60 * 60; // issued 8h ago
      const expiration = issuedAt + 32 * 60 * 60; // total lifetime 32h, 24h (75%) remaining
      expect(isTokenRefreshRequired(expiration, issuedAt)).to.be.equal(false);
    });

    test('when the token has a long lifetime, then refresh is not required until past the halfway point', () => {
      const issuedAt = Math.floor(Date.now() / 1000);
      const expiration = issuedAt + 30 * 24 * 60 * 60; // 30 day lifetime
      expect(isTokenRefreshRequired(expiration, issuedAt)).to.be.equal(false);
    });
  });
});
