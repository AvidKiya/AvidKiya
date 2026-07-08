import { NextRequest } from 'next/server';
import { verifyJwt, extractToken } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-types';
import { deleteCoupon, getCoupon, listCoupons, saveCoupon, type StoredCoupon } from '@/lib/server/coupons';

export const runtime = 'edge';

async function requireAdmin(request: NextRequest) {
  const token = extractToken(request);
  if (!token) return null;
  const payload = await verifyJwt(token, process.env.JWT_SECRET || 'default-secret');
  return payload?.isAdmin ? payload : null;
}

export async function GET(request: NextRequest) {
  try { if (!(await requireAdmin(request))) return errorResponse('Unauthorized', 401); return successResponse(await listCoupons(true)); } catch { return errorResponse('Failed to process request', 500); }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await requireAdmin(request))) return errorResponse('Unauthorized', 401);
    const { code, type = 'percentage', value, maxUses, expiresAt, firstPurchaseOnly = false, enabled = true } = await request.json();
    if (!code || !value) return errorResponse('Code and value are required');
    if (await getCoupon(code)) return errorResponse('Coupon code already exists');
    const coupon: StoredCoupon = { id: `coupon-${Date.now()}`, code: String(code).toUpperCase(), type, value: Number(value), maxUses: maxUses ? Number(maxUses) : undefined, uses: 0, expiresAt, firstPurchaseOnly, enabled, createdAt: new Date().toISOString() };
    return successResponse(await saveCoupon(coupon), 'Coupon created');
  } catch { return errorResponse('Failed to process request', 500); }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await requireAdmin(request))) return errorResponse('Unauthorized', 401);
    const body = await request.json();
    const code = String(body.code || '').toUpperCase();
    if (!code) return errorResponse('Coupon code is required');
    const current = await getCoupon(code);
    if (!current) return errorResponse('Coupon not found', 404);
    const updated = await saveCoupon({ ...current, ...body, code, value: body.value !== undefined ? Number(body.value) : current.value, maxUses: body.maxUses !== undefined ? (body.maxUses ? Number(body.maxUses) : undefined) : current.maxUses });
    return successResponse(updated, 'Coupon updated');
  } catch { return errorResponse('Failed to process request', 500); }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!(await requireAdmin(request))) return errorResponse('Unauthorized', 401);
    const code = new URL(request.url).searchParams.get('code');
    if (!code) return errorResponse('Coupon code is required');
    await deleteCoupon(code);
    return successResponse(null, 'Coupon deleted');
  } catch { return errorResponse('Failed to process request', 500); }
}
