import { NextRequest } from 'next/server';
import { verifyJwt, extractToken } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-types';

const licenses = new Map<string, Array<{
  id: string;
  code: string;
  plan: string;
  status: string;
  expiresAt?: string;
  isAdmin: boolean;
  name?: string;
  createdAt: string;
}>>();

function generateId() {
  return `license-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function generateLicenseCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = [];
  for (let i = 0; i < 3; i++) {
    let segment = '';
    for (let j = 0; j < 4; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    segments.push(segment);
  }
  return `KIYA-${segments.join('-')}`;
}

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

    const allLicenses = Array.from(licenses.values()).flat();
    return successResponse(allLicenses);
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
    const { plan = 'free', count = 1, name, expiresAt } = body;

    if (!['free', 'pro', 'pro-ai', 'team'].includes(plan)) {
      return errorResponse('پلن نامعتبر است');
    }

    const newLicenses = [];
    for (let i = 0; i < Math.min(count, 100); i++) {
      const newLicense = {
        id: generateId(),
        code: generateLicenseCode(),
        plan,
        status: 'active',
        expiresAt,
        isAdmin: false,
        name,
        createdAt: new Date().toISOString(),
      };
      newLicenses.push(newLicense);
    }

    return successResponse(newLicenses, `${newLicenses.length} لایسنس ایجاد شد`);
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
    const { id, plan, status, expiresAt, name } = body;

    if (!id) return errorResponse('شناسه لایسنس الزامی است');

    // Find and update license
    for (const [userId, userLicenses] of licenses.entries()) {
      const licenseIndex = userLicenses.findIndex((l) => l.id === id);
      if (licenseIndex !== -1) {
        const updatedLicense = {
          ...userLicenses[licenseIndex],
          ...(plan && { plan }),
          ...(status && { status }),
          ...(expiresAt !== undefined && { expiresAt }),
          ...(name !== undefined && { name }),
        };
        userLicenses[licenseIndex] = updatedLicense;
        licenses.set(userId, userLicenses);
        return successResponse(updatedLicense, 'لایسنس به‌روزرسانی شد');
      }
    }

    return errorResponse('لایسنس یافت نشد', 404);
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

    if (!id) return errorResponse('شناسه لایسنس الزامی است');

    for (const [userId, userLicenses] of licenses.entries()) {
      const filteredLicenses = userLicenses.filter((l) => l.id !== id);
      if (filteredLicenses.length < userLicenses.length) {
        licenses.set(userId, filteredLicenses);
        return successResponse(null, 'لایسنس حذف شد');
      }
    }

    return errorResponse('لایسنس یافت نشد', 404);
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}