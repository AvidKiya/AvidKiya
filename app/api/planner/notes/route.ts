import { NextRequest } from 'next/server';
import { verifyJwt, extractToken } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-types';

const notes = new Map<string, Array<{
  id: string;
  title: string;
  content?: string;
  tags?: string;
  createdAt: string;
}>>();

function generateId() {
  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) return errorResponse('لایسنس الزامی است', 401);

    const secret = process.env.JWT_SECRET || 'default-secret';
    const payload = await verifyJwt(token, secret);
    if (!payload) return errorResponse('لایسنس نامعتبر است', 401);

    const userNotes = notes.get(payload.sub) || [];
    return successResponse(userNotes);
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
    const { title, content, tags } = body;

    if (!title) return errorResponse('عنوان الزامی است');

    const userNotes = notes.get(payload.sub) || [];
    const newNote = {
      id: generateId(),
      title,
      content,
      tags,
      createdAt: new Date().toISOString(),
    };

    userNotes.push(newNote);
    notes.set(payload.sub, userNotes);

    return successResponse(newNote, 'یادداشت ایجاد شد');
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
    const { id, title, content, tags } = body;

    if (!id) return errorResponse('شناسه یادداشت الزامی است');

    const userNotes = notes.get(payload.sub) || [];
    const noteIndex = userNotes.findIndex((n) => n.id === id);

    if (noteIndex === -1) return errorResponse('یادداشت یافت نشد', 404);

    const updatedNote = {
      ...userNotes[noteIndex],
      ...(title && { title }),
      ...(content !== undefined && { content }),
      ...(tags !== undefined && { tags }),
    };

    userNotes[noteIndex] = updatedNote;
    notes.set(payload.sub, userNotes);

    return successResponse(updatedNote, 'یادداشت به‌روزرسانی شد');
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

    if (!id) return errorResponse('شناسه یادداشت الزامی است');

    const userNotes = notes.get(payload.sub) || [];
    const filteredNotes = userNotes.filter((n) => n.id !== id);

    if (filteredNotes.length === userNotes.length) {
      return errorResponse('یادداشت یافت نشد', 404);
    }

    notes.set(payload.sub, filteredNotes);
    return successResponse(null, 'یادداشت حذف شد');
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}