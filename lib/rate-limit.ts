// Rate limiting using Cloudflare KV

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  blockDurationMs?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

const defaultConfigs: Record<string, RateLimitConfig> = {
  login: { windowMs: 60000, maxRequests: 5, blockDurationMs: 900000 },
  publicApi: { windowMs: 60000, maxRequests: 100 },
  comments: { windowMs: 3600000, maxRequests: 3 },
  contact: { windowMs: 86400000, maxRequests: 5 },
  signup: { windowMs: 3600000, maxRequests: 10 },
  aiChat: { windowMs: 86400000, maxRequests: 200 },
  capture: { windowMs: 3600000, maxRequests: 50 },
};

export async function checkRateLimit(
  kv: KVNamespace,
  key: string,
  config?: Partial<RateLimitConfig>
): Promise<RateLimitResult> {
  const fullConfig = { ...defaultConfigs.publicApi, ...config };
  const now = Date.now();
  const windowKey = `rl:${key}:${Math.floor(now / fullConfig.windowMs)}`;

  const existing = await kv.get(windowKey);
  const count = existing ? parseInt(existing, 10) : 0;

  if (count >= fullConfig.maxRequests) {
    const resetAt = Math.ceil((now + fullConfig.windowMs) / 1000);
    return { allowed: false, remaining: 0, resetAt };
  }

  await kv.put(windowKey, String(count + 1), {
    expirationTtl: Math.ceil(fullConfig.windowMs / 1000) + 60,
  });

  return {
    allowed: true,
    remaining: fullConfig.maxRequests - count - 1,
    resetAt: Math.ceil((now + fullConfig.windowMs) / 1000),
  };
}

export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(result.resetAt),
    ...(result.allowed ? {} : { 'Retry-After': String(Math.ceil((result.resetAt * 1000 - Date.now()) / 1000)) }),
  };
}