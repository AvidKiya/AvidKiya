import { NextRequest } from 'next/server';
import { verifyJwt, extractToken } from '@/lib/jwt';
import { generateInvoiceHtml } from '@/lib/invoice';

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return new Response(JSON.stringify({ error: 'لایسنس الزامی است' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const secret = process.env.JWT_SECRET || 'default-secret';
    const payload = await verifyJwt(token, secret);
    if (!payload) {
      return new Response(JSON.stringify({ error: 'لایسنس نامعتبر است' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { orderId, items, subtotal, discount, total, currency, couponCode } = body;

    if (!orderId || !items || !total) {
      return new Response(JSON.stringify({ error: 'داده‌های فاکتور ناقص است' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const html = generateInvoiceHtml({
      orderId,
      date: new Date().toLocaleDateString('en-US'),
      customerName: payload.name,
      customerEmail: '',
      items: items || [],
      subtotal: subtotal || total,
      discount,
      total,
      currency: currency || 'USD',
      couponCode,
    });

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'خطا در تولید فاکتور' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}