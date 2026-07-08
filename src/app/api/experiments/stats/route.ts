import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { extractToken, verifyJwt } from '@/lib/jwt';
import { kvListJson } from '@/lib/server/kv-storage';

export const runtime = 'edge';

async function requireAdmin(request: NextRequest) {
  const token = extractToken(request);
  if (!token) return null;
  const payload = await verifyJwt(token, process.env.JWT_SECRET || 'default-secret');
  return payload?.isAdmin ? payload : null;
}

export async function GET(request: NextRequest) {
  try {
    if (!(await requireAdmin(request))) return errorResponse('Unauthorized', 401);
    const rows = await kvListJson<any>('ab:');
    const assignments = rows.filter(r => r.experiment && r.variant && !r.event);
    const events = rows.filter(r => r.event);
    const byExperiment: Record<string, any> = {};
    for (const a of assignments) {
      const exp = a.experiment;
      byExperiment[exp] ||= { experiment: exp, variants: {}, totalAssignments: 0, totalEvents: 0 };
      byExperiment[exp].variants[a.variant] ||= { variant: a.variant, assignments: 0, events: 0, conversions: 0 };
      byExperiment[exp].variants[a.variant].assignments++;
      byExperiment[exp].totalAssignments++;
    }
    for (const e of events) {
      const exp = e.experiment;
      byExperiment[exp] ||= { experiment: exp, variants: {}, totalAssignments: 0, totalEvents: 0 };
      const v = e.variant || 'unknown';
      byExperiment[exp].variants[v] ||= { variant: v, assignments: 0, events: 0, conversions: 0 };
      byExperiment[exp].variants[v].events++;
      if (['conversion', 'purchase', 'signup'].includes(e.event)) byExperiment[exp].variants[v].conversions++;
      byExperiment[exp].totalEvents++;
    }
    const summary = Object.values(byExperiment).map((exp: any) => ({ ...exp, variants: Object.values(exp.variants).map((v: any) => ({ ...v, conversionRate: v.assignments ? Math.round((v.conversions / v.assignments) * 10000) / 100 : 0 })) }));
    return successResponse({ summary, assignments: assignments.slice(-200), events: events.slice(-500) });
  } catch { return errorResponse('Failed to load experiment stats', 500); }
}
