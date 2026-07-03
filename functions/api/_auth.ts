export interface Env {
  ADMIN_TOKEN: string;
  AVIDKIYA_KV: KVNamespace;
}

export async function effectiveToken(env: Env): Promise<string> {
  try {
    const override = await env.AVIDKIYA_KV.get("cms:admin-token-override");
    if (override) return override;
  } catch {}
  return env.ADMIN_TOKEN || "admin";
}

export async function isAuthorized(request: Request, env: Env): Promise<boolean> {
  const header = request.headers.get("x-admin-token") || new URL(request.url).searchParams.get("token") || "";
  const tok = await effectiveToken(env);
  return header === tok && tok.length > 0;
}
