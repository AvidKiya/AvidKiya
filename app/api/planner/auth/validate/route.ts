import { NextRequest } from 'next/server';
import { verifyJwt, signJwt } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return errorResponse('لایسنس الزامی است');
    }

    // Validate license format
    const licensePattern = /^KIYA-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    if (!licensePattern.test(code)) {
      return errorResponse('فرمت لایسنس معتبر نیست');
    }

    // In production, this would query D1
    // For now, mock the validation
    const mockLicense = {
      id: 'license-001',
      code,
      plan: 'pro' as const,
      status: 'active' as const,
      isAdmin: code === 'KIYA-ADMIN-0000-0001',
      name: 'User',
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