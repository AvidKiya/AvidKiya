import { NextRequest } from 'next/server';
import { verifyJwt, extractToken } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-types';

export const runtime = 'edge';

// Email templates
const templates = {
  welcome: {
    subject: 'خوش آمدید به AvidKiya!',
    html: (name: string) => `
      <div dir="rtl" style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>خوش آمدید ${name}!</h1>
        <p>از عضویت شما در AvidKiya متشکریم.</p>
        <p>با استفاده از KIYA Planner می‌توانید زندگی خود را بهتر مدیریت کنید.</p>
        <a href="https://avidkiya.com/planner" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">
          شروع کنید
        </a>
      </div>
    `,
  },
  licenseExpiry: {
    subject: 'لایسنس شما در حال منقضی شدن است',
    html: (name: string, daysLeft: number) => `
      <div dir="rtl" style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>یادآوری انقضای لایسنس</h1>
        <p>سلام ${name}،</p>
        <p>لایسنس KIYA شما تا ${daysLeft} روز دیگر منقضی می‌شود.</p>
        <p>برای ادامه استفاده از امکانات، لطفاً اشتراک خود را تمدید کنید.</p>
        <a href="https://avidkiya.com/pricing" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">
          تمدید اشتراک
        </a>
      </div>
    `,
  },
  purchaseConfirmation: {
    subject: 'تأیید خرید',
    html: (name: string, product: string, amount: number) => `
      <div dir="rtl" style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>خرید شما تأیید شد</h1>
        <p>سلام ${name}،</p>
        <p>خرید شما با موفقیت انجام شد:</p>
        <ul>
          <li>محصول: ${product}</li>
          <li>مبلغ: $${amount}</li>
        </ul>
        <p>لینک دانلود به ایمیل شما ارسال خواهد شد.</p>
      </div>
    `,
  },
};

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) return errorResponse('لایسنس الزامی است', 401);

    const secret = process.env.JWT_SECRET || 'default-secret';
    const payload = await verifyJwt(token, secret);
    if (!payload) return errorResponse('لایسنس نامعتبر است', 401);

    if (!payload.isAdmin) {
      return errorResponse('دسترسی غیرمجاز', 403);
    }

    const body = await request.json();
    const { to, template, data } = body;

    if (!to || !template) {
      return errorResponse('گیرنده و قالب الزامی است');
    }

    if (!templates[template as keyof typeof templates]) {
      return errorResponse('قالب نامعتبر است');
    }

    // In production, this would use Resend API
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({ from, to, subject, html });

    console.log(`Email sent to ${to} using template ${template}`);

    return successResponse(null, 'ایمیل ارسال شد');
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}