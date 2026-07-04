import { getKV, setKV } from '@/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const auth = request.headers.get('authorization');
    const token = auth?.replace('Bearer ', '') || '';
    const envToken = process.env.ADMIN_TOKEN || 'admin';

    const override = await getKV('cms:admin-token-override');
    const validToken = override || envToken;

    if (token !== validToken) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { newToken } = await request.json();
    if (!newToken || newToken.length < 4) {
      return Response.json({ error: 'Token too short' }, { status: 400 });
    }

    await setKV('cms:admin-token-override', newToken);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
