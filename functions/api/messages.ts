/**
 * Cloudflare Pages Function — /api/messages
 *
 * POST /api/messages    → append a contact-form message. Public (rate-limited
 *                         by Cloudflare's edge). No auth required.
 * GET  /api/messages    → returns all messages. Requires admin token.
 * DELETE /api/messages/:id → removes one. Requires admin token.
 */

interface Env {
  AVIDKIYA_KV: KVNamespace;
  ADMIN_TOKEN: string;
}

const KV_KEY = "cms:messages";
const MAX_MESSAGES = 500;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...CORS_HEADERS,
    },
  });
}

function isAuthed(request: Request, env: Env): boolean {
  const auth = request.headers.get("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  return !!env.ADMIN_TOKEN && token === env.ADMIN_TOKEN;
}

async function loadMessages(env: Env): Promise<any[]> {
  const raw = await env.AVIDKIYA_KV.get(KV_KEY);
  return raw ? JSON.parse(raw) : [];
}

export const onRequestOptions: PagesFunction<Env> = async () =>
  new Response(null, { status: 204, headers: CORS_HEADERS });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = await request.json<any>();
    const { name, email, subject, message } = body ?? {};
    if (!name || !email || !message) {
      return json({ error: "Missing name/email/message" }, 400);
    }
    // Basic sanity limits
    const record = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: String(name).slice(0, 120),
      email: String(email).slice(0, 200),
      subject: String(subject ?? "").slice(0, 200),
      message: String(message).slice(0, 4000),
      at: new Date().toISOString(),
      read: false,
    };
    const list = await loadMessages(env);
    list.unshift(record);
    if (list.length > MAX_MESSAGES) list.length = MAX_MESSAGES;
    await env.AVIDKIYA_KV.put(KV_KEY, JSON.stringify(list));
    return json({ ok: true, id: record.id }, 201);
  } catch (e) {
    return json({ error: "Failed to save", detail: String(e) }, 500);
  }
};

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!isAuthed(request, env)) return json({ error: "Unauthorized" }, 401);
  const list = await loadMessages(env);
  return json({ messages: list }, 200);
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  if (!isAuthed(request, env)) return json({ error: "Unauthorized" }, 401);
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return json({ error: "Missing id" }, 400);
  const list = await loadMessages(env);
  const filtered = list.filter((m) => m.id !== id);
  await env.AVIDKIYA_KV.put(KV_KEY, JSON.stringify(filtered));
  return json({ ok: true, removed: list.length - filtered.length }, 200);
};

/**
 * PUT /api/messages?id=xxx  → update a single message (mark as read, add reply)
 * Body: { read?: boolean, reply?: string }
 */
export const onRequestPut: PagesFunction<Env> = async ({ request, env }) => {
  if (!isAuthed(request, env)) return json({ error: "Unauthorized" }, 401);
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return json({ error: "Missing id" }, 400);
  const patch = await request.json<any>().catch(() => ({}));
  const list = await loadMessages(env);
  let found = false;
  const next = list.map((m) => {
    if (m.id !== id) return m;
    found = true;
    return {
      ...m,
      ...(patch.read !== undefined ? { read: !!patch.read } : {}),
      ...(patch.reply !== undefined
        ? { reply: String(patch.reply), replyAt: new Date().toISOString() }
        : {}),
    };
  });
  if (!found) return json({ error: "Not found" }, 404);
  await env.AVIDKIYA_KV.put(KV_KEY, JSON.stringify(next));
  return json({ ok: true }, 200);
};
