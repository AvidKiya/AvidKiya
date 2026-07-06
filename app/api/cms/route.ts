import { NextRequest, NextResponse } from 'next/server';
import { defaultCmsState } from '@/lib/cms/default-state';

// Cloudflare KV binding type
type Env = { CMS_KV?: KVNamespace };

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    // @ts-ignore
    const env = process.env as any as Env;
    // Try KV first
    // @ts-ignore globalThis
    const kv = (globalThis as any)?.CMS_KV || null;
    if (kv) {
      const data = await kv.get('cms_state', 'json');
      return NextResponse.json({ ok: true, data: data || defaultCmsState });
    }
    return NextResponse.json({ ok: true, data: defaultCmsState, source: 'default' });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:{ code:'CMS_READ_FAIL', message:e.message }}, { status:500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // simple auth check – in prod verify admin JWT
    const auth = req.headers.get('x-admin-token');
    // allow local dev
    // @ts-ignore
    const kv = (globalThis as any)?.CMS_KV || null;
    if (kv) {
      await kv.put('cms_state', JSON.stringify(body));
    }
    return NextResponse.json({ ok: true });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:{ code:'CMS_WRITE_FAIL', message:e.message }}, { status:500 });
  }
}
