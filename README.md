# اَوید کیا — AvidKiya Platform

پلتفرم شخصی اَوید کیا — DevHub OS + Liquid Glass

یک وبسایت واحد Next.js 15 شامل:

- 🏠 صفحه اصلی ساده (۶ کارت + تقویم هخامنشی + ساعت زنده)
- 📄 پرتفولیو (VS Code Style + GitHub API)
- 🧠 KIYA Planner (مغز دوم AI + لایسنس)
- 🛒 فروشگاه محصولات دیجیتال
- 💼 فریلنسرینگ
- 🔧 ابزارها
- 📝 بلاگ
- 📄 رزومه Print-optimized
- 🤖 ربات تلگرام منشی (Mini App)
- 🔐 پنل مدیر مخفی #kiya/panel

---

## فاز ۱ — تکمیل شد ✅

- [x] Next.js 15 + App Router + TypeScript
- [x] Tailwind CSS + Design System DevHub OS
- [x] Liquid Glass UI
- [x] تم تاریک (پیش‌فرض) + تم روشن
- [x] RTL فارسی + LTR انگلیسی — سوییچر یکپارچه
- [x] فونت Vazirmatn self-host
- [x] Layout اصلی + Header TabBar iOS-style + Footer ASCII
- [x] تقویم هخامنشی کامل:
  - شمسی / شاهنشاهی / یزدگردی
  - نام ۳۰ روز باستانی
  - جشن‌ها + سخن روز
  - ساعت زنده فارسی
  - تقویم ماه ۳۰ روزه
- [x] CMS System:
  - CmsState تایپ‌شده کامل
  - CmsProvider (React Context)
  - localStorage + Auto-save 800ms
  - Edit-in-place آماده
  - Export / Import JSON
  - API Route /api/cms (Edge + KV ready)
- [x] صفحه اصلی فلسفه ساده:
  - ASCII Art
  - Calendar Widget شیشه‌ای
  - ۶ کارت منو با stagger animation
  - سخن روز
  - ۳ لینک پایین
- [x] پنل مدیر اولیه (/kiya/panel — رمز: admin)
- [x] Error / Loading / Empty States
- [x] SEO base + not-found 404
- [x] PWA manifest
- [x] API health check

---

## اجرا

```bash
pnpm install   # یا npm install / yarn
pnpm dev
# http://localhost:3000
```

پنل مدیر:
```
http://localhost:3000/#kiya/panel
رمز: admin
# یا مستقیم:
http://localhost:3000/kiya/panel
```

---

## ساختار

```
app/
  layout.tsx          # Root + CmsProvider + Header/Footer
  page.tsx            # صفحه اصلی ساده — ۶ کارت
  not-found.tsx
  kiya/panel/         # پنل مدیر
  projects/ planner/ shop/ services/ tools/ ...
  api/cms/            # CMS API (Edge)
  api/health/
components/
  ui/glass.tsx        # GlassCard / Button / States
  layout/header.tsx   # TabBar iOS pill
  layout/footer.tsx
  calendar/           # تقویم هخامنشی
  home/menu-card.tsx
lib/
  calendar.ts         # الگوریتم کامل تقویم
  cms/
    types.ts
    default-state.ts
    cms-context.tsx
  utils.ts
public/
  fonts/Vazirmatn-*.woff2
  manifest.json
```

---

## فناوری

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- lucide-react
- Zustand (آماده)
- Cloudflare Pages + Functions + D1 + KV + R2

---

## فازهای بعدی

- **فاز ۲**: صفحه اصلی تکمیلی + پروژه‌ها VS Code + درباره + رزومه
- **فاز ۳**: KIYA Planner (لایسنس + داشبورد ۱۳ صفحه + AI + تلگرام)
- **فاز ۴**: فروشگاه + فریلنسرینگ + ابزارها + بلاگ + SEO کامل
- **فاز ۵**: پنل مدیر کامل ۱۸+ بخش + ربات تلگرام منشی
- **فاز ۶**: PWA + بهینه‌سازی + Deploy Cloudflare

---

© 2585 اَوید کیا — Avid Kiya
