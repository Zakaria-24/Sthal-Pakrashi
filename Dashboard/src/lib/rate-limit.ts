/**
 * A small in-memory sliding-window limiter for the one public write endpoint
 * (online applications). It is per server process, which is the right scale
 * for a single-instance school deployment; a multi-instance deployment would
 * back it with Redis instead. It is a brake on abuse, not a security boundary
 * on its own — the endpoint also validates every field and file.
 */
const hits = new Map<string, number[]>();

export function checkRateLimit(
  key: string,
  max: number,
  windowMs: number,
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((at) => now - at < windowMs);

  if (recent.length >= max) {
    hits.set(key, recent);
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((windowMs - (now - recent[0])) / 1000)),
    };
  }

  recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing without bound.
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((at) => now - at >= windowMs)) hits.delete(k);
    }
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Best-effort client address: the first hop of X-Forwarded-For. */
export function clientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip") || "unknown";
}
