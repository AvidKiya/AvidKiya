import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { checkRateLimit, getClientKey, rateLimitedResponse } from '@/lib/rate-limit';
import { kvDelete, kvGetJson, kvListJson, kvPutJson } from '@/lib/server/kv-storage';
import { extractToken, verifyJwt } from '@/lib/jwt';

export const runtime = 'edge';

type Comment = { id: string; author: string; email?: string; role?: string; text: string; rating?: number; approved: boolean; createdAt: string };
function key(id: string) { return `public:comment:${id}`; }

async function requireAdmin(request: NextRequest) {
  const token = extractToken(request);
  if (!token) return null;
  const payload = await verifyJwt(token, process.env.JWT_SECRET || 'default-secret');
  return payload?.isAdmin ? payload : null;
}

export async function GET(request: NextRequest) {
  try {
    const isAdmin = !!(await requireAdmin(request));
    const rows = await kvListJson<Comment>('public:comment:');
    return successResponse((isAdmin ? rows : rows.filter(c => c.approved)).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  } catch { return errorResponse('Failed to load comments', 500); }
}

export async function POST(request: NextRequest) {
  try {
    const rl = await checkRateLimit(`comment:${getClientKey(request)}`, { windowMs: 60 * 60 * 1000, maxRequests: 3 });
    if (!rl.allowed) return rateLimitedResponse(rl);
    const body = await request.json();
    if (body.website) return successResponse(null, 'Comment received'); // honeypot
    const { name, email, role, text, rating = 5 } = body;
    if (!name || !text) return errorResponse('Name and comment text are required', 400);
    const comment: Comment = { id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, author: name, email, role, text, rating: Number(rating) || 5, approved: false, createdAt: new Date().toISOString() };
    await kvPutJson(key(comment.id), comment);
    return successResponse(comment, 'Comment submitted for moderation');
  } catch { return errorResponse('Failed to submit comment', 500); }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return errorResponse('Unauthorized', 401);
    const body = await request.json();
    const id = String(body.id || '');
    if (!id) return errorResponse('Comment ID is required');
    const current = await kvGetJson<Comment | null>(key(id), null);
    if (!current) return errorResponse('Comment not found', 404);
    const next = { ...current, ...body } as Comment;
    await kvPutJson(key(id), next);
    return successResponse(next, 'Comment updated');
  } catch { return errorResponse('Failed to update comment', 500); }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return errorResponse('Unauthorized', 401);
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return errorResponse('Comment ID is required');
    await kvDelete(key(id));
    return successResponse(null, 'Comment deleted');
  } catch { return errorResponse('Failed to delete comment', 500); }
}
