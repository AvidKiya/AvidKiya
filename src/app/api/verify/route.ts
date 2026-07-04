import { getKV } from '@/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    const envToken = process.env.ADMIN_TOKEN || 'admin';

    const override = await getKV('cms:admin-token-override');
    const validToken = override || envToken;

    if (token === validToken) {
      return Response.json({ ok: true });
    }
    return Response.json({ ok: false, error: 'Invalid token' }, { status: 401 });
  } catch {
    return Response.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
