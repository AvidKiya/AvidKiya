# 🚀 AvidKiya — پلتفرم یکپارچه اَوید کیا

پلتفرم شخصی **اَوید کیا** — ترکیب پرتفولیو، کافی‌نت آنلاین (KIYA-NET) و KIYA Planner در یک سایت واحد با UI مشترک.

---

## ✨ ویژگی‌ها

### 🏠 پرتفولیو
- صفحه اصلی با معرفی دو خدمت اصلی: **کافی‌نت آنلاین** و **KIYA Planner**
- پروژه‌ها، رزومه، بلاگ، درباره من
- تقویم هخامنشی با نقل‌قول روزانه
- سیستم CMS کامل برای مدیریت محتوا

### ☕ کافی‌نت آنلاین (KIYA-NET)
- **۳۸+ خدمت کافی‌نتی** در ۷ دسته:
  - امور قضایی و حقوقی (ثنا، ابلاغیه، سوءپیشینه)
  - دانشگاه، مدرسه و آزمون‌ها (کنکور، انتخاب واحد)
  - مالیات، اصناف و کسب‌وکار (اظهارنامه، کد اقتصادی)
  - وام، امور بانکی و یارانه
  - خودرو و پلیس +۱۰
  - طراحی، گرافیک و چاپ
  - تامین اجتماعی و بیمه
- جستجوی زنده در خدمات
- آکاردئون دسته‌بندی‌ها
- نظرات مشتریان و FAQ
- تعرفه شفاف با زمان تحویل

### 🧠 KIYA Planner
- مغز دوم AI — مدیریت زندگی هوشمند
- وظایف، اهداف، عادات، دانش، مالی، سلامت
- دستیار AI داخلی
- تقویم هخامنشی
- سیستم لایسنس و ورود امن

### 🎨 UI مشترک (iPhone Liquid Glass)
- تم تاریک/روشن
- پشتیبانی RTL/LTR (فارسی/انگلیسی)
- فونت Vazirmatn
- طراحی شیشه‌ای (Glass Morphism)
- رنگ برند: Tiffany Green (#21F1A8) / Cyprus (#004741)
- کاملاً ریسپانسیو

---

## 🛠️ تکنولوژی‌ها

- **Next.js 15** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS 3**
- **Framer Motion** — انیمیشن
- **Lucide React** — آیکون‌ها
- **Zustand** — State Management
- **Cloudflare Pages** — Deployment

---

## 🚀 نصب و اجرا

```bash
# نصب وابستگی‌ها
npm install

# اجرای محیط توسعه
npm run dev

# بیلد production
npm run build

# اجرای production
npm start
```

---

## 📁 ساختار پروژه

```
app/
├── page.tsx              # صفحه اصلی (پرتفولیو + معرفی خدمات)
├── cafe/
│   ├── page.tsx          # کافی‌نت آنلاین
│   └── cafe-client.tsx   # کامپوننت کافی‌نت
├── planner/
│   ├── page.tsx          # صفحه KIYA Planner
│   ├── planner-landing-client.tsx
│   ├── login/            # ورود با لایسنس
│   └── app/              # اپلیکیشن پلنر
├── services/             # خدمات فریلنسری
├── projects/             # پروژه‌ها
├── shop/                 # فروشگاه
├── tools/                # ابزارهای آنلاین
├── about/                # درباره من
├── resume/               # رزومه
├── blog/                 # بلاگ
├── contact/              # تماس
└── kiya/panel/           # پنل مدیریت CMS

components/
├── layout/               # Header, Footer
├── ui/                   # Glass, Icons, ASCII Logo
├── home/                 # Menu Card
├── calendar/             # Calendar Widget
└── search/               # Command Palette

lib/
├── cafe-services.ts      # داده‌های خدمات کافی‌نت
├── cms/                  # سیستم CMS
├── calendar.ts           # تقویم هخامنشی
└── utils.ts              # ابزارها
```

---

## 🎯 خدمات اصلی

1. **کافی‌نت آنلاین** (`/cafe`) — ۳۸+ خدمت مجازی بدون مراجعه حضوری
2. **KIYA Planner** (`/planner`) — سیستم مدیریت زندگی هوشمند با AI

---

© ۲۵۸۵ اَوید کیا — تمامی حقوق محفوظ است.
