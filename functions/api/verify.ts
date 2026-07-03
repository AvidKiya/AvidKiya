/**
 * /api/verify — POST with Bearer token → check it's the current password.
 * Also returns diagnostic info (kvBound, tokenConfigured).
 */
import { checkAuth, effectiveToken } from "./_auth";

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
  const kvBound = !!env.AVIDKIYA_KV;
  const tokenConfigured = !!(await effectiveToken(env));
  if (!tokenConfigured) {
    return json(
      { ok: false, reason: "ADMIN_TOKEN not configured on server", kvBound, tokenConfigured },
      503
    );
  }
  const ok = await checkAuth(request, env);
  return json({ ok, kvBound, tokenConfigured }, ok ? 200 : 401);
};

export const onRequestGet: PagesFunction<Env> = async ({ env }) =>
  json({
    apiAlive: true,
    kvBound: !!env.AVIDKIYA_KV,
    tokenConfigured: !!(await effectiveToken(env)),
  });
