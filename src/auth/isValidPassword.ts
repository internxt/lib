// Exported separately also for convenience of some form validators
export const isValidPasswordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,128}$/;

/**
 * @deprecated Use testPasswordStrength instead
 * @param password Password to test
 * @returns Whether is strong enough according to Internxt's policy
 */
export default function isValidPassword(password: string): boolean {
  return !!password.match(isValidPasswordRegex);
}
