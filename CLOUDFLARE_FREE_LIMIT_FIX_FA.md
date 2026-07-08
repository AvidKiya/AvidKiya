# رفع خطای Worker exceeded the size limit of 3 MiB

خطای Cloudflare:

```text
Your Worker exceeded the size limit of 3 MiB. Please upgrade to a paid plan to deploy Workers up to 10 MiB.
```

## علت

نسخه کامل پروژه تعداد زیادی API Route و Edge Function دارد. `@cloudflare/next-on-pages` همه آن‌ها را داخل `_worker.js` و modules مربوطه آماده می‌کند. در Cloudflare Free plan محدودیت Worker حدود 3 MiB است و این پروژه کامل از آن بزرگ‌تر می‌شود.

## رفع انجام‌شده برای Free plan

اسکریپت build مخصوص Free plan ساخته شد:

```bash
npm run pages:build
```

این اسکریپت:

1. `@cloudflare/next-on-pages` را اجرا می‌کند.
2. خروجی static را می‌سازد.
3. پوشه `_worker.js` را حذف می‌کند تا Cloudflare دیگر Function بزرگ را publish نکند.
4. سایت به صورت static assets روی Cloudflare Pages Free منتشر می‌شود.

## نکته مهم

در این حالت Free plan، API/SSR Functions غیرفعال می‌شوند. یعنی سایت و صفحات static deploy می‌شوند، ولی قابلیت‌هایی که به `/api/*` نیاز دارند فقط در نسخه full worker کار می‌کنند.

برای نسخه کامل با همه APIها، یکی از این دو راه لازم است:

- ارتقا به Workers Paid plan
- یا انتقال backend/APIها به Worker/سرور جداگانه

## تنظیم Cloudflare Pages برای Free plan

Build command:

```bash
npm run pages:build
```

Output directory:

```text
.vercel/output/static
```

## برای Paid plan / full dynamic

اگر Workers Paid plan داری:

```bash
npm run pages:build:full
```

و `wrangler.toml` با `nodejs_compat` برای full worker آماده است.
