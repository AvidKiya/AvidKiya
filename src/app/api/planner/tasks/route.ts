import { NextRequest } from 'next/server';
import { verifyJwt, extractToken } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-types';

export const runtime = 'edge';

// In-memory store for demo
const tasks = new Map<string, Array<{
  id: string;
  title: string;
  status: string;
  priority: string;
  due?: string;
  createdAt: string;
}>>();

function generateId() {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return errorResponse('لایسنس الزامی است', 401);
    }

    const secret = process.env.JWT_SECRET || 'default-secret';
    const payload = await verifyJwt(token, secret);
    if (!payload) {
      return errorResponse('لایسنس نامعتبر است', 401);
    }

    const userTasks = tasks.get(payload.sub) || [];
    return successResponse(userTasks);
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return errorResponse('لایسنس الزامی است', 401);
    }

    const secret = process.env.JWT_SECRET || 'default-secret';
    const payload = await verifyJwt(token, secret);
    if (!payload) {
      return errorResponse('لایسنس نامعتبر است', 401);
    }

    const body = await request.json();
    const { title, status = 'todo', priority = 'medium', due } = body;

    if (!title) {
      return errorResponse('عنوان الزامی است');
    }

    const userTasks = tasks.get(payload.sub) || [];
    const newTask = {
      id: generateId(),
      title,
      status,
      priority,
      due,
      createdAt: new Date().toISOString(),
    };

    userTasks.push(newTask);
    tasks.set(payload.sub, userTasks);

    return successResponse(newTask, 'وظیفه ایجاد شد');
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return errorResponse('لایسنس الزامی است', 401);
    }

    const secret = process.env.JWT_SECRET || 'default-secret';
    const payload = await verifyJwt(token, secret);
    if (!payload) {
      return errorResponse('لایسنس نامعتبر است', 401);
    }

    const body = await request.json();
    const { id, title, status, priority, due } = body;

    if (!id) {
      return errorResponse('شناسه وظیفه الزامی است');
    }

    const userTasks = tasks.get(payload.sub) || [];
    const taskIndex = userTasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      return errorResponse('وظیفه یافت نشد', 404);
    }

    const updatedTask = {
      ...userTasks[taskIndex],
      ...(title && { title }),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(due !== undefined && { due }),
    };

    userTasks[taskIndex] = updatedTask;
    tasks.set(payload.sub, userTasks);

    return successResponse(updatedTask, 'وظیفه به‌روزرسانی شد');
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return errorResponse('لایسنس الزامی است', 401);
    }

    const secret = process.env.JWT_SECRET || 'default-secret';
    const payload = await verifyJwt(token, secret);
    if (!payload) {
      return errorResponse('لایسنس نامعتبر است', 401);
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return errorResponse('شناسه وظیفه الزامی است');
    }

    const userTasks = tasks.get(payload.sub) || [];
    const filteredTasks = userTasks.filter((t) => t.id !== id);

    if (filteredTasks.length === userTasks.length) {
      return errorResponse('وظیفه یافت نشد', 404);
    }

    tasks.set(payload.sub, filteredTasks);

    return successResponse(null, 'وظیفه حذف شد');
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}