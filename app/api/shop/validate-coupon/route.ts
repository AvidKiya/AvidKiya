import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';

// In production, this would query the database
const coupons = new Map<string, {
  code: string;
  type: string;
  value: number;
  maxUses?: number;
  uses: number;
  expiresAt?: string;
  firstPurchaseOnly: boolean;
  enabled: boolean;
}>();

// Initialize with sample coupons
coupons.set('WELCOME10', {
  code: 'WELCOME10',
  type: 'percentage',
  value: 10,
  maxUses: 100,
  uses: 0,
  enabled: true,
  firstPurchaseOnly: true,
});

coupons.set('FLAT5', {
  code: 'FLAT5',
  type: 'fixed',
  value: 5,
  maxUses: 50,
  uses: 0,
  enabled: true,
  expiresAt: '2025-12-31',
  firstPurchaseOnly: false,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, subtotal } = body;

    if (!code) {
      return errorResponse('کد تخفیف الزامی است');
    }

    const coupon = coupons.get(code.toUpperCase());

    if (!coupon) {
      return errorResponse('کد تخفیف نامعتبر است');
    }

    if (!coupon.enabled) {
      return errorResponse('کد تخفیف غیرفعال است');
    }

    if (coupon.maxUses && coupon.uses >= coupon.maxUses) {
      return errorResponse('حداکثر استفاده رسیده است');
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return errorResponse('کد تخفیف منقضی شده است');
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (subtotal || 0) * (coupon.value / 100);
    } else {
      discount = Math.min(coupon.value, subtotal || 0);
    }

    return successResponse({
      valid: true,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount: Math.round(discount * 100) / 100,
      message: coupon.type === 'percentage' 
        ? `${coupon.value}% تخفیف` 
        : `${coupon.value}$ تخفیف`,
    });
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}