import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { defaultCmsState } from '@/lib/cms/schema';

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

export async function GET() {
  try {
    const data = await getKV('cms:state');
    const state = data ? JSON.parse(data) : defaultCmsState;
    // Public: only approved comments
    const approved = (state.comments || []).filter((c: { approved: boolean }) => c.approved);
    return Response.json({ comments: approved });
  } catch {
    return Response.json({ comments: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await getKV('cms:state');
    const state = data ? JSON.parse(data) : { ...defaultCmsState };

    const comment = {
      id: crypto.randomUUID(),
      name: body.name || '',
      email: body.email || '',
      role: body.role || '',
      rating: Math.min(5, Math.max(1, body.rating || 5)),
      body: body.body || '',
      approved: false,
      pinned: false,
      createdAt: new Date().toISOString(),
    };

    if (!state.comments) state.comments = [];
    state.comments.push(comment);
    await setKV('cms:state', JSON.stringify(state));

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
