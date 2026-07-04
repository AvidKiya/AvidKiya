// deployer.js — Cloudflare Worker (single file)
// Deploy this to a Worker → visit its URL → paste your CF API token → auto-installs AvidKiya portfolio
// Usage: Cloudflare Dashboard → Workers & Pages → Create Worker → paste this code → Save & Deploy

const CURRENT_VERSION = "1.0.0";
const SOURCE_REPO = "avidkiya/avidkiya-portfolio";
const SOURCE_BRANCH = "deploy";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      if (request.method === "GET" && url.pathname === "/") {
        return html(getHtmlContent());
      }
      if (request.method === "POST" && url.pathname === "/api/verify-token") {
        return await handleVerify(request, corsHeaders);
      }
      if (request.method === "POST" && url.pathname === "/api/deploy") {
        return await handleDeploy(request, corsHeaders);
      }
      if (request.method === "POST" && url.pathname === "/api/list-deployments") {
        return await handleList(request, corsHeaders);
      }
      if (request.method === "POST" && url.pathname === "/api/update-deployment") {
        return await handleUpdate(request, corsHeaders);
      }
      if (request.method === "POST" && url.pathname === "/api/delete-deployment") {
        return await handleDelete(request, corsHeaders);
      }
      if (request.method === "POST" && url.pathname === "/api/rotate-token") {
        return await handleRotateToken(request, corsHeaders);
      }
      if (request.method === "POST" && url.pathname === "/api/get-info") {
        return await handleGetInfo(request, corsHeaders);
      }
      return new Response("Not Found", { status: 404 });
    } catch (e) {
      return json({ ok: false, error: e.message }, 500, corsHeaders);
    }
  },
};

// ── Helpers ──────────────────────────────

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json;charset=UTF-8", ...extraHeaders },
  });
}

function html(body) {
  return new Response(body, {
    headers: { "Content-Type": "text/html;charset=UTF-8" },
  });
}

async function cf(url, token, init = {}) {
  const headers = {
    Authorization: `Bearer ${token}`,
    ...(init.headers || {}),
  };
  if (!init.headers?.["Content-Type"] && !(init.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(url, { ...init, headers });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok && data.success !== false, status: res.status, data };
}

function genToken() {
  const arr = new Uint8Array(24);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Handlers ─────────────────────────────

async function handleVerify(request, cors) {
  try {
    const { token } = await request.json();
    if (!token) throw new Error("توکن نمی‌تواند خالی باشد");

    const acc = await cf("https://api.cloudflare.com/client/v4/accounts", token);
    if (!acc.ok || !acc.data.result?.length) {
      throw new Error("توکن نامعتبر یا بدون دسترسی به حساب");
    }

    const accountId = acc.data.result[0].id;
    const accountName = acc.data.result[0].name;

    await delay(500);

    const projs = await cf(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects?per_page=50`,
      token
    );
    const mine = (projs.data.result || []).filter((p) =>
      p.name.startsWith("avidkiya")
    );

    return json({ ok: true, accountId, accountName, existing: mine }, 200, cors);
  } catch (e) {
    return json({ ok: false, error: e.message }, 400, cors);
  }
}

async function handleDeploy(request, cors) {
  try {
    const body = await request.json();
    const { token, projectName = "avidkiya-portfolio", adminToken: userToken } = body;
    if (!token) throw new Error("توکن الزامی است");

    // 1. Get account
    const acc = await cf("https://api.cloudflare.com/client/v4/accounts", token);
    if (!acc.ok || !acc.data.result?.length) throw new Error("خطا در دریافت حساب");
    const accountId = acc.data.result[0].id;

    await delay(500);

    // 2. Check/create workers.dev subdomain
    let subRes = await cf(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/subdomain`,
      token
    );
    let devSub = subRes.data?.result?.subdomain;
    if (!devSub) {
      const newSub = `avidkiya-${genToken().slice(0, 6)}`;
      const create = await cf(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/subdomain`,
        token,
        { method: "PUT", body: JSON.stringify({ subdomain: newSub }) }
      );
      if (!create.ok) {
        throw new Error(
          "لطفاً یک بار در داشبورد Cloudflare → Workers Overview کلیک کنید تا Terms of Service رو بپذیرید، بعد دوباره امتحان کنید."
        );
      }
      devSub = newSub;
    }

    await delay(500);

    // 3. Create KV namespace
    const kvTitle = `${projectName}-kv`;
    let kvId = null;

    // Check if KV already exists
    const existingKvs = await cf(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces?per_page=100`,
      token
    );
    if (existingKvs.ok && existingKvs.data.result) {
      const existing = existingKvs.data.result.find((ns) => ns.title === kvTitle);
      if (existing) kvId = existing.id;
    }

    if (!kvId) {
      const kv = await cf(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces`,
        token,
        { method: "POST", body: JSON.stringify({ title: kvTitle }) }
      );
      if (!kv.ok) {
        const errMsg = kv.data.errors?.[0]?.message || JSON.stringify(kv.data.errors);
        throw new Error("خطا در ساخت KV: " + errMsg);
      }
      kvId = kv.data.result.id;
    }

    await delay(500);

    // 4. Generate ADMIN_TOKEN
    const adminToken = userToken?.trim() || genToken();

    // 5. Check if Pages project exists
    const existCheck = await cf(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`,
      token
    );

    const deployConfig = {
      env_vars: { ADMIN_TOKEN: { value: adminToken } },
      kv_namespaces: { AVIDKIYA_KV: { namespace_id: kvId } },
      compatibility_date: "2024-09-01",
      compatibility_flags: ["nodejs_compat"],
    };

    if (existCheck.ok) {
      // Project exists — update config
      const patch = await cf(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`,
        token,
        {
          method: "PATCH",
          body: JSON.stringify({
            deployment_configs: {
              production: deployConfig,
              preview: deployConfig,
            },
          }),
        }
      );
      if (!patch.ok) {
        throw new Error("خطا در آپدیت تنظیمات پروژه: " + (patch.data.errors?.[0]?.message || "Unknown"));
      }
    } else {
      // Create new Pages project
      const proj = await cf(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects`,
        token,
        {
          method: "POST",
          body: JSON.stringify({
            name: projectName,
            production_branch: "main",
            deployment_configs: {
              production: deployConfig,
              preview: deployConfig,
            },
          }),
        }
      );
      if (!proj.ok) {
        const errMsg = proj.data.errors?.[0]?.message || JSON.stringify(proj.data);
        if (errMsg.includes("already exists") || errMsg.includes("duplicate")) {
          // Try patch instead
          await cf(
            `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`,
            token,
            {
              method: "PATCH",
              body: JSON.stringify({
                deployment_configs: {
                  production: deployConfig,
                  preview: deployConfig,
                },
              }),
            }
          );
        } else {
          throw new Error("خطا در ساخت پروژه Pages: " + errMsg);
        }
      }
    }

    const finalUrl = `https://${projectName}.pages.dev`;

    return json(
      {
        ok: true,
        url: finalUrl,
        adminToken,
        accountId,
        kvId,
        note:
          "پروژه Pages ساخته شد و تنظیمات (ADMIN_TOKEN + KV) اعمال شد. " +
          "حالا در داشبورد Cloudflare → Pages → پروژه → Settings → Builds & Deployments → " +
          `Git integration را به ریپوی ${SOURCE_REPO} وصل کنید تا build خودکار انجام شود.`,
      },
      200,
      cors
    );
  } catch (e) {
    return json({ ok: false, error: e.message }, 400, cors);
  }
}

async function handleList(request, cors) {
  try {
    const { token } = await request.json();
    if (!token) throw new Error("توکن الزامی است");

    const acc = await cf("https://api.cloudflare.com/client/v4/accounts", token);
    if (!acc.ok || !acc.data.result?.length) throw new Error("خطا در دریافت حساب");
    const accountId = acc.data.result[0].id;

    const projs = await cf(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects?per_page=50`,
      token
    );
    const mine = (projs.data.result || [])
      .filter((p) => p.name.startsWith("avidkiya"))
      .map((p) => ({
        name: p.name,
        url: `https://${p.name}.pages.dev`,
        createdAt: p.created_on,
        productionBranch: p.production_branch,
        domains: p.domains || [],
      }));

    return json({ ok: true, projects: mine }, 200, cors);
  } catch (e) {
    return json({ ok: false, error: e.message }, 400, cors);
  }
}

async function handleUpdate(request, cors) {
  try {
    const { token, projectName } = await request.json();
    if (!token || !projectName) throw new Error("توکن و نام پروژه الزامی است");

    const acc = await cf("https://api.cloudflare.com/client/v4/accounts", token);
    if (!acc.ok) throw new Error("خطا در دریافت حساب");
    const accountId = acc.data.result[0].id;

    // Trigger a retry hook / new deployment
    const r = await cf(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments`,
      token,
      { method: "POST" }
    );

    return json({ ok: true, message: "درخواست آپدیت ارسال شد" }, 200, cors);
  } catch (e) {
    return json({ ok: false, error: e.message }, 400, cors);
  }
}

async function handleDelete(request, cors) {
  try {
    const { token, projectName } = await request.json();
    if (!token || !projectName) throw new Error("توکن و نام پروژه الزامی است");

    const acc = await cf("https://api.cloudflare.com/client/v4/accounts", token);
    if (!acc.ok) throw new Error("خطا در دریافت حساب");
    const accountId = acc.data.result[0].id;

    const r = await cf(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`,
      token,
      { method: "DELETE" }
    );
    if (!r.ok && r.status !== 404) throw new Error("خطا در حذف پروژه");

    return json({ ok: true }, 200, cors);
  } catch (e) {
    return json({ ok: false, error: e.message }, 400, cors);
  }
}

async function handleRotateToken(request, cors) {
  try {
    const { token, projectName } = await request.json();
    if (!token || !projectName) throw new Error("توکن و نام پروژه الزامی است");

    const acc = await cf("https://api.cloudflare.com/client/v4/accounts", token);
    if (!acc.ok) throw new Error("خطا در دریافت حساب");
    const accountId = acc.data.result[0].id;

    const newAdmin = genToken();
    const r = await cf(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`,
      token,
      {
        method: "PATCH",
        body: JSON.stringify({
          deployment_configs: {
            production: { env_vars: { ADMIN_TOKEN: { value: newAdmin } } },
            preview: { env_vars: { ADMIN_TOKEN: { value: newAdmin } } },
          },
        }),
      }
    );
    if (!r.ok) throw new Error("خطا در تعویض توکن");

    return json({ ok: true, adminToken: newAdmin }, 200, cors);
  } catch (e) {
    return json({ ok: false, error: e.message }, 400, cors);
  }
}

async function handleGetInfo(request, cors) {
  try {
    const { token, projectName } = await request.json();
    if (!token || !projectName) throw new Error("توکن و نام پروژه الزامی است");

    const acc = await cf("https://api.cloudflare.com/client/v4/accounts", token);
    if (!acc.ok) throw new Error("خطا در دریافت حساب");
    const accountId = acc.data.result[0].id;

    const r = await cf(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`,
      token
    );
    if (!r.ok) throw new Error("پروژه پیدا نشد");

    return json({ ok: true, project: r.data.result }, 200, cors);
  } catch (e) {
    return json({ ok: false, error: e.message }, 400, cors);
  }
}

// ── HTML UI ──────────────────────────────

function getHtmlContent() {
  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AvidKiya OS — Auto Deployer</title>
<script src="https://cdn.tailwindcss.com"><\/script>
<link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet">
<style>
  body { font-family: 'Vazirmatn', sans-serif; background: #05070d; color: #e0e6f0; }
  .glow { box-shadow: 0 0 60px rgba(93,122,230,0.2), 0 0 120px rgba(93,122,230,0.05); }
  .grad-btn { background: linear-gradient(135deg, #2141a8, #5d7ae6); }
  .grad-btn:hover { background: linear-gradient(135deg, #1a3590, #4d6ad6); }
  input, button, select { font-family: inherit; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-thumb { background: #2a3040; border-radius: 3px; }
  @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }
  .toast { animation: slideIn 0.3s ease-out; }
  @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .modal-backdrop { background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); }
</style>
</head>
<body class="min-h-screen flex items-center justify-center p-4">

  <!-- Toast container -->
  <div id="toasts" class="fixed top-4 left-4 right-4 z-50 flex flex-col items-center gap-2 pointer-events-none"></div>

  <!-- Modal container -->
  <div id="modal" class="fixed inset-0 z-40 hidden modal-backdrop flex items-center justify-center p-4">
    <div class="w-full max-w-2xl bg-[#0d1117] border border-[#1c2330] rounded-2xl shadow-2xl max-h-[80vh] overflow-auto" id="modalContent">
    </div>
  </div>

  <!-- Main card -->
  <div class="w-full max-w-lg bg-[#0d1117] border border-[#1c2330] rounded-3xl shadow-2xl p-8 relative overflow-hidden glow">
    <!-- Glow decorations -->
    <div class="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>

    <!-- Header -->
    <div class="text-center mb-6 relative">
      <div class="inline-flex w-16 h-16 items-center justify-center bg-blue-950/60 border border-blue-500/40 rounded-2xl mb-4">
        <span class="text-3xl font-black text-blue-400">A</span>
      </div>
      <h1 class="text-2xl font-black mb-1">AvidKiya OS — Auto Deployer</h1>
      <p class="text-sm text-gray-400">نصب خودکار پرتفولیو روی حساب Cloudflare شما</p>
      <p class="text-[10px] text-gray-600 mt-1">نسخه ${CURRENT_VERSION}</p>
    </div>

    <div class="space-y-4 relative">
      <!-- Get token button -->
      <a href="https://dash.cloudflare.com/profile/api-tokens?permissionGroupKeys=%5B%7B%22key%22%3A%22pages%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22workers_scripts%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22workers_kv_storage%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22account_settings%22%2C%22type%22%3A%22read%22%7D%2C%7B%22key%22%3A%22workers_subdomain%22%2C%22type%22%3A%22edit%22%7D%5D&accountId=*&zoneId=all&name=AvidKiya-Deployer"
         target="_blank"
         class="block text-center py-3.5 border border-orange-500/40 text-orange-400 bg-orange-900/15 hover:bg-orange-900/30 font-bold rounded-xl text-sm transition">
        📥 دریافت توکن Cloudflare
      </a>

      <!-- Token input -->
      <div class="relative">
        <input id="apiToken" type="password" placeholder="توکن Cloudflare API"
               class="w-full py-3.5 pr-4 pl-12 bg-[#0a0d13] border border-[#1c2330] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-mono transition">
        <button onclick="toggleToken()" class="absolute inset-y-0 left-3 text-gray-500 hover:text-gray-300 transition" type="button">👁</button>
      </div>

      <!-- Project name -->
      <input id="projectName" type="text" value="avidkiya-portfolio" placeholder="نام پروژه"
             class="w-full py-3 px-4 bg-[#0a0d13] border border-[#1c2330] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm transition">

      <!-- Admin token -->
      <input id="adminToken" type="text" placeholder="ADMIN_TOKEN (خالی = تولید خودکار)"
             class="w-full py-3 px-4 bg-[#0a0d13] border border-[#1c2330] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-mono transition">

      <!-- Deploy button -->
      <button onclick="startDeploy()" id="deployBtn"
              class="w-full py-3.5 grad-btn text-white font-black rounded-xl text-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
        🚀 شروع نصب خودکار
      </button>

      <!-- Manage button -->
      <button onclick="listDeployments()"
              class="w-full py-3 border border-blue-700/40 text-blue-400 bg-blue-900/15 hover:bg-blue-900/30 font-bold rounded-xl text-sm transition">
        📋 مدیریت نصب‌های موجود
      </button>

      <!-- Status panel -->
      <div id="status" class="hidden mt-3 p-4 bg-[#0a0d13] border border-[#1c2330] rounded-xl">
        <div class="flex justify-between items-center mb-2">
          <span id="statusText" class="text-xs font-bold text-gray-300">شروع...</span>
          <span id="statusPct" class="text-xs font-black text-blue-400">۰٪</span>
        </div>
        <div class="w-full h-2 bg-[#1c2330] rounded-full overflow-hidden">
          <div id="progressBar" class="h-full rounded-full transition-all duration-500" style="width:0%; background: linear-gradient(90deg, #2141a8, #5d7ae6);"></div>
        </div>
      </div>

      <!-- Result panel -->
      <div id="result" class="hidden mt-3 p-4 bg-emerald-900/15 border border-emerald-700/40 rounded-xl text-sm space-y-2"></div>

      <!-- Error panel -->
      <div id="error" class="hidden mt-3 p-4 bg-red-900/15 border border-red-700/40 rounded-xl text-sm text-red-400"></div>
    </div>

    <!-- Footer -->
    <div class="mt-6 pt-4 border-t border-[#1c2330] flex items-center justify-center gap-4 text-xs text-gray-500">
      <a href="https://github.com/${SOURCE_REPO}" target="_blank" class="hover:text-gray-300 transition">GitHub</a>
      <span>•</span>
      <a href="https://t.me/avidkiya" target="_blank" class="hover:text-gray-300 transition">Telegram</a>
      <span>•</span>
      <span>AvidKiya © 2024</span>
    </div>
  </div>

<script>
// ── Helpers ──
function toggleToken() {
  const el = document.getElementById('apiToken');
  el.type = el.type === 'password' ? 'text' : 'password';
}

function fa(n) {
  return String(n).replace(/\\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
}

function setStatus(text, pct) {
  const panel = document.getElementById('status');
  panel.classList.remove('hidden');
  document.getElementById('statusText').innerText = text;
  document.getElementById('statusPct').innerText = fa(pct) + '٪';
  document.getElementById('progressBar').style.width = pct + '%';
}

function showError(msg) {
  const el = document.getElementById('error');
  el.classList.remove('hidden');
  el.innerText = '⚠️ ' + msg;
}

function hideError() {
  document.getElementById('error').classList.add('hidden');
}

function showToast(msg, type = 'info') {
  const container = document.getElementById('toasts');
  const toast = document.createElement('div');
  const bgClass = type === 'success' ? 'bg-emerald-900/90 border-emerald-600' :
                  type === 'error' ? 'bg-red-900/90 border-red-600' :
                  'bg-blue-900/90 border-blue-600';
  toast.className = 'toast pointer-events-auto px-4 py-2 rounded-lg border text-sm font-bold ' + bgClass;
  toast.innerText = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function showModal(html) {
  document.getElementById('modalContent').innerHTML = html;
  document.getElementById('modal').classList.remove('hidden');
  document.getElementById('modal').classList.add('flex');
}

function hideModal() {
  document.getElementById('modal').classList.add('hidden');
  document.getElementById('modal').classList.remove('flex');
}

document.getElementById('modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modal')) hideModal();
});

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => showToast('کپی شد ✓', 'success'));
}

// ── API calls ──

async function startDeploy() {
  const token = document.getElementById('apiToken').value.trim();
  const projectName = document.getElementById('projectName').value.trim() || 'avidkiya-portfolio';
  const adminToken = document.getElementById('adminToken').value.trim();

  if (!token) { showError('لطفاً توکن Cloudflare را وارد کنید'); return; }

  document.getElementById('result').classList.add('hidden');
  hideError();

  const btn = document.getElementById('deployBtn');
  btn.disabled = true;
  btn.innerText = '⏳ در حال نصب...';

  try {
    setStatus('اعتبارسنجی توکن...', 10);
    const verify = await fetch('/api/verify-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }).then(r => r.json());
    if (!verify.ok) throw new Error(verify.error);
    showToast('✓ توکن معتبر — حساب: ' + verify.accountName, 'success');

    setStatus('ساخت KV namespace...', 30);
    await new Promise(r => setTimeout(r, 500));

    setStatus('ساخت پروژه Pages...', 50);
    await new Promise(r => setTimeout(r, 500));

    setStatus('پیکربندی محیط و bindings...', 70);

    const res = await fetch('/api/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, projectName, adminToken }),
    }).then(r => r.json());
    if (!res.ok) throw new Error(res.error);

    setStatus('✅ نصب کامل شد!', 100);
    showToast('نصب با موفقیت انجام شد! 🎉', 'success');

    const el = document.getElementById('result');
    el.classList.remove('hidden');
    el.innerHTML = \`
      <div class="font-bold text-emerald-400 text-base mb-3">✅ نصب با موفقیت انجام شد!</div>
      <div class="space-y-2">
        <div class="flex items-center justify-between gap-2">
          <span>🌐 <b>سایت:</b></span>
          <div class="flex items-center gap-2">
            <a href="\${res.url}" target="_blank" class="text-blue-400 underline font-mono text-xs">\${res.url}</a>
            <button onclick="copyText('\${res.url}')" class="text-gray-500 hover:text-white text-xs">📋</button>
          </div>
        </div>
        <div class="flex items-center justify-between gap-2">
          <span>🔑 <b>ADMIN_TOKEN:</b></span>
          <div class="flex items-center gap-2">
            <code class="bg-black/40 px-2 py-1 rounded font-mono text-xs text-emerald-300">\${res.adminToken}</code>
            <button onclick="copyText('\${res.adminToken}')" class="text-gray-500 hover:text-white text-xs">📋</button>
          </div>
        </div>
      </div>
      <div class="text-xs text-gray-400 mt-3 p-2 bg-black/20 rounded-lg">
        💡 این توکن را ذخیره کنید — برای ورود به پنل ادمین (<b>/admin</b>) استفاده می‌شود.
      </div>
      \${res.note ? \`<div class="text-xs text-yellow-400 mt-2 p-2 bg-yellow-900/20 rounded-lg">⚠️ \${res.note}</div>\` : ''}
    \`;

  } catch (e) {
    showError(e.message);
    setStatus('❌ خطا', 0);
    showToast(e.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerText = '🚀 شروع نصب خودکار';
  }
}

async function listDeployments() {
  const token = document.getElementById('apiToken').value.trim();
  if (!token) { showError('لطفاً اول توکن را وارد کنید'); return; }

  try {
    const r = await fetch('/api/list-deployments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }).then(x => x.json());

    if (!r.ok) { showError(r.error); return; }

    if (!r.projects.length) {
      showToast('پروژه‌ای با نام avidkiya پیدا نشد', 'info');
      return;
    }

    let html = '<div class="p-6"><h2 class="text-lg font-black mb-4">📋 پروژه‌های نصب شده</h2><div class="space-y-3">';

    for (const p of r.projects) {
      html += \`
        <div class="p-4 bg-[#0a0d13] border border-[#1c2330] rounded-xl">
          <div class="flex items-center justify-between mb-2 flex-wrap gap-2">
            <div>
              <span class="font-bold text-blue-400">\${p.name}</span>
              <a href="\${p.url}" target="_blank" class="text-xs text-gray-400 ms-2 hover:text-white">🔗 باز کردن</a>
            </div>
            <span class="text-[10px] text-gray-500">\${new Date(p.createdAt).toLocaleDateString('fa-IR')}</span>
          </div>
          <div class="flex flex-wrap gap-2 mt-2">
            <button onclick="handleRotate('\${p.name}')" class="text-[11px] px-2.5 py-1 rounded-lg border border-amber-700/40 text-amber-400 hover:bg-amber-900/20">🔄 تعویض توکن</button>
            <button onclick="copyText('\${p.url}')" class="text-[11px] px-2.5 py-1 rounded-lg border border-blue-700/40 text-blue-400 hover:bg-blue-900/20">📋 کپی URL</button>
            <button onclick="handleDeleteProject('\${p.name}')" class="text-[11px] px-2.5 py-1 rounded-lg border border-red-700/40 text-red-400 hover:bg-red-900/20">🗑 حذف</button>
          </div>
        </div>
      \`;
    }

    html += '</div><button onclick="hideModal()" class="mt-4 w-full py-2 border border-gray-700 rounded-xl text-sm text-gray-400 hover:bg-gray-800">بستن</button></div>';

    showModal(html);

  } catch (e) {
    showError(e.message);
  }
}

async function handleRotate(projectName) {
  const token = document.getElementById('apiToken').value.trim();
  if (!confirm('آیا از تعویض توکن ادمین مطمئن هستید؟')) return;

  try {
    const r = await fetch('/api/rotate-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, projectName }),
    }).then(x => x.json());

    if (!r.ok) throw new Error(r.error);
    showToast('توکن جدید: ' + r.adminToken, 'success');
    copyText(r.adminToken);
  } catch (e) {
    showToast(e.message, 'error');
  }
}

async function handleDeleteProject(projectName) {
  const token = document.getElementById('apiToken').value.trim();
  if (!confirm('آیا از حذف پروژه ' + projectName + ' مطمئن هستید؟ این عمل غیرقابل بازگشت است!')) return;

  try {
    const r = await fetch('/api/delete-deployment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, projectName }),
    }).then(x => x.json());

    if (!r.ok) throw new Error(r.error);
    showToast('پروژه حذف شد ✓', 'success');
    hideModal();
  } catch (e) {
    showToast(e.message, 'error');
  }
}
<\/script>
</body>
</html>`;
}
