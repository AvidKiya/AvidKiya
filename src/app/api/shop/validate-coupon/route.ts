import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { checkRateLimit, rateLimitedResponse, getClientKey } from '@/lib/rate-limit';
import { getCoupon, validateCoupon } from '@/lib/server/coupons';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const rl = await checkRateLimit(`coupon:${getClientKey(request)}`, { windowMs: 60000, maxRequests: 20 });
    if (!rl.allowed) return rateLimitedResponse(rl);
    const { code, subtotal = 0 } = await request.json();
    if (!code) return errorResponse('Coupon code is required');
    const coupon = await getCoupon(String(code));
    const result = validateCoupon(coupon, Number(subtotal));
    if (!result.ok) return errorResponse(result.error || 'Invalid coupon');
    return successResponse({
      valid: true,
      code: coupon!.code,
      type: coupon!.type,
      value: coupon!.value,
      discount: result.discount,
      message: coupon!.type === 'percentage' ? `${coupon!.value}% discount` : `${coupon!.value.toLocaleString('en-US')} Toman discount`,
    });
  } catch {
    return errorResponse('Failed to process request', 500);
  }
}
