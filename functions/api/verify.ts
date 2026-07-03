/**
 * Cloudflare Pages Function — /api/verify
 * Simple auth check. Returns 200 if the caller supplies the correct
 * ADMIN_TOKEN, 401 otherwise. Also indicates whether KV is bound.
 */

interface Env {
  AVIDKIYA_KV?: KVNamespace;
  ADMIN_TOKEN?: string;
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
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

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const auth = request.headers.get("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const kvBound = !!env.AVIDKIYA_KV;
  const tokenConfigured = !!env.ADMIN_TOKEN;

  if (!tokenConfigured) {
    return json(
      {
        ok: false,
        reason: "ADMIN_TOKEN not configured on server",
        kvBound,
        tokenConfigured,
      },
      503
    );
  }
  if (!token || token !== env.ADMIN_TOKEN) {
    return json(
      { ok: false, reason: "Invalid token", kvBound, tokenConfigured },
      401
    );
  }
  return json({ ok: true, kvBound, tokenConfigured }, 200);
};

export const onRequestGet: PagesFunction<Env> = async ({ env }) =>
  json({
    apiAlive: true,
    kvBound: !!env.AVIDKIYA_KV,
    tokenConfigured: !!env.ADMIN_TOKEN,
  });
