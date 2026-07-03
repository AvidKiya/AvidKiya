import { getCms, isAuthed, json, putCms, readJson } from './_auth';
export const onRequestGet = async ({ env }: any) => json({ ok:true, cms: await getCms(env) });
export const onRequestPost = async ({ request, env }: any) => { if(!(await isAuthed(request,env))) return json({ ok:false,error:'Unauthorized' },401); const body=await readJson(request); await putCms(env, body.cms || body); return json({ ok:true }); };
export const onRequestDelete = async ({ request, env }: any) => { if(!(await isAuthed(request,env))) return json({ ok:false,error:'Unauthorized' },401); await env.AVIDKIYA_KV?.delete?.('cms:state'); return json({ ok:true }); };
