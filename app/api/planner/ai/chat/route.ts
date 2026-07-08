import { NextRequest } from 'next/server';
import { verifyJwt, extractToken } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-types';

const chatMessages = new Map<string, Array<{
  id: string;
  role: string;
  content: string;
  createdAt: string;
}>>();

function generateId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// Simple command detection
function detectCommand(text: string): { command: string; args: string } | null {
  const commands: Record<string, string> = {
    '/ثبت': 'log',
    '/وضعیت': 'status',
    '/روز': 'today',
    '/هفته': 'week',
    '/هدف‌ها': 'goals',
    '/تصمیم': 'decision',
    '/ایده': 'idea',
    '/انرژی': 'energy',
  };

  for (const [cmd, action] of Object.entries(commands)) {
    if (text.startsWith(cmd)) {
      return { command: action, args: text.slice(cmd.length).trim() };
    }
  }
  return null;
}

// Simple AI response generation
function generateResponse(text: string, command: { command: string; args: string } | null): string {
  if (command) {
    switch (command.command) {
      case 'log':
        return `ثبت شد: "${command.args || text}"`;
      case 'status':
        return 'وضعیت امروز: شما ۳ وظیفه فعال دارید. ۲ عادت امروز ثبت شده است.';
      case 'today':
        return 'برنامه امروز: ۱. جلسه تیم ۱۰:۰۰ ۲. کدنویسی پروژه ۱۴:۰۰ ۳. ورزش ۱۸:۰۰';
      case 'week':
        return 'خلاصه هفته: ۱۲ وظیفه تکمیل شده، ۵ عادت ثبت شده، میانگین انرژی: ۷.۵';
      case 'goals':
        return 'اهداف فعال: ۱. یادگیری React (پیشرفت: ۶۰٪) ۲. ورزش روزانه (پیشرفت: ۸۰٪)';
      case 'decision':
        return 'برای تصمیم‌گیری، معیارهای زیر را در نظر بگیرید: اولویت، زمان مورد نیاز، تأثیر بلندمدت.';
      case 'idea':
        return `ایده ذخیره شد: "${command.args || text}"`;
      case 'energy':
        return `انرژی شما ثبت شد: ${command.args || '۷'}/۱۰`;
      default:
        return 'دستور شناسایی نشد.';
    }
  }

  // General response
  const lowerText = text.toLowerCase();
  if (lowerText.includes('سلام') || lowerText.includes('hello')) {
    return 'سلام! چطور می‌تونم کمکتون کنم؟';
  }
  if (lowerText.includes('کمک') || lowerText.includes('help')) {
    return 'من می‌تونم در برنامه‌ریزی، ثبت عادت‌ها، و مدیریت وظایف کمکتون کنم. از دستورات /ثبت، /وضعیت، /روز استفاده کنید.';
  }
  
  return 'متوجه شدم. چطور می‌تونم کمکتون کنم؟';
}

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) return errorResponse('لایسنس الزامی است', 401);

    const secret = process.env.JWT_SECRET || 'default-secret';
    const payload = await verifyJwt(token, secret);
    if (!payload) return errorResponse('لایسنس نامعتبر است', 401);

    const body = await request.json();
    const { message } = body;

    if (!message || !message.trim()) {
      return errorResponse('پیام الزامی است');
    }

    // Save user message
    const userMessages = chatMessages.get(payload.sub) || [];
    const userMsg = {
      id: generateId(),
      role: 'user',
      content: message.trim(),
      createdAt: new Date().toISOString(),
    };
    userMessages.push(userMsg);

    // Detect command and generate response
    const command = detectCommand(message);
    const response = generateResponse(message, command);

    // Save assistant message
    const assistantMsg = {
      id: generateId(),
      role: 'assistant',
      content: response,
      createdAt: new Date().toISOString(),
    };
    userMessages.push(assistantMsg);

    chatMessages.set(payload.sub, userMessages);

    return successResponse({
      userMessage: userMsg,
      assistantMessage: assistantMsg,
    });
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) return errorResponse('لایسنس الزامی است', 401);

    const secret = process.env.JWT_SECRET || 'default-secret';
    const payload = await verifyJwt(token, secret);
    if (!payload) return errorResponse('لایسنس نامعتبر است', 401);

    const userMessages = chatMessages.get(payload.sub) || [];
    return successResponse(userMessages);
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}