import { NextRequest } from 'next/server';
import { verifyJwt, extractToken } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-types';
import { kvDelete, kvGetJson, kvListJson, kvPutJson } from '@/lib/server/kv-storage';

export const runtime = 'edge';

export type KiyaLicense = {
  id: string;
  code: string;
  plan: string;
  status: string;
  expiresAt?: string;
  isAdmin: boolean;
  name?: string;
  createdAt: string;
  updatedAt?: string;
};

function licenseKey(id: string) { return `kiya:license:${id}`; }
function codeKey(code: string) { return `kiya:license-code:${code.toUpperCase()}`; }

function generateId() { return `license-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`; }
function generateLicenseCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments: string[] = [];
  for (let i = 0; i < 3; i++) {
    let segment = '';
    for (let j = 0; j < 4; j++) segment += chars.charAt(Math.floor(Math.random() * chars.length));
    segments.push(segment);
  }
  return `KIYA-${segments.join('-')}`;
}

async function requireAdmin(request: NextRequest) {
  const token = extractToken(request);
  if (!token) return null;
  const payload = await verifyJwt(token, process.env.JWT_SECRET || 'default-secret');
  if (!payload?.isAdmin) return null;
  return payload;
}

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return errorResponse('Unauthorized', 401);
    const allLicenses = await kvListJson<KiyaLicense>('kiya:license:');
    return successResponse(allLicenses.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  } catch { return errorResponse('Failed to process request', 500); }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return errorResponse('Unauthorized', 401);
    const { plan = 'free', count = 1, name, expiresAt } = await request.json();
    if (!['free', 'pro', 'pro-ai', 'team'].includes(plan)) return errorResponse('Invalid plan');
    const newLicenses: KiyaLicense[] = [];
    for (let i = 0; i < Math.min(Number(count) || 1, 100); i++) {
      let code = generateLicenseCode();
      // best-effort avoid collision
      for (let tries = 0; tries < 5; tries++) {
        const exists = await kvGetJson<string | null>(codeKey(code), null);
        if (!exists) break;
        code = generateLicenseCode();
      }
      const license: KiyaLicense = { id: generateId(), code, plan, status: 'active', expiresAt, isAdmin: false, name, createdAt: new Date().toISOString() };
      await kvPutJson(licenseKey(license.id), license);
      await kvPutJson(codeKey(license.code), license.id);
      newLicenses.push(license);
    }
    return successResponse(newLicenses, `${newLicenses.length} licenses created`);
  } catch { return errorResponse('Failed to process request', 500); }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return errorResponse('Unauthorized', 401);
    const body = await request.json();
    const { id, plan, status, expiresAt, name } = body;
    if (!id) return errorResponse('License ID is required');
    const current = await kvGetJson<KiyaLicense | null>(licenseKey(id), null);
    if (!current) return errorResponse('License not found', 404);
    const updated: KiyaLicense = { ...current, ...(plan !== undefined && { plan }), ...(status !== undefined && { status }), ...(expiresAt !== undefined && { expiresAt }), ...(name !== undefined && { name }), updatedAt: new Date().toISOString() };
    await kvPutJson(licenseKey(id), updated);
    await kvPutJson(codeKey(updated.code), updated.id);
    return successResponse(updated, 'License updated');
  } catch { return errorResponse('Failed to process request', 500); }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return errorResponse('Unauthorized', 401);
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return errorResponse('License ID is required');
    const current = await kvGetJson<KiyaLicense | null>(licenseKey(id), null);
    if (!current) return errorResponse('License not found', 404);
    await kvDelete(licenseKey(id));
    await kvDelete(codeKey(current.code));
    return successResponse(null, 'License deleted');
  } catch { return errorResponse('Failed to process request', 500); }
}
