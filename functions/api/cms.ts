/**
 * Cloudflare Pages Function — /api/cms
 *
 * GET  /api/cms         → returns current CMS state (public — for anyone
 *                         visiting the site to render the latest content)
 * POST /api/cms         → persists new CMS state. Requires
 *                         Authorization: Bearer <ADMIN_TOKEN>
 * DELETE /api/cms       → wipes state (admin only)
 *
 * Bindings expected (configure in Cloudflare dashboard → Pages project → Settings):
 *   - AVIDKIYA_KV       (KV Namespace binding)
 *   - ADMIN_TOKEN       (secret text) — used to authenticate write requests
 */

interface Env {
  AVIDKIYA_KV: KVNamespace;
  ADMIN_TOKEN: string;
}

const KV_KEY = "cms:state";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Max-Age": "86400",
};

function json(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...CORS_HEADERS,
      ...extra,
    },
  });
}

function unauthorized() {
  return json({ error: "Unauthorized" }, 401);
}

function isAuthed(request: Request, env: Env): boolean {
  const auth = request.headers.get("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  return !!env.ADMIN_TOKEN && token === env.ADMIN_TOKEN;
}

export const onRequestOptions: PagesFunction<Env> = async () =>
  new Response(null, { status: 204, headers: CORS_HEADERS });

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
  if (!isAuthed(request, env)) return unauthorized();
  try {
    const body = await request.json<any>();
    if (!body || typeof body !== "object") {
      return json({ error: "Invalid body" }, 400);
    }
    await env.AVIDKIYA_KV.put(KV_KEY, JSON.stringify(body));
    return json({ ok: true, at: new Date().toISOString() }, 200);
  } catch (e) {
    return json({ error: "Failed to write", detail: String(e) }, 500);
  }
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  if (!isAuthed(request, env)) return unauthorized();
  try {
    await env.AVIDKIYA_KV.delete(KV_KEY);
    return json({ ok: true }, 200);
  } catch (e) {
    return json({ error: "Failed to delete", detail: String(e) }, 500);
  }
};
