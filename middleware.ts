import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const res = NextResponse.next();
  res.headers.set('x-tenant-host', request.headers.get('host') || 'default');
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
