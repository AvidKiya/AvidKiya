import { NextRequest } from 'next/server';
import { verifyJwt, extractToken } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-types';

export const runtime = 'edge';

const notifications = new Map<string, Array<{
  id: string;
  type: string;
  title: string;
  message?: string;
  read: boolean;
  createdAt: string;
}>>();

function generateId() {
  return `notif-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) return errorResponse('لایسنس الزامی است', 401);

    const secret = process.env.JWT_SECRET || 'default-secret';
    const payload = await verifyJwt(token, secret);
    if (!payload) return errorResponse('لایسنس نامعتبر است', 401);

    const userNotifications = notifications.get(payload.sub) || [];
    const unreadCount = userNotifications.filter((n) => !n.read).length;

    return successResponse({
      notifications: userNotifications,
      unreadCount,
    });
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

    const body = await request.json();
    const { id, markAllAsRead } = body;

    const userNotifications = notifications.get(payload.sub) || [];

    if (markAllAsRead) {
      userNotifications.forEach((n) => {
        n.read = true;
      });
    } else if (id) {
      const notif = userNotifications.find((n) => n.id === id);
      if (notif) {
        notif.read = true;
      }
    }

    notifications.set(payload.sub, userNotifications);
    return successResponse(null, 'اعلان به‌روزرسانی شد');
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
    const id = searchParams.get('id');

    if (!id) return errorResponse('شناسه اعلان الزامی است');

    const userNotifications = notifications.get(payload.sub) || [];
    const filteredNotifications = userNotifications.filter((n) => n.id !== id);

    if (filteredNotifications.length === userNotifications.length) {
      return errorResponse('اعلان یافت نشد', 404);
    }

    notifications.set(payload.sub, filteredNotifications);
    return successResponse(null, 'اعلان حذف شد');
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}