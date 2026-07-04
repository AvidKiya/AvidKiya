// deployer.js — Cloudflare Worker (single file)
// Deploy this to a Worker → visit its URL → paste your CF API token → auto-installs AvidKiya portfolio

const CURRENT_VERSION = "1.0.0";
const PROJECT_PREFIX = "avidkiya";

// Source: Built assets URL (user should host their built .output on GitHub releases or a CDN)
const SOURCE_ZIP_URL = "https://github.com/IR-NETLIFY/avidkiya-portfolio/archive/refs/heads/main.zip";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // ── Routes ─────────────────────────────────
      if (method === "GET" && path === "/") {
        return new Response(getHtmlContent(), {
          headers: { "Content-Type": "text/html;charset=UTF-8", ...corsHeaders },
        });
      }

      if (method === "POST" && path === "/api/verify-token") {
        return handleVerify(request);
      }

      if (method === "POST" && path === "/api/deploy") {
        return handleDeploy(request);
      }

      if (method === "POST" && path === "/api/list-deployments") {
        return handleList(request);
      }

      if (method === "POST" && path === "/api/update-deployment") {
        return handleUpdate(request);
      }

      if (method === "POST" && path === "/api/delete-deployment") {
        return handleDelete(request);
      }

      if (method === "POST" && path === "/api/rotate-token") {
        return handleRotateToken(request);
      }

      if (method === "POST" && path === "/api/get-info") {
        return handleGetInfo(request);
      }

      return new Response(JSON.stringify({ error: "Not Found" }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: e.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
  },
};

// ── Helpers ───────────────────────────────────

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

async function cfApi(url, token, init = {}) {
  // Rate limiting: wait between requests
  await sleep(500);

  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  let data = {};
  try {
    data = await res.json();
  } catch {}

  return {
    ok: res.ok && data.success !== false,
    status: res.status,
    data,
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function genToken() {
  const arr = new Uint8Array(24);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

function translateCfError(message) {
  const translations = {
    "terms of service": "لطفاً یک بار در داشبورد Cloudflare > Workers Overview کلیک کنید تا TOS رو بپذیرید و بعد دوباره امتحان کنید",
    "already exists": "این نام قبلاً استفاده شده. یک نام دیگر انتخاب کنید",
    "not found": "پروژه پیدا نشد",
    "invalid": "مقدار نامعتبر",
    "rate limit": "تعداد درخواست‌ها زیاد شد. چند لحظه صبر کنید",
    "permission": "توکن دسترسی کافی ندارد. لطفاً توکن جدید بسازید",
  };

  const lower = message.toLowerCase();
  for (const [key, val] of Object.entries(translations)) {
    if (lower.includes(key)) return val;
  }
  return message;
}

async function getAccountId(token) {
  const acc = await cfApi("https://api.cloudflare.com/client/v4/accounts", token);
  if (!acc.ok || !acc.data?.result?.length) {
    throw new Error("توکن نامعتبر یا بدون دسترسی به حساب");
  }
  return {
    accountId: acc.data.result[0].id,
    accountName: acc.data.result[0].name,
  };
}

// ── Handlers ──────────────────────────────────

async function handleVerify(request) {
  try {
    const { token } = await request.json();
    if (!token) throw new Error("توکن نمی‌تواند خالی باشد");

    const { accountId, accountName } = await getAccountId(token);

    // List existing Pages projects
    const projs = await cfApi(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects?per_page=50`,
      token
    );

    const mine = (projs.data?.result || []).filter((p) =>
      p.name?.startsWith(PROJECT_PREFIX)
    );

    // Check workers.dev subdomain
    let subRes = await cfApi(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/subdomain`,
      token
    );
    const hasSubdomain = subRes.data?.result?.subdomain;

    return jsonResponse({
      ok: true,
      accountId,
      accountName,
      existing: mine.map((p) => ({ name: p.name, url: `https://${p.name}.pages.dev` })),
      hasSubdomain: !!hasSubdomain,
    });
  } catch (e) {
    return jsonResponse({ ok: false, error: e.message }, 400);
  }
}

async function handleDeploy(request) {
  try {
    const body = await request.json();
    const { token, projectName = "avidkiya-portfolio", adminToken: userToken } = body;
    if (!token) throw new Error("توکن الزامی است");

    // 1. Get account
    const { accountId } = await getAccountId(token);

    // 2. Ensure workers.dev subdomain
    let subRes = await cfApi(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/subdomain`,
      token
    );
    let devSub = subRes.data?.result?.subdomain;

    if (!devSub) {
      const newSub = `avidkiya-${genToken().slice(0, 6)}`;
      const create = await cfApi(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/subdomain`,
        token,
        { method: "PUT", body: JSON.stringify({ subdomain: newSub }) }
      );
      if (!create.ok) {
        throw new Error(translateCfError(create.data?.errors?.[0]?.message || "TOS not accepted. Please visit Cloudflare Dashboard > Workers first."));
      }
      devSub = newSub;
    }

    // 3. Create KV namespace
    const kv = await cfApi(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces`,
      token,
      { method: "POST", body: JSON.stringify({ title: `${projectName}-kv` }) }
    );
    if (!kv.ok) {
      throw new Error("خطا در ساخت KV: " + translateCfError(kv.data?.errors?.[0]?.message || ""));
    }
    const kvId = kv.data.result.id;

    // 4. Admin token
    const adminToken = userToken?.trim() || genToken();

    // 5. Create Pages project
    const proj = await cfApi(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects`,
      token,
      {
        method: "POST",
        body: JSON.stringify({
          name: projectName,
          production_branch: "main",
          deployment_configs: {
            production: {
              env_vars: { ADMIN_TOKEN: { value: adminToken, type: "plain_text" } },
              kv_namespaces: { AVIDKIYA_KV: { namespace_id: kvId } },
              compatibility_date: "2024-09-01",
              compatibility_flags: ["nodejs_compat"],
            },
            preview: {
              env_vars: { ADMIN_TOKEN: { value: adminToken, type: "plain_text" } },
              kv_namespaces: { AVIDKIYA_KV: { namespace_id: kvId } },
              compatibility_date: "2024-09-01",
              compatibility_flags: ["nodejs_compat"],
            },
          },
        }),
      }
    );

    if (!proj.ok) {
      // Check if project already exists
      const existing = await cfApi(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`,
        token
      );
      if (existing.ok) {
        // Update existing project with env vars
        const patch = await cfApi(
          `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`,
          token,
          {
            method: "PATCH",
            body: JSON.stringify({
              deployment_configs: {
                production: {
                  env_vars: { ADMIN_TOKEN: { value: adminToken, type: "plain_text" } },
                  kv_namespaces: { AVIDKIYA_KV: { namespace_id: kvId } },
                },
              },
            }),
          }
        );
        if (!patch.ok) throw new Error(translateCfError(patch.data?.errors?.[0]?.message || ""));
      } else {
        throw new Error("خطا در ساخت پروژه: " + translateCfError(proj.data?.errors?.[0]?.message || ""));
      }
    }

    const finalUrl = `https://${projectName}.pages.dev`;

    return jsonResponse({
      ok: true,
      url: finalUrl,
      adminToken,
      accountId,
      kvId,
      devSub,
      note: "پروژه Pages ساخته شد! حالا در Cloudflare Dashboard > Pages > پروژه > Settings > Git Integration > Connect to Git و ریپازیتوری avidkiya-portfolio خود را وصل کنید تا build خودکار انجام شود.",
    });
  } catch (e) {
    return jsonResponse({ ok: false, error: e.message }, 400);
  }
}

async function handleList(request) {
  try {
    const { token } = await request.json();
    const { accountId } = await getAccountId(token);

    const projs = await cfApi(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects?per_page=50`,
      token
    );

    const mine = (projs.data?.result || [])
      .filter((p) => p.name?.startsWith(PROJECT_PREFIX))
      .map((p) => ({
        name: p.name,
        url: `https://${p.name}.pages.dev`,
        createdAt: p.created_on,
        productionBranch: p.production_branch,
        latestDeployment: p.latest_deployment?.url || null,
      }));

    return jsonResponse({ ok: true, projects: mine });
  } catch (e) {
    return jsonResponse({ ok: false, error: e.message }, 400);
  }
}

async function handleUpdate(request) {
  try {
    const { token, projectName } = await request.json();
    const { accountId } = await getAccountId(token);

    const r = await cfApi(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments`,
      token,
      { method: "POST", body: JSON.stringify({}) }
    );
    if (!r.ok) throw new Error(translateCfError(r.data?.errors?.[0]?.message || "خطا در آپدیت"));

    return jsonResponse({ ok: true });
  } catch (e) {
    return jsonResponse({ ok: false, error: e.message }, 400);
  }
}

async function handleDelete(request) {
  try {
    const { token, projectName } = await request.json();
    const { accountId } = await getAccountId(token);

    // Find and delete associated KV
    const kvs = await cfApi(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces`,
      token
    );
    const kvToDelete = (kvs.data?.result || []).find((ns) =>
      ns.title?.includes(projectName)
    );

    const r = await cfApi(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`,
      token,
      { method: "DELETE" }
    );
    if (!r.ok) throw new Error(translateCfError(r.data?.errors?.[0]?.message || "خطا در حذف"));

    if (kvToDelete) {
      await cfApi(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${kvToDelete.id}`,
        token,
        { method: "DELETE" }
      );
    }

    return jsonResponse({ ok: true });
  } catch (e) {
    return jsonResponse({ ok: false, error: e.message }, 400);
  }
}

async function handleRotateToken(request) {
  try {
    const { token, projectName } = await request.json();
    const { accountId } = await getAccountId(token);

    const newAdmin = genToken();
    const r = await cfApi(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`,
      token,
      {
        method: "PATCH",
        body: JSON.stringify({
          deployment_configs: {
            production: {
              env_vars: { ADMIN_TOKEN: { value: newAdmin, type: "plain_text" } },
            },
            preview: {
              env_vars: { ADMIN_TOKEN: { value: newAdmin, type: "plain_text" } },
            },
          },
        }),
      }
    );
    if (!r.ok) throw new Error(translateCfError(r.data?.errors?.[0]?.message || "خطا در تعویض توکن"));

    return jsonResponse({ ok: true, adminToken: newAdmin });
  } catch (e) {
    return jsonResponse({ ok: false, error: e.message }, 400);
  }
}

async function handleGetInfo(request) {
  try {
    const { token, projectName } = await request.json();
    const { accountId } = await getAccountId(token);

    const r = await cfApi(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`,
      token
    );
    if (!r.ok) throw new Error("پروژه پیدا نشد");

    return jsonResponse({ ok: true, project: r.data.result });
  } catch (e) {
    return jsonResponse({ ok: false, error: e.message }, 400);
  }
}

// ── HTML UI ───────────────────────────────────

function getHtmlContent() {
  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AvidKiya OS — Auto Deployer</title>
<link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Vazirmatn', sans-serif; background: #05070d; color: #e0e6f0; min-height: 100vh; }
  .glow { box-shadow: 0 0 60px rgba(93,122,230,0.15), 0 0 120px rgba(93,122,230,0.05); }
  .grad-btn { background: linear-gradient(135deg, #2141a8, #5d7ae6); }
  .grad-btn:hover { background: linear-gradient(135deg, #2a50c0, #6d8af0); }
  input { font-family: inherit; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-thumb { background: #2a3040; border-radius: 3px; }
  .hidden { display: none !important; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; }
  .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); padding: 12px 24px; border-radius: 12px; font-size: 14px; font-weight: bold; z-index: 200; animation: slideUp 0.3s ease; }
  @keyframes slideUp { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
</head>
<body class="flex items-center justify-center p-4">

<div class="w-full max-w-lg bg-[#0d1117] border border-[#1c2330] rounded-3xl p-8 relative overflow-hidden glow" style="box-shadow: 0 0 60px rgba(93,122,230,0.15);">
  <div style="position:absolute;top:-80px;right:-80px;width:200px;height:200px;background:rgba(93,122,230,0.1);border-radius:50%;filter:blur(60px);"></div>
  <div style="position:absolute;bottom:-60px;left:-60px;width:160px;height:160px;background:rgba(93,122,230,0.08);border-radius:50%;filter:blur(40px);"></div>

  <div style="text-align:center;margin-bottom:28px;position:relative;">
    <div style="display:inline-flex;width:64px;height:64px;align-items:center;justify-content:center;background:rgba(93,122,230,0.1);border:1px solid rgba(93,122,230,0.3);border-radius:16px;margin-bottom:16px;">
      <span style="font-size:28px;font-weight:900;background:linear-gradient(135deg,#5d7ae6,#6f93ec);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">AK</span>
    </div>
    <h1 style="font-size:24px;font-weight:900;margin-bottom:4px;">AvidKiya OS</h1>
    <p style="font-size:13px;color:#94a3b8;">نصب خودکار پرتفولیو روی Cloudflare</p>
    <p style="font-size:11px;color:#64748b;margin-top:4px;">v${CURRENT_VERSION}</p>
  </div>

  <div style="position:relative;display:flex;flex-direction:column;gap:12px;">
    <a href="https://dash.cloudflare.com/profile/api-tokens?permissionGroupKeys=%5B%7B%22key%22%3A%22pages%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22workers_scripts%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22workers_kv_storage%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22account_settings%22%2C%22type%22%3A%22read%22%7D%2C%7B%22key%22%3A%22workers_subdomain%22%2C%22type%22%3A%22edit%22%7D%5D&accountId=*&zoneId=all&name=AvidKiya-Deployer"
       target="_blank"
       style="display:block;text-align:center;padding:14px;border:1px solid rgba(251,146,60,0.4);color:#fb923c;background:rgba(251,146,60,0.08);font-weight:bold;border-radius:14px;font-size:14px;text-decoration:none;transition:background 0.2s;">
      📥 دریافت توکن Cloudflare
    </a>

    <div style="position:relative;">
      <input id="apiToken" type="password" placeholder="توکن Cloudflare API را وارد کنید"
             style="width:100%;padding:14px 48px 14px 16px;background:#0a0d13;border:1px solid #1c2330;border-radius:14px;font-size:14px;font-family:monospace;direction:ltr;color:#e0e6f0;outline:none;transition:border-color 0.2s;">
      <button onclick="toggleToken()" style="position:absolute;top:50%;right:12px;transform:translateY(-50%);background:none;border:none;color:#64748b;cursor:pointer;font-size:18px;">👁</button>
    </div>

    <input id="projectName" type="text" value="avidkiya-portfolio" placeholder="نام پروژه"
           style="width:100%;padding:14px 16px;background:#0a0d13;border:1px solid #1c2330;border-radius:14px;font-size:14px;color:#e0e6f0;outline:none;">

    <input id="adminToken" type="text" placeholder="ADMIN_TOKEN (خالی = خودکار تولید می‌شود)"
           style="width:100%;padding:14px 16px;background:#0a0d13;border:1px solid #1c2330;border-radius:14px;font-size:14px;font-family:monospace;direction:ltr;color:#e0e6f0;outline:none;">

    <button onclick="startDeploy()" id="deployBtn"
            style="width:100%;padding:16px;border:none;color:white;font-weight:900;border-radius:14px;font-size:16px;cursor:pointer;transition:all 0.2s;"
            class="grad-btn">
      🚀 شروع نصب خودکار
    </button>

    <button onclick="showManageModal()"
            style="width:100%;padding:14px;border:1px solid rgba(93,122,230,0.3);color:#6f93ec;background:rgba(93,122,230,0.06);font-weight:bold;border-radius:14px;font-size:14px;cursor:pointer;transition:all 0.2s;">
      ️ مدیریت نصب‌های موجود
    </button>

    <!-- Progress -->
    <div id="status" class="hidden" style="margin-top:8px;padding:16px;background:#0a0d13;border:1px solid #1c2330;border-radius:14px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <span id="statusText" style="font-size:13px;font-weight:bold;color:#e0e6f0;">شروع...</span>
        <span id="statusPct" style="font-size:13px;font-weight:900;color:#5d7ae6;">٪</span>
      </div>
      <div style="width:100%;height:6px;background:#1c2330;border-radius:3px;overflow:hidden;">
        <div id="progressBar" style="height:100%;background:linear-gradient(90deg,#2141a8,#5d7ae6);border-radius:3px;transition:width 0.5s ease;width:0%"></div>
      </div>
    </div>

    <!-- Result -->
    <div id="result" class="hidden" style="margin-top:8px;padding:16px;background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.3);border-radius:14px;font-size:13px;"></div>

    <!-- Error -->
    <div id="error" class="hidden" style="margin-top:8px;padding:16px;background:rgba(251,113,133,0.08);border:1px solid rgba(251,113,133,0.3);border-radius:14px;font-size:13px;color:#fb7185;"></div>
  </div>

  <!-- Footer -->
  <div style="margin-top:32px;padding-top:20px;border-top:1px solid #1c2330;text-align:center;font-size:11px;color:#64748b;">
    <div style="display:flex;justify-content:center;gap:16px;margin-bottom:8px;">
      <a href="https://github.com/avidkiya" target="_blank" style="color:#94a3b8;text-decoration:none;">GitHub</a>
      <a href="https://t.me/avidkiya" target="_blank" style="color:#94a3b8;text-decoration:none;">Telegram</a>
      <a href="https://buymeacoffee.com/avidkiya" target="_blank" style="color:#94a3b8;text-decoration:none;">Donate</a>
    </div>
    AvidKiya OS Deployer v${CURRENT_VERSION}
  </div>
</div>

<!-- Manage Modal -->
<div id="manageModal" class="modal-overlay hidden">
  <div style="width:90%;max-width:500px;background:#0d1117;border:1px solid #1c2330;border-radius:20px;padding:24px;max-height:80vh;overflow-y:auto;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
      <h2 style="font-size:18px;font-weight:900;">مدیریت نصب‌ها</h2>
      <button onclick="closeManageModal()" style="background:none;border:none;color:#94a3b8;font-size:20px;cursor:pointer;">✕</button>
    </div>
    <div id="manageContent">در حال بارگذاری...</div>
  </div>
</div>

<script>
function toPersianNum(n) {
  const persianDigits = ['۰','','۲','۳','۴','','۶','۷','۸','۹'];
  return String(n).replace(/\\d/g, d => persianDigits[parseInt(d)]);
}

function toggleToken() {
  const el = document.getElementById('apiToken');
  el.type = el.type === 'password' ? 'text' : 'password';
}

function setStatus(text, pct) {
  document.getElementById('status').classList.remove('hidden');
  document.getElementById('statusText').innerText = text;
  document.getElementById('statusPct').innerText = toPersianNum(pct) + '٪';
  document.getElementById('progressBar').style.width = pct + '%';
}

function showError(msg) {
  document.getElementById('error').classList.remove('hidden');
  document.getElementById('error').innerHTML = '⚠️ ' + msg;
  document.getElementById('result').classList.add('hidden');
}

function showSuccess(html) {
  document.getElementById('result').classList.remove('hidden');
  document.getElementById('result').innerHTML = html;
  document.getElementById('error').classList.add('hidden');
}

function showToast(msg, isError = false) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.style.background = isError ? 'rgba(251,113,133,0.9)' : 'rgba(52,211,153,0.9)';
  t.style.color = 'white';
  t.innerText = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function getToken() { return document.getElementById('apiToken').value.trim(); }

async function startDeploy() {
  const token = getToken();
  const projectName = document.getElementById('projectName').value.trim() || 'avidkiya-portfolio';
  const adminToken = document.getElementById('adminToken').value.trim();

  if (!token) { showError('توکن الزامی است'); return; }

  document.getElementById('result').classList.add('hidden');
  document.getElementById('error').classList.add('hidden');
  document.getElementById('deployBtn').disabled = true;
  document.getElementById('deployBtn').innerText = '⏳ در حال نصب...';
  document.getElementById('deployBtn').style.opacity = '0.6';

  try {
    // Verify
    setStatus('🔍 اعتبارسنجی توکن...', 10);
    const verify = await fetch('/api/verify-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }).then(r => r.json());
    if (!verify.ok) throw new Error(verify.error);

    setStatus('📦 ساخت KV namespace...', 30);
    await sleep(800);

    setStatus('🏗️ ساخت پروژه Pages...', 55);
    setStatus(' پیکربندی محیط و توکن...', 75);

    const res = await fetch('/api/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, projectName, adminToken }),
    }).then(r => r.json());

    if (!res.ok) throw new Error(res.error);

    setStatus('✅ نصب کامل شد!', 100);
    showSuccess(
      '<div style="font-weight:bold;color:#34d399;margin-bottom:8px;">✅ نصب با موفقیت انجام شد!</div>' +
      '<div style="margin-bottom:6px;"> <b>سایت:</b> <a href="' + res.url + '" target="_blank" style="color:#6f93ec;">' + res.url + '</a></div>' +
      '<div style="margin-bottom:6px;">🔑 <b>ADMIN_TOKEN:</b><br><code style="background:#0a0d13;padding:6px 10px;border-radius:8px;font-size:12px;display:block;margin-top:4px;word-break:break-all;">' + res.adminToken + '</code></div>' +
      (res.note ? '<div style="font-size:12px;color:#fbbf24;margin-top:8px;">️ ' + res.note + '</div>' : '')
    );
    showToast('نصب با موفقیت انجام شد');

  } catch (e) {
    showError(e.message);
    setStatus('❌ خطا', 0);
    showToast(e.message, true);
  } finally {
    document.getElementById('deployBtn').disabled = false;
    document.getElementById('deployBtn').innerText = '🚀 شروع نصب خودکار';
    document.getElementById('deployBtn').style.opacity = '1';
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function showManageModal() {
  const token = getToken();
  if (!token) { showError('ابتدا توکن را وارد کنید'); return; }
  document.getElementById('manageModal').classList.remove('hidden');
  loadDeployments(token);
}

function closeManageModal() {
  document.getElementById('manageModal').classList.add('hidden');
}

async function loadDeployments(token) {
  const el = document.getElementById('manageContent');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:#64748b;">در حال بارگذاری...</div>';

  const r = await fetch('/api/list-deployments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  }).then(x => x.json());

  if (!r.ok) { el.innerHTML = '<div style="color:#fb7185;">' + r.error + '</div>'; return; }

  if (!r.projects.length) {
    el.innerHTML = '<div style="text-align:center;padding:20px;color:#64748b;">هیچ پروژه‌ای پیدا نشد</div>';
    return;
  }

  el.innerHTML = r.projects.map(p =>
    '<div style="padding:12px;background:#0a0d13;border:1px solid #1c2330;border-radius:12px;margin-bottom:8px;">' +
      '<div style="font-weight:bold;margin-bottom:4px;">' + p.name + '</div>' +
      '<div style="font-size:12px;color:#64748b;margin-bottom:8px;">' + p.url + '</div>' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap;">' +
        '<button onclick="copyText(\\'' + p.url + '\\')" style="padding:6px 12px;background:rgba(93,122,230,0.1);border:1px solid rgba(93,122,230,0.2);border-radius:8px;color:#6f93ec;font-size:12px;cursor:pointer;">کپی URL</button>' +
        '<button onclick="updateDeploy(\\'' + p.name + '\\')" style="padding:6px 12px;background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.2);border-radius:8px;color:#34d399;font-size:12px;cursor:pointer;">آپدیت</button>' +
        '<button onclick="rotateToken(\\'' + p.name + '\\')" style="padding:6px 12px;background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.2);border-radius:8px;color:#fbbf24;font-size:12px;cursor:pointer;">تغییر توکن</button>' +
        '<button onclick="deleteDeploy(\\'' + p.name + '\\')" style="padding:6px 12px;background:rgba(251,113,133,0.1);border:1px solid rgba(251,113,133,0.2);border-radius:8px;color:#fb7185;font-size:12px;cursor:pointer;">حذف</button>' +
      '</div>' +
    '</div>'
  ).join('');
}

async function updateDeploy(name) {
  const token = getToken();
  showToast('در حال آپدیت...');
  const r = await fetch('/api/update-deployment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, projectName: name }),
  }).then(x => x.json());
  showToast(r.ok ? 'آپدیت شروع شد' : r.error, !r.ok);
  if (r.ok) loadDeployments(token);
}

async function deleteDeploy(name) {
  if (!confirm('حذف پروژه ' + name + '؟ این عمل قابل بازگشت نیست.')) return;
  const token = getToken();
  const r = await fetch('/api/delete-deployment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, projectName: name }),
  }).then(x => x.json());
  showToast(r.ok ? 'حذف شد' : r.error, !r.ok);
  if (r.ok) loadDeployments(token);
}

async function rotateToken(name) {
  const token = getToken();
  const r = await fetch('/api/rotate-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, projectName: name }),
  }).then(x => x.json());
  if (r.ok) {
    showToast('توکن جدید: ' + r.adminToken.substring(0, 8) + '...');
    // Show full token
    alert('توکن جدید ADMIN_TOKEN:\\n\\n' + r.adminToken + '\\n\\nاین توکن را ذخیره کنید.');
  } else {
    showToast(r.error, true);
  }
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => showToast('کپی شد'));
}

// Click outside modal to close
document.getElementById('manageModal').addEventListener('click', function(e) {
  if (e.target === this) closeManageModal();
});
</script>

</body>
</html>`;
}
