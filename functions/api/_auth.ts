export async function effectiveToken(env: any): Promise<string> {
  const override = await env.AVIDKIYA_KV?.get?.('cms:admin-token-override');
  return override || env.ADMIN_TOKEN || '';
}
export async function isAuthed(request: Request, env: any): Promise<boolean> {
  const token = await effectiveToken(env);
  if (!token) return false;
  const h = request.headers.get('authorization') || '';
  const bodyToken = request.headers.get('x-admin-token') || '';
  return h === `Bearer ${token}` || bodyToken === token;
}
export function json(body: any, status = 200) { return new Response(JSON.stringify(body), { status, headers: { 'Content-Type':'application/json;charset=UTF-8', 'Cache-Control':'no-store' } }); }
export async function readJson(request: Request) { return await request.json().catch(()=>({})); }
export async function getCms(env:any){ const raw=await env.AVIDKIYA_KV?.get?.('cms:state'); return raw?JSON.parse(raw):null; }
export async function putCms(env:any,cms:any){ await env.AVIDKIYA_KV?.put?.('cms:state', JSON.stringify(cms)); }
