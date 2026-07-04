# AvidKiya OS — Portfolio & CMS

پرتفولیو شخصی حرفه‌ای با CMS هدلس و Auto-Deployer

## 🚀 راه‌اندازی

### نصب dependencies

```bash
cd avidkiya-portfolio
npm install
```

### توسعه محلی

```bash
npm run dev
```

### بیلد و دیپلوی روی Cloudflare Pages

```bash
npm run deploy
```

---

## 📁 ساختار پروژه

```
avidkiya-portfolio/
├── app/                    # Next.js pages
│   ├── page.tsx            # صفحه اصلی
│   ├── layout.tsx          # Layout اصلی
│   ├── globals.css         # استایل‌های جهانی
│   ├── projects/           # صفحه پروژه‌ها
│   ├── about/              # صفحه درباره من
│   ├── resume/             # رزومه (A4 print)
│   ├── gifts/              # هدایا
│   ├── announcements/      # اعلانات
│   ├── comments/           # نظرات
│   ├── shop/               # فروشگاه
│   └── admin/              # پنل مدیریت
│       ├── page.tsx        # پنل اصلی
│       └── login/          # صفحه ورود
├── components/             # کامپوننت‌ها
│   ├── layout/             # TopNav, Footer
│   └── ui/                 # Icons, PersianCalendar
├── contexts/               # CmsContext, AppProvider
├── lib/                    # schema, i18n, persian-calendar
├── functions/api/          # Cloudflare Functions (KV-backed API)
├── public/                 # assets, favicon
├── deployer.js             # Auto-Deployer Worker (مستقل)
├── wrangler.toml           # Cloudflare config
└── package.json
```

---

## 🔑 پنل ادمین

### دسترسی مخفی
برای ورود به پنل ادمین، در انتهای URL سایت این hash را اضافه کنید:
```
https://yoursite.pages.dev#kiya/panel
```

یا مستقیم:
```
https://yoursite.pages.dev/admin/login
```

### رمز پیش‌فرض
```
admin
```

⚠️ **بعد از اولین ورود، حتماً رمز را از بخش تنظیمات تغییر دهید.**

---

## 🛠️ Cloudflare Functions API

پروژه از **Cloudflare Pages Functions** با **KV** برای CMS استفاده می‌کند:

| Endpoint | Method | Auth | توضیح |
|---|---|---|---|
| `/api/cms` | GET | ❌ | دریافت CMS state |
| `/api/cms` | POST | ✅ | ذخیره CMS state |
| `/api/cms` | DELETE | ✅ | ریست CMS |
| `/api/messages` | POST | ❌ | ارسال پیام |
| `/api/messages` | GET | ✅ | لیست پیام‌ها |
| `/api/comments` | POST | ❌ | ثبت نظر |
| `/api/comments` | GET | ❌/✅ | نظرات (تایید شده / همه) |
| `/api/newsletter` | POST | ❌ | عضویت خبرنامه |

---

## 🚀 Auto-Deployer Worker

فایل `deployer.js` یک **Cloudflare Worker مستقل** است که:

1. توکن Cloudflare API از کاربر می‌گیرد
2. KV namespace می‌سازد
3. Pages project می‌سازد
4. ADMIN_TOKEN ست می‌کند
5. KV binding وصل می‌کند

### استقرار Deployer:

1. در Cloudflare Dashboard → Workers → Create Worker
2. محتوای `deployer.js` را Paste کنید
3. Save & Deploy
4. به URL Worker بروید و فرآیند نصب را طی کنید

---

## 🎨 قابلیت‌ها

- ✅ دو تم کامل (شب/روز)
- ✅ دو زبان (فارسی/انگلیسی) با RTL mirror کامل
- ✅ تقویم شمسی + هخامنشی + ساعت زنده
- ✅ CMS هدلس با auto-save
- ✅ GitHub API integration (نمایش خودکار ریپوها)
- ✅ پنل مدیریت ۱۴ بخشی
- ✅ رزومه A4 قابل چاپ
- ✅ فروشگاه با چند ارز
- ✅ سیستم نظرات با moderation
- ✅ اعلانات (متن، نظرسنجی، نقشه، عکس)
- ✅ موسیقی پس‌زمینه
- ✅ Analytics (Plausible + GA)
- ✅ SEO کامل
- ✅ Print CSS
- ✅ Responsive تا 320px

---

## 📝 نکات مهم

1. **فونت Vazirmatn**: باید در `public/fonts/` قرار گیرد (self-hosted)
2. **KV binding**: در `wrangler.toml` باید KV namespace ID را وارد کنید
3. **ADMIN_TOKEN**: به‌صورت Secret در Cloudflare Pages settings ست می‌شود
4. **GitHub API**: بدون rate limit برای public repos

---

Built with ❤️ by Avid Kiya
