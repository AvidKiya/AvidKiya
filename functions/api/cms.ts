import { isAuthorized } from "./_auth";

const KEY = "cms:state:v1";

export const onRequestGet: PagesFunction<any> = async ({ env }) => {
  try {
    const raw = await env.AVIDKIYA_KV.get(KEY, "json");
    return Response.json({ ok: true, cms: raw });
  } catch (e:any) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
};

export const onRequestPost: PagesFunction<any> = async ({ request, env }) => {
  if (!await isAuthorized(request, env)) return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    if (!body.cms) throw new Error("cms missing");
    await env.AVIDKIYA_KV.put(KEY, JSON.stringify(body.cms));
    return Response.json({ ok: true });
  } catch (e:any) {
    return Response.json({ ok: false, error: e.message }, { status: 400 });
  }
};

export const onRequestDelete: PagesFunction<any> = async ({ request, env }) => {
  if (!await isAuthorized(request, env)) return Response.json({ ok: false }, { status: 401 });
  await env.AVIDKIYA_KV.delete(KEY);
  return Response.json({ ok: true });
};
