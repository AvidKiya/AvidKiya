import { NextRequest } from 'next/server';
import { verifyJwt, extractToken } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-types';

const wishlists = new Map<string, string[]>();

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) return errorResponse('لایسنس الزامی است', 401);

    const secret = process.env.JWT_SECRET || 'default-secret';
    const payload = await verifyJwt(token, secret);
    if (!payload) return errorResponse('لایسنس نامعتبر است', 401);

    const items = wishlists.get(payload.sub) || [];
    return successResponse({ items, count: items.length });
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) return errorResponse('لایسنس الزامی است', 401);

    const secret = process.env.JWT_SECRET || 'default-secret';
    const payload = await verifyJwt(token, secret);
    if (!payload) return errorResponse('لایسنس نامعتبر است', 401);

    const body = await request.json();
    const { productId } = body;

    if (!productId) return errorResponse('شناسه محصول الزامی است');

    const items = wishlists.get(payload.sub) || [];
    if (items.includes(productId)) {
      return errorResponse('محصول قبلاً به لیست اضافه شده');
    }

    items.push(productId);
    wishlists.set(payload.sub, items);

    return successResponse({ items, count: items.length }, 'به لیست اضافه شد');
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) return errorResponse('لایسنس الزامی است', 401);

    const secret = process.env.JWT_SECRET || 'default-secret';
    const payload = await verifyJwt(token, secret);
    if (!payload) return errorResponse('لایسنس نامعتبر است', 401);

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    if (!productId) return errorResponse('شناسه محصول الزامی است');

    const items = wishlists.get(payload.sub) || [];
    const filtered = items.filter((id) => id !== productId);
    wishlists.set(payload.sub, filtered);

    return successResponse({ items: filtered, count: filtered.length }, 'حذف شد');
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}