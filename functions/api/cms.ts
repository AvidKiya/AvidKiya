import { verifyAdmin } from "./_auth";
import { DEFAULT_CMS_STATE, type CmsState } from "../../lib/cms/schema";

const CMS_KEY = "cms:state";

export const onRequestGet: PagesFunction = async ({ env }) => {
  try {
    const data = await env.AVIDKIYA_KV.get(CMS_KEY, "json");
    if (data) {
      // Merge with defaults for any missing fields
      const merged = { ...DEFAULT_CMS_STATE, ...data } as CmsState;
      return new Response(JSON.stringify(merged), {
        headers: { "Content-Type": "application/json;charset=UTF-8", "Cache-Control": "public, max-age=60" },
      });
    }
  } catch {}
  return new Response(JSON.stringify(DEFAULT_CMS_STATE), {
    headers: { "Content-Type": "application/json;charset=UTF-8" },
  });
};

export const onRequestPost: PagesFunction = async ({ request, env }) => {
  if (!(await verifyAdmin(request, env))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const state = await request.json() as CmsState;
    await env.AVIDKIYA_KV.put(CMS_KEY, JSON.stringify(state));
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};

export const onRequestDelete: PagesFunction = async ({ request, env }) => {
  if (!(await verifyAdmin(request, env))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    await env.AVIDKIYA_KV.delete(CMS_KEY);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};
