import { randomBytes, createHash } from 'crypto';

/**
 * Generates a cryptographically secure, single-use reset token.
 */
export function generateResetToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Hashes a token for secure storage in the database.
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Validates a password against strong password rules:
 * - Minimum length 8
 * - Mixed case (at least one uppercase and one lowercase)
 * - At least one number
 * - At least one special character
 */
export function validatePasswordStrength(password: string): boolean {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecial
  );
}
