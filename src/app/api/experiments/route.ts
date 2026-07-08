import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { kvGetJson, kvPutJson } from '@/lib/server/kv-storage';

export const runtime = 'edge';

type Assignment = { id: string; visitorId: string; experiment: string; variant: string; createdAt: string };
function key(visitorId: string, experiment: string) { return `ab:${experiment}:${visitorId}`; }
function pickVariant(experiment: string, visitorId: string, variants: string[]) {
  const seed = `${experiment}:${visitorId}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  return variants[Math.abs(hash) % variants.length];
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const experiment = url.searchParams.get('experiment') || 'homepage-cta';
    const variants = (url.searchParams.get('variants') || 'A,B').split(',').map(v => v.trim()).filter(Boolean);
    const visitorId = request.headers.get('x-visitor-id') || url.searchParams.get('visitorId') || crypto.randomUUID();
    const existing = await kvGetJson<Assignment | null>(key(visitorId, experiment), null);
    if (existing) return successResponse(existing);
    const assignment: Assignment = { id: `ab-${Date.now()}-${Math.random().toString(36).slice(2,8)}`, visitorId, experiment, variant: pickVariant(experiment, visitorId, variants), createdAt: new Date().toISOString() };
    await kvPutJson(key(visitorId, experiment), assignment);
    return successResponse(assignment);
  } catch { return errorResponse('Failed to assign experiment', 500); }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const visitorId = String(body.visitorId || crypto.randomUUID());
    const experiment = String(body.experiment || 'homepage-cta');
    const event = { id: `ab-event-${Date.now()}-${Math.random().toString(36).slice(2,8)}`, visitorId, experiment, variant: body.variant, event: body.event || 'conversion', props: body.props || {}, createdAt: new Date().toISOString() };
    await kvPutJson(`ab:event:${event.id}`, event);
    return successResponse(event, 'Experiment event tracked');
  } catch { return errorResponse('Failed to track experiment event', 500); }
}
