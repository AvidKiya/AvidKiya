import { db } from '@/db';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

async function getKV(key: string): Promise<string | null> {
  try {
    const result = await db.execute(sql`SELECT value FROM kv_store WHERE key = ${key} LIMIT 1`);
    const rows = result.rows as Array<{ value: string }>;
    return rows.length > 0 ? rows[0].value : null;
  } catch {
    return null;
  }
}

async function setKV(key: string, value: string): Promise<void> {
  await db.execute(sql`
    INSERT INTO kv_store (key, value) VALUES (${key}, ${value})
    ON CONFLICT (key) DO UPDATE SET value = ${value}
  `);
}

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
