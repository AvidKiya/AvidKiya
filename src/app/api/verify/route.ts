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

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    const envToken = process.env.ADMIN_TOKEN || 'admin';

    // Check KV override first
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
