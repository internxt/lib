export interface DecodedJwtClaims {
  exp: number;
  iat: number | null;
}

function decodeBase64UrlSegment(seg: string): string {
  return Buffer.from(seg.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString();
}

/**
 * Validates JWT token structure, header (presence of alg), and parses the expiration and issued-at claims.
 * Does not verify signature or issuer.
 * @returns The exp and iat claims (iat is null if absent), or null if invalid structure
 */
export default function validateJwtAndCheckExpiration(token: string): DecodedJwtClaims | null {
  if (typeof token !== 'string' || token.split('.').length !== 3) {
    return null;
  }

  try {
    const [headerSeg, payloadSeg] = token.split('.');

    const header = JSON.parse(decodeBase64UrlSegment(headerSeg));
    if (typeof header.alg !== 'string') {
      return null;
    }

    const payload = JSON.parse(decodeBase64UrlSegment(payloadSeg));
    if (typeof payload.exp !== 'number' || payload.exp < 0) {
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
