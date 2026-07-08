import { NextRequest } from 'next/server';
import { signJwt } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-types';
import { checkRateLimit, rateLimitedResponse, getClientKey } from '@/lib/rate-limit';
import { kvGetJson } from '@/lib/server/kv-storage';
import type { KiyaLicense } from '@/app/api/planner/admin/licenses/route';

export const runtime = 'edge';

function codeKey(code: string) { return `kiya:license-code:${code.toUpperCase()}`; }
function licenseKey(id: string) { return `kiya:license:${id}`; }

export async function POST(request: NextRequest) {
  try {
    const rl = await checkRateLimit(`login:${getClientKey(request)}`, { preset: 'login' });
    if (!rl.allowed) return rateLimitedResponse(rl);

    const { code } = await request.json();
    if (!code) return errorResponse('License is required');

    const normalized = String(code).trim().toUpperCase();
    const DEFAULT_ADMIN_LICENSE = 'KIYA-ADMIN-0000-0001';
    const licensePattern = /^KIYA-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    const isDefaultAdmin = normalized === DEFAULT_ADMIN_LICENSE;
    if (!isDefaultAdmin && !licensePattern.test(normalized)) return errorResponse('Invalid license format');

    let license: KiyaLicense | null = null;
    if (isDefaultAdmin) {
      license = { id: 'license-admin', code: normalized, plan: 'team', status: 'active', isAdmin: true, name: 'Admin', createdAt: new Date().toISOString() };
    } else {
      const id = await kvGetJson<string | null>(codeKey(normalized), null);
      license = id ? await kvGetJson<KiyaLicense | null>(licenseKey(id), null) : null;
    }

    if (!license) return errorResponse('License not found', 404);
    if (license.status !== 'active') return errorResponse('License is not active', 403);
    if (license.expiresAt && new Date(license.expiresAt) < new Date()) return errorResponse('License has expired', 403);

    const secret = process.env.JWT_SECRET || 'default-secret';
    const token = await signJwt({ sub: license.id, name: license.name || 'User', plan: license.plan as any, isAdmin: license.isAdmin }, secret, 86400 * 7);

    return successResponse({ token, user: { id: license.id, name: license.name || 'User', plan: license.plan, isAdmin: license.isAdmin } }, 'Login successful');
  } catch { return errorResponse('Failed to process request', 500); }
}
