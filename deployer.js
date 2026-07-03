// deployer.js — Cloudflare Worker (single file)
// Deploy this to a Worker → visit its URL → paste your CF API token → auto-installs AvidKiya portfolio
// AvidKiya OS Auto-Deployer v1.0.0

const CURRENT_VERSION = "1.0.0";
const SOURCE_ZIP_URL = "https://github.com/IR-NETLIFY/avidkiya-portfolio/archive/refs/heads/main.zip";
const SOURCE_REPO = "IR-NETLIFY/avidkiya-portfolio";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });

    try {
      if (request.method === "GET" && url.pathname === "/") {
        return html(getHtmlContent());
      }
      if (request.method === "POST" && url.pathname === "/api/verify-token") {
        return json(await handleVerify(request), 200, cors);
      }
      if (request.method === "POST" && url.pathname === "/api/deploy") {
        return json(await handleDeploy(request), 200, cors);
      }
      if (request.method === "POST" && url.pathname === "/api/list-deployments") {
        return json(await handleList(request), 200, cors);
      }
      if (request.method === "POST" && url.pathname === "/api/update-deployment") {
        return json(await handleUpdate(request), 200, cors);
      }
      if (request.method === "POST" && url.pathname === "/api/delete-deployment") {
        return json(await handleDelete(request), 200, cors);
      }
      if (request.method === "POST" && url.pathname === "/api/rotate-token") {
        return json(await handleRotateToken(request), 200, cors);
      }
      if (request.method === "POST" && url.pathname === "/api/get-info") {
        return json(await handleGetInfo(request), 200, cors);
      }
      return new Response("Not Found", { status: 404, headers: cors });
    } catch (e) {
      return json({ ok: false, error: e.message || String(e) }, 500, cors);
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
  // retry with backoff
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      if (attempt > 0) await sleep(600 * attempt);
      const res = await fetch(url, {
        ...init,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          ...(init.headers || {}),
        },
      });
      const data = await res.json().catch(() => ({}));
      return { ok: res.ok && data.success !== false, status: res.status, data, res };
    } catch (e) {
      if (attempt === 2) throw e;
    }
  }
}
function sleep(ms){ return new Promise(r=>setTimeout(r, ms)); }

function genToken() {
  const arr = new Uint8Array(24);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

function faError(msg){
  const map = {
    "workers_subdomain_tos_not_accepted": "لطفاً یک بار در داشبورد Cloudflare → Workers Overview کلیک کنید تا TOS را بپذیرید.",
    "project with that name already exists": "پروژه‌ای با این نام از قبل وجود دارد. نام دیگری انتخاب کنید.",
    "namespace with that name already exists": "KV با این نام وجود دارد.",
  };
  for(const k in map){ if(msg.toLowerCase().includes(k)) return map[k]; }
  return msg;
}

// ── Handlers ─────────────────────────────
async function handleVerify(request) {
  try {
    const { token } = await request.json();
    if (!token) throw new Error("توکن نمی‌تواند خالی باشد");
    const acc = await cf("https://api.cloudflare.com/client/v4/accounts", token);
    if (!acc.ok || !acc.data.result?.length) {
      throw new Error("توکن نامعتبر یا بدون دسترسی به حساب");
    }
    const accountId = acc.data.result[0].id;
    const accountName = acc.data.result[0].name;
    const projs = await cf(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects?per_page=50`,
      token
    );
    const mine = (projs.data.result || []).filter((p) => p.name.startsWith("avidkiya"));
    return { ok: true, accountId, accountName, existing: mine };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function handleDeploy(request) {
  try {
    const body = await request.json();
    const { token, projectName = "avidkiya-portfolio", adminToken: userToken } = body;
    if (!token) throw new Error("توکن الزامی است");

    // 1. account
    const acc = await cf("https://api.cloudflare.com/client/v4/accounts", token);
    if (!acc.ok) throw new Error("خطا در دریافت حساب");
    const accountId = acc.data.result[0].id;

    // 2. workers.dev subdomain
    await sleep(500);
    let subRes = await cf(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/subdomain`,
      token
    );
    let devSub = subRes.data.result?.subdomain;
    if (!devSub) {
      const newSub = `avidkiya-${genToken().slice(0, 6)}`;
      const create = await cf(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/subdomain`,
        token,
        { method: "PUT", body: JSON.stringify({ subdomain: newSub }) }
      );
      if (!create.ok) {
        throw new Error(
          faError(create.data.errors?.[0]?.message || "workers_subdomain_tos_not_accepted")
        );
      }
      devSub = newSub;
    }

    // 3. KV namespace
    await sleep(500);
    const kv = await cf(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces`,
      token,
      { method: "POST", body: JSON.stringify({ title: `${projectName}-kv-${Date.now()}` }) }
    );
    if (!kv.ok) throw new Error("خطا در ساخت KV: " + faError(JSON.stringify(kv.data.errors)));
    const kvId = kv.data.result.id;
    const kvTitle = kv.data.result.title;

    // 4. ADMIN_TOKEN
    const adminToken = userToken?.trim() || genToken();

    // 5. Pages project
    await sleep(500);
    const proj = await cf(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects`,
      token,
      {
        method: "POST",
        body: JSON.stringify({
          name: projectName,
          production_branch: "main",
          deployment_configs: {
            production: {
              env_vars: { ADMIN_TOKEN: { value: adminToken } },
              kv_namespaces: { AVIDKIYA_KV: { namespace_id: kvId } },
              compatibility_date: "2024-09-01",
              compatibility_flags: ["nodejs_compat"],
            },
            preview: {
              env_vars: { ADMIN_TOKEN: { value: adminToken } },
              kv_namespaces: { AVIDKIYA_KV: { namespace_id: kvId } },
              compatibility_date: "2024-09-01",
              compatibility_flags: ["nodejs_compat"],
            },
          },
        }),
      }
    );

    if (!proj.ok) {
      const msg = proj.data.errors?.[0]?.message || JSON.stringify(proj.data);
      throw new Error("خطا در ساخت پروژه Pages: " + faError(msg));
    }

    const finalUrl = `https://${projectName}.pages.dev`;
    const adminUrl = `${finalUrl}/admin`;

    return {
      ok: true,
      url: finalUrl,
      adminUrl,
      adminToken,
      accountId,
      kvId,
      kvTitle,
      devSubdomain: devSub,
      note:
        "پروژه Pages + KV ساخته شد. برای build کامل: در Cloudflare → Pages → " + projectName + " → Settings → Builds & deployments → Connect to Git → repository: " + SOURCE_REPO + " را وصل کنید. سپس اولین Deploy خودکار انجام می‌شود.",
    };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function handleList(request) {
  try {
    const { token } = await request.json();
    const acc = await cf("https://api.cloudflare.com/client/v4/accounts", token);
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
        domains: p.domains,
      }));
    return { ok: true, projects: mine };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function handleUpdate(request) {
  try {
    const { token, projectName } = await request.json();
    const acc = await cf("https://api.cloudflare.com/client/v4/accounts", token);
    const accountId = acc.data.result[0].id;
    // trigger retry deployment
    const deps = await cf(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments?per_page=1`,
      token
    );
    const latest = deps.data.result?.[0];
    if (!latest) throw new Error("deployment پیدا نشد");
    const r = await cf(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments/${latest.id}/retry`,
      token,
      { method: "POST" }
    );
    if (!r.ok) throw new Error("خطا در آپدیت - لطفا Git integration را چک کنید");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function handleDelete(request) {
  try {
    const { token, projectName } = await request.json();
    const acc = await cf("https://api.cloudflare.com/client/v4/accounts", token);
    const accountId = acc.data.result[0].id;
    const r = await cf(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`,
      token,
      { method: "DELETE" }
    );
    if (!r.ok) throw new Error("خطا در حذف");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function handleRotateToken(request) {
  try {
    const { token, projectName } = await request.json();
    const acc = await cf("https://api.cloudflare.com/client/v4/accounts", token);
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
    return { ok: true, adminToken: newAdmin };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function handleGetInfo(request) {
  try {
    const { token, projectName } = await request.json();
    const acc = await cf("https://api.cloudflare.com/client/v4/accounts", token);
    const accountId = acc.data.result[0].id;
    const r = await cf(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`,
      token
    );
    if (!r.ok) throw new Error("پروژه پیدا نشد");
    return { ok: true, project: r.data.result };
  } catch (e) {
    return { ok: false, error: e.message };
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
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" type="text/css" />
<style>
  body { font-family: 'Vazirmatn', sans-serif; background: #05070d; color: #e0e6f0; }
  .glow { box-shadow: 0 0 40px rgba(93,122,230,0.25); }
  .grad-btn { background: linear-gradient(120deg, #2141a8, #5d7ae6); }
  input, button { font-family: inherit; }
  ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-thumb { background: #2a3040; border-radius: 3px; }
  .toast { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 99; }
</style>
</head>
<body class="min-h-screen flex items-center justify-center p-4">
  <div class="w-full max-w-lg bg-[#0d1117] border border-[#1c2330] rounded-3xl shadow-2xl p-8 relative overflow-hidden glow">
    <div class="absolute -top-16 -right-16 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
    <div class="text-center mb-6 relative">
      <div class="inline-flex w-16 h-16 items-center justify-center bg-blue-950/60 border border-blue-500 rounded-2xl mb-4">
        <span class="text-3xl font-black text-blue-400">A</span>
      </div>
      <h1 class="text-2xl font-black mb-1">AvidKiya OS — Auto Deployer</h1>
      <p class="text-sm text-gray-400">نصب خودکار پرتفولیو روی حساب Cloudflare شما</p>
      <div class="text-[11px] text-gray-500 mt-1">v${CURRENT_VERSION}</div>
    </div>
    <div class="space-y-4 relative">
      <a href="https://dash.cloudflare.com/profile/api-tokens?permissionGroupKeys=%5B%7B%22key%22%3A%22pages%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22workers_scripts%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22workers_kv_storage%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22account_settings%22%2C%22type%22%3A%22read%22%7D%2C%7B%22key%22%3A%22workers_subdomain%22%2C%22type%22%3A%22edit%22%7D%5D&accountId=*&zoneId=all&name=AvidKiya-Deployer"
         target="_blank"
         class="block text-center py-3.5 border border-orange-600/60 text-orange-400 bg-orange-900/20 hover:bg-orange-900/40 font-bold rounded-xl text-sm transition">
        📥 دریافت توکن Cloudflare
      </a>
      <div class="relative">
        <input id="apiToken" type="password" placeholder="توکن Cloudflare (cf_...)" 
               class="w-full py-3.5 pr-12 pl-4 bg-[#0a0d13] border border-[#1c2330] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono">
        <button onclick="toggleToken()" class="absolute inset-y-0 left-3 text-gray-500">👁</button>
      </div>
      <input id="projectName" type="text" value="avidkiya-portfolio" placeholder="نام پروژه"
             class="w-full py-3 px-4 bg-[#0a0d13] border border-[#1c2330] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
      <input id="adminToken" type="text" placeholder="ADMIN_TOKEN (خالی = خودکار)"
             class="w-full py-3 px-4 bg-[#0a0d13] border border-[#1c2330] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono">
      <button onclick="startDeploy()" id="deployBtn"
              class="w-full py-3.5 grad-btn text-white font-black rounded-xl text-lg transition hover:brightness-110">
        🚀 شروع نصب خودکار
      </button>
      <button onclick="listDeployments()"
              class="w-full py-3 border border-blue-700 text-blue-400 bg-blue-900/20 hover:bg-blue-900/40 font-bold rounded-xl text-sm transition">
        مدیریت نصب‌های موجود
      </button>
      <div id="status" class="hidden mt-3 p-4 bg-[#0a0d13] border border-[#1c2330] rounded-xl">
        <div class="flex justify-between items-center mb-2">
          <span id="statusText" class="text-xs font-bold text-gray-300">شروع...</span>
          <span id="statusPct" class="text-xs font-black text-blue-400">۰٪</span>
        </div>
        <div class="w-full h-1.5 bg-[#1c2330] rounded-full overflow-hidden">
          <div id="progressBar" class="h-full bg-blue-500 rounded-full transition-all" style="width:0%"></div>
        </div>
      </div>
      <div id="result" class="hidden mt-3 p-4 bg-emerald-900/20 border border-emerald-700 rounded-xl text-sm space-y-2"></div>
      <div id="error" class="hidden mt-3 p-4 bg-red-900/20 border border-red-700 rounded-xl text-sm text-red-400"></div>
    </div>
    <div class="text-center text-[11px] text-gray-500 mt-6 space-x-4 space-x-reverse">
      <a href="https://github.com/${SOURCE_REPO}" target="_blank" class="hover:text-blue-400">GitHub منبع</a>
      <span>•</span>
      <a href="https://t.me/avidkiya" target="_blank" class="hover:text-blue-400">تلگرام</a>
      <span>•</span>
      <a href="#" class="hover:text-amber-400">☕ دونیت</a>
    </div>
  </div>

<!-- Manage Modal -->
<div id="manageModal" class="fixed inset-0 bg-black/70 hidden z-50 flex items-center justify-center p-4">
  <div class="bg-[#0d1117] border border-[#1c2330] rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
    <div class="p-4 border-b border-[#1c2330] flex justify-between items-center">
      <h3 class="font-black">مدیریت نصب‌ها</h3>
      <button onclick="closeManage()" class="text-gray-400 hover:text-white">✕</button>
    </div>
    <div id="manageList" class="p-4 overflow-auto space-y-3 flex-1"></div>
  </div>
</div>

<div id="toast" class="toast hidden"></div>

<script>
function toggleToken() {
  const el = document.getElementById('apiToken');
  el.type = el.type === 'password' ? 'text' : 'password';
}
function setStatus(text, pct) {
  document.getElementById('status').classList.remove('hidden');
  document.getElementById('statusText').innerText = text;
  document.getElementById('statusPct').innerText = pct + '٪';
  document.getElementById('progressBar').style.width = pct + '%';
}
function showError(msg) {
  const el = document.getElementById('error');
  el.classList.remove('hidden');
  el.innerText = '⚠️ ' + msg;
  toast(msg, 'error');
}
function toast(msg, type='info'){
  const t = document.getElementById('toast');
  t.className = 'toast px-4 py-2 rounded-xl text-sm font-bold ' + (type==='error' ? 'bg-red-600 text-white' : 'bg-gray-800 text-white');
  t.innerText = msg;
  t.classList.remove('hidden');
  setTimeout(()=> t.classList.add('hidden'), 2800);
}
async function startDeploy() {
  const token = document.getElementById('apiToken').value.trim();
  const projectName = document.getElementById('projectName').value.trim() || 'avidkiya-portfolio';
  const adminToken = document.getElementById('adminToken').value.trim();
  if (!token) { showError('توکن الزامی است'); return; }
  document.getElementById('result').classList.add('hidden');
  document.getElementById('error').classList.add('hidden');
  document.getElementById('deployBtn').disabled = true;
  document.getElementById('deployBtn').innerText = 'در حال نصب...';
  try {
    setStatus('در حال اعتبارسنجی توکن...', 10);
    const verify = await fetch('/api/verify-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }).then(r => r.json());
    if (!verify.ok) throw new Error(verify.error);
    setStatus('ساخت KV namespace...', 30);
    await new Promise(r=>setTimeout(r,400));
    setStatus('ساخت پروژه Pages...', 55);
    await new Promise(r=>setTimeout(r,400));
    setStatus('پیکربندی محیط...', 75);
    setStatus('راه‌اندازی نهایی...', 90);
    const res = await fetch('/api/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, projectName, adminToken }),
    }).then(r => r.json());
    if (!res.ok) throw new Error(res.error);
    setStatus('✅ نصب کامل شد', 100);
    const el = document.getElementById('result');
    el.classList.remove('hidden');
    el.innerHTML = \`
      <div class="font-bold text-emerald-400">✅ نصب با موفقیت انجام شد!</div>
      <div>🌐 <b>سایت:</b> <a href="\${res.url}" target="_blank" class="text-blue-400 underline">\${res.url}</a> <button onclick="navigator.clipboard.writeText('\${res.url}')" class="text-[10px] ms-2 px-2 py-0.5 bg-blue-900/40 rounded">کپی</button></div>
      <div>🔑 <b>ADMIN_TOKEN:</b> <code class="bg-black/40 px-2 py-1 rounded font-mono text-xs">\${res.adminToken}</code> <button onclick="navigator.clipboard.writeText('\${res.adminToken}')" class="text-[10px] ms-2 px-2 py-0.5 bg-emerald-900/40 rounded">کپی</button></div>
      <div>📦 <b>KV:</b> \${res.kvTitle || res.kvId}</div>
      <div class="text-xs text-gray-400 mt-2">ورود مدیریت: \${res.adminUrl} — این توکن را ذخیره کنید.</div>
      \${res.note ? \`<div class="text-xs text-yellow-400 mt-2 p-2 bg-yellow-900/10 rounded">⚠️ \${res.note}</div>\` : ''}
    \`;
    toast('نصب موفق!', 'info');
  } catch (e) {
    showError(e.message);
    setStatus('❌ خطا', 0);
  } finally {
    document.getElementById('deployBtn').disabled = false;
    document.getElementById('deployBtn').innerText = '🚀 شروع نصب خودکار';
  }
}
async function listDeployments() {
  const token = document.getElementById('apiToken').value.trim();
  if (!token) { showError('اول توکن وارد کن'); return; }
  const r = await fetch('/api/list-deployments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  }).then(x => x.json());
  if (!r.ok) { showError(r.error); return; }
  openManage(r.projects, token);
}
function openManage(projects, token){
  const modal = document.getElementById('manageModal');
  const list = document.getElementById('manageList');
  if(!projects.length){ list.innerHTML = '<div class="text-center text-gray-400 py-8">پروژه‌ای پیدا نشد</div>'; }
  else {
    list.innerHTML = projects.map(p => \`
      <div class="p-3 rounded-xl bg-[#0a0d13] border border-[#1c2330] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div class="font-bold text-blue-300">\${p.name}</div>
          <div class="text-xs text-gray-400">\${p.url}</div>
          <div class="text-[10px] text-gray-500">\${p.createdAt ? new Date(p.createdAt).toLocaleString('fa-IR') : ''}</div>
        </div>
        <div class="flex flex-wrap gap-2 text-[11px]">
          <button onclick="copyText('\${p.url}')" class="px-2 py-1 bg-blue-900/30 rounded">کپی URL</button>
          <button onclick="doUpdate('\${p.name}')" class="px-2 py-1 bg-amber-900/30 text-amber-300 rounded">آپدیت</button>
          <button onclick="doRotate('\${p.name}')" class="px-2 py-1 bg-purple-900/30 text-purple-300 rounded">rotate token</button>
          <button onclick="doDelete('\${p.name}')" class="px-2 py-1 bg-red-900/30 text-red-300 rounded">حذف</button>
        </div>
      </div>
    \`).join('');
  }
  modal.dataset.token = token;
  modal.classList.remove('hidden');
}
function closeManage(){ document.getElementById('manageModal').classList.add('hidden'); }
function copyText(t){ navigator.clipboard.writeText(t); toast('کپی شد'); }
async function doUpdate(name){
  const token = document.getElementById('manageModal').dataset.token;
  if(!confirm('آپدیت '+name+' ؟')) return;
  const r = await fetch('/api/update-deployment', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ token, projectName: name })}).then(x=>x.json());
  toast(r.ok ? 'درخواست آپدیت ارسال شد' : ('خطا: '+r.error), r.ok ? 'info' : 'error');
}
async function doRotate(name){
  const token = document.getElementById('manageModal').dataset.token;
  if(!confirm('تعویض ADMIN_TOKEN برای '+name+' ؟')) return;
  const r = await fetch('/api/rotate-token', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ token, projectName: name })}).then(x=>x.json());
  if(r.ok){ alert('توکن جدید:\\n'+r.adminToken); copyText(r.adminToken); } else { toast(r.error,'error'); }
}
async function doDelete(name){
  const token = document.getElementById('manageModal').dataset.token;
  if(!confirm('حذف کامل '+name+' ؟ این عمل برگشت‌ناپذیر است.')) return;
  const r = await fetch('/api/delete-deployment', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ token, projectName: name })}).then(x=>x.json());
  toast(r.ok ? 'حذف شد' : ('خطا: '+r.error), r.ok ? 'info' : 'error');
  if(r.ok) listDeployments();
}
</script>
</body>
</html>`;
}
