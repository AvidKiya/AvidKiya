import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { readPlannerList, requirePlannerUser, writePlannerList } from '@/lib/server/planner-store';

export const runtime = 'edge';

type Notification = { id: string; type: string; title: string; message?: string; read: boolean; createdAt: string };
const COLLECTION = 'notifications';

export async function GET(request: NextRequest) {
  try { const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401); const notifications = await readPlannerList<Notification>(p.sub, COLLECTION); return successResponse({ notifications, unreadCount: notifications.filter(n => !n.read).length }); } catch { return errorResponse('Failed to process request', 500); }
}

export async function PUT(request: NextRequest) {
  try { const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401); const { id, markAllAsRead } = await request.json(); const rows = await readPlannerList<Notification>(p.sub, COLLECTION); const next = markAllAsRead ? rows.map(n => ({ ...n, read: true })) : rows.map(n => n.id === id ? { ...n, read: true } : n); await writePlannerList(p.sub, COLLECTION, next); return successResponse(null, 'Notification updated'); } catch { return errorResponse('Failed to process request', 500); }
}

export async function DELETE(request: NextRequest) {
  try { const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401); const id = new URL(request.url).searchParams.get('id'); if (!id) return errorResponse('Notification ID is required'); const rows = await readPlannerList<Notification>(p.sub, COLLECTION); const next = rows.filter(n => n.id !== id); if (next.length === rows.length) return errorResponse('Notification not found', 404); await writePlannerList(p.sub, COLLECTION, next); return successResponse(null, 'Notification deleted'); } catch { return errorResponse('Failed to process request', 500); }
}
