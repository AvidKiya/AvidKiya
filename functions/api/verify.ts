import { verifyAdmin, effectiveToken } from "./_auth";

export const onRequestGet: PagesFunction = async ({ env }) => {
  const token = await effectiveToken(env);
  return new Response(JSON.stringify({
    ok: true,
    tokenSet: !!token,
    kvBound: !!env.AVIDKIYA_KV,
  }), {
    headers: { "Content-Type": "application/json;charset=UTF-8" },
  });
};
