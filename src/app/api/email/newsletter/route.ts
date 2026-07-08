import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { checkHoneypot } from '@/lib/validation';
import { checkRateLimit, rateLimitedResponse, getClientKey } from '@/lib/rate-limit';
import { kvGetJson, kvListJson, kvPutJson } from '@/lib/server/kv-storage';
import { sendEmail } from '@/lib/server/email';

export const runtime = 'edge';

type Subscriber = { email: string; createdAt: string; source?: string; confirmed: boolean };
function key(email: string) { return `newsletter:subscriber:${email.toLowerCase()}`; }

async function parseEmail(request: NextRequest) {
  const type = request.headers.get('content-type') || '';
  if (type.includes('application/json')) {
    const body = await request.json();
    return { email: String(body.email || ''), website: String(body.website || ''), source: String(body.source || 'json') };
  }
  const formData = await request.formData();
  if (!checkHoneypot(formData)) return { email: '', website: 'bot', source: 'bot' };
  return { email: String(formData.get('email') || ''), website: '', source: String(formData.get('source') || 'form') };
}

export async function POST(request: NextRequest) {
  try {
    const rl = await checkRateLimit(`newsletter:${getClientKey(request)}`, { preset: 'contact' });
    if (!rl.allowed) return rateLimitedResponse(rl);

    const { email, website, source } = await parseEmail(request);
    if (website) return successResponse(null, 'Subscription confirmed');
    if (!email) return errorResponse('Email is required');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return errorResponse('Email is invalid');

    const normalized = email.toLowerCase();
    const existing = await kvGetJson<Subscriber | null>(key(normalized), null);
    if (existing) return errorResponse('This email is already subscribed');

    const sub: Subscriber = { email: normalized, createdAt: new Date().toISOString(), source, confirmed: true };
    await kvPutJson(key(normalized), sub);

    sendEmail({
      to: normalized,
      subject: 'Welcome!',
      html: `<div style="font-family:system-ui;max-width:620px;margin:auto"><h1>Welcome!</h1><p>Thanks for subscribing. You will receive updates and free resources here.</p></div>`,
      text: 'Thanks for subscribing.',
    }).catch(() => {});

    return successResponse(null, 'Subscription registered successfully');
  } catch {
    return errorResponse('Failed to process request', 500);
  }
}

export async function GET() {
  try {
    const subscribers = await kvListJson<Subscriber>('newsletter:subscriber:');
    return successResponse({ count: subscribers.length, subscribers });
  } catch { return errorResponse('Failed to process request', 500); }
}
