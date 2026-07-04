import { getKV, setKV } from '@/db';
import { defaultCmsState } from '@/lib/cms/schema';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await getKV('cms:state');
    const state = data ? JSON.parse(data) : { ...defaultCmsState };

    const message = {
      id: crypto.randomUUID(),
      name: body.name || '',
      email: body.email || '',
      subject: body.subject || '',
      body: body.body || '',
      read: false,
      replied: false,
      replyText: '',
      createdAt: new Date().toISOString(),
    };

    if (!state.messages) state.messages = [];
    state.messages.push(message);
    await setKV('cms:state', JSON.stringify(state));

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = await getKV('cms:state');
    const state = data ? JSON.parse(data) : defaultCmsState;
    return Response.json({ messages: state.messages || [] });
  } catch {
    return Response.json({ messages: [] });
  }
}
