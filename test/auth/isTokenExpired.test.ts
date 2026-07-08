import { describe, expect, it } from 'vitest';
import { isTokenExpired } from '../../src/auth/checkTokenExpiration';

describe('isTokenExpired tests', () => {
  it('when the token expired more than two days ago, then it is expired', () => {
    const threeDaysAgo = Math.floor(Date.now() / 1000) - 3 * 24 * 60 * 60;
    expect(isTokenExpired(threeDaysAgo)).to.be.equal(true);
  });

  it('when the token expired one second ago, then it is expired', () => {
    const oneSecondAgo = Math.floor(Date.now() / 1000) - 1;
    expect(isTokenExpired(oneSecondAgo)).to.be.equal(true);
  });

  it('when the token expires at the current moment, then it is considered expired', () => {
    const now = Math.floor(Date.now() / 1000);
    expect(isTokenExpired(now)).to.be.equal(true);
  });

  it('when the token expires in the future, then it is not expired', () => {
    const oneHourFromNow = Math.floor(Date.now() / 1000) + 60 * 60;
    expect(isTokenExpired(oneHourFromNow)).to.be.equal(false);
  });
});
