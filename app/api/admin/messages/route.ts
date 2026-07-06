import { NextRequest } from 'next/server';
import { verifyJwt, extractToken } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-types';

const messages = new Map<string, {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
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

    const allMessages = Array.from(messages.values());
    return successResponse(allMessages);
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return errorResponse('نام، ایمیل و پیام الزامی است');
    }

    const newMessage = {
      id: `msg-${Date.now()}`,
      name,
      email,
      subject: subject || '',
      message,
      read: false,
      createdAt: new Date().toISOString(),
    };

    messages.set(newMessage.id, newMessage);
    return successResponse(newMessage, 'پیام ارسال شد');
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
    const { id, read } = body;

    if (!id) return errorResponse('شناسه پیام الزامی است');

    const msg = messages.get(id);
    if (msg) {
      msg.read = read;
      messages.set(id, msg);
      return successResponse(msg, 'پیام به‌روزرسانی شد');
    }

    return errorResponse('پیام یافت نشد', 404);
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

    if (!id) return errorResponse('شناسه پیام الزامی است');

    if (messages.has(id)) {
      messages.delete(id);
      return successResponse(null, 'پیام حذف شد');
    }

    return errorResponse('پیام یافت نشد', 404);
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}