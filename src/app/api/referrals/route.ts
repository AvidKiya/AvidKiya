import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { kvGetJson, kvListJson, kvPutJson } from '@/lib/server/kv-storage';
import { requirePlannerUser } from '@/lib/server/planner-store';

export const runtime = 'edge';

type Referral = { code: string; ownerId: string; createdAt: string; uses: number };
type ReferralUse = { id: string; code: string; ownerId: string; invitedUserId: string; createdAt: string; rewardDays: number };
function codeFor(userId: string) { return `KIYA-REF-${userId.replace(/[^A-Z0-9]/gi,'').slice(-6).toUpperCase() || Math.random().toString(36).slice(2,8).toUpperCase()}`; }
function referralKey(code: string) { return `referral:code:${code.toUpperCase()}`; }
function referralUseKey(id: string) { return `referral:use:${id}`; }

export async function GET(request: NextRequest) {
  try {
    const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401);
    const code = codeFor(p.sub);
    let ref = await kvGetJson<Referral | null>(referralKey(code), null);
    if (!ref) { ref = { code, ownerId: p.sub, createdAt: new Date().toISOString(), uses: 0 }; await kvPutJson(referralKey(code), ref); }
    const uses = (await kvListJson<ReferralUse>('referral:use:')).filter(u => u.ownerId === p.sub);
    return successResponse({ referral: { ...ref, uses: uses.length }, uses });
  } catch { return errorResponse('Failed to load referral data', 500); }
}

export async function POST(request: NextRequest) {
  try {
    const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401);
    const { code } = await request.json();
    if (!code) return errorResponse('Referral code is required');
    const ref = await kvGetJson<Referral | null>(referralKey(String(code)), null);
    if (!ref) return errorResponse('Referral code not found', 404);
    if (ref.ownerId === p.sub) return errorResponse('You cannot use your own referral code', 400);
    const existing = (await kvListJson<ReferralUse>('referral:use:')).find(u => u.invitedUserId === p.sub);
    if (existing) return errorResponse('Referral already used', 400);
    const use: ReferralUse = { id: `refuse-${Date.now()}-${Math.random().toString(36).slice(2,8)}`, code: ref.code, ownerId: ref.ownerId, invitedUserId: p.sub, createdAt: new Date().toISOString(), rewardDays: 7 };
    await kvPutJson(referralUseKey(use.id), use);
    await kvPutJson(referralKey(ref.code), { ...ref, uses: (ref.uses || 0) + 1 });
    return successResponse(use, 'Referral applied. Both users get 7 reward days.');
  } catch { return errorResponse('Failed to apply referral', 500); }
}
