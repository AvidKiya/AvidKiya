import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { requirePlannerUser } from '@/lib/server/planner-store';
import { kvGetJson, kvPutJson } from '@/lib/server/kv-storage';

export const runtime = 'edge';

type Preferences = {
  dailyDigest: boolean;
  weeklyReport: boolean;
  habitReminders: boolean;
  licenseExpiry: boolean;
  quietHours: { start: string; end: string };
  channels: { inApp: boolean; email: boolean; telegram: boolean; push: boolean };
};
const defaults: Preferences = { dailyDigest: true, weeklyReport: true, habitReminders: true, licenseExpiry: true, quietHours: { start: '22:00', end: '08:00' }, channels: { inApp: true, email: false, telegram: true, push: false } };
function key(userId: string) { return `planner:${userId}:notification-preferences`; }

export async function GET(request: NextRequest) {
  try { const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401); return successResponse(await kvGetJson<Preferences>(key(p.sub), defaults)); } catch { return errorResponse('Failed to load preferences', 500); }
}

export async function PUT(request: NextRequest) {
  try { const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401); const body = await request.json(); const current = await kvGetJson<Preferences>(key(p.sub), defaults); const next = { ...current, ...body, quietHours: { ...current.quietHours, ...(body.quietHours || {}) }, channels: { ...current.channels, ...(body.channels || {}) } }; await kvPutJson(key(p.sub), next); return successResponse(next, 'Notification preferences updated'); } catch { return errorResponse('Failed to update preferences', 500); }
}
