import { NextRequest } from 'next/server';
import { verifyJwt, signJwt } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-types';
import { checkRateLimit, rateLimitedResponse, getClientKey } from '@/lib/rate-limit';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const rl = await checkRateLimit(null, `login:${getClientKey(request)}`, { preset: 'login' });
    if (!rl.allowed) return rateLimitedResponse(rl);

    const body = await request.json();
    const { code } = body;

    if (!code) {
      return errorResponse('لایسنس الزامی است');
    }

    // Validate license format — لایسنس پیش‌فرض مدیر یک استثنای ثابت است (طبق 15-KIYA-ADMIN.md)
    const DEFAULT_ADMIN_LICENSE = 'KIYA-ADMIN-0000-0001';
    const licensePattern = /^KIYA-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    const isDefaultAdmin = code === DEFAULT_ADMIN_LICENSE;
    if (!isDefaultAdmin && !licensePattern.test(code)) {
      return errorResponse('فرمت لایسنس معتبر نیست');
    }

    // In production, this would query D1
    // For now, mock the validation
    const mockLicense: {
      id: string;
      code: string;
      plan: 'team' | 'pro';
      status: 'active';
      isAdmin: boolean;
      name: string;
    } = {
      id: isDefaultAdmin ? 'license-admin' : 'license-001',
      code,
      plan: isDefaultAdmin ? 'team' : 'pro',
      status: 'active',
      isAdmin: isDefaultAdmin,
      name: isDefaultAdmin ? 'Admin' : 'User',
    };

    if (mockLicense.status !== 'active') {
      return errorResponse('لایسنس غیرفعال است');
    }

    // Generate JWT
    const secret = process.env.JWT_SECRET || 'default-secret';
    const token = await signJwt(
      {
        sub: mockLicense.id,
        name: mockLicense.name,
        plan: mockLicense.plan,
        isAdmin: mockLicense.isAdmin,
      },
      secret,
      86400 * 7 // 7 days
    );

    return successResponse({
      token,
      user: {
        id: mockLicense.id,
        name: mockLicense.name,
        plan: mockLicense.plan,
        isAdmin: mockLicense.isAdmin,
      },
    }, 'ورود موفق');
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}