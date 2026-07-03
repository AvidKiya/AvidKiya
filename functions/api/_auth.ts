/**
 * Shared auth helper: resolves the "effective" admin token, giving
 * priority to a KV-stored override (set via /api/change-password) so
 * users can rotate their password from the UI without redeploying.
 */

export interface AuthEnv {
  AVIDKIYA_KV?: KVNamespace;
  ADMIN_TOKEN?: string;
}

export async function effectiveToken(env: AuthEnv): Promise<string | null> {
  if (env.AVIDKIYA_KV) {
    try {
      const o = await env.AVIDKIYA_KV.get("cms:admin-token-override");
      if (o) return o;
    } catch {}
  }
  return env.ADMIN_TOKEN ?? null;
}

export async function checkAuth(request: Request, env: AuthEnv): Promise<boolean> {
  const auth = request.headers.get("Authorization") ?? "";
  const supplied = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!supplied) return false;
  const t = await effectiveToken(env);
  return !!t && supplied === t;
}
