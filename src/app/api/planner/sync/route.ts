import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { requirePlannerUser } from '@/lib/server/planner-store';

export const runtime = 'edge';

type QueuedRequest = { url: string; method: string; headers?: Record<string,string>; body?: string };

export async function POST(request: NextRequest) {
  try {
    const p = await requirePlannerUser(request);
    if (!p) return errorResponse('License is required or invalid', 401);
    const { requests = [] } = await request.json() as { requests: QueuedRequest[] };
    const results = [];
    const origin = new URL(request.url).origin;
    for (const req of requests.slice(0, 50)) {
      try {
        const target = new URL(req.url, origin);
        if (target.origin !== origin || !target.pathname.startsWith('/api/planner/')) {
          results.push({ ok: false, url: req.url, error: 'Blocked target' });
          continue;
        }
        const res = await fetch(target.toString(), {
          method: req.method,
          headers: { ...(req.headers || {}), Authorization: request.headers.get('authorization') || '' },
          body: req.body,
        });
        results.push({ ok: res.ok, url: req.url, status: res.status });
      } catch (e) {
        results.push({ ok: false, url: req.url, error: e instanceof Error ? e.message : 'Unknown error' });
      }
    }
    return successResponse({ results }, 'Sync complete');
  } catch { return errorResponse('Sync failed', 500); }
}
