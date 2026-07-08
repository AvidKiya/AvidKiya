import { NextRequest } from 'next/server';
import { kvGetJson, kvPutJson } from '@/lib/server/kv-storage';
import { orderEmailHtml, sendEmail } from '@/lib/server/email';

export const runtime = 'edge';

function orderKey(orderId: string) { return `shop:order:${orderId}`; }

function html(title: string, body: string, ok = true) {
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#0b0f19;color:#e5e7eb;display:grid;place-items:center;min-height:100vh;margin:0}.card{width:min(560px,92vw);background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:24px;padding:28px;text-align:center;box-shadow:0 24px 80px rgba(0,0,0,.35)}.icon{width:58px;height:58px;margin:0 auto 16px;border-radius:50%;display:grid;place-items:center;background:${ok ? 'rgba(16,185,129,.14);color:#34d399' : 'rgba(244,63,94,.14);color:#fb7185'};font-size:30px}a{display:inline-block;margin-top:18px;color:white;background:#5d7ae6;text-decoration:none;padding:11px 18px;border-radius:14px}</style></head><body><div class="card"><div class="icon">${ok ? '✓' : '!'}</div><h1>${title}</h1><p>${body}</p><a href="/shop">Back to shop</a></div></body></html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

async function updateOrder(orderId: string, patch: Record<string, unknown>): Promise<any | null> {
  if (!orderId) return null;
  const current = await kvGetJson<Record<string, unknown> | null>(orderKey(orderId), null);
  if (!current) return null;
  const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
  await kvPutJson(orderKey(orderId), next);
  return next;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const status = url.searchParams.get('Status');
  const authority = url.searchParams.get('Authority');
  const amount = Number(url.searchParams.get('amount') || 0);
  const orderId = url.searchParams.get('orderId') || '';

  if (status !== 'OK' || !authority) {
    await updateOrder(orderId, { status: 'cancelled', authority });
    return html('Payment was cancelled', 'The gateway did not confirm this payment.', false);
  }

  const merchantId = process.env.ZARINPAL_MERCHANT_ID;
  if (!merchantId) {
    await updateOrder(orderId, { status: 'failed', authority, failureReason: 'ZARINPAL_MERCHANT_ID missing' });
    return html('Gateway is not configured', 'ZARINPAL_MERCHANT_ID is missing on the server.', false);
  }

  try {
    const sandbox = process.env.ZARINPAL_SANDBOX === '1' || process.env.ZARINPAL_SANDBOX === 'true';
    const apiBase = sandbox ? 'https://sandbox.zarinpal.com/pg/v4/payment' : 'https://api.zarinpal.com/pg/v4/payment';
    const res = await fetch(`${apiBase}/verify.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ merchant_id: merchantId, amount, authority }),
    });
    const json = await res.json() as any;
    if (res.ok && (json?.data?.code === 100 || json?.data?.code === 101)) {
      const order = await updateOrder(orderId, { status: 'paid', authority, refId: json.data.ref_id, paidAt: new Date().toISOString() });
      if (order?.customerEmail) {
        sendEmail({ to: String(order.customerEmail), subject: `Order ${orderId} confirmed`, html: orderEmailHtml(order) }).catch(() => {});
      }
      return html('Payment verified', `Order ${orderId || authority} was paid successfully. Ref ID: ${json.data.ref_id || '-'}<br><br><a href="/api/shop/invoice?orderId=${encodeURIComponent(orderId)}">Open invoice</a> <a href="/api/shop/download?orderId=${encodeURIComponent(orderId)}">Open downloads</a>`);
    }
    await updateOrder(orderId, { status: 'failed', authority, failureReason: json?.errors?.message || json?.errors?.code || 'Unknown error' });
    return html('Payment verification failed', `Gateway response: ${json?.errors?.message || json?.errors?.code || 'Unknown error'}`, false);
  } catch (error) {
    await updateOrder(orderId, { status: 'failed', authority, failureReason: error instanceof Error ? error.message : 'Unknown error' });
    return html('Payment verification failed', error instanceof Error ? error.message : 'Unknown error', false);
  }
}
