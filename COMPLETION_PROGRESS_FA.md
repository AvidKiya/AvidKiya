# گزارش تکمیل مرحله‌ای پروژه

تاریخ: 2026-07-07

این فایل برای ادامه‌دادن کار «یکی‌یکی و به ترتیب» ساخته شده است. هر مرحله که کامل می‌شود اینجا تیک می‌خورد.

---

## مرحله ۱ — اصلاحات پایه و موارد فوری

| تسک | وضعیت | فایل‌ها |
|---|---:|---|
| اتصال فروشگاه به checkout واقعی | ✅ | `src/app/api/shop/checkout/route.ts` |
| Verify زرین‌پال | ✅ | `src/app/api/shop/payment/verify/route.ts` |
| فاکتور بدون نیاز به لایسنس | ✅ | `src/app/api/shop/invoice/route.ts`, `src/lib/invoice.ts` |
| هدیه‌ها در هدر و جستجو | ✅ | `src/components/layout/header.tsx`, `src/components/search/command-palette.tsx`, `src/app/gifts/page.tsx` |
| واحد پول تومان در فروشگاه | ✅ | `src/app/shop/shop-client.tsx` |
| CSP برای زرین‌پال | ✅ | `next.config.ts` |
| فایل env نمونه | ✅ | `.env.example` |

---

## مرحله ۲ — تکمیل مواردی که در Audit زرد/قرمز بودند

| تسک | وضعیت | فایل‌ها | توضیح |
|---|---:|---|---|
| Quote تقویم از CMS | ✅ | `src/components/calendar/calendar-widget.tsx` | حالا quote از `cms.quotes` می‌آید و اگر خالی باشد empty message دارد. |
| Sync CMS با API | ✅/🟡 | `src/lib/cms/cms-context.tsx`, `src/app/api/cms/route.ts` | علاوه بر localStorage به `/api/cms` هم PUT می‌شود؛ برای production هنوز KV/D1 لازم است. |
| پیام‌های CMS API انگلیسی | ✅ | `src/app/api/cms/route.ts` | فارسی hard-coded اصلی این API حذف شد. |
| فشرده‌سازی لوگو قبل از ذخیره | ✅ | `src/app/kiya/panel/page.tsx` | لوگو max 512px و JPEG quality loop تا حدود 300KB. |
| صفحه جزئیات پروژه | ✅ | `src/app/projects/[repo]/page.tsx` | برای GitHub/custom project ساخته شد. |
| قیمت‌گذاری تومان و CMS-driven | ✅ | `src/app/pricing/page.tsx` | پلن‌ها از `cms.planner.plans` خوانده می‌شوند. |
| پنل پلن‌ها تومان به‌جای دلار | ✅ | `src/app/planner/admin/plans/page.tsx` | prompt و نمایش قیمت تومان شد. |
| خدمات تومان به‌جای دلار | ✅ | `src/app/services/services-client.tsx` | قیمت و budget به تومان تغییر کرد. |
| صفحه مقایسه دو زبانه | ✅ | `src/app/planner/compare/page.tsx` | متن‌های فارسی/انگلیسی از `t()` استفاده می‌کنند. |
| Security headers برای پرداخت | ✅ | `next.config.ts` | connect/form-action زرین‌پال اضافه شد. |

---

## مرحله ۳ — Storage آماده Production

| تسک | وضعیت | فایل‌ها | توضیح |
|---|---:|---|---|
| KV adapter | ✅ | `src/lib/server/kv-storage.ts` | با envهای Cloudflare KV کار می‌کند و برای dev fallback in-memory دارد. |
| CMS روی storage adapter | ✅ | `src/app/api/cms/route.ts` | state CMS با key `cms:state:v2` ذخیره می‌شود. |
| سفارش‌های فروشگاه روی storage adapter | ✅ | `src/app/api/shop/checkout/route.ts` | orderها با key `shop:order:*` ذخیره می‌شوند. |
| Verify پرداخت وضعیت سفارش را آپدیت می‌کند | ✅ | `src/app/api/shop/payment/verify/route.ts` | paid/failed/cancelled ثبت می‌شود. |
| API مدیریت سفارش‌ها | ✅ | `src/app/api/shop/orders/route.ts` | GET/PUT/DELETE برای ادمین. |
| پیام‌های تماس روی storage adapter | ✅ | `src/app/api/admin/messages/route.ts`, `src/app/contact/page.tsx` | فرم تماس علاوه بر CMS به API هم ارسال می‌کند. |
| Envهای KV | ✅ | `.env.example` | `CF_ACCOUNT_ID`, `CF_API_TOKEN`, `CF_KV_NAMESPACE_ID`. |
| Planner storage helper | ✅ | `src/lib/server/planner-store.ts` | helper مشترک برای user-scoped planner data. |
| APIهای اصلی Planner روی storage adapter | ✅ | `src/app/api/planner/{tasks,habits,goals,finance,health,notes,calendar,projects,notifications,capture}/route.ts` | دیگر به Map محلی وابسته نیستند. |
| AI chat history روی storage adapter | ✅ | `src/app/api/planner/ai/chat/route.ts` | تاریخچه چت با key کاربر ذخیره می‌شود. |
| License storage | ✅ | `src/app/api/planner/admin/licenses/route.ts`, `src/app/api/planner/auth/validate/route.ts` | لایسنس‌ها و index کدها در storage ذخیره و هنگام login اعتبارسنجی می‌شوند. |
| Comments API | ✅ | `src/app/api/comments/route.ts`, `src/app/comments/page.tsx` | ثبت/لیست/تایید/حذف کامنت روی storage adapter. |
| Orders UI in admin | ✅ | `src/app/kiya/panel/page.tsx` | بخش Orders به پنل اضافه شد و `/api/shop/orders` را می‌خواند. |

---

## تست‌های انجام‌شده بعد از مرحله ۳

```bash
npm run typecheck
npm run build
npm run lint
```

نتیجه:

- ✅ TypeScript موفق
- ✅ Build موفق
- ✅ Lint بدون error؛ فقط ۹ warning غیر بحرانی

Route جدید تاییدشده در build:

```text
/projects/[repo]
/api/shop/checkout
/api/shop/payment/verify
/api/shop/invoice
```

---

## مرحله‌های بعدی باقی‌مانده

### مرحله ۳ — Storage واقعی Production

- [x] ساخت storage adapter برای Cloudflare KV REST با fallback محلی
- [x] تبدیل CMS API از in-memory به KV-ready storage
- [x] ذخیره orderها و پرداخت‌ها در KV-ready storage
- [x] ذخیره پیام‌های تماس در KV-ready storage
- [x] API مدیریت سفارش‌ها: `/api/shop/orders`
- [x] تبدیل APIهای اصلی KIYA از Map/in-memory به KV-ready storage
  - tasks
  - habits + habit logs
  - goals
  - finance
  - health
  - notes
  - calendar
  - projects
  - notifications
  - quick capture
  - AI chat history
- [x] ذخیره کامنت‌ها در API/DB مستقل به‌جای فقط CMS
- [x] انتقال لایسنس‌های KIYA Admin از Map/in-memory به storage adapter
- [x] اعتبارسنجی لاگین KIYA با لایسنس‌های ذخیره‌شده
- [x] پنل مدیریت سفارش‌ها در `/kiya/panel`

### مرحله ۴ — تکمیل فروشگاه Production

- [x] ذخیره history سفارش‌ها
- [x] تحویل فایل محصول بعد از پرداخت verified/manual با `/api/shop/download`
- [x] فاکتور با GET بر اساس orderId در `/api/shop/invoice?orderId=...`
- [x] ایمیل فاکتور و لینک دانلود با Resend در صورت تنظیم `RESEND_API_KEY`
- [x] پنل مدیریت سفارش‌ها در `/kiya/panel` بخش Orders
- [x] وضعیت پرداخت: pending/manual/paid/failed/cancelled/refunded
- [x] فیلد Download file URL برای محصولات در پنل Shop

### مرحله ۵ — AI واقعی

- [x] اتصال Workers AI یا OpenAI-compatible API
- [x] ذخیره conversation history در storage adapter
- [x] تزریق context از tasks/goals/habits/notes داخل prompt
- [x] خواندن system persona از CMS
- [x] اعمال محدودیت پلن رایگان برای AI chat
- [x] Knowledge Graph API و UI پایه/پیشرفته
- [x] Import از Notion/Obsidian/Todoist/JSON

### مرحله ۶ — تلگرام Production

- [x] اتصال واقعی BotFather token از env
- [x] ثبت webhook production با `/api/telegram/webhook?setup=1`
- [x] ذخیره ارتباط Telegram user ↔ license در storage adapter
- [x] تکمیل commandهای اصلی: start/link/tasks/goals/status/report/energy/mood/idea/help/quick capture
- [ ] Telegram Mini App

### مرحله ۷ — امنیت حرفه‌ای

- [x] 2FA/TOTP برای پنل مدیر مخفی
- [x] OAuth Google/GitHub برای KIYA login
- [x] Backup codes برای 2FA
- [x] حذف حساب واقعی از storage با grace period و hard delete endpoint

### مرحله ۸ — Growth/Marketing / Offline / Reports

- [x] Offline sync queue برای mutationهای Planner
- [x] Planner export API واقعی
- [x] Reports بر اساس داده واقعی tasks/habits/health
- [x] Insights بر اساس داده واقعی tasks/habits/health

### مرحله ۸ — Growth/Marketing

- [x] Referral tracking واقعی
- [x] Lead magnet/newsletter email capture واقعی با storage adapter
- [x] Email automation با Resend برای newsletter و ارسال قالب‌ها
- [x] Coupon storage واقعی با storage adapter و validation API
- [x] Monitoring endpoint برای client errors با optional webhook
- [x] Analytics event tracking داخلی با storage adapter
- [ ] Sentry/UptimeRobot خارجی

---

### مرحله ۹ — ابزارهای جانبی / Mobile ecosystem

- [x] Telegram Mini App صفحه `/telegram/mini`
- [x] Browser Extension پایه برای Quick Capture
- [x] CLI Tool پایه برای capture/tasks/goals/status/chat
- [x] Smoke test خودکار

### مرحله ۱۰ — Production polish

- [x] Health check کامل‌تر برای وضعیت سرویس‌ها
- [x] Admin system status API
- [x] Env doctor script
- [x] Wrangler config
- [x] راهنمای نهایی دیپلوی
- [x] Lint بدون warning

### مرحله ۱۱ — Product optimization / segmentation

- [x] A/B testing API پایه
- [x] User segmentation API
- [x] Notification preferences API
- [x] سند نهایی باقی‌مانده‌ها `FINAL_REMAINING_FA.md`

## یادداشت مهم

پروژه اکنون buildable و بسیار نزدیک به production است. برای اجرای واقعی باید envهای Cloudflare KV، پرداخت، ایمیل، AI، OAuth و Telegram را روی هاست تنظیم کنید. اگر envهای KV تنظیم نشوند، storage adapter برای محیط توسعه fallback موقت دارد.
