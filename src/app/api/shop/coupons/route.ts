import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { deleteCoupon, getCoupon, listCoupons, saveCoupon, type StoredCoupon } from '@/lib/server/coupons';

export const runtime = 'edge';

export async function GET() {
  try { return successResponse(await listCoupons(false)); } catch { return errorResponse('Failed to process request', 500); }
}

export async function POST(request: NextRequest) {
  try {
    const { code, type = 'percentage', value, maxUses, expiresAt, firstPurchaseOnly = false } = await request.json();
    if (!code || !value) return errorResponse('Code and value are required');
    if (await getCoupon(code)) return errorResponse('Coupon code already exists');
    const coupon: StoredCoupon = { id: `coupon-${Date.now()}`, code: String(code).toUpperCase(), type, value: Number(value), maxUses: maxUses ? Number(maxUses) : undefined, uses: 0, expiresAt, firstPurchaseOnly, enabled: true, createdAt: new Date().toISOString() };
    return successResponse(await saveCoupon(coupon), 'Coupon created');
  } catch { return errorResponse('Failed to process request', 500); }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const current = body.code ? await getCoupon(body.code) : null;
    if (!current) return errorResponse('Coupon not found', 404);
    const updated = await saveCoupon({ ...current, ...body, code: String(body.code || current.code).toUpperCase(), value: body.value !== undefined ? Number(body.value) : current.value, maxUses: body.maxUses !== undefined ? (body.maxUses ? Number(body.maxUses) : undefined) : current.maxUses });
    return successResponse(updated, 'Coupon updated');
  } catch { return errorResponse('Failed to process request', 500); }
}

export async function DELETE(request: NextRequest) {
  try {
    const code = new URL(request.url).searchParams.get('code');
    if (!code) return errorResponse('Coupon code is required');
    await deleteCoupon(code);
    return successResponse(null, 'Coupon deleted');
  } catch { return errorResponse('Failed to process request', 500); }
}
