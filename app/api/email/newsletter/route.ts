import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { checkHoneypot } from '@/lib/validation';

const subscribers = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Check honeypot
    if (!checkHoneypot(formData)) {
      // Silently reject bot submissions
      return successResponse(null, 'عضویت شما تأیید شد');
    }

    const email = formData.get('email') as string;

    if (!email) {
      return errorResponse('ایمیل الزامی است');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse('ایمیل معتبر نیست');
    }

    if (subscribers.has(email.toLowerCase())) {
      return errorResponse('این ایمیل قبلاً ثبت شده است');
    }

    subscribers.add(email.toLowerCase());

    // In production, this would:
    // 1. Save to database
    // 2. Send confirmation email via Resend
    // 3. Add to email list

    return successResponse(null, 'عضویت شما با موفقیت ثبت شد');
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}

export async function GET() {
  try {
    return successResponse({
      count: subscribers.size,
    });
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}