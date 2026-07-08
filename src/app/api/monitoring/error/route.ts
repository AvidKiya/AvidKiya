import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { kvListJson, kvPutJson } from '@/lib/server/kv-storage';
import { extractToken, verifyJwt } from '@/lib/jwt';

export const runtime = 'edge';

type ClientError = { id: string; message: string; stack?: string; componentStack?: string; path?: string; userAgent?: string; createdAt: string };
function key(id: string) { return `monitoring:error:${id}`; }
async function isAdmin(request: NextRequest) { const token = extractToken(request); if (!token) return false; const p = await verifyJwt(token, process.env.JWT_SECRET || 'default-secret'); return !!p?.isAdmin; }

async function notify(error: ClientError) {
  const url = process.env.MONITORING_WEBHOOK_URL;
  if (!url) return;
  await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(error) }).catch(() => {});
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const err: ClientError = { id: `err-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, message: String(body.message || 'Unknown error'), stack: body.stack, componentStack: body.componentStack, path: body.path, userAgent: request.headers.get('user-agent') || '', createdAt: new Date().toISOString() };
    await kvPutJson(key(err.id), err);
    await notify(err);
    return successResponse(null, 'Error captured');
  } catch { return errorResponse('Failed to capture error', 500); }
}

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) return errorResponse('Unauthorized', 401);
    const rows = await kvListJson<ClientError>('monitoring:error:');
    return successResponse(rows.sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).slice(0, 200));
  } catch { return errorResponse('Failed to load errors', 500); }
}
