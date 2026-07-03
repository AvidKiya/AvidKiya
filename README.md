# AvidKiya OS — GitHub-ready Cloudflare Pages Portfolio

پروژه‌ی کامل Next.js 15 / TypeScript / Tailwind برای پرتفولیوی هدلس «اوید کیا»، همراه با Cloudflare Pages Functions + KV و Worker مستقل `deployer.js`.

## سریع‌ترین روش استفاده

محتویات این پوشه را داخل root ریپوی GitHub که به Cloudflare Pages وصل است بریز و push کن.

Cloudflare Pages settings:

- Build command: `npm run build`
- Build output directory: `out`
- Node version: `20`

برای CMS/Admin:

- Env var: `ADMIN_TOKEN`
- KV binding name: `AVIDKIYA_KV`

جزئیات بیشتر در `DROP_IN_CLOUDFLARE.md`.

## امکانات

- صفحات: `/`, `/projects`, `/about`, `/resume`, `/gifts`, `/announcements`, `/comments`, `/shop`, `/admin`
- فارسی/انگلیسی + RTL/LTR mirror
- Dark/Light بدون flash
- فونت Vazirmatn self-hosted
- CMS Context با path update و autosave
- پنل ادمین ۱۴ بخشی
- Pages Functions در `functions/api/`
- Auto-Deployer Worker مستقل در `deployer.js`

## Local dev

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

خروجی در پوشه `out` ساخته می‌شود.
