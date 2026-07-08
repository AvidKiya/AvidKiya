import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { extractToken, verifyJwt } from '@/lib/jwt';
import { kvDelete, kvGetJson, kvListJson, kvPutJson } from '@/lib/server/kv-storage';

export const runtime = 'edge';

function orderKey(id: string) { return `shop:order:${id}`; }

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
    const orders = await kvListJson<Record<string, unknown>>('shop:order:');
    return successResponse(orders.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || ''))));
  } catch (error) {
    return errorResponse('Failed to load orders', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return errorResponse('Unauthorized', 401);
    const body = await request.json();
    const id = String(body.orderId || '');
    if (!id) return errorResponse('Order ID is required', 400);
    const current = await kvGetJson<Record<string, unknown> | null>(orderKey(id), null);
    if (!current) return errorResponse('Order not found', 404);
    const next = { ...current, ...body, updatedAt: new Date().toISOString() };
    await kvPutJson(orderKey(id), next);
    return successResponse(next, 'Order updated');
  } catch (error) {
    return errorResponse('Failed to update order', 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return errorResponse('Unauthorized', 401);
    const id = new URL(request.url).searchParams.get('orderId');
    if (!id) return errorResponse('Order ID is required', 400);
    await kvDelete(orderKey(id));
    return successResponse(null, 'Order deleted');
  } catch (error) {
    return errorResponse('Failed to delete order', 500);
  }
}
