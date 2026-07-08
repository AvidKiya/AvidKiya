import { successResponse } from '@/lib/api-types';
import { isCloudflareKvConfigured, kvPutJson, kvGetJson } from '@/lib/server/kv-storage';
import { isAiConfigured } from '@/lib/server/ai';
import { isResendConfigured } from '@/lib/server/email';
import { isTelegramConfigured } from '@/lib/server/telegram';

export const runtime = 'edge';

function configured(name: string, ok: boolean) {
  return { name, status: ok ? 'configured' : 'not_configured' };
}

export async function GET() {
  let storage: 'operational' | 'fallback' | 'error' = isCloudflareKvConfigured() ? 'operational' : 'fallback';
  try {
    const probeKey = 'health:probe';
    await kvPutJson(probeKey, { ok: true, ts: Date.now() });
    await kvGetJson(probeKey, null);
  } catch {
    storage = 'error';
  }

  return successResponse({
    status: storage === 'error' ? 'degraded' : 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      api: 'operational',
      storage,
      payment: configured('payment', !!(process.env.ZARINPAL_MERCHANT_ID || process.env.PAYMENT_EXTERNAL_URL)),
      email: configured('resend', isResendConfigured()),
      ai: configured('ai', isAiConfigured()),
      telegram: configured('telegram', isTelegramConfigured()),
      oauthGoogle: configured('google_oauth', !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)),
      oauthGithub: configured('github_oauth', !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET)),
      monitoring: configured('monitoring_webhook', !!process.env.MONITORING_WEBHOOK_URL),
    },
  });
}
