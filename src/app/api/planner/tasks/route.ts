import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { makePlannerId, readPlannerList, requirePlannerUser, writePlannerList } from '@/lib/server/planner-store';

export const runtime = 'edge';

type Task = { id: string; title: string; status: string; priority: string; due?: string; createdAt: string; updatedAt?: string };
const COLLECTION = 'tasks';

async function auth(request: NextRequest) {
  const payload = await requirePlannerUser(request);
  if (!payload) return null;
  return payload;
}

export async function GET(request: NextRequest) {
  try {
    const payload = await auth(request);
    if (!payload) return errorResponse('License is required or invalid', 401);
    return successResponse(await readPlannerList<Task>(payload.sub, COLLECTION));
  } catch { return errorResponse('Failed to process request', 500); }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await auth(request);
    if (!payload) return errorResponse('License is required or invalid', 401);
    const body = await request.json();
    const { title, status = 'todo', priority = 'medium', due } = body;
    if (!title) return errorResponse('Title is required');
    const rows = await readPlannerList<Task>(payload.sub, COLLECTION);
    const task: Task = { id: makePlannerId('task'), title, status, priority, due, createdAt: new Date().toISOString() };
    await writePlannerList(payload.sub, COLLECTION, [...rows, task]);
    return successResponse(task, 'Task created');
  } catch { return errorResponse('Failed to process request', 500); }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await auth(request);
    if (!payload) return errorResponse('License is required or invalid', 401);
    const body = await request.json();
    const { id, title, status, priority, due } = body;
    if (!id) return errorResponse('Task ID is required');
    const rows = await readPlannerList<Task>(payload.sub, COLLECTION);
    const idx = rows.findIndex(t => t.id === id);
    if (idx === -1) return errorResponse('Task not found', 404);
    const updated: Task = { ...rows[idx], ...(title !== undefined && { title }), ...(status !== undefined && { status }), ...(priority !== undefined && { priority }), ...(due !== undefined && { due }), updatedAt: new Date().toISOString() };
    rows[idx] = updated;
    await writePlannerList(payload.sub, COLLECTION, rows);
    return successResponse(updated, 'Task updated');
  } catch { return errorResponse('Failed to process request', 500); }
}

export async function DELETE(request: NextRequest) {
  try {
    const payload = await auth(request);
    if (!payload) return errorResponse('License is required or invalid', 401);
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return errorResponse('Task ID is required');
    const rows = await readPlannerList<Task>(payload.sub, COLLECTION);
    const next = rows.filter(t => t.id !== id);
    if (next.length === rows.length) return errorResponse('Task not found', 404);
    await writePlannerList(payload.sub, COLLECTION, next);
    return successResponse(null, 'Task deleted');
  } catch { return errorResponse('Failed to process request', 500); }
}
