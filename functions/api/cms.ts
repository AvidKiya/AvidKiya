/**
 * /api/cms — GET / POST / DELETE the CMS state stored in KV.
 */
import { checkAuth } from "./_auth";

interface Env {
  AVIDKIYA_KV: KVNamespace;
  ADMIN_TOKEN: string;
}

const KV_KEY = "cms:state";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Max-Age": "86400",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...CORS,
    },
  });
}

export const onRequestOptions: PagesFunction<Env> = async () =>
  new Response(null, { status: 204, headers: CORS });

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    const raw = await env.AVIDKIYA_KV.get(KV_KEY);
    if (!raw) return json({ state: null }, 200);
    return json({ state: JSON.parse(raw) }, 200);
  } catch (e) {
    return json({ error: "Failed to read", detail: String(e) }, 500);
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await checkAuth(request, env))) return json({ error: "Unauthorized" }, 401);
  try {
    const body = await request.json<any>();
    if (!body || typeof body !== "object") return json({ error: "Invalid body" }, 400);
    await env.AVIDKIYA_KV.put(KV_KEY, JSON.stringify(body));
    return json({ ok: true, at: new Date().toISOString() }, 200);
  } catch (e) {
    return json({ error: "Failed to write", detail: String(e) }, 500);
  }
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await checkAuth(request, env))) return json({ error: "Unauthorized" }, 401);
  await env.AVIDKIYA_KV.delete(KV_KEY);
  return json({ ok: true }, 200);
};
