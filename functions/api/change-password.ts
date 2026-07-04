import { verifyAdmin } from "./_auth";

// POST: change password (stored in KV as override)
export const onRequestPost: PagesFunction = async ({ request, env }) => {
  if (!(await verifyAdmin(request, env))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.newPassword || body.newPassword.length < 4) {
      return new Response(JSON.stringify({ error: "رمز باید حداقل ۴ کاراکتر باشد" }), { status: 400 });
    }

    await env.AVIDKIYA_KV.put("cms:admin-token-override", body.newPassword);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};
