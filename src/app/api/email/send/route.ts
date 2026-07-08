import { NextRequest } from 'next/server';
import { verifyJwt, extractToken } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/api-types';
import { sendEmail } from '@/lib/server/email';

export const runtime = 'edge';

const templates = {
  welcome: {
    subject: 'Welcome to KIYA',
    html: (data: any) => `<div style="font-family:system-ui;max-width:620px;margin:auto"><h1>Welcome ${data?.name || ''}!</h1><p>Thanks for joining. Start planning from your KIYA dashboard.</p><p><a href="${process.env.NEXT_PUBLIC_SITE_URL || ''}/planner" style="background:#5d7ae6;color:white;padding:10px 14px;border-radius:10px;text-decoration:none">Open KIYA</a></p></div>`,
  },
  licenseExpiry: {
    subject: 'Your KIYA license is expiring soon',
    html: (data: any) => `<div style="font-family:system-ui;max-width:620px;margin:auto"><h1>License expiry reminder</h1><p>Hi ${data?.name || ''}, your KIYA license expires in ${data?.daysLeft || '?'} days.</p><p><a href="${process.env.NEXT_PUBLIC_SITE_URL || ''}/pricing" style="background:#5d7ae6;color:white;padding:10px 14px;border-radius:10px;text-decoration:none">Renew now</a></p></div>`,
  },
  purchaseConfirmation: {
    subject: 'Purchase confirmation',
    html: (data: any) => `<div style="font-family:system-ui;max-width:620px;margin:auto"><h1>Purchase confirmed</h1><p>Hi ${data?.name || ''}, your purchase was successful.</p><ul><li>Product: ${data?.product || '-'}</li><li>Amount: ${Number(data?.amount || 0).toLocaleString('en-US')} Toman</li></ul></div>`,
  },
};

async function requireAdmin(request: NextRequest) {
  const token = extractToken(request);
  if (!token) return null;
  const payload = await verifyJwt(token, process.env.JWT_SECRET || 'default-secret');
  return payload?.isAdmin ? payload : null;
}

export async function POST(request: NextRequest) {
  try {
    if (!(await requireAdmin(request))) return errorResponse('Unauthorized', 401);
    const { to, template, data, subject, html } = await request.json();
    if (!to) return errorResponse('Recipient is required');

    if (html && subject) {
      const result = await sendEmail({ to, subject, html });
      return successResponse(result, result.sent ? 'Email sent' : 'Email queued/skipped');
    }

    const tpl = templates[template as keyof typeof templates];
    if (!tpl) return errorResponse('Invalid template');
    const result = await sendEmail({ to, subject: tpl.subject, html: tpl.html(data || {}) });
    return successResponse(result, result.sent ? 'Email sent' : 'Email queued/skipped');
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Failed to send email', 500);
  }
}
