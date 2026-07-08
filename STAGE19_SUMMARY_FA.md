# خلاصه مرحله ۱۹ — Tenant / Tax / Deployer logs / Push gateway

تاریخ: 2026-07-07

## انجام شد

### Tenant / White-label پایه

فایل‌های جدید:

```text
src/lib/server/tenant.ts
src/app/api/tenant/route.ts
middleware.ts
```

قابلیت‌ها:

- resolve tenant بر اساس host
- ذخیره tenant config
- host mapping
- header tenant host در middleware

### Tax calculation API

فایل جدید:

```text
src/app/api/tax/calculate/route.ts
```

قابلیت‌ها:

- محاسبه مالیات بر اساس country
- IR VAT 9%
- DE VAT 19%
- EU fallback
- inclusive/exclusive tax

### Deployer logs/status

فایل اصلاح‌شده:

```text
src/app/api/deployer/route.ts
```

حالا deploy runها در storage ذخیره می‌شوند:

```text
deployer:run:{id}
```

### Push gateway integration

فایل اصلاح‌شده:

```text
src/app/api/push/send/route.ts
```

اگر `PUSH_GATEWAY_URL` تنظیم شود، payload به gateway خارجی ارسال می‌شود. اگر نباشد، همچنان پیام queue و in-app notification ساخته می‌شود.

## تست

```bash
npm run typecheck
npm run build
npm run lint
npm run smoke
```

نتیجه: موفق.
