import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { makePlannerId, readPlannerList, requirePlannerUser, writePlannerList } from '@/lib/server/planner-store';

export const runtime = 'edge';

type Tx = { id: string; type: 'income' | 'expense'; amount: number; category?: string; date: string; createdAt: string };
const COLLECTION = 'finance';

export async function GET(request: NextRequest) {
  try {
    const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401);
    const transactions = await readPlannerList<Tx>(p.sub, COLLECTION);
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return successResponse({ transactions, summary: { income, expense, balance: income - expense } });
  } catch { return errorResponse('Failed to process request', 500); }
}

export async function POST(request: NextRequest) {
  try {
    const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401);
    const { type, amount, category, date } = await request.json();
    if (!type || !amount || !date) return errorResponse('Type, amount and date are required');
    if (!['income', 'expense'].includes(type)) return errorResponse('Invalid transaction type');
    const rows = await readPlannerList<Tx>(p.sub, COLLECTION);
    const tx: Tx = { id: makePlannerId('tx'), type, amount: Number(amount), category, date, createdAt: new Date().toISOString() };
    await writePlannerList(p.sub, COLLECTION, [...rows, tx]);
    return successResponse(tx, 'Transaction created');
  } catch { return errorResponse('Failed to process request', 500); }
}

export async function DELETE(request: NextRequest) {
  try {
    const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401);
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return errorResponse('Transaction ID is required');
    const rows = await readPlannerList<Tx>(p.sub, COLLECTION);
    const next = rows.filter(t => t.id !== id);
    if (next.length === rows.length) return errorResponse('Transaction not found', 404);
    await writePlannerList(p.sub, COLLECTION, next);
    return successResponse(null, 'Transaction deleted');
  } catch { return errorResponse('Failed to process request', 500); }
}
