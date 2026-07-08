import { NextRequest } from 'next/server';
import { verifyJwt, extractToken } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-types';
import { checkRateLimit, rateLimitedResponse, getClientKey } from '@/lib/rate-limit';
import { kvDelete, kvGetJson, kvListJson, kvPutJson } from '@/lib/server/kv-storage';

export const runtime = 'edge';

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

function messageKey(id: string) { return `admin:message:${id}`; }

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
    const allMessages = await kvListJson<Message>('admin:message:');
    return successResponse(allMessages.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  } catch (error) {
    return errorResponse('Failed to process request', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const rl = await checkRateLimit(`contact:${getClientKey(request)}`, { preset: 'contact' });
    if (!rl.allowed) return rateLimitedResponse(rl);

    const body = await request.json();
    const { name, email, subject, message } = body;
    if (!name || !email || !message) return errorResponse('Name, email and message are required');

    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      email,
      subject: subject || '',
      message,
      read: false,
      createdAt: new Date().toISOString(),
    };

    await kvPutJson(messageKey(newMessage.id), newMessage);
    return successResponse(newMessage, 'Message sent');
  } catch (error) {
    return errorResponse('Failed to process request', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return errorResponse('Unauthorized', 401);

    const body = await request.json();
    const { id, read } = body;
    if (!id) return errorResponse('Message ID is required');

    const msg = await kvGetJson<Message | null>(messageKey(id), null);
    if (!msg) return errorResponse('Message not found', 404);

    const next = { ...msg, read: Boolean(read) };
    await kvPutJson(messageKey(id), next);
    return successResponse(next, 'Message updated');
  } catch (error) {
    return errorResponse('Failed to process request', 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return errorResponse('Unauthorized', 401);
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return errorResponse('Message ID is required');
    await kvDelete(messageKey(id));
    return successResponse(null, 'Message deleted');
  } catch (error) {
    return errorResponse('Failed to process request', 500);
  }
}
