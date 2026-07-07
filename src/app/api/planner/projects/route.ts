import { NextRequest } from 'next/server';
import { verifyJwt, extractToken } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-types';

export const runtime = 'edge';

const projects = new Map<string, Array<{
  id: string;
  name: string;
  status: string;
  createdAt: string;
}>>();

function generateId() {
  return `project-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) return errorResponse('لایسنس الزامی است', 401);

    const secret = process.env.JWT_SECRET || 'default-secret';
    const payload = await verifyJwt(token, secret);
    if (!payload) return errorResponse('لایسنس نامعتبر است', 401);

    const userProjects = projects.get(payload.sub) || [];
    return successResponse(userProjects);
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
    const { name, status = 'active' } = body;

    if (!name) return errorResponse('نام پروژه الزامی است');

    const userProjects = projects.get(payload.sub) || [];
    const newProject = {
      id: generateId(),
      name,
      status,
      createdAt: new Date().toISOString(),
    };

    userProjects.push(newProject);
    projects.set(payload.sub, userProjects);

    return successResponse(newProject, 'پروژه ایجاد شد');
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
    const { id, name, status } = body;

    if (!id) return errorResponse('شناسه پروژه الزامی است');

    const userProjects = projects.get(payload.sub) || [];
    const projectIndex = userProjects.findIndex((p) => p.id === id);

    if (projectIndex === -1) return errorResponse('پروژه یافت نشد', 404);

    const updatedProject = {
      ...userProjects[projectIndex],
      ...(name && { name }),
      ...(status && { status }),
    };

    userProjects[projectIndex] = updatedProject;
    projects.set(payload.sub, userProjects);

    return successResponse(updatedProject, 'پروژه به‌روزرسانی شد');
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

    if (!id) return errorResponse('شناسه پروژه الزامی است');

    const userProjects = projects.get(payload.sub) || [];
    const filteredProjects = userProjects.filter((p) => p.id !== id);

    if (filteredProjects.length === userProjects.length) {
      return errorResponse('پروژه یافت نشد', 404);
    }

    projects.set(payload.sub, filteredProjects);
    return successResponse(null, 'پروژه حذف شد');
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}