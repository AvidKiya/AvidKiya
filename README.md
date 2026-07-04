# AvidKiya OS — Portfolio Website

یک وب‌سایت پرتفولیو شخصی حرفه‌ای و کاملاً هدلس (headless CMS) با استایل DevHub OS.

## 🚀 شروع سریع

### روش ۱: استفاده از Deployer Worker (توصیه شده)

1. فایل `deployer.js` را در Cloudflare Workers deploy کنید
2. URL ورکر را باز کنید
3. توکن Cloudflare API بگیرید و وارد کنید
4. دکمه "شروع نصب" را بزنید

### روش ۲: Deploy دستی به Cloudflare Pages

1. این repository را fork کنید
2. در داشبورد Cloudflare → Pages → Create Project
3. Connect to Git → Repository خود را انتخاب کنید
4. Build settings:
   - Framework: Next.js
   - Build command: `npm run build`
   - Output directory: `.next`
5. Environment variables:
   - `ADMIN_TOKEN`: رمز عبور پنل ادمین (پیش‌فرض: `admin`)
6. KV namespace بسازید و bind کنید به `AVIDKIYA_KV`

## 📁 ساختار پروژه

```
├── src/
│   ├── app/                    # صفحات Next.js
│   │   ├── page.tsx           # صفحه اصلی
│   │   ├── projects/          # پروژه‌ها (VS Code style)
│   │   ├── about/             # درباره من (Command Center)
│   │   ├── resume/            # رزومه (قابل چاپ A4)
│   │   ├── gifts/             # هدیه‌ها (دونیت + دانلود)
│   │   ├── announcements/     # اعلانات
│   │   ├── comments/          # نظرات
│   │   ├── shop/              # فروشگاه
│   │   ├── admin/             # پنل مدیریت
│   │   └── api/               # API Routes
│   ├── components/            # کامپوننت‌ها
│   ├── contexts/              # React Context (AppContext)
│   └── lib/                   # کتابخانه‌ها (CMS, Calendar, etc.)
├── public/
│   ├── fonts/                 # فونت Vazirmatn
│   ├── favicon.svg
│   └── _routes.json
├── deployer.js                # Cloudflare Worker برای نصب خودکار
├── wrangler.toml              # تنظیمات Cloudflare
└── package.json
```

## 🎯 ویژگی‌ها

### صفحات
- **صفحه اصلی**: Hero + تقویم فارسی/هخامنشی + پروژه‌ها + آمار
- **پروژه‌ها**: UI مانند VS Code با اتصال به GitHub API
- **درباره**: Command Center سه ستونه با فرم تماس
- **رزومه**: قابل چاپ A4 با استایل print-optimized
- **هدیه‌ها**: دو ستون دونیت و دانلود
- **اعلانات**: News, Poll, Map, Image, Text
- **نظرات**: فرم ثبت نظر با moderation
- **فروشگاه**: محصولات دیجیتال

### پنل ادمین
دسترسی: `yoursite.com/#kiya/panel`

رمز پیش‌فرض: `admin` (بعد از ورود تغییر دهید)

۱۴ بخش مدیریت:
1. نمای کلی
2. هویت (+ آپلود لوگو)
3. شبکه‌های اجتماعی
4. صفحه اصلی
5. درباره من
6. پروژه‌ها
7. رزومه
8. هدیه‌ها
9. اعلانات
10. نظرات
11. فروشگاه
12. پیام‌ها
13. رسانه
14. تنظیمات

### قابلیت‌های فنی
- ✅ دو زبان کامل (فارسی/انگلیسی) با RTL
- ✅ دو تم (شب/روز)
- ✅ تقویم فارسی با سال هخامنشی
- ✅ اتصال زنده به GitHub API
- ✅ چاپ رزومه A4
- ✅ CMS هدلس با KV storage
- ✅ Anti-flash script برای تم و زبان
- ✅ Mobile responsive
- ✅ فونت Vazirmatn self-hosted

## 🎨 پالت رنگی

### تم شب (پیش‌فرض)
- پس‌زمینه: `#171717`
- Primary: `#5d7ae6`
- Accents: cyan, emerald, amber, rose, violet

### تم روز
- پس‌زمینه: `#ffffff`
- Primary: `#004741` (Cyprus green)

## 🔧 توسعه محلی

```bash
# نصب وابستگی‌ها
npm install

# اجرای development server
npm run dev

# Build
npm run build
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ADMIN_TOKEN` | رمز عبور پنل ادمین | بله |
| `AVIDKIYA_KV` | Cloudflare KV binding | برای Cloudflare |

## 🚀 Deployer Worker

فایل `deployer.js` یک Cloudflare Worker مستقل است که:

1. توکن Cloudflare API از کاربر می‌گیرد
2. KV namespace می‌سازد
3. Pages Project می‌سازد
4. ADMIN_TOKEN تصادفی ست می‌کند
5. Environment variables و KV binding را پیکربندی می‌کند

### نصب Deployer

1. به Cloudflare Dashboard → Workers & Pages بروید
2. Create Worker کلیک کنید
3. کد `deployer.js` را paste کنید
4. Save & Deploy

## 📄 License

MIT License

---

ساخته شده با ❤️ توسط [Avid Kia](https://github.com/avidkia)
