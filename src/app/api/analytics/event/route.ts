import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { kvPutJson, kvListJson } from '@/lib/server/kv-storage';
import { checkRateLimit, getClientKey, rateLimitedResponse } from '@/lib/rate-limit';
import { extractToken, verifyJwt } from '@/lib/jwt';

export const runtime = 'edge';

type AnalyticsEvent = { id: string; name: string; path?: string; referrer?: string; userAgent?: string; props?: Record<string, unknown>; createdAt: string };
function key(id: string) { return `analytics:event:${id}`; }
async function isAdmin(request: NextRequest) { const token = extractToken(request); if (!token) return false; const p = await verifyJwt(token, process.env.JWT_SECRET || 'default-secret'); return !!p?.isAdmin; }

export async function POST(request: NextRequest) {
  try {
    const rl = await checkRateLimit(`analytics:${getClientKey(request)}`, { windowMs: 60000, maxRequests: 120 });
    if (!rl.allowed) return rateLimitedResponse(rl);
    const body = await request.json();
    const event: AnalyticsEvent = { id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name: String(body.name || 'event'), path: body.path, referrer: body.referrer, props: body.props || {}, userAgent: request.headers.get('user-agent') || '', createdAt: new Date().toISOString() };
    await kvPutJson(key(event.id), event);
    return successResponse(null, 'Event tracked');
  } catch { return errorResponse('Failed to track event', 500); }
}

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) return errorResponse('Unauthorized', 401);
    const rows = await kvListJson<AnalyticsEvent>('analytics:event:');
    return successResponse(rows.sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).slice(0, 500));
  } catch { return errorResponse('Failed to load events', 500); }
}
