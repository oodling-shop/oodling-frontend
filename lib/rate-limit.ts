/**
 * Simple in-memory rate limiter.
 * In production, use Redis or a similar persistent store.
 */
const rateLimitStore = new Map<string, { count: number; lastRequest: number }>();

export function isRateLimited(identifier: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record) {
    rateLimitStore.set(identifier, { count: 1, lastRequest: now });
    return false;
  }

  if (now - record.lastRequest > windowMs) {
    rateLimitStore.set(identifier, { count: 1, lastRequest: now });
    return false;
  }

  if (record.count >= limit) {
    return true;
  }

  record.count += 1;
  return false;
}
