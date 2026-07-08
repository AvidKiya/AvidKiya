import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { makePlannerId, readPlannerList, requirePlannerUser, writePlannerList } from '@/lib/server/planner-store';

export const runtime = 'edge';

type HealthLog = { id: string; type: 'sleep' | 'exercise' | 'energy' | 'mood'; value: number; date: string; createdAt: string };
const COLLECTION = 'health';

export async function GET(request: NextRequest) {
  try {
    const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401);
    const logs = await readPlannerList<HealthLog>(p.sub, COLLECTION);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weekLogs = logs.filter(l => new Date(l.date) >= weekAgo);
    const averages = { sleep: 0, exercise: 0, energy: 0, mood: 0 };
    const counts = { sleep: 0, exercise: 0, energy: 0, mood: 0 };
    weekLogs.forEach(log => { averages[log.type] += log.value; counts[log.type]++; });
    (Object.keys(averages) as Array<keyof typeof averages>).forEach(k => { if (counts[k] > 0) averages[k] = Math.round((averages[k] / counts[k]) * 10) / 10; });
    return successResponse({ logs, weeklyAverages: averages });
  } catch { return errorResponse('Failed to process request', 500); }
}

export async function POST(request: NextRequest) {
  try { const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401); const { type, value, date } = await request.json(); if (!type || value === undefined || !date) return errorResponse('Type, value and date are required'); if (!['sleep', 'exercise', 'energy', 'mood'].includes(type)) return errorResponse('Invalid health type'); const rows = await readPlannerList<HealthLog>(p.sub, COLLECTION); const log: HealthLog = { id: makePlannerId('health'), type, value: Number(value), date, createdAt: new Date().toISOString() }; await writePlannerList(p.sub, COLLECTION, [...rows, log]); return successResponse(log, 'Health log saved'); } catch { return errorResponse('Failed to process request', 500); }
}

export async function DELETE(request: NextRequest) {
  try { const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401); const id = new URL(request.url).searchParams.get('id'); if (!id) return errorResponse('Health log ID is required'); const rows = await readPlannerList<HealthLog>(p.sub, COLLECTION); const next = rows.filter(l => l.id !== id); if (next.length === rows.length) return errorResponse('Health log not found', 404); await writePlannerList(p.sub, COLLECTION, next); return successResponse(null, 'Health log deleted'); } catch { return errorResponse('Failed to process request', 500); }
}
