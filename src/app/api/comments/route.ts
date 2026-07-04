import { getKV, setKV } from '@/db';
import { defaultCmsState } from '@/lib/cms/schema';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getKV('cms:state');
    const state = data ? JSON.parse(data) : defaultCmsState;
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
