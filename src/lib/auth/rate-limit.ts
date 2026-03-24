type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const attempts = new Map<string, RateLimitEntry>();

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") || "unknown";
}

export function isRateLimited(
  key: string,
  limit = 5,
  windowMs = 15 * 60 * 1000,
): boolean {
  const now = Date.now();
  const existing = attempts.get(key);

  if (!existing || now > existing.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (existing.count >= limit) {
    return true;
  }

  existing.count += 1;
  attempts.set(key, existing);
  return false;
}
