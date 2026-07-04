import { getKV, setKV } from '@/db';
import { defaultCmsState } from '@/lib/cms/schema';

export const dynamic = 'force-dynamic';

const CMS_KEY = 'cms:state';

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

    const body = await request.json();
    if (body.action === 'poll-vote') {
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

    if (token !== adminToken) {
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
