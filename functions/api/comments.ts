import { isAuthorized } from "./_auth";
const CMS_KEY = "cms:state:v1";
async function readCms(env:any){ return (await env.AVIDKIYA_KV.get(CMS_KEY, "json")) || { comments: [] }; }
async function writeCms(env:any, cms:any){ await env.AVIDKIYA_KV.put(CMS_KEY, JSON.stringify(cms)); }

export const onRequestPost: PagesFunction<any> = async ({ request, env }) => {
  const body:any = await request.json();
  const cms:any = await readCms(env);
  cms.comments = cms.comments || [];
  cms.comments.unshift({
    id: crypto.randomUUID(),
    name: body.name,
    email: body.email,
    role: body.role || "",
    rating: Number(body.rating) || 5,
    text: body.text,
    approved: false,
    pinned: false,
    createdAt: new Date().toISOString()
  });
  await writeCms(env, cms);
  return Response.json({ ok:true });
};

export const onRequestGet: PagesFunction<any> = async ({ request, env }) => {
  const url = new URL(request.url);
  const admin = await isAuthorized(request, env);
  const cms:any = await readCms(env);
  const list = admin || url.searchParams.get("admin")==="1" ? (cms.comments||[]) : (cms.comments||[]).filter((c:any)=>c.approved);
  return Response.json({ ok:true, comments: list });
};

export const onRequestPut: PagesFunction<any> = async ({ request, env }) => {
  if (!await isAuthorized(request, env)) return Response.json({ ok:false }, { status:401 });
  const body:any = await request.json();
  const cms:any = await readCms(env);
  cms.comments = (cms.comments||[]).map((c:any)=> c.id===body.id ? {...c, ...body.patch} : c);
  await writeCms(env, cms);
  return Response.json({ ok:true });
};

export const onRequestDelete: PagesFunction<any> = async ({ request, env }) => {
  if (!await isAuthorized(request, env)) return Response.json({ ok:false }, { status:401 });
  const id = new URL(request.url).searchParams.get("id");
  const cms:any = await readCms(env);
  cms.comments = (cms.comments||[]).filter((c:any)=> c.id !== id);
  await writeCms(env, cms);
  return Response.json({ ok:true });
};
