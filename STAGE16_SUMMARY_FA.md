# خلاصه مرحله ۱۶ — A/B Testing / Segmentation / Notification Strategy

تاریخ: 2026-07-07

## انجام شد

### A/B Testing API

فایل جدید:

```text
src/app/api/experiments/route.ts
```

قابلیت‌ها:

- assignment پایدار variant برای visitorId
- variant انتخابی deterministic است
- ثبت conversion/event
- ذخیره در storage adapter

### User Segmentation API

فایل جدید:

```text
src/app/api/planner/segments/route.ts
```

قابلیت‌ها:

- دسته‌بندی کاربر بر اساس داده واقعی Planner
- segmentها مثل:
  - free / paid
  - new-user
  - starter
  - active
  - power-user
  - needs-focus
  - no-goals
  - ai-engaged

### Notification Preferences API

فایل جدید:

```text
src/app/api/planner/notification-preferences/route.ts
```

قابلیت‌ها:

- GET/PUT تنظیمات اعلان
- quiet hours
- channel preferences:
  - inApp
  - email
  - telegram
  - push

### سند باقی‌مانده‌ها

فایل جدید:

```text
FINAL_REMAINING_FA.md
```

در این فایل مشخص شده چه چیزهایی پیاده شده، چه چیزهایی فقط env می‌خواهد و چه چیزهایی long-term هستند.

## تست

```bash
npm run typecheck
npm run build
npm run lint
npm run smoke
```

نتیجه: موفق.
