# خلاصه مرحله ۱۸ — Marketplace / Deployer / RAG Search / A-B Dashboard

تاریخ: 2026-07-07

## انجام شد

### Marketplace

فایل جدید:

```text
src/app/marketplace/page.tsx
```

و لینک‌ها در Header و Command Palette اضافه شدند.

Marketplace محصولات، ابزارها و خدمات فعال CMS را یکجا نمایش می‌دهد.

### Deployer API

فایل جدید:

```text
src/app/api/deployer/route.ts
```

قابلیت‌ها:

- وضعیت deployer برای ادمین
- GitHub workflow_dispatch
- GitHub repository_dispatch

Envها:

```env
GITHUB_TOKEN=
GITHUB_REPO=owner/repo
GITHUB_WORKFLOW=deploy.yml
GITHUB_REF=main
GITHUB_DISPATCH_EVENT=deploy
```

### RAG-like Knowledge Search

فایل جدید:

```text
src/app/api/planner/knowledge/search/route.ts
```

قابلیت‌ها:

- جستجو در notes/tasks/goals/captures
- scoring ساده lexical
- خروجی top 25 نتیجه

### A/B Dashboard داخل Admin

در `/kiya/panel` بخش جدید A/B Tests اضافه شد.

قابلیت‌ها:

- خواندن `/api/experiments/stats`
- نمایش variantها
- conversion rate
- assignments/events/conversions

### Smoke test آپدیت شد

```text
scripts/smoke-test.mjs
```

حالا فایل‌های جدید را هم چک می‌کند.

## تست

```bash
npm run typecheck
npm run build
npm run lint
npm run smoke
```

نتیجه: موفق.
