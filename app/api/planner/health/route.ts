import { NextRequest } from 'next/server';
import { verifyJwt, extractToken } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-types';

const healthLogs = new Map<string, Array<{
  id: string;
  type: string;
  value: number;
  date: string;
  createdAt: string;
}>>();

function generateId() {
  return `health-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) return errorResponse('لایسنس الزامی است', 401);

    const secret = process.env.JWT_SECRET || 'default-secret';
    const payload = await verifyJwt(token, secret);
    if (!payload) return errorResponse('لایسنس نامعتبر است', 401);

    const userLogs = healthLogs.get(payload.sub) || [];
    
    // Calculate weekly averages
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekLogs = userLogs.filter((l) => new Date(l.date) >= weekAgo);

    const averages = {
      sleep: 0,
      exercise: 0,
      energy: 0,
      mood: 0,
    };

    const counts = { sleep: 0, exercise: 0, energy: 0, mood: 0 };

    weekLogs.forEach((log) => {
      if (log.type in averages) {
        averages[log.type as keyof typeof averages] += log.value;
        counts[log.type as keyof typeof counts]++;
      }
    });

    Object.keys(averages).forEach((key) => {
      const k = key as keyof typeof averages;
      if (counts[k] > 0) {
        averages[k] = Math.round((averages[k] / counts[k]) * 10) / 10;
      }
    });

    return successResponse({
      logs: userLogs,
      weeklyAverages: averages,
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
    const { type, value, date } = body;

    if (!type || value === undefined || !date) {
      return errorResponse('نوع، مقدار و تاریخ الزامی است');
    }

    if (!['sleep', 'exercise', 'energy', 'mood'].includes(type)) {
      return errorResponse('نوع سلامت نامعتبر است');
    }

    const userLogs = healthLogs.get(payload.sub) || [];
    const newLog = {
      id: generateId(),
      type,
      value: Number(value),
      date,
      createdAt: new Date().toISOString(),
    };

    userLogs.push(newLog);
    healthLogs.set(payload.sub, userLogs);

    return successResponse(newLog, 'لاگ سلامت ثبت شد');
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

    if (!id) return errorResponse('شناسه لاگ الزامی است');

    const userLogs = healthLogs.get(payload.sub) || [];
    const filteredLogs = userLogs.filter((l) => l.id !== id);

    if (filteredLogs.length === userLogs.length) {
      return errorResponse('لاگ یافت نشد', 404);
    }

    healthLogs.set(payload.sub, filteredLogs);
    return successResponse(null, 'لاگ حذف شد');
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}