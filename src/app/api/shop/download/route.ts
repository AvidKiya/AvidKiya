import { NextRequest } from 'next/server';
import { defaultCmsState } from '@/lib/cms/default-state';
import type { CmsState, Product } from '@/lib/cms/types';
import { kvGetJson } from '@/lib/server/kv-storage';

export const runtime = 'edge';

function orderKey(orderId: string) { return `shop:order:${orderId}`; }

async function getProducts(): Promise<Product[]> {
  const cms = await kvGetJson<CmsState>('cms:state:v2', defaultCmsState);
  return cms.shop.products || [];
}

function page(title: string, body: string, ok = true) {
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#0b0f19;color:#e5e7eb;min-height:100vh;margin:0;padding:40px}.card{max-width:760px;margin:auto;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:24px;padding:28px;box-shadow:0 24px 80px rgba(0,0,0,.35)}a{color:white;background:#5d7ae6;text-decoration:none;padding:10px 14px;border-radius:12px;display:inline-block;margin:6px 0}.muted{color:#9ca3af}.bad{color:#fb7185}.ok{color:#34d399}</style></head><body><div class="card"><h1 class="${ok?'ok':'bad'}">${title}</h1>${body}<p><a href="/shop">Back to shop</a></p></div></body></html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const orderId = url.searchParams.get('orderId') || '';
    const productId = url.searchParams.get('productId') || '';
    if (!orderId) return page('Order ID is required', '<p class="muted">Missing orderId.</p>', false);

    const order = await kvGetJson<any | null>(orderKey(orderId), null);
    if (!order) return page('Order not found', '<p class="muted">We could not find this order.</p>', false);
    if (!['paid', 'manual'].includes(order.status)) return page('Downloads are not ready', `<p class="muted">Order status is <b>${order.status}</b>. Downloads unlock after payment is verified.</p>`, false);

    const products = await getProducts();
    const purchased = (order.items || []) as Array<{ id?: string; name: string }>;
    const rows = purchased
      .filter(it => !productId || it.id === productId)
      .map(it => {
        const product = products.find(p => p.id === it.id || p.title.en === it.name || p.title.fa === it.name);
        if (product?.fileUrl) return `<li><b>${it.name}</b><br><a href="${product.fileUrl}" target="_blank" rel="noopener noreferrer">Download file</a></li>`;
        return `<li><b>${it.name}</b><br><span class="muted">No file URL configured for this product yet.</span></li>`;
      }).join('');

    if (!rows) return page('No downloads found', '<p class="muted">No matching purchased item was found.</p>', false);
    return page('Your downloads', `<p class="muted">Order: <code>${orderId}</code></p><ul>${rows}</ul><p><a href="/api/shop/invoice?orderId=${encodeURIComponent(orderId)}">Open invoice</a></p>`);
  } catch (error) {
    return page('Download failed', `<p class="muted">${error instanceof Error ? error.message : 'Unknown error'}</p>`, false);
  }
}
