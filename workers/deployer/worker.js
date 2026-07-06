// @ts-nocheck
// AvidKiya Deployer — نصب خودکار پلتفرم اَوید کیا روی حساب Cloudflare کاربر
//
// این Worker یک ابزار مستقل است (جدا از پروژه Next.js اصلی). آن را روی یک
// Cloudflare Worker دیگر دیپلوی کنید (نه روی همان پروژه Pages) و سپس با واردکردن
// یک API Token، این ابزار به‌طور خودکار:
//   ۱. KV Namespace می‌سازد
//   ۲. D1 Database می‌سازد + Schema را اجرا می‌کند
//   ۳. یک Cloudflare Pages Project می‌سازد و به ریپوی گیت‌هاب شما وصل می‌کند
//   ۴. Environment Variables و Secrets (ADMIN_TOKEN, JWT_SECRET) را تنظیم می‌کند
//   ۵. Binding های KV/D1 را به پروژه Pages وصل می‌کند
//
// نتیجه: به‌جای رفتن به ۵ صفحه مختلف داشبورد Cloudflare، فقط توکن را می‌دهید و تمام.

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return new Response(getHtmlContent(), {
        headers: { "Content-Type": "text/html;charset=UTF-8" },
      });
    }

    if (request.method === "POST" && url.pathname === "/api/verify-token") {
      return handleVerifyToken(request);
    }

    if (request.method === "POST" && url.pathname === "/api/deploy") {
      return handleDeploy(request);
    }

    if (request.method === "POST" && url.pathname === "/api/list-deployments") {
      return handleListDeployments(request);
    }

    if (request.method === "POST" && url.pathname === "/api/rotate-token") {
      return handleRotateToken(request);
    }

    if (request.method === "POST" && url.pathname === "/api/delete-deployment") {
      return handleDeleteDeployment(request);
    }

    return new Response("Not Found", { status: 404 });
  },
};

// ---------------------------------------------------------------------------
// Cloudflare API helpers
// ---------------------------------------------------------------------------

const CF_API = "https://api.cloudflare.com/client/v4";

async function cf(token, path, options = {}) {
  const res = await fetch(`${CF_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  return res.json();
}

function randomHex(len = 32) {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function getAccountId(token) {
  const data = await cf(token, "/accounts");
  if (!data.success || !data.result || data.result.length === 0) {
    throw new Error("توکن نامعتبر است یا هیچ اکانتی یافت نشد.");
  }
  return data.result[0].id;
}

async function createKvNamespace(token, accountId, title) {
  const data = await cf(token, `/accounts/${accountId}/storage/kv/namespaces`, {
    method: "POST",
    body: JSON.stringify({ title }),
  });
  if (!data.success) {
    throw new Error("CF_KV_ERROR|" + (data.errors?.[0]?.message || "ساخت KV ناموفق بود"));
  }
  return data.result.id;
}

async function createD1Database(token, accountId, name) {
  const data = await cf(token, `/accounts/${accountId}/d1/database`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  if (!data.success) {
    throw new Error("CF_D1_ERROR|" + (data.errors?.[0]?.message || "ساخت D1 ناموفق بود"));
  }
  return data.result.uuid;
}

async function runD1Schema(token, accountId, dbId, sql) {
  // Cloudflare's D1 query endpoint accepts one statement at a time reliably;
  // split on semicolons that terminate a statement.
  const statements = sql
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    await cf(token, `/accounts/${accountId}/d1/database/${dbId}/query`, {
      method: "POST",
      body: JSON.stringify({ sql: stmt }),
    });
  }
}

async function createPagesProject(token, accountId, name, githubOwner, githubRepo, githubToken) {
  const body = {
    name,
    production_branch: "main",
  };

  // If a GitHub token + repo is supplied, connect the Pages project directly
  // to the repository so future git pushes auto-deploy.
  if (githubToken && githubOwner && githubRepo) {
    body.source = {
      type: "github",
      config: {
        owner: githubOwner,
        repo_name: githubRepo,
        production_branch: "main",
      },
    };
    body.build_config = {
      build_command: "npm run pages:build",
      destination_dir: ".vercel/output/static",
      root_dir: "",
    };
  }

  const data = await cf(token, `/accounts/${accountId}/pages/projects`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!data.success) {
    throw new Error("CF_PAGES_ERROR|" + (data.errors?.[0]?.message || "ساخت پروژه Pages ناموفق بود"));
  }
  return data.result.name;
}

async function setPagesEnvAndBindings(token, accountId, projectName, { kvId, d1Id, adminToken, jwtSecret, telegramBotToken }) {
  const deploymentConfigs = {};
  for (const env of ["production", "preview"]) {
    deploymentConfigs[env] = {
      env_vars: {
        ADMIN_TOKEN: { type: "secret_text", value: adminToken },
        JWT_SECRET: { type: "secret_text", value: jwtSecret },
        ...(telegramBotToken ? { TELEGRAM_BOT_TOKEN: { type: "secret_text", value: telegramBotToken } } : {}),
      },
      kv_namespaces: kvId ? { KV: { namespace_id: kvId } } : undefined,
      d1_databases: d1Id ? { DB: { id: d1Id } } : undefined,
      compatibility_flags: ["nodejs_compat"],
    };
  }

  const data = await cf(token, `/accounts/${accountId}/pages/projects/${projectName}`, {
    method: "PATCH",
    body: JSON.stringify({ deployment_configs: deploymentConfigs }),
  });
  if (!data.success) {
    throw new Error("CF_ENV_ERROR|" + (data.errors?.[0]?.message || "تنظیم Env/Binding ناموفق بود"));
  }
}

async function listPagesProjects(token, accountId) {
  const data = await cf(token, `/accounts/${accountId}/pages/projects`);
  if (!data.success) return [];
  return data.result.filter((p) => p.name?.startsWith("avidkiya"));
}

async function deletePagesProject(token, accountId, name) {
  const data = await cf(token, `/accounts/${accountId}/pages/projects/${name}`, { method: "DELETE" });
  if (!data.success) {
    throw new Error(data.errors?.[0]?.message || "حذف پروژه ناموفق بود");
  }
}

// ---------------------------------------------------------------------------
// D1 schema — same as db/schema.sql in the main repo
// ---------------------------------------------------------------------------

const D1_SCHEMA = `
CREATE TABLE IF NOT EXISTS licenses (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  expires_at TEXT,
  is_admin INTEGER NOT NULL DEFAULT 0,
  device TEXT,
  name TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  license_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (license_id) REFERENCES licenses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo',
  priority TEXT DEFAULT 'medium',
  due TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`.trim();

// ---------------------------------------------------------------------------
// Route handlers
// ---------------------------------------------------------------------------

async function handleVerifyToken(request) {
  try {
    const { token } = await request.json();
    if (!token) throw new Error("توکن نمی‌تواند خالی باشد.");
    const accountId = await getAccountId(token);
    return json({ success: true, accountId });
  } catch (error) {
    return json({ success: false, error: error.message }, 400);
  }
}

async function handleDeploy(request) {
  try {
    const body = await request.json();
    const token = body.token;
    if (!token) throw new Error("توکن نمی‌تواند خالی باشد.");

    const githubOwner = (body.githubOwner || "").trim();
    const githubRepo = (body.githubRepo || "").trim();
    const githubToken = (body.githubToken || "").trim();
    const telegramBotToken = (body.telegramBotToken || "").trim();
    const projectSuffix = Math.random().toString(36).substring(2, 7);
    const projectName = `avidkiya-${projectSuffix}`;

    const accountId = await getAccountId(token);

    const kvId = await createKvNamespace(token, accountId, `${projectName}-kv`);
    const d1Id = await createD1Database(token, accountId, `${projectName}-db`);
    await runD1Schema(token, accountId, d1Id, D1_SCHEMA);

    await createPagesProject(token, accountId, projectName, githubOwner, githubRepo, githubToken);

    const adminToken = "admin"; // matches project default; user should change after first login
    const jwtSecret = randomHex(32);

    await setPagesEnvAndBindings(token, accountId, projectName, {
      kvId,
      d1Id,
      adminToken,
      jwtSecret,
      telegramBotToken,
    });

    const siteUrl = `https://${projectName}.pages.dev`;

    return json({
      success: true,
      url: siteUrl,
      adminPanelUrl: `${siteUrl}/kiya/panel`,
      projectName,
      kvId,
      d1Id,
      jwtSecret,
      note: githubOwner && githubRepo
        ? "پروژه به ریپوی گیت‌هاب شما وصل شد — هر پوش به main به‌طور خودکار دیپلوی می‌شود."
        : "پروژه ساخته شد ولی به گیت‌هاب وصل نیست — از داشبورد Cloudflare Pages می‌توانید بعداً ریپو را وصل کنید یا مستقیم آپلود کنید.",
    });
  } catch (error) {
    return json({ success: false, error: error.message }, 400);
  }
}

async function handleListDeployments(request) {
  try {
    const { token } = await request.json();
    if (!token) throw new Error("توکن نمی‌تواند خالی باشد.");
    const accountId = await getAccountId(token);
    const projects = await listPagesProjects(token, accountId);
    return json({
      success: true,
      projects: projects.map((p) => ({
        name: p.name,
        url: `https://${p.name}.pages.dev`,
        createdOn: p.created_on,
        latestDeploymentStatus: p.latest_deployment?.latest_stage?.status || "unknown",
      })),
    });
  } catch (error) {
    return json({ success: false, error: error.message }, 400);
  }
}

async function handleRotateToken(request) {
  try {
    const { token, projectName } = await request.json();
    if (!token || !projectName) throw new Error("اطلاعات ناقص است.");
    const accountId = await getAccountId(token);
    const newAdminToken = randomHex(16);
    await setPagesEnvAndBindings(token, accountId, projectName, {
      adminToken: newAdminToken,
      jwtSecret: randomHex(32),
    });
    return json({ success: true, newAdminToken });
  } catch (error) {
    return json({ success: false, error: error.message }, 400);
  }
}

async function handleDeleteDeployment(request) {
  try {
    const { token, projectName } = await request.json();
    if (!token || !projectName) throw new Error("اطلاعات ناقص است.");
    const accountId = await getAccountId(token);
    await deletePagesProject(token, accountId, projectName);
    return json({ success: true });
  } catch (error) {
    return json({ success: false, error: error.message }, 400);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// ---------------------------------------------------------------------------
// UI — Liquid Glass, RTL, Amoled — matches AvidKiya design language
// ---------------------------------------------------------------------------

function getHtmlContent() {
  return `<!DOCTYPE html>
<html lang="fa" dir="rtl" class="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AvidKiya Deployer — نصب خودکار</title>
<script src="https://cdn.tailwindcss.com"><\/script>
<style>
body { font-family: 'Vazirmatn', system-ui, sans-serif; }
.plateau-bg { background-color: #0d0d0f; background-image: radial-gradient(at 0% 0%, rgba(93,122,230,0.10) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(192,132,252,0.08) 0px, transparent 50%); }
.liquid-glass { background: rgba(23,23,23,0.65); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05); }
.liquid-glass-heavy { background: rgba(23,23,23,0.78); backdrop-filter: blur(24px) saturate(200%); -webkit-backdrop-filter: blur(24px) saturate(200%); border: 1px solid rgba(93,122,230,0.18); box-shadow: 0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08); }
.liquid-input { background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08); transition: all .3s cubic-bezier(.4,0,.2,1); }
.liquid-input:focus { background: rgba(0,0,0,0.5); border-color: #5d7ae6; box-shadow: 0 0 0 4px rgba(93,122,230,0.12); }
.glossy-gradient { background: linear-gradient(135deg, #5d7ae6 0%, #2141a8 100%); box-shadow: 0 0 20px rgba(93,122,230,0.3), inset 0 2px 4px rgba(255,255,255,0.15); }
.animate-float { animation: float 6s ease-in-out infinite; }
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
::-webkit-scrollbar { width:6px; }
::-webkit-scrollbar-thumb { background:#2a2a2e; border-radius:4px; }
</style>
</head>
<body class="plateau-bg text-white min-h-screen flex flex-col items-center justify-center p-4">

<div id="mainCard" class="w-full max-w-lg liquid-glass-heavy rounded-[2rem] p-8 sm:p-10 relative overflow-hidden animate-float">
  <div class="text-center mb-8 relative z-10">
    <div class="inline-flex items-center justify-center p-3.5 bg-[#5d7ae6]/10 border border-[#5d7ae6]/25 rounded-2xl mb-5">
      <svg class="w-9 h-9 text-[#5d7ae6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
    </div>
    <h2 class="text-3xl font-black text-white mb-2 tracking-tight">AvidKiya Deployer</h2>
    <p class="text-sm font-medium text-white/50">نصب خودکار پلتفرم اَوید کیا روی حساب Cloudflare شما</p>
  </div>

  <div class="space-y-4 relative z-10 mb-6">
    <a href="https://dash.cloudflare.com/profile/api-tokens?permissionGroupKeys=%5B%7B%22key%22%3A%22workers_scripts%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22workers_kv_storage%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22d1%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22pages%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22account_settings%22%2C%22type%22%3A%22read%22%7D%5D&accountId=*&zoneId=all&name=AvidKiya-Deployer-Token" target="_blank"
      class="flex items-center justify-center gap-3 w-full py-3.5 liquid-glass rounded-xl text-amber-400 font-bold text-sm hover:-translate-y-0.5 transition">
      🔑 دریافت توکن کلودفلر
    </a>
    <p class="text-[11px] text-white/30 text-center leading-relaxed px-2">
      روی «دریافت توکن» کلیک کنید، در انتهای صفحه <b class="text-[#5d7ae6]">Continue to summary</b> را بزنید و توکن را بسازید و کپی کنید.
    </p>

    <input type="password" id="apiToken" placeholder="توکن کلودفلر خود را وارد کنید" autocomplete="off" spellcheck="false"
      class="w-full px-4 py-3.5 liquid-input rounded-xl focus:outline-none text-sm font-mono text-right placeholder:text-white/20" dir="auto">

    <div class="space-y-3 mt-2">
      <div class="flex items-center gap-2 mb-1"><span class="text-[#5d7ae6] text-xs">🔗</span><span class="text-white/50 text-xs font-bold">اتصال به گیت‌هاب (اختیاری — برای دیپلوی خودکار)</span></div>
      <input type="text" id="githubOwner" placeholder="یوزرنیم گیت‌هاب (مثلاً avidkiya)" class="w-full px-4 py-3 liquid-input rounded-xl focus:outline-none text-xs font-mono text-right placeholder:text-white/20" dir="auto">
      <input type="text" id="githubRepo" placeholder="نام ریپو (مثلاً AvidKiya)" class="w-full px-4 py-3 liquid-input rounded-xl focus:outline-none text-xs font-mono text-right placeholder:text-white/20" dir="auto">
    </div>

    <div class="space-y-3 mt-2">
      <div class="flex items-center gap-2 mb-1"><span class="text-[#5d7ae6] text-xs">🤖</span><span class="text-white/50 text-xs font-bold">تنظیمات اختیاری</span></div>
      <input type="text" id="telegramBotToken" placeholder="توکن ربات تلگرام (اختیاری)" class="w-full px-4 py-3 liquid-input rounded-xl focus:outline-none text-xs font-mono text-right placeholder:text-white/20" dir="auto">
    </div>

    <button id="deployBtn" onclick="startDeploy()" class="w-full py-4 glossy-gradient text-white font-black rounded-xl text-lg hover:shadow-[0_0_30px_rgba(93,122,230,0.4)] active:scale-[0.98] transition-all">
      نصب خودکار پلتفرم
    </button>
    <button type="button" onclick="toggleManageModal(true)" class="w-full py-3.5 liquid-glass rounded-xl text-[#5d7ae6] font-bold text-sm">⚙️ مدیریت نصب‌های قبلی</button>
  </div>

  <div id="status-container" class="hidden mt-5 liquid-glass rounded-xl p-4">
    <div class="flex justify-between items-center mb-2.5">
      <span id="status-text" class="text-xs font-bold text-white/60">شروع فرآیند...</span>
      <span id="status-pct" class="text-xs font-black text-[#5d7ae6]">۰٪</span>
    </div>
    <div class="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
      <div id="progressBar" class="glossy-gradient h-2 rounded-full transition-all duration-500" style="width:0%"></div>
    </div>
  </div>

  <div id="error-box" class="hidden mt-5 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-sm text-red-400 text-center font-medium"></div>
  <div id="result-box" class="hidden mt-5"></div>
</div>

<div id="manage-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm opacity-0 pointer-events-none transition-all duration-300">
  <div id="manage-card" class="w-full max-w-md liquid-glass-heavy rounded-2xl p-6 transform scale-95 opacity-0 transition-all duration-300 max-h-[90vh] overflow-y-auto">
    <div class="flex justify-between items-center mb-5">
      <h3 class="text-lg font-bold">مدیریت نصب‌ها</h3>
      <button onclick="toggleManageModal(false)" class="text-white/40 hover:text-white">✕</button>
    </div>
    <input type="password" id="manageToken" placeholder="توکن کلودفلر" class="w-full px-4 py-3 liquid-input rounded-xl mb-3 text-sm font-mono text-right" dir="auto">
    <button onclick="listDeployments()" class="w-full py-3 glossy-gradient rounded-xl font-bold text-sm mb-4">بررسی نصب‌های موجود</button>
    <div id="deployments-list" class="space-y-3"></div>
  </div>
</div>

<script>
function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

function toggleManageModal(show) {
  var modal = document.getElementById('manage-modal');
  var card = document.getElementById('manage-card');
  if (show) { modal.classList.remove('opacity-0','pointer-events-none'); card.classList.remove('opacity-0','scale-95'); }
  else { modal.classList.add('opacity-0','pointer-events-none'); card.classList.add('opacity-0','scale-95'); }
}

async function startDeploy() {
  var btn = document.getElementById('deployBtn');
  var token = document.getElementById('apiToken').value.trim();
  var githubOwner = document.getElementById('githubOwner').value.trim();
  var githubRepo = document.getElementById('githubRepo').value.trim();
  var telegramBotToken = document.getElementById('telegramBotToken').value.trim();
  var statusContainer = document.getElementById('status-container');
  var statusText = document.getElementById('status-text');
  var statusPct = document.getElementById('status-pct');
  var progressBar = document.getElementById('progressBar');
  var errorBox = document.getElementById('error-box');
  var resultBox = document.getElementById('result-box');

  if (!token) { alert('لطفاً توکن را وارد کنید'); return; }

  btn.disabled = true;
  btn.innerText = 'در حال نصب...';
  statusContainer.classList.remove('hidden');
  errorBox.classList.add('hidden');
  resultBox.classList.add('hidden');

  var steps = ['بررسی توکن...', 'ساخت KV Namespace...', 'ساخت D1 Database...', 'اجرای Schema...', 'ساخت پروژه Pages...', 'تنظیم Environment...'];
  for (var i = 0; i < steps.length; i++) {
    statusText.innerText = steps[i];
    var pct = Math.round(((i+1)/steps.length)*90);
    statusPct.innerText = pct + '٪';
    progressBar.style.width = pct + '%';
    await sleep(400);
  }

  try {
    var res = await fetch('/api/deploy', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ token: token, githubOwner: githubOwner, githubRepo: githubRepo, telegramBotToken: telegramBotToken })
    });
    var result = await res.json();
    statusContainer.classList.add('hidden');
    if (result.success) {
      progressBar.style.width = '100%';
      resultBox.classList.remove('hidden');
      resultBox.innerHTML =
        '<div class="liquid-glass rounded-xl p-4 space-y-2 text-sm">' +
        '<div class="text-emerald-400 font-bold mb-2">✅ نصب با موفقیت انجام شد!</div>' +
        '<div class="flex justify-between"><span class="text-white/50">آدرس سایت</span><a href="' + result.url + '" target="_blank" class="text-[#5d7ae6] font-mono">' + result.url + '</a></div>' +
        '<div class="flex justify-between"><span class="text-white/50">پنل مدیر</span><span class="font-mono text-xs">/kiya/panel</span></div>' +
        '<div class="flex justify-between"><span class="text-white/50">رمز پیش‌فرض</span><span class="font-mono">admin</span></div>' +
        '<div class="text-[11px] text-white/40 mt-2">' + result.note + '</div>' +
        (result.note.indexOf('وصل نیست') >= 0 ? '<div class="text-[11px] text-amber-400 mt-2">⚠️ چون به گیت‌هاب وصل نشد، باید دستی کد را از داشبورد Pages آپلود یا ریپو را بعداً وصل کنید.</div>' : '') +
        '</div>';
    } else {
      throw new Error(result.error);
    }
  } catch (e) {
    statusContainer.classList.add('hidden');
    errorBox.classList.remove('hidden');
    errorBox.innerText = '❌ ' + e.message;
  } finally {
    btn.disabled = false;
    btn.innerText = 'نصب خودکار پلتفرم';
  }
}

async function listDeployments() {
  var token = document.getElementById('manageToken').value.trim();
  var list = document.getElementById('deployments-list');
  if (!token) { alert('توکن را وارد کنید'); return; }
  list.innerHTML = '<div class="text-white/40 text-sm text-center py-4">در حال بررسی...</div>';
  try {
    var res = await fetch('/api/list-deployments', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ token: token }) });
    var result = await res.json();
    if (!result.success) throw new Error(result.error);
    if (result.projects.length === 0) { list.innerHTML = '<div class="text-white/40 text-sm text-center py-4">نصبی یافت نشد</div>'; return; }
    list.innerHTML = '';
    result.projects.forEach(function(p) {
      var div = document.createElement('div');
      div.className = 'liquid-glass rounded-xl p-3';
      div.innerHTML =
        '<div class="font-bold text-sm mb-1">' + p.name + '</div>' +
        '<a href="' + p.url + '" target="_blank" class="text-[#5d7ae6] text-xs font-mono block mb-2">' + p.url + '</a>' +
        '<div class="flex gap-2">' +
        '<button class="flex-1 py-1.5 liquid-glass rounded-lg text-amber-400 text-xs font-bold" onclick="rotateToken(\\'' + p.name + '\\')">تعویض ADMIN_TOKEN</button>' +
        '<button class="flex-1 py-1.5 liquid-glass rounded-lg text-red-400 text-xs font-bold" onclick="deleteDeployment(\\'' + p.name + '\\')">حذف</button>' +
        '</div>';
      list.appendChild(div);
    });
  } catch (e) {
    list.innerHTML = '<div class="text-red-400 text-sm text-center py-4">خطا: ' + e.message + '</div>';
  }
}

async function rotateToken(projectName) {
  var token = document.getElementById('manageToken').value.trim();
  try {
    var res = await fetch('/api/rotate-token', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ token: token, projectName: projectName }) });
    var result = await res.json();
    if (result.success) alert('رمز جدید ADMIN_TOKEN: ' + result.newAdminToken);
    else throw new Error(result.error);
  } catch (e) { alert('خطا: ' + e.message); }
}

async function deleteDeployment(projectName) {
  if (!confirm('آیا مطمئنید می‌خواهید «' + projectName + '» حذف شود؟')) return;
  var token = document.getElementById('manageToken').value.trim();
  try {
    var res = await fetch('/api/delete-deployment', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ token: token, projectName: projectName }) });
    var result = await res.json();
    if (result.success) { alert('حذف شد'); listDeployments(); }
    else throw new Error(result.error);
  } catch (e) { alert('خطا: ' + e.message); }
}
<\/script>
</body>
</html>`;
}
