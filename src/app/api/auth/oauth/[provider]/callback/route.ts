import { NextRequest } from 'next/server';
import { signJwt } from '@/lib/jwt';

export const runtime = 'edge';

function html(title: string, body: string) {
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>body{font-family:system-ui;background:#0b0f19;color:#e5e7eb;display:grid;place-items:center;min-height:100vh;margin:0}.card{width:min(520px,92vw);background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:24px;padding:28px;text-align:center}a{color:white;background:#5d7ae6;text-decoration:none;padding:10px 14px;border-radius:12px;display:inline-block}</style></head><body><div class="card"><h1>${title}</h1>${body}</div></body></html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

async function exchangeGithub(code: string, redirectUri: string) {
  const res = await fetch('https://github.com/login/oauth/access_token', { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ client_id: process.env.GITHUB_CLIENT_ID, client_secret: process.env.GITHUB_CLIENT_SECRET, code, redirect_uri: redirectUri }) });
  const token = await res.json() as any;
  if (!token.access_token) throw new Error('GitHub token exchange failed');
  const userRes = await fetch('https://api.github.com/user', { headers: { Authorization: `Bearer ${token.access_token}`, Accept: 'application/vnd.github+json' } });
  const user = await userRes.json() as any;
  return { id: `github-${user.id}`, name: user.name || user.login || 'GitHub User', plan: 'free', isAdmin: false };
}

async function exchangeGoogle(code: string, redirectUri: string) {
  const res = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_id: process.env.GOOGLE_CLIENT_ID || '', client_secret: process.env.GOOGLE_CLIENT_SECRET || '', code, grant_type: 'authorization_code', redirect_uri: redirectUri }) });
  const token = await res.json() as any;
  if (!token.access_token) throw new Error('Google token exchange failed');
  const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: `Bearer ${token.access_token}` } });
  const user = await userRes.json() as any;
  return { id: `google-${user.sub}`, name: user.name || user.email || 'Google User', plan: 'free', isAdmin: false };
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) return html('OAuth failed', '<p>Missing authorization code.</p><a href="/planner/login">Back</a>');
  try {
    const redirectUri = `${(process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || url.origin).replace(/\/$/, '')}/api/auth/oauth/${provider}/callback`;
    const user = provider === 'github' ? await exchangeGithub(code, redirectUri) : provider === 'google' ? await exchangeGoogle(code, redirectUri) : null;
    if (!user) return html('OAuth failed', '<p>Unsupported provider.</p><a href="/planner/login">Back</a>');
    const token = await signJwt(user as any, process.env.JWT_SECRET || 'default-secret', 86400 * 7);
    return html('Login successful', `<p>Redirecting to KIYA...</p><script>localStorage.setItem('kiya_jwt', ${JSON.stringify(token)}); localStorage.setItem('kiya_license_ok','1'); localStorage.setItem('kiya_is_admin','0'); location.href='/planner/app';</script><a href="/planner/app">Continue</a>`);
  } catch (error) {
    return html('OAuth failed', `<p>${error instanceof Error ? error.message : 'Unknown error'}</p><a href="/planner/login">Back</a>`);
  }
}
