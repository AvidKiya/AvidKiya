import { NextRequest } from 'next/server';
import { verifyJwt, extractToken } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-types';

export const runtime = 'edge';

// In-memory store for demo
const captures = new Map<string, Array<{
  id: string;
  text: string;
  category?: string;
  createdAt: string;
}>>();

function generateId() {
  return `capture-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// Simple AI categorization
function categorizeText(text: string): string {
  const lowerText = text.toLowerCase();
  
  // Task indicators
  if (lowerText.includes('باید') || lowerText.includes('انجام') || lowerText.includes('todo') || lowerText.includes('task')) {
    return 'task';
  }
  
  // Event indicators
  if (lowerText.includes('جلسه') || lowerText.includes('meeting') || lowerText.includes('وقت') || lowerText.includes('time')) {
    return 'event';
  }
  
  // Note indicators
  if (lowerText.includes('یادداشت') || lowerText.includes('note') || lowerText.includes('نوشتن') || lowerText.includes('write')) {
    return 'note';
  }
  
  // Idea indicators
  if (lowerText.includes('ایده') || lowerText.includes('idea') || lowerText.includes('فکر') || lowerText.includes('think')) {
    return 'idea';
  }
  
  return 'note'; // default
}

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return errorResponse('لایسنس الزامی است', 401);
    }

    const secret = process.env.JWT_SECRET || 'default-secret';
    const payload = await verifyJwt(token, secret);
    if (!payload) {
      return errorResponse('لایسنس نامعتبر است', 401);
    }

    const body = await request.json();
    const { text } = body;

    if (!text || !text.trim()) {
      return errorResponse('متن الزامی است');
    }

    const category = categorizeText(text);
    const userCaptures = captures.get(payload.sub) || [];
    
    const newCapture = {
      id: generateId(),
      text: text.trim(),
      category,
      createdAt: new Date().toISOString(),
    };

    userCaptures.push(newCapture);
    captures.set(payload.sub, userCaptures);

    return successResponse({
      capture: newCapture,
      message: `ثبت شد (${category === 'task' ? 'وظیفه' : category === 'event' ? 'رویداد' : category === 'idea' ? 'ایده' : 'یادداشت'})`,
    }, 'کپچر ثبت شد');
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return errorResponse('لایسنس الزامی است', 401);
    }

    const secret = process.env.JWT_SECRET || 'default-secret';
    const payload = await verifyJwt(token, secret);
    if (!payload) {
      return errorResponse('لایسنس نامعتبر است', 401);
    }

    const userCaptures = captures.get(payload.sub) || [];
    return successResponse(userCaptures);
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}