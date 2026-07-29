import { validateJwt } from './validateJwt';
import { TokenStatus, checkTokenExpiration } from './checkTokenExpiration';

/**
 * Combined validation and expiration check for convenience.
 * For more granular control, use validateJwt + checkTokenExpiration separately.
 * @returns INVALID (malformed/unparseable token), EXPIRED, REFRESH_REQUIRED, or VALID
 */
export default function validateTokenAndCheckExpiration(token: string): TokenStatus {
  const decoded = validateJwt(token);
  if (!decoded) {
    return TokenStatus.INVALID;
  }
  return checkTokenExpiration(decoded.exp, decoded.iat);
}
