import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { readPlannerList, requirePlannerUser } from '@/lib/server/planner-store';

export const runtime = 'edge';

const COLLECTIONS = ['tasks','habits','habitLogs','goals','finance','health','notes','calendar','projects','notifications','captures','aiChat'] as const;

export async function GET(request: NextRequest) {
  try {
    const p = await requirePlannerUser(request);
    if (!p) return errorResponse('License is required or invalid', 401);
    const entries = await Promise.all(COLLECTIONS.map(async c => [c, await readPlannerList(p.sub, c)]));
    return successResponse({ user: { id: p.sub, name: p.name, plan: p.plan }, exportedAt: new Date().toISOString(), data: Object.fromEntries(entries) });
  } catch { return errorResponse('Failed to export planner data', 500); }
}
