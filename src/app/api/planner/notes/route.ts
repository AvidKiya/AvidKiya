import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { makePlannerId, readPlannerList, requirePlannerUser, writePlannerList } from '@/lib/server/planner-store';

export const runtime = 'edge';

type Note = { id: string; title: string; content?: string; tags?: string; createdAt: string; updatedAt?: string };
const COLLECTION = 'notes';

export async function GET(request: NextRequest) {
  try { const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401); return successResponse(await readPlannerList<Note>(p.sub, COLLECTION)); } catch { return errorResponse('Failed to process request', 500); }
}

export async function POST(request: NextRequest) {
  try {
    const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401);
    const { title, content, tags } = await request.json();
    if (!title) return errorResponse('Title is required');
    const rows = await readPlannerList<Note>(p.sub, COLLECTION);
    const note: Note = { id: makePlannerId('note'), title, content, tags, createdAt: new Date().toISOString() };
    await writePlannerList(p.sub, COLLECTION, [...rows, note]);
    return successResponse(note, 'Note created');
  } catch { return errorResponse('Failed to process request', 500); }
}

export async function PUT(request: NextRequest) {
  try {
    const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401);
    const { id, title, content, tags } = await request.json();
    if (!id) return errorResponse('Note ID is required');
    const rows = await readPlannerList<Note>(p.sub, COLLECTION);
    const idx = rows.findIndex(n => n.id === id);
    if (idx === -1) return errorResponse('Note not found', 404);
    const updated: Note = { ...rows[idx], ...(title !== undefined && { title }), ...(content !== undefined && { content }), ...(tags !== undefined && { tags }), updatedAt: new Date().toISOString() };
    rows[idx] = updated;
    await writePlannerList(p.sub, COLLECTION, rows);
    return successResponse(updated, 'Note updated');
  } catch { return errorResponse('Failed to process request', 500); }
}

export async function DELETE(request: NextRequest) {
  try {
    const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401);
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return errorResponse('Note ID is required');
    const rows = await readPlannerList<Note>(p.sub, COLLECTION);
    const next = rows.filter(n => n.id !== id);
    if (next.length === rows.length) return errorResponse('Note not found', 404);
    await writePlannerList(p.sub, COLLECTION, next);
    return successResponse(null, 'Note deleted');
  } catch { return errorResponse('Failed to process request', 500); }
}
