import { NextRequest } from 'next/server';
import { verifyJwt, extractToken } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-types';

export const runtime = 'edge';

const transactions = new Map<string, Array<{
  id: string;
  type: string;
  amount: number;
  category?: string;
  date: string;
  createdAt: string;
}>>();

function generateId() {
  return `tx-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) return errorResponse('لایسنس الزامی است', 401);

    const secret = process.env.JWT_SECRET || 'default-secret';
    const payload = await verifyJwt(token, secret);
    if (!payload) return errorResponse('لایسنس نامعتبر است', 401);

    const userTransactions = transactions.get(payload.sub) || [];
    
    // Calculate summary
    const income = userTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = userTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return successResponse({
      transactions: userTransactions,
      summary: {
        income,
        expense,
        balance: income - expense,
      },
    });
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) return errorResponse('لایسنس الزامی است', 401);

    const secret = process.env.JWT_SECRET || 'default-secret';
    const payload = await verifyJwt(token, secret);
    if (!payload) return errorResponse('لایسنس نامعتبر است', 401);

    const body = await request.json();
    const { type, amount, category, date } = body;

    if (!type || !amount || !date) {
      return errorResponse('نوع، مبلغ و تاریخ الزامی است');
    }

    if (!['income', 'expense'].includes(type)) {
      return errorResponse('نوع تراکنش نامعتبر است');
    }

    const userTransactions = transactions.get(payload.sub) || [];
    const newTransaction = {
      id: generateId(),
      type,
      amount: Number(amount),
      category,
      date,
      createdAt: new Date().toISOString(),
    };

    userTransactions.push(newTransaction);
    transactions.set(payload.sub, userTransactions);

    return successResponse(newTransaction, 'تراکنش ایجاد شد');
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) return errorResponse('لایسنس الزامی است', 401);

    const secret = process.env.JWT_SECRET || 'default-secret';
    const payload = await verifyJwt(token, secret);
    if (!payload) return errorResponse('لایسنس نامعتبر است', 401);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return errorResponse('شناسه تراکنش الزامی است');

    const userTransactions = transactions.get(payload.sub) || [];
    const filteredTransactions = userTransactions.filter((t) => t.id !== id);

    if (filteredTransactions.length === userTransactions.length) {
      return errorResponse('تراکنش یافت نشد', 404);
    }

    transactions.set(payload.sub, filteredTransactions);
    return successResponse(null, 'تراکنش حذف شد');
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}