import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { readPlannerList, requirePlannerUser, writePlannerList } from '@/lib/server/planner-store';
import { cosine, embedText, vectorId, type VectorItem } from '@/lib/server/vector';

export const runtime = 'edge';
const COLLECTION = 'vectors';

async function buildVectors(userId: string) {
  const [notes, tasks, goals, captures] = await Promise.all([
    readPlannerList<any>(userId, 'notes'),
    readPlannerList<any>(userId, 'tasks'),
    readPlannerList<any>(userId, 'goals'),
    readPlannerList<any>(userId, 'captures'),
  ]);
  const items: VectorItem[] = [];
  const push = (sourceType: VectorItem['sourceType'], sourceId: string, title: string, text: string, createdAt?: string) => {
    const body = `${title}\n${text}`.trim();
    if (!body) return;
    items.push({ id: vectorId(sourceType, sourceId), sourceId, sourceType, title: title || sourceType, text, vector: embedText(body), createdAt: createdAt || new Date().toISOString() });
  };
  notes.forEach((n:any) => push('note', n.id, n.title, `${n.content || ''} ${n.tags || ''}`, n.createdAt));
  tasks.forEach((t:any) => push('task', t.id, t.title, `${t.status || ''} ${t.priority || ''} ${t.due || ''}`, t.createdAt));
  goals.forEach((g:any) => push('goal', g.id, g.title, `${g.level || ''} progress ${g.progress || 0}`, g.createdAt));
  captures.forEach((c:any) => push('capture', c.id, c.text?.slice(0, 80) || 'Capture', `${c.text || ''} ${c.category || ''}`, c.createdAt));
  await writePlannerList(userId, COLLECTION, items);
  return items;
}

export async function POST(request: NextRequest) {
  try {
    const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401);
    const items = await buildVectors(p.sub);
    return successResponse({ indexed: items.length }, 'Vector index rebuilt');
  } catch { return errorResponse('Vector reindex failed', 500); }
}

export async function GET(request: NextRequest) {
  try {
    const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401);
    const q = new URL(request.url).searchParams.get('q') || '';
    if (!q.trim()) return successResponse([]);
    let items = await readPlannerList<VectorItem>(p.sub, COLLECTION);
    if (!items.length) items = await buildVectors(p.sub);
    const qv = embedText(q);
    const results = items.map(item => ({ ...item, score: Math.round(cosine(qv, item.vector) * 10000) / 10000 })).filter(r => r.score > 0).sort((a,b)=>b.score-a.score).slice(0, 20).map(({vector, ...r}) => r);
    return successResponse(results);
  } catch { return errorResponse('Vector search failed', 500); }
}
