import { NextRequest } from 'next/server';
import { extractToken, verifyJwt } from '@/lib/jwt';
import { kvGetJson, kvPutJson } from './kv-storage';

export type PlannerPayload = Awaited<ReturnType<typeof requirePlannerUser>>;

export async function requirePlannerUser(request: NextRequest) {
  const token = extractToken(request);
  if (!token) return null;
  const payload = await verifyJwt(token, process.env.JWT_SECRET || 'default-secret');
  return payload || null;
}

export function plannerListKey(userId: string, collection: string) {
  return `planner:${userId}:${collection}`;
}

export async function readPlannerList<T>(userId: string, collection: string): Promise<T[]> {
  return kvGetJson<T[]>(plannerListKey(userId, collection), []);
}

export async function writePlannerList<T>(userId: string, collection: string, rows: T[]): Promise<T[]> {
  await kvPutJson(plannerListKey(userId, collection), rows);
  return rows;
}

export function makePlannerId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
