import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { kvListJson, kvPutJson } from '@/lib/server/kv-storage';
import { extractToken, verifyJwt } from '@/lib/jwt';

export const runtime = 'edge';

type Payout = { id: string; vendorId: string; amount: number; currency: 'TMN'; status: 'pending'|'paid'|'failed'; note?: string; createdAt: string; updatedAt?: string };
function key(id: string) { return `marketplace:payout:${id}`; }
async function isAdmin(request: NextRequest) { const token = extractToken(request); if (!token) return false; const p = await verifyJwt(token, process.env.JWT_SECRET || 'default-secret'); return !!p?.isAdmin; }

export async function GET(request: NextRequest) {
  try { if (!(await isAdmin(request))) return errorResponse('Unauthorized', 401); return successResponse(await kvListJson<Payout>('marketplace:payout:')); } catch { return errorResponse('Failed to load payouts', 500); }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) return errorResponse('Unauthorized', 401);
    const { vendorId, amount, note } = await request.json();
    if (!vendorId || !amount) return errorResponse('Vendor and amount are required', 400);
    const payout: Payout = { id: `payout-${Date.now()}-${Math.random().toString(36).slice(2,8)}`, vendorId, amount: Number(amount), currency: 'TMN', status: 'pending', note, createdAt: new Date().toISOString() };
    await kvPutJson(key(payout.id), payout);
    return successResponse(payout, 'Payout created');
  } catch { return errorResponse('Failed to create payout', 500); }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) return errorResponse('Unauthorized', 401);
    const body = await request.json();
    if (!body.id) return errorResponse('Payout ID is required', 400);
    const payout = { ...body, updatedAt: new Date().toISOString() };
    await kvPutJson(key(body.id), payout);
    return successResponse(payout, 'Payout updated');
  } catch { return errorResponse('Failed to update payout', 500); }
}
