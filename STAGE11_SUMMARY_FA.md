# خلاصه مرحله ۱۱ — Account Deletion / Referral / Admin Observability

تاریخ: 2026-07-07

## انجام شد

### حذف حساب واقعی

فایل جدید:

```text
src/app/api/planner/account/delete/route.ts
```

قابلیت‌ها:

- GET وضعیت درخواست حذف
- POST زمان‌بندی حذف با grace period سی روزه
- POST با `confirm: DELETE_NOW` برای hard delete داده‌های Planner
- DELETE برای لغو درخواست حذف
- حذف مجموعه‌های اصلی Planner از storage adapter

صفحه Settings هم به API وصل شد:

```text
src/app/planner/app/settings/page.tsx
```

### Referral tracking واقعی

فایل جدید:

```text
src/app/api/referrals/route.ts
```

قابلیت‌ها:

- تولید/خواندن کد ارجاع کاربر
- ذخیره کد ارجاع در storage
- اعمال کد ارجاع
- جلوگیری از استفاده از کد خود کاربر
- جلوگیری از استفاده چندباره
- ثبت rewardDays = 7

کامپوننت referral به API وصل شد:

```text
src/components/referral-banner.tsx
```

### Admin observability UI

در پنل مخفی اضافه شد:

```text
/kiya/panel
```

بخش‌های جدید:

- Analytics
- Errors

فایل اصلاح‌شده:

```text
src/app/kiya/panel/page.tsx
```

این دو بخش از APIهای زیر می‌خوانند:

```text
/api/analytics/event
/api/monitoring/error
```

### Backup codes برای 2FA

در پنل مدیر، بعد از فعال‌سازی 2FA می‌توان backup code ساخت. در login، کد backup هم مثل TOTP معتبر است و بعد از مصرف حذف می‌شود.

## تست

```bash
npm run typecheck
npm run build
npm run lint
```

نتیجه: typecheck/build/lint بدون error. فقط warningهای غیر بحرانی باقی مانده‌اند.
