# پرتفولیو اوید کیا

سایت پرتفولیو دوزبانه (فارسی/انگلیسی)، دو تم (شب/روز)، با پنل مدیریت کامل که روی Cloudflare Pages اجرا میشه.

---

## ⚡ راه‌اندازی محلی

```bash
npm install
npm run dev
```

بعد برو به http://localhost:3000

**ورود به پنل مدیریت** (`/admin`):
- رمز محلی موقت: `avidkiya-2026`

---

## 🚀 آپلود روی گیت‌هاب

```bash
cd avidkiya-portfolio
git init
git add .
git commit -m "پرتفولیو اوید کیا"
git branch -M main
git remote add origin https://github.com/avidkiya/avidkiya-portfolio.git
git push -u origin main
```

---

## ☁️ اتصال به Cloudflare Pages

### مرحله ۱ — ساخت KV
از ترمینال:
```bash
npx wrangler login
npx wrangler kv:namespace create AVIDKIYA_KV
```
آی‌دی که برمی‌گرده رو کپی کن.

### مرحله ۲ — اتصال Pages به گیت‌هاب
1. برو به داشبورد Cloudflare
2. **Workers & Pages → Create → Pages → Connect to Git**
3. ریپوی `avidkiya-portfolio` رو انتخاب کن
4. تنظیمات build:
   - **Framework preset**: Next.js
   - **Build command**: `npx @cloudflare/next-on-pages@1`
   - **Build output directory**: `.vercel/output/static`
   - **Node version**: 20
   - **Compatibility flag**: `nodejs_compat`
5. **Save and Deploy**

### مرحله ۳ — اتصال KV و ADMIN_TOKEN
در همون پروژه Pages:

**Settings → Functions → KV namespace bindings**
- Variable name: `AVIDKIYA_KV`
- KV namespace: همون که ساختی

**Settings → Environment variables → Production → Add**
- Type: **Secret**
- Name: `ADMIN_TOKEN`
- Value: یک رمز قوی (مثلاً از `openssl rand -hex 32`)

بعد یه بار **Retry deployment** کن.

### مرحله ۴ — استفاده
- برو به `https://<your-project>.pages.dev/admin`
- ADMIN_TOKEN رو وارد کن
- روی **Edit mode** کلیک کن
- حالا در هر صفحه کنار هر متن یک مداد ✎ می‌بینی — کلیک کن و ادیت کن
- برای اضافه کردن پروژه/شبکه اجتماعی/لینک، از پنل `/admin` استفاده کن

هر تغییری خودکار روی KV ذخیره میشه و برای همه بازدیدکنندگان دیده میشه.

---

## 🎨 امکانات

- ✅ سه صفحه: داشبورد، پروژه‌ها (به سبک IDE)، مرکز فرماندهی About
- ✅ تغییر زبان فارسی/انگلیسی — کل چیدمان RTL/LTR mirror میشه (نه فقط متن)
- ✅ تم شب/روز
- ✅ اتصال زنده به گیت‌هاب برای نمایش خودکار ریپوها
- ✅ اضافه کردن دستی پروژه از پنل ادمین
- ✅ فرم تماس با inbox ذخیره در Cloudflare KV
- ✅ ادیت زنده هر متن، دکمه، عکس، لیست از خود سایت (مداد ✎)
- ✅ backup/restore با Export/Import JSON

## 📁 ساختار

```
app/            صفحات (Next.js App Router)
components/     UI کامپوننت‌ها
  admin/        پنل مدیریت + بخش‌های ادیتور
  cms/          سیستم edit-in-place (مداد، لیست، edit-mode-bar)
contexts/       AppContext (زبان/تم) + CmsContext (محتوا + sync)
lib/            i18n + github + cms/schema + cms/api
functions/api/  Cloudflare Worker Functions (KV backend)
```
