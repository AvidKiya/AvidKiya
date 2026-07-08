# خلاصه مرحله ۱۴ — Telegram Mini App / Browser Extension / CLI / Smoke Tests

تاریخ: 2026-07-07

## انجام شد

### Telegram Mini App

فایل جدید:

```text
src/app/telegram/mini/page.tsx
```

قابلیت‌ها:

- صفحه سبک و موبایل‌محور برای Telegram Web App
- اتصال با license/JWT
- Quick Capture
- نمایش تعداد Tasks و Goals
- نمایش چند task باز

Webhook تلگرام هم آپدیت شد تا دستور `/mini` و لینک Mini App را نمایش دهد.

### Browser Extension

پوشه جدید:

```text
extension/
```

فایل‌ها:

```text
extension/manifest.json
extension/popup.html
extension/popup.js
extension/service-worker.js
```

قابلیت‌ها:

- popup برای وارد کردن API URL و JWT token
- Quick Capture از popup
- context menu برای ذخیره selected text در KIYA

### CLI Tool

فایل جدید:

```text
cli/kiya.mjs
```

دستورها:

```bash
kiya capture "text"
kiya tasks
kiya goals
kiya status
kiya chat "message"
```

Env لازم:

```env
KIYA_API_URL=https://your-domain.com
KIYA_TOKEN=jwt-token
```

`package.json` هم `bin` گرفت:

```json
"bin": { "kiya": "cli/kiya.mjs" }
```

### Smoke Test

فایل جدید:

```text
scripts/smoke-test.mjs
```

و script جدید:

```bash
npm run smoke
```

این تست وجود فایل‌ها و routeهای مهم را چک می‌کند.

## تست نهایی

```bash
npm run typecheck
npm run build
npm run lint
npm run smoke
```

نتیجه: همه موفق، بدون error. فقط warningهای غیر بحرانی lint باقی مانده‌اند.
