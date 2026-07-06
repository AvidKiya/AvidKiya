# فاز ۱ — تحویل ✅

## انجام‌شده

### 1. پروژه Next.js 15
- App Router
- TypeScript strict
- Tailwind CSS 3.4
- Framer Motion / lucide-react / zustand / recharts
- Cloudflare Pages ready (wrangler.toml + opennext)

### 2. Design System — DevHub OS + Liquid Glass
- تم تاریک پیش‌فرض (#171717 / #5d7ae6)
- تم روشن (#ffffff / #004741)
- `glass-card` با backdrop-blur(20px) + border شیشه‌ای + highlight gradient
- انیمیشن‌ها: shimmer, scan, float
- فونت Vazirmatn self-host (۳ وزن — /public/fonts)
- RTL/LTR auto — anti-flash script در <head>
- ASCII Art همیشه LTR، isolate
- TabBar iOS-style با motion.layoutId

### 3. Layout اصلی
- `app/layout.tsx` — Metadata کامل، OpenGraph، SEO
- `Header` — TabBar pill شیشه‌ای + Language/Theme switcher + ⌘K
- `Footer` — فقط ASCII Art + © 2585
- background glow radial
- `not-found.tsx` — ۴۰۴ سفارشی

### 4. تقویم هخامنشی — کامل
`lib/calendar.ts`:
- gregorianToJalali (الگوریتم دقیق)
- jalaliToImperial (+1180)
- gregorianToYazdgerdi (-621)
- ANCIENT_DAYS ۳۰ روز
- جشن‌های ثابت + ماهانه
- QUOTES: کوروش (۱۵)، محمدرضا (۷)، رضا شاه (۵)
- getDailyQuote()
- toPersianDigits()
- getMonthCalendar()
- کامپوننت‌ها:
  - `LiveClock` — HH:MM:SS فارسی زنده
  - `CalendarWidget` — ۳ تقویم + جشن + سخن + گرید ۳۰ روزه

### 5. CMS System
- `lib/cms/types.ts` — CmsState کامل مطابق 05-CMS-SYSTEM.md
- `default-state.ts` — داده پیش‌فرض فارسی/انگلیسی
- `cms-context.tsx`:
  - React Context
  - lang / theme / editMode
  - Auto-save 800ms debounce → localStorage
  - Export / Import JSON
  - t() / tf() i18n helper
  - syncStatus: synced / syncing / offline / error
- API: `/api/cms` (Edge, KV-ready)
- `/api/health` — مانیتورینگ

### 6. صفحه اصلی — فلسفه ساده (26-HOMEPAGE-PHILOSOPHY.md)
- ASCII Logo بالا
- عنوان: اَوید کیا — معمار سیستم
- CalendarWidget وسط — نقطه جذب
- ۶ کارت منو:
  🧠 KIYA / 🛒 فروشگاه / 💼 خدمات / 🔧 ابزارها / 📄 پروژه‌ها / 💬 نظرات
- stagger animation (delay i*0.08)
- سخن امروز پایین
- لینک‌ها: درباره / رزومه / تماس / بلاگ
- بدون Hero بزرگ، بدون اسکرول طولانی

### 7. UI Kit
- GlassCard / GlassButton / Skeleton
- ErrorState / EmptyState
- MenuCard
- PagePlaceholder
- CommandPalette ⌘K — جستجوی سراسری

### 8. پنل مدیر — #kiya/panel
- مسیر: `/kiya/panel` + hash detect
- رمز پیش‌فرض: admin
- Edit Mode toggle
- ویرایش هویت (نام، عنوان، ایمیل، GitHub)
- Export / Import JSON
- Sync status pill
- لیست ۱۸+ بخش آینده
- Onboarding Checklist ادمین

### 9. صفحات پایه (placeholder آماده فازهای بعد)
- /projects — VS Code Style (فاز۲)
- /planner — KIYA Planner (فاز۳)
- /shop — فروشگاه (فاز۴)
- /services — فریلنسری (فاز۴)
- /tools — ابزارها (فاز۴)
- /comments, /about, /resume, /contact, /blog
- /terms, /privacy, /refund
- /pricing, /help, /support, /status, /changelog
- sitemap.ts + robots.ts

### 10. زیرساخت
- manifest.json — PWA ready
- SEO metadata کامل
- wrangler.toml — D1 + KV + R2 bindings
- .env.example
- README.md کامل

---

## مسیرها

```
/                  صفحه اصلی ساده
/projects          placeholder فاز۲
/planner           placeholder فاز۳
/shop              فاز۴
/services          فاز۴
/tools             فاز۴
/comments
/about
/resume
/contact
/blog
/terms /privacy /refund
/pricing /help /support /status /changelog
/kiya/panel        پنل مدیر — رمز: admin
/api/cms
/api/health
```

---

## دستور اجرا

```bash
cd avidkiya
npm install
npm run dev
# http://localhost:3000
# Admin: http://localhost:3000/kiya/panel
# یا: http://localhost:3000/#kiya/panel
```

---

## آماده فاز ۲

- صفحه اصلی ✅
- تقویم ✅
- CMS ✅
- Design System ✅

فاز ۲: صفحه پروژه‌ها VS Code Style + GitHub API + درباره Command Center + رزومه Print

—
© 2585 اَوید کیا
