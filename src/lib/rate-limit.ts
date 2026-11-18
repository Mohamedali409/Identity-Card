interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitEntry>();

export function checkRateLimit(key: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
} {
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || entry.resetAt <= now) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return {
      allowed: true,
      remaining: maxAttempts - 1,
      resetInSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (entry.count >= maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: maxAttempts - entry.count,
    resetInSeconds: Math.ceil((entry.resetAt - now) / 1000),
  };
}
