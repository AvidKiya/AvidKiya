import { verifyAdmin } from "./_auth";
import type { Comment } from "../../lib/cms/schema";

const COMMENTS_KEY = "cms:comments";

// Public POST
export const onRequestPost: PagesFunction = async ({ request, env }) => {
  try {
    const body = await request.json();
    if (!body.name || !body.email || !body.text) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    let comments: Comment[] = [];
    try {
      comments = (await env.AVIDKIYA_KV.get(COMMENTS_KEY, "json")) || [];
    } catch {}

    const newComment: Comment = {
      id: `cmt_${Date.now()}`,
      name: body.name,
      email: body.email,
      position: body.position,
      rating: body.rating || 5,
      text: body.text,
      approved: false,
      createdAt: new Date().toISOString(),
    };

    comments.unshift(newComment);
    await env.AVIDKIYA_KV.put(COMMENTS_KEY, JSON.stringify(comments));

    return new Response(JSON.stringify({ ok: true, id: newComment.id }), {
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};

// GET: public sees only approved, admin sees all
export const onRequestGet: PagesFunction = async ({ request, env }) => {
  let comments: Comment[] = [];
  try {
    comments = (await env.AVIDKIYA_KV.get(COMMENTS_KEY, "json")) || [];
  } catch {}

  const isAdmin = await verifyAdmin(request, env);
  if (!isAdmin) {
    comments = comments.filter((c) => c.approved);
  }

  return new Response(JSON.stringify({ comments }), {
    headers: { "Content-Type": "application/json;charset=UTF-8" },
  });
};

// Auth: PUT update comment
export const onRequestPut: PagesFunction = async ({ request, env }) => {
  if (!(await verifyAdmin(request, env))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const body = await request.json();
    let comments: Comment[] = (await env.AVIDKIYA_KV.get(COMMENTS_KEY, "json")) || [];
    comments = comments.map((c) => (c.id === body.id ? { ...c, ...body } : c));
    await env.AVIDKIYA_KV.put(COMMENTS_KEY, JSON.stringify(comments));
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};

// Auth: DELETE comment
export const onRequestDelete: PagesFunction = async ({ request, env }) => {
  if (!(await verifyAdmin(request, env))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) throw new Error("Missing id");

    let comments: Comment[] = (await env.AVIDKIYA_KV.get(COMMENTS_KEY, "json")) || [];
    comments = comments.filter((c) => c.id !== id);
    await env.AVIDKIYA_KV.put(COMMENTS_KEY, JSON.stringify(comments));
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};
