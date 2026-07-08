import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { extractToken, verifyJwt } from '@/lib/jwt';
import { kvListJson, kvPutJson } from '@/lib/server/kv-storage';
import { makePlannerId, readPlannerList, writePlannerList } from '@/lib/server/planner-store';

export const runtime = 'edge';

async function requireAdmin(request: NextRequest) { const token = extractToken(request); if (!token) return null; const payload = await verifyJwt(token, process.env.JWT_SECRET || 'default-secret'); return payload?.isAdmin ? payload : null; }
async function sendGateway(payload: any) {
  const gateway = process.env.PUSH_GATEWAY_URL;
  if (!gateway) return { sent: false, reason: 'PUSH_GATEWAY_URL not configured' };
  const res = await fetch(gateway, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
  return { sent: res.ok, status: res.status, body: await res.text().catch(()=> '') };
}

export async function POST(request: NextRequest) {
  try {
    if (!(await requireAdmin(request))) return errorResponse('Unauthorized', 401);
    const { title = 'KIYA update', message = '', userId = '', url = '/planner/app' } = await request.json();
    const subs = await kvListJson<any>('push:subscription:');
    const targets = userId ? subs.filter(s => s.userId === userId) : subs;
    const queued = [];
    for (const sub of targets) {
      const payload = { id: `push-${Date.now()}-${Math.random().toString(36).slice(2,8)}`, subscriptionId: sub.id, userId: sub.userId, title, message, url, status: 'queued', createdAt: new Date().toISOString(), subscription: sub.subscription };
      const gatewayResult = await sendGateway(payload).catch(e => ({ sent:false, reason:e instanceof Error ? e.message : 'gateway failed' }));
      const stored = { ...payload, status: gatewayResult.sent ? 'sent' : 'queued', gatewayResult };
      await kvPutJson(`push:message:${payload.id}`, stored);
      queued.push(stored);
      if (sub.userId) { const list = await readPlannerList<any>(sub.userId, 'notifications'); list.unshift({ id: makePlannerId('notif'), type: 'system', title, message, read: false, createdAt: new Date().toISOString() }); await writePlannerList(sub.userId, 'notifications', list.slice(0, 100)); }
    }
    return successResponse({ queued: queued.length, sent: queued.filter(q=>q.status==='sent').length, targets: targets.length }, 'Push message processed');
  } catch { return errorResponse('Failed to process push message', 500); }
}
