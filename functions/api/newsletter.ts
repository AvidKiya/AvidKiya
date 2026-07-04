import { verifyAdmin } from "./_auth";

const NEWSLETTER_KEY = "cms:newsletter";

// Public POST - subscribe
export const onRequestPost: PagesFunction = async ({ request, env }) => {
  try {
    const body = await request.json();
    if (!body.email) {
      return new Response(JSON.stringify({ error: "Email required" }), { status: 400 });
    }

    let data: { subscribers: string[] } = { subscribers: [] };
    try {
      data = (await env.AVIDKIYA_KV.get(NEWSLETTER_KEY, "json")) || { subscribers: [] };
    } catch {}

    if (data.subscribers.includes(body.email)) {
      return new Response(JSON.stringify({ ok: true, message: "Already subscribed" }), {
        headers: { "Content-Type": "application/json;charset=UTF-8" },
      });
    }

    data.subscribers.push(body.email);
    await env.AVIDKIYA_KV.put(NEWSLETTER_KEY, JSON.stringify(data));

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};

// Auth: GET subscribers
export const onRequestGet: PagesFunction = async ({ request, env }) => {
  if (!(await verifyAdmin(request, env))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  let data: { subscribers: string[] } = { subscribers: [] };
  try {
    data = (await env.AVIDKIYA_KV.get(NEWSLETTER_KEY, "json")) || { subscribers: [] };
  } catch {}

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json;charset=UTF-8" },
  });
};

// Auth: DELETE subscriber
export const onRequestDelete: PagesFunction = async ({ request, env }) => {
  if (!(await verifyAdmin(request, env))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    if (!email) throw new Error("Missing email");

    let data: { subscribers: string[] } = (await env.AVIDKIYA_KV.get(NEWSLETTER_KEY, "json")) || { subscribers: [] };
    data.subscribers = data.subscribers.filter((e) => e !== email);
    await env.AVIDKIYA_KV.put(NEWSLETTER_KEY, JSON.stringify(data));

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};
