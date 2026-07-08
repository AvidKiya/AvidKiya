# خلاصه مرحله ۷ — Email / Newsletter / Coupon Production

تاریخ: 2026-07-07

## انجام شد

### Newsletter واقعی

- فایل: `src/app/api/email/newsletter/route.ts`
- ذخیره subscriberها در storage adapter با key:

```text
newsletter:subscriber:{email}
```

- پشتیبانی از JSON و FormData
- rate limit
- honeypot
- ارسال ایمیل خوش‌آمدگویی با Resend در صورت تنظیم `RESEND_API_KEY`

### اتصال Exit Popup به API

- فایل: `src/components/exit-popup.tsx`
- فرم exit popup حالا علاوه بر CMS، به `/api/email/newsletter` هم POST می‌کند.

### اتصال Newsletter بلاگ به API

- فایل: `src/app/blog/blog-client.tsx`
- فرم بلاگ حالا واقعاً subscribe می‌کند.

### Email Send واقعی

- فایل: `src/app/api/email/send/route.ts`
- ارسال قالب‌ها با Resend واقعی شد.
- پشتیبانی از custom `subject` + `html` برای ادمین اضافه شد.

### Email helper

- فایل: `src/lib/server/email.ts`
- helper مشترک برای Resend، ایمیل سفارش، لینک فاکتور و لینک دانلود.

### Coupon storage واقعی

- فایل‌ها:
  - `src/lib/server/coupons.ts`
  - `src/app/api/shop/coupons/route.ts`
  - `src/app/api/shop/validate-coupon/route.ts`
  - `src/app/api/admin/coupons/route.ts`

- کوپن‌ها با key زیر ذخیره می‌شوند:

```text
shop:coupon:{CODE}
```

- Validation کوپن از storage واقعی می‌خواند.
- پیام‌های API انگلیسی شدند.
- تخفیف fixed با تومان نمایش داده می‌شود.

## Env لازم

```env
RESEND_API_KEY=
EMAIL_FROM="AvidKiya <no-reply@your-domain.com>"
CF_ACCOUNT_ID=
CF_API_TOKEN=
CF_KV_NAMESPACE_ID=
```

## تست

```bash
npm run typecheck
npm run build
npm run lint
```

نتیجه: موفق، بدون error.
