export interface DecodedJwtClaims {
  exp: number;
  iat: number | null;
}

/**
 * Validates JWT token structure and parses the expiration and issued-at claims.
 * Does not verify signature or issuer.
 * @returns The exp and iat claims (iat is null if absent), or null if invalid structure
 */
export default function validateJwtAndCheckExpiration(token: string): DecodedJwtClaims | null {
  if (typeof token !== 'string' || token.split('.').length !== 3) {
    return null;
  }

  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(Buffer.from(base64, 'base64').toString());
    if (typeof payload.exp !== 'number') {
      return null;
    }
    return {
      exp: payload.exp,
      iat: typeof payload.iat === 'number' ? payload.iat : null,
    };
  } catch {
    return null;
  }
}
