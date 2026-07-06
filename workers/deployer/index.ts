// AvidKiya Deployer Worker
// Standalone Cloudflare Worker that auto-provisions D1, KV, Pages, and env vars

export interface Env {
  CLOUDFLARE_API_TOKEN: string;
  CLOUDFLARE_ACCOUNT_ID: string;
}

interface DeployResult {
  success: boolean;
  d1DatabaseId?: string;
  kvNamespaceId?: string;
  pagesProject?: string;
  errors?: string[];
}

async function cfFetch(env: Env, path: string, options: RequestInit = {}): Promise<any> {
  const url = `https://api.cloudflare.com/client/v4${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return res.json();
}

async function createD1Database(env: Env, name: string): Promise<string | null> {
  const result = await cfFetch(env, `/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/d1/database`, {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  return result?.result?.id || null;
}

async function createKVNamespace(env: Env, title: string): Promise<string | null> {
  const result = await cfFetch(env, `/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces`, {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
  return result?.result?.id || null;
}

async function createPagesProject(env: Env, name: string): Promise<string | null> {
  const result = await cfFetch(env, `/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/pages/projects`, {
    method: 'POST',
    body: JSON.stringify({
      name,
      production_branch: 'main',
    }),
  });
  return result?.result?.name || null;
}

const DEPLOY_HTML = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>AvidKiya Deployer</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; background: #0a0a0a; color: #e5e7eb; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px; max-width: 500px; width: 90%; text-align: center; backdrop-filter: blur(10px); }
    h1 { font-size: 24px; font-weight: 800; margin-bottom: 8px; }
    p { color: #9ca3af; margin-bottom: 24px; font-size: 14px; }
    input { width: 100%; padding: 12px 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: white; font-size: 14px; margin-bottom: 12px; outline: none; }
    input:focus { border-color: #6366f1; }
    button { width: 100%; padding: 12px; border-radius: 10px; border: none; background: #6366f1; color: white; font-size: 14px; font-weight: 600; cursor: pointer; }
    button:hover { background: #4f46e5; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .status { margin-top: 16px; font-size: 13px; }
    .success { color: #10b981; }
    .error { color: #ef4444; }
    .loading { color: #f59e0b; }
    .result { text-align: left; margin-top: 16px; font-size: 12px; background: rgba(255,255,255,0.03); border-radius: 8px; padding: 12px; }
    .result div { padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
  </style>
</head>
<body>
  <div class="card">
    <h1>🚀 AvidKiya Deployer</h1>
    <p>پلتفرم KIYA Planner را روی Cloudflare راه‌اندازی کنید</p>
    <form id="form">
      <input id="token" type="password" placeholder="Cloudflare API Token" required />
      <input id="accountId" type="text" placeholder="Cloudflare Account ID" required />
      <input id="name" type="text" placeholder="نام پروژه (avidkiya)" value="avidkiya" />
      <button type="submit" id="btn">شروع راه‌اندازی</button>
    </form>
    <div id="status"></div>
  </div>
  <script>
    document.getElementById('form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btn');
      const status = document.getElementById('status');
      btn.disabled = true;
      status.className = 'status loading';
      status.textContent = 'در حال راه‌اندازی...';
      try {
        const res = await fetch('/api/deploy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: document.getElementById('token').value,
            accountId: document.getElementById('accountId').value,
            name: document.getElementById('name').value || 'avidkiya',
          }),
        });
        const data = await res.json();
        if (data.success) {
          status.className = 'status success';
          status.innerHTML = '✅ راه‌اندازی موفق!' +
            '<div class="result">' +
            '<div>D1 Database ID: ' + (data.d1DatabaseId || 'N/A') + '</div>' +
            '<div>KV Namespace ID: ' + (data.kvNamespaceId || 'N/A') + '</div>' +
            '<div>Pages Project: ' + (data.pagesProject || 'N/A') + '</div>' +
            '</div>';
        } else {
          status.className = 'status error';
          status.textContent = '❌ خطا: ' + (data.errors?.join(', ') || 'نامشخص');
        }
      } catch (err) {
        status.className = 'status error';
        status.textContent = '❌ خطای شبکه';
      }
      btn.disabled = false;
    });
  </script>
</body>
</html>`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/' && request.method === 'GET') {
      return new Response(DEPLOY_HTML, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    if (url.pathname === '/api/deploy' && request.method === 'POST') {
      try {
        const body = await request.json() as { token?: string; accountId?: string; name?: string };
        const { token, accountId, name = 'avidkiya' } = body;

        if (!token || !accountId) {
          return Response.json({ success: false, errors: ['Token and Account ID required'] }, { status: 400 });
        }

        const deployEnv = { CLOUDFLARE_API_TOKEN: token, CLOUDFLARE_ACCOUNT_ID: accountId };
        const errors: string[] = [];

        const d1Id = await createD1Database(deployEnv, `${name}-db`);
        if (!d1Id) errors.push('D1 creation failed');

        const kvId = await createKVNamespace(deployEnv, `${name}-kv`);
        if (!kvId) errors.push('KV creation failed');

        const pagesProject = await createPagesProject(deployEnv, name);
        if (!pagesProject) errors.push('Pages project creation failed');

        return Response.json({
          success: errors.length === 0,
          d1DatabaseId: d1Id,
          kvNamespaceId: kvId,
          pagesProject,
          errors: errors.length > 0 ? errors : undefined,
        });
      } catch (err) {
        return Response.json({ success: false, errors: ['Internal error'] }, { status: 500 });
      }
    }

    return new Response('Not Found', { status: 404 });
  },
};