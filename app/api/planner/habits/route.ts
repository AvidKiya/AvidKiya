import { NextRequest } from 'next/server';
import { verifyJwt, extractToken } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-types';

export const runtime = 'edge';

const habits = new Map<string, Array<{
  id: string;
  name: string;
  frequency: string;
  createdAt: string;
}>>();

const habitLogs = new Map<string, Array<{
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
}>>();

function generateId() {
  return `habit-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) return errorResponse('لایسنس الزامی است', 401);

    const secret = process.env.JWT_SECRET || 'default-secret';
    const payload = await verifyJwt(token, secret);
    if (!payload) return errorResponse('لایسنس نامعتبر است', 401);

    const userHabits = habits.get(payload.sub) || [];
    const userLogs = habitLogs.get(payload.sub) || [];
    
    return successResponse({
      habits: userHabits,
      logs: userLogs,
    });
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
    const { name, frequency = 'daily' } = body;

    if (!name) return errorResponse('عنوان الزامی است');

    const userHabits = habits.get(payload.sub) || [];
    const newHabit = {
      id: generateId(),
      name,
      frequency,
      createdAt: new Date().toISOString(),
    };

    userHabits.push(newHabit);
    habits.set(payload.sub, userHabits);

    return successResponse(newHabit, 'عادت ایجاد شد');
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
    const { habitId, date, completed = true } = body;

    if (!habitId) return errorResponse('شناسه عادت الزامی است');

    const userLogs = habitLogs.get(payload.sub) || [];
    const existingLog = userLogs.find(
      (l) => l.habitId === habitId && l.date === (date || new Date().toISOString().split('T')[0])
    );

    if (existingLog) {
      existingLog.completed = completed;
    } else {
      userLogs.push({
        id: generateId(),
        habitId,
        date: date || new Date().toISOString().split('T')[0],
        completed,
      });
    }

    habitLogs.set(payload.sub, userLogs);
    return successResponse(null, 'عادت ثبت شد');
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

    if (!id) return errorResponse('شناسه عادت الزامی است');

    const userHabits = habits.get(payload.sub) || [];
    const filteredHabits = userHabits.filter((h) => h.id !== id);

    if (filteredHabits.length === userHabits.length) {
      return errorResponse('عادت یافت نشد', 404);
    }

    habits.set(payload.sub, filteredHabits);
    return successResponse(null, 'عادت حذف شد');
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}