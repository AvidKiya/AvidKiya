import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { extractToken, verifyJwt } from '@/lib/jwt';
import { kvListJson, kvPutJson } from '@/lib/server/kv-storage';

export const runtime = 'edge';

type DeployRun = { id: string; mode: string; status: 'queued'|'failed'; repo: string; workflow?: string; ref?: string; createdAt: string; responseStatus?: number; error?: string };
function key(id: string) { return `deployer:run:${id}`; }
async function requireAdmin(request: NextRequest) { const token = extractToken(request); if (!token) return null; const payload = await verifyJwt(token, process.env.JWT_SECRET || 'default-secret'); return payload?.isAdmin ? payload : null; }
async function logRun(run: DeployRun) { await kvPutJson(key(run.id), run); return run; }

export async function GET(request: NextRequest) {
  try {
    if (!(await requireAdmin(request))) return errorResponse('Unauthorized', 401);
    const runs = await kvListJson<DeployRun>('deployer:run:');
    return successResponse({ configured: !!(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO), repo: process.env.GITHUB_REPO || '', workflow: process.env.GITHUB_WORKFLOW || 'deploy.yml', eventType: process.env.GITHUB_DISPATCH_EVENT || 'deploy', runs: runs.sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).slice(0,100) });
  } catch { return errorResponse('Failed to load deployer status', 500); }
}

export async function POST(request: NextRequest) {
  const id = `deploy-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  try {
    if (!(await requireAdmin(request))) return errorResponse('Unauthorized', 401);
    const token = process.env.GITHUB_TOKEN; const repo = process.env.GITHUB_REPO;
    if (!token || !repo) return errorResponse('GITHUB_TOKEN and GITHUB_REPO are required', 501);
    const body = await request.json().catch(()=>({})); const mode = body.mode || 'workflow';
    if (mode === 'dispatch') {
      const res = await fetch(`https://api.github.com/repos/${repo}/dispatches`, { method:'POST', headers:{Authorization:`Bearer ${token}`, Accept:'application/vnd.github+json', 'Content-Type':'application/json'}, body: JSON.stringify({ event_type: process.env.GITHUB_DISPATCH_EVENT || 'deploy', client_payload: body.payload || {} }) });
      const run = await logRun({ id, mode, repo, status: res.ok ? 'queued' : 'failed', createdAt: new Date().toISOString(), responseStatus: res.status, error: res.ok ? undefined : await res.text().catch(()=> '') });
      if (!res.ok) return errorResponse(`GitHub dispatch failed: ${res.status}`, 500);
      return successResponse(run, 'Repository dispatch sent');
    }
    const workflow = body.workflow || process.env.GITHUB_WORKFLOW || 'deploy.yml'; const ref = body.ref || process.env.GITHUB_REF || 'main';
    const res = await fetch(`https://api.github.com/repos/${repo}/actions/workflows/${workflow}/dispatches`, { method:'POST', headers:{Authorization:`Bearer ${token}`, Accept:'application/vnd.github+json', 'Content-Type':'application/json'}, body: JSON.stringify({ ref, inputs: body.inputs || {} }) });
    const run = await logRun({ id, mode:'workflow', repo, workflow, ref, status: res.ok ? 'queued' : 'failed', createdAt: new Date().toISOString(), responseStatus: res.status, error: res.ok ? undefined : await res.text().catch(()=> '') });
    if (!res.ok) return errorResponse(`GitHub workflow dispatch failed: ${res.status}`, 500);
    return successResponse(run, 'Workflow dispatch sent');
  } catch (e) { await logRun({ id, mode:'unknown', repo: process.env.GITHUB_REPO || '', status:'failed', createdAt: new Date().toISOString(), error: e instanceof Error ? e.message : 'Deploy failed' }).catch(()=>{}); return errorResponse(e instanceof Error ? e.message : 'Deploy failed', 500); }
}
