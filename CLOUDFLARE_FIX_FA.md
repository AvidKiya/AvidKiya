# رفع خطاهای Cloudflare Pages build/publish

## خطای اول: ERESOLVE dependency tree

خطای گزارش‌شده:

```text
ERESOLVE unable to resolve dependency tree
@cloudflare/next-on-pages / wrangler / @cloudflare/workers-types
```

### رفع انجام‌شده

1. فایل `.npmrc` اضافه شد:

```ini
legacy-peer-deps=true
fund=false
audit=false
```

2. پکیج‌های Cloudflare در `package.json` pin شدند:

```json
"@cloudflare/next-on-pages": "1.13.16",
"wrangler": "3.114.14",
"@cloudflare/workers-types": "4.20240208.0"
```

3. اسکریپت Cloudflare Pages اضافه شد:

```json
"pages:build": "npx @cloudflare/next-on-pages@1"
```

پیشنهاد build command در Cloudflare:

```bash
npm run pages:build
```

---

## خطای دوم: Edge Runtime برای dynamic route

خطا:

```text
/projects/[repo] must export runtime = 'edge'
```

### رفع انجام‌شده

در فایل زیر:

```text
src/app/projects/[repo]/page.tsx
```

این خط اضافه شد:

```ts
export const runtime = 'edge';
```

---

## خطای سوم: No such module "node:stream"

خطا در مرحله publish:

```text
Error: Failed to publish your Function. Got error: Uncaught Error: No such module "node:stream".
```

### علت

خروجی Next/next-on-pages و بعضی dependencyهای runtime به polyfillهای Node نیاز دارند. Cloudflare Worker باید با compatibility flag مخصوص Node اجرا شود.

### رفع انجام‌شده

در `wrangler.toml` اضافه شد:

```toml
compatibility_flags = ["nodejs_compat"]
```

فایل نهایی `wrangler.toml`:

```toml
name = "avidkiya"
compatibility_date = "2026-07-07"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".vercel/output/static"

[vars]
NODE_VERSION = "22"
```

---

## تست انجام‌شده

```bash
npm install
npm run typecheck
npm run build
npm run lint
npm run smoke
npm run pages:build
```

نتیجه local build و next-on-pages build موفق بود.

نکته: چون `pages:build` پوشه `.vercel/` می‌سازد، در `eslint.config.mjs` مسیر `.vercel/**` به ignore اضافه شد تا lint بعد از build هم خطا ندهد.

> مرحله publish واقعی فقط داخل Cloudflare با همین `compatibility_flags` رفع می‌شود.

---

## تنظیم نهایی Cloudflare Pages

### Build command

```bash
npm run pages:build
```

### Output directory

```text
.vercel/output/static
```

### Node version

```text
22
```

اگر Cloudflare از `wrangler.toml` بخواند، output و NODE_VERSION را خودش تشخیص می‌دهد.
