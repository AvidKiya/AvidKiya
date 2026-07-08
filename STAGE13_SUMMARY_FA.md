# خلاصه مرحله ۱۳ — Offline Sync / Reports / Insights

تاریخ: 2026-07-07

## انجام شد

### Offline Sync Queue

فایل جدید:

```text
src/components/offline-sync.tsx
```

و اتصال در:

```text
src/app/layout.tsx
```

قابلیت‌ها:

- وقتی کاربر offline است، mutationهای `/api/planner/*` مثل POST/PUT/DELETE داخل localStorage queue می‌شوند.
- وقتی اینترنت برگردد، queue به API sync ارسال می‌شود.
- بنر وضعیت offline/sync پایین صفحه نمایش داده می‌شود.

API جدید:

```text
src/app/api/planner/sync/route.ts
```

### Planner Export API

فایل جدید:

```text
src/app/api/planner/export/route.ts
```

قابلیت:

- خروجی گرفتن از همه مجموعه‌های اصلی Planner:
  - tasks
  - habits
  - goals
  - finance
  - health
  - notes
  - calendar
  - projects
  - notifications
  - captures
  - aiChat

### Reports واقعی‌تر

فایل اصلاح‌شده:

```text
src/app/planner/app/reports/page.tsx
```

گزارش‌ها حالا از APIهای واقعی می‌خوانند:

- tasks
- habits
- health

### Insights واقعی‌تر

فایل اصلاح‌شده:

```text
src/app/planner/app/insights/page.tsx
```

Insightها حالا براساس داده‌های واقعی ساخته می‌شوند:

- task completion
- average energy
- habit momentum

## تست

```bash
npm run typecheck
npm run build
npm run lint
```

نتیجه: موفق، بدون error.
