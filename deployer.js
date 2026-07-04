// ═══════════════════════════════════════════════════════════════════════════
// AvidKiya OS — Auto Deployer Worker
// Deploy this to Cloudflare Workers to auto-install AvidKiya portfolio
// ═══════════════════════════════════════════════════════════════════════════

const CURRENT_VERSION = "1.0.0";
const SOURCE_REPO = "avidkia/avidkiya-portfolio";
const SOURCE_BRANCH = "main";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };
    
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    
    // Router
    if (request.method === "GET" && url.pathname === "/") {
      return html(getHtmlContent());
    }
    
    if (request.method === "POST" && url.pathname === "/api/verify-token") {
      return handleVerify(request, corsHeaders);
    }
    
    if (request.method === "POST" && url.pathname === "/api/deploy") {
      return handleDeploy(request, corsHeaders);
    }
    
    if (request.method === "POST" && url.pathname === "/api/list-deployments") {
      return handleList(request, corsHeaders);
    }
    
    if (request.method === "POST" && url.pathname === "/api/update-deployment") {
      return handleUpdate(request, corsHeaders);
    }
    
    if (request.method === "POST" && url.pathname === "/api/delete-deployment") {
      return handleDelete(request, corsHeaders);
    }
    
    if (request.method === "POST" && url.pathname === "/api/rotate-token") {
      return handleRotateToken(request, corsHeaders);
    }
    
    if (request.method === "POST" && url.pathname === "/api/get-info") {
      return handleGetInfo(request, corsHeaders);
    }
    
    return new Response("Not Found", { status: 404 });
  }
};

// ── Helpers ──────────────────────────────

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 
      "Content-Type": "application/json;charset=UTF-8",
      ...headers
    }
  });
}

function html(body) {
  return new Response(body, {
    headers: { "Content-Type": "text/html;charset=UTF-8" }
  });
}

async function cf(url, token, init = {}) {
  await sleep(100); // Rate limit protection
  
  const res = await fetch(url, {
    ...init,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {})
    }
  });
  
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok && data.success !== false, status: res.status, data };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function genToken() {
  const arr = new Uint8Array(24);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => b.toString(16).padStart(2, "0")).join("");
}

// ── Handlers ─────────────────────────────

async function handleVerify(request, corsHeaders) {
  try {
    const { token } = await request.json();
    if (!token) throw new Error("توکن نمی‌تواند خالی باشد");
    
    const acc = await cf("https://api.cloudflare.com/client/v4/accounts", token);
    if (!acc.ok || !acc.data.result?.length) {
      throw new Error("توکن نامعتبر یا بدون دسترسی به حساب");
    }
    
    const accountId = acc.data.result[0].id;
    const accountName = acc.data.result[0].name;
    
    // List existing Pages projects starting with "avidkiya"
    const projs = await cf(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects?per_page=50`,
      token
    );
    
    const mine = (projs.data.result || []).filter(p => p.name.startsWith("avidkiya"));
    
    return json({ ok: true, accountId, accountName, existing: mine }, 200, corsHeaders);
  } catch (e) {
    return json({ ok: false, error: e.message }, 400, corsHeaders);
  }
}

async function handleDeploy(request, corsHeaders) {
  try {
    const body = await request.json();
    const { token, projectName = "avidkiya-portfolio", adminToken: userToken } = body;
    
    if (!token) throw new Error("توکن الزامی است");
    
    // 1. Get account
    const acc = await cf("https://api.cloudflare.com/client/v4/accounts", token);
    if (!acc.ok) throw new Error("خطا در دریافت حساب");
    const accountId = acc.data.result[0].id;
    
    // 2. Check/create workers.dev subdomain
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
        const errMsg = create.data.errors?.[0]?.message || "";
        if (errMsg.includes("TOS") || errMsg.includes("terms")) {
          throw new Error(
            "لطفاً یک بار در داشبورد Cloudflare > Workers & Pages کلیک کنید تا قوانین را بپذیرید و بعد دوباره امتحان کنید"
          );
        }
        throw new Error("خطا در ساخت subdomain: " + errMsg);
      }
      devSub = newSub;
    }
    
    // 3. Create KV namespace
    const kvTitle = `${projectName}-kv`;
    const kv = await cf(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces`,
      token,
      { method: "POST", body: JSON.stringify({ title: kvTitle }) }
    );
    
    let kvId;
    if (!kv.ok) {
      // Maybe already exists - try to find it
      const kvList = await cf(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces?per_page=100`,
        token
      );
      const existing = kvList.data.result?.find(ns => ns.title === kvTitle);
      if (existing) {
        kvId = existing.id;
      } else {
        throw new Error("خطا در ساخت KV: " + JSON.stringify(kv.data.errors));
      }
    } else {
      kvId = kv.data.result.id;
    }
    
    // 4. Generate ADMIN_TOKEN
    const adminToken = userToken?.trim() || genToken();
    
    // 5. Check if project exists
    const existingProj = await cf(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`,
      token
    );
    
    let projectCreated = false;
    
    if (!existingProj.ok) {
      // Create Pages project
      const proj = await cf(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects`,
        token,
        {
          method: "POST",
          body: JSON.stringify({
            name: projectName,
            production_branch: "main"
          })
        }
      );
      
      if (!proj.ok) {
        throw new Error(
          "خطا در ساخت پروژه Pages: " +
          (proj.data.errors?.[0]?.message || JSON.stringify(proj.data))
        );
      }
      projectCreated = true;
    }
    
    // 6. Update project settings with env vars and KV binding
    const updateRes = await cf(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`,
      token,
      {
        method: "PATCH",
        body: JSON.stringify({
          deployment_configs: {
            production: {
              env_vars: { ADMIN_TOKEN: { value: adminToken, type: "secret_text" } },
              kv_namespaces: { AVIDKIYA_KV: { namespace_id: kvId } },
              compatibility_date: "2024-09-01",
              compatibility_flags: ["nodejs_compat"]
            },
            preview: {
              env_vars: { ADMIN_TOKEN: { value: adminToken, type: "secret_text" } },
              kv_namespaces: { AVIDKIYA_KV: { namespace_id: kvId } },
              compatibility_date: "2024-09-01",
              compatibility_flags: ["nodejs_compat"]
            }
          }
        })
      }
    );
    
    if (!updateRes.ok) {
      console.log("Update warning:", updateRes.data);
    }
    
    const finalUrl = `https://${projectName}.pages.dev`;
    
    return json({
      ok: true,
      url: finalUrl,
      adminToken,
      accountId,
      kvId,
      projectCreated,
      note: "پروژه ساخته شد. برای deploy کامل، در داشبورد Cloudflare → Pages → پروژه را به GitHub وصل کنید.",
      instructions: [
        "۱. وارد داشبورد Cloudflare شوید",
        "۲. به Pages بروید",
        "۳. روی پروژه " + projectName + " کلیک کنید",
        "۴. در تب Settings → Git integration، به GitHub متصل شوید",
        "۵. Repository: " + SOURCE_REPO + " را انتخاب کنید",
        "۶. Branch: " + SOURCE_BRANCH
      ]
    }, 200, corsHeaders);
    
  } catch (e) {
    return json({ ok: false, error: e.message }, 400, corsHeaders);
  }
}

async function handleList(request, corsHeaders) {
  try {
    const { token } = await request.json();
    const acc = await cf("https://api.cloudflare.com/client/v4/accounts", token);
    const accountId = acc.data.result[0].id;
    
    const projs = await cf(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects?per_page=50`,
      token
    );
    
    const mine = (projs.data.result || [])
      .filter(p => p.name.startsWith("avidkiya"))
      .map(p => ({
        name: p.name,
        url: `https://${p.name}.pages.dev`,
        createdAt: p.created_on,
        productionBranch: p.production_branch,
        latestDeployment: p.latest_deployment
      }));
    
    return json({ ok: true, projects: mine }, 200, corsHeaders);
  } catch (e) {
    return json({ ok: false, error: e.message }, 400, corsHeaders);
  }
}

async function handleUpdate(request, corsHeaders) {
  try {
    const { token, projectName } = await request.json();
    const acc = await cf("https://api.cloudflare.com/client/v4/accounts", token);
    const accountId = acc.data.result[0].id;
    
    // Trigger a new deployment (requires GitHub connection)
    const r = await cf(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments`,
      token,
      { method: "POST", body: JSON.stringify({}) }
    );
    
    if (!r.ok) {
      throw new Error("برای آپدیت، ابتدا پروژه را به GitHub متصل کنید");
    }
    
    return json({ ok: true }, 200, corsHeaders);
  } catch (e) {
    return json({ ok: false, error: e.message }, 400, corsHeaders);
  }
}

async function handleDelete(request, corsHeaders) {
  try {
    const { token, projectName } = await request.json();
    const acc = await cf("https://api.cloudflare.com/client/v4/accounts", token);
    const accountId = acc.data.result[0].id;
    
    const r = await cf(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`,
      token,
      { method: "DELETE" }
    );
    
    if (!r.ok) throw new Error("خطا در حذف پروژه");
    
    return json({ ok: true }, 200, corsHeaders);
  } catch (e) {
    return json({ ok: false, error: e.message }, 400, corsHeaders);
  }
}

async function handleRotateToken(request, corsHeaders) {
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
            production: { 
              env_vars: { ADMIN_TOKEN: { value: newAdmin, type: "secret_text" } }
            },
            preview: { 
              env_vars: { ADMIN_TOKEN: { value: newAdmin, type: "secret_text" } }
            }
          }
        })
      }
    );
    
    if (!r.ok) throw new Error("خطا در تعویض توکن");
    
    return json({ ok: true, adminToken: newAdmin }, 200, corsHeaders);
  } catch (e) {
    return json({ ok: false, error: e.message }, 400, corsHeaders);
  }
}

async function handleGetInfo(request, corsHeaders) {
  try {
    const { token, projectName } = await request.json();
    const acc = await cf("https://api.cloudflare.com/client/v4/accounts", token);
    const accountId = acc.data.result[0].id;
    
    const r = await cf(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`,
      token
    );
    
    if (!r.ok) throw new Error("پروژه پیدا نشد");
    
    return json({ ok: true, project: r.data.result }, 200, corsHeaders);
  } catch (e) {
    return json({ ok: false, error: e.message }, 400, corsHeaders);
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
<link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet">
<style>
  body { font-family: 'Vazirmatn', sans-serif; background: #05070d; color: #e0e6f0; }
  .glow { box-shadow: 0 0 60px rgba(93,122,230,0.2); }
  .grad-btn { background: linear-gradient(135deg, #2141a8, #5d7ae6); }
  .grad-btn:hover { filter: brightness(1.1); }
  input, button { font-family: inherit; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-thumb { background: #2a3040; border-radius: 3px; }
  .toast { animation: slideIn 0.3s ease; }
  @keyframes slideIn {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  .pulse { animation: pulse 2s infinite; }
</style>
</head>
<body class="min-h-screen flex items-center justify-center p-4">
  
  <!-- Toast Container -->
  <div id="toasts" class="fixed top-4 left-4 right-4 z-50 flex flex-col items-center gap-2"></div>
  
  <!-- Main Card -->
  <div class="w-full max-w-lg bg-[#0d1117] border border-[#1c2330] rounded-3xl shadow-2xl p-8 relative overflow-hidden glow">
    
    <!-- Glow Effects -->
    <div class="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
    
    <!-- Header -->
    <div class="text-center mb-8 relative">
      <div class="inline-flex w-20 h-20 items-center justify-center bg-gradient-to-br from-blue-900/60 to-indigo-900/60 border border-blue-500/50 rounded-2xl mb-4 shadow-lg">
        <span class="text-4xl font-black text-blue-400">A</span>
      </div>
      <h1 class="text-2xl font-black mb-2">AvidKiya OS</h1>
      <p class="text-sm text-gray-400">نصب خودکار پرتفولیو روی Cloudflare Pages</p>
      <p class="text-xs text-gray-500 mt-1">نسخه ${CURRENT_VERSION}</p>
    </div>
    
    <!-- Form -->
    <div class="space-y-4 relative">
      
      <!-- Get Token Button -->
      <a href="https://dash.cloudflare.com/profile/api-tokens?permissionGroupKeys=%5B%7B%22key%22%3A%22pages%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22workers_scripts%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22workers_kv_storage%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22account_settings%22%2C%22type%22%3A%22read%22%7D%2C%7B%22key%22%3A%22workers_subdomain%22%2C%22type%22%3A%22edit%22%7D%5D&accountId=*&zoneId=all&name=AvidKiya-Deployer"
         target="_blank"
         class="block text-center py-3.5 border border-orange-600/60 text-orange-400 bg-orange-900/20 hover:bg-orange-900/40 font-bold rounded-xl text-sm transition">
        📥 دریافت توکن Cloudflare
      </a>
      
      <!-- Token Input -->
      <div class="relative">
        <input id="apiToken" type="password" placeholder="توکن Cloudflare"
               class="w-full py-3.5 px-4 pe-12 bg-[#0a0d13] border border-[#1c2330] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm font-mono placeholder-gray-500 transition">
        <button onclick="toggleToken()" class="absolute inset-y-0 left-3 text-gray-500 hover:text-gray-300 transition">
          <span id="eyeIcon">👁</span>
        </button>
      </div>
      
      <!-- Project Name -->
      <input id="projectName" type="text" value="avidkiya-portfolio" placeholder="نام پروژه"
             class="w-full py-3 px-4 bg-[#0a0d13] border border-[#1c2330] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm placeholder-gray-500 transition">
      
      <!-- Admin Token -->
      <input id="adminToken" type="text" placeholder="ADMIN_TOKEN (خالی = خودکار)"
             class="w-full py-3 px-4 bg-[#0a0d13] border border-[#1c2330] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm font-mono placeholder-gray-500 transition">
      
      <!-- Deploy Button -->
      <button onclick="startDeploy()" id="deployBtn"
              class="w-full py-4 grad-btn text-white font-black rounded-xl text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/20">
        🚀 شروع نصب خودکار
      </button>
      
      <!-- Manage Button -->
      <button onclick="listDeployments()"
              class="w-full py-3 border border-blue-700/50 text-blue-400 bg-blue-900/20 hover:bg-blue-900/40 font-bold rounded-xl text-sm transition">
        📋 مدیریت نصب‌های موجود
      </button>
      
      <!-- Status -->
      <div id="status" class="hidden mt-4 p-4 bg-[#0a0d13] border border-[#1c2330] rounded-xl">
        <div class="flex justify-between items-center mb-2">
          <span id="statusText" class="text-sm font-bold text-gray-300">شروع...</span>
          <span id="statusPct" class="text-sm font-black text-blue-400">۰٪</span>
        </div>
        <div class="w-full h-2 bg-[#1c2330] rounded-full overflow-hidden">
          <div id="progressBar" class="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-300" style="width:0%"></div>
        </div>
      </div>
      
      <!-- Result -->
      <div id="result" class="hidden mt-4 p-5 bg-emerald-900/20 border border-emerald-700/50 rounded-xl text-sm space-y-3"></div>
      
      <!-- Error -->
      <div id="error" class="hidden mt-4 p-4 bg-red-900/20 border border-red-700/50 rounded-xl text-sm text-red-400"></div>
      
    </div>
    
    <!-- Footer -->
    <div class="mt-8 pt-4 border-t border-[#1c2330] flex justify-center gap-4 text-xs text-gray-500">
      <a href="https://github.com/avidkia" target="_blank" class="hover:text-gray-300 transition">GitHub</a>
      <a href="https://t.me/avidkia" target="_blank" class="hover:text-gray-300 transition">Telegram</a>
      <span>v${CURRENT_VERSION}</span>
    </div>
  </div>
  
  <!-- Projects Modal -->
  <div id="projectsModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" onclick="closeModal()"></div>
    <div class="relative w-full max-w-lg bg-[#0d1117] border border-[#1c2330] rounded-2xl p-6 max-h-[80vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-bold">پروژه‌های نصب شده</h2>
        <button onclick="closeModal()" class="text-gray-500 hover:text-white">✕</button>
      </div>
      <div id="projectsList" class="space-y-3"></div>
    </div>
  </div>

<script>
let tokenVisible = false;

function toggleToken() {
  const el = document.getElementById('apiToken');
  const icon = document.getElementById('eyeIcon');
  tokenVisible = !tokenVisible;
  el.type = tokenVisible ? 'text' : 'password';
  icon.textContent = tokenVisible ? '🙈' : '👁';
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toasts');
  const toast = document.createElement('div');
  const colors = {
    success: 'bg-emerald-900/90 border-emerald-700',
    error: 'bg-red-900/90 border-red-700',
    info: 'bg-blue-900/90 border-blue-700'
  };
  toast.className = \`toast px-4 py-3 rounded-xl border \${colors[type]} text-sm font-medium max-w-sm text-center\`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function setStatus(text, pct) {
  document.getElementById('status').classList.remove('hidden');
  document.getElementById('statusText').textContent = text;
  document.getElementById('statusPct').textContent = pct + '٪';
  document.getElementById('progressBar').style.width = pct + '%';
}

function showError(msg) {
  const el = document.getElementById('error');
  el.classList.remove('hidden');
  el.innerHTML = '⚠️ ' + msg;
}

function hideError() {
  document.getElementById('error').classList.add('hidden');
}

async function startDeploy() {
  const token = document.getElementById('apiToken').value.trim();
  const projectName = document.getElementById('projectName').value.trim() || 'avidkiya-portfolio';
  const adminToken = document.getElementById('adminToken').value.trim();
  
  if (!token) { 
    showError('توکن الزامی است'); 
    showToast('لطفاً توکن Cloudflare را وارد کنید', 'error');
    return; 
  }
  
  document.getElementById('result').classList.add('hidden');
  hideError();
  
  const btn = document.getElementById('deployBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="pulse">در حال نصب...</span>';
  
  try {
    setStatus('در حال اعتبارسنجی توکن...', 10);
    
    const verify = await fetch('/api/verify-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    }).then(r => r.json());
    
    if (!verify.ok) throw new Error(verify.error);
    
    showToast('توکن معتبر است ✓', 'success');
    
    setStatus('ساخت KV namespace...', 30);
    await new Promise(r => setTimeout(r, 500));
    
    setStatus('ساخت پروژه Pages...', 50);
    await new Promise(r => setTimeout(r, 500));
    
    setStatus('پیکربندی محیط...', 70);
    
    const res = await fetch('/api/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, projectName, adminToken })
    }).then(r => r.json());
    
    if (!res.ok) throw new Error(res.error);
    
    setStatus('✅ نصب کامل شد!', 100);
    showToast('نصب با موفقیت انجام شد!', 'success');
    
    const el = document.getElementById('result');
    el.classList.remove('hidden');
    el.innerHTML = \`
      <div class="font-bold text-emerald-400 text-lg mb-3">✅ نصب با موفقیت انجام شد!</div>
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <span class="text-gray-400">🌐 سایت:</span>
          <a href="\${res.url}" target="_blank" class="text-blue-400 hover:underline font-mono">\${res.url}</a>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-gray-400">🔑 رمز ادمین:</span>
          <code class="bg-black/40 px-3 py-1.5 rounded-lg font-mono text-xs select-all">\${res.adminToken}</code>
          <button onclick="navigator.clipboard.writeText('\${res.adminToken}'); showToast('کپی شد!', 'success');" class="text-blue-400 hover:text-blue-300">📋</button>
        </div>
      </div>
      <div class="mt-4 p-3 bg-amber-900/20 border border-amber-700/30 rounded-lg text-amber-400 text-xs">
        <div class="font-bold mb-2">⚠️ مراحل بعدی:</div>
        <ol class="list-decimal list-inside space-y-1">
          \${res.instructions?.map(i => '<li>' + i + '</li>').join('') || '<li>پروژه را به GitHub متصل کنید</li>'}
        </ol>
      </div>
      <div class="mt-3 text-xs text-gray-500">
        این رمز را ذخیره کنید. برای ورود به پنل ادمین از <code class="bg-black/30 px-1 rounded">\${res.url}#kiya/panel</code> استفاده کنید.
      </div>
    \`;
    
  } catch (e) {
    showError(e.message);
    showToast(e.message, 'error');
    setStatus('❌ خطا', 0);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '🚀 شروع نصب خودکار';
  }
}

async function listDeployments() {
  const token = document.getElementById('apiToken').value.trim();
  if (!token) { 
    showError('اول توکن وارد کنید'); 
    showToast('لطفاً توکن را وارد کنید', 'error');
    return; 
  }
  
  showToast('در حال دریافت لیست...', 'info');
  
  const r = await fetch('/api/list-deployments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  }).then(x => x.json());
  
  if (!r.ok) { 
    showError(r.error); 
    showToast(r.error, 'error');
    return; 
  }
  
  const list = document.getElementById('projectsList');
  
  if (!r.projects.length) {
    list.innerHTML = '<div class="text-center py-8 text-gray-500">پروژه‌ای پیدا نشد</div>';
  } else {
    list.innerHTML = r.projects.map(p => \`
      <div class="p-4 bg-[#0a0d13] rounded-xl border border-[#1c2330]">
        <div class="flex justify-between items-start mb-2">
          <div>
            <div class="font-bold text-white">\${p.name}</div>
            <a href="\${p.url}" target="_blank" class="text-sm text-blue-400 hover:underline">\${p.url}</a>
          </div>
        </div>
        <div class="flex gap-2 mt-3">
          <button onclick="rotateToken('\${p.name}')" class="flex-1 py-2 text-xs bg-amber-900/30 text-amber-400 rounded-lg hover:bg-amber-900/50 transition">
            🔄 توکن جدید
          </button>
          <button onclick="deleteProject('\${p.name}')" class="flex-1 py-2 text-xs bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50 transition">
            🗑️ حذف
          </button>
        </div>
      </div>
    \`).join('');
  }
  
  document.getElementById('projectsModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('projectsModal').classList.add('hidden');
}

async function rotateToken(projectName) {
  if (!confirm('آیا می‌خواهید توکن ادمین جدید بسازید؟')) return;
  
  const token = document.getElementById('apiToken').value.trim();
  showToast('در حال ساخت توکن جدید...', 'info');
  
  const r = await fetch('/api/rotate-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, projectName })
  }).then(x => x.json());
  
  if (r.ok) {
    showToast('توکن جدید: ' + r.adminToken, 'success');
    alert('توکن ادمین جدید:\\n\\n' + r.adminToken + '\\n\\nاین توکن را ذخیره کنید!');
  } else {
    showToast(r.error, 'error');
  }
}

async function deleteProject(projectName) {
  if (!confirm('آیا مطمئنید می‌خواهید پروژه ' + projectName + ' را حذف کنید؟')) return;
  
  const token = document.getElementById('apiToken').value.trim();
  showToast('در حال حذف...', 'info');
  
  const r = await fetch('/api/delete-deployment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, projectName })
  }).then(x => x.json());
  
  if (r.ok) {
    showToast('پروژه حذف شد', 'success');
    listDeployments();
  } else {
    showToast(r.error, 'error');
  }
}
</script>
</body>
</html>`;
}
