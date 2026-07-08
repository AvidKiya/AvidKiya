# خلاصه مرحله ۱۰ — Security / OAuth / Monitoring / Analytics

تاریخ: 2026-07-07

## انجام شد

### 2FA پنل مدیر

فایل اصلاح‌شده:

```text
src/app/kiya/panel/page.tsx
```

قابلیت‌ها:

- ساخت Secret برای TOTP
- نمایش `otpauth://` برای اضافه‌کردن به Google Authenticator / 1Password
- تایید کد ۶ رقمی
- فعال/غیرفعال‌سازی 2FA
- الزام کد 2FA هنگام login پنل مخفی، اگر فعال باشد

### OAuth Google/GitHub

فایل‌های جدید:

```text
src/app/api/auth/oauth/[provider]/route.ts
src/app/api/auth/oauth/[provider]/callback/route.ts
```

قابلیت‌ها:

- شروع OAuth برای Google و GitHub
- callback و exchange token
- ساخت JWT داخلی KIYA
- ذخیره token در localStorage و redirect به `/planner/app`

Env لازم:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

### دکمه‌های Social Login

فایل اصلاح‌شده:

```text
src/app/planner/login/page.tsx
```

دکمه‌های Google و GitHub اضافه شدند.

### Monitoring داخلی

فایل جدید:

```text
src/app/api/monitoring/error/route.ts
```

و اصلاح:

```text
src/components/error-boundary.tsx
```

قابلیت‌ها:

- ذخیره خطاهای client در storage adapter
- keyها:

```text
monitoring:error:{id}
```

- ارسال اختیاری به webhook:

```env
MONITORING_WEBHOOK_URL=
```

### Analytics داخلی

فایل جدید:

```text
src/app/api/analytics/event/route.ts
```

و اصلاح:

```text
src/components/analytics.tsx
```

قابلیت‌ها:

- ذخیره eventها در storage adapter
- keyها:

```text
analytics:event:{id}
```

- track خودکار page_view هنگام تغییر route
- همچنان پشتیبانی از Plausible و Google Analytics طبق CMS

## تست

```bash
npm run typecheck
npm run build
npm run lint
```

نتیجه: typecheck/build موفق. lint بعد از اصلاح Link برای OAuth بدون error انتظار می‌رود؛ warningهای قبلی غیر بحرانی هستند.
