import validateJwtAndCheckExpiration from './validateJwtAndCheckExpiration';
import checkTokenExpiration, { TokenStatus } from './checkTokenExpiration';

/**
 * Combined validation and expiration check for convenience.
 * For more granular control, use validateJwtAndCheckExpiration + checkTokenExpiration separately.
 * @returns INVALID (malformed/unparseable token), EXPIRED, REFRESH_REQUIRED, or VALID
 */
export default function validateTokenAndCheckExpiration(token: string): TokenStatus {
  const decoded = validateJwtAndCheckExpiration(token);
  if (!decoded) {
    return TokenStatus.INVALID;
  }
  return checkTokenExpiration(decoded.exp, decoded.iat);
}
