import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { checkRateLimit, rateLimitedResponse } from '@/lib/rate-limit';
import { makePlannerId, readPlannerList, requirePlannerUser, writePlannerList } from '@/lib/server/planner-store';

export const runtime = 'edge';

type Capture = { id: string; text: string; category?: string; createdAt: string };
const COLLECTION = 'captures';

function categorizeText(text: string): string {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('باید') || lowerText.includes('انجام') || lowerText.includes('todo') || lowerText.includes('task')) return 'task';
  if (lowerText.includes('جلسه') || lowerText.includes('meeting') || lowerText.includes('وقت') || lowerText.includes('time')) return 'event';
  if (lowerText.includes('ایده') || lowerText.includes('idea') || lowerText.includes('فکر') || lowerText.includes('think')) return 'idea';
  return 'note';
}

export async function POST(request: NextRequest) {
  try {
    const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401);
    const rl = await checkRateLimit(`capture:${p.sub}`, { preset: 'capture' });
    if (!rl.allowed) return rateLimitedResponse(rl);
    const { text } = await request.json();
    if (!text || !text.trim()) return errorResponse('Text is required');
    const category = categorizeText(text);
    const rows = await readPlannerList<Capture>(p.sub, COLLECTION);
    const capture: Capture = { id: makePlannerId('capture'), text: text.trim(), category, createdAt: new Date().toISOString() };
    await writePlannerList(p.sub, COLLECTION, [...rows, capture]);
    return successResponse({ capture, message: `Saved as ${category}` }, 'Capture saved');
  } catch { return errorResponse('Failed to process request', 500); }
}

export async function GET(request: NextRequest) {
  try { const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401); return successResponse(await readPlannerList<Capture>(p.sub, COLLECTION)); } catch { return errorResponse('Failed to process request', 500); }
}
