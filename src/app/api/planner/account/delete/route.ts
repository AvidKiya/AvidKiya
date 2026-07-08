import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { kvDelete, kvGetJson, kvPutJson } from '@/lib/server/kv-storage';
import { plannerListKey, requirePlannerUser } from '@/lib/server/planner-store';

export const runtime = 'edge';

type DeletionRequest = { userId: string; requestedAt: string; deleteAfter: string; status: 'scheduled' | 'cancelled' | 'deleted' };
function deletionKey(userId: string) { return `planner:${userId}:deletion`; }
const COLLECTIONS = ['tasks','habits','habitLogs','goals','finance','health','notes','calendar','projects','notifications','captures','aiChat'];

async function hardDelete(userId: string) {
  await Promise.all(COLLECTIONS.map(c => kvDelete(plannerListKey(userId, c))));
  await kvPutJson(deletionKey(userId), { userId, requestedAt: new Date().toISOString(), deleteAfter: new Date().toISOString(), status: 'deleted' } satisfies DeletionRequest);
}

export async function GET(request: NextRequest) {
  try {
    const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401);
    return successResponse(await kvGetJson<DeletionRequest | null>(deletionKey(p.sub), null));
  } catch { return errorResponse('Failed to load deletion status', 500); }
}

export async function POST(request: NextRequest) {
  try {
    const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401);
    const body = await request.json().catch(() => ({}));
    if (body.confirm === 'DELETE_NOW') {
      await hardDelete(p.sub);
      return successResponse(null, 'Account data deleted');
    }
    const requestedAt = new Date();
    const deleteAfter = new Date(requestedAt.getTime() + 30 * 86400000);
    const req: DeletionRequest = { userId: p.sub, requestedAt: requestedAt.toISOString(), deleteAfter: deleteAfter.toISOString(), status: 'scheduled' };
    await kvPutJson(deletionKey(p.sub), req);
    return successResponse(req, 'Account deletion scheduled');
  } catch { return errorResponse('Failed to schedule account deletion', 500); }
}

export async function DELETE(request: NextRequest) {
  try {
    const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401);
    const current = await kvGetJson<DeletionRequest | null>(deletionKey(p.sub), null);
    if (!current) return successResponse(null, 'No deletion request found');
    await kvPutJson(deletionKey(p.sub), { ...current, status: 'cancelled' });
    return successResponse(null, 'Account deletion cancelled');
  } catch { return errorResponse('Failed to cancel account deletion', 500); }
}
