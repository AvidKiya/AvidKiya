import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { kvDelete, kvGetJson, kvListJson, kvPutJson } from '@/lib/server/kv-storage';
import { extractToken, verifyJwt } from '@/lib/jwt';

export const runtime = 'edge';

type Vendor = { id: string; name: string; email?: string; website?: string; status: 'pending'|'active'|'suspended'; commissionRate: number; payoutMethod?: string; createdAt: string; updatedAt?: string };
function key(id: string) { return `marketplace:vendor:${id}`; }
async function isAdmin(request: NextRequest) { const token = extractToken(request); if (!token) return false; const p = await verifyJwt(token, process.env.JWT_SECRET || 'default-secret'); return !!p?.isAdmin; }

export async function GET(request: NextRequest) {
  try {
    const admin = await isAdmin(request);
    const rows = await kvListJson<Vendor>('marketplace:vendor:');
    return successResponse((admin ? rows : rows.filter(v => v.status === 'active')).sort((a,b)=>b.createdAt.localeCompare(a.createdAt)));
  } catch { return errorResponse('Failed to load vendors', 500); }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name) return errorResponse('Vendor name is required', 400);
    const vendor: Vendor = { id: body.id || `vendor-${Date.now()}-${Math.random().toString(36).slice(2,8)}`, name: body.name, email: body.email, website: body.website, status: body.status || 'pending', commissionRate: Number(body.commissionRate ?? 15), payoutMethod: body.payoutMethod, createdAt: new Date().toISOString() };
    await kvPutJson(key(vendor.id), vendor);
    return successResponse(vendor, 'Vendor submitted');
  } catch { return errorResponse('Failed to save vendor', 500); }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) return errorResponse('Unauthorized', 401);
    const body = await request.json();
    if (!body.id) return errorResponse('Vendor ID is required', 400);
    const current = await kvGetJson<Vendor | null>(key(body.id), null);
    if (!current) return errorResponse('Vendor not found', 404);
    const next: Vendor = { ...current, ...body, updatedAt: new Date().toISOString() };
    await kvPutJson(key(next.id), next);
    return successResponse(next, 'Vendor updated');
  } catch { return errorResponse('Failed to update vendor', 500); }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) return errorResponse('Unauthorized', 401);
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return errorResponse('Vendor ID is required', 400);
    await kvDelete(key(id));
    return successResponse(null, 'Vendor deleted');
  } catch { return errorResponse('Failed to delete vendor', 500); }
}
