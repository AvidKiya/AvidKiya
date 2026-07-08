# نسخه نهایی تحویلی AvidKiya

این نسخه شامل تمام پیاده‌سازی‌های اصلی سایت، KIYA Planner، فروشگاه، پنل مدیریت، AI، تلگرام، مارکت، extension، CLI و ابزارهای production است.

## تست نهایی قبل تحویل

```bash
npm install
npm run typecheck
npm run build
npm run lint
npm run smoke
```

## فایل‌های مهم راه‌اندازی

- `.env.production.example` — همه envهای production
- `DEPLOYMENT_FINAL_FA.md` — راهنمای دیپلوی
- `FINAL_CHECKLIST_ROADMAP_FA.md` — چک‌لیست کامل
- `FINAL_REMAINING_FA.md` — باقی‌مانده‌های enterprise/سرویس بیرونی
- `wrangler.toml` — تنظیم پایه Cloudflare
- `.github/workflows/ci.yml` — CI
- `.github/workflows/deploy.yml` — deploy workflow placeholder
- `docker-compose.enterprise.yml` — سرویس‌های optional مثل Qdrant/Postgres

## نکته مهم

کد قابلیت‌ها آماده است، اما production واقعی نیازمند تنظیم سرویس‌های بیرونی است:

- Cloudflare KV
- Payment/ZarinPal
- Resend
- AI provider
- Telegram token
- OAuth apps
- GitHub token
- Push gateway اختیاری

بدون این envها، پروژه در حالت fallback/dev کار می‌کند اما ذخیره‌سازی/پرداخت/ایمیل/AI واقعی production فعال نمی‌شود.
