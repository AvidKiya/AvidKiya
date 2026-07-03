/**
 * /api/setup — one-time Cloudflare setup helpers.
 *
 * POST /api/setup?action=test
 *   Body: { accountId, apiToken }
 *   Just tries `GET /accounts/:id` — returns whether the token is valid
 *   and lists KV namespaces.
 *
 * POST /api/setup?action=create-kv
 *   Body: { accountId, apiToken, title }
 *   Creates a new KV namespace. Cloudflare then requires you to bind it
 *   to the Pages project in Settings → Functions. This endpoint returns
 *   the namespace ID + step-by-step next actions.
 *
 * POST /api/setup?action=bind-kv
 *   Body: { accountId, apiToken, projectName, namespaceId, envVar, environment }
 *   Adds the KV binding to the Pages project. NOTE: Cloudflare's API for
 *   Pages bindings is beta — if it fails, the response includes the exact
 *   dashboard URL to complete the step manually.
 *
 * These calls are proxied server-side so the Cloudflare API token never
 * touches the browser's storage.
 */

interface Env {
  AVIDKIYA_KV?: KVNamespace;
  ADMIN_TOKEN?: string;
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
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

async function cfFetch(
  url: string,
  apiToken: string,
  init: RequestInit = {}
): Promise<{ ok: boolean; status: number; data: any }> {
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok && (data.success !== false), status: res.status, data };
}

export const onRequestOptions: PagesFunction<Env> = async () =>
  new Response(null, { status: 204, headers: CORS });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const action = url.searchParams.get("action") ?? "";
  const body = await request.json<any>().catch(() => ({}));
  const { accountId, apiToken, projectName, namespaceId, title, envVar, environment } = body ?? {};

  if (!apiToken || !accountId) {
    return json({ ok: false, error: "accountId and apiToken are required" }, 400);
  }

  if (action === "test") {
    const acc = await cfFetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}`,
      apiToken
    );
    if (!acc.ok) {
      return json(
        {
          ok: false,
          error: "Token could not access this account. Check permissions.",
          detail: acc.data,
        },
        acc.status
      );
    }
    // Also list KV namespaces + Pages projects
    const kv = await cfFetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces?per_page=50`,
      apiToken
    );
    const pages = await cfFetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects?per_page=50`,
      apiToken
    );
    return json({
      ok: true,
      account: acc.data.result,
      namespaces: kv.data?.result ?? [],
      projects: pages.data?.result ?? [],
    });
  }

  if (action === "create-kv") {
    if (!title) return json({ ok: false, error: "title is required" }, 400);
    const r = await cfFetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces`,
      apiToken,
      { method: "POST", body: JSON.stringify({ title }) }
    );
    if (!r.ok) return json({ ok: false, error: "Create failed", detail: r.data }, r.status);
    return json({
      ok: true,
      namespace: r.data.result,
      nextSteps: {
        binding: {
          name: envVar || "AVIDKIYA_KV",
          namespaceId: r.data.result.id,
        },
        dashboardUrl: `https://dash.cloudflare.com/${accountId}/pages/view/${projectName ?? "<your-project>"}/settings/functions`,
        instruction:
          "Open the URL above → 'KV namespace bindings' → 'Add binding' → Variable name = AVIDKIYA_KV → pick the new namespace → Save. Then redeploy.",
      },
    });
  }

  if (action === "bind-kv") {
    if (!projectName || !namespaceId) {
      return json({ ok: false, error: "projectName and namespaceId required" }, 400);
    }
    // Try the Pages project PATCH (this endpoint is in beta and may need
    // dashboard confirmation). Payload adds a kv_namespaces entry.
    const env2 = environment || "production";
    const patchBody: any = {
      deployment_configs: {
        [env2]: {
          kv_namespaces: {
            [envVar || "AVIDKIYA_KV"]: { namespace_id: namespaceId },
          },
        },
      },
    };
    const r = await cfFetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`,
      apiToken,
      { method: "PATCH", body: JSON.stringify(patchBody) }
    );
    if (!r.ok) {
      return json(
        {
          ok: false,
          error: "Automatic bind failed — please bind it via dashboard",
          detail: r.data,
          dashboardUrl: `https://dash.cloudflare.com/${accountId}/pages/view/${projectName}/settings/functions`,
        },
        r.status
      );
    }
    return json({
      ok: true,
      project: r.data.result,
      instruction: "Binding added. Trigger a new deployment for it to take effect.",
    });
  }

  return json({ ok: false, error: "Unknown action" }, 400);
};
