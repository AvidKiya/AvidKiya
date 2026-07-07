import { NextRequest } from 'next/server';
import { verifyJwt, extractToken } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-types';

export const runtime = 'edge';

const coupons = new Map<string, {
  id: string;
  code: string;
  type: string;
  value: number;
  maxUses?: number;
  uses: number;
  expiresAt?: string;
  firstPurchaseOnly: boolean;
  enabled: boolean;
}>();

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) return errorResponse('لایسنس الزامی است', 401);

    const secret = process.env.JWT_SECRET || 'default-secret';
    const payload = await verifyJwt(token, secret);
    if (!payload) return errorResponse('لایسنس نامعتبر است', 401);

    if (!payload.isAdmin) {
      return errorResponse('دسترسی غیرمجاز', 403);
    }

    const allCoupons = Array.from(coupons.values());
    return successResponse(allCoupons);
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

    if (!payload.isAdmin) {
      return errorResponse('دسترسی غیرمجاز', 403);
    }

    const body = await request.json();
    const { code, type = 'percentage', value, maxUses, expiresAt, firstPurchaseOnly = false } = body;

    if (!code || !value) {
      return errorResponse('کد و مقدار الزامی است');
    }

    const newCoupon = {
      id: `coupon-${Date.now()}`,
      code: code.toUpperCase(),
      type,
      value: Number(value),
      maxUses: maxUses ? Number(maxUses) : undefined,
      uses: 0,
      expiresAt,
      firstPurchaseOnly,
      enabled: true,
    };

    coupons.set(code.toUpperCase(), newCoupon);
    return successResponse(newCoupon, 'کد تخفیف ایجاد شد');
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) return errorResponse('لایسنس الزامی است', 401);

    const secret = process.env.JWT_SECRET || 'default-secret';
    const payload = await verifyJwt(token, secret);
    if (!payload) return errorResponse('لایسنس نامعتبر است', 401);

    if (!payload.isAdmin) {
      return errorResponse('دسترسی غیرمجاز', 403);
    }

    const body = await request.json();
    const { id, code, type, value, maxUses, expiresAt, firstPurchaseOnly, enabled } = body;

    if (!id) return errorResponse('شناسه کد تخفیف الزامی است');

    for (const [key, coupon] of coupons.entries()) {
      if (coupon.id === id) {
        const updatedCoupon = {
          ...coupon,
          ...(code && { code: code.toUpperCase() }),
          ...(type && { type }),
          ...(value !== undefined && { value: Number(value) }),
          ...(maxUses !== undefined && { maxUses: maxUses ? Number(maxUses) : undefined }),
          ...(expiresAt !== undefined && { expiresAt }),
          ...(firstPurchaseOnly !== undefined && { firstPurchaseOnly }),
          ...(enabled !== undefined && { enabled }),
        };
        coupons.set(key, updatedCoupon);
        return successResponse(updatedCoupon, 'کد تخفیف به‌روزرسانی شد');
      }
    }

    return errorResponse('کد تخفیف یافت نشد', 404);
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

    if (!payload.isAdmin) {
      return errorResponse('دسترسی غیرمجاز', 403);
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return errorResponse('شناسه کد تخفیف الزامی است');

    for (const [key, coupon] of coupons.entries()) {
      if (coupon.id === id) {
        coupons.delete(key);
        return successResponse(null, 'کد تخفیف حذف شد');
      }
    }

    return errorResponse('کد تخفیف یافت نشد', 404);
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}