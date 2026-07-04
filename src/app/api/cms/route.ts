import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { defaultCmsState } from '@/lib/cms/schema';

export const dynamic = 'force-dynamic';

const CMS_KEY = 'cms:state';

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

export async function GET() {
  try {
    const data = await getKV(CMS_KEY);
    if (data) {
      return Response.json({ state: JSON.parse(data) });
    }
    return Response.json({ state: defaultCmsState });
  } catch {
    return Response.json({ state: defaultCmsState });
  }
}

export async function POST(request: Request) {
  try {
    const adminToken = process.env.ADMIN_TOKEN || 'admin';
    const auth = request.headers.get('authorization');
    const token = auth?.replace('Bearer ', '') || '';

    // Check if this is a poll vote (public)
    const body = await request.json();
    if (body.action === 'poll-vote') {
      // Handle poll vote publicly
      const data = await getKV(CMS_KEY);
      const state = data ? JSON.parse(data) : defaultCmsState;
      const ann = state.announcements?.find((a: { id: string }) => a.id === body.annId);
      if (ann?.pollOptions) {
        const opt = ann.pollOptions.find((o: { id: string }) => o.id === body.optId);
        if (opt) opt.votes = (opt.votes || 0) + 1;
      }
      await setKV(CMS_KEY, JSON.stringify(state));
      return Response.json({ ok: true });
    }

    // Auth required for CMS updates
    if (token !== adminToken) {
      // Check KV override
      const override = await getKV('cms:admin-token-override');
      if (!override || token !== override) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    if (body.state) {
      await setKV(CMS_KEY, JSON.stringify(body.state));
      return Response.json({ ok: true });
    }

    return Response.json({ error: 'Invalid request' }, { status: 400 });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
