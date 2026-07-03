# راه‌اندازی سریع روی Cloudflare Pages وصل به GitHub

این نسخه برای این آماده شده که محتویات پوشه را مستقیم داخل root ریپوی GitHub بریزی و push کنی.

## تنظیمات Cloudflare Pages

اگر Pages شما قبلاً به GitHub وصل است، فقط مطمئن شو Build settings این‌ها هستند:

- Framework preset: `Next.js` یا `None`
- Build command: `npm run build`
- Build output directory: `out`
- Node version: `20`

فایل `wrangler.toml` هم همین output را مشخص کرده است:

```toml
pages_build_output_dir = "out"
```

## برای فعال شدن ادمین/CMS

در Cloudflare Pages → Settings این دو مورد را یک‌بار ست کن:

1. Environment variables:
   - `ADMIN_TOKEN` = یک رمز/توکن قوی برای ورود به `/admin`

2. Functions → KV namespace bindings:
   - Binding name: `AVIDKIYA_KV`
   - Namespace: یک KV namespace که بسازی یا قبلاً ساخته‌ای

بدون این دو مورد سایت بالا می‌آید، اما ذخیره CMS/پنل ادمین کامل فعال نمی‌شود.

## Deploy

بعد از کپی فایل‌ها در ریپو:

```bash
git add .
git commit -m "deploy avidkiya os"
git push
```

Cloudflare Pages به‌صورت خودکار build و deploy می‌کند.

## فایل deployer

`deployer.js` هم داخل پروژه هست. اگر خواستی نصب خودکار KV/Pages/env را با توکن Cloudflare انجام بدهی، آن را جداگانه در یک Worker paste و deploy کن.
