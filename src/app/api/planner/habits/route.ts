import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { makePlannerId, readPlannerList, requirePlannerUser, writePlannerList } from '@/lib/server/planner-store';

export const runtime = 'edge';

type Habit = { id: string; name: string; frequency: string; createdAt: string };
type HabitLog = { id: string; habitId: string; date: string; completed: boolean };
const HABITS = 'habits';
const LOGS = 'habitLogs';

export async function GET(request: NextRequest) {
  try { const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401); const habits = await readPlannerList<Habit>(p.sub, HABITS); const logs = await readPlannerList<HabitLog>(p.sub, LOGS); return successResponse({ habits, logs }); } catch { return errorResponse('Failed to process request', 500); }
}

export async function POST(request: NextRequest) {
  try { const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401); const { name, frequency = 'daily' } = await request.json(); if (!name) return errorResponse('Habit name is required'); const rows = await readPlannerList<Habit>(p.sub, HABITS); const habit: Habit = { id: makePlannerId('habit'), name, frequency, createdAt: new Date().toISOString() }; await writePlannerList(p.sub, HABITS, [...rows, habit]); return successResponse(habit, 'Habit created'); } catch { return errorResponse('Failed to process request', 500); }
}

export async function PUT(request: NextRequest) {
  try {
    const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401);
    const { habitId, date, completed = true } = await request.json();
    if (!habitId) return errorResponse('Habit ID is required');
    const day = date || new Date().toISOString().split('T')[0];
    const logs = await readPlannerList<HabitLog>(p.sub, LOGS);
    const idx = logs.findIndex(l => l.habitId === habitId && l.date === day);
    if (idx >= 0) logs[idx] = { ...logs[idx], completed };
    else logs.push({ id: makePlannerId('habit'), habitId, date: day, completed });
    await writePlannerList(p.sub, LOGS, logs);
    return successResponse(null, 'Habit logged');
  } catch { return errorResponse('Failed to process request', 500); }
}

export async function DELETE(request: NextRequest) {
  try { const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401); const id = new URL(request.url).searchParams.get('id'); if (!id) return errorResponse('Habit ID is required'); const rows = await readPlannerList<Habit>(p.sub, HABITS); const next = rows.filter(h => h.id !== id); if (next.length === rows.length) return errorResponse('Habit not found', 404); await writePlannerList(p.sub, HABITS, next); const logs = await readPlannerList<HabitLog>(p.sub, LOGS); await writePlannerList(p.sub, LOGS, logs.filter(l => l.habitId !== id)); return successResponse(null, 'Habit deleted'); } catch { return errorResponse('Failed to process request', 500); }
}
