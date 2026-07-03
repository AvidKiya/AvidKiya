import { isAuthorized } from "./_auth";

const CMS_KEY = "cms:state:v1";

async function readCms(env:any){ return (await env.AVIDKIYA_KV.get(CMS_KEY, "json")) || {}; }
async function writeCms(env:any, cms:any){ await env.AVIDKIYA_KV.put(CMS_KEY, JSON.stringify(cms)); }

export const onRequestPost: PagesFunction<any> = async ({ request, env }) => {
  try {
    const body:any = await request.json();
    const cms:any = await readCms(env);
    cms.messages = cms.messages || [];
    cms.messages.unshift({
      id: crypto.randomUUID(),
      name: body.name || "",
      email: body.email || "",
      subject: body.subject || "",
      text: body.text || "",
      read: false,
      replied: false,
      createdAt: new Date().toISOString()
    });
    await writeCms(env, cms);
    return Response.json({ ok: true });
  } catch (e:any) {
    return Response.json({ ok: false, error: e.message }, { status: 400 });
  }
};

export const onRequestGet: PagesFunction<any> = async ({ request, env }) => {
  if (!await isAuthorized(request, env)) return Response.json({ ok:false }, { status:401 });
  const cms:any = await readCms(env);
  return Response.json({ ok:true, messages: cms.messages || [] });
};

export const onRequestPut: PagesFunction<any> = async ({ request, env }) => {
  if (!await isAuthorized(request, env)) return Response.json({ ok:false }, { status:401 });
  const body:any = await request.json();
  const cms:any = await readCms(env);
  cms.messages = (cms.messages || []).map((m:any)=> m.id===body.id ? {...m, ...body.patch} : m);
  await writeCms(env, cms);
  return Response.json({ ok:true });
};

export const onRequestDelete: PagesFunction<any> = async ({ request, env }) => {
  if (!await isAuthorized(request, env)) return Response.json({ ok:false }, { status:401 });
  const id = new URL(request.url).searchParams.get("id");
  const cms:any = await readCms(env);
  cms.messages = (cms.messages || []).filter((m:any)=> m.id !== id);
  await writeCms(env, cms);
  return Response.json({ ok:true });
};
