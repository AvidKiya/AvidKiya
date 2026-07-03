/**
 * POST /api/newsletter  → subscribe (public)
 * GET  /api/newsletter  → list (admin only)
 * DELETE /api/newsletter?id=xxx → remove (admin only)
 */
import { checkAuth } from "./_auth";

interface Env {
  AVIDKIYA_KV: KVNamespace;
  ADMIN_TOKEN: string;
}

const KV_KEY = "cms:newsletter";
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...CORS },
  });
}

async function load(env: Env): Promise<any[]> {
  const raw = await env.AVIDKIYA_KV.get(KV_KEY);
  return raw ? JSON.parse(raw) : [];
}

export const onRequestOptions: PagesFunction<Env> = async () =>
  new Response(null, { status: 204, headers: CORS });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const { email } = await request.json<any>();
    if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      return json({ error: "Invalid email" }, 400);
    }
    const list = await load(env);
    if (list.some((s) => s.email.toLowerCase() === String(email).toLowerCase())) {
      return json({ ok: true, alreadySubscribed: true });
    }
    list.unshift({
      id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      email: String(email).slice(0, 200),
      at: new Date().toISOString(),
    });
    await env.AVIDKIYA_KV.put(KV_KEY, JSON.stringify(list));
    return json({ ok: true });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
};

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await checkAuth(request, env))) return json({ error: "Unauthorized" }, 401);
  return json({ subscribers: await load(env) });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await checkAuth(request, env))) return json({ error: "Unauthorized" }, 401);
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return json({ error: "Missing id" }, 400);
  const list = await load(env);
  await env.AVIDKIYA_KV.put(KV_KEY, JSON.stringify(list.filter((s) => s.id !== id)));
  return json({ ok: true });
};
