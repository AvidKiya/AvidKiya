// Rate limiting — Cloudflare KV در production، حافظه موقت در توسعه/دمو
// وقتی KV Binding واقعی وصل شود (به wrangler.toml مراجعه کنید)، همین تابع خودکار از KV استفاده می‌کند.

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

export const defaultConfigs: Record<string, RateLimitConfig> = {
  login: { windowMs: 60000, maxRequests: 5, blockDurationMs: 900000 },
  publicApi: { windowMs: 60000, maxRequests: 100 },
  comments: { windowMs: 3600000, maxRequests: 3 },
  contact: { windowMs: 86400000, maxRequests: 5 },
  signup: { windowMs: 3600000, maxRequests: 10 },
  aiChat: { windowMs: 86400000, maxRequests: 200 },
  capture: { windowMs: 3600000, maxRequests: 50 },
  telegram: { windowMs: 60000, maxRequests: 30 },
};

// حافظه موقت به عنوان fallback وقتی KV بایند نشده (مطابق الگوی بقیه‌ی API route های پروژه)
const memoryStore = new Map<string, { count: number; expiresAt: number }>();

function memoryRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const windowKey = `${key}:${Math.floor(now / config.windowMs)}`;

  // پاک‌سازی دوره‌ای رکوردهای منقضی (جلوگیری از نشت حافظه در محیط dev/edge)
  if (memoryStore.size > 5000) {
    for (const [k, v] of memoryStore.entries()) {
      if (v.expiresAt < now) memoryStore.delete(k);
    }
  }

  const existing = memoryStore.get(windowKey);
  const count = existing && existing.expiresAt > now ? existing.count : 0;

  if (count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: Math.ceil((now + config.windowMs) / 1000) };
  }

  memoryStore.set(windowKey, { count: count + 1, expiresAt: now + config.windowMs + 60000 });

  return {
    allowed: true,
    remaining: config.maxRequests - count - 1,
    resetAt: Math.ceil((now + config.windowMs) / 1000),
  };
}

export async function checkRateLimit(
  kv: KVNamespace | undefined | null,
  key: string,
  config?: Partial<RateLimitConfig> & { preset?: keyof typeof defaultConfigs }
): Promise<RateLimitResult> {
  const preset = config?.preset ? defaultConfigs[config.preset] : defaultConfigs.publicApi;
  const fullConfig = { ...preset, ...config };

  if (!kv) {
    // بدون KV بایند شده (وضعیت فعلی پروژه) — از حافظه موقت استفاده کن
    return memoryRateLimit(key, fullConfig);
  }

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

// کمکی برای گرفتن یک شناسه‌ی نرخ‌محدودیت از IP درخواست (Cloudflare همیشه این هدر را ست می‌کند)
export function getClientKey(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

// یک Response آماده برای حالت rate-limit شده — پیام فارسی + هدرهای استاندارد
export function rateLimitedResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({ success: false, error: 'تعداد درخواست‌ها زیاده. کمی صبر کن و دوباره امتحان کن.' }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        ...getRateLimitHeaders(result),
      },
    }
  );
}
