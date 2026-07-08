import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { kvDelete, kvListJson, kvPutJson } from '@/lib/server/kv-storage';
import { requirePlannerUser } from '@/lib/server/planner-store';
import { extractToken, verifyJwt } from '@/lib/jwt';

export const runtime = 'edge';

type PushSub = { id: string; userId?: string; endpoint: string; subscription: unknown; createdAt: string; userAgent?: string };
function key(id: string) { return `push:subscription:${id}`; }
function idFromEndpoint(endpoint: string) { let h=0; for(let i=0;i<endpoint.length;i++) h=((h<<5)-h+endpoint.charCodeAt(i))|0; return `sub-${Math.abs(h)}`; }
async function isAdmin(request: NextRequest) { const token = extractToken(request); if (!token) return false; const p = await verifyJwt(token, process.env.JWT_SECRET || 'default-secret'); return !!p?.isAdmin; }

export async function POST(request: NextRequest) {
  try {
    const p = await requirePlannerUser(request);
    const body = await request.json();
    const endpoint = body?.endpoint || body?.subscription?.endpoint;
    if (!endpoint) return errorResponse('Push endpoint is required', 400);
    const sub: PushSub = { id: idFromEndpoint(endpoint), userId: p?.sub, endpoint, subscription: body.subscription || body, createdAt: new Date().toISOString(), userAgent: request.headers.get('user-agent') || '' };
    await kvPutJson(key(sub.id), sub);
    return successResponse(sub, 'Push subscription saved');
  } catch { return errorResponse('Failed to save push subscription', 500); }
}

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) return errorResponse('Unauthorized', 401);
    return successResponse(await kvListJson<PushSub>('push:subscription:'));
  } catch { return errorResponse('Failed to load subscriptions', 500); }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return errorResponse('Subscription ID is required', 400);
    await kvDelete(key(id));
    return successResponse(null, 'Push subscription deleted');
  } catch { return errorResponse('Failed to delete subscription', 500); }
}
