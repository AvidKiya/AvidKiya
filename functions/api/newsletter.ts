import { isAuthorized } from "./_auth";
const CMS_KEY = "cms:state:v1";
async function readCms(env:any){ return (await env.AVIDKIYA_KV.get(CMS_KEY, "json")) || {}; }
async function writeCms(env:any, cms:any){ await env.AVIDKIYA_KV.put(CMS_KEY, JSON.stringify(cms)); }

export const onRequestPost: PagesFunction<any> = async ({ request, env }) => {
  const { email } = await request.json();
  if (!email || !email.includes("@")) return Response.json({ ok:false, error:"invalid email" }, { status:400 });
  const cms:any = await readCms(env);
  cms.newsletter = cms.newsletter || { subscribers: [] };
  cms.newsletter.subscribers = cms.newsletter.subscribers || [];
  if (!cms.newsletter.subscribers.find((s:any)=>s.email===email)) {
    cms.newsletter.subscribers.push({ email, date: new Date().toISOString() });
    await writeCms(env, cms);
  }
  return Response.json({ ok:true });
};

export const onRequestGet: PagesFunction<any> = async ({ request, env }) => {
  if (!await isAuthorized(request, env)) return Response.json({ ok:false }, { status:401 });
  const cms:any = await readCms(env);
  return Response.json({ ok:true, subscribers: cms.newsletter?.subscribers || [] });
};

export const onRequestDelete: PagesFunction<any> = async ({ request, env }) => {
  if (!await isAuthorized(request, env)) return Response.json({ ok:false }, { status:401 });
  const email = new URL(request.url).searchParams.get("email");
  const cms:any = await readCms(env);
  if (cms.newsletter?.subscribers) {
    cms.newsletter.subscribers = cms.newsletter.subscribers.filter((s:any)=>s.email !== email);
    await writeCms(env, cms);
  }
  return Response.json({ ok:true });
};
