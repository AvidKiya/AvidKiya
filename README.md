# AvidKiya OS — Portfolio + Headless CMS

پرتفولیو حرفه‌ای **اوید کیّا** — معمار سیستم / مهندس بک‌اند
استایل DevHub OS • Next.js 15 • Tailwind • Cloudflare Pages + KV

## ویژگی‌ها

- 🌗 تم شب/روز بدون flash (CSS variables)
- 🇮🇷🇬🇧 دو زبان کامل فارسی/انگلیسی با mirror layout RTL/LTR
- 🧭 هدر ثابت با تب‌بار iPhone pill animation در همه صفحات (دسکتاپ) — همبرگری فقط موبایل
- 🏠 صفحه اصلی: Hero glass + تقویم کامل شمسی/هخامنشی 3 بخشی (ساعت زنده • تاریخ امروز و مناسبت • تقویم ۳۰ روزه)
- 💻 /projects : VS Code IDE mock — پوشه src + **پوشه Github** با API زنده
- 👤 /about : Command Center 3 ستونه
- 📄 /resume : A4 print-optimized — دکمه چاپ رزومه همه‌جا به /resume می‌رود
- 🎁 /gifts • 📢 /announcements • 💬 /comments • 🛒 /shop
- 🔐 /admin : ورود مخفی با **#kiya/panel** → redirect به /admin — رمز پیش‌فرض **admin** — تغییر رمز بدون redeploy (KV override)
- ✎ Edit-in-place در همه صفحات
- 📦 CMS کامل روی Cloudflare KV
- 🎵 BgMusic • 3D hero object • Analytics • SEO editable
- 🚀 **deployer.js** — Worker مستقل Auto-Deployer

## نصب سریع

```bash
npm install
npm run dev
```

Build Cloudflare:
```bash
npm run build
# output: .vercel/output/static
```

Wrangler:
```bash
wrangler pages deploy .vercel/output/static --project-name=avidkiya-portfolio
```

KV:
- Binding: `AVIDKIYA_KV`
- Secret: `ADMIN_TOKEN=admin` (بعد ورود عوض کن)

## Auto-Deployer

فایل: `deployer.js` (هم در روت پروژه، هم `/deployer.js`)

1. در Cloudflare → Workers → Create Worker → Paste `deployer.js` → Deploy
2. URL Worker را باز کن
3. دکمه نارنجی «دریافت توکن Cloudflare» → دسترسی‌ها از قبل تیک خورده
4. توکن را Paste کن → «شروع نصب خودکار»
5. خروجی: `https://avidkiya-portfolio.pages.dev` + `ADMIN_TOKEN`

Deployer کارها:
- Account ID auto
- workers.dev subdomain check
- KV namespace `AVIDKIYA_KV` می‌سازد
- Pages Project می‌سازد
- ADMIN_TOKEN random ست می‌کند
- KV binding وصل می‌کند
- مدیریت: list / update / delete / rotate-token

## ساختار

```
app/
  page.tsx /projects /about /resume /gifts /announcements /comments /shop /admin
components/
  layout/TopNav, Footer, BackgroundLayers
  dashboard/Hero, ProjectGrid, StatsBar
  ui/Icon, Logo, PersianClock, ...
contexts/
  AppContext (lang/theme)
  CmsContext (KV sync, edit mode)
functions/api/
  cms, messages, comments, newsletter, verify, change-password, setup
```

## نکات پیاده‌سازی (باگ‌های رفع شده)

- ✅ منوی همبرگری فارسی از **راست** باز می‌شود (dir=rtl → right-0)
- ✅ تب‌بار در **همه صفحات** دسکتاپ وجود دارد، همبرگری فقط موبایل
- ✅ ورود ادمین بدون دکمه — `#kiya/panel` → /admin
- ✅ رمز پیش‌فرض `admin` + هشدار تغییر
- ✅ تقویم ۳ بخشی کامل (ساعت / امروز+مناسبت / گرید ۳۰ روزه)
- ✅ دکمه چاپ رزومه → `/resume` new tab
- ✅ پروژه‌ها: پوشه **Github** جدا + نمایش repo انتخابی + لینک GitHub
- ✅ تب هدر: pill متحرک نرم cubic-bezier iOS
- ✅ لوگو قابل آپلود base64 <300KB از پنل هویت

## لایسنس
MIT — AvidKiya OS
