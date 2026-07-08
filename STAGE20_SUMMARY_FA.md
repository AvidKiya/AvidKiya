# خلاصه مرحله ۲۰ — Vendor Marketplace / Native Shell / Vector & Enterprise polish

تاریخ: 2026-07-07

## انجام شد

### Vector-like RAG کامل‌تر

فایل‌های جدید/موجود:

```text
src/lib/server/vector.ts
src/app/api/planner/knowledge/vector/route.ts
src/app/api/planner/knowledge/search/route.ts
```

قابلیت:

- ساخت embedding سبک hash-based
- ذخیره vectorها در storage adapter
- search برداری cosine
- reindex با POST

### Marketplace vendors/payouts

فایل‌های جدید:

```text
src/app/api/marketplace/vendors/route.ts
src/app/api/marketplace/payouts/route.ts
```

قابلیت‌ها:

- ثبت vendor
- admin approve/suspend
- commissionRate
- payout records

### Native mobile shell

پوشه جدید:

```text
mobile/
```

فایل‌ها:

```text
mobile/package.json
mobile/capacitor.config.json
mobile/README.md
```

این یک Capacitor shell برای تبدیل PWA/وب‌اپ به native app است.

## تست

بعد از این مرحله هم باید اجرا شود:

```bash
npm run typecheck
npm run build
npm run lint
npm run smoke
```
