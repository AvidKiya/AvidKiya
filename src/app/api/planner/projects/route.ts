import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { makePlannerId, readPlannerList, requirePlannerUser, writePlannerList } from '@/lib/server/planner-store';

export const runtime = 'edge';

type Project = { id: string; name: string; status: string; createdAt: string; updatedAt?: string };
const COLLECTION = 'projects';

export async function GET(request: NextRequest) { try { const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401); return successResponse(await readPlannerList<Project>(p.sub, COLLECTION)); } catch { return errorResponse('Failed to process request', 500); } }

export async function POST(request: NextRequest) {
  try { const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401); const { name, status = 'active' } = await request.json(); if (!name) return errorResponse('Project name is required'); const rows = await readPlannerList<Project>(p.sub, COLLECTION); const project: Project = { id: makePlannerId('project'), name, status, createdAt: new Date().toISOString() }; await writePlannerList(p.sub, COLLECTION, [...rows, project]); return successResponse(project, 'Project created'); } catch { return errorResponse('Failed to process request', 500); }
}

export async function PUT(request: NextRequest) {
  try { const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401); const { id, name, status } = await request.json(); if (!id) return errorResponse('Project ID is required'); const rows = await readPlannerList<Project>(p.sub, COLLECTION); const idx = rows.findIndex(x => x.id === id); if (idx === -1) return errorResponse('Project not found', 404); const updated: Project = { ...rows[idx], ...(name !== undefined && { name }), ...(status !== undefined && { status }), updatedAt: new Date().toISOString() }; rows[idx] = updated; await writePlannerList(p.sub, COLLECTION, rows); return successResponse(updated, 'Project updated'); } catch { return errorResponse('Failed to process request', 500); }
}

export async function DELETE(request: NextRequest) {
  try { const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401); const id = new URL(request.url).searchParams.get('id'); if (!id) return errorResponse('Project ID is required'); const rows = await readPlannerList<Project>(p.sub, COLLECTION); const next = rows.filter(x => x.id !== id); if (next.length === rows.length) return errorResponse('Project not found', 404); await writePlannerList(p.sub, COLLECTION, next); return successResponse(null, 'Project deleted'); } catch { return errorResponse('Failed to process request', 500); }
}
