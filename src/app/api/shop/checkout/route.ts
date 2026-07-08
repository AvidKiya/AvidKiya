import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { kvPutJson } from '@/lib/server/kv-storage';
import { orderEmailHtml, sendEmail } from '@/lib/server/email';

export const runtime = 'edge';

type CheckoutItem = { id?: string; name: string; quantity: number; price: number; currency?: string };

type ShopOrder = {
  orderId: string;
  status: 'pending' | 'manual' | 'paid' | 'failed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CheckoutItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
  couponCode: string;
  gateway?: string;
  authority?: string;
  gatewayAmountRial?: number;
};

function makeOrderId() {
  return `SHOP-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function orderKey(orderId: string) { return `shop:order:${orderId}`; }

function siteUrl(request: NextRequest) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (configured) return configured.replace(/\/$/, '');
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const host = request.headers.get('host') || 'localhost:3000';
  return `${proto}://${host}`;
}

async function saveOrder(order: ShopOrder) {
  order.updatedAt = new Date().toISOString();
  await kvPutJson(orderKey(order.orderId), order);
}

async function createZarinpalPayment(request: NextRequest, order: ShopOrder) {
  const merchantId = process.env.ZARINPAL_MERCHANT_ID;
  if (!merchantId) return null;

  const sandbox = process.env.ZARINPAL_SANDBOX === '1' || process.env.ZARINPAL_SANDBOX === 'true';
  const apiBase = sandbox ? 'https://sandbox.zarinpal.com/pg/v4/payment' : 'https://api.zarinpal.com/pg/v4/payment';
  const startBase = sandbox ? 'https://sandbox.zarinpal.com/pg/StartPay' : 'https://www.zarinpal.com/pg/StartPay';

  const amountRial = Math.max(1000, Math.round(Number(order.total || 0) * 10));
  const callback_url = `${siteUrl(request)}/api/shop/payment/verify?orderId=${encodeURIComponent(order.orderId)}&amount=${amountRial}`;

  const res = await fetch(`${apiBase}/request.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      merchant_id: merchantId,
      amount: amountRial,
      callback_url,
      description: `Order ${order.orderId}`,
      metadata: { email: order.customerEmail || undefined, mobile: order.customerPhone || undefined },
    }),
  });

  const json = await res.json() as any;
  if (!res.ok || json?.data?.code !== 100 || !json?.data?.authority) {
    throw new Error(json?.errors?.message || json?.errors?.code || 'Zarinpal request failed');
  }

  order.gateway = 'zarinpal';
  order.authority = json.data.authority;
  order.gatewayAmountRial = amountRial;
  await saveOrder(order);

  return { gateway: 'zarinpal', authority: json.data.authority, paymentUrl: `${startBase}/${json.data.authority}` };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const items = (body.items || []) as CheckoutItem[];
    const total = Number(body.total || 0);

    if (!items.length) return errorResponse('Cart is empty', 400);
    if (!Number.isFinite(total) || total <= 0) return errorResponse('Invalid order total', 400);

    const order: ShopOrder = {
      orderId: makeOrderId(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customerName: String(body.customerName || 'Guest'),
      customerEmail: String(body.customerEmail || ''),
      customerPhone: String(body.customerPhone || ''),
      items,
      subtotal: Number(body.subtotal || total),
      discount: Number(body.discount || 0),
      tax: Number(body.tax || 0),
      total,
      currency: body.currency || 'TMN',
      couponCode: body.couponCode || '',
    };

    await saveOrder(order);

    const externalPaymentUrl = process.env.PAYMENT_EXTERNAL_URL;
    if (externalPaymentUrl) {
      order.gateway = 'external';
      await saveOrder(order);
      return successResponse({
        orderId: order.orderId,
        mode: 'external',
        paymentUrl: `${externalPaymentUrl}${externalPaymentUrl.includes('?') ? '&' : '?'}orderId=${encodeURIComponent(order.orderId)}&amount=${encodeURIComponent(String(total))}`,
      }, 'Redirecting to external payment gateway');
    }

    const zarinpal = await createZarinpalPayment(request, order);
    if (zarinpal) return successResponse({ orderId: order.orderId, mode: 'gateway', ...zarinpal }, 'Payment gateway session created');

    order.status = 'manual';
    await saveOrder(order);
    if (order.customerEmail) {
      sendEmail({ to: order.customerEmail, subject: `Order ${order.orderId} created`, html: orderEmailHtml(order) }).catch(() => {});
    }
    return successResponse({ orderId: order.orderId, mode: 'manual', paymentUrl: '', message: 'Payment gateway is not configured. Set ZARINPAL_MERCHANT_ID or PAYMENT_EXTERNAL_URL.' }, 'Order created in manual mode');
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Checkout failed', 500);
  }
}
