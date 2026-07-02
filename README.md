# 🚀 Portfolio Website

یک وب‌سایت پورتفولیو با تم ترمینال/BIOS با پنل مدیریت کامل.

---

## ✨ ویژگی‌ها

- 🖥️ طراحی CRT Terminal / BIOS (مثل نسخه اصلی)
- 🌐 دو زبانه: **فارسی** و **انگلیسی** با سوییچ آسان
- ⚙️ **پنل مدیریت کامل** برای ویرایش همه اطلاعات
- ☁️ آماده **Cloudflare Pages** با دیپلوی خودکار از GitHub
- 📱 Responsive

## 📁 ساختار

```
portfolio/
├── src/
│   ├── app/           # Next.js App Router
│   ├── components/    # React Components
│   │   ├── sections/  # بخش‌های مختلف
│   │   ├── AdminPanel.tsx    # پنل مدیریت
│   │   ├── LoadingScreen.tsx # صفحه لودینگ BIOS
│   │   └── MainUI.tsx        # رابط اصلی
│   └── lib/           # توابع کمکی
├── .github/workflows/ # GitHub Actions
└── next.config.js
```

## 🚀 راه‌اندازی محلی

```bash
npm install
npm run dev
```

## ☁️ دیپلوی روی Cloudflare Pages

### روش اول: از طریق Git (خودکار)

1. ریپو را فورک کرده یا بر روی GitHub آپلود کنید
2. وارد [Cloudflare Pages](https://pages.cloudflare.com) شوید
3. **Create a project > Connect to Git**
4. ریپوی خود را انتخاب کنید
5. تنظیمات Build:
   - **Framework preset**: Next.js (Static HTML Export)
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
6. کلیک روی **Save and Deploy**

### روش دوم: GitHub Actions (خودکار با push)

1. در Cloudflare، یک **API Token** بسازید:
   - [داشبورد Cloudflare](https://dash.cloudflare.com/profile/api-tokens)
   - **Create Token > Custom Token**
   - Permission: `Cloudflare Pages > Edit`
2. **Account ID** خود را از داشبورد Cloudflare کپی کنید
3. در GitHub Repo، Settings > Secrets > Actions:
   - `CLOUDFLARE_API_TOKEN` = توکن API
   - `CLOUDFLARE_ACCOUNT_ID` = Account ID
4. هر push به `main/master` به صورت خودکار deploy می‌شود ✅

## ⚙️ پنل مدیریت

- از صفحه اصلی، دکمه **⚙** (گوشه بالا) را بزنید
- رمز پیش‌فرض: **`admin123`**
- از پنل می‌توانید:
  - اطلاعات شخصی (فارسی + انگلیسی)
  - تنظیمات BIOS
  - مهارت‌ها
  - پروژه‌ها
  - سابقه کاری
  - تحصیلات
  - اطلاعات تماس
  - تغییر رمز عبور

> **توجه**: اطلاعات در `localStorage` ذخیره می‌شوند. برای ذخیره دائمی، فایل `src/lib/data.ts` را مستقیم ویرایش کنید.
