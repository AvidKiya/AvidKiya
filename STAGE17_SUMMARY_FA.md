# خلاصه مرحله ۱۷ — Push / A-B Dashboard / E2E scaffold

تاریخ: 2026-07-07

## انجام شد

### Push subscriptions API

فایل‌های جدید:

```text
src/app/api/push/subscriptions/route.ts
src/app/api/push/send/route.ts
```

قابلیت‌ها:

- ذخیره browser push subscription
- لیست subscriptionها برای ادمین
- queue کردن پیام push
- ساخت in-app notification برای کاربران دارای userId

### Push client prompt

فایل جدید:

```text
src/components/push-register.tsx
```

و اتصال در layout اصلی:

```text
src/app/layout.tsx
```

### Push admin panel

در پنل مخفی `/kiya/panel` بخش Push اضافه شد:

- مشاهده subscriptionها
- queue کردن notification

### A/B stats API

فایل جدید:

```text
src/app/api/experiments/stats/route.ts
```

قابلیت:

- summary experimentها
- conversionRate برای variantها
- لیست assignmentها و eventها

### Playwright E2E scaffold

فایل‌های جدید:

```text
playwright.config.ts
tests/e2e/smoke.spec.ts
```

script جدید:

```bash
npm run test:e2e
```

تست‌ها:

- public pages load
- health endpoint

## تست انجام‌شده

```bash
npm run typecheck
npm run build
npm run lint
npm run smoke
```

نتیجه: موفق، بدون error/warning.
