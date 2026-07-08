import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { readPlannerList, requirePlannerUser } from '@/lib/server/planner-store';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const p = await requirePlannerUser(request);
    if (!p) return errorResponse('License is required or invalid', 401);
    const [tasks, habits, goals, notes, aiChat] = await Promise.all([
      readPlannerList<any>(p.sub, 'tasks'),
      readPlannerList<any>(p.sub, 'habits'),
      readPlannerList<any>(p.sub, 'goals'),
      readPlannerList<any>(p.sub, 'notes'),
      readPlannerList<any>(p.sub, 'aiChat'),
    ]);
    const totalActivity = tasks.length + habits.length + goals.length + notes.length + Math.floor(aiChat.length / 2);
    const completed = tasks.filter(t => t.status === 'done' || t.status === 'completed').length;
    const segments = [p.plan === 'free' ? 'free' : 'paid'];
    if (totalActivity === 0) segments.push('new-user');
    else if (totalActivity < 10) segments.push('starter');
    else if (totalActivity < 50) segments.push('active');
    else segments.push('power-user');
    if (tasks.length > 0 && completed / tasks.length < 0.25) segments.push('needs-focus');
    if (goals.length === 0) segments.push('no-goals');
    if (aiChat.length >= 20) segments.push('ai-engaged');
    return successResponse({ userId: p.sub, plan: p.plan, totalActivity, completedTasks: completed, segments });
  } catch { return errorResponse('Failed to classify user', 500); }
}
