import { NextRequest } from 'next/server';
import { verifyJwt, extractToken } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-types';

const goals = new Map<string, Array<{
  id: string;
  title: string;
  level: string;
  progress: number;
  createdAt: string;
}>>();

function generateId() {
  return `goal-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) return errorResponse('لایسنس الزامی است', 401);

    const secret = process.env.JWT_SECRET || 'default-secret';
    const payload = await verifyJwt(token, secret);
    if (!payload) return errorResponse('لایسنس نامعتبر است', 401);

    const userGoals = goals.get(payload.sub) || [];
    return successResponse(userGoals);
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
    const { title, level = 'weekly' } = body;

    if (!title) return errorResponse('عنوان الزامی است');

    const userGoals = goals.get(payload.sub) || [];
    const newGoal = {
      id: generateId(),
      title,
      level,
      progress: 0,
      createdAt: new Date().toISOString(),
    };

    userGoals.push(newGoal);
    goals.set(payload.sub, userGoals);

    return successResponse(newGoal, 'هدف ایجاد شد');
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
    const { id, title, level, progress } = body;

    if (!id) return errorResponse('شناسه هدف الزامی است');

    const userGoals = goals.get(payload.sub) || [];
    const goalIndex = userGoals.findIndex((g) => g.id === id);

    if (goalIndex === -1) return errorResponse('هدف یافت نشد', 404);

    const updatedGoal = {
      ...userGoals[goalIndex],
      ...(title && { title }),
      ...(level && { level }),
      ...(progress !== undefined && { progress }),
    };

    userGoals[goalIndex] = updatedGoal;
    goals.set(payload.sub, userGoals);

    return successResponse(updatedGoal, 'هدف به‌روزرسانی شد');
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

    if (!id) return errorResponse('شناسه هدف الزامی است');

    const userGoals = goals.get(payload.sub) || [];
    const filteredGoals = userGoals.filter((g) => g.id !== id);

    if (filteredGoals.length === userGoals.length) {
      return errorResponse('هدف یافت نشد', 404);
    }

    goals.set(payload.sub, filteredGoals);
    return successResponse(null, 'هدف حذف شد');
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}