/**
 * /api/comments
 * POST — anyone can submit; goes into moderation queue (approved: false)
 * GET  — public reads approved list; admin (with token) gets everything
 * PUT  ?id=xxx — admin: approve / add reply / pin
 * DELETE ?id=xxx — admin
 */

interface Env {
  AVIDKIYA_KV: KVNamespace;
  ADMIN_TOKEN: string;
}

const KV_KEY = "cms:comments";
const MAX_ITEMS = 500;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...CORS,
    },
  });
}

function isAuthed(request: Request, env: Env): boolean {
  const auth = request.headers.get("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  return !!env.ADMIN_TOKEN && token === env.ADMIN_TOKEN;
}

async function load(env: Env): Promise<any[]> {
  const raw = await env.AVIDKIYA_KV.get(KV_KEY);
  return raw ? JSON.parse(raw) : [];
}

export const onRequestOptions: PagesFunction<Env> = async () =>
  new Response(null, { status: 204, headers: CORS });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const b = await request.json<any>();
    const { name, message, email, website, role, rating } = b ?? {};
    if (!name || !message) return json({ error: "Missing name/message" }, 400);
    const record = {
      id: `cmt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: String(name).slice(0, 120),
      message: String(message).slice(0, 4000),
      email: email ? String(email).slice(0, 200) : undefined,
      website: website ? String(website).slice(0, 200) : undefined,
      role: role ? String(role).slice(0, 120) : undefined,
      rating: typeof rating === "number" ? Math.max(1, Math.min(5, rating)) : undefined,
      at: new Date().toISOString(),
      approved: false,
    };
    const list = await load(env);
    list.unshift(record);
    if (list.length > MAX_ITEMS) list.length = MAX_ITEMS;
    await env.AVIDKIYA_KV.put(KV_KEY, JSON.stringify(list));
    return json({ ok: true, id: record.id }, 201);
  } catch (e) {
    return json({ error: "Failed", detail: String(e) }, 500);
  }
};

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const list = await load(env);
  if (isAuthed(request, env)) return json({ comments: list });
  // Public: only approved
  return json({ comments: list.filter((c) => c.approved) });
};

export const onRequestPut: PagesFunction<Env> = async ({ request, env }) => {
  if (!isAuthed(request, env)) return json({ error: "Unauthorized" }, 401);
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return json({ error: "Missing id" }, 400);
  const patch = await request.json<any>().catch(() => ({}));
  const list = await load(env);
  const next = list.map((c) =>
    c.id !== id
      ? c
      : {
          ...c,
          ...(patch.approved !== undefined ? { approved: !!patch.approved } : {}),
          ...(patch.pinned !== undefined ? { pinned: !!patch.pinned } : {}),
          ...(patch.reply !== undefined
            ? { reply: String(patch.reply), replyAt: new Date().toISOString() }
            : {}),
        }
  );
  await env.AVIDKIYA_KV.put(KV_KEY, JSON.stringify(next));
  return json({ ok: true });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  if (!isAuthed(request, env)) return json({ error: "Unauthorized" }, 401);
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return json({ error: "Missing id" }, 400);
  const list = await load(env);
  await env.AVIDKIYA_KV.put(KV_KEY, JSON.stringify(list.filter((c) => c.id !== id)));
  return json({ ok: true });
};
