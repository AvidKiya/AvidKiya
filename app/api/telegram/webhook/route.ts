import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';

interface TelegramMessage {
  message_id: number;
  from: {
    id: number;
    first_name: string;
    username?: string;
  };
  chat: {
    id: number;
  };
  text?: string;
}

const userStates = new Map<number, { step: string; licenseCode?: string }>();

function generateReply(chatId: number, text: string) {
  // In production, this would call Telegram Bot API
  console.log(`Reply to ${chatId}: ${text}`);
}

export async function POST(request: NextRequest) {
  try {
    const update = await request.json();
    
    if (!update.message) {
      return successResponse(null);
    }

    const message: TelegramMessage = update.message;
    const chatId = message.chat.id;
    const text = message.text || '';
    const userId = message.from.id;

    // Rate limiting (simple in-memory)
    // In production, use KV

    // Command handling
    if (text.startsWith('/start')) {
      generateReply(chatId, 'سلام! به KIYA Planner خوش آمدید.\n\nلطفاً لایسنس خود را وارد کنید:\n/link KIYA-XXXX-XXXX-XXXX');
      return successResponse(null);
    }

    if (text.startsWith('/link')) {
      const parts = text.split(' ');
      if (parts.length < 2) {
        generateReply(chatId, 'لطفاً لایسنس را وارد کنید:\n/link KIYA-XXXX-XXXX-XXXX');
        return successResponse(null);
      }

      const licenseCode = parts[1];
      const licensePattern = /^KIYA-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
      
      if (!licensePattern.test(licenseCode)) {
        generateReply(chatId, 'فرمت لایسنس نامعتبر است.');
        return successResponse(null);
      }

      // In production, validate license against database
      userStates.set(userId, { step: 'linked', licenseCode });
      generateReply(chatId, 'لایسنس شما با موفقیت فعال شد!\n\nدستورات:\n/tasks - وظایف امروز\n/goals - اهداف\n/status - وضعیت\n/energy [1-10] - ثبت انرژی');
      return successResponse(null);
    }

    if (text.startsWith('/tasks')) {
      generateReply(chatId, '📋 وظایف امروز:\n\n1. جلسه تیم - ساعت ۱۰\n2. کدنویسی پروژه - ساعت ۱۴\n3. ورزش - ساعت ۱۸');
      return successResponse(null);
    }

    if (text.startsWith('/goals')) {
      generateReply(chatId, '🎯 اهداف فعال:\n\n1. یادگیری React (پیشرفت: ۶۰٪)\n2. ورزش روزانه (پیشرفت: ۸۰٪)');
      return successResponse(null);
    }

    if (text.startsWith('/status')) {
      generateReply(chatId, '📊 وضعیت امروز:\n\n✅ ۲ وظیفه تکمیل شده\n⏱ ۳ ساعت کار مفید\n🔥 ۵ روز streak');
      return successResponse(null);
    }

    if (text.startsWith('/energy')) {
      const parts = text.split(' ');
      const value = parts[1] ? parseInt(parts[1]) : null;
      
      if (!value || value < 1 || value > 10) {
        generateReply(chatId, 'لطفاً مقدار انرژی را بین ۱ تا ۱۰ وارد کنید:\n/energy 7');
        return successResponse(null);
      }

      generateReply(chatId, `⚡ انرژی شما ثبت شد: ${value}/10`);
      return successResponse(null);
    }

    if (text.startsWith('/mood')) {
      const parts = text.split(' ');
      const mood = parts[1];
      
      if (!mood || !['good', 'ok', 'bad'].includes(mood)) {
        generateReply(chatId, 'لطفاً حالت خود را وارد کنید:\n/mood good\n/mood ok\n/mood bad');
        return successResponse(null);
      }

      const moodEmoji = mood === 'good' ? '😊' : mood === 'ok' ? '😐' : '😔';
      generateReply(chatId, `${moodEmoji} حالت شما ثبت شد.`);
      return successResponse(null);
    }

    if (text.startsWith('/idea')) {
      const idea = text.replace('/idea', '').trim();
      if (!idea) {
        generateReply(chatId, 'لطفاً ایده خود را بنویسید:\n/idea ایده من');
        return successResponse(null);
      }

      generateReply(chatId, `💡 ایده ذخیره شد: "${idea}"`);
      return successResponse(null);
    }

    if (text.startsWith('/help')) {
      generateReply(chatId, '📖 راهنمای KIYA Bot:\n\n/start - شروع\n/link KIYA-XXXX - فعال‌سازی لایسنس\n/tasks - وظایف امروز\n/goals - اهداف\n/status - وضعیت\n/energy [1-10] - ثبت انرژی\n/mood [good/ok/bad] - ثبت حالت\n/idea [متن] - ذخیره ایده\n/help - راهنما');
      return successResponse(null);
    }

    // Default: Quick capture
    if (text.trim()) {
      generateReply(chatId, `✅ ثبت شد: "${text.trim()}"`);
    }

    return successResponse(null);
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}

export async function GET() {
  return successResponse({ status: 'ok' });
}