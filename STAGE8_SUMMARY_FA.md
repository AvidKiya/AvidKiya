# خلاصه مرحله ۸ — AI واقعی برای KIYA

تاریخ: 2026-07-07

## انجام شد

### AI provider helper

فایل جدید:

```text
src/lib/server/ai.ts
```

قابلیت‌ها:

- اتصال به OpenAI-compatible API
- پشتیبانی از `OPENAI_API_KEY`
- پشتیبانی از `OPENAI_BASE_URL`
- پشتیبانی از `OPENAI_MODEL`
- پشتیبانی اختیاری از Cloudflare Workers AI با `WORKERS_AI_MODEL`
- fallback امن اگر env تنظیم نشده باشد

### AI chat واقعی

فایل اصلاح‌شده:

```text
src/app/api/planner/ai/chat/route.ts
```

تغییرات:

- تاریخچه چت همچنان در storage ذخیره می‌شود.
- اگر AI env تنظیم شده باشد، پاسخ از provider واقعی می‌آید.
- اگر تنظیم نشده باشد، fallback rule-based کار می‌کند تا سایت خراب نشود.
- context واقعی از داده‌های Planner وارد prompt می‌شود:
  - tasks
  - goals
  - habits
  - notes
- system persona از CMS خوانده می‌شود:

```text
cms.planner.ai.systemPersona
```

- محدودیت پلن رایگان باقی مانده است: ۱۰ پیام در روز.

## envهای جدید

```env
OPENAI_API_KEY=
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini

WORKERS_AI_API_TOKEN=
WORKERS_AI_MODEL=@cf/meta/llama-3.1-8b-instruct
```

## تست

```bash
npm run typecheck
npm run build
npm run lint
```

نتیجه: موفق، بدون error.
