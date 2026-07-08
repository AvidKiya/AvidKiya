import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { makePlannerId, readPlannerList, requirePlannerUser, writePlannerList } from '@/lib/server/planner-store';

export const runtime = 'edge';

type Goal = { id: string; title: string; level: string; progress: number; createdAt: string; updatedAt?: string };
const COLLECTION = 'goals';

export async function GET(request: NextRequest) { try { const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401); return successResponse(await readPlannerList<Goal>(p.sub, COLLECTION)); } catch { return errorResponse('Failed to process request', 500); } }

export async function POST(request: NextRequest) {
  try { const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401); const { title, level = 'weekly' } = await request.json(); if (!title) return errorResponse('Title is required'); const rows = await readPlannerList<Goal>(p.sub, COLLECTION); const goal: Goal = { id: makePlannerId('goal'), title, level, progress: 0, createdAt: new Date().toISOString() }; await writePlannerList(p.sub, COLLECTION, [...rows, goal]); return successResponse(goal, 'Goal created'); } catch { return errorResponse('Failed to process request', 500); }
}

export async function PUT(request: NextRequest) {
  try { const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401); const { id, title, level, progress } = await request.json(); if (!id) return errorResponse('Goal ID is required'); const rows = await readPlannerList<Goal>(p.sub, COLLECTION); const idx = rows.findIndex(g => g.id === id); if (idx === -1) return errorResponse('Goal not found', 404); const updated: Goal = { ...rows[idx], ...(title !== undefined && { title }), ...(level !== undefined && { level }), ...(progress !== undefined && { progress: Number(progress) }), updatedAt: new Date().toISOString() }; rows[idx] = updated; await writePlannerList(p.sub, COLLECTION, rows); return successResponse(updated, 'Goal updated'); } catch { return errorResponse('Failed to process request', 500); }
}

export async function DELETE(request: NextRequest) {
  try { const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401); const id = new URL(request.url).searchParams.get('id'); if (!id) return errorResponse('Goal ID is required'); const rows = await readPlannerList<Goal>(p.sub, COLLECTION); const next = rows.filter(g => g.id !== id); if (next.length === rows.length) return errorResponse('Goal not found', 404); await writePlannerList(p.sub, COLLECTION, next); return successResponse(null, 'Goal deleted'); } catch { return errorResponse('Failed to process request', 500); }
}
