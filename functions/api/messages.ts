import { verifyAdmin } from "./_auth";
import type { Message } from "../../lib/cms/schema";

const MESSAGES_KEY = "cms:messages";

// Public POST - anyone can send a message
export const onRequestPost: PagesFunction = async ({ request, env }) => {
  try {
    const body = await request.json();
    if (!body.name || !body.email || !body.text) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    let messages: Message[] = [];
    try {
      messages = (await env.AVIDKIYA_KV.get(MESSAGES_KEY, "json")) || [];
    } catch {}

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      name: body.name,
      email: body.email,
      subject: body.subject,
      text: body.text,
      replied: false,
      createdAt: new Date().toISOString(),
    };

    messages.unshift(newMsg);
    await env.AVIDKIYA_KV.put(MESSAGES_KEY, JSON.stringify(messages));

    return new Response(JSON.stringify({ ok: true, id: newMsg.id }), {
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};

// Auth: GET all messages
export const onRequestGet: PagesFunction = async ({ request, env }) => {
  if (!(await verifyAdmin(request, env))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  let messages: Message[] = [];
  try {
    messages = (await env.AVIDKIYA_KV.get(MESSAGES_KEY, "json")) || [];
  } catch {}

  return new Response(JSON.stringify({ messages }), {
    headers: { "Content-Type": "application/json;charset=UTF-8" },
  });
};

// Auth: PUT update message
export const onRequestPut: PagesFunction = async ({ request, env }) => {
  if (!(await verifyAdmin(request, env))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const body = await request.json();
    let messages: Message[] = (await env.AVIDKIYA_KV.get(MESSAGES_KEY, "json")) || [];
    messages = messages.map((m) => (m.id === body.id ? { ...m, ...body } : m));
    await env.AVIDKIYA_KV.put(MESSAGES_KEY, JSON.stringify(messages));
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};

// Auth: DELETE message
export const onRequestDelete: PagesFunction = async ({ request, env }) => {
  if (!(await verifyAdmin(request, env))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) throw new Error("Missing id");

    let messages: Message[] = (await env.AVIDKIYA_KV.get(MESSAGES_KEY, "json")) || [];
    messages = messages.filter((m) => m.id !== id);
    await env.AVIDKIYA_KV.put(MESSAGES_KEY, JSON.stringify(messages));
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};
