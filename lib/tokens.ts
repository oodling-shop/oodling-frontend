import { hashToken } from './auth-utils';

interface ResetToken {
  email: string;
  tokenHash: string;
  expiresAt: Date;
}

/**
 * WARNING: This is an in-memory store for demonstration purposes.
 * In a production environment, this MUST be replaced with a persistent database
 * like Redis, PostgreSQL, or Vercel KV.
 */
const tokenStore = new Map<string, ResetToken>();

/**
 * Stores a token hash with an expiration timestamp.
 */
export async function storeToken(email: string, token: string, ttlMs: number = 3600000) {
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + ttlMs);
  
  tokenStore.set(email, { email, tokenHash, expiresAt });
  
  // Clean up expired tokens periodically (optional but good practice)
  setTimeout(() => {
    const stored = tokenStore.get(email);
    if (stored && stored.expiresAt.getTime() <= Date.now()) {
      tokenStore.delete(email);
    }
  }, ttlMs);
}

/**
 * Verifies if a token is valid and returns the associated email.
 * Invalidates the token after successful verification (single-use).
 */
export async function verifyAndConsumeToken(token: string): Promise<string | null> {
  const tokenHash = hashToken(token);
  
  for (const [email, stored] of tokenStore.entries()) {
    if (stored.tokenHash === tokenHash) {
      if (stored.expiresAt.getTime() > Date.now()) {
        tokenStore.delete(email); // Single-use
        return email;
      } else {
        tokenStore.delete(email); // Expired
        return null;
      }
    }
  }
  
  return null;
}
