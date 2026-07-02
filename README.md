# AvidKiya OS — Portfolio

A full-stack, bilingual (فارسی / English), dark + light themed portfolio built
with **Next.js 15** and deployed on **Cloudflare Pages** with a **Cloudflare
Workers + KV** backend for the admin panel.

Everything on the site is **editable from a built-in CMS** — either through
the `/admin` panel or via inline ✎ pencils on the live pages.

---

## 🚀 Live features

| Route         | What                                                                                     |
|---------------|------------------------------------------------------------------------------------------|
| `/`           | Landing dashboard (Glass Workspace) — hero, feature cards, live stats                    |
| `/projects`   | IDE-style project explorer — pulls repos live from `github.com/<username>` + custom ones |
| `/about`      | Command Center — system-status sidebar, terminal welcome, GitHub heatmap, contact form   |
| `/admin`      | 8-section admin panel — identity, socials, landing, about, projects, messages, settings  |
| `/api/cms`    | Cloudflare Function → reads/writes site content in KV                                    |
| `/api/messages` | Cloudflare Function → contact-form inbox in KV                                          |

**Bilingual:** switching language flips the ENTIRE layout (RTL for فارسی, LTR
for English) — not just text. Cards, asides, sidebars, and menus all mirror.

**Dark / light theme:** design tokens live as CSS variables so the whole UI
retunes instantly.

**Language + theme switcher:** single dropdown on the top nav. In Persian the
menu opens on the right; in English on the left (as requested).

---

## 🗂 Project structure

```
app/                          Next.js App Router
  layout.tsx                  Wraps everything in AppProvider + CmsProvider
  page.tsx                    /  → Landing dashboard
  projects/page.tsx           /projects → IDE view
  about/page.tsx              /about → Command Center
  admin/page.tsx              /admin → Admin panel (password-protected)
components/
  layout/                     TopNav + Footer
  dashboard/                  Hero, ProjectGrid, StatsBar, Watermark, FAB
  projects/                   IdeShell, ProjectCard, CustomProjectModal
  about/                      CommandCenter (with ContactForm)
  admin/                      AdminPanel, LoginScreen, section editors
  cms/                        Editable (✎ pencil), EditableList, EditModeBar
  ui/                         LangThemeSwitcher
contexts/
  AppContext.tsx              Language + theme (localStorage-backed)
  CmsContext.tsx              Content state (localStorage + Cloudflare KV sync)
lib/
  cms/schema.ts               Every editable field on the site, typed
  cms/api.ts                  Fetch helpers → /api/cms + /api/messages
  github.ts                   GitHub REST helpers (repos, user)
  i18n.ts                     Static UI translation strings
  config.ts                   Fallback identity/socials (superseded by CMS)
functions/api/
  cms.ts                      Cloudflare Pages Function → KV read/write
  messages.ts                 Cloudflare Pages Function → contact inbox
public/
  favicon.svg
preview.html                  Static single-file preview of /  (dashboard)
preview-projects.html         Static single-file preview of /projects
preview-about.html            Static single-file preview of /about
preview-admin.html            Static single-file preview of /admin
wrangler.toml                 Cloudflare Pages config
tailwind.config.ts            Tailwind + design tokens
next.config.mjs
tsconfig.json
```

---

## 🖥 Local development

```bash
npm install
npm run dev            # http://localhost:3000
```

The site works fully offline in this mode — all CMS changes save to
`localStorage`. Log in to `/admin` with the temporary password:

```
avidkiya-2026
```

*(this is defined in `contexts/CmsContext.tsx` as a fallback for local dev)*

---

## ☁️ Deploy to Cloudflare Pages (step-by-step)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "AvidKiya portfolio — initial"
git branch -M main
git remote add origin https://github.com/avidkiya/avidkiya-portfolio.git
git push -u origin main
```

### 2. Create the KV namespace

Once, from your machine (needs `wrangler` — bundled as a dev dep):

```bash
npx wrangler login
npx wrangler kv:namespace create AVIDKIYA_KV
# → outputs: id = "abc123..."   (copy it)
```

Uncomment the `[[kv_namespaces]]` block in `wrangler.toml` and paste the ID —
useful for local `wrangler pages dev`, though it isn't required for production
(you'll bind it via the dashboard in step 4).

### 3. Connect Cloudflare Pages to your GitHub repo

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**
2. Pick `avidkiya-portfolio` and click **Begin setup**
3. Build settings:

   | Setting                | Value                                    |
   |------------------------|------------------------------------------|
   | Framework preset       | Next.js                                  |
   | Build command          | `npx @cloudflare/next-on-pages@1`        |
   | Build output directory | `.vercel/output/static`                  |
   | Node version           | `20`                                     |
   | Compatibility flag     | `nodejs_compat`                          |

4. **Save and Deploy.** The first build takes ~2 minutes.

### 4. Bind KV + set the admin token

In your new Pages project:

- **Settings → Functions → KV namespace bindings**
  - Variable name: `AVIDKIYA_KV`
  - KV namespace: pick the one you created in step 2
  - Save (both **Production** and **Preview** environments)

- **Settings → Environment variables → Production → Add variable**
  - Type: **Secret (encrypted)**
  - Variable name: `ADMIN_TOKEN`
  - Value: pick a strong random string (this is what you'll enter at `/admin`)
  - Save

- Trigger a redeploy (**Deployments → ⋯ → Retry deployment**) so the new
  bindings take effect.

### 5. Log in and edit

Visit `https://<your-project>.pages.dev/admin`, paste the `ADMIN_TOKEN`, and
you're in. Toggle **Edit mode** to see ✎ pencils on every page.

Any change auto-syncs to KV within ~1 second (there's a debounced push), and
every subsequent visitor to the site pulls the latest state from KV.

---

## 🔐 Making it your own

- Change the fallback identity in `lib/cms/schema.ts` (`defaultCmsState`) —
  those defaults are used before an admin has saved anything to KV.
- Change your GitHub username in the admin panel → Settings, or edit
  `siteConfig.githubUsername` in `lib/config.ts`.
- Optionally set `NEXT_PUBLIC_GITHUB_TOKEN` in Cloudflare Pages env vars to
  raise the 60 req/hr GitHub API limit.

---

## 🛠 Handy scripts

```bash
npm run dev              # Next.js dev server (localhost:3000)
npm run build            # production build
npm run pages:build      # convert build to Cloudflare Pages format
npm run preview          # run the Pages-format build locally via wrangler
npm run deploy           # publish current build to Cloudflare Pages
```

---

## ✨ Credits

- Design tokens & concept — three original CLIfolio mockups
- Icons — [Material Symbols](https://fonts.google.com/icons)
- Fonts — [Hanken Grotesk](https://fonts.google.com/specimen/Hanken+Grotesk),
  [Fira Sans](https://fonts.google.com/specimen/Fira+Sans),
  [Vazirmatn](https://fonts.google.com/specimen/Vazirmatn)
