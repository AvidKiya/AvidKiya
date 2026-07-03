import { isAuthorized, effectiveToken } from "./_auth";

export const onRequestGet: PagesFunction<{ADMIN_TOKEN:string, AVIDKIYA_KV:KVNamespace}> = async ({ request, env }) => {
  const ok = await isAuthorized(request, env);
  let kv = false;
  try { await env.AVIDKIYA_KV.get("ping"); kv = true; } catch {}
  return Response.json({ ok, kv, api: true });
};

export const onRequestPost = onRequestGet;
