# راهنمای نهایی دیپلوی و تنظیم production

## 1. نصب و تست محلی

```bash
npm install
npm run typecheck
npm run build
npm run lint
npm run smoke
npm run env:doctor
```

## 2. envهای اصلی

حداقل برای اجرای امن:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
SITE_URL=https://your-domain.com
JWT_SECRET=یک مقدار طولانی و تصادفی
```

## 3. Storage پایدار Cloudflare KV

```env
CF_ACCOUNT_ID=
CF_API_TOKEN=
CF_KV_NAMESPACE_ID=
```

اگر این‌ها تنظیم نشوند، پروژه در local fallback کار می‌کند، اما production پایدار نیست.

## 4. پرداخت

زرین‌پال:

```env
ZARINPAL_MERCHANT_ID=
ZARINPAL_SANDBOX=false
```

یا لینک خارجی:

```env
PAYMENT_EXTERNAL_URL=https://payment-provider.example/pay
```

## 5. ایمیل

```env
RESEND_API_KEY=
EMAIL_FROM="AvidKiya <no-reply@your-domain.com>"
```

## 6. AI

OpenAI-compatible:

```env
OPENAI_API_KEY=
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini
```

Cloudflare Workers AI اختیاری:

```env
WORKERS_AI_API_TOKEN=
WORKERS_AI_MODEL=@cf/meta/llama-3.1-8b-instruct
```

## 7. Telegram

```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_WEBHOOK_SECRET=
```

بعد از deploy:

```text
https://your-domain.com/api/telegram/webhook?setup=1
```

## 8. OAuth

Google:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Callback:

```text
https://your-domain.com/api/auth/oauth/google/callback
```

GitHub:

```env
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

Callback:

```text
https://your-domain.com/api/auth/oauth/github/callback
```

## 9. Monitoring

```env
MONITORING_WEBHOOK_URL=
```

خطاهای کلاینت در storage ذخیره می‌شوند و اگر webhook باشد ارسال می‌شوند.

## 10. پنل مدیر

مسیر:

```text
/kiya/panel
```

رمز اولیه:

```text
admin
```

بعد از ورود:

- رمز را عوض کن
- 2FA را فعال کن
- Backup codes بساز
- لوگو، برند، محصولات، پلن‌ها، فایل دانلود محصول و درگاه را تنظیم کن

## 11. تست health

```text
/api/health
```

و از پنل:

```text
/kiya/panel → Analytics / Errors / Orders
```
