import { describe, expect, it } from 'vitest';
import { auth } from '../../src';

const { checkTokenExpiration, TokenStatus } = auth;

describe('checkTokenExpiration tests', () => {
  it('when the token expired more than two days ago, then it is EXPIRED', () => {
    const threeDaysAgo = Math.floor(Date.now() / 1000) - 3 * 24 * 60 * 60;
    expect(checkTokenExpiration(threeDaysAgo)).to.be.equal(TokenStatus.EXPIRED);
  });

  it('when the token expired one second ago, then it is EXPIRED', () => {
    const oneSecondAgo = Math.floor(Date.now() / 1000) - 1;
    expect(checkTokenExpiration(oneSecondAgo)).to.be.equal(TokenStatus.EXPIRED);
  });

  it('when the token expires at the current moment, then it is considered EXPIRED', () => {
    const now = Math.floor(Date.now() / 1000);
    expect(checkTokenExpiration(now)).to.be.equal(TokenStatus.EXPIRED);
  });

  describe('without an issued-at claim (falls back to a fixed 6-hour margin)', () => {
    it('when the token expires in three hours, then it is REFRESH_REQUIRED', () => {
      const threeHoursFromNow = Math.floor(Date.now() / 1000) + 3 * 60 * 60;
      expect(checkTokenExpiration(threeHoursFromNow)).to.be.equal(TokenStatus.REFRESH_REQUIRED);
    });

    it('when the token expires in exactly six hours, then it is REFRESH_REQUIRED', () => {
      const sixHoursFromNow = Math.floor(Date.now() / 1000) + 6 * 60 * 60;
      expect(checkTokenExpiration(sixHoursFromNow)).to.be.equal(TokenStatus.REFRESH_REQUIRED);
    });

    it('when the token expires in more than six hours, then it is VALID', () => {
      const sixHoursPlusOneSecond = Math.floor(Date.now() / 1000) + 6 * 60 * 60 + 1;
      expect(checkTokenExpiration(sixHoursPlusOneSecond)).to.be.equal(TokenStatus.VALID);
    });

    it('when the token expires in thirty days, then it is VALID', () => {
      const thirtyDaysFromNow = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
      expect(checkTokenExpiration(thirtyDaysFromNow)).to.be.equal(TokenStatus.VALID);
    });
  });

  describe('with an issued-at claim (50% of total lifetime)', () => {
    it('when less than 50% of the lifetime remains, then it is REFRESH_REQUIRED', () => {
      const now = Math.floor(Date.now() / 1000);
      const issuedAt = now - 16 * 60 * 60; // issued 16h ago
      const expiration = now + 15 * 60 * 60; // expires in 15h (total lifetime 31h, 48% remaining)
      expect(checkTokenExpiration(expiration, issuedAt)).to.be.equal(TokenStatus.REFRESH_REQUIRED);
    });

    it('when exactly 50% of the lifetime remains, then it is REFRESH_REQUIRED', () => {
      const issuedAt = Math.floor(Date.now() / 1000) - 16 * 60 * 60; // issued 16h ago
      const expiration = issuedAt + 32 * 60 * 60; // total lifetime 32h, 16h (50%) remaining
      expect(checkTokenExpiration(expiration, issuedAt)).to.be.equal(TokenStatus.REFRESH_REQUIRED);
    });

    it('when more than 50% of the lifetime remains, then it is VALID', () => {
      const issuedAt = Math.floor(Date.now() / 1000) - 8 * 60 * 60; // issued 8h ago
      const expiration = issuedAt + 32 * 60 * 60; // total lifetime 32h, 24h (75%) remaining
      expect(checkTokenExpiration(expiration, issuedAt)).to.be.equal(TokenStatus.VALID);
    });

    it('when the token has a long lifetime, then it is VALID until past the halfway point', () => {
      const issuedAt = Math.floor(Date.now() / 1000);
      const expiration = issuedAt + 30 * 24 * 60 * 60; // 30 day lifetime
      expect(checkTokenExpiration(expiration, issuedAt)).to.be.equal(TokenStatus.VALID);
    });
  });
});
