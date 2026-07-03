/**
 * POST /api/change-password
 * Body: { current: string, next: string }
 * Requires Authorization: Bearer <current ADMIN_TOKEN>
 *
 * When called successfully, the new token is stored in KV under
 * `cms:admin-token-override`. `verify.ts` checks this override BEFORE
 * falling back to the env var. This lets the user change the password
 * from the UI without redeploying.
 */

interface Env {
  AVIDKIYA_KV?: KVNamespace;
  ADMIN_TOKEN?: string;
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
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

async function getEffectiveToken(env: Env): Promise<string | null> {
  if (env.AVIDKIYA_KV) {
    const override = await env.AVIDKIYA_KV.get("cms:admin-token-override");
    if (override) return override;
  }
  return env.ADMIN_TOKEN ?? null;
}

export const onRequestOptions: PagesFunction<Env> = async () =>
  new Response(null, { status: 204, headers: CORS });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.AVIDKIYA_KV) {
    return json({ ok: false, error: "KV not bound — cannot persist new password." }, 503);
  }
  const auth = request.headers.get("Authorization") ?? "";
  const supplied = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const effective = await getEffectiveToken(env);
  if (!effective || supplied !== effective) {
    return json({ ok: false, error: "Wrong current password" }, 401);
  }
  const body = await request.json<any>().catch(() => ({}));
  const { current, next } = body;
  if (current !== effective) return json({ ok: false, error: "Wrong current password" }, 401);
  if (typeof next !== "string" || next.length < 8) {
    return json({ ok: false, error: "New password must be at least 8 characters" }, 400);
  }
  await env.AVIDKIYA_KV.put("cms:admin-token-override", next);
  return json({ ok: true });
};
