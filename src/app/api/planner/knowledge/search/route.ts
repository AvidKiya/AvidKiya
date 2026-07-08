import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { readPlannerList, requirePlannerUser } from '@/lib/server/planner-store';

export const runtime = 'edge';

type Result = { id: string; type: 'note'|'task'|'goal'|'capture'; title: string; text: string; score: number; createdAt?: string };
function terms(q: string) { return q.toLowerCase().split(/\s+/).map(t=>t.trim()).filter(t=>t.length>1); }
function score(text: string, ts: string[]) { const lower = text.toLowerCase(); return ts.reduce((s,t)=>s+(lower.includes(t)?1:0),0); }

export async function GET(request: NextRequest) {
  try {
    const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401);
    const q = new URL(request.url).searchParams.get('q') || '';
    if (!q.trim()) return successResponse([]);
    const ts = terms(q);
    const [notes,tasks,goals,captures] = await Promise.all([
      readPlannerList<any>(p.sub,'notes'), readPlannerList<any>(p.sub,'tasks'), readPlannerList<any>(p.sub,'goals'), readPlannerList<any>(p.sub,'captures')
    ]);
    const rows: Result[] = [];
    for (const n of notes) { const text=`${n.title||''} ${n.content||''} ${n.tags||''}`; const sc=score(text,ts); if(sc) rows.push({id:n.id,type:'note',title:n.title||'Note',text:n.content||'',score:sc,createdAt:n.createdAt}); }
    for (const t of tasks) { const text=`${t.title||''} ${t.status||''} ${t.priority||''}`; const sc=score(text,ts); if(sc) rows.push({id:t.id,type:'task',title:t.title||'Task',text:`${t.status||''} ${t.priority||''}`,score:sc,createdAt:t.createdAt}); }
    for (const g of goals) { const text=`${g.title||''} ${g.level||''}`; const sc=score(text,ts); if(sc) rows.push({id:g.id,type:'goal',title:g.title||'Goal',text:`Progress ${g.progress||0}%`,score:sc,createdAt:g.createdAt}); }
    for (const c of captures) { const text=`${c.text||''} ${c.category||''}`; const sc=score(text,ts); if(sc) rows.push({id:c.id,type:'capture',title:c.text?.slice(0,80)||'Capture',text:c.category||'',score:sc,createdAt:c.createdAt}); }
    return successResponse(rows.sort((a,b)=>b.score-a.score).slice(0,25));
  } catch { return errorResponse('Knowledge search failed', 500); }
}
