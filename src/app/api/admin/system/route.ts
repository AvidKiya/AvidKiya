import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { extractToken, verifyJwt } from '@/lib/jwt';
import { isCloudflareKvConfigured } from '@/lib/server/kv-storage';
import { isAiConfigured } from '@/lib/server/ai';
import { isResendConfigured } from '@/lib/server/email';
import { isTelegramConfigured } from '@/lib/server/telegram';

export const runtime = 'edge';

async function requireAdmin(request: NextRequest) {
  const token = extractToken(request);
  if (!token) return null;
  const payload = await verifyJwt(token, process.env.JWT_SECRET || 'default-secret');
  return payload?.isAdmin ? payload : null;
}

export async function GET(request: NextRequest) {
  try {
    if (!(await requireAdmin(request))) return errorResponse('Unauthorized', 401);
    return successResponse({
      timestamp: new Date().toISOString(),
      environment: {
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || '',
        storage: isCloudflareKvConfigured() ? 'cloudflare_kv' : 'local_fallback',
      },
      checks: [
        { key: 'CF_ACCOUNT_ID', ok: !!(process.env.CF_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID) },
        { key: 'CF_API_TOKEN', ok: !!(process.env.CF_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN) },
        { key: 'CF_KV_NAMESPACE_ID', ok: !!(process.env.CF_KV_NAMESPACE_ID || process.env.CLOUDFLARE_KV_NAMESPACE_ID) },
        { key: 'ZARINPAL_MERCHANT_ID or PAYMENT_EXTERNAL_URL', ok: !!(process.env.ZARINPAL_MERCHANT_ID || process.env.PAYMENT_EXTERNAL_URL) },
        { key: 'RESEND_API_KEY', ok: isResendConfigured() },
        { key: 'AI provider', ok: isAiConfigured() },
        { key: 'TELEGRAM_BOT_TOKEN', ok: isTelegramConfigured() },
        { key: 'OAuth Google', ok: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) },
        { key: 'OAuth GitHub', ok: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) },
        { key: 'MONITORING_WEBHOOK_URL', ok: !!process.env.MONITORING_WEBHOOK_URL },
      ],
    });
  } catch {
    return errorResponse('Failed to load system status', 500);
  }
}
