import { NextRequest } from 'next/server';
import { verifyJwt, extractToken } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-types';

export const runtime = 'edge';

const events = new Map<string, Array<{
  id: string;
  title: string;
  date: string;
  time?: string;
  createdAt: string;
}>>();

function generateId() {
  return `event-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) return errorResponse('لایسنس الزامی است', 401);

    const secret = process.env.JWT_SECRET || 'default-secret';
    const payload = await verifyJwt(token, secret);
    if (!payload) return errorResponse('لایسنس نامعتبر است', 401);

    const userEvents = events.get(payload.sub) || [];
    return successResponse(userEvents);
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

    const body = await request.json();
    const { title, date, time } = body;

    if (!title || !date) return errorResponse('عنوان و تاریخ الزامی است');

    const userEvents = events.get(payload.sub) || [];
    const newEvent = {
      id: generateId(),
      title,
      date,
      time,
      createdAt: new Date().toISOString(),
    };

    userEvents.push(newEvent);
    events.set(payload.sub, userEvents);

    return successResponse(newEvent, 'رویداد ایجاد شد');
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
    const { id, title, date, time } = body;

    if (!id) return errorResponse('شناسه رویداد الزامی است');

    const userEvents = events.get(payload.sub) || [];
    const eventIndex = userEvents.findIndex((e) => e.id === id);

    if (eventIndex === -1) return errorResponse('رویداد یافت نشد', 404);

    const updatedEvent = {
      ...userEvents[eventIndex],
      ...(title && { title }),
      ...(date && { date }),
      ...(time !== undefined && { time }),
    };

    userEvents[eventIndex] = updatedEvent;
    events.set(payload.sub, userEvents);

    return successResponse(updatedEvent, 'رویداد به‌روزرسانی شد');
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

    if (!id) return errorResponse('شناسه رویداد الزامی است');

    const userEvents = events.get(payload.sub) || [];
    const filteredEvents = userEvents.filter((e) => e.id !== id);

    if (filteredEvents.length === userEvents.length) {
      return errorResponse('رویداد یافت نشد', 404);
    }

    events.set(payload.sub, filteredEvents);
    return successResponse(null, 'رویداد حذف شد');
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}