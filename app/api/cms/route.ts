import { NextRequest, NextResponse } from 'next/server';
import { defaultCmsState } from '@/lib/cms/default-state';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface KVNamespace {
  get(key: string, type?: string): Promise<any>;
  put(key: string, value: string): Promise<void>;
}

export async function GET() {
  try {
    const kv = (globalThis as any)?.CMS_KV as KVNamespace | undefined;
    if (kv) {
      try {
        const data = await kv.get('cms_state', 'json');
        if (data) return NextResponse.json({ ok: true, data });
      } catch {}
    }
    return NextResponse.json({ ok: true, data: defaultCmsState, source: 'default' });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:{ code:'CMS_READ_FAIL', message:e?.message || 'error' }}, { status:500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const kv = (globalThis as any)?.CMS_KV as KVNamespace | undefined;
    if (kv) {
      try { await kv.put('cms_state', JSON.stringify(body)); } catch {}
    }
    return NextResponse.json({ ok: true, saved: !!kv });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:{ code:'CMS_WRITE_FAIL', message:e?.message || 'error' }}, { status:500 });
  }
}
