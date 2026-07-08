import { NextRequest } from 'next/server';

export const runtime = 'edge';

function siteUrl(request: NextRequest) {
  return (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || new URL(request.url).origin).replace(/\/$/, '');
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const base = siteUrl(request);
  const state = crypto.randomUUID();
  const callback = `${base}/api/auth/oauth/${provider}/callback`;

  if (provider === 'github') {
    const clientId = process.env.GITHUB_CLIENT_ID;
    if (!clientId) return new Response('GITHUB_CLIENT_ID is not configured', { status: 501 });
    const url = new URL('https://github.com/login/oauth/authorize');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', callback);
    url.searchParams.set('scope', 'read:user user:email');
    url.searchParams.set('state', state);
    return Response.redirect(url.toString(), 302);
  }

  if (provider === 'google') {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) return new Response('GOOGLE_CLIENT_ID is not configured', { status: 501 });
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', callback);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'openid email profile');
    url.searchParams.set('state', state);
    return Response.redirect(url.toString(), 302);
  }

  return new Response('Unsupported OAuth provider', { status: 404 });
}
