import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { readPlannerList, requirePlannerUser } from '@/lib/server/planner-store';

export const runtime = 'edge';

type Node = { id: string; label: string; type: 'note'|'tag'|'task'|'goal'; weight: number };
type Edge = { id: string; source: string; target: string; label?: string };

function tagList(tags: unknown): string[] {
  if (Array.isArray(tags)) return tags.map(String).filter(Boolean);
  if (typeof tags === 'string') return tags.split(',').map(t=>t.trim()).filter(Boolean);
  return [];
}

export async function GET(request: NextRequest) {
  try {
    const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401);
    const [notes, tasks, goals] = await Promise.all([
      readPlannerList<any>(p.sub, 'notes'),
      readPlannerList<any>(p.sub, 'tasks'),
      readPlannerList<any>(p.sub, 'goals'),
    ]);
    const nodes = new Map<string, Node>();
    const edges: Edge[] = [];
    const addNode = (n: Node) => nodes.set(n.id, { ...(nodes.get(n.id) || n), weight: (nodes.get(n.id)?.weight || 0) + n.weight });

    notes.forEach((n:any) => {
      const noteId = `note:${n.id}`;
      addNode({ id: noteId, label: n.title || 'Untitled note', type: 'note', weight: 2 });
      tagList(n.tags).forEach(tag => {
        const tagId = `tag:${tag.toLowerCase()}`;
        addNode({ id: tagId, label: tag, type: 'tag', weight: 1 });
        edges.push({ id: `${noteId}-${tagId}`, source: noteId, target: tagId, label: 'tagged' });
      });
    });
    tasks.slice(-30).forEach((t:any) => {
      const taskId = `task:${t.id}`;
      addNode({ id: taskId, label: t.title || 'Task', type: 'task', weight: 1 });
      const words = String(t.title || '').toLowerCase().split(/\W+/).filter(w=>w.length>3).slice(0,3);
      words.forEach(w => {
        const tagId = `tag:${w}`; addNode({ id: tagId, label: w, type: 'tag', weight: 1 }); edges.push({ id: `${taskId}-${tagId}`, source: taskId, target: tagId });
      });
    });
    goals.forEach((g:any) => {
      const goalId = `goal:${g.id}`;
      addNode({ id: goalId, label: g.title || 'Goal', type: 'goal', weight: 2 });
      const words = String(g.title || '').toLowerCase().split(/\W+/).filter(w=>w.length>3).slice(0,3);
      words.forEach(w => { const tagId = `tag:${w}`; addNode({ id: tagId, label: w, type: 'tag', weight: 1 }); edges.push({ id: `${goalId}-${tagId}`, source: goalId, target: tagId }); });
    });

    return successResponse({ nodes: Array.from(nodes.values()), edges });
  } catch { return errorResponse('Failed to build knowledge graph', 500); }
}
