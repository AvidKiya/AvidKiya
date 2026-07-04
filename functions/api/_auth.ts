// Authentication helper
export async function effectiveToken(env: any): Promise<string | null> {
  // Priority: KV override > ENV
  try {
    const kvOverride = await env.AVIDKIYA_KV?.get("cms:admin-token-override");
    if (kvOverride) return kvOverride;
  } catch {}
  return env.ADMIN_TOKEN || null;
}

export async function verifyAdmin(request: Request, env: any): Promise<boolean> {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return false;
  const effective = await effectiveToken(env);
  if (!effective) return false;
  return token === effective;
}
