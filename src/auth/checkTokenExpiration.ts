export const TokenStatus = {
  INVALID: 'INVALID',
  EXPIRED: 'EXPIRED',
  REFRESH_REQUIRED: 'REFRESH_REQUIRED',
  VALID: 'VALID',
} as const;

export type TokenStatus = (typeof TokenStatus)[keyof typeof TokenStatus];

const SIX_HOURS_IN_SECONDS = 6 * 60 * 60;

/**
 * Checks whether a token has expired.
 * @param expirationTimestamp - Unix timestamp in seconds
 */
export function isTokenExpired(expirationTimestamp: number): boolean {
  const currentTime = Math.floor(Date.now() / 1000);
  return expirationTimestamp - currentTime <= 0;
}

/**
 * Checks whether a token needs to be refreshed. Refresh is required once the remaining
 * time drops to 50% of the token's total lifetime (exp - iat). Falls back to a fixed
 * 6-hour margin when the issued-at claim isn't available to compute the lifetime.
 * Returns false for a token that has already expired.
 * @param expirationTimestamp - Unix timestamp in seconds the token expires at
 * @param issuedAtTimestamp - Unix timestamp in seconds the token was issued at
 */
export function isTokenRefreshRequired(expirationTimestamp: number, issuedAtTimestamp?: number | null): boolean {
  const currentTime = Math.floor(Date.now() / 1000);
  const remainingSeconds = expirationTimestamp - currentTime;

  const refreshThreshold =
    typeof issuedAtTimestamp === 'number' ? (expirationTimestamp - issuedAtTimestamp) / 2 : SIX_HOURS_IN_SECONDS;

  return remainingSeconds > 0 && remainingSeconds <= refreshThreshold;
}

/**
 * Checks token expiration status. See isTokenExpired and isTokenRefreshRequired
 * for the individual checks, or use those directly if only one is needed.
 * @param expirationTimestamp - Unix timestamp in seconds the token expires at
 * @param issuedAtTimestamp - Unix timestamp in seconds the token was issued at
 * @returns EXPIRED, REFRESH_REQUIRED, or VALID
 */
export default function checkTokenExpiration(
  expirationTimestamp: number,
  issuedAtTimestamp?: number | null,
): TokenStatus {
  if (isTokenExpired(expirationTimestamp)) {
    return TokenStatus.EXPIRED;
  }
  if (isTokenRefreshRequired(expirationTimestamp, issuedAtTimestamp)) {
    return TokenStatus.REFRESH_REQUIRED;
  }
  return TokenStatus.VALID;
}
