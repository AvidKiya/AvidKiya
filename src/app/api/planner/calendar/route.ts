import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { makePlannerId, readPlannerList, requirePlannerUser, writePlannerList } from '@/lib/server/planner-store';

export const runtime = 'edge';

type Event = { id: string; title: string; date: string; time?: string; createdAt: string; updatedAt?: string };
const COLLECTION = 'calendar';

export async function GET(request: NextRequest) {
  try { const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401); return successResponse(await readPlannerList<Event>(p.sub, COLLECTION)); } catch { return errorResponse('Failed to process request', 500); }
}

export async function POST(request: NextRequest) {
  try {
    const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401);
    const { title, date, time } = await request.json();
    if (!title || !date) return errorResponse('Title and date are required');
    const rows = await readPlannerList<Event>(p.sub, COLLECTION);
    const event: Event = { id: makePlannerId('event'), title, date, time, createdAt: new Date().toISOString() };
    await writePlannerList(p.sub, COLLECTION, [...rows, event]);
    return successResponse(event, 'Event created');
  } catch { return errorResponse('Failed to process request', 500); }
}

export async function PUT(request: NextRequest) {
  try {
    const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401);
    const { id, title, date, time } = await request.json();
    if (!id) return errorResponse('Event ID is required');
    const rows = await readPlannerList<Event>(p.sub, COLLECTION);
    const idx = rows.findIndex(e => e.id === id);
    if (idx === -1) return errorResponse('Event not found', 404);
    const updated: Event = { ...rows[idx], ...(title !== undefined && { title }), ...(date !== undefined && { date }), ...(time !== undefined && { time }), updatedAt: new Date().toISOString() };
    rows[idx] = updated;
    await writePlannerList(p.sub, COLLECTION, rows);
    return successResponse(updated, 'Event updated');
  } catch { return errorResponse('Failed to process request', 500); }
}

export async function DELETE(request: NextRequest) {
  try {
    const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401);
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return errorResponse('Event ID is required');
    const rows = await readPlannerList<Event>(p.sub, COLLECTION);
    const next = rows.filter(e => e.id !== id);
    if (next.length === rows.length) return errorResponse('Event not found', 404);
    await writePlannerList(p.sub, COLLECTION, next);
    return successResponse(null, 'Event deleted');
  } catch { return errorResponse('Failed to process request', 500); }
}
