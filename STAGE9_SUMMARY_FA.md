# خلاصه مرحله ۹ — Telegram Production

تاریخ: 2026-07-07

## انجام شد

### Telegram helper

فایل جدید/اصلاح‌شده:

```text
src/lib/server/telegram.ts
```

قابلیت‌ها:

- ارسال پیام واقعی با Bot API
- setup webhook با `setWebhook`
- پشتیبانی از `TELEGRAM_WEBHOOK_SECRET`
- fallback console برای محیط dev بدون token

### Webhook واقعی

فایل اصلاح‌شده:

```text
src/app/api/telegram/webhook/route.ts
```

قابلیت‌ها:

- بررسی secret token تلگرام
- rate limit
- `/start`
- `/link KIYA-XXXX-XXXX-XXXX`
- ذخیره لینک تلگرام به لایسنس:

```text
telegram:user:{telegramUserId}
```

- اعتبارسنجی لایسنس از storage واقعی:

```text
kiya:license-code:{CODE}
```

- `/tasks` خواندن taskهای واقعی کاربر
- `/goals` خواندن goalهای واقعی کاربر
- `/status` و `/report` بر اساس داده واقعی
- `/energy [1-10]` ذخیره در health logs
- `/mood good|ok|bad` ذخیره در health logs
- `/idea text` ذخیره در notes
- هر متن دیگر = quick capture در storage

### Webhook setup endpoint

برای تنظیم webhook:

```text
GET /api/telegram/webhook?setup=1
```

## env لازم

```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_WEBHOOK_SECRET=
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## تست

```bash
npm run typecheck
npm run build
npm run lint
```

نتیجه: موفق، بدون error.
