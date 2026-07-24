# اَوید کیا — AvidKiya Portfolio

پرتفولیوی حرفه‌ای **اَوید کیا** با تمرکز روی نمونه‌کارها، خدمات فول‌استک، ابزارهای آنلاین و فروشگاه محصولات دیجیتال.

> کافی‌نت آنلاین و KIYA Planner از ناوبری و ساختار اصلی سایت جدا شده‌اند و حالا به‌صورت پروژه‌های مستقل در بخش نمونه‌کارها معرفی می‌شوند.

## بخش‌های اصلی

- **خانه** — معرفی حرفه‌ای، آمار، فرآیند کار و نمونه‌کارهای منتخب
- **نمونه‌کارها** — ویترین پروژه‌ها با تجربه شبیه VS Code و صفحات کیس‌استادی
- **خدمات** — توسعه Next.js، معماری Cloudflare/Edge، اتوماسیون AI و بازطراحی UI/UX
- **ابزارها** — JSON Formatter، Password Generator، Slug Builder، Text Cleaner و چک‌لیست تصویر
- **فروشگاه** — محصولات دیجیتال، جستجو، فیلتر، مرتب‌سازی، سبد خرید دمو و کوپن
- **رزومه** — صفحه قابل چاپ/PDF
- **تماس و بلاگ** — فرم همکاری و محتوای تخصصی

## پروژه‌های مستقل

- `KIYA Planner — Standalone Project`: پروژه پلنر/مغز دوم AI که از سایت شخصی جدا شده است.
- `KIANET — Standalone Project`: پروژه کافی‌نت آنلاین که برای توسعه مستقل آماده شده است.

مسیرهای معرفی:

- `/projects/kiya-planner-standalone`
- `/projects/kianet-standalone`

## تکنولوژی‌ها

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Cloudflare Pages / Workers-ready

## راه‌اندازی محلی

```bash
npm install
npm run dev
```

سپس سایت را در `http://localhost:3000` باز کنید.

## اسکریپت‌ها

```bash
npm run dev       # توسعه محلی
npm run build     # ساخت production
npm run start     # اجرای build
npm run lint      # lint
npm run deploy    # Cloudflare Pages deploy
```

## ساختار مهم

```text
app/
  page.tsx                 # صفحه اصلی پرتفولیو
  projects/                # لیست و کیس‌استادی پروژه‌ها
  services/                # خدمات حرفه‌ای
  tools/                   # ابزارهای آنلاین in-browser
  shop/                    # فروشگاه دیجیتال
  resume/                  # رزومه قابل چاپ
components/
  layout/                  # هدر، فوتر، جستجوی سریع
  ui/                      # کامپوننت‌های شیشه‌ای و آیکن‌ها
lib/cms/
  default-state.ts         # محتوای پیش‌فرض سایت
```

## یادداشت

این نسخه برای تمرکز بهتر برند شخصی بازطراحی شده و مسیرهای `/cafe` و `/planner` دیگر بخشی از سایت اصلی نیستند.
