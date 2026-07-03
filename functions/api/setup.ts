// Cloudflare setup helper – verifies token and lists KV etc.
export const onRequestPost: PagesFunction<any> = async ({ request }) => {
  const { token, action } = await request.json().catch(()=>({}));
  if(!token) return Response.json({ ok:false, error:"token required" }, { status:400 });
  // proxy to CF API to test token
  const r = await fetch("https://api.cloudflare.com/client/v4/accounts", { headers: { Authorization: `Bearer ${token}` }});
  const data = await r.json().catch(()=>({}));
  if(!r.ok) return Response.json({ ok:false, error: data.errors?.[0]?.message || "invalid token" }, { status:400 });
  return Response.json({ ok:true, accounts: data.result });
};
