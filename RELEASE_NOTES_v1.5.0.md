# AvidKiya v1.5.0

تاریخ انتشار: 2026-07-30

## پت Neko جدید

- پت گربه قبلی از layout حذف شد و با Neko pixel pet جایگزین شد.
- فایل ارسالی `neko-pet-subtle-3d.html` مبنا قرار گرفت.
- اسکریپت Neko به مسیر `public/neko-pet.js` منتقل شد.
- کامپوننت جدید `components/ui/neko-pet.tsx` ساخته شد.
- پت در کل سایت فعال است و ماوس را دنبال می‌کند.
- با کلیک روی پت، رفتار آن تغییر می‌کند و صدای میو ملایم پخش می‌شود.
- استایل 3D/subtle shadow برای پت داخل `globals.css` اضافه شد.
- نسخه قبلی `OrangeCatPet` دیگر در layout استفاده نمی‌شود.

## نکته لایسنس

Neko.js طبق توضیحات فایل ارسالی بر پایه پروژه Neko.js / Neko98 است و در خود فایل `public/neko-pet.js` کامنت لایسنس GPL-3.0 حفظ شده است.

## تست

Build پروژه با موفقیت انجام شد:

```bash
npm run build
```
