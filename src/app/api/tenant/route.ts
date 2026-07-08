import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { getTenantByHost, saveTenant, type TenantConfig } from '@/lib/server/tenant';
import { extractToken, verifyJwt } from '@/lib/jwt';

export const runtime = 'edge';

async function isAdmin(request: NextRequest) {
  const token = extractToken(request);
  if (!token) return false;
  const payload = await verifyJwt(token, process.env.JWT_SECRET || 'default-secret');
  return !!payload?.isAdmin;
}

export async function GET(request: NextRequest) {
  try {
    const host = request.headers.get('host') || 'default';
    return successResponse(await getTenantByHost(host));
  } catch { return errorResponse('Failed to load tenant', 500); }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) return errorResponse('Unauthorized', 401);
    const body = await request.json() as TenantConfig;
    if (!body.id) return errorResponse('Tenant ID is required', 400);
    return successResponse(await saveTenant({ ...body, enabled: body.enabled ?? true, createdAt: body.createdAt || new Date().toISOString() }), 'Tenant saved');
  } catch { return errorResponse('Failed to save tenant', 500); }
}
