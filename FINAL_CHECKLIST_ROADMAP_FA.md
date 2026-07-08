# چک‌لیست نهایی و رودمپ به‌روزشده AvidKiya

تاریخ آپدیت: 2026-07-07  
وضعیت سورس بررسی‌شده: `/home/user/project` بعد از Stage 16

---

## نتیجه تست نهایی

روی پروژه اجرا شد:

```bash
npm install
npm run typecheck
npm run build
npm run lint
npm run smoke
```

نتیجه:

- ✅ TypeScript: موفق
- ✅ Production build: موفق
- ✅ ESLint: موفق بدون warning/error
- ✅ Smoke test: موفق
- ✅ تعداد route/page/API شناسایی‌شده: 97 مسیر در سورس، 55 صفحه/route در build Next

---

## راهنمای وضعیت‌ها

| علامت | معنی |
|---|---|
| ✅ | پیاده‌سازی شده و build شده |
| 🟡 | پیاده شده، اما برای production نیازمند env/سرویس بیرونی/تنظیم است |
| 🟠 | نسخه پایه/MVP پیاده شده، نسخه enterprise یا خیلی پیشرفته باقی است |
| ❌ | پیاده نشده یا خارج از scope فعلی است |

---

# 1. خلاصه وضعیت کل پروژه

## هسته سایت

| بخش | وضعیت | شواهد |
|---|---:|---|
| Next.js App Router + TypeScript | ✅ | `src/app`, `npm run typecheck` موفق |
| طراحی Liquid Glass / Dark-Light / RTL-LTR | ✅ | `globals.css`, `GlassCard`, `Header`, `CmsProvider` |
| سایت خام بدون محتوای قبلی | ✅ | `src/lib/cms/default-state.ts` صفر/خام شده |
| هدر دسکتاپ + همبرگری فقط موبایل | ✅ | `src/components/layout/header.tsx` |
| جستجوی Cmd+K | ✅ | `src/components/search/command-palette.tsx` |
| PWA | ✅ | `public/manifest.json`, `public/sw.js`, `PwaRegister` |
| Security headers | ✅ | `next.config.ts` |
| Health check | ✅ | `/api/health` |
| Env doctor | ✅ | `scripts/env-doctor.mjs` |
| Smoke tests | ✅ | `scripts/smoke-test.mjs` |

## CMS و پنل مدیریت

| بخش | وضعیت | شواهد |
|---|---:|---|
| CMS schema | ✅ | `src/lib/cms/types.ts` |
| CMS default blank state | ✅ | `src/lib/cms/default-state.ts` |
| CMS sync local + API | ✅ | `src/lib/cms/cms-context.tsx`, `/api/cms` |
| Cloudflare KV-ready storage | 🟡 | `src/lib/server/kv-storage.ts`؛ نیازمند envهای KV |
| پنل مخفی | ✅ | `/kiya/panel` |
| تغییر رمز مدیر | ✅ | `/kiya/panel` Settings |
| 2FA TOTP | ✅ | `/kiya/panel` Settings |
| Backup codes | ✅ | `/kiya/panel` Settings |
| آپلود/فشرده‌سازی لوگو | ✅ | `/kiya/panel` Identity |
| مدیریت بلاگ، فروشگاه، پلن، کوپن، ایمیل، Lead Magnet | ✅ | `/kiya/panel` sections |
| پنل سفارش‌ها | ✅ | `/kiya/panel` Orders |
| Analytics/Errors log داخل پنل | ✅ | `/kiya/panel` Analytics / Errors |

## فروشگاه و درآمدزایی

| بخش | وضعیت | شواهد |
|---|---:|---|
| Shop page | ✅ | `/shop` |
| محصولات CMS-driven | ✅ | `cms.shop.products` |
| واحد تومان/TMN | ✅ | `shop-client`, invoice, checkout |
| Cart / Wishlist | ✅ | `/shop`, `/api/shop/wishlist` |
| Checkout | ✅ | `/api/shop/checkout` |
| زرین‌پال | 🟡 | کد آماده؛ نیازمند `ZARINPAL_MERCHANT_ID` |
| Payment link خارجی | 🟡 | کد آماده؛ نیازمند `PAYMENT_EXTERNAL_URL` |
| Verify payment | ✅ | `/api/shop/payment/verify` |
| Orders storage | 🟡 | `shop:order:*` در KV-ready storage |
| Orders admin API | ✅ | `/api/shop/orders` |
| Invoice HTML/PDF-ready | ✅ | `/api/shop/invoice`, `src/lib/invoice.ts` |
| Download بعد پرداخت | ✅ | `/api/shop/download` + `fileUrl` محصول |
| Coupons storage | ✅ | `src/lib/server/coupons.ts` |
| Coupon validate | ✅ | `/api/shop/validate-coupon` |
| Newsletter/Lead magnet | ✅ | `/api/email/newsletter`, `ExitPopup`, Blog newsletter |
| Email automation / Resend | 🟡 | کد آماده؛ نیازمند `RESEND_API_KEY` |
| Referral tracking | ✅ | `/api/referrals`, `ReferralBanner` |

## KIYA Planner

| بخش | وضعیت | شواهد |
|---|---:|---|
| Landing page | ✅ | `/planner` |
| Login با license | ✅ | `/planner/login`, `/api/planner/auth/validate` |
| OAuth Google/GitHub | 🟡 | کد آماده؛ نیازمند OAuth envها |
| License admin/storage | ✅ | `/api/planner/admin/licenses` |
| Planner app shell | ✅ | `/planner/app` |
| Tasks | ✅ | `/api/planner/tasks`, `/planner/app/tasks` |
| Habits + logs | ✅ | `/api/planner/habits`, `/planner/app/habits` |
| Goals | ✅ | `/api/planner/goals`, `/planner/app/goals` |
| Calendar events | ✅ | `/api/planner/calendar`, `/planner/app/calendar` |
| Notes/Knowledge | ✅ | `/api/planner/notes`, `/planner/app/knowledge` |
| Finance | ✅ | `/api/planner/finance`, `/planner/app/finance` |
| Health | ✅ | `/api/planner/health`, `/planner/app/health` |
| Notifications | ✅ | `/api/planner/notifications`, preferences API |
| Quick Capture | ✅ | `/api/planner/capture` |
| Import | ✅ | `/api/planner/import`, `/planner/app/import` |
| Export | ✅ | `/api/planner/export` |
| Offline sync | ✅ | `OfflineSync`, `/api/planner/sync` |
| Reports واقعی | ✅ | `/planner/app/reports` |
| Insights واقعی | ✅ | `/planner/app/insights` |
| Account deletion | ✅ | `/api/planner/account/delete`, Settings page |
| User segmentation | ✅ | `/api/planner/segments` |
| Notification preferences | ✅ | `/api/planner/notification-preferences` |

## AI / Telegram / ابزارهای جانبی

| بخش | وضعیت | شواهد |
|---|---:|---|
| AI fallback | ✅ | `/api/planner/ai/chat` |
| AI واقعی OpenAI-compatible | 🟡 | کد آماده؛ نیازمند `OPENAI_API_KEY` |
| Workers AI | 🟡 | کد آماده؛ نیازمند Workers AI env |
| Planner context در AI | ✅ | tasks/goals/habits/notes داخل prompt |
| Chat history storage | ✅ | `planner:{user}:aiChat` |
| Telegram Bot webhook | 🟡 | کد آماده؛ نیازمند `TELEGRAM_BOT_TOKEN` |
| Telegram license link | ✅ | `telegram:user:*` |
| Telegram commands | ✅ | start/link/tasks/goals/status/report/energy/mood/idea/help/capture |
| Telegram Mini App | ✅ | `/telegram/mini` |
| Browser Extension | ✅ | `extension/` |
| CLI | ✅ | `cli/kiya.mjs` |

## Growth / Observability / Professional details

| بخش | وضعیت | شواهد |
|---|---:|---|
| Analytics داخلی | ✅ | `/api/analytics/event`, `Analytics` component |
| Plausible/GA | 🟡 | کد آماده؛ نیازمند CMS config |
| Monitoring داخلی | ✅ | `/api/monitoring/error`, `ErrorBoundary` |
| Monitoring webhook | 🟡 | نیازمند `MONITORING_WEBHOOK_URL` |
| A/B Testing API | ✅ | `/api/experiments` |
| User segmentation | ✅ | `/api/planner/segments` |
| Notification strategy پایه | ✅ | `/api/planner/notification-preferences` |
| Browser extension | ✅ | `extension/` |
| CLI | ✅ | `cli/kiya.mjs` |
| Smoke tests | ✅ | `npm run smoke` |

---

# 2. چک‌لیست فایل‌به‌فایل 00 تا 28

| فایل | عنوان | وضعیت | توضیح کوتاه |
|---|---|---:|---|
| 00 | Implementation Guide | ✅ | تقریباً همه آیتم‌های اصلی ساخته شده‌اند؛ موارد enterprise در long-term مانده‌اند. |
| 01 | Project Overview | ✅ | همه مسیرهای اصلی سایت، KIYA، فروشگاه، خدمات، ابزارها، هدیه‌ها و پنل وجود دارند. |
| 02 | Tech Stack | ✅/🟡 | Next/TS/Tailwind/lucide/Framer/Recharts آماده؛ KV نیاز env دارد؛ React Flow جایگزین SVG داخلی شده. |
| 03 | Design System | ✅ | Liquid Glass، dark/light، RTL/LTR، header و tabbar انجام شده. |
| 04 | Persian Calendar | ✅/🟡 | تقویم و تبدیل‌ها انجام شده؛ quoteها CMS-driven شدند؛ دقت تاریخی پیشرفته long-term است. |
| 05 | CMS System | ✅/🟡 | CMS + import/export + logo upload + storage adapter؛ KV واقعی نیاز env دارد. |
| 06 | Homepage | ✅ | صفحه اصلی ساده و منومحور با تقویم و کارت‌ها پیاده شده. |
| 07 | Projects Page | ✅ | VS Code style + GitHub API + صفحه جزئیات پروژه. |
| 08 | About/Resume | ✅/🟡 | صفحات هستند؛ PDF رزومه server-side حرفه‌ای long-term است. |
| 09 | Public Pages | ✅ | Gifts, Announcements, Comments API, Contact API آماده. |
| 10 | Admin Panel | ✅ | پنل گسترده با 2FA، لوگو، CMS، سفارش‌ها، analytics/errors. |
| 11 | KIYA Architecture | ✅/🟡 | API-first و storage-ready؛ KV/D1 production نیاز env دارد. |
| 12 | KIYA Dashboard | ✅ | داشبورد و ماژول‌ها وجود دارند؛ reports/insights واقعی‌تر شدند. |
| 13 | KIYA AI Agent | ✅/🟡 | AI واقعی OpenAI/Workers آماده؛ RAG vector DB long-term است. |
| 14 | KIYA Telegram | ✅/🟡 | Bot production-ready؛ token/webhook env لازم است. |
| 15 | KIYA Admin | ✅ | licenses/plans/users/logs/AI/telegram و storage برای licenseها. |
| 16 | Shop | ✅/🟡 | checkout/payment/invoice/download/coupons/orders آماده؛ درگاه env لازم است. |
| 17 | Freelancing | ✅/🟡 | خدمات و فرم هست؛ CRM پیشرفته long-term است. |
| 18 | Tools | ✅/🟡 | ابزارها و دو ابزار اصلی؛ ابزارهای بیشتر قابل افزودن از CMS. |
| 19 | Deployment | ✅/🟡 | health/env doctor/wrangler/docs آماده؛ تنظیم Cloudflare لازم است. |
| 20 | Deployer Worker | 🟠 | wrangler/deploy docs آماده؛ worker deployer جداگانه کامل پیاده نشده. |
| 21 | What's Missing | ✅/🟡 | بیشتر موارد بسته شده؛ موارد enterprise در long-term. |
| 22 | Deep Analysis | ✅/🟡 | pricing/compare/referral/analytics انجام؛ marketplace/white-label long-term. |
| 23 | Hidden Gaps | ✅/🟡 | validation/rate-limit/invoice/delete/monitoring/docs انجام؛ legal tax رسمی long-term. |
| 24 | Final Requirements | ✅/🟡 | بیشتر A-G انجام؛ external services باید configure شوند. |
| 25 | Real Missing | ✅/🟠 | microcopy/a11y/perf/security/2FA/oauth/import/CLI/extension/segmentation انجام؛ native/vector DB long-term. |
| 26 | Homepage Philosophy | ✅ | پیاده شده. |
| 27 | Telegram Secretary | ✅/🟡 | bot + mini app + commands آماده؛ token/setup لازم است. |
| 28 | Mobile Ready | ✅/🟡 | PWA + Mini App + Offline sync؛ Native app long-term. |

---

# 3. دقیقاً چی هنوز مونده؟

## A) چیزهایی که کدش آماده است ولی env/سرویس بیرونی می‌خواهد

این‌ها «پیاده‌سازی شده‌اند» ولی تا env ندهی در production فعال کامل نمی‌شوند:

- [ ] Cloudflare KV production: `CF_ACCOUNT_ID`, `CF_API_TOKEN`, `CF_KV_NAMESPACE_ID`
- [ ] Payment: `ZARINPAL_MERCHANT_ID` یا `PAYMENT_EXTERNAL_URL`
- [ ] Email: `RESEND_API_KEY`, `EMAIL_FROM`
- [ ] AI: `OPENAI_API_KEY` یا Workers AI env
- [ ] Telegram: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`, سپس `/api/telegram/webhook?setup=1`
- [ ] OAuth Google/GitHub client id/secret و callback تنظیم در providerها
- [ ] Monitoring webhook اختیاری
- [ ] Plausible/GA از پنل CMS

## B) چیزهایی که نسخه پایه دارند ولی نسخه خیلی پیشرفته/enterprise باقی است

- [ ] React Flow یا force-directed graph حرفه‌ای؛ فعلاً SVG داخلی Graph داریم.
- [ ] Vector DB/RAG واقعی؛ فعلاً AI با planner context و Knowledge Graph کار می‌کند.
- [x] Push notification server-side پایه با subscription storage و admin queue؛ Web Push encryption/gateway واقعی long-term است.
- [x] E2E tests scaffold با Playwright و smoke spec.
- [ ] Marketplace کامل محصولات/افزونه‌ها؛ فروشگاه فعلی آماده فروش محصول دیجیتال است.
- [ ] Multi-tenant / White-label سازمانی.
- [ ] Native mobile app واقعی؛ فعلاً PWA + Telegram Mini App داریم.
- [ ] Deployer Worker جداگانه با GitHub deploy automation؛ فعلاً wrangler config/docs داریم.
- [ ] حسابداری/مالیات رسمی کشور به کشور؛ فاکتور HTML/PDF-ready داریم ولی سیستم مالیاتی رسمی نه.

## C) پولیش‌های اختیاری باقی‌مانده

- [ ] ترجمه 100٪ همه متن‌های قدیمی Planner/Admin به انگلیسی/فارسی با فایل microcopy واحد.
- [ ] بهینه‌سازی کامل UI همه صفحات internal planner.
- [ ] تبدیل همه imageها به Next Image یا policy نهایی image optimization.
- [x] A/B stats API پیاده شد؛ داشبورد گرافیکی کامل‌تر داخل admin long-term است.
- [ ] مستندات کاربری نهایی برای صاحب سایت و ادمین.

---

# 4. رودمپ پیشنهادی باقی‌مانده

## فاز نهایی قبل Deploy واقعی

1. تنظیم envها روی هاست.
2. اجرای `npm run env:doctor`.
3. ساخت KV namespace و تنظیم token.
4. تنظیم ZarinPal sandbox و تست پرداخت 1000 تومان.
5. تنظیم Resend و تست newsletter + invoice email.
6. تنظیم Telegram webhook.
7. تنظیم OAuth callbacks.
8. ورود به `/kiya/panel`، تغییر رمز، فعال‌سازی 2FA، ساخت backup codes.
9. ساخت محصول تست با `fileUrl`.
10. خرید تست، verify، invoice، download، email.

## فاز بعد از Deploy

- E2E test با Playwright
- مستندات user/admin
- داشبورد A/B/segmentation
- Push notification واقعی
- RAG vector DB در صورت نیاز

---

# 5. نتیجه نهایی

بله؛ مواردی که در پیام‌های قبلی گفتم را واقعاً در کد پیاده‌سازی کردم، نه فقط لیست کردم. الان پروژه build می‌شود، lint بدون warning است، smoke test پاس می‌شود، و فایل‌های مستندات/رودمپ هم به‌روز شده‌اند.
