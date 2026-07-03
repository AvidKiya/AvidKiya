import { isAuthorized } from "./_auth";

export const onRequestPost: PagesFunction<any> = async ({ request, env }) => {
  if (!await isAuthorized(request, env)) return Response.json({ ok:false, error:"unauthorized" }, { status:401 });
  const body:any = await request.json();
  const newToken = (body.newToken || "").trim();
  if (newToken.length < 4) return Response.json({ ok:false, error:"too short" }, { status:400 });
  await env.AVIDKIYA_KV.put("cms:admin-token-override", newToken);
  return Response.json({ ok:true });
};
