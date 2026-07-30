import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const encoder = new TextEncoder();

async function hmac(message: string, secret: string) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: '' }));
  const configuredPassword = process.env.ADMIN_PASSWORD || '';
  const configuredHash = process.env.ADMIN_PASSWORD_SHA256 || '';
  const secret = process.env.ADMIN_SECRET || configuredPassword;

  if (!secret || (!configuredPassword && !configuredHash)) {
    return NextResponse.json({ ok: false, message: 'ADMIN_PASSWORD یا ADMIN_PASSWORD_SHA256 در Environment تنظیم نشده است.' }, { status: 503 });
  }

  const ok = configuredHash ? (await sha256(String(password))) === configuredHash : String(password) === configuredPassword;
  if (!ok) return NextResponse.json({ ok: false, message: 'رمز عبور اشتباه است.' }, { status: 401 });

  const exp = String(Date.now() + 1000 * 60 * 60 * 8);
  const sig = await hmac(exp, secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set('ak_admin_session', `${exp}.${sig}`, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  return res;
}
