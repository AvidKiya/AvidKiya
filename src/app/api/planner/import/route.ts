import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { makePlannerId, readPlannerList, requirePlannerUser, writePlannerList } from '@/lib/server/planner-store';

export const runtime = 'edge';

type ImportItem = { type: 'task'|'note'|'goal'; title: string; content?: string; status?: string; tags?: string };

function parseCsv(text: string, defaultType: ImportItem['type']): ImportItem[] {
  const lines = text.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
  const [header, ...rows] = lines;
  const cols = header?.toLowerCase().split(',').map(c=>c.trim()) || [];
  return rows.map(row => {
    const values = row.split(',').map(v=>v.trim().replace(/^"|"$/g,''));
    const get = (name: string) => values[cols.indexOf(name)] || '';
    return { type: (get('type') as any) || defaultType, title: get('title') || get('name') || values[0] || 'Imported item', content: get('content') || get('description'), status: get('status') || 'todo', tags: get('tags') };
  });
}

function parseMarkdown(text: string): ImportItem[] {
  const chunks = text.split(/\n(?=# )/g).filter(Boolean);
  if (chunks.length <= 1) {
    const title = text.match(/^#\s+(.+)$/m)?.[1] || 'Imported note';
    return [{ type: 'note', title, content: text }];
  }
  return chunks.map(c => ({ type: 'note', title: c.match(/^#\s+(.+)$/m)?.[1] || 'Imported note', content: c }));
}

export async function POST(request: NextRequest) {
  try {
    const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401);
    const body = await request.json();
    const source = String(body.source || 'generic');
    const format = String(body.format || 'json');
    const defaultType = (body.type || 'note') as ImportItem['type'];
    let items: ImportItem[] = [];
    if (Array.isArray(body.items)) items = body.items;
    else if (format === 'csv') items = parseCsv(String(body.content || ''), defaultType);
    else if (format === 'markdown' || source === 'obsidian') items = parseMarkdown(String(body.content || ''));
    else if (body.content) {
      try { const parsed = JSON.parse(String(body.content)); items = Array.isArray(parsed) ? parsed : parsed.items || []; } catch { items = [{ type: defaultType, title: 'Imported content', content: String(body.content) }]; }
    }
    if (!items.length) return errorResponse('No importable items found', 400);

    const [tasks, notes, goals] = await Promise.all([readPlannerList<any>(p.sub,'tasks'), readPlannerList<any>(p.sub,'notes'), readPlannerList<any>(p.sub,'goals')]);
    const result = { tasks: 0, notes: 0, goals: 0 };
    for (const it of items) {
      if (it.type === 'task') { tasks.push({ id: makePlannerId('task'), title: it.title, status: it.status || 'todo', priority: 'medium', createdAt: new Date().toISOString() }); result.tasks++; }
      else if (it.type === 'goal') { goals.push({ id: makePlannerId('goal'), title: it.title, level: 'imported', progress: 0, createdAt: new Date().toISOString() }); result.goals++; }
      else { notes.push({ id: makePlannerId('note'), title: it.title, content: it.content || '', tags: it.tags || source, createdAt: new Date().toISOString() }); result.notes++; }
    }
    await Promise.all([writePlannerList(p.sub,'tasks',tasks), writePlannerList(p.sub,'notes',notes), writePlannerList(p.sub,'goals',goals)]);
    return successResponse(result, 'Import completed');
  } catch { return errorResponse('Import failed', 500); }
}
