# رفع خطای Cloudflare Pages build

خطای گزارش‌شده:

```text
ERESOLVE unable to resolve dependency tree
@cloudflare/next-on-pages / wrangler / @cloudflare/workers-types
```

## علت

Cloudflare هنگام اجرای:

```bash
npx @cloudflare/next-on-pages@1
```

پکیج را موقت نصب می‌کرد و npm به خاطر conflict بین نسخه‌های `wrangler` و `@cloudflare/workers-types` fail می‌شد.

## رفع انجام‌شده

### 1. اضافه شدن `.npmrc`

```text
legacy-peer-deps=true
fund=false
audit=false
```

### 2. Pin کردن devDependencyهای Cloudflare

در `package.json` اضافه شد:

```json
"@cloudflare/next-on-pages": "1.13.16",
"wrangler": "3.114.14",
"@cloudflare/workers-types": "4.20240208.0"
```

### 3. اضافه شدن script build مخصوص Pages

```json
"pages:build": "npx @cloudflare/next-on-pages@1"
```

### 4. Edge runtime برای route داینامیک پروژه

فایل زیر اصلاح شد:

```text
src/app/projects/[repo]/page.tsx
```

و این خط اضافه شد:

```ts
export const runtime = 'edge';
```

چون `next-on-pages` همه routeهای non-static را Edge Runtime می‌خواهد.

## تست انجام‌شده

```bash
npm run pages:build
```

نتیجه: موفق.

خروجی مهم:

```text
Build completed
Generated '.vercel/output/static/_worker.js/index.js'
```

## تنظیم Cloudflare Pages

Build command:

```bash
npm run pages:build
```

Output directory طبق `wrangler.toml`:

```text
.vercel/output/static
```

یا اگر Cloudflare خودش wrangler.toml را بخواند، همین مقدار را تشخیص می‌دهد.
