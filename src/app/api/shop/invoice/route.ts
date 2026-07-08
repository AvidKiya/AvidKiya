import { NextRequest } from 'next/server';
import { generateInvoiceHtml } from '@/lib/invoice';
import { kvGetJson } from '@/lib/server/kv-storage';

export const runtime = 'edge';

function orderKey(orderId: string) { return `shop:order:${orderId}`; }

function payloadToInvoice(body: any) {
  const { orderId, items, subtotal, discount, total, currency, couponCode, customerName, customerEmail } = body;
  return generateInvoiceHtml({
    orderId,
    date: body.createdAt ? new Date(body.createdAt).toLocaleDateString('en-US') : new Date().toLocaleDateString('en-US'),
    customerName: customerName || 'Guest',
    customerEmail: customerEmail || '',
    items: (items || []).map((it: any) => ({ name: it.name || it.title || 'Product', quantity: Number(it.quantity || it.qty || 1), price: Number(it.price || 0), currency: it.currency || currency || 'TMN' })),
    subtotal: Number(subtotal || total),
    discount: Number(discount || 0),
    total: Number(total),
    currency: currency || 'TMN',
    couponCode,
  });
}

export async function GET(request: NextRequest) {
  try {
    const orderId = new URL(request.url).searchParams.get('orderId');
    if (!orderId) return new Response(JSON.stringify({ error: 'Order ID is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    const order = await kvGetJson<any | null>(orderKey(orderId), null);
    if (!order) return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    const html = payloadToInvoice(order);
    return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Content-Disposition': `inline; filename="invoice-${orderId}.html"` } });
  } catch {
    return new Response(JSON.stringify({ error: 'Invoice generation failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, items, total } = body;
    if (!orderId || !Array.isArray(items) || !items.length || !Number(total)) {
      return new Response(JSON.stringify({ error: 'Invoice data is incomplete' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const html = payloadToInvoice(body);
    return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Content-Disposition': `attachment; filename="invoice-${orderId}.html"` } });
  } catch {
    return new Response(JSON.stringify({ error: 'Invoice generation failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
