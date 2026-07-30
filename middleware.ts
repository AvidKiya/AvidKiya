import { NextRequest, NextResponse } from 'next/server';

const encoder = new TextEncoder();

async function hmac(message: string, secret: string) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function validSession(value: string | undefined) {
  if (!value) return false;
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || '';
  if (!secret) return false;
  const [exp, sig] = value.split('.');
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const expected = await hmac(exp, secret);
  return sig === expected;
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (path.startsWith('/kiya/panel')) {
    const ok = await validSession(req.cookies.get('ak_admin_session')?.value);
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = '/kiya/login';
      url.searchParams.set('next', path);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/kiya/panel/:path*'],
};
